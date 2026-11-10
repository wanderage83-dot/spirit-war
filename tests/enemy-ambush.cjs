// 적 매복·정찰 맞대응(4단계): amb 장마다 길목 덤불에 적 보병 부대가 숨음(처음 흔적 없음), 다가가면 덮침(「적의 매복」), 사율 220·기병 ×1.25·일반 120 발견 거리, 운학 흔적 1곳·봉화대 전부, 브리핑 「⚠ 매복 가능」, 도움말.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
const p=await b.newPage({viewport:{width:1280,height:800}});p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={};const vis=()=>{visAt=0;computeVision()};const open=async(route,id)=>{closeModal();setRoute(route);newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(60);return c};
const amb=()=>units.filter(u=>u.hp>0&&u.side&&u.ambush);
// 모든 amb 장: 숨은 매복 부대, 아군 가까이 아님
o.chapters={};for(const route of['qing','xuan'])for(const c of(setRoute(route),SAGA).filter(c=>c.amb)){await open(route,c.id);vis();const a=amb(),sq=[...new Set(a.map(u=>u.squad))],near=Math.min(...a.map(u=>Math.min(...units.filter(v=>v.hp>0&&!v.side&&!['keep','gate','cart'].includes(v.type)&&!v.structure).map(v=>Math.hypot(v.x-u.x,v.y-u.y)))));o.chapters[c.id]={n:sq.length,hid:a.every(u=>u.hid&&!u.seen),near:Math.round(near),walk:a.every(u=>walkable(u.x,u.y)),noHorse:a.every(u=>u.type!=='horse'&&u.type!=='boss')}}
// 현무편(운학 없음): 처음 흔적 없음
await open('xuan','x6');vis();o.xuanGhost=amb().some(u=>ghosts.has(u.squad));
// 청명편: 운학 흔적 1곳
await open('qing','c16');vis();const sqs=[...new Set(amb().map(u=>u.squad))];o.c16sq=sqs.length;o.scribeHints=sqs.filter(id=>ghosts.get(id)?.hint).length;
// 봉화대 확보 → 전부
beacon=1;vis();o.beaconHints=sqs.filter(id=>ghosts.get(id)?.hint).length;beacon=0;
// 발견 거리: 일반 보병 120 / 사율 220 / 기병 150
await open('qing','c16');{const e=amb()[0],sq=amb().filter(u=>u.squad===e.squad);const allies=units.filter(u=>u.hp>0&&!u.side&&!['keep','gate','cart'].includes(u.type)&&!u.structure);allies.forEach(u=>{u.x=-9999;u.y=-9999});units.filter(u=>u.side&&u.hp>0&&u.squad!==e.squad).forEach(u=>{u.x=-5000;u.y=-5000});sq.forEach(u=>{u.x=e.x;u.y=e.y});const test=(w,d)=>{w.x=e.x+d;w.y=e.y;w.dir=Math.PI;vis();const s=!e.hid;w.x=-9999;w.y=-9999;return s};
const foot=allies.find(u=>u.type==='shield'&&!u.royalGuard&&groups[u.g]?.leader!=='o_sa');o.foot=[test(foot,110),test(foot,140)];const gS=groups.findIndex((g,i)=>i>0&&g.type!=='horse'&&allies.some(u=>u.g===i&&u!==foot)),oldL=groups[gS].leader;groups[gS].leader='o_sa';const sa=allies.find(u=>u.g===gS&&u!==foot);const cm=allies.find(u=>u.g===gS&&u.commander);const oc=cm?.commander;if(cm)cm.commander='o_sa';else sa.commander='o_sa';o.hasSa=!!sa;if(sa){const k=sa.type;o.sa=[test(sa,210),test(sa,240),k]}groups[gS].leader=oldL;if(cm)cm.commander=oc;else sa.commander=null;const hz=allies.find(u=>u.type==='horse'&&groups[u.g]?.leader!=='o_sa');if(hz)o.horse=[test(hz,145),test(hz,160)]
// 덮침: 아군 보병이 230 앞으로 오면 발동
const prev=document.querySelector('#powerup')?.textContent||'';foot.x=e.x+180;foot.y=e.y;foot.dir=Math.PI;vis();ambushTick();o.sprung=sq.every(u=>!u.ambush&&u.order==='attack');o.focus=sq.every(u=>u.focus===foot);o.banner=document.querySelector('#powerup')?.textContent||'';o.stillHidden=sq.every(u=>u.stealth)}
// 브리핑
await open('qing','c14');o.brief=(()=>{closeModal();openChapter(SAGA.find(c=>c.id==='c14'));const t=document.querySelector('#modal')?.textContent||document.body.textContent;closeModal();return/매복 가능/.test(t)})();o.help=/매복 가능/.test(HELP[7][1]);
return o});
console.log(JSON.stringify(r));
for(const [id,c] of Object.entries(r.chapters)){assert(c.n>=1,id+' 매복 부대');assert(c.hid,id+' 숨음');assert(c.near>=900,id+' 아군과 떨어짐 '+c.near);assert(c.walk&&c.noHorse,id)}
assert(!r.xuanGhost,'정찰 없으면 처음 흔적 없음');assert.equal(r.scribeHints,1,'운학 흔적 1곳');assert.equal(r.beaconHints,r.c16sq,'봉화대 흔적 전부');
assert.deepEqual(r.foot,[true,false],'일반 120');if(r.hasSa)assert.deepEqual(r.sa.slice(0,2),[true,false],'사율 220');if(r.horse)assert.deepEqual(r.horse,[true,false],'기병 150');
assert(r.sprung&&r.focus&&/적의 매복/.test(r.banner)&&r.stillHidden,'적 매복 발동');assert(r.brief,'브리핑 매복 가능');assert(r.help);
assert.deepEqual(errs,[]);console.log('PASS enemy ambush placement in 12 chapters, hidden until spotted, scout radii (foot/사율/cavalry), 운학 1 hint, beacon all, spring banner, briefing/help');await b.close()})();
