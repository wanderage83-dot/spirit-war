// 장수 일러스트 4방향(요청 10): 20명×fr/fl/br/bl 80장이 실제로 불려 오고, 이동 방향에 맞는 그림을 반전 없이 그리며,
// 네 방향에서 머리 위·발 위치·크기가 같고(91.2), 걸을 때 다리는 코드로(보병 3번 그리기, 기병 1번) 움직인다.
// 무명 병사는 일러스트를 쓰지 않는다. ?pixel=1이면 옛 도트 경로.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),URL=(process.argv[2]||'http://127.0.0.1:8782').replace(/\/?$/,'/');
const p=await b.newPage({viewport:{width:1280,height:800}}),errs=[],bad=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if((m.type()==='error'||m.type()==='warning')&&!/favicon|status of 404/.test(m.text()))errs.push(m.text())});p.on('response',r=>{if(r.status()>=400&&!/favicon/.test(r.url()))bad.push(r.url())});await p.goto(URL);
await p.waitForFunction(()=>[...illustArt.values()].reduce((a,t)=>a+Object.keys(t).length,0)===80,null,{timeout:20000});
const r=await p.evaluate(()=>{window.requestAnimationFrame=()=>0;const out={names:Object.keys(ILLUST_META).length,sizes:[],dir:[],geo:{},walk:{},misc:{}},K=['fr','fl','br','bl'],face={fr:[1,false],fl:[-1,false],br:[1,true],bl:[-1,true]};
const ids={};for(const id of[...Object.keys(COMPANIONS),...Object.keys(FACTION_CHARACTERS)])ids[artName(characterSprite(id))]=id;const rul={};for(const f of FKEYS)rul[artName(rulerSprite(f))]=f;
for(const[n,t]of illustArt){const s=K.map(k=>t[k].width+'x'+t[k].height);if(new Set(s).size!==1)out.sizes.push(n)}
const old=ctx.drawImage,H=38*BATTLE_FIGURE.leader,W=26;function capture(fn){const calls=[];ctx.drawImage=function(im,...a){const m=ctx.getTransform();calls.push({im,a,m:[m.a,m.b,m.c,m.d,m.e,m.f]})};try{fn()}finally{ctx.drawImage=old}return calls}
function drawN(n){if(ids[n])drawCompanionArt(ids[n],'shield',0,-W/2,-H,W,H);else{const f=rul[n],keep=tintFaction;tintFaction=f;drawUnitArt(f===ROUTE_CFG[ROUTE].faction?'hero':'boss',f===ROUTE_CFG[ROUTE].faction?0:1,-W/2,-H,W,H);tintFaction=keep}}
for(const n of Object.keys(ILLUST_META)){const m=ILLUST_META[n];out.geo[n]=[];for(const k of K)for(const flip of[1,-1]){animUnit={vface:face[k][0],vback:face[k][1],vmT:0,dir:0};ctx.save();ctx.setTransform(flip,0,0,1,500,500);const c=capture(()=>drawN(n));ctx.restore();if(c.length!==1||c[0].im!==illustArt.get(n)[k]||c[0].m[0]<=0)out.dir.push(n+'/'+k+'/'+flip+':'+c.length);const q=c[0];if(!q)continue;const[dx,dy,dw,dh]=q.a.slice(-4),M=q.m,X=v=>M[0]*v+M[4],Y=v=>M[3]*v+M[5];out.geo[n].push([X(dx+dw*m[0])-500,Y(dy+dh*m[1])-500,Y(dy+dh*m[1])-Y(dy+dh*m[2])])}}
// 걷기: 보병은 몸통+두 다리(3번), 기병은 1번. 걸음 위상이 바뀌면 다리 변형이 바뀐다.
for(const n of['dansim','hero','gui-ruler','hoyeon','sayul','biyeon']){const f=s=>{animUnit={vface:1,vback:false,vmT:1,stp:s,dir:0};ctx.save();ctx.setTransform(1,0,0,1,500,500);const c=capture(()=>drawN(n));ctx.restore();return c};const a=f(.5),c=f(1.5);out.walk[n]={n:a.length,diff:a.length===3&&JSON.stringify(a[1].m)!==JSON.stringify(c[1].m),still:(animUnit={vface:1,vmT:0},capture(()=>drawN(n)).length)}}
animUnit={vface:1,vmT:0};out.misc.generic=capture(()=>drawCompanionArt(null,'shield',0,-W/2,-H,W,H)).some(c=>[...illustArt.values()].some(t=>Object.values(t).includes(c.im)));
const dk=capture(()=>drawCompanionArt('o_muk:dark','shield',0,-W/2,-H,W,H));out.misc.dark=dk.length===1&&dk[0].im instanceof HTMLCanvasElement;
out.misc.hasWalk={inf:hasWalk({commander:'o_dan',type:'spear',vface:1}),cav:hasWalk({commander:'o_ho',type:'horse',vface:1})};
// 실제 전투: 아군 장수·군주·적장이 자기 일러스트로 그려진다
setRoute('qing');newRealm();showRealm();const all=[...Object.keys(COMPANIONS),...Object.keys(FACTION_CHARACTERS)];all.forEach(joinHero);const c=sagaCh('c16');R.saga.act=c.act;R.saga.party=all.slice(0,5);launchChapter(c);out.battle=[];for(const u of units.filter(u=>u.commander||u.type==='hero'||u.type==='boss')){const src=u.commander?characterSprite(String(u.commander).replace(':dark','')):u.type==='hero'?rulerSprite(ROUTE_CFG[ROUTE].faction):rulerSprite(tintFaction),t=illustArt.get(artName(src));if(!t)continue;const cs=capture(()=>soldier(u));out.battle.push([u.commander||u.type,cs.some(q=>Object.values(t).includes(q.im))])}
animUnit=null;return out});
assert.equal(r.names,20);assert.deepEqual(r.sizes,[],'한 인물 네 방향 같은 상자');assert.deepEqual(r.dir,[],'방향별 그림·반전 없음');
for(const[n,g]of Object.entries(r.geo)){assert.equal(g.length,8,n);for(const[fx,fy,bh]of g){assert(Math.abs(fx)<.01&&Math.abs(fy)<.01,n+' 발 위치 '+fx+','+fy);assert(Math.abs(bh-91.2)<.01,n+' 머리~발 '+bh)}}
for(const n of['dansim','hero','gui-ruler'])assert(r.walk[n].n===3&&r.walk[n].diff&&r.walk[n].still===1,n+' 보병 걸음 '+JSON.stringify(r.walk[n]));for(const n of['hoyeon','sayul','biyeon'])assert(r.walk[n].n===1&&r.walk[n].still===1,n+' 기병 '+JSON.stringify(r.walk[n]));
assert.equal(r.misc.generic,false,'무명 병사는 일러스트를 쓰지 않음');assert(r.misc.dark,'흑화 장수는 어둡게 칠한 일러스트');assert.deepEqual(r.misc.hasWalk,{inf:true,cav:false});
assert(r.battle.length>=6&&r.battle.every(x=>x[1]),'전투 장수 '+JSON.stringify(r.battle));assert.deepEqual(bad,[]);assert.deepEqual(errs,[]);
// 동작 줄이기: 다리 흔들기 없음
const q=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'});await q.goto(URL);await q.waitForFunction(()=>illustArt.get('dansim')?.fr,null,{timeout:20000});const red=await q.evaluate(()=>{const old=ctx.drawImage;let n=0;ctx.drawImage=function(){n++};animUnit={vface:1,vmT:1,stp:.5};drawCompanionArt('o_dan','spear',0,-13,-91,26,91);ctx.drawImage=old;animUnit=null;return n});assert.equal(red,1);
// 옛 도트 경로
const px=await b.newPage();await px.goto(URL+'?pixel=1');await px.waitForTimeout(1500);assert.deepEqual(await px.evaluate(()=>[ILLUST_LEADERS,illustArt.size]),[false,0]);
// 3화면 실제 전투 렌더 오류 없음
for(const[w,h]of[[390,844],[844,390],[1280,800]]){const v=await b.newPage({viewport:{width:w,height:h}}),e=[];v.on('pageerror',x=>e.push(String(x)));await v.goto(URL);await v.waitForFunction(()=>illustArt.size===20,null,{timeout:20000});await v.evaluate(()=>{CHAPTER_CARD=false;setRoute('xuan');newRealm();showRealm();const c=SAGA[0];R.saga.act=c.act;launchChapter(c);const hu=units.find(u=>!u.side&&u.type==='hero');centerOn(hu.x,hu.y);draw()});assert.deepEqual(e,[],w+'x'+h)}
await b.close();console.log('PASS illust leaders: 80 loaded, per-direction art unmirrored, feet/head fixed across directions (91.2), coded leg swing (cavalry none), generic soldiers unaffected, dark/fallen, reduced motion, ?pixel=1 fallback, 3 viewports')})().catch(e=>{console.error(e);process.exit(1)});
