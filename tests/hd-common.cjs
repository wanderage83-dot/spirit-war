// Four living factions share HD scenery; undead territories retain their own art and all geometry stays unchanged.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({executablePath:'/usr/bin/chromium'}),page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.argv[2]||'http://127.0.0.1:8804/');
 await page.waitForFunction(()=>hdArt.size===HD_ART_FILES.length);
 await page.evaluate(()=>{window.requestAnimationFrame=()=>0;setRoute('qing');newRealm();showRealm();launchChapter(SAGA[0]);hideBattleVoice()});
 const rows=await page.evaluate(()=>{
  const rows=[];
  for(const id of Object.keys(REGION_MAPS)){
   weather='clear';preparedRegion='';prepareBattlefield(id);
   const enabled=hdOn(),geometry=Array.from(blockGrid).join(''),routes=JSON.stringify(battleRoutes()),layout=battleLayout(),saved=new Map(hdArt),before=bg.toDataURL();
   const prop=forestProps.find(p=>p.type==='tree'),art=prop&&hdPropArt(prop);
   const palette=pixelColors()===PIXEL_THEMES.qing,roof=mapTheme().roof;
   hdArt.clear();hdTiles.clear();preparedRegion='';prepareBattlefield(id);
   const same=geometry===Array.from(blockGrid).join('')&&routes===JSON.stringify(battleRoutes()),fallback=bg.toDataURL();
   for(const[k,v]of saved)hdArt.set(k,v);hdTiles.clear();preparedRegion='';prepareBattlefield(id);
   rows.push({id,theme:regionMap().theme,enabled,same,layout,palette,roof,prop:art?.im.src.split('/').pop()||null,artChanges:before!==fallback,restored:before===bg.toDataURL()});
  }
  return rows;
 });
 assert.equal(rows.length,15);assert.equal(rows.filter(r=>r.enabled).length,12);
 for(const r of rows){assert(r.same&&r.restored,r.id+' geometry/cache');if(r.theme==='gui'){assert(!r.enabled&&!r.palette&&!r.prop&&!r.artChanges,r.id)}else{assert(r.enabled&&r.palette&&r.artChanges,r.id);assert.equal(r.roof,'#426d68');assert(r.prop?.startsWith('qing-prop-'),r.id)}}
 assert(new Set(rows.map(r=>r.layout)).size>=3,'terrain patterns must remain varied');
 const banks=await page.evaluate(()=>{
  const patterns=new Map(),proto=CanvasRenderingContext2D.prototype,create=proto.createPattern,fill=proto.fillRect;let used=0;
  proto.createPattern=function(im,...a){const p=create.call(this,im,...a);if(im===hdTile('qing-bank'))patterns.set(p,true);return p};
  proto.fillRect=function(x,y,w,h){if(patterns.has(this.fillStyle)&&(y===1422||y===1570)&&w===32)used++;return fill.call(this,x,y,w,h)};
  try{preparedRegion='';prepareBattlefield('cheong')}finally{proto.createPattern=create;proto.fillRect=fill}
  return used;
 });assert(banks>=150,'bridge banks must use the HD bank texture');
 for(const viewport of[{width:390,height:844},{width:844,height:390},{width:1280,height:800}]){
  await page.setViewportSize(viewport);
  for(const id of['cheong','hyeonmu','jujak','moraegwan','gwiwang']){
   await page.evaluate(id=>{weather='clear';prepareBattlefield(id);reset();startDeploy();hideBattleVoice();centerOn(2400,2800);setZoom(.45);draw()},id);
   assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth&&document.scrollingElement.scrollHeight<=innerHeight+1),id+' overflow');
   await page.screenshot({path:'/tmp/common-hd-'+id+'-'+viewport.width+'.png'});
  }
 }
 assert.deepEqual(errors,[]);await browser.close();console.log('PASS hd-common: 12 shared regions, 3 undead exceptions, 15 unchanged collision/routes, bridge bank texture, 3 viewport sizes');
})().catch(e=>{console.error(e);process.exit(1)});
