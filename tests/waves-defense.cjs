// 적 증원 다양화·본진 수비 위기·보급소 쟁탈·자동 클로즈업.
// 증원은 planWave가 상황(보급소 보유·성벽)에 따라 기병 기습·공성대·정예·배후·궁병·보급 습격 중에서 고르고, 갈수록 커지고 잦아진다. 관문선 장에서는 관문 뒤 수비대에 합류한다.
// 공성대는 아군 구조물에 3배, 망루(군량120·12초)는 사거리 400 화살, 성곽 보수는 무너진 성벽을 재건한다. 서·동 보급소는 각각 군량 +4/초.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const open=async id=>{setRoute(id[0]==='x'?'xuan':'qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);hideBattleVoice&&hideBattleVoice();await new Promise(r=>setTimeout(r,200))};const run=()=>{selected=-1;apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();for(let i=0;i<18/.025&&state==='playing';i++)advancePhase(.025)};const out={};
 await open('c4');
 // 1) 고르는 증원이 다양하고, 갈수록 커진다
 const kinds=new Set();for(let i=0;i<60;i++){const w=planWave(100);if(w)kinds.add(w.k.id)}out.kinds=[...kinds];
 waveN=0;const e0=waveEvent({k:WAVES[1],dir:'n',at:100}),small=e0.spawn.reduce((n,[,c])=>n+c,0);waveN=8;const e8=waveEvent({k:WAVES[1],dir:'n',at:100}),big=e8.spawn.reduce((n,[,c])=>n+c,0);waveN=0;out.grow=[small,big];
 // 2) 보급소를 쥐면 보급 습격대가 그 보급소로 온다 + 수입
 const west=supplySites.find(d=>d.id==='west');out.income0=sideIncome();west.capture=1;out.income1=sideIncome();let w;for(let i=0;i<200&&!w;i++){const x=planWave(100);if(x?.k.supply)w=x}const ev=waveEvent(w);out.raidToWest=Math.hypot(ev.raidPost.x-west.x,ev.raidPost.y-west.y)<1;west.capture=0;
 // 3) 증원 띠: 봉화대가 없으면 종류를 숨기고, 있으면 보여 준다
 nextWave={k:WAVES[0],dir:'e',at:time+30};events=events.filter(e=>!e.raid);const os=scribe;scribe=()=>null;beacon=0;out.chipHidden=raidText();beacon=1;out.chipShown=raidText();beacon=0;scribe=os;
 // 4) 공성대는 성벽에 3배
 const wall=units.find(u=>u.structure==='wall'),sp=units.find(u=>u.side&&u.type==='spear'&&u.hp>0);const m=matchupInfo(sp,wall);const d1=attackDamage(sp,wall,m);sp.siege=true;const d3=attackDamage(sp,wall,m);sp.siege=false;out.siege=+(d3/d1).toFixed(2);
 // 5) 망루: 짓고 12초 뒤 완공, 사거리 안 적을 쏜다
 gold=1000;const T=units.filter(u=>u.structure==='tower');buildTower(0);out.towerBuild=T[0].buildLeft;run();out.towerDone=T[0].buildLeft===0&&T[0].hp>0;const e=units.find(u=>u.side&&u.hp>0&&u.type==='spear');const q=nearestCell(T[0].x,T[0].y-300);Object.assign(e,{x:q.x,y:q.y,rx:q.x,ry:q.y,order:'hold',post:{x:q.x,y:q.y},speed:0,seen:true});const hp0=e.hp;run();out.towerDmg=Math.round(hp0-e.hp);
 // 6) 성곽 보수가 무너진 성벽을 다시 쌓는다
 wall.hp=0;buildBlock();const need=fortRepairNeed().cost;gold=1000;repairFort();out.repair={need,wall:wall.hp>0,blocks:!walkable(wall.x,wall.y)};
 // 7) 큰 사건이면 카메라가 확대
 setZoom(.6);const z0=zoom;state='playing';cine.user=-1e9;cine.cool=0;cine.hold=0;cine.z0=null;cineEvent(KEEP.x,KEEP.y,3,'시험');for(let i=0;i<20;i++)cineTick(.033);out.cine={z0:+z0.toFixed(2),z:+zoom.toFixed(2)};const p0=project(KEEP.x,KEEP.y);out.cineCenter=Math.round(Math.hypot(p0.x-(camX+VW/2),p0.y-(camY+VH*.45)));state='planning';cineTick(.033);out.cineBack=+zoom.toFixed(2);
 // 8) 관문선 장: 막힌 길로 온 증원은 관문 수비대에 합류
 await open('c7');const n0=units.filter(u=>u.side&&u.hp>0&&u.tag==='center').length;for(const u of units)if(u.side&&u.hp>0&&!u.fence&&u.type!=='gate'&&u.type!=='boss'&&!u.royalGuard&&u.tag!=='center')u.hp=0;launch(waveEvent({k:WAVES[2],dir:'n',at:time}));const joined=units.filter(u=>u.side&&u.hp>0&&u.tag==='center');out.passJoin={before:n0,after:joined.length,behind:joined.every(u=>u.y<PASS_Y),hold:joined.every(u=>u.order==='hold')};
 // 9) 실제 진행: 여러 종류가 실제로 출발
 await open('c4');const seen=[];const oL=window.launch;window.launch=function(e){if(e.wave)seen.push(e.wave);return oL(e)};for(let k=0;k<26&&state==='planning';k++)run();window.launch=oL;out.launched=seen;return out});
console.log(JSON.stringify(r));
assert.ok(r.kinds.length>=4,'증원 종류 다양');assert.ok(r.grow[1]>r.grow[0],'증원이 갈수록 커짐');assert.equal(r.income0,0);assert.equal(r.income1,4,'서쪽 보급소 군량 +4/초');assert.ok(r.raidToWest,'보급 습격대는 우리가 쥔 보급소로');
assert.ok(/턴/.test(r.chipHidden)&&/봉화대/.test(r.chipHidden)&&!/기병/.test(r.chipHidden),'봉화대 없으면 종류 숨김');assert.ok(/기병/.test(r.chipShown),'봉화대 있으면 종류 표시');assert.equal(r.siege,3,'공성대 구조물 3배');
assert.equal(r.towerBuild,12);assert.ok(r.towerDone&&r.towerDmg>0,'망루 완공 후 사격');assert.ok(r.repair.wall&&r.repair.blocks&&r.repair.need===160,'무너진 성벽 재건');
assert.ok(r.cine.z>=r.cine.z0*1.5&&r.cineCenter<60&&r.cineBack===r.cine.z0,'큰 사건 빠른 확대·복귀');assert.ok(r.passJoin.after>r.passJoin.before&&r.passJoin.behind&&r.passJoin.hold,'관문 뒤 수비대 합류');assert.ok(new Set(r.launched).size>=2,'실제 증원 종류 2가지 이상');assert.deepEqual(errors,[]);
console.log('PASS varied escalating waves, supply raids and income, siege x3, watchtowers, wall rebuild, fast event close-up, gate-line reinforcement');await b.close()})();
