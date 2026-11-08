// 실행 중 자동 클로즈업: 첫 교전에서 화면이 그 지점으로 다가가며 확대되고 1.8초 뒤 원래 배율로 돌아온다. 같은 부대 쌍은 한 번만, 화면을 만지면 즉시 멈추고 3초간 끼어들지 않으며, 계획 단계로 넘어가면 배율을 되돌린다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{window.requestAnimationFrame=()=>0;setRoute('qing');newRealm();showRealm();launchChapter(SAGA[0]);hideBattleVoice();events=[];nextRaid=1e9;const out={};const z0=zoom;
 const g=1,us=apUnits(g),c=centroid(us),e=units.find(v=>v.side&&v.hp>0&&!['keep','gate','boss'].includes(v.type));const sq=units.filter(v=>v.squad===e.squad),ec=centroid(sq);sq.forEach(v=>{v.x+=c.x+260-ec.x;v.y+=c.y-260-ec.y;v.seen=true});
 selected=g;apAdd('engage',{target:e,x:e.x,y:e.y});apCancelAdvance();while(apPending().length)apSkip();$('#apready-run').click();
 let i=0,cam0=null;for(;i<400&&state==='playing'&&!cine.n;i++){cam0=[camX,camY];advancePhase(1/40);cineTick(1/40)}out.fired=cine.n;out.pairs=cine.pairs.size;
 for(let k=0;k<40;k++){advancePhase(1/40);cineTick(1/40)}const ctr=unproject(camX+VW/2,camY+VH*.45);out.zoomUp=zoom/z0;out.near=Math.hypot(ctr.x-cine.x,ctr.y-cine.y);
 // 같은 부대 쌍 첫 교전은 한 번만
 const n1=cine.n;cineFirstClash(us[0],e);out.oncePerPair=cine.n===n1;
 // 3.2초 유지 뒤 돌아오기
 let kb=0;for(;kb<120&&cine.z0!==null;kb++){advancePhase(1/40);cineTick(1/40)}out.backSec=(40+kb)/40;out.back=Math.abs(zoom-z0)<.01&&cine.z0===null;out.camBack=Math.round(Math.hypot(camX-cam0[0],camY-cam0[1]));
 // 화면을 만지면 멈추고 3초간 무시
 cine.last=-1e9;cineEvent(c.x,c.y,3,'t');cineUser();const zz=zoom;cineTick(.1);out.userStops=cine.hold===0&&zoom===zz;const before=cine.n;cineEvent(c.x,c.y,3,'t2');out.userBlocks=cine.n===before;
 // 계획 단계로 넘어가면 배율 복귀
 cine.user=-1e9;cine.cool=0;cine.last=-1e9;cineEvent(c.x,c.y,3,'t3');for(let k=0;k<10;k++)cineTick(1/40);out.zoomedAgain=zoom>z0*1.05;while(state==='playing')advancePhase(1/40);cineTick(1/40);out.planRestore=Math.abs(zoom-z0)<.01&&state==='planning';
 return out});
console.log(JSON.stringify(r));assert.ok(r.fired>=1&&r.pairs>=1);assert.ok(r.zoomUp>1.2,'zoom '+r.zoomUp);assert.ok(r.near<220,'centre '+r.near);assert.ok(r.oncePerPair);assert.ok(r.back);assert.ok(r.backSec<3.2,'잠깐 확대 뒤 바로 복귀 '+r.backSec);assert.ok(r.camBack<6,'원래 화면 위치로 복귀 '+r.camBack);assert.ok(r.userStops&&r.userBlocks);assert.ok(r.zoomedAgain&&r.planRestore);assert.deepEqual(errors,[]);console.log('PASS first clash/major events glide-and-zoom, return to zoom, once per pair, user input wins, planning restores zoom');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
