// 장수 걷기 프레임(characters/pixel/walk/<이름>/<방향>-1..4.webp, PIXEL_WALK_READY): 20명×4방향 로드, 걷는 동안만 걸음 위상으로 순환,
// 방향별·뒤집기 상쇄·적장(진영 군주) 포함, 멈추면 정지 그림, 흑화는 제외, 네 프레임 발 위치 동일.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c16');R.saga.act=c.act;launchChapter(c);await new Promise(r=>setTimeout(r,4000));
 const want=Object.entries(PIXEL_WALK_READY).flatMap(([n,ks])=>ks.split(',').map(k=>n+'/'+k)),have=[...leaderWalk].flatMap(([n,t])=>Object.keys(t).map(k=>n+'/'+k));
 const feet=[...leaderWalk].flatMap(([n,t])=>Object.values(t).map(s=>new Set(s.map(m=>m.foot)).size));
 const orig=ctx.drawImage.bind(ctx);let log=[];ctx.drawImage=function(img,...a){log.push({src:img.src||'canvas',a:ctx.getTransform().a});return orig(img,...a)};
 const lord=units.find(u=>!u.side&&u.type==='hero'),led=units.find(u=>!u.side&&u.commander&&u.type!=='hero');
 const draw=(u,vb,f,vmT,stp)=>{Object.assign(u,{vback:!!vb,vface:f,vmT,stp});log=[];ctx.save();ctx.scale(f*(u.commander?artFlip(u):1),1);animUnit=u;if(u.type==='hero')drawUnitArt('hero',0,-16,-35,32,38);else drawCompanionArt(u.commander,u.type,0,-16,-35,32,38);animUnit=null;ctx.restore();return log[0]};
 const seq=[0,.5,1,1.5,2].map(s=>draw(lord,0,1,.3,s).src.split('/').slice(-2).join('/')),dirs={};for(const[vb,f]of[[0,1],[0,-1],[1,1],[1,-1]]){const k=(vb?'b':'f')+(f<0?'l':'r');dirs[k]=[draw(lord,vb,f,.3,.5),draw(led,vb,f,.3,.5)]}
 const still=draw(lord,0,1,0,.5),led2=units.find(u=>!u.side&&u.commander&&u.type!=='hero');led2.fallenHero=true;const dark=draw(led2,0,1,.3,.5);led2.fallenHero=false;
 // 적장: 진영 군주 그림이 있으면 그 걷기 프레임
 tintEnemies('bai');const boss={type:'boss',side:1,dir:0};Object.assign(boss,{vface:1,vback:false,vmT:.3,stp:.5});log=[];animUnit=boss;drawUnitArt('boss',1,-16,-35,32,38);animUnit=null;const bossD=log[0];tintEnemies('gui');
 ctx.drawImage=orig;return{want,have,feet,seq,dirs,still,dark,bossD,ledName:artName(characterSprite(led.commander))}});
assert.equal(r.want.length,80,'20명×4방향');assert.deepEqual(r.have.sort(),r.want.sort(),'모든 걷기 프레임 로드');assert(r.feet.every(n=>n===1),'네 프레임 발 위치 동일');
assert.deepEqual(r.seq,['hero/fr-1.webp','hero/fr-2.webp','hero/fr-3.webp','hero/fr-4.webp','hero/fr-1.webp'],'걸음 위상 순환 '+r.seq);
for(const k of['fr','fl','br','bl']){assert(r.dirs[k][0].src.endsWith('/walk/hero/'+k+'-2.webp')&&r.dirs[k][0].a>0,'군주 '+k+JSON.stringify(r.dirs[k][0]));assert(r.dirs[k][1].src.endsWith('/walk/'+r.ledName+'/'+k+'-2.webp')&&r.dirs[k][1].a>0,'장수 '+k+JSON.stringify(r.dirs[k][1]))}
assert(!r.still.src.includes('/walk/'),'멈추면 정지 그림');assert(!r.dark.src.includes('/walk/'),'흑화는 걷기 프레임 제외');assert(r.bossD.src.endsWith('/walk/bai-ruler/fr-2.webp'),'적장 걷기 '+JSON.stringify(r.bossD));
assert.deepEqual(errors,[]);console.log('PASS leader walk 80 sets (20 leaders x 4 dirs) cycle with stride, unflipped, enemy rulers too, still/fallen use static art, stable feet');await b.close()})();
