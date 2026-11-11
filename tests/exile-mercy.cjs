// 줄거리에 맞춘 전투 규칙: 청명편 c2~c9는 쫓기는 몸(c2~c6 군량 수입 ×.6·충원 비용 ×1.5, c7~c9 주작의 몰래 보급 ×.8·×1.25), c10부터 원래대로.
// c3·x2는 항복 받기: 쓰러진 적 병사는 항복(fled)하고 적 사기가 1.6배 빨리 떨어진다. 브리핑·시작 안내에 표시.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
const p=await b.newPage({viewport:{width:1280,height:800}});p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={};const open=async(route,id)=>{closeModal();setRoute(route);newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(60);return c};
const base=()=>{const occ=capture>=1;return(occ?14:6)+(heroAlive('o_dan')?3:0)+sideIncome()};
o.lv={};for(const id of['c1','c2','c6','c7','c9','c10','c16']){await open('qing',id);o.lv[id]=exileLv}
for(const id of['x1','x2','x5']){await open('xuan',id);o.lv[id]=exileLv}
// 수입·비용
await open('qing','c2');o.rate=[foodRate(),Math.round(base()*.6)];const r0=recipes.find(r=>r&&apUnits(r.g).length);o.cost=[rcost(r0),Math.round(r0.cost*1.5)];
gold=1000;const i0=recipes.indexOf(r0);ap.baseOpen=true;train(i0);o.paid=1000-gold;o.qcost=queue[0]?.cost;queue.length=0;
const g0=gold;updateEconomy(1);o.inc=+(gold-g0).toFixed(2);o.incWant=+(base()*.6).toFixed(2);
await open('qing','c8');o.c8=[foodRate(),Math.round(base()*.8),rcost(r0)/r0.cost];
await open('qing','c10');o.c10=[foodRate(),base(),rcost(recipes.find(r=>r))===recipes.find(r=>r).cost];
// 항복
for(const [route,id] of[['qing','c3'],['xuan','x2'],['qing','c5']]){await open(route,id);const e=units.find(u=>u.hp>0&&u.side&&isSoldier(u)&&canRout(u));const m=mor(e.squad);m.v=100;m.rout=0;const v0=m.v;hit(e,e.max*.2,'');const drop=v0-m.v;hit(e,e.max*5,'');o[id]={mercy:!!battleCfg.mercy,fled:!!e.fled,drop:+drop.toFixed(2)}}
// 브리핑
closeModal();setRoute('qing');newRealm();showRealm();R.saga.cleared=['c1','c2'];openChapter('c3');{const tx=document.body.textContent;o.brief=/쫓기는 몸/.test(tx)&&/항복 받기/.test(tx)}closeModal();
await open('qing','c2');await wait(400);o.banner=document.querySelector('#powerup')?.textContent||'';
return o});
console.log(JSON.stringify(r));
assert.deepEqual(r.lv,{c1:0,c2:1,c6:1,c7:2,c9:2,c10:0,c16:0,x1:0,x2:0,x5:0},'쫓기는 장');
assert.equal(r.rate[0],r.rate[1],'표시 수입 ×.6');assert.equal(r.cost[0],r.cost[1],'충원 ×1.5');assert.equal(r.paid,r.cost[0],'낸 값');assert.equal(r.qcost,r.cost[0],'반환 기준');assert(Math.abs(r.inc-r.incWant)<.01,'실제 수입');
assert.equal(r.c8[0],r.c8[1],'주작 보급 ×.8');assert(Math.abs(r.c8[2]-1.25)<.05);assert(r.c10[0]===r.c10[1]&&r.c10[2],'c10 원래대로');
assert(r.c3.mercy&&r.c3.fled&&r.x2.mercy&&r.x2.fled,'항복');assert(!r.c5.mercy&&!r.c5.fled,'다른 장은 그대로');assert(r.c3.drop>r.c5.drop*1.3,'사기 더 빨리 '+r.c3.drop+' vs '+r.c5.drop);
assert(r.brief,'브리핑');assert(/충원 비용/.test(r.banner),'시작 안내');
assert.deepEqual(errs,[]);console.log('PASS exile economy c2~c9 (×.6/×1.5, 주작 ×.8/×1.25, c10 normal), mercy surrender c3/x2, briefing/banner');await b.close()})();
