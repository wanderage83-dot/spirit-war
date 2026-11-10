// 대화 첫 등장 인물 소개: 처음 말하는 인물마다 이등신·초상·이름·역할·소개(한 글자씩) 카드가 잠깐 뜨고 사라짐, 누르기를 막지 않음, 다시 나오지 않음(R.saga.met), 군주는 갈래가 달라도 같은 사람, 연대기 twin 공유, 4화면에서 대화창과 겹치지 않음.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
for(const vp of[{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(1000);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={};closeModal();setRoute('qing');newRealm();R.story.intro=true;showRealm();const c=SAGA.find(c=>c.id==='c1');let k=0;while(!c.pre[k][0])k++;
vnPlay(c.pre,{scene:'camp',start:k});await wait(250);const el=document.querySelector('#vn .vn-intro');o.first=el.dataset.id;o.partial=el.querySelector('.vi-bio').textContent.length;o.full=vnIntroInfo(el.dataset.id).bio.length;o.pe=getComputedStyle(el).pointerEvents;o.sd=!!el.querySelector('.vi-sd').src;o.face=el.querySelector('.vi-face').src.includes('portraits');o.name=el.querySelector('.vi-name').textContent;
await wait(600);const box=document.querySelector('#vn .vn-box').getBoundingClientRect(),ir=el.getBoundingClientRect(),card=el.querySelector('.vi-card').getBoundingClientRect();o.noOverlap=card.left>=0&&card.right<=innerWidth+1&&card.top>=0&&card.bottom<=innerHeight+1&&ir.width>=innerWidth-1&&ir.height>=innerHeight*.9;o.bigCard=Math.round(el.querySelector('.vi-band').getBoundingClientRect().height/innerHeight*100);
// 누르면 대사는 그대로 넘어간다(카드가 막지 않음)
const i0=VN.i;el.click();o.closedFirst=el.hidden&&VN.i===i0;document.querySelector('#vn .vn-next').click();document.querySelector('#vn .vn-next').click();o.advanced=VN.i>i0;
// 끝까지 넘기며 처음 말한 인물을 모은다
const seen=[];const ids=new Set();for(let g=0;g<200&&VN;g++){const id=VN.lines[VN.i][0];if(id&&!ids.has(vnMetKey(id))){ids.add(vnMetKey(id));seen.push(vnMetKey(id))}vnNext();vnNext();await wait(5)}o.speakers=seen;o.met=[...R.saga.met];
// 자동으로 사라진다
await wait(100);vnPlay(c.pre,{scene:'camp',start:k});const el2=document.querySelector('#vn .vn-intro');o.replayHidden=el2.hidden;vnStop();
// 새 인물: 시간 지나면 사라짐
R.saga.met=[];vnPlay([['o_muk','시험']],{});const el3=document.querySelector('#vn .vn-intro');o.mukShown=!el3.hidden;const T=vnIntroInfo('o_muk').bio.length*38+1700+420+400;await wait(T);o.autoHidden=el3.hidden;vnStop();
// 군주: 청명편 o_hero = ruler:qing 같은 사람
R.saga.met=[];vnPlay([['o_hero','가자']],{});o.heroKey=document.querySelector('#vn .vn-intro').dataset.id;vnStop();vnPlay([['ruler:qing','가자']],{});o.heroAgain=document.querySelector('#vn .vn-intro').hidden;vnStop();
// 동작 줄이기: 즉시 전체 글

// 연대기 twin 공유
R.saga.met=[];R.twin={saga:{met:['o_bi']}};vnPlay([['o_bi','왔어']],{});o.twinSkip=document.querySelector('#vn .vn-intro').hidden;vnPlay([['o_ha','왔어요']],{});o.twinPush=R.twin.saga.met.includes('o_ha');vnStop();delete R.twin;
// 끄기
VN_INTRO=false;R.saga.met=[];vnPlay([['o_dan','x']],{});o.off=document.querySelector('#vn .vn-intro').hidden;vnStop();VN_INTRO=true;return o});
console.log(vp.width,JSON.stringify(r));
assert(r.first&&r.partial>0&&r.partial<r.full,'한 글자씩 타자');assert(r.closedFirst,'첫 누르기는 소개 닫기');assert(r.bigCard>=60,'화면 대부분을 가림 '+r.bigCard);assert(r.sd&&r.face&&r.name,'이등신·초상·이름');assert(r.noOverlap,vp.width+' 대화창과 겹치지 않음');assert(r.advanced,'카드 중에도 대사 넘김');
assert.deepEqual(r.met.slice().sort(),r.speakers.slice().sort(),'처음 말한 인물 모두 기록');assert(r.replayHidden,'다시 보면 안 나옴');assert(r.mukShown&&r.autoHidden,'잠깐 뒤 사라짐');assert.equal(r.heroKey,'ruler:qing');assert(r.heroAgain,'군주는 같은 사람');assert(r.twinSkip&&r.twinPush,'연대기 공유');assert(r.off);await p.close()}
{const q=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await q.goto(URL);await q.waitForTimeout(800);const full=await q.evaluate(()=>{closeModal();setRoute('qing');newRealm();R.saga.met=[];vnPlay([['o_un','기록']],{});return document.querySelector('#vn .vi-bio').textContent===vnIntroInfo('o_un').bio});assert(full,'동작 줄이기: 소개 즉시');await q.close()}
{const q=await b.newPage({viewport:{width:844,height:390}});await q.goto(URL);await q.waitForTimeout(800);const sc=await q.evaluate(async()=>{closeModal();setRoute('qing');newRealm();const st=document.createElement('style');st.textContent='#vn .vi-bio{font-size:40px!important}';document.head.appendChild(st);vnPlay([['o_baek','x']],{});const b=document.querySelector('#vn .vi-bio');await new Promise(r=>setTimeout(r,3400));return{max:b.scrollHeight-b.clientHeight,top:b.scrollTop}});assert(sc.max>0&&sc.top>=sc.max-2,'넘치면 자동으로 내려감 '+JSON.stringify(sc));await q.close()}
assert.deepEqual(errs,[]);console.log('PASS first-appearance intro: typed bio, portrait+SD, tap closes, auto-scroll, auto-hide, once per story, lord key, chronicle twin, 4 viewports');await b.close()})();
