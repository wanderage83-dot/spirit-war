// 원형 메뉴: 부대를 고른 직후(카메라가 미끄러지는 0~0.5초) 항목을 눌러도 들어가야 한다. 메뉴는 도착할 카메라 기준 자리에 바로 서고, 열릴 때 항목이 가운데서 날아오지 않는다(휴대폰 터치·PC 마우스 각 24번).
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch();const URL=process.argv[2]||'http://127.0.0.1:8782/';
for(const vp of[{width:390,height:844,hasTouch:true,isMobile:true},{width:1280,height:800}]){const p=await b.newPage({viewport:{width:vp.width,height:vp.height},hasTouch:!!vp.hasTouch,isMobile:!!vp.isMobile});await p.goto(URL);await p.waitForTimeout(1500);
await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));closeModal();CHRON=false;setRoute('qing');newRealm();storyState().intro=true;showRealm();launchChapter(SAGA.find(c=>c.id==='c2'));await wait(4500);document.querySelectorAll('#powerup').forEach(e=>e.classList.add('hidden'))});
let ok=0,fail=0,why=[];
for(let it=0;it<24;it++){const g=1+it%3,delay=[0,40,80,120,160,220,300,500][it%8];
 await p.evaluate(g=>{closeRing();ring.pick=false;mode=null;apReadyClose&&apReadyClose();selected=-1;choose(g)},g);
 await p.waitForTimeout(delay);
 const pt=await p.evaluate(()=>{const b=[...document.querySelectorAll('#ring:not(.hidden) .ring-item')].find(b=>b.dataset.k==='move');if(!b)return null;const r=b.getBoundingClientRect();return{x:r.left+r.width/2,y:r.top+r.height/2}});
 if(!pt){await p.waitForTimeout(60);it--;if(why.length>200)break;why.push('noring@'+delay);continue}
 if(vp.hasTouch){await p.touchscreen.tap(pt.x,pt.y)}else{await p.mouse.move(pt.x,pt.y);await p.mouse.down();await p.waitForTimeout(110);await p.mouse.up()}
 await p.waitForTimeout(60);const r=await p.evaluate(()=>ring.pick==='move'||ring.pick===true||mode==='move'||!!ring.pick);if(r)ok++;else{fail++;why.push('fail@'+delay)}}
console.log(vp.width,'ok',ok,'fail',fail,why.filter(w=>w.startsWith('fail')).join(' '));assert.equal(fail,0,vp.width+' 메뉴 누르기 실패 '+fail);await p.close()}console.log('PASS ring menu taps land during camera glide/open animation, touch + mouse');await b.close()})();
