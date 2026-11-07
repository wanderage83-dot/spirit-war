// 판의 틀(form: siege·field·raid)과 전투 중 사건(ev: rear·flank·elite·aid). 실제 턴 진행으로 각 틀이 다르게 시작·전개되는지 확인한다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));const L=u=>u.hp>0&&!['keep','gate','cart'].includes(u.type)&&!u.structure;const cy=l=>l.length?l.reduce((s,u)=>s+u.y,0)/l.length:0;
 const open=async id=>{setRoute(id[0]==='x'?'xuan':'qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(120);return c};
 const turn=()=>{selected=-1;apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();for(let i=0;i<18/.025&&state==='playing';i++)advancePhase(.025)};
 const out={forms:{},ev:{}};for(const route of['qing','xuan']){setRoute(route);for(const c of SAGA){if(c.form)out.forms[c.id]=c.form;if(c.ev)out.ev[c.id]=c.ev.map(e=>e[1])}}
 // 포위: 망루 완성, 4방향 동시 사건, 증원이 실제로 들어옴
 await open('c4');const sg={towers:units.filter(u=>u.structure==='tower'&&u.hp>=u.max).length,dirs:[...new Set(events.filter(e=>e.script==='포위').map(e=>e.dir))].sort().join(''),pass:!!passState};const e0=units.filter(u=>u.side&&L(u)).length;for(let t=0;t<4;t++)turn();sg.grow=units.filter(u=>u.side&&L(u)).length-e0;sg.waveDirs=[...new Set(units.filter(u=>u.side&&u.waveDir).map(u=>u.waveDir))].length;
 // 야전: 양군 가운데, 관문선 없음, 2턴 안에 맞붙어 양쪽 손실
 const c7=await open('c7');const A=()=>units.filter(u=>!u.side&&L(u)),E=()=>units.filter(u=>u.side&&L(u));const fd={ay:cy(A())/WH,ey:cy(E())/WH,pass:!!passState,gap:cy(A())-cy(E())};const a0=A().length,en0=E().length;for(let t=0;t<3;t++)turn();fd.aLoss=a0-A().length;fd.eLoss=en0-E().length;
 // 야습: 잠든 적, 증원 없음, 다가가면 깨고 2턴 뒤 전원 기상, 잠든 적에게 피해 2.5배
 await open('c11');const sl=units.filter(u=>u.side&&L(u)&&u.sleep),rd={sleep:sl.length,all:units.filter(u=>u.side&&L(u)).length,slots:SAGA.find(c=>c.id==='c11').slots,pass:!!passState};const tgt=sl.find(u=>u.type==='shield'),sh=units.find(u=>!u.side&&u.type==='shield');const d1=attackDamage(sh,tgt);tgt.sleep=false;rd.mult=+(d1/attackDamage(sh,tgt)).toFixed(2);tgt.sleep=true;
 for(let t=0;t<2;t++)turn();rd.stillAsleep=units.filter(u=>u.sleep&&u.hp>0).length;rd.waves=!!nextWave;const h=units.find(u=>!u.side&&u.type==='hero'),e=units.filter(u=>u.sleep).sort((a,b)=>b.y-a.y)[0];h.x=e.x;h.y=e.y+250;turn();rd.alarm=formState.alarm>0;rd.after1=units.filter(u=>u.sleep&&u.hp>0).length;turn();turn();rd.after3=units.filter(u=>u.sleep&&u.hp>0).length;rd.wavesAfter=!!nextWave||events.length>0;
 // 사건: 배후 기습은 예정 턴에 남쪽에서 적이 생김, 원군은 아군이 늘고 체력 회복
 await open('c5');const rv=events.find(e=>e.script);const ev={rearAt:rv&&Math.round(rv.at/AP_TURN),rearDir:rv?.dir};const s0=units.filter(u=>u.side&&u.waveDir==='s').length;for(let t=0;t<4;t++)turn();ev.rearSpawned=units.filter(u=>u.side&&u.waveDir==='s').length-s0;
 await open('c8');const n0=A().length;const hurt=A()[3];hurt.hp=hurt.max*.5;for(let t=0;t<3;t++)turn();ev.aidGain=A().length-n0;ev.healed=hurt.hp>hurt.max*.5||hurt.hp<=0;
 // 재시작해도 장 설정(틀·목표·관문선) 유지
 await open('c7');restartBattle();await wait(120);ev.restartForm=battleCfg.form;ev.restartGoal=battleCfg.goal?.t;await open('c5');restartBattle();await wait(120);ev.restartPass=!!passState;
 // 출진 준비 문구
 setRoute('qing');newRealm();R.saga.act=1;R.saga.cleared=['c1','c2','c3','c4','c5','c6'];showRealm();openChapter('c7');ev.brief=document.querySelector('#rmodal .cbrief')?.textContent||'';closeModal();
 return{out,sg,fd,rd,ev}});
console.log(JSON.stringify(r));
assert.deepEqual(r.out.forms,{c4:'siege',c7:'field',c11:'raid',x3:'siege',x5:'siege',x7:'raid',x8:'field'});assert(Object.keys(r.out.ev).length>=15,'사건 15장 이상');
assert.equal(r.sg.towers,2,'포위: 망루 완성');assert.equal(r.sg.dirs,'ensw','포위: 4방향');assert(r.sg.grow>0&&r.sg.waveDirs>=3,'포위: 여러 방향 증원 실제 투입');
assert(r.fd.ay<.66&&r.fd.ey>.33&&r.fd.gap<1100&&!r.fd.pass,'야전: 가운데에서 마주 봄');assert(r.fd.aLoss>0&&r.fd.eLoss>0,'야전: 3턴 안에 맞붙음');
assert(r.rd.sleep>=r.rd.all-1&&r.rd.slots===3&&!r.rd.pass,'야습: 잠든 적·3부대');assert.equal(r.rd.mult,2.5);assert(r.rd.stillAsleep>=r.rd.sleep&&!r.rd.waves,'야습: 다가가기 전엔 그대로·증원 없음');assert(r.rd.alarm&&r.rd.after1<r.rd.sleep&&r.rd.after3===0,'야습: 경보 뒤 모두 깸');
assert.equal(r.ev.rearAt,4);assert.equal(r.ev.rearDir,'s');assert(r.ev.rearSpawned>0,'배후 기습 투입');assert(r.ev.aidGain>0&&r.ev.healed,'원군 합류·회복');
assert.equal(r.ev.restartForm,'field');assert.equal(r.ev.restartGoal,'boss');assert(r.ev.restartPass,'재시작해도 관문선');assert(r.ev.brief.includes('야전 조우전'),r.ev.brief);
assert.deepEqual(errors,[]);console.log('PASS battle forms: siege/field/raid start+play, scripted rear/aid events, restart keeps chapter setup, briefing label');await b.close()})();
