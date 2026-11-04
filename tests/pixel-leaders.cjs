// 장수급 도트 그림: 전투에서만 characters/pixel을 쓰고(대화 SD는 원본), 보간 없이 그리며, 뒷모습(BACK_READY)은 화면 위쪽으로 움직일 때만 쓴다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c16');R.saga.act=c.act;launchChapter(c);await new Promise(r=>setTimeout(r,1500));
const ids=Object.keys({...COMPANIONS,...FACTION_CHARACTERS}),srcs=ids.map(id=>companionArt.get(id)?.src||'').filter(Boolean),rulers=FKEYS.map(f=>rulerArt.get(f)?.src||'');
const lord=units.find(u=>!u.side&&u.type==='hero'),led=units.find(u=>!u.side&&u.commander&&u.type!=='hero');
// 그릴 때 보간 상태와 그림 기록
const orig=ctx.drawImage.bind(ctx),log=[];ctx.drawImage=function(img,...a){log.push({src:img.src||'canvas',back:!!img.isBack,smooth:ctx.imageSmoothingEnabled});return orig(img,...a)};
const drawOne=u=>{log.length=0;ctx.save();animUnit=u;if(u.type==='hero')drawUnitArt('hero',0,-16,-35,32,38);else drawCompanionArt(u.commander,u.type,0,-16,-35,32,38);animUnit=null;ctx.restore();return log.slice()};
ctx.imageSmoothingEnabled=true;const front=[drawOne(lord),drawOne(led)];
// 가짜 뒷모습: 뒤로 움직이면 쓰이고, 앞으로 움직이면 원래대로
const fake=n=>{const cv=document.createElement('canvas');cv.width=40;cv.height=60;cv.isBack=true;backArt.set(n,cv)};fake('hero');fake(characterSprite(led.commander).split('/').pop().replace('.webp',''));
const move=(u,dx,dy)=>{for(let i=0;i<40;i++){u.vsy=(u.vsy||0)*.8+dx+dy;backTo(u,u.vsy<0,1/30,Math.abs(u.vsy)>6)}};
move(lord,-4,-4);move(led,-4,-4);const up=[drawOne(lord),drawOne(led),lord.vback,led.vback];move(lord,4,4);move(led,4,4);const down=[drawOne(lord),drawOne(led),lord.vback,led.vback];
const brief=[];for(let i=0;i<5;i++){const u={vback:false};u.vsy=-8;backTo(u,true,1/30,false);brief.push(!!u.vback)}
ctx.drawImage=orig;backArt.clear();
// 대화 SD는 원본 그림을 쓴다
vnPlay([['o_muk','시험']],{});await new Promise(r=>setTimeout(r,400));const vn=[...document.querySelectorAll('#vn img')].map(i=>i.src);window.closeVN?.();
return{srcs,rulers,front,up,down,brief,vn,files:await Promise.all(srcs.concat(rulers).map(s=>fetch(s).then(r=>r.ok)))}});
assert(r.srcs.length>=15&&r.srcs.every(s=>s.includes('/characters/pixel/')),JSON.stringify(r.srcs));assert(r.rulers.every(s=>s.includes('/characters/pixel/')),JSON.stringify(r.rulers));assert(r.files.every(Boolean));
for(const l of r.front){assert(l.length===1&&l[0].src.includes('/characters/pixel/')&&l[0].smooth===false&&!l[0].back,JSON.stringify(r.front))}
assert(r.up[2]===true&&r.up[3]===true&&r.up.slice(0,2).every(l=>l[0].back&&l[0].smooth===false),JSON.stringify(r.up));
assert(r.down[2]===false&&r.down[3]===false&&r.down.slice(0,2).every(l=>!l[0].back),JSON.stringify(r.down));
assert(r.brief.every(v=>!v),'뒷모습 전환은 .45초 유지가 필요');
assert(r.vn.length&&r.vn.every(s=>!s.includes('/characters/pixel/')),JSON.stringify(r.vn));
assert.deepEqual(errors,[]);console.log('PASS',r.srcs.length,'pixel leaders + rulers, nearest draw, back view only while moving up-screen, dialogue keeps original art');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
