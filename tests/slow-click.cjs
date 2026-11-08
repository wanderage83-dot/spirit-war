// PC에서 천천히 누른 클릭(누름 0.4초 뒤 뗌)도 아래 명령 띠·본진 창 버튼에 들어간다. 0.2초마다 같은 내용으로 버튼을 다시 만들지 않는지 확인.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1200);
await p.evaluate(async()=>{closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);hideBattleVoice&&hideBattleVoice();await new Promise(r=>setTimeout(r,2900));closeRing();choose(1);closeRing()});
const slow=async sel=>{const el=await p.$(sel);const bx=await el.boundingBox();await p.mouse.move(bx.x+bx.width/2,bx.y+bx.height/2);await p.mouse.down();await p.waitForTimeout(450);await p.mouse.up()};
// 1) 넘김
await slow('#apstrip button[onclick="apSkip()"]');await p.waitForTimeout(100);const skipped=await p.evaluate(()=>ap.done.has(1));
// 2) 본진 창 신병 버튼(군량 충분)
await p.evaluate(()=>{gold=999;openBase(0)});await p.waitForTimeout(300);const q0=await p.evaluate(()=>queue.length);await slow('#trainbuttons button[data-train]:not([disabled])');await p.waitForTimeout(100);const q1=await p.evaluate(()=>queue.length);
// 3) 변경 감시: 2초 동안 버튼 묶음이 다시 만들어지지 않음
const rebuilt=await p.evaluate(async()=>{let n=0;const mo=new MutationObserver(ms=>{for(const m of ms)if([...m.removedNodes].some(x=>x.nodeType===1&&(x.tagName==='BUTTON'||x.querySelector?.('button'))))n++});for(const id of['apstrip','trainbuttons','basebuttons'])mo.observe(document.getElementById(id),{childList:true,subtree:true});await new Promise(r=>setTimeout(r,2000));mo.disconnect();return n});
console.log({skipped,q0,q1,rebuilt});assert(skipped,'천천히 누른 넘김');assert(q1===q0+1,'천천히 누른 신병 훈련');assert.equal(rebuilt,0,'같은 내용이면 버튼을 다시 만들지 않음');assert.deepEqual(errors,[]);console.log('PASS slow PC clicks land on command strip and base buttons; no idle rebuilds');await b.close()})();
