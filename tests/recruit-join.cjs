// 새로 합류한 신병은 본진에서 부대까지 걸어오는 동안(joining) 「뒤처진 병사」가 아니다. 장수는 그들을 기다리지 않고, 그들 때문에 장수 반경 제한(squadStepAllowed)에 묶이지 않는다. 부대 곁(반경 .85)에 오면 보통 부대원이 된다.
// 이전: 앞에 나가 있는 부대에 신병이 붙으면 장수가 「대형 유지 · 뒤처진 병사 대기」로 멈추고 신병 쪽으로 멀어지는 이동도 막혀 앞에서 아무것도 못 했다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);hideBattleVoice&&hideBattleVoice();await new Promise(r=>setTimeout(r,300));
 const g=groups.map((_,i)=>i).find(g=>g>0&&apUnits(g).some(isBattleLeader)),us=apUnits(g),L=us.find(isBattleLeader);
 // 부대를 본진에서 멀리 앞(위쪽)으로 옮기고 적은 멀리 둔다
 let o=null;for(let d=1500;d>800&&!o;d-=50){const q=nearestCell(KEEP.x,KEEP.y-d);if(Math.hypot(q.x-KEEP.x,q.y-KEEP.y)>700)o=q}const c0=centroid(us);for(const v of us){const q=nearestCell(o.x+(v.x-c0.x),o.y+(v.y-c0.y));v.x=v.rx=q.x;v.y=v.ry=q.y;v.path=null;v.order='hold';v.squadSlot=null}
 for(const v of units)if(v.side&&v.hp>0&&Math.hypot(v.x-o.x,v.y-o.y)<1300){v.hp=0}
 // 신병 합류
 const r0=recipes.find(r=>r.g===g);queue.push({...r0,n:recruitSize(r0),left:0});updateEconomy(.05);const nu=apUnits(g).filter(v=>v.joinedRound===ap.round);const fxJoin={pillars:fx.filter(f=>f.kind==='pillar').length,banner:document.querySelector('#powerup').innerText};
 // 다음 턴으로 넘겨 합류 턴 예외가 끝난 상태에서, 장수 부대를 신병 반대쪽(앞)으로 이동
 const waitCue={n:0};const oC=window.combatCue;window.combatCue=function(u,t){if(u.squad===L.squad&&t&&t.startsWith('대형 유지'))waitCue.n++;return oC.apply(this,arguments)};
 const run=()=>{apCancelAdvance();let gd=0;while(apPending().length&&gd++<20)apSkip();document.querySelector('#apready-run').click();for(let i=0;i<12/.025&&state==='playing';i++)advancePhase(.025)};
 run();const start={x:L.x,y:L.y},dk0=Math.hypot(L.x-KEEP.x,L.y-KEEP.y);selected=g;const dest=nearestCell(L.x,L.y-450);apAdd('move',{x:dest.x,y:dest.y});run();
 const moved=Math.hypot(L.x-start.x,L.y-start.y),away=Math.hypot(L.x-KEEP.x,L.y-KEEP.y)-dk0;
 const near0=nu.filter(v=>v.hp>0&&Math.hypot(v.x-L.x,v.y-L.y)<=320*.85).length;
 // 신병이 결국 부대에 합류한다
 const dist=[];for(let k=0;k<4&&state==='planning';k++){run();dist.push(nu.map(v=>Math.round(Math.hypot(v.x-L.x,v.y-L.y))+(v.joining?'j':'')+v.order).join(','))}const joined=nu.filter(v=>v.hp>0&&!v.joining).length,close=nu.filter(v=>v.hp>0&&Math.hypot(v.x-L.x,v.y-L.y)<=330).length;
 window.combatCue=oC;return{fxJoin,dist,g,recruits:nu.length,moved:Math.round(moved),away:Math.round(away),waitCue:waitCue.n,near0,joined,close}});
console.log(r);assert.ok(r.recruits>=2,'신병 생성');assert.ok(r.fxJoin.pillars>=r.recruits&&/신병 합류/.test(r.fxJoin.banner),'신병 합류 빛기둥·알림 띠');assert.ok(r.moved>250&&r.away>150,'장수가 신병을 기다리지 않고 앞으로 감');assert.equal(r.waitCue,0,'신병 대기 없음');assert.ok(r.joined===r.recruits&&r.close===r.recruits,'신병이 부대에 합류');assert.deepEqual(errors,[]);
console.log('PASS recruits walking up from the base never hold the squad leader back, and join the squad when they arrive');await b.close()})();
