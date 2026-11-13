// 부대 이동 탄력: 출발 웅크림→튀어 나감, 장수에서 먼 병사일수록 늦게 출발(그림 위치만 잠깐 붙잡음), 멈출 때 앞쏠림, 부대 전체가 같은 순간 내려앉음.
// 판정 좌표는 그대로이고 동작 줄이기면 꺼진다. Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch(),errors=[];const url=process.argv[2]||'http://127.0.0.1:8782/';
const run=async(opt={})=>{const p=await b.newPage(opt);p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.waitForTimeout(800);const r=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();BASE_TURN_MENU=false;launchChapter(SAGA[1]);hideBattleVoice&&hideBattleVoice();events=[];units.filter(v=>v.side).forEach(v=>{v.x=300;v.y=300});
 for(let g=0;g<groups.length;g++){const us=apUnits(g);if(!us.length)continue;selected=g;const c=nearestCell(us[0].x+(g-1.5)*150,us[0].y-500);apAdd('move',{x:c.x,y:c.y});apCancelAdvance()}while(apPending().length)apSkip();resumeCombat(true);
 const go=[],stop=[],set=new Map(),ph={crouch:0,pop:0,stop:0,settle:0};let posDiff=0;
 for(let i=0;i<480&&state==='playing';i++){advancePhase(1/40);for(const u of units){if(u.side||u.hp<=0||u.type==='keep'||u.type==='cart')continue;
  if(u.goT>0&&!u._g){u._g=1;const l=beatLeader(u);go.push({lag:u.lag||0,d:l?Math.hypot(u.x-l.x,u.y-l.y):0})}if(!(u.goT>0))u._g=0;
  if(u.stopT>0&&!u._s){u._s=1;stop.push(time)}if(!(u.stopT>0))u._s=0;
  if(u.setT>0&&!u._t){u._t=1;set.set(u.g,(set.get(u.g)||[]).concat(time))}if(!(u.setT>0))u._t=0;
  const o=beatPose(u);if(u.goT>BEAT_GO&&o.sy<.95)ph.crouch++;if(u.goT>0&&u.goT<=BEAT_GO&&o.r*(u.vface||1)>.05)ph.pop++;if(u.stopT>0&&o.r*(u.vface||1)>.05)ph.stop++;if(u.setT>0&&o.sy<.95)ph.settle++;
  if(u.lag>0)posDiff=Math.max(posDiff,Math.hypot(u.x-u.rx,u.y-u.ry))}}
 const far=go.filter(x=>x.d>150),near=go.filter(x=>x.d>0&&x.d<=80),avg=a=>a.reduce((s,x)=>s+x.lag,0)/Math.max(1,a.length);
 return{reduced:rReduced,go:go.length,stop:stop.length,far:avg(far),near:avg(near),nf:far.length,nn:near.length,sets:[...set.values()].map(ts=>[ts.length,Math.max(...ts)-Math.min(...ts)]),ph,posDiff,plan:state,neutral:JSON.stringify(beatPose(units.find(u=>!u.side&&u.hp>0)))}});await p.close();return r};
const a=await run();
assert(!a.reduced&&a.go>=30&&a.stop>=30,'출발·정지 감지 '+JSON.stringify(a));
assert(a.nf>3&&a.nn>3&&a.far>a.near+.04,'먼 병사가 늦게 출발 '+JSON.stringify(a));
assert(a.sets.length>=3&&a.sets.every(([n,d])=>n>=6&&d<1e-6),'부대 전체가 같은 순간 내려앉음 '+JSON.stringify(a.sets));
for(const k of ['crouch','pop','stop','settle'])assert(a.ph[k]>20,k+' '+JSON.stringify(a.ph));
assert(a.posDiff>3&&a.posDiff<40,'그림만 잠깐 붙잡음 '+a.posDiff);
assert.equal(a.plan,'planning');assert.equal(a.neutral,'{"x":0,"y":0,"r":0,"sx":1,"sy":1}','계획 중엔 원래 자세');
const r=await run({reducedMotion:'reduce'});assert(r.reduced&&r.go===0&&r.stop===0&&r.sets.length===0,'동작 줄이기 '+JSON.stringify(r));
assert.deepEqual(errors,[]);console.log('PASS move beat',JSON.stringify({go:a.go,stop:a.stop,far:+a.far.toFixed(3),near:+a.near.toFixed(3),sets:a.sets.length,ph:a.ph}));await b.close()})();
