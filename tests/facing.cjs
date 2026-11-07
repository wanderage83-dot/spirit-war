// 이동 방향과 그림 방향: 뒷걸음질 없이 실제 화면 이동 쪽을 보고, 왼쪽을 보는 원본 그림은 뒤집어 그린다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(800);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();launchChapter(SAGA[1]);hideBattleVoice&&hideBattleVoice();events=[];nextRaid=1e9;
 const u=units.find(v=>!v.side&&v.type==='shield'),o={};units.filter(v=>v!==u&&v.type!=='keep').forEach(v=>{v.x=200;v.y=200;v.hp=v.side?0:v.hp});
 // 오른쪽(화면)을 보고 있다가 왼쪽 화면으로 이동: dir이 아직 오른쪽이어도 그림은 즉시 이동 방향
 u.dir=0;u.vface=1;const sx=x=>x;let ox=u.x,oy=u.y;
 const step=(dx,dy,n=8)=>{for(let i=0;i<n;i++){const px=u.x,py=u.y;u.x+=dx;u.y+=dy;u.moving=true;u.vsx=(u.vsx||0)*.8+(u.x-px)-(u.y-py);if(Math.abs(u.vsx)>2.5)u.vface=u.vsx>0?1:-1}};
 step(-3,3);o.leftMove=u.vface;o.dirStill=+((Math.cos(u.dir)-Math.sin(u.dir))>0);step(3,-3);o.rightMove=u.vface;
 // 실제 update 경로: move 명령으로 왼쪽 아래 화면 방향으로 보내기
 o.real=await (async()=>{setRoute('qing');newRealm();showRealm();launchChapter(SAGA[0]);hideBattleVoice&&hideBattleVoice();events=[];nextRaid=1e9;units.filter(v=>v.side).forEach(v=>{v.x=200;v.y=200});const us=apUnits(1);us.forEach(v=>{v.dir=0;v.vface=1});const c=us[0],tx=c.x-500,ty=c.y+500,q=nearestCell(tx,ty);selected=1;apAdd('move',{x:q.x,y:q.y});apCancelAdvance();while(apPending().length)apSkip();$('#apready-run').click();let frames=0,back=0;const last=new Map(us.map(v=>[v,{x:v.x,y:v.y}]));for(let i=0;i<300&&state==='playing';i++){advancePhase(.025);for(const v of us){const l=last.get(v),sx=(v.x-l.x)-(v.y-l.y);last.set(v,{x:v.x,y:v.y});if(v.moving&&Math.abs(sx)>1){frames++;const f=v.vface||((Math.cos(v.dir)-Math.sin(v.dir))<0?-1:1);if(Math.sign(sx)!==f)back++}}}return{frames,back}})();
 o.artLeft=['gui-ruler','zhu-ruler'].every(n=>artFacesLeft('characters/x/'+n+'.webp'))&&['heukcheol','mujin'].every(n=>!artFacesLeft('characters/x/'+n+'.webp'))&&!artFacesLeft('hero.webp')&&!artFacesLeft('characters/biyeon.webp');
 // 그리기: ctx.scale 첫 인자의 부호로 실제 반전 확인
 const sc=[];const orig=ctx.scale.bind(ctx);ctx.scale=(a,b2)=>{sc.push(a);return orig(a,b2)};u.vface=-1;sc.length=0;soldier(u);o.drawn=Math.sign(sc.find(a=>Math.abs(a)>.5&&Math.abs(Math.abs(a)-1)>.01)||0);
 const fh=units.find(v=>v.type==='boss')||u;fh.commander='o_heuk';await new Promise(r=>setTimeout(r,50));
 const img=companionArt.get('o_heuk')||[...companionArt.values()].find(a=>a.faceLeft);o.heukLeft=!!img?.faceLeft;ctx.scale=orig;
 // 대화: 오른쪽에 오른쪽 보는 그림은 거울, 왼쪽 보는 그림은 원본 / 왼쪽은 그 반대
 const el=document.querySelector('.vn-r'),el2=document.querySelector('.vn-l');vnActor(el,'o_dog');o.r1=getComputedStyle(el).scale;vnActor(el2,'o_hero');o.l1=getComputedStyle(el2).scale;
 const lid='ruler:gui';vnActor(el,lid);o.r2=getComputedStyle(el).scale;vnActor(el2,lid);o.l2=getComputedStyle(el2).scale;o.lid=lid;return o});
console.log(r);assert.equal(r.leftMove,-1);assert.equal(r.rightMove,1);assert.equal(r.dirStill,1);assert.ok(r.real.frames>200&&r.real.back/r.real.frames<.03,'backpedal');assert.ok(r.artLeft);assert.equal(r.drawn,-1);assert.equal(r.heukLeft,false);
assert.equal(r.r1,'-1 1');assert.ok(['1 1','1','none'].includes(r.l1));assert.ok(['1 1','1','none'].includes(r.r2));assert.equal(r.l2,'-1 1');assert.deepEqual(errors,[]);console.log('PASS facing follows screen movement, left-facing art flipped in battle/dialogue/map');await b.close()})();
