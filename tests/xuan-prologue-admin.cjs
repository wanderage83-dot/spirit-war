// 현무 서막 3장(story/xuan-prologue-*.webp)이 연대기에서 현무 첫 장 앞에 한 번 나오고, 서막 다시보기는 6장, 4화면 무스크롤.
// 관리자 메뉴: 청명편/현무편을 골라 어느 판으로든 이동하며 연대기의 다른 쪽 진행도 맞춘다. 시점 바꾸기는 진행 그대로. 복구는 원래 갈래로.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),URL=(process.argv[2]||'http://127.0.0.1:8782').replace(/\/?$/,'/');
for(const[w,h]of[[320,568],[390,844],[844,390],[1280,800]]){const p=await b.newPage({viewport:{width:w,height:h}}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(500);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),fit=()=>{const el=document.querySelector('#prologue'),items=[...el.querySelectorAll('img,h2,p,button')].filter(e=>e.offsetParent);return el.scrollHeight<=el.clientHeight+1&&items.every(e=>{const q=e.getBoundingClientRect();return q.top>=-1&&q.bottom<=innerHeight+1&&q.left>=-1&&q.right<=innerWidth+1})},o={slides:[]};
localStorage.removeItem(CHRON_KEY);startNewRealm();prologueEnd();await wait(200);closeModal();
battleCfg={...battleCfg,campaign:{saga:'c1'}};sagaBattleDone(true);for(let k=0;k<30&&VN;k++){vnStop(true);await wait(30)}await wait(100);document.querySelector('#saga-next').click();await wait(300);
o.open=!!prologue;o.route=ROUTE;for(let i=0;prologue&&i<5;i++){const im=document.querySelector('#pro-image');await new Promise(r=>im.complete?r():im.onload=r);o.slides.push([im.getAttribute('src'),im.naturalWidth>0,document.querySelector('#pro-count').textContent,fit()]);document.querySelector('#pro-next').click();await wait(80)}
o.flag=storyState().xintro;o.timeline=!!document.querySelector('#chron-go');closeModal();
const before=localStorage.getItem(CHRON_KEY);openPrologue();o.replay=prologue.list.length;prologueEnd();o.replaySame=localStorage.getItem(CHRON_KEY)===before;
// 관리자: 현무 x3으로
ADMIN_TOOLS.open();const sel=document.querySelector('#admin-route');o.routes=[...sel.options].map(x=>x.value);sel.value='xuan';sel.dispatchEvent(new Event('change'));o.xList=[...document.querySelectorAll('#admin-chapter option')].map(x=>x.value);const pn=document.querySelector('#admin-panel .admin-box').getBoundingClientRect();o.panelFit=pn.top>=0&&pn.bottom<=innerHeight+1&&pn.right<=innerWidth+1;
document.querySelector('#admin-chapter').value='x3';document.querySelector('#admin-panel button.primary').click();await wait(100);o.x3={route:ROUTE,chron:R.chron,twin:R.twin?.saga.route,mine:R.saga.cleared.join(),other:R.twin?.saga.cleared.join(),next:chronNext()?.join(),key:SAVE_KEY};closeModal();
// 청명 c5로
ADMIN_TOOLS.open();document.querySelector('#admin-route').value='qing';document.querySelector('#admin-route').dispatchEvent(new Event('change'));document.querySelector('#admin-chapter').value='c5';document.querySelector('#admin-panel button.primary').click();await wait(100);o.c5={route:ROUTE,twin:R.twin?.saga.route,mine:R.saga.cleared.join(),other:R.twin?.saga.cleared.join(),next:chronNext()?.join()};closeModal();
// 시점 바꾸기: 진행 그대로
ADMIN_TOOLS.open();const sw=document.querySelector('#admin-swap');o.swapLabel=sw?.textContent;sw.click();await wait(100);o.sw={route:ROUTE,mine:R.saga.cleared.join(),other:R.twin.saga.cleared.join(),state};ADMIN_TOOLS.open();document.querySelector('#admin-swap').click();await wait(100);o.sw2={route:ROUTE,mine:R.saga.cleared.join()};
// 복구: 처음 이동 전 진행(c1을 끝내고 현무 차례)
ADMIN_TOOLS.open();[...document.querySelectorAll('#admin-panel button')].find(x=>/복구/.test(x.textContent)).click();await wait(200);closeModal();o.restored={route:ROUTE,mine:R.saga.cleared.join(),twin:R.twin?.saga.route,other:R.twin?.saga.cleared.join(),backup:!!localStorage.getItem(ADMIN_TOOLS.key())};
return o});
const tag=w+'x'+h;assert(r.open&&r.route==='xuan',tag+' 현무 서막');assert.equal(r.slides.length,3,tag);r.slides.forEach((s,i)=>{assert.equal(s[0],['story/xuan-prologue-1-north-gate.webp','story/xuan-prologue-2-seal-research.webp','story/xuan-prologue-3-dawn.webp'][i]);assert(s[1],tag+' 그림 로드');assert.equal(s[2],(i+1)+' / 3');assert(s[3],tag+' 무스크롤 '+i)});
assert(r.flag&&r.timeline,tag+' 서막 뒤 연대기');assert.equal(r.replay,6);assert(r.replaySame,'다시보기는 저장 불변');
assert.deepEqual(r.routes,['qing','xuan']);assert.equal(r.xList.length,10);assert(r.xList.every(x=>x[0]==='x'));assert(r.panelFit,tag+' 관리자 창 화면 안');
assert.deepEqual(r.x3,{route:'xuan',chron:true,twin:'qing',mine:'x1,x2',other:'c1,c2,c3,c4',next:'x3',key:'spiritwar-chronicle-v2'},JSON.stringify(r.x3));
assert.deepEqual(r.c5,{route:'qing',twin:'xuan',mine:'c1,c2,c3,c4',other:'x1,x2,x3',next:'c5'},JSON.stringify(r.c5));
assert(/서진 시점/.test(r.swapLabel),r.swapLabel);assert.deepEqual(r.sw,{route:'xuan',mine:'x1,x2,x3',other:'c1,c2,c3,c4',state:'realm'},JSON.stringify(r.sw));assert.deepEqual(r.sw2,{route:'qing',mine:'c1,c2,c3,c4'});
assert.deepEqual(r.restored,{route:'xuan',mine:'',twin:'qing',other:'c1',backup:false},JSON.stringify(r.restored));assert.deepEqual(errs,[],tag);await p.close()}
await b.close();console.log('PASS xuan prologue (3 slides once before x1, replay 6, 4 viewports no scroll) + admin route select/jump with chronicle twin/swap/restore')})().catch(e=>{console.error(e);process.exit(1)});
