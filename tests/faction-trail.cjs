// 이동 진영색 먼지 꼬리: 움직이는 부대 뒤에 그 부대 진영 색(청룡 파랑·주작 빨강…)의 먼지가 남는지, 멈추면 생기지 않는지, 동작 줄이기에서 꺼지는지.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(800);
const r=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();for(const id of ['o_hong','o_ha','o_bi','o_un','o_muk'])try{joinHero(id)}catch(e){}BASE_TURN_MENU=false;launchChapter(SAGA[7]);hideBattleVoice&&hideBattleVoice();events=[];
 const facs={};for(let g=0;g<groups.length;g++){const us=apUnits(g);if(us.length)facs[g]=unitFac(us[0])}
 const enemy=unitFac(units.find(u=>u.side===1&&u.hp>0&&u.type!=='keep'));
 // 강제 이동 신호로 꼬리 생성
 fx.length=0;trailN=0;const pick=g=>apUnits(g)[1];const out={};for(const g of [0,4]){const u=pick(g);if(!u)continue;setZoom(1);focusPoint(u.x,u.y);for(let i=0;i<30;i++)trailTick(u,.05,10,-10,40);out[g]=[...new Set(fx.filter(f=>f.tr).map(f=>f.col))];fx.length=0}
 const u=pick(0);setZoom(1);focusPoint(u.x,u.y);trailTick({...u,type:'keep'},.5,10,-10,40);for(let i=0;i<30;i++)trailTick({...u,type:'keep'},.05,10,-10,40);const keep=fx.filter(f=>f.tr).length;
 return{facs,enemy,out,keep,col:TRAIL_COL}});
assert.equal(r.facs[0],'qing');assert.equal(r.facs[4],'zhu','홍염 부대는 주작');
assert.deepEqual(r.out[0],[r.col.qing],'청룡 파랑');assert.deepEqual(r.out[4],[r.col.zhu],'주작 빨강');assert.equal(r.keep,0,'건물은 없음');
assert(r.col[r.enemy],'적 진영 색 '+r.enemy);
// 실제 실행: 움직이는 아군 뒤에 생김
const n=await p.evaluate(async()=>{for(let g=0;g<groups.length;g++){const us=apUnits(g);if(!us.length)continue;selected=g;const c=nearestCell(us[0].x,us[0].y-600);apAdd('move',{x:c.x,y:c.y});apCancelAdvance()}while(apPending().length)apSkip();const a=units.find(u=>u.side===0&&u.g===0);setZoom(1);focusPoint(a.x,a.y);resumeCombat(true);await new Promise(r=>setTimeout(r,1500));return fx.filter(f=>f.tr).length});
assert(n>10,'실행 중 꼬리 '+n);
const q=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await q.goto(process.argv[2]||'http://127.0.0.1:8782/');await q.waitForTimeout(800);const rn=await q.evaluate(()=>{setRoute('qing');newRealm();showRealm();BASE_TURN_MENU=false;launchChapter(SAGA[1]);const u=apUnits(0)[1];setZoom(1);focusPoint(u.x,u.y);fx.length=0;for(let i=0;i<30;i++)trailTick(u,.05,10,-10,40);return [rReduced,fx.filter(f=>f.tr).length]});assert.deepEqual(rn,[true,0],'동작 줄이기면 없음');assert.deepEqual(errors,[]);console.log('PASS faction trail',JSON.stringify(r.out),n);await b.close()})();
