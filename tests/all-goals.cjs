// 26장 전부: 승리 조건을 채우면 전투가 끝나고(ending→결과 화면) 「천하 지도로」 뒤 그 장이 완료된다. 지키기(hold)는 실제로 지점에 서서 정해진 턴 수 뒤 끝나는지도 본다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),URL=process.argv[2]||'http://127.0.0.1:8782/';const p=await b.newPage({viewport:{width:1280,height:800}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(800);
const res=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));const out=[];
const force=(c)=>{const g=c.goal,s=goalState,boss=units.find(u=>u.type==='boss');if(!g){if(battleCfg.survive){time=battleCfg.survive+.1;return'survive'}boss.hp=0;return'boss'}
 switch(g.t){case'rout':for(let i=0;i<g.n;i++)s.routed.add('x'+i);return'rout';
 case'hold':s.k=Math.floor(time/AP_TURN);s.cnt=false;s.n=g.turns-1;s.ok=AP_TURN*HOLD_TURN-.05;for(const u of units)if(u.side&&u.hp>0&&Math.hypot(u.x-s.spot.x,u.y-s.spot.y)<700){u.x+=1600;u.y-=1600}{const h=apUnits(1)[0];h.x=s.spot.x;h.y=s.spot.y}return'hold';
 case'holdAll':supplySites.forEach(d=>d.capture=1);capture=1;return'holdAll';
 case'reach':{const h=units.find(u=>u.type==='hero'&&u.hp>0);h.x=s.spot.x;h.y=s.spot.y;return'reach'}
 case'destroy':s.targets.forEach(t=>t.hp=0);return'destroy';
 case'mask':boss.hp=boss.max*(g.floor||.5);return'mask';
 case'boss':boss.hp=0;return'boss';
 case'escort':s.carts.forEach(c=>{c.arrived=true;c.hp=0});return'escort';
 case'final':boss.hp=0;return'final'}};
for(const r of['qing','xuan']){setRoute(r);for(const c of SAGA){closeModal();newRealm();showRealm();R.saga.act=c.act;launchChapter(c);hideBattleVoice();await wait(200);const o={r,id:c.id,t:c.goal?.t||(c.survive?'survive':'boss')};
 // 첫 계획 넘기고 실행
 closeRing&&closeRing();while(apPending().length)apSkip();await wait(1150);if(typeof baseTurnDone==='function')baseTurnDone();const bt=document.querySelector('#apready-run');if(bt)bt.click();await wait(30);o.st0=state;
 o.how=force(c);let k=0;while(state==='playing'&&k<60){advancePhase(1/20);k++}
 if(c.goal?.t==='final'&&state==='playing'){goalState.targets.forEach(t=>t.hp=0);k=0;while(state==='playing'&&k<60){advancePhase(1/20);k++}}
 o.after=state;o.win=pendingWin;o.chip=goalText();
 if(state==='ending'){for(let i=0;i<80&&state!=='over';i++)await wait(100);o.over=state;o.overlay=!document.querySelector('#overlay').classList.contains('hidden');o.title=document.querySelector('#overlay h2')?.textContent;const btn=document.querySelector('#overlay button');o.btn=btn?.textContent;if(btn)btn.click();await wait(500);for(let i=0;i<40;i++){if(typeof VN!=='undefined'&&VN){vnStop(true);await wait(120);continue}const m=document.querySelector('#rmodal:not(.hidden) button');if(m&&i<30){m.click();await wait(150);continue}break}o.cleared=(R.saga.cleared||[]).includes(c.id)}
 out.push(o)}}return out});
for(const o of res){console.log(JSON.stringify(o));assert.equal(o.after,'ending',o.id+' 목표 달성 후 종료');assert.equal(o.win,true,o.id);assert(o.overlay&&o.cleared,o.id+' 결과 화면·장 완료');assert(/목표 달성|버텼다|쓰러뜨렸다|지켜냈다/.test(o.title),o.id+' '+o.title)}assert.equal(res.length,26);
// 지키기: 적을 치우고 지점에 서 있으면 정해진 턴 뒤 끝난다(턴마다 60% 이상 지키면 1턴)
const hold=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));const out=[];for(const r of['qing','xuan']){setRoute(r);for(const c of SAGA){if(c.goal?.t!=='hold')continue;closeModal();newRealm();showRealm();R.saga.act=c.act;launchChapter(c);hideBattleVoice();await wait(150);const s=goalState;events=[];nextWave=null;for(const u of units)if(u.side&&u.hp>0&&!['gate','keep'].includes(u.type)){u.x=200;u.y=200;u.speed=0}for(const u of apUnits(1)){u.x=s.spot.x+(Math.random()-.5)*120;u.y=s.spot.y+(Math.random()-.5)*120}let turns=0;for(let t=0;t<8&&!['ending','over'].includes(state);t++){if(state==='planning'){closeRing();while(apPending().length)apSkip();await wait(1150);if(typeof baseTurnDone==='function')baseTurnDone();document.querySelector('#apready-run')?.click();await wait(30)}let k=0;while(state==='playing'&&k<2000){advancePhase(1/20);k++}turns++}out.push({id:c.id,need:c.goal.turns,turns,state})}}return out});
console.log(JSON.stringify(hold));for(const h of hold){assert.equal(h.state,'ending',h.id+' 지키기 종료');assert.equal(h.turns,h.need,h.id+' 정해진 턴에 종료')}
assert.deepEqual(errs,[]);console.log('PASS 26 chapters end on goal, result screen and chapter cleared; hold goals end after their turns');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
