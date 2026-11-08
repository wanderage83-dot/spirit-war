// 대화 첫머리의 서술(화자 없음) 줄은 화면을 어둡게 하고 소설처럼 문단으로 쓴 뒤, 첫 대사에서 걷혀 대화로 넘어간다. 「대화로 ›」는 첫 대사로 바로 간다. 3화면 무스크롤.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),URL=process.argv[2]||'http://127.0.0.1:8782/';
for(const vp of[{width:320,height:568},{width:390,height:844},{width:844,height:390}]){const p=await b.newPage({viewport:vp}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(900);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),el=$('#vn'),o={};closeModal();setRoute('qing');const c=SAGA.find(c=>c.id==='c16');
vnPlay(c.pre,{scene:'camp'});await wait(50);o.n0=el.classList.contains('novel');vnNext();vnNext();await wait(30);o.n1=el.classList.contains('novel')&&document.querySelectorAll('#vn .vn-nv-body p').length===2&&$('#vn .vn-nv-body p').textContent===c.pre[0][1];const nv=$('#vn .vn-novel');o.fit=nv.scrollHeight<=nv.clientHeight+1&&$('#vn .vn-nv-body').scrollHeight<=$('#vn .vn-nv-body').clientHeight+1;
vnNext();vnNext();await wait(30);o.after=!el.classList.contains('novel')&&!!$('#vn .vn-name').textContent;
VN.i=0;vnShow();$('#vn .vn-nv-skip').click();await wait(30);o.skip=VN.i===2&&!el.classList.contains('novel');
vnStop();vnPlay(SAGA.find(c=>c.id==='c1').post,{});await wait(30);o.noLead=!el.classList.contains('novel');vnStop();o.clean=!el.classList.contains('novel');return o});
console.log(vp.width,JSON.stringify(r));for(const k of['n0','n1','fit','after','skip','noLead','clean'])assert(r[k],vp.width+' '+k);assert.deepEqual(errs,[]);await p.close()}
console.log('PASS opening narration as darkened novel page, fades into dialogue, skip to first line, 3 viewports');await b.close()})();
