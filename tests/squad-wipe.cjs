// 아군 부대가 전멸하면(위기 알림을 이미 받았어도) 그 자리로 클로즈업하고 「○○ 부대 전멸」 소식(긴급 보고 띠·큰 배너·기록)을 한 번 띄운다. 적 부대 전멸·군주 부대·전투 시작 때는 띄우지 않는다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),URL=(process.argv[2]||'http://127.0.0.1:8782').replace(/\/?$/,'/');
for(const[w,h]of[[390,844],[1280,800]]){const p=await b.newPage({viewport:{width:w,height:h}}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{window.requestAnimationFrame=()=>0;CHAPTER_CARD=false;setRoute('qing');newRealm();showRealm();const c=sagaCh('c2');R.saga.act=c.act;launchChapter(c);hideBattleVoice&&hideBattleVoice();const o={};
 const step=n=>{for(let i=0;i<n&&state==='playing';i++)advancePhase(.05)};const logs=[],os=window.say;window.say=(t,...a)=>{logs.push(String(t));return os(t,...a)};
 selected=-1;apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();cineUser&&0;cine.user=-1e9;step(10);o.start=document.querySelector('#battleimpact').classList.contains('hidden')||!/전멸/.test(document.querySelector('#battleimpact b').textContent);
 // 적 부대 하나 전멸: 소식 없음
 const es=units.filter(u=>u.side&&u.hp>0&&!['keep','gate','cart','boss'].includes(u.type)),eq=es[0].squad;units.filter(u=>u.squad===eq).forEach(u=>u.hp=0);step(10);o.enemy=!logs.some(t=>/부대 전멸/.test(t));
 // 아군: 먼저 위기(35% 이하)를 받은 뒤 전멸
 const g=groups.findIndex((G,i)=>i>0&&apUnits(i).length),us=apUnits(g),name=heroName(groups[g].leader);us.forEach(u=>u.hp=Math.max(1,u.max*.3));battleImpacts.next=0;step(8);o.crisis=/위기/.test(document.querySelector('#battleimpact b').textContent);
 await new Promise(r=>setTimeout(r,1900));cine.user=-1e9;const c0=cine.n;const pos=centroid(apUnits(g));apUnits(g).forEach(u=>u.hp=0);step(8);
 o.say=logs.filter(t=>t===name+' 부대 전멸').length;o.strip=!document.querySelector('#battleimpact').classList.contains('hidden')&&document.querySelector('#battleimpact b').textContent;o.banner=document.querySelector('#powerup b')?.textContent;o.cine={n:cine.n-c0,label:cine.label,d:Math.hypot(cine.x-pos.x,cine.y-pos.y)};step(40);o.once=logs.filter(t=>/부대 전멸/.test(t)).length;
 const sb=document.querySelector('#battleimpact').getBoundingClientRect();o.fit=sb.width===0||sb.left>=-1&&sb.right<=innerWidth+1;return o});
assert(r.start,'시작 때 없음');assert(r.enemy,'적 전멸은 아군 소식 없음');assert(r.crisis,'위기 먼저');assert.equal(r.say,1);assert(/전멸/.test(r.strip)&&!/부대 부대/.test(r.strip),'긴급 보고 띠 '+r.strip);assert(/부대 전멸/.test(r.banner||''),'배너 '+r.banner);assert(r.cine.n>=1&&/전멸/.test(r.cine.label)&&r.cine.d<200,'클로즈업 '+JSON.stringify(r.cine));assert.equal(r.once,1,'한 번만');assert(r.fit);assert.deepEqual(errs,[]);await p.close()}
await b.close();console.log('PASS squad wipe: close-up + urgent strip + banner + log once, after an earlier crisis, not for enemies or at start, 2 viewports')})().catch(e=>{console.error(e);process.exit(1)});
