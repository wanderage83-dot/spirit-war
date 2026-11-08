// 클로즈업 순간 슬로우모션·유지 3.2초·1.8초 안 겹침 무시, 위기·적 진격 클로즈업, 본진 피습 경보 띠와 주기 알림.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:390,height:844}});const errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);await wait(300);
selected=-1;apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();await wait(100);const o={};
// slow-mo: trigger cine and measure sim time vs wall
const t0=time;cineEvent(KEEP.x,KEEP.y-600,3,'시험');o.slow=slowmo;await wait(500);o.simIn500=+(time-t0).toFixed(3);o.hold=+cine.hold.toFixed(2);
await wait(1500);const t1=time;await wait(500);o.simAfter=+(time-t1).toFixed(3);
// overlapped event within 1.8s ignored
const n0=cine.n;cineEvent(KEEP.x,KEEP.y,3,'a');cineEvent(KEEP.x,KEEP.y,3,'b');o.dup=cine.n-n0;
// base alarm
const k=baseMain();hit(k,5,'melee');await wait(200);o.warn=!$('#basewarn').hidden;o.wtext=$('#basewarn').textContent;o.toast=$('#toast').textContent;
// 위기 알림은 클로즈업을 부른다, 실행 끝나면 경보 띠는 천하도에서 숨김
 cineReset();cine.user=-1e9;const h=units.find(u=>!u.side&&u.type==='hero');const n1=cine.n;battleImpactEmit(h,'위기','시험','test',4);o.crisisCine=cine.n-n1;showRealm();o.hidden=$('#basewarn').hidden;return o});console.log(JSON.stringify(r));
assert(r.slow>0&&r.simIn500<.35,'클로즈업 직후 슬로우모션');assert(r.hold>2.2,'클로즈업 유지 3.2초');assert(r.simAfter>r.simIn500*1.3,'슬로우모션은 잠깐(뒤에는 더 빨리 흐름)');assert.equal(r.dup,0,'1.8초 안 겹친 클로즈업 무시');assert(r.warn&&/본진 공격/.test(r.wtext)&&/본진이 공격/.test(r.toast),'본진 피습 경보');assert.equal(r.crisisCine,1,'위기 클로즈업');assert(r.hidden,'천하도에서 경보 숨김');assert.deepEqual(errs,[]);console.log('PASS close-up slow-mo/hold/dedupe, crisis close-up, base alarm');await b.close()})();
