// 원형 메뉴: 이동을 두 번 이어 찍으면 반드시 첫 지점을 거쳐 둘째 지점으로 간다(시간 칸이 먼저 끝나도 지름길 금지). 지난 턴 공격 대상이 살아 있으면 「계속 공격」이 원형 메뉴에 뜨고 같은 대상을 다시 공격한다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:390,height:844}}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1000);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={};const start=async()=>{closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);hideBattleVoice();await wait(2900);closeRing();BASE_TURN_MENU=false;for(const u of units)if(u.side){u.speed=0;u.damage=0}};
 const run=async()=>{for(const g of apAlive())apMark(g);closeRing();apNext(5);await wait(40);resumeCombat(true);let n=0;while(state!=='planning'&&n++<1500)advancePhase(1/30)};
 await start();const g=1,us=apUnits(g),c0=centroid(us);
 // A: 북쪽, B: A에서 동쪽. 지름길(출발→B)은 A에서 멀다
 const A=nearestCell(c0.x,c0.y-560),B=nearestCell(A.x+620,A.y+40);selected=g;apAdd('move',{x:A.x,y:A.y});apCancelAdvance();ap.advance=null;selected=g;apAdd('move',{x:B.x,y:B.y});apCancelAdvance();ap.advance=null;o.plan=apPlan(g).map(a=>a.kind+a.cost);
 // A 도착을 느리게(실제 속도 절반)
 for(const u of us)u.speed*=.5;let minA=1e9;for(const g2 of apAlive())apMark(g2);closeRing();apNext(5);await wait(40);resumeCombat(true);let n=0;while(state!=='planning'&&n++<1500){advancePhase(1/30);const c=centroid(apUnits(g));minA=Math.min(minA,Math.hypot(c.x-A.x,c.y-A.y))}
 const cE=centroid(apUnits(g));o.minA=Math.round(minA);o.endToB=Math.round(Math.hypot(cE.x-B.x,cE.y-B.y));o.endToA=Math.round(Math.hypot(cE.x-A.x,cE.y-A.y));
 // 계속 공격: 1턴 제자리/접근 공격 → 다음 턴 원형 메뉴
 await start();const e=units.find(u=>u.side&&u.hp>0&&u.type!=='gate'&&!u.fence&&u.type!=='boss');const cc=centroid(apUnits(2));e.x=cc.x;e.y=cc.y-200;e.seen=true;selected=2;apAdd('engage',{target:e,x:e.x,y:e.y});apCancelAdvance();ap.advance=null;await run();
 e.hp=Math.max(e.hp,1);choose(2);await wait(60);o.cont=[...document.querySelectorAll('#ring .ring-item')].map(b=>b.dataset.k);const btn=document.querySelector('#ring .ring-item[data-k="cont"]');o.hint=btn?.querySelector('em')?.textContent;btn?.click();await wait(40);const a=apPlan(2).at(-1);o.contKind=a?.kind;o.sameTarget=a?.target===e||a?.target?.squad===e.squad;return o});
console.log(JSON.stringify(r));assert(r.minA<130,'첫 이동 지점 A를 거침 '+r.minA);assert(r.cont.includes('cont'),'원형 메뉴에 계속 공격');assert(['attack','engage'].includes(r.contKind)&&r.sameTarget,'같은 대상 계속 공격');assert.deepEqual(errs,[]);console.log('PASS chained moves pass through every waypoint, ring 「계속 공격」 re-targets last enemy');await b.close()})();
