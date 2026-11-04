// HD-2D 화면 효과: 기본 켜짐, ☰ 메뉴 버튼으로 끄고 켜며 저장, 5진영 지도에서 오류 없이 그림이 달라짐, 이름표는 효과 뒤에 그려 흐려지지 않음,
// 느린 기기에서 3초 넘게 28fps 밑이면 가벼운 모드(흐림·빛 번짐 끔), 천하도에서는 그리지 않음. Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(700);
const r=await p.evaluate(()=>{window.requestAnimationFrame=()=>0;const out={def:HD.on};setRoute('qing');newRealm();showRealm();launchChapter(SAGA[0]);hideBattleVoice();
 const px=()=>{const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let s=0;for(let i=0;i<d.length;i+=4097)s+=d[i]+d[i+1]*3+d[i+2]*7;return s};
 out.diff=[];for(const id of['beodeul','hyeonmu','baekho','jujak','gwiwang']){prepareBattlefield(id);HD.on=false;draw();const a=px();HD.on=true;HD.lite=false;draw();const b=px();out.diff.push(a!==b)}
 // 이름표는 효과 뒤
 const order=[],dh=drawHD,df=drawSquadFlags;drawHD=()=>{order.push('hd');dh()};drawSquadFlags=()=>{order.push('flags');df()};draw();drawHD=dh;drawSquadFlags=df;out.order=order.join(',');
 // 가벼운 모드는 화면 복사를 하지 않는다
 let copies=0;const di=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(im,...a){if(im===canvas)copies++;return di.call(this,im,...a)};HD.lite=true;drawHD();const lite=copies;HD.lite=false;drawHD();CanvasRenderingContext2D.prototype.drawImage=di;out.copies=[lite,copies-lite];
 // 버튼과 저장
 $('#hd2dbtn').click();out.offText=$('#hd2dbtn').textContent;out.saved=localStorage.getItem('spiritwar-hd2d');out.offNow=HD.on;$('#hd2dbtn').click();out.onText=$('#hd2dbtn').textContent;
 // 느린 기기 자동 가볍게
 HD.lite=false;HD.slow=0;HD.avg=.016;state='playing';let t=last||1000;for(let i=0;i<120;i++){t+=60;loop(t)}out.autoLite=HD.lite;
 // 천하도에서는 그리지 않음
 showRealm();let called=0;drawHD=()=>{called++};draw();drawHD=dh;out.realm=called;return out});
console.log(JSON.stringify(r));assert.equal(r.def,true);assert.ok(r.diff.every(Boolean),'effect changes all 5 themes');assert.equal(r.order,'hd,flags');assert.deepEqual(r.copies,[0,1]);assert.equal(r.offText,'효과 끔');assert.equal(r.saved,'off');assert.equal(r.offNow,false);assert.equal(r.onText,'효과 켬');assert.equal(r.autoLite,true);assert.equal(r.realm,0);assert.deepEqual(errors,[]);console.log('PASS HD-2D post: default on, toggle+storage, 5 themes, labels stay sharp, lite fallback, not on realm map');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
