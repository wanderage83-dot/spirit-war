// 사신전기 연대기 두루마리(지나온 장과 지금 장만 드러남, 끝낸 장 낙관, 다음 장으로 붓줄, 다음 장 카드·시점 전환 문구, 흑수 편 선택)과
// 장 시작 전 제목 연출(누르면 넘김, 끝나면 대화 시작). 예전 이야기별 저장은 메뉴에 나오지 않는다. 4화면 무스크롤.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
for(const vp of[{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errs.push(String(e)));p.on('dialog',d=>d.accept());
await p.addInitScript(()=>{try{localStorage.setItem('spiritwar-seal-qing-v2',JSON.stringify({old:1}))}catch(e){}});await p.goto(URL);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),fit=()=>{const s=document.querySelector('#chronscreen .chron-tl'),c=document.querySelector('#chronscreen .cs-card').getBoundingClientRect();return Math.max(s.scrollHeight-s.clientHeight,c.bottom-innerHeight)},o={};
o.menu=[...document.querySelectorAll('#rmodal .route-row b')].map(b=>b.textContent);o.legacy=/예전 저장/.test(document.querySelector('#rmodal').textContent);o.key=CHRON_KEY;
startNewRealm();prologueEnd();await wait(300);o.start={nodes:document.querySelectorAll('.cs-node').length,tl:!!document.querySelector('.chron-tl'),now:[...document.querySelectorAll('.ctl-row.now')].map(e=>e.dataset.id),fit:fit()};document.querySelector('#chron-go').click();
battleCfg={...battleCfg,campaign:{saga:'c1'}};sagaBattleDone(true);for(let k=0;k<30&&VN;k++){vnStop(true);await wait(40)}await wait(150);document.querySelector('#saga-next').click();await wait(200);
const box=document.querySelector('.chron-tl');o.early={seal:box.classList.contains('stamped'),arr:box.classList.contains('arrived')};await wait(2300);
o.step={nodes:document.querySelectorAll('.cs-node').length,route:ROUTE,seal:!!document.querySelector('.ctl-row.was .ctl-seal'),stamped:box.classList.contains('stamped'),path:(document.querySelector('.ctl-link .cs-new').getAttribute('d')||'').length,now:[...document.querySelectorAll('.ctl-row.now')].map(e=>e.dataset.id),msg:document.querySelector('.ctl-msg').textContent,fit:fit(),cols:[...document.querySelectorAll('.ctl-head b')].map(e=>e.textContent)};
document.querySelector('#chron-go').click();await wait(100);
// 장 제목 연출 → 누르면 넘김 → 대화
startChapter('x1');await wait(300);const cc=document.querySelector('#chapcard');o.card={on:!cc.classList.contains('hidden'),title:cc.querySelector('.cc-title').textContent,no:cc.querySelector('.cc-no').textContent,route:cc.querySelector('.cc-route').textContent,vn:!!VN};cc.click();await wait(600);o.card.after=!!VN&&cc.classList.contains('hidden');vnStop(true);
// 자동으로 끝남
CHAPTER_CARD=true;closeModal();startChapter('x1');await wait(3400);o.cardAuto=!!VN;vnStop(true);
// 흑수 편 선택
closeModal();R.saga.cleared=['x1'];R.twin.saga.cleared=['c1','c2'];openTimeline({next:['c3','x2'],mode:'clash',done:'c2'});await wait(2300);o.clash={nodes:document.querySelectorAll('.cs-node').length,n:document.querySelectorAll('.chron-pick .chron-side').length,fit:fit(),now:[...document.querySelectorAll('.ctl-row.now')].map(e=>e.dataset.id).sort()};
openTimeline();await wait(50);o.view={close:document.querySelector('#chron-go').textContent,fit:fit()};closeModal();rsel=null;renderPanel();o.dock=[...document.querySelectorAll('#rpanel .dk-side .rbtn')].some(b=>/연대기/.test(b.textContent));return o});
console.log(vp.width,JSON.stringify(r));
assert.deepEqual(r.menu,['사신전기']);assert(!r.legacy,'예전 저장 없음');assert.equal(r.key,'spiritwar-chronicle-v2');
assert.equal(r.start.nodes,1,'앞으로 올 장은 감춤');assert(r.start.tl&&r.start.now.join()==='c1'&&r.start.fit<=1,'시작 연대기');assert(!r.early.seal||!r.early.arr,'연출 순서');
assert(r.step.route==='xuan'&&r.step.seal&&r.step.stamped&&r.step.path>10&&r.step.now.join()==='x1'&&/한편, 서진/.test(r.step.msg)&&r.step.fit<=1,'시점 전환 '+JSON.stringify(r.step));assert.deepEqual(r.step.cols,['청명','서진']);assert.equal(r.step.nodes,2,'지나온 장+지금 장만');
assert(r.card.on&&r.card.title==='북문에 남은 병사'&&r.card.no==='제1장'&&/현무/.test(r.card.route)&&!r.card.vn&&r.card.after,'제목 연출 '+JSON.stringify(r.card));assert(r.cardAuto,'제목 연출 자동 진행');
assert.equal(r.clash.n,2);assert.equal(r.clash.nodes,5,'c1 x1 c2 + 맞붙는 두 장');assert(r.clash.fit<=1);assert.deepEqual(r.clash.now,['c3','x2']);assert(/닫기/.test(r.view.close)&&r.view.fit<=1);assert(r.dock,'안내판 연대기 단추');await p.close()}
assert.deepEqual(errs,[]);console.log('PASS chronicle timeline (start/step stamp+brush link/clash pick/view), chapter title card (tap/auto), no legacy saves, 4 viewports');await b.close()})();
