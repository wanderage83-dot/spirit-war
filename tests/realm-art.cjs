// Painted world map must preserve geography, roads, ownership updates and hit testing, with a working fallback.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto(process.argv[2]||'http://127.0.0.1:8807/');await p.waitForFunction(()=>realmArt&&rBase);
 const result=await p.evaluate(()=>{
  window.requestAnimationFrame=()=>0;setRoute('qing');newRealm();showRealm();closeModal();drawRealm();
  const geometry=()=>JSON.stringify({idx:Array.from(rIdx),adj:rAdj.map(a=>[...a]),roads:rRoadPath});
  const original=geometry(),painted=rBase.toDataURL(),art=realmArt;
  const data=rBase.getContext('2d').getImageData(0,0,RM_W,RM_H).data,sums={};
  for(let y=0;y<RM_H;y+=4)for(let x=0;x<RM_W;x+=4){const k=rIdx[(y/RS)*RW+x/RS];if(k<0)continue;const theme=regionMap(PROV0[k][0]).theme,i=(y*RM_W+x)*4,s=sums[theme]||(sums[theme]={sum:0,n:0});s.sum+=data[i]*.2126+data[i+1]*.7152+data[i+2]*.0722;s.n++}
  realmArt=null;buildRealmRaster();const fallback=rBase.toDataURL(),same=original===geometry();realmArt=art;buildRealmRaster();const restored=original===geometry()&&painted===rBase.toDataURL();
  const owner=R.provs[0].owner;R.provs[0].owner='gui';rDirty=true;drawRealm();const updated=!rDirty;R.provs[0].owner=owner;rDirty=true;
  return{same,restored,different:painted!==fallback,updated,luma:Object.fromEntries(Object.entries(sums).map(([k,v])=>[k,v.sum/v.n]))};
 });
 assert(result.same&&result.restored&&result.different&&result.updated,JSON.stringify(result));
 assert(result.luma.gui<Math.min(result.luma.qing,result.luma.xuan,result.luma.bai,result.luma.zhu)*.9,'undead region should be visibly darker');
 for(const viewport of[{width:390,height:844},{width:844,height:390},{width:1280,height:900}]){
  await p.setViewportSize(viewport);
  const hits=await p.evaluate(()=>{showRealm();closeModal();drawRealm();const r=$('#rmap').getBoundingClientRect();return PROV0.map((q,k)=>realmAt({clientX:r.left+rView.ox+q[2]*rView.s,clientY:r.top+rView.oy+q[3]*rView.s})===k)});assert(hits.every(Boolean),'province clicks');
 }
 const fallback=await b.newPage();fallback.on('pageerror',e=>errors.push(e.message));await fallback.route('**/terrain/realm/atlas.webp',route=>route.abort());await fallback.goto(p.url());await fallback.evaluate(()=>{setRoute('qing');newRealm();showRealm();drawRealm()});assert(await fallback.evaluate(()=>realmArt===null&&rBase.width===RM_W&&rIdx.length===RW*RH));
 assert.deepEqual(errors,[]);await b.close();console.log('PASS realm art: painted/fallback geography and roads identical, darker undead realm, ownership and 45 province hits across 3 viewports',result.luma);
})().catch(e=>{console.error(e);process.exit(1)});
