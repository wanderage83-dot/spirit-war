// 명령 손맛: 명령을 정하면 그 부대가 반 박자 움찔(웅크렸다 튀어 오름, 장수에서 먼 병사일수록 조금 늦게), 장수 머리 위에 명령 말풍선, 목적지에 깃발이 꽂히며 물결.
// 그림만이라 위치·AP는 그대로. 동작 줄이기면 움찔 없음. Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch(),errors=[];const url=process.argv[2]||'http://127.0.0.1:8782/';
const run=async(opt={})=>{const p=await b.newPage(opt);p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.waitForTimeout(800);
 const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();BASE_TURN_MENU=false;launchChapter(SAGA[1]);hideBattleVoice&&hideBattleVoice();const us=apUnits(1),l=us.find(isBattleLeader)||us[0];selected=1;focusPoint(l.x,l.y-200);
  const pos0=us.map(u=>[u.x,u.y]),c=nearestCell(l.x,l.y-450);apAdd('move',{x:c.x,y:c.y});const ap0=apUsed(1),far=us.filter(u=>u!==l).sort((a,b)=>Math.hypot(b.x-l.x,b.y-l.y)-Math.hypot(a.x-l.x,a.y-l.y))[0];
  const delay=far.cmdAt-l.cmdAt,shout=l.shout?.text,flag=!!ap.cmdFlag&&Math.hypot(ap.cmdFlag.x-c.x,ap.cmdFlag.y-c.y)<1;
  const at0=l.cmdAt,samples=[];for(const s of [.03,.06,.09,.15,.2,.25,.3,.35]){l.cmdAt=performance.now()-s*1000;samples.push(cmdPose(l,{x:0,y:0,r:0,sx:1,sy:1}))}l.cmdAt=at0;
  const minSy=Math.min(...samples.map(o=>o.sy)),minY=Math.min(...samples.map(o=>o.y));
  await new Promise(r=>setTimeout(r,1900));const after=cmdPose(l,{x:0,y:0,r:0,sx:1,sy:1});draw();const gone=!l.shout&&!ap.cmdFlag;
  apCancelAdvance();apAdd('engage',{target:units.find(v=>v.side&&v.hp>0),x:0,y:0});const hit=[ap.cmdFlag?.hit,(apUnits(apPending()[0]??1).find(isBattleLeader)||{}).shout?.text];
  return{reduced:rReduced,shout,flag,delay,minSy,minY,after:JSON.stringify(after),gone,moved:us.every((u,i)=>u.x===pos0[i][0]&&u.y===pos0[i][1]),ap0,hit}});await p.close();return r};
const a=await run();
assert.equal(a.shout,'진군하라!');assert(a.flag,'목적지 깃발');assert(a.delay>20&&a.delay<=140,'먼 병사 늦게 '+a.delay);
assert(a.minSy<.95&&a.minY<-4,'움찔(웅크림·튀어 오름) '+JSON.stringify(a));assert.equal(a.after,'{"x":0,"y":0,"r":0,"sx":1,"sy":1}','끝나면 원래 자세');
assert(a.gone,'말풍선·깃발 사라짐');assert(a.moved,'위치 그대로');assert(a.ap0>0,'AP 계획 그대로');
const r=await run({reducedMotion:'reduce'});assert(r.reduced&&r.minSy===1&&r.minY===0&&r.shout==='진군하라!','동작 줄이기: 움찔 없음·말풍선은 유지 '+JSON.stringify(r));
assert.deepEqual(errors,[]);console.log('PASS command cue',JSON.stringify({delay:a.delay,minSy:+a.minSy.toFixed(3),minY:+a.minY.toFixed(1)}));await b.close()})();
