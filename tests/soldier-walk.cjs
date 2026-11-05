// 병사 걷기 프레임(characters/soldier-walk/<병종>/<방향>-1..4.webp, SOLDIER_WALK_READY): 걷는 동안만, 실제 걸음 위상으로 1→2→3→4 순환,
// 방향별 선택·뒤집기 상쇄·적 진영색, 멈추면 정지 그림, 프레임이 있으면 코드 도약을 줄인다. 등록된 그림은 모두 불러와야 한다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c3');R.saga.act=c.act;launchChapter(c);await new Promise(r=>setTimeout(r,2500));
 const want=Object.entries(SOLDIER_WALK_READY).flatMap(([n,ks])=>ks.split(',').map(k=>n+'/'+k)),have=[...soldierWalk].flatMap(([n,t])=>Object.keys(t).filter(k=>t[k].length===4).map(k=>n+'/'+k));
 const real=new Map(soldierWalk);soldierWalk.clear();const mk=(k,i)=>{const cv=document.createElement('canvas');cv.width=50;cv.height=80;const x=cv.getContext('2d');x.fillStyle='#'+(i*3)+'8'+(i*2);x.fillRect(5,0,40,80);cv.tag=k+i;cv.foot=.5;return cv};const set={};for(const k of['fr','fl','br','bl']){set[k]=[1,2,3,4].map(i=>mk(k,i));set[k].foot=.5}soldierWalk.set('spear',set);
 const orig=ctx.drawImage.bind(ctx);let log=[];ctx.drawImage=function(img,...a){log.push({tag:img.tag||[...tintCache].find(([k,m])=>[...m.values()].includes(img))?.[0]?.tag||null,src:img.src||'canvas',a:ctx.getTransform().a});return orig(img,...a)};
 const draw=(side,vb,f,vmT,stp)=>{const u={type:'spear',side,dir:0,vback:!!vb,vface:f,vmT,stp};log=[];ctx.save();ctx.scale(f,1);animUnit=u;drawUnitArt('spear',side,-16,-35,32,38);animUnit=null;ctx.restore();return log[0]};
 const seq=[0,.5,1,1.5,2,2.5].map(s=>draw(0,0,1,.3,s).tag),dirs={};for(const side of[0,1])for(const[vb,f]of[[0,1],[0,-1],[1,1],[1,-1]])dirs[side+(vb?'b':'f')+(f<0?'l':'r')]=draw(side,vb,f,.3,.5);
 const still=draw(0,0,1,0,.5),bow=(()=>{const u={type:'bow',side:0,dir:0,vface:1,vmT:.3,stp:.5};log=[];animUnit=u;drawUnitArt('bow',0,-16,-35,32,38);animUnit=null;return log[0]})();
 // soldier(): 프레임이 있으면 도약이 작다
 const sp=units.find(u=>!u.side&&u.type==='spear'&&!u.commander)||units.find(u=>u.type==='spear'&&!u.commander);let ty=[];const ot=ctx.translate.bind(ctx);ctx.translate=(x,y)=>{ty.push(y);return ot(x,y)};const bob=on=>{if(!on)soldierWalk.delete('spear');else soldierWalk.set('spear',set);Object.assign(sp,{vmT:.3,stp:.5,vface:1,vback:false,phase:0,attackAnim:0,recoil:0});ty=[];soldier(sp);return Math.min(...ty)};const bobOn=bob(true),bobOff=bob(false);ctx.translate=ot;
 ctx.drawImage=orig;soldierWalk.clear();for(const[k,v]of real)soldierWalk.set(k,v);return{want,have,seq,dirs,still,bow,bobOn,bobOff}});
assert.deepEqual(r.have.sort(),r.want.sort(),'등록한 걷기 프레임이 모두 불러와져야 한다');
assert.deepEqual(r.seq,['fr1','fr2','fr3','fr4','fr1','fr2'],'걸음 위상 0.5마다 다음 프레임: '+r.seq);
for(const k of['fr','fl','br','bl']){assert.equal(r.dirs['0'+k].tag,k+'2','아군 '+k);assert(r.dirs['0'+k].a>0,'뒤집지 않음 '+k);assert.equal(r.dirs['1'+k].tag,k+'2','적 '+k+'는 진영색 입힌 같은 프레임');assert(r.dirs['1'+k].src==='canvas')}
assert(r.still.tag!=='fr2','멈추면 걷기 프레임을 쓰지 않는다');assert(r.bow.src.endsWith('/bow.webp')||r.bow.src.includes('soldier-dir/bow'),'프레임 없는 병종은 기존 그림');
assert(r.bobOn>=-1.6&&r.bobOff>=-1.6,'걸을 때 위아래 도약은 거의 없다(좌우 기우뚱으로 걸음 표현) '+r.bobOn+' '+r.bobOff);
assert.deepEqual(errors,[]);console.log('PASS soldier walk',r.want.length,'registered; frames cycle with stride, per-direction, unflipped, enemy tinted, still frame when idle, tiny bob');await b.close()})();
