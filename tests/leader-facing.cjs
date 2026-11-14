// Regression: Mujin/Heukcheol base art faces right. Check actual rendered files, not only direction flags.
// 옛 도트 장수 경로 검사: 일러스트 장수(ILLUST_LEADERS)를 끈 ?pixel=1로 연다.
const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto((process.argv[2]||'http://127.0.0.1:8806/').replace(/\/?$/,'/?pixel=1'));
 await p.waitForFunction(()=>['mujin','heukcheol'].every(n=>['fr','fl','br','bl'].every(k=>leaderWalk.get(n)?.[k]?.length===4))&&companionArt.has('o_mujin')&&companionArt.has('o_heuk'));
 const result=await p.evaluate(()=>{
  const equal=(a,b)=>{if(a.width!==b.width||a.height!==b.height)return false;const c=document.createElement('canvas');c.width=a.width;c.height=a.height;const x=c.getContext('2d');x.drawImage(a,0,0);const one=x.getImageData(0,0,c.width,c.height).data;x.clearRect(0,0,c.width,c.height);x.drawImage(b,0,0);const two=x.getImageData(0,0,c.width,c.height).data;return one.every((v,i)=>v===two[i])};
  const results=[],savedTime=time;
  for(const [id,name]of[['o_mujin','mujin'],['o_heuk','heukcheol']]){
   const src=characterSprite(id),base=companionArt.get(id),sets=leaderWalk.get(name),rendered=[];
   for(const[key,dx,dy]of[['fr',2,0],['fl',0,2],['br',0,-2],['bl',-2,0]]){
    const u={commander:id,type:'shield',side:1,x:2400,y:2400,dir:0,order:'move'};
    facingFromMotion([u],.025);for(let i=0;i<48;i++){time+=.025;u.x+=dx;u.y+=dy;facingFromMotion([u],.025)}
    const log=[],draw=ctx.drawImage;ctx.drawImage=function(im,...a){log.push({src:im.src,a:ctx.getTransform().a});return draw.call(this,im,...a)};
    try{
     ctx.save();ctx.scale(u.vface*artFlip(u),1);animUnit=u;
     u.vmT=0;drawCompanionArt(id,u.type,1,-16,-35,32,38);const still=log.at(-1);
     log.length=0;u.vmT=.3;u.stp=.5;drawCompanionArt(id,u.type,1,-16,-35,32,38);
     rendered.push({want:key,key:walkKey(u),still,walking:log.at(-1)});
    }finally{animUnit=null;ctx.restore();ctx.drawImage=draw}
   }
   results.push({name,left:artFacesLeft(src),nativeMatches:equal(sets.fr[1],base),leftMatches:equal(sets.fl[1],dirArt.get(name).fl),rendered});
  }
  time=savedTime;return results;
 });
 for(const r of result){
  assert(!r.left&&r.nativeMatches&&r.leftMatches,r.name+' image direction registration');
  for(const d of r.rendered){assert.equal(d.key,d.want);assert(d.still.a>0&&d.walking.a>0);assert(d.walking.src.endsWith('/walk/'+r.name+'/'+d.want+'-2.webp'));assert(d.still.src.endsWith(d.want==='fr'?'/pixel/'+r.name+'.webp':'/dir/'+r.name+'/'+d.want+'.webp'))}
 }
 assert.deepEqual(errors,[]);await b.close();console.log('PASS Mujin/Heukcheol: 4 movement directions, static/walk source pixels match, no unintended mirror');
})().catch(e=>{console.error(e);process.exit(1)});
