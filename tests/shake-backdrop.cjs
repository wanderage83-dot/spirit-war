// 화면 흔들림이 계획·일시정지·종료 상태에서도 실제 시간으로 잦아드는지, 맵 바깥 여백이 검은색인지
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:900,height:700}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));titleHide();const o={shake:{},corner:{}};
 for(const id of['c2','c10']){setRoute('qing');newRealm();showRealm();const c=SAGA.find(x=>x.id===id);R.saga.act=c.act;launchChapter(c);await wait(300);setZoom(.1);await wait(400);const d=ctx.getImageData(2,canvas.height-200,1,1).data;o.corner[id]=[d[0],d[1],d[2]]}
 for(const st of['planning','paused','ending']){const prev=state;state=st;shake=16;await wait(700);o.shake[st]=shake;state=prev}
 return o});
for(const [k,v] of Object.entries(r.shake))assert.equal(v,0,k+' 흔들림이 잦아들어야');for(const [k,c] of Object.entries(r.corner))assert.ok(c.every(x=>x<70)&&Math.abs(c[2]-c[0])<15,k+' 맵 바깥 검은색 '+c);
assert.deepEqual(errors,[]);console.log(JSON.stringify(r));console.log('shake-backdrop ok');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
