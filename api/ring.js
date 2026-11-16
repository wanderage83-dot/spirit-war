// 두 사람의 링: presence(선수 2·관중 15), 경기 판정, 대화, 전적 — Upstash Redis(REST)에 저장한다.
const crypto = require('crypto');
const RURL = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const RTOK = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;
const PASS = process.env.RING_PASSWORD || '';
const NS = 'rg:';
const K = { pres: NS + 'pres', ver: NS + 'ver', counts: NS + 'counts', match: NS + 'match', results: NS + 'results', chat: NS + 'chat' };

async function redis(cmd) {
  const r = await fetch(RURL, { method: 'POST', headers: { Authorization: 'Bearer ' + RTOK, 'Content-Type': 'application/json' }, body: JSON.stringify(cmd) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
}
const sha = s => crypto.createHash('sha256').update(String(s)).digest();
const passOk = p => PASS && crypto.timingSafeEqual(sha(p), sha(PASS));
const str = (v, n) => String(v == null ? '' : v).replace(/[\u0000-\u001f]/g, ' ').slice(0, n);
const nickOk = v => str(v, 12).replace(/["\\|]/g, '').trim() || '손님';
const idOk = id => typeof id === 'string' && /^[a-z0-9]{8,32}$/.test(id);

// 공통: 경기 상태 갱신(카운트→경기, 시간 끝, 기권, 준비 해제, 둘 다 준비면 시작). live[id]=role.
const MATCH_FN = `
local function tick(now,live)
 local M=KEYS[4]
 local f=redis.call('HGETALL',M) local m={} for i=1,#f,2 do m[f[i]]=f[i+1] end
 local st=m.state or 'idle'
 local n=function(k) return tonumber(m[k] or '0') or 0 end
 local function over(win,how)
  local rhp,bhp=n('rhp'),n('bhp')
  redis.call('HSET',M,'state','over','win',win,'how',how,'t3',tostring(now),'rch','0','bch','0','rr','0','br','0')
  redis.call('RPUSH',KEYS[5],'{"rn":"'..(m.rn or '')..'","bn":"'..(m.bn or '')..'","win":"'..win..'","how":"'..how..'","rhp":'..rhp..',"bhp":'..bhp..',"ts":'..now..'}')
  redis.call('LTRIM',KEYS[5],-30,-1) redis.call('INCR',KEYS[2])
 end
 if st=='count' or st=='fight' then
  local rl=live[m.rid or '']=='red' local bl=live[m.bid or '']=='blue'
  if not rl or not bl then
   if rl then over('r','forfeit') elseif bl then over('b','forfeit') else over('d','forfeit') end
   return
  end
  if st=='count' and now>=n('t1') then redis.call('HSET',M,'state','fight') st='fight' end
  if st=='fight' and now>=n('t2') then
   local r,b=n('rhp'),n('bhp')
   if r>b then over('r','dec') elseif b>r then over('b','dec') else over('d','dec') end
  end
  return
 end
 local rr,br=m.rr=='1',m.br=='1'
 if rr and live[m.rid or '']~='red' then redis.call('HSET',M,'rr','0') rr=false end
 if br and live[m.bid or '']~='blue' then redis.call('HSET',M,'br','0') br=false end
 if rr and br then
  local t1=now+3500
  redis.call('HSET',M,'state','count','mid',tostring(now),'t1',tostring(t1),'t2',tostring(t1+90000),'rhp','100','bhp','100','rnx','0','bnx','0','rg','0','bg','0','rd','0','bd','0','rr','0','br','0','win','','how','','ev','','rhit','0','bhit','0')
 end
end`;

const SYNC = `${MATCH_FN}
local now=tonumber(ARGV[1]) local id=ARGV[2] local st=ARGV[3]
local P=KEYS[1]
local all=redis.call('HGETALL',P)
local live={}
for i=1,#all,2 do
 local t=tonumber(string.match(all[i+1],'^{"_t":(%d+)')) or 0
 if now-t>25000 then redis.call('HDEL',P,all[i]) else live[all[i]]=string.match(all[i+1],'"role":"(%a+)"') or '' end
end
local ok=1
if st~='' then
 local role=string.match(st,'"role":"(%a+)"') or ''
 if role~='' and role~=live[id] then
  local c=0 for k,r in pairs(live) do if k~=id and r==role then c=c+1 end end
  if c>=((role=='gal') and 15 or 1) then ok=0 end
 end
 if ok==1 then redis.call('HSET',P,id,st) live[id]=role end
end
tick(now,live)
return {redis.call('GET',KEYS[2]) or '0', redis.call('HVALS',P), redis.call('HGETALL',KEYS[3]), redis.call('HGETALL',KEYS[4]), ok}`;

// 준비 토글: 지금 홍/청 자리를 쥔 사람만.
const READY = `${MATCH_FN}
local now=tonumber(ARGV[1]) local id=ARGV[2] local want=ARGV[3] local nick=ARGV[4]
local P=KEYS[1]
local all=redis.call('HGETALL',P)
local live={}
for i=1,#all,2 do
 local t=tonumber(string.match(all[i+1],'^{"_t":(%d+)')) or 0
 if now-t<=25000 then live[all[i]]=string.match(all[i+1],'"role":"(%a+)"') or '' end
end
local role=live[id]
local M=KEYS[4]
local s=redis.call('HGET',M,'state') or 'idle'
if s=='count' or s=='fight' then return {'busy',redis.call('HGETALL',M)} end
if role=='red' then redis.call('HSET',M,'rid',id,'rn',nick,'rr',want)
elseif role=='blue' then redis.call('HSET',M,'bid',id,'bn',nick,'br',want)
else return {'norole',redis.call('HGETALL',M)} end
tick(now,live)
return {'ok',redis.call('HGETALL',M)}`;

// 공격·가드·회피. 판정은 서버 시각 기준.
const ATK = `
local now=tonumber(ARGV[1]) local id=ARGV[2] local mv=ARGV[3]
local M=KEYS[4]
local f=redis.call('HGETALL',M) local m={} for i=1,#f,2 do m[f[i]]=f[i+1] end
local n=function(k) return tonumber(m[k] or '0') or 0 end
if m.state~='fight' or now>=n('t2') then return {'nofight',f} end
local me,op
if m.rid==id then me,op='r','b' elseif m.bid==id then me,op='b','r' else return {'nofight',f} end
if now<n(me..'nx') then return {'cool',f} end
local D={jab={5,450},str={9,850},upp={15,1400}}
local res,dmg='ok',0
if mv=='grd' then redis.call('HSET',M,me..'g',tostring(now+1100),me..'nx',tostring(now+1300)) res='guard'
elseif mv=='dge' then redis.call('HSET',M,me..'d',tostring(now+550),me..'nx',tostring(now+1600)) res='dodge'
elseif D[mv] then
 dmg=D[mv][1]
 if n(me..'ch')-n(op..'ch')>=20 then dmg=dmg+1 end
 res='hit'
 if now<n(op..'d') then res='miss' dmg=0
 elseif now<n(op..'g') then res='block' if mv=='upp' then dmg=math.floor(dmg*0.5) else dmg=math.max(1,math.floor(dmg*0.2)) end end
 local hp=math.max(0,n(op..'hp')-dmg)
 redis.call('HSET',M,op..'hp',tostring(hp),me..'nx',tostring(now+D[mv][2]),me..'g','0')
 if res=='hit' then redis.call('HINCRBY',M,me..'hit',1) end
 m[op..'hp']=tostring(hp)
else return {'bad',f} end
redis.call('HSET',M,'ev',me..'|'..mv..'|'..dmg..'|'..res..'|'..now)
if tonumber(m[op..'hp'] or '1')<=0 then
 local rhp=(op=='r') and 0 or n('rhp') local bhp=(op=='b') and 0 or n('bhp')
 redis.call('HSET',M,'state','over','win',me,'how','ko','t3',tostring(now),'rch','0','bch','0','rr','0','br','0')
 redis.call('RPUSH',KEYS[5],'{"rn":"'..(m.rn or '')..'","bn":"'..(m.bn or '')..'","win":"'..me..'","how":"ko","rhp":'..rhp..',"bhp":'..bhp..',"ts":'..now..'}')
 redis.call('LTRIM',KEYS[5],-30,-1) redis.call('INCR',KEYS[2])
end
return {res,redis.call('HGETALL',M)}`;

const DATA = `return {redis.call('GET',KEYS[1]) or '0', redis.call('LRANGE',KEYS[2],-80,-1), redis.call('LRANGE',KEYS[3],-20,-1)}`;
// 대화: 선수(홍·청)는 30초에 한 번, 관중은 제한 없음. 역할은 서버가 presence에서 읽는다.
const CHAT = `local e=redis.call('HGET',KEYS[1],ARGV[1]) local role=e and string.match(e,'"role":"(%a+)"') or 'gal'
local row=ARGV[4]
if role=='red' or role=='blue' then
 local left=redis.call('PTTL',KEYS[2]..ARGV[1])
 if left>0 then return {'cool',left} end
 redis.call('SET',KEYS[2]..ARGV[1],'1','PX',30000) row=(role=='blue') and ARGV[3] or ARGV[2]
end
redis.call('RPUSH',KEYS[3],row) redis.call('LTRIM',KEYS[3],-150,-1)
return {role,redis.call('INCR',KEYS[4])}`;
const PUSH = `redis.call('RPUSH',KEYS[1],ARGV[1]) redis.call('LTRIM',KEYS[1],-tonumber(ARGV[2]),-1) return redis.call('INCR',KEYS[2])`;

const KEYS5 = ['5', K.pres, K.ver, K.counts, K.match, K.results];
const flat = a => { const o = {}; for (let i = 0; i < (a || []).length; i += 2) o[a[i]] = a[i + 1]; return o; };
const J = s => { try { return JSON.parse(s); } catch (e) { return null; } };

module.exports = async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method === 'GET' && req.query && req.query.selftest) {
    const out = { store: !!(RURL && RTOK), password: !!PASS };
    try { const r = await redis(['EVAL', SYNC, ...KEYS5, String(Date.now()), 'selftest00', '']); out.sync = Array.isArray(r) && r.length === 5 ? 'ok' : 'odd'; out.online = Array.isArray(r) ? r[1].length : 0; } catch (e) { out.sync = String(e.message).slice(0, 160); }
    try { const r = await redis(['EVAL', DATA, '3', K.ver, K.chat, K.results]); out.data = Array.isArray(r) && r.length === 3 ? 'ok' : 'odd'; } catch (e) { out.data = String(e.message).slice(0, 160); }
    try { const r = await redis(['EVAL', ATK, ...KEYS5, String(Date.now()), 'selftest00', 'jab']); out.atk = Array.isArray(r) && r[0] === 'nofight' ? 'ok' : 'odd'; } catch (e) { out.atk = String(e.message).slice(0, 160); }
    return res.json(out);
  }
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  if (!RURL || !RTOK) return res.status(503).json({ error: 'no_store' });
  if (!PASS) return res.status(503).json({ error: 'no_password' });
  let b = req.body;
  if (typeof b === 'string') b = J(b) || {};
  b = b || {};
  if (!passOk(b.key || '')) return res.status(401).json({ error: 'bad_key' });
  const now = Date.now(), op = b.op;
  try {
    if (op === 'hello') return res.json({ ok: true, now });
    if (op === 'sync') {
      if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' });
      let st = '';
      if (b.st && typeof b.st === 'object') {
        const s = { ...b.st };
        s.role = ['red', 'blue', 'gal'].includes(s.role) ? s.role : 'gal';
        s.nick = nickOk(s.nick);
        st = JSON.stringify({ _t: now, role: s.role, ...s, id: b.id });
        if (st.length > 2500) return res.status(413).json({ error: 'too_big' });
      }
      const [ver, peers, counts, match, ok] = await redis(['EVAL', SYNC, ...KEYS5, String(now), b.id, st]);
      const c = {}; for (let i = 0; i < counts.length; i += 2) { const v = J(counts[i + 1]); if (v) c[counts[i]] = v; }
      return res.json({ now, ver: String(ver), ok: ok === 1, peers: peers.map(J).filter(Boolean), counts: c, match: flat(match) });
    }
    if (op === 'leave') { if (idOk(b.id)) await redis(['HDEL', K.pres, b.id]); return res.json({ ok: true }); }
    if (op === 'ready') {
      if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' });
      const [r, m] = await redis(['EVAL', READY, ...KEYS5, String(now), b.id, b.on ? '1' : '0', nickOk(b.nick)]);
      return res.json({ now, res: r, match: flat(m) });
    }
    if (op === 'atk') {
      if (!idOk(b.id) || !['jab', 'str', 'upp', 'grd', 'dge'].includes(b.mv)) return res.status(400).json({ error: 'bad_move' });
      const [r, m] = await redis(['EVAL', ATK, ...KEYS5, String(now), b.id, b.mv]);
      return res.json({ now, res: r, match: flat(m) });
    }
    if (op === 'cheer') {
      const side = b.side === 'b' ? 'bch' : 'rch', n = Math.max(1, Math.min(40, b.n | 0));
      return res.json({ n: await redis(['HINCRBY', K.match, side, n]) });
    }
    if (op === 'data') {
      const r = await redis(['EVAL', DATA, '3', K.ver, K.chat, K.results]);
      return res.json({ ver: String(r[0]), chat: r[1].map(J).filter(Boolean), results: r[2].map(J).filter(Boolean) });
    }
    if (op === 'chat') {
      if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' });
      const text = str(b.text, 200), nick = nickOk(b.nick);
      if (!text.trim()) return res.status(400).json({ error: 'empty' });
      if (b.kind === 'sys') return res.json({ ver: String(await redis(['EVAL', PUSH, '2', K.chat, K.ver, JSON.stringify({ kind: 'sys', text, nick, role: 'gal', ts: now }), '150'])) });
      const row = role => JSON.stringify({ kind: 'pl', text, nick, role, ts: now });
      const rowGal = JSON.stringify({ kind: 'gal', text, nick, role: 'gal', ts: now });
      const r = await redis(['EVAL', CHAT, '4', K.pres, NS + 'talk:', K.chat, K.ver, b.id, row('red'), row('blue'), rowGal]);
      if (r[0] === 'cool') return res.status(429).json({ error: 'cool', left: r[1] });
      return res.json({ ver: String(r[1]), kind: r[0] === 'red' || r[0] === 'blue' ? 'pl' : 'gal' });
    }
    if (op === 'counts') {
      if (!idOk(b.id)) return res.status(400).json({ error: 'bad_id' });
      const v = x => Math.max(0, Math.min(99999, x | 0));
      await redis(['HSET', K.counts, b.id, JSON.stringify({ day: str(b.day, 20), cr: v(b.cr), cb: v(b.cb), pw: v(b.pw) })]);
      return res.json({ ok: true });
    }
    return res.status(400).json({ error: 'bad_op' });
  } catch (e) {
    return res.status(500).json({ error: 'store_failed' });
  }
};
