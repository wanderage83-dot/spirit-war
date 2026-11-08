// 계략(화공·수공·유인)과 원형 명령 메뉴: 장수별 고리 항목(가진 것만), 숲 판정, 군량 차감/취소 환불, 화공 피해·번짐, 수공 다음 턴, 유인 성공·실패 취약, 3화면 고리 표시.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
const p=await b.newPage({viewport:{width:1280,height:800}});p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));const o={};const L=u=>u.hp>0&&!['keep','gate','cart'].includes(u.type)&&!u.structure;
const open=async id=>{closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(200)};
const run=()=>{selected=-1;closeRing();apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();for(let i=0;i<18/.025&&state==='playing';i++)advancePhase(.025)};
// FIRE: o_un (g2) in c7 forest
await open('c7');gold=1000;const g=groups.findIndex(x=>x.leader==='o_un');selected=g;const us=apUnits(g),c=centroid(us);
// find forest point near enemies within 1600
const E=units.filter(u=>u.side&&L(u));let best=null;for(const e of E){const k=forestNear(e.x,e.y);if(k.forest>=.3&&Math.hypot(e.x-c.x,e.y-c.y)<1500){best=e;break}}o.fireTarget=!!best;
if(best){mode='fire';stratTarget(best.x,best.y);o.firePlanned=apPlan(g).some(a=>a.kind==='fire');o.goldAfter=gold;const hp0=E.reduce((n,u)=>n+u.hp,0);run();o.fires=fires.length;o.enemyLoss=Math.round(hp0-units.filter(u=>u.side&&L(u)).reduce((n,u)=>n+u.hp,0));o.wind=fires[0]&&compass(fires[0].wind)}
// invalid fire on open plain
mode='fire';selected=g;const n0=apPlan(g).length;stratTarget(KEEP.x,KEEP.y-500);o.fireRejectedPlain=apPlan(g).length===n0;o.say=$('#toast').textContent;mode=null;
// WATER: o_dan g3
await open('c7');gold=1000;const gw=groups.findIndex(x=>x.leader==='o_dan');selected=gw;const cw=centroid(apUnits(gw));let wt=null;for(const e of units.filter(u=>u.side&&L(u))){const k=forestNear(e.x,e.y);if((k.forest>=.2||k.water>=.08)&&Math.hypot(e.x-cw.x,e.y-cw.y)<1500){wt=e;break}}o.waterTarget=!!wt;if(wt){mode='water';stratTarget(wt.x,wt.y);o.waterAP=apPlan(gw)[0]&&apPlan(gw)[0].cost;run();o.floodPending=floods.length===1&&!floods[0].done;o.floodAt=Math.round(floods[0]?.at);const hp0=units.filter(u=>u.side&&L(u)).reduce((n,u)=>n+u.hp,0);run();o.floodDone=floods.length===0||floods[0].done;o.waterLoss=Math.round(hp0-units.filter(u=>u.side&&L(u)).reduce((n,u)=>n+u.hp,0))}
// LURE: o_muk g1, force success/fail via rand override
for(const want of [true,false]){await open('c2');gold=1000;const gl=groups.findIndex(x=>x.leader==='o_muk');selected=gl;const cl=centroid(apUnits(gl));const t=units.filter(u=>u.side&&L(u)&&u.type!=='boss').sort((a,b)=>Math.hypot(a.x-cl.x,a.y-cl.y)-Math.hypot(b.x-cl.x,b.y-cl.y))[0];t.x=cl.x+200;t.y=cl.y-700;units.filter(u=>u.squad===t.squad).forEach((u,i)=>{u.x=t.x+(i%4)*60;u.y=t.y-Math.floor(i/4)*60;if(u.post)u.post={x:u.x,y:u.y}});mode='lure';stratTarget(t.x,t.y+24);const realRand=window.rand;window.rand=()=>want?0:.99;let tag=want?'lureOk':'lureFail';const y0=centroid(units.filter(u=>u.squad===t.squad&&u.hp>0)).y;run();window.rand=realRand;const foe=units.filter(u=>u.squad===t.squad&&u.hp>0),mine=apUnits(gl);o[tag]={planned:true,foeVul:foe.filter(u=>u.vul>time).length,foeN:foe.length,mineVul:mine.filter(u=>u.vul>time).length,foeMoved:Math.round(centroid(foe).y-y0)}}
return o});
console.log(JSON.stringify(r));
assert(r.firePlanned&&r.goldAfter===850,'화공 예약·군량 150');assert(r.fires>=1&&r.fires<=14&&r.enemyLoss>500,'화공 피해·번짐 상한');assert(r.fireRejectedPlain&&/숲/.test(r.say),'들판엔 화공 불가');
assert(r.waterAP>=3&&r.floodPending&&r.floodDone&&r.waterLoss>0,'수공은 다음 턴에 터짐');
assert(r.lureOk.foeVul===r.lureOk.foeN&&r.lureOk.foeMoved>100&&r.lureOk.mineVul===0,'유인 성공: 적이 끌려오고 취약');assert(r.lureFail.mineVul>0&&r.lureFail.foeVul===0,'유인 실패: 우리가 취약');
// 고리 메뉴: 장수별 항목·숨김·취소 환불·3화면
for(const vp of[{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){const q=await b.newPage({viewport:vp});q.on('pageerror',e=>errs.push(String(e)));await q.goto(URL);await q.waitForTimeout(1000);
const o=await q.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);await wait(2900);const o={};
for(let g=0;g<groups.length;g++){if(!apUnits(g).length)continue;choose(g);await wait(30);const el=$('#ring'),rr=el.getBoundingClientRect(),items=[...el.querySelectorAll('.ring-item')];o[g]={id:groupLeaderId(g),open:!el.classList.contains('hidden'),keys:items.map(b=>b.dataset.k),inside:items.every(b=>{const r=b.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight})};openRing(g,'strat');await wait(20);o[g].strat=[...document.querySelectorAll('#ring .ring-item')].map(b=>b.dataset.k)}
// 취소 환불
gold=500;const g=groups.findIndex(x=>x.leader==='o_muk');choose(g);await wait(20);const t=units.filter(u=>u.side&&u.hp>0&&!['gate','keep','boss'].includes(u.type)&&!u.structure).sort((a,b)=>a.y-b.y).at(-1);const cc=centroid(apUnits(g));t.x=cc.x+100;t.y=cc.y-500;mode='lure';stratTarget(t.x,t.y+24);o.after=gold;apCancelAdvance();selected=g;apUndo();o.refund=gold;
// 지도를 누르면 고리가 닫힌다
choose(0);await wait(20);commandAt(KEEP.x,KEEP.y-900);o.closedOnMap=$('#ring').classList.contains('hidden');return o});
for(const [g,x] of Object.entries(o).filter(([k])=>/^\d+$/.test(k))){assert(x.open&&x.inside,vp.width+' 고리 '+g);const own=x.id==='o_hero'?['lure']:{o_muk:['lure'],o_un:['fire','lure'],o_dan:['water']}[x.id]||[];assert.deepEqual(x.strat,own.map(k=>'strat-'+k),'가진 계략만 '+x.id);assert.equal(x.keys.includes('spell'),g==='0','도술은 군주만');assert.equal(x.keys.includes('charge'),false,'기병 아니면 돌격 없음')}
assert.equal(o.after,460);assert.equal(o.refund,500,'취소하면 군량 환불');assert(o.closedOnMap,'지도 누르면 고리 닫힘');await q.close()}
assert.deepEqual(errs,[]);console.log('PASS stratagems fire/water/lure, per-hero radial menu, refund, 3 viewports');await b.close()})();
