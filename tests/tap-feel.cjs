// 누르기 손맛: 화면 픽셀 기준 판정(손가락으로 12~18px 빗나가도 우리 부대·적을 잡음), 누르는 순간 손 밑 고리(금/빨/흰), 부대 선택 카메라 미끄럼(즉시 순간이동 없음), 화면 안 이동 지점은 카메라를 옮기지 않음, 실행 시작 시 군주 중심. 휴대폰·PC.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),URL=process.argv[2]||'http://127.0.0.1:8782/';
for(const vp of[{width:390,height:844,touch:true},{width:1280,height:800,touch:false}]){const p=await b.newPage({viewport:{width:vp.width,height:vp.height},hasTouch:vp.touch,isMobile:vp.touch}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(900);
await p.evaluate(async()=>{closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);hideBattleVoice();await new Promise(r=>setTimeout(r,3000));closeRing();choose(1);await new Promise(r=>setTimeout(r,400));closeRing()});
const tap=async(x,y)=>{if(vp.touch)await p.touchscreen.tap(x,y);else await p.mouse.click(x,y)};const off=vp.touch?[[0,0],[12,6],[-14,-8],[0,-16],[18,0]]:[[0,0],[8,4],[-9,-6],[0,-10]];
let ally=0,enemy=0;for(const o of off){const t=await p.evaluate(()=>{selected=1;closeRing();mode=null;const cr=canvas.getBoundingClientRect(),u=apUnits(3).find(u=>!u.commander),q=scrPt(u.x,u.y);return{x:cr.left+q.x,y:cr.top+q.y-q.k*25}});await tap(t.x+o[0],t.y+o[1]);await p.waitForTimeout(350);if(await p.evaluate(()=>selected===3))ally++}
for(const o of off){const t=await p.evaluate(()=>{apTargetClose();closeRing();selected=1;mode=null;const e=units.find(u=>u.side&&u.hp>0&&u.type!=='gate'&&!u.fence),cr0=canvas.getBoundingClientRect(),c=unproject(camX+VW/2,camY+VH*.4);e.x=c.x;e.y=c.y;e.seen=true;const cr=canvas.getBoundingClientRect(),q=scrPt(e.x,e.y);return{x:cr.left+q.x,y:cr.top+q.y-q.k*25}});await tap(t.x+o[0],t.y+o[1]);await p.waitForTimeout(350);if(await p.evaluate(()=>!!apTarget))enemy++}
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={};apTargetClose();closeRing();
// 땅은 짐작으로 적을 고르지 않는다: 적에서 화면 80px 떨어진 땅 → 이동
selected=1;mode=null;const e=units.find(u=>u.side&&u.seen&&u.hp>0&&u.type!=='gate'&&!u.fence),q=scrPt(e.x,e.y);const n0=apPlan(1).length;const w=unproject(camX+(q.x+80)/canvas.getBoundingClientRect().width*VW,camY+q.y/canvas.getBoundingClientRect().height*VH);commandAt(w.x,w.y);o.groundMove=!apTarget&&apPlan(1).length===n0+1;apCancelAdvance();apUndo();
// 카메라 미끄럼
selected=-1;closeRing();const c0=[camX,camY];choose(2);o.instant=Math.hypot(camX-c0[0],camY-c0[1]);await wait(80);o.mid=Math.hypot(camX-c0[0],camY-c0[1]);await wait(300);o.end=Math.hypot(camX-c0[0],camY-c0[1]);
// 화면 안 이동 지점은 카메라를 옮기지 않음
closeRing();const cc=centroid(apUnits(2));let pt=null;for(let r=120;r<900&&!pt;r+=60)for(let a=0;a<12&&!pt;a++){const x=cc.x+Math.cos(a*.52)*r,y=cc.y+Math.sin(a*.52)*r,tp=tapPick(x,y);if(!tp.f&&!tp.e&&walkable(x,y)&&inView(x,y,.2)&&Math.hypot(x-KEEP.x,y-KEEP.y)>200)pt={x,y}}const c1=[camX,camY];selected=2;commandAt(pt.x,pt.y);await wait(300);o.stay=Math.hypot(camX-c1[0],camY-c1[1]);apCancelAdvance();
// 실행 시작 시 군주
apReset&&0;for(const g of apAlive())apMark(g);closeRing();BASE_TURN_MENU=false;apNext(5);await wait(60);resumeCombat(true);await wait(400);const L=units.find(u=>!u.side&&u.type==='hero');o.lord=inView(L.x,L.y,.25)&&state==='playing';return o});
const ring=await p.evaluate(()=>!!document.getElementById('tapring'));
console.log(vp.width,'ally',ally+'/'+off.length,'enemy',enemy+'/'+off.length,JSON.stringify(r),'ring',ring);
assert.equal(ally,off.length,'우리 부대 빗나간 누르기');assert.equal(enemy,off.length,'적 빗나간 누르기');assert(r.groundMove,'땅은 이동');assert(r.instant<1&&r.mid>1&&r.end>r.mid,'선택 카메라 미끄럼');assert(r.stay<1,'화면 안 지점 카메라 고정');assert(r.lord,'실행 시작 군주 중심');assert(ring,'누름 고리');assert.deepEqual(errs,[]);await p.close()}
console.log('PASS screen-space tap picking, press ring, camera glide/no jump, lord view at execution');await b.close()})();
