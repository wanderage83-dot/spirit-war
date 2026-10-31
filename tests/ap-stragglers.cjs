// AP 소진 자동 공격, 지휘관 잃은 소수 잔병 항복, 전멸 부대의 붕괴 집계, 거점 경합 진행.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(800);
const r=await p.evaluate(()=>{const o={};const go=c=>{setRoute('qing');newRealm();showRealm();launchChapter(c);hideBattleVoice&&hideBattleVoice();events=[];nextRaid=1e9};
 // 1) AP 0인 아군이 사거리 안 적을 실제 15초 실행 중 공격한다(AP는 더 줄지 않음)
 go(SAGA[0]);const us=apUnits(1),foe=units.find(v=>v.side&&v.type!=='boss'&&isSoldier(v));units.filter(v=>v.side&&v!==foe&&v.type!=='boss').forEach(v=>{v.x=200;v.y=200});const boss=units.find(v=>v.type==='boss');boss.x=300;boss.y=300;
 const L=us[0];foe.x=L.x+40;foe.y=L.y;foe.hp=foe.max=1e6;foe.order='hold';foe.post={x:foe.x,y:foe.y};selected=1;apSkip();while(apPending().length)apSkip();$('#apready-run').click();us.forEach(u=>u.ap=0);foe.ap=0;const h0=foe.hp,ally0=L.hp;
 o.canFree=apCanStrike(L);for(let i=0;i<200&&state==='playing';i++)advancePhase(.025);o.dealt=h0-foe.hp;o.apAfter=Math.max(...us.map(u=>u.ap));o.foeHit=ally0-L.hp;
 // 2) 지휘관 없는 적 부대가 20% 이하로 줄면 항복
 go(SAGA[2]);remnantTick(1);const sq=[...new Set(units.filter(v=>v.side&&isSoldier(v)&&!v.guardLord&&v.squad).map(v=>v.squad))].find(s=>units.filter(v=>v.squad===s&&v.hp>0).length>=5&&!units.some(v=>v.squad===s&&v.commander&&v.hp>0));const mem=units.filter(v=>v.squad===sq&&v.hp>0);mem.slice(1).forEach(v=>v.hp=0);remn.t=0;remnantTick(.1);o.surr=mem[0].hp<=0&&mem[0].fled;
 // 지휘관이 살아 있으면 항복하지 않는다
 const sq2=[...new Set(units.filter(v=>v.side&&v.commander&&v.type!=='boss'&&v.squad).map(v=>v.squad))][0];if(sq2){const m2=units.filter(v=>v.squad===sq2&&v.hp>0);m2.filter(isSoldier).slice(1).forEach(v=>v.hp=0);remn.t=0;remnantTick(.1);o.ledStays=m2.filter(isSoldier)[0].hp>0}else o.ledStays=true;
 // 3) rout 목표: 전멸한 부대도 붕괴로 센다
 const rc=SAGA.find(c=>c.goal?.t==='rout');go(rc);remnantTick(1);const sqs=[...new Set(units.filter(v=>v.side&&v.squad&&!['boss','gate'].includes(v.type)&&!v.guardLord).map(v=>v.squad))].slice(0,rc.goal.n);sqs.forEach(s=>units.filter(v=>v.squad===s).forEach(v=>v.hp=0));remn.t=0;remnantTick(.1);o.routWin=goalTick(.01,units.find(v=>v.type==='boss'));
 // 4) hold 목표: 아군이 적보다 2배 넘게 많으면 적 1명이 있어도 절반 속도로 진행
 const hc=SAGA.find(c=>c.goal?.t==='hold');go(hc);const sp=goalState.spot;units.forEach(v=>{if(!['keep','gate','cart'].includes(v.type)){v.x=200;v.y=3000}});apUnits(1).slice(0,3).forEach(v=>{v.x=sp.x;v.y=sp.y});const e1=units.find(v=>v.side&&isSoldier(v));e1.x=sp.x+20;e1.y=sp.y;goalState.prog=0;goalTick(1,null);o.holdProg=goalState.prog;e1.x=sp.x;apUnits(1).slice(1,3).forEach(v=>v.x=200);goalState.prog=0;goalTick(1,null);o.holdEven=goalState.prog;
 return o});
console.log(r);assert.ok(r.canFree,'free strike');assert.ok(r.dealt>0,'AP 0 unit attacked');assert.equal(r.apAfter,0);assert.ok(r.surr,'remnant surrender');assert.ok(r.ledStays,'led squad stays');assert.equal(r.routWin,'win');assert.equal(r.holdProg,.5);assert.equal(r.holdEven,0);assert.deepEqual(errors,[]);console.log('PASS AP-exhausted auto attacks, remnant surrender, wiped squads count as routed, contested hold');await b.close()})();
