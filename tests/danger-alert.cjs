// 적의 매복 발동·적의 기습(숨어 있던 적이 우리를 침)은 화면 가로 붉은 띠의 큰 경보와 가장자리 붉은 번쩍임으로 알린다.
// 경보가 떠 있는 동안 일반 배너가 덮지 않는다. 우리 매복·기습은 기존 금빛/초록 배너. 3화면에서 띠가 화면 안·큰 글씨. 매복 장은 시작 승리 조건 안내에 매복 주의.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
for(const vp of[{width:320,height:568},{width:390,height:844},{width:844,height:390}]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={},pu=()=>document.querySelector('#powerup');const open=async(id)=>{closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(60);return c};
const look=()=>{const b=pu(),r=b.getBoundingClientRect(),t=b.querySelector('b'),fs=parseFloat(getComputedStyle(t).fontSize),tr=t.getBoundingClientRect();return{alert:b.classList.contains('alert')&&!b.classList.contains('hidden'),txt:b.textContent,fs,inView:r.left>=-1&&r.right<=innerWidth+1&&tr.left>=-1&&tr.right<=innerWidth+1&&r.top>=0&&r.bottom<=innerHeight,flash:document.querySelector('#dangerflash')?.classList.contains('go')}};
// 시작 안내: 매복 장
await open('c16');await wait(400);o.goal=pu().textContent;
// 적 매복 발동
await wait(2600);{const e=units.find(u=>u.hp>0&&u.side&&u.ambush),sq=units.filter(u=>u.squad===e.squad&&u.hp>0),foot=units.find(u=>u.hp>0&&!u.side&&u.type==='shield'&&!u.royalGuard);foot.x=e.x+180;foot.y=e.y;visAt=0;computeVision();ambushTick();await wait(120);o.amb=look();
// 경보 중 일반 배너는 덮지 않음
powerBanner('★ 시설 강화','x','#ffd34d');o.kept=pu().textContent.includes('적의 매복');
// 같은 순간 이어진 적 기습은 경보를 다시 띄우지 않음(매복 경보 유지)
const s0=sq[0];s0.hidT=time;surpriseMul(s0,foot,{total:1});o.keptSurp=pu().textContent.includes('적의 매복')}
// 적의 기습(따로): 3초 뒤
time+=4;await wait(50);{const v=units.find(u=>u.hp>0&&!u.side&&u.type==='bow'&&!u.royalGuard)||units.find(u=>u.hp>0&&!u.side&&!u.structure&&u.type!=='keep'),e=units.find(u=>u.hp>0&&u.side&&!u.structure&&u.type!=='gate'&&u.type!=='boss');surprised.clear();e.hidT=time;surpriseMul(e,v,{total:1});await wait(120);o.surp=look()}
// 3.4초 뒤 사라짐, 그 뒤 일반 배너는 정상
await wait(3600);o.gone=pu().classList.contains('hidden');powerBanner('★ 시설 강화','x','#ffd34d');o.normal=!pu().classList.contains('alert')&&pu().textContent.includes('시설');
// 우리 기습은 경보가 아님
time+=10;{const v=units.find(u=>u.hp>0&&u.side&&!u.structure&&u.type!=='gate'&&u.type!=='boss'),a=units.find(u=>u.hp>0&&!u.side&&!u.structure&&u.type!=='keep');surprised.clear();a.hidT=time;surpriseMul(a,v,{total:1});await wait(80);o.ours=!pu().classList.contains('alert')&&/기습/.test(pu().textContent)}
return o});
console.log(vp.width,JSON.stringify(r));
assert(/매복 주의/.test(r.goal),'시작 안내 매복 주의');assert(r.amb.alert&&/적의 매복/.test(r.amb.txt)&&r.amb.flash,'적 매복 큰 경보');assert(r.amb.fs>=29,'큰 글씨 '+r.amb.fs);assert(r.amb.inView,vp.width+' 화면 안');
assert(r.kept,'경보 중 일반 배너가 덮지 않음');assert(r.keptSurp,'이어진 기습이 매복 경보를 덮지 않음');assert(r.surp.alert&&/적의 기습|적의 후방 기습/.test(r.surp.txt)&&r.surp.inView,'적 기습 경보');
assert(r.gone&&r.normal,'경보 끝나면 일반 배너 정상');assert(r.ours,'우리 기습은 금빛 배너');await p.close()}
assert.deepEqual(errs,[]);console.log('PASS enemy ambush/surprise big red alert + edge flash, not overwritten, ours unchanged, start-of-battle ambush warning, 3 viewports');await b.close()})();
