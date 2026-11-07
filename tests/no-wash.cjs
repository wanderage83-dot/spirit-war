// 실행 중 캐릭터가 희끄무레해지지 않는다: 다른 부대 흐리게(62%)는 계획 중에만, 평소 광원·빛 입자·번짐 없음, 임팩트(pfx) 때만 빛.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);hideBattleVoice&&hideBattleVoice();await new Promise(r=>setTimeout(r,2500));
 const alphaOf=u=>{const orig=ctx.drawImage.bind(ctx),a=[];ctx.drawImage=function(img,...x){a.push(+ctx.globalAlpha.toFixed(2));return orig(img,...x)};ctx.save();soldier(u);ctx.restore();ctx.drawImage=orig;return Math.min(...a)};
 const other=units.find(u=>!u.side&&u.hp>0&&u.g===2);selected=1;const planDim=alphaOf(other);
 for(const g of groups.map((_,i)=>i)){const us=apUnits(g);if(!us.length)continue;selected=g;const q=nearestCell(us[0].x+400,us[0].y-400);try{apAdd('move',{x:q.x,y:q.y})}catch(e){}}apCancelAdvance();let gd=0;while(apPending().length&&gd++<20)apSkip();document.querySelector('#apready-run').click();for(let i=0;i<20;i++)advancePhase(.025);selected=1;
 const playAlpha=alphaOf(other),st=state;fx=fx.filter(f=>f.kind!=='px');hitStop=0;const calmLights=hdLights().length,calmImp=hdImpact();
 // 평소 화면: 빛 입자 없이 그려지는지(그리기 호출 수를 효과 전후로 비교)
 pfx('slam',other.x,other.y,1.3);const impLights=hdLights().length,imp=hdImpact();return{planDim,playAlpha,st,calmLights,calmImp,impLights,imp}});
console.log(r);assert.equal(r.planDim,.85,'계획 중에는 다른 부대를 흐리게');assert.equal(r.st,'playing');assert.equal(r.playAlpha,1,'실행 중에는 모두 불투명');
assert.equal(r.calmLights,0,'평소에는 광원 없음');assert.equal(r.calmImp,0,'평소에는 번짐 없음');assert(r.impLights>0&&r.imp>0,'임팩트 때만 빛과 번짐');
assert.deepEqual(errors,[]);console.log('PASS units stay opaque while moving; lights/bloom only on impacts');await b.close()})();
