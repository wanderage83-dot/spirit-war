// 필살기 컷인(장수·군주, 차례로 재생, 느린 전투) + 돌격 충돌(충격파·흙덩이) + 배후/측면 글자(부대당 1.2초 한 번) + 동작 줄이기.
// Requires Playwright and Chromium. Serve the repository and pass its URL. SHOT_DIR이 있으면 화면을 저장한다.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),url=process.argv[2]||'http://127.0.0.1:8782',shot=process.env.SHOT_DIR;
for(const vp of[{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){const p=await b.newPage({viewport:vp}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(url);
await p.evaluate(()=>{localStorage.clear();setRoute('qing');newRealm();storyState().intro=true;titleHide();VN_INTRO=false;R.saga.party=['o_muk','o_un','o_dan'];launchChapter(sagaCh('c1'))});
await p.waitForFunction(()=>state==='planning');await p.waitForTimeout(2800);
// 장수 필살기 → 컷인
const r1=await p.evaluate(()=>{const g=groups.findIndex(x=>x.leader&&HERO_SKILLS[x.leader]);selected=g;state='playing';ap.applying=true;useHeroSkill();ap.applying=false;const el=$('#cutin');return{g,id:groups[g].leader,on:el&&el.classList.contains('go'),name:el.querySelector('.ci-name').textContent,src:el.querySelector('.ci-art').getAttribute('src'),slow:slowmo,want:fcSrc(vnSprite(groups[g].leader))}});
assert(r1.g>0&&r1.on&&r1.name.startsWith('✦')&&r1.src===r1.want&&r1.slow>1,JSON.stringify(r1));
// 군주 필살기는 줄을 서서 다음에 나온다
const lordName=await p.evaluate(()=>{const e=units.find(u=>u.side===1&&u.hp>0);resolveSpell('dragon',e.x,e.y);return lordUlt('dragon').name});
await p.waitForTimeout(450);
const art=await p.evaluate(()=>{const r=$('#cutin .ci-art').getBoundingClientRect(),st=$('#stage').getBoundingClientRect(),n=$('#cutin .ci-name').getBoundingClientRect();return{art:r.height>60,inStage:n.right<=st.right+2&&n.left>=st.left-2,queued:cutinQ.length,name:$('#cutin .ci-name').textContent}});
if(shot)await p.screenshot({path:`${shot}/cutin-${vp.width}x${vp.height}.png`});
assert(art.art&&art.inStage&&art.queued===1,JSON.stringify(art));
await p.waitForFunction(n=>$('#cutin .ci-name').textContent.includes(n),lordName,{timeout:3000});
await p.waitForFunction(()=>!cutinBusy&&$('#cutin').classList.contains('hidden'),null,{timeout:4000});
// 돌격 충돌
const r2=await p.evaluate(()=>{fx.length=0;tagPopAt.clear();const t=units.find(u=>u.side===1&&u.hp>0&&isSoldier(u));t.seen=true;t.hid=false;const h=units.find(u=>!u.side&&u.hp>0&&u.type==='horse')||units.find(u=>!u.side&&u.hp>0&&isSoldier(u));h.type='horse';h.x=t.x-60;h.y=t.y;h.run=200;h.charge=4;t.dir=Math.PI;camX=project(t.x,t.y).x-VW/2;camY=project(t.x,t.y).y-VH/2;performAttack(h,t,units.filter(u=>u.hp>0));const k=fx.map(f=>f.kind);return{shock:k.includes('shock'),chunks:k.filter(x=>x==='chunk').length,pop:fx.filter(f=>f.kind==='tagpop').map(f=>f.label),tag:lastHitTag,dmg:fx.find(f=>f.kind==='dmg')?.tag}});
assert(r2.tag==='charge'&&r2.shock&&r2.chunks>=6&&r2.pop.length===0,JSON.stringify(r2));
await p.evaluate(()=>{state='paused';draw()});if(shot){await p.waitForTimeout(60);await p.screenshot({path:`${shot}/charge-${vp.width}x${vp.height}.png`})}
// 배후 글자 + 같은 부대 1.2초 안 반복은 한 번만
const r3=await p.evaluate(()=>{fx.length=0;tagPopAt.clear();const t=units.find(u=>u.side===1&&u.hp>0&&isSoldier(u)&&u.type!=='horse');t.seen=true;t.hid=false;const s=units.find(u=>!u.side&&u.hp>0&&u.type==='spear')||units.find(u=>!u.side&&u.hp>0&&isSoldier(u)&&u.type!=='horse'&&u.type!=='bow');s.x=t.x-40;s.y=t.y;t.dir=0;s.run=0;performAttack(s,t,units.filter(u=>u.hp>0));performAttack(s,t,units.filter(u=>u.hp>0));return{tag:lastHitTag,pops:fx.filter(f=>f.kind==='tagpop').map(f=>f.label)}});
assert(r3.tag==='back'&&r3.pops.length===1&&r3.pops[0]==='배후!',JSON.stringify(r3));
// 전투 초기화가 컷인을 정리
await p.evaluate(()=>{ultCutin('o_un','✦ x','',`#fff`);ultCutin('o_dan','✦ y','',`#fff`);reset()});assert(await p.evaluate(()=>!cutinBusy&&cutinQ.length===0&&$('#cutin').classList.contains('hidden')));
assert.deepEqual(errs,[]);await p.close()}
// 동작 줄이기: 컷인은 짧게(느린 전투 없음), 충격파·흙덩이·글자 없음
{const ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),p=await ctx.newPage();await p.goto(url);
await p.evaluate(()=>{localStorage.clear();setRoute('qing');newRealm();storyState().intro=true;titleHide();R.saga.party=['o_muk','o_un','o_dan'];launchChapter(sagaCh('c1'))});await p.waitForFunction(()=>state==='planning');
const r=await p.evaluate(()=>{state='playing';slowmo=0;ultCutin('o_un','✦ 테스트','','#fff');const s0=slowmo;fx.length=0;const t=units.find(u=>u.side===1&&u.hp>0&&isSoldier(u)),h=units.find(u=>!u.side&&u.hp>0&&isSoldier(u));chargeImpact(h,t);tagPop(t,'back');return{red:rReduced,slow:s0,fx:fx.length}});
assert(r.red&&r.slow===0&&r.fx===0,JSON.stringify(r));await ctx.close()}
console.log('PASS ultimate cut-in (hero/lord queue, slow-mo, art+name in stage, reset) + charge shockwave/chunks, 배후! throttle, reduced motion, 3 viewports');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
