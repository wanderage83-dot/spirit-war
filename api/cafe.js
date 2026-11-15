// 글정회 찻집 shared room: presence, chat, bookshelf, tallies — stored in Upstash Redis.
const crypto = require('crypto');
const RURL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const RTOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PASS = process.env.CAFE_PASSWORD || '';
const NS = 'gj:';

async function redis(cmd) {
  const r = await fetch(RURL, { method: 'POST', headers: { Authorization: 'Bearer ' + RTOK, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const passOk = p => PASS && crypto.timingSafeEqual(sha(p), sha(PASS));
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, n);
const idOk = id => typeof id === 'string' && /^[a-z0-9]{8,32}$/.test(id);

const SYNC = `local now=tonumber(ARGV[1])
if ARGV[3]~='' then redis.call('HSET',KEYS[1],ARGV[2],ARGV[3]) end
local all=redis.call('HGETALL',KEYS[1])
local out={}
for i=1,#all,2 do
  local t=tonumber(string.match(all[i+1],'^{"_t":(%d+)')) or 0
  if now-t>25000 then redis.call('HDEL',KEYS[1],all[i]) else out[#out+1]=all[i+1] end
end
return {redis.call('GET',KEYS[2]) or '0', out, redis.call('HGETALL',KEYS[3])}`;
const DATA = `return {redis.call('GET',KEYS[1]) or '0', redis.call('LRANGE',KEYS[2],-100,-1), redis.call('LRANGE',KEYS[3],0,-1), redis.call('LRANGE',KEYS[4],-500,-1), redis.call('GET',KEYS[5]) or '', redis.call('HGET',KEYS[6],ARGV[1]) or ''}`;
const PUSH = `redis.call('RPUSH',KEYS[1],ARGV[1]) redis.call('LTRIM',KEYS[1],-tonumber(ARGV[2]),-1) return redis.call('INCR',KEYS[2])`;
const SETV = `redis.call('SET',KEYS[1],ARGV[1]) return redis.call('INCR',KEYS[2])`;

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET' && req.query && req.query.selftest) {
    const out = { store: !!(RURL && RTOK), password: !!PASS };
    try { const r = await redis(['EVAL', SYNC, '3', NS + 'pres', NS + 'ver', NS + 'counts', String(Date.now()), 'selftest00', '']); out.sync = Array.isArray(r) && r.length === 3 ? 'ok' : 'odd'; out.online = Array.isArray(r) ? r[1].length : 0; } catch (e) { out.sync = String(e.message).slice(0, 120); }
    try { const r = await redis(['EVAL', DATA, '6', NS + 'ver', NS + 'chat', NS + 'books', NS + 'quotes', NS + 'club', NS + 'wallet', 'none']); out.data = Array.isArray(r) && r.length === 6 ? 'ok' : 'odd'; } catch (e) { out.data = String(e.message).slice(0, 120); }
    return res.json(out);
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!RURL || !RTOK) return res.status(503).json({ error: 'no_store' });
  if (!PASS) return res.status(503).json({ error: 'no_password' });
  let b = req.body;
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch (e) { b = {}; } }
  b = b || {};
  if (!passOk(b.key || '')) return res.status(401).json({ error: 'bad_key' });
  const now = Date.now(), op = b.op;
  try {
    if (op === 'hello') return res.json({ ok: true, now });
    if (op === 'sync') {
      if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' });
      let st = '';
      if (b.st && typeof b.st === 'object') { st = JSON.stringify({ _t: now, ...b.st, id: b.id }); if (st.length > 2500) return res.status(413).json({ error: 'too_big' }); }
      const [ver, peers, counts] = await redis(['EVAL', SYNC, '3', NS + 'pres', NS + 'ver', NS + 'counts', String(now), b.id, st]);
      const c = {}; for (let i = 0; i < counts.length; i += 2) { try { c[counts[i]] = JSON.parse(counts[i + 1]); } catch (e) {} }
      return res.json({ now, ver: String(ver), peers: peers.map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean), counts: c });
    }
    if (op === 'leave') { if (idOk(b.id)) await redis(['HDEL', NS + 'pres', b.id]); return res.json({ ok: true }); }
    if (op === 'data') {
      const r = await redis(['EVAL', DATA, '6', NS + 'ver', NS + 'chat', NS + 'books', NS + 'quotes', NS + 'club', NS + 'wallet', idOk(b.id) ? b.id : 'none']);
      const P = a => a.map(s => { try { return JSON.parse(s); } catch (e) { return null; } }).filter(Boolean);
      const J = s => { try { return s ? JSON.parse(s) : null; } catch (e) { return null; } };
      return res.json({ ver: String(r[0]), chat: P(r[1]), books: P(r[2]), quotes: P(r[3]), club: J(r[4]), wallet: J(r[5]) });
    }
    const push = async (key, row, keep) => res.json({ ver: String(await redis(['EVAL', PUSH, '2', NS + key, NS + 'ver', JSON.stringify(row), String(keep)])), row });
    if (op === 'chat') return push('chat', { kind: ['say', 'tea', 'book'].includes(b.kind) ? b.kind : 'say', text: str(b.text, 200), nick: str(b.nick, 12), uid: idOk(b.id) ? b.id : '', ts: now }, 100);
    if (op === 'book') { const t = str(b.title, 60).trim(); if (!t) return res.status(400).json({ error: 'empty' }); return push('books', { id: 'b' + now.toString(36) + crypto.randomBytes(3).toString('hex'), title: t, author: str(b.author, 40), nick: str(b.nick, 12), ts: now }, 300); }
    if (op === 'quote') { const t = str(b.text, 300).trim(); if (!t || !b.bookId) return res.status(400).json({ error: 'empty' }); return push('quotes', { bookId: str(b.bookId, 40), text: t, page: str(b.page, 10), nick: str(b.nick, 12), ts: now }, 500); }
    if (op === 'club') { const v = { bookId: str(b.bookId, 40), nick: str(b.nick, 12), ts: now }; return res.json({ ver: String(await redis(['EVAL', SETV, '2', NS + 'club', NS + 'ver', JSON.stringify(v)])) }); }
    if (op === 'counts') { if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' }); await redis(['HSET', NS + 'counts', b.id, JSON.stringify({ day: str(b.day, 20), pages: Math.max(0, Math.min(99999, b.pages | 0)), cups: Math.max(0, Math.min(999, b.cups | 0)) })]); return res.json({ ok: true }); }
    if (op === 'wallet') { if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' }); await redis(['HSET', NS + 'wallet', b.id, JSON.stringify({ coins: Math.max(0, Math.min(99, b.coins | 0)), day: str(b.day, 20) })]); return res.json({ ok: true }); }
    return res.status(400).json({ error: 'bad_op' });
  } catch (e) {
    return res.status(500).json({ error: 'store_failed' });
  }
};
