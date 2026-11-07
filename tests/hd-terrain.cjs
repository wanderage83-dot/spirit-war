// 요청 6 청룡 시험 세트(2차 성벽·모서리·길 포함): 버들골에만 HD 바닥·길·대숲·집·성벽·모서리를 쓰고, 판정·충돌·경로와 다른 지역은 그대로다.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),errs=[];
for(const v of[{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){const p=await b.newPage({viewport:v});p.on('pageerror',e=>errs.push(e.message));await p.goto(process.argv[2]||'http://127.0.0.1:8782');await p.waitForFunction(()=>typeof hdArt!=='undefined'&&hdArt.size===6,null,{timeout:15000});
 const r=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();launchChapter(SAGA[0]);weather='clear';const out={region:battleRegion,on:hdOn(),tiles:[hdTile('qing-ground').width,hdTile('qing-road').width,hdTile('qing-road').height]};
  const col=Array.from(blockGrid).join(''),route=JSON.stringify(battleRoutes());const px=bg.getContext('2d').getImageData(600,1200,200,200).data;const fine=d=>{let n=0;for(let y=0;y<200;y++)for(let x=1;x<200;x++){const i=(y*200+x)*4;if(d[i]!==d[i-4]||d[i+1]!==d[i-3])n++}return n/(200*199)};out.fine=+fine(px).toFixed(3);
  // 그림별 실제 drawImage 호출 수
  const srcs=new Map();const orig=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(im,...a){const k=im&&im.src?im.src.split('/').pop():im===hdTile('ally-wall-m')?'ally-wall-m':'';if(k)srcs.set(k,(srcs.get(k)||0)+1);return orig.call(this,im,...a)};setZoom(.25);centerOn(KEEP.x,KEEP.y-900);draw();CanvasRenderingContext2D.prototype.drawImage=orig;out.draws=Object.fromEntries(srcs);const cs=hdWallCorners();out.corners=cs.length+':'+cs.filter(c=>c.full).length;
  // HD 그림을 빼도 충돌·경로가 같다
  const keep=new Map(hdArt);hdArt.clear();hdTiles.clear();preparedRegion='';prepareBattlefield('beodeul');out.sameCol=Array.from(blockGrid).join('')===col;out.sameRoute=JSON.stringify(battleRoutes())===route;const px2=bg.getContext('2d').getImageData(600,1200,200,200).data;out.oldFine=+fine(px2).toFixed(3);for(const[k,v]of keep)hdArt.set(k,v);preparedRegion='';prepareBattlefield('beodeul');
  launchChapter(SAGA[9]);out.other={region:battleRegion,on:hdOn()};return out});
 console.log(JSON.stringify(v),JSON.stringify(r));
 assert.equal(r.region,'beodeul');assert(r.on);assert.deepEqual(r.tiles,[256,256,256]);assert(r.fine>r.oldFine*1.5,'HD 바닥이 더 세밀해야 함');assert(r.sameCol&&r.sameRoute);
 const d=r.draws;assert((d['ally-wall.png']||0)>=8,'옆 외벽 2개×4조각');assert.equal(d['ally-wall-m']||0,9,'앞 2+2·뒤 5조각');assert.equal(r.corners,'4:1','모서리 4개·전체 그림 1개');assert((d['ally-wall-corner.png']||0)>=3,'화면 안 모서리');assert((d['qing-house.png']||0)>=1,'본진 집');assert((d['qing-prop-bamboo-clump.png']||0)>=5,'대숲');
 assert.equal(r.other.region,'cheong');assert.equal(r.other.on,false);
 assert.equal(await p.evaluate(()=>document.scrollingElement.scrollHeight<=innerHeight+1),true);await p.close()}
assert.deepEqual(errs,[]);await b.close();console.log('PASS hd-terrain')})().catch(e=>{console.error(e);process.exit(1)});
