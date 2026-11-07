// 귀왕 망자군 병사(characters/soldier-gui/<병종>/<키>.webp, GUI_SOLDIER_READY): 귀왕 적 병사만 진영색 없이 전용 그림, 아군·다른 진영 적은 기존 그대로.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errors=[];
for(const vp of[{width:1280,height:800},{width:390,height:844},{width:844,height:390}]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const go=id=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c)};go('c2');await new Promise(r=>setTimeout(r,2000));
const want=Object.entries(GUI_SOLDIER_READY).flatMap(([n,ks])=>ks.split(',').map(k=>n+'/'+k)),have=[...guiSoldier].flatMap(([n,t])=>Object.keys(t).map(k=>n+'/'+k)),feet=[...guiSoldier].flatMap(([n,t])=>Object.entries(t).map(([k,im])=>[n+'/'+k,im.foot,GUI_SOLDIER_FOOT[n]?.[k]]));
const orig=ctx.drawImage.bind(ctx);let log=[];ctx.drawImage=function(img,...a){log.push({src:img.src||'canvas',a:ctx.getTransform().a});return orig(img,...a)};
const draw=(type,side,vb,f)=>{log=[];ctx.save();ctx.scale(f,1);animUnit={type,side,dir:0,vback:!!vb,vface:f};drawUnitArt(type,side,-16,-35,32,38);animUnit=null;ctx.restore();return log[0]};
const out={tf:tintFaction};for(const t of['shield','bow','spear','horse'])for(const[vb,f]of[[0,1],[0,-1],[1,1],[1,-1]]){out['1'+t+(vb?'b':'f')+(f<0?'l':'r')]=draw(t,1,vb,f);out['0'+t+(vb?'b':'f')+(f<0?'l':'r')]=draw(t,0,vb,f)}
const en=units.find(u=>u.side===1&&u.type==='spear'),hw=en?hasWalk(en):null,al=units.find(u=>u.side===0&&u.type==='shield'),ahw=al?hasWalk(al):null;
go('c3');await new Promise(r=>setTimeout(r,800));out.xtf=tintFaction;out.x=draw('spear',1,0,1);ctx.drawImage=orig;return{want,have,feet,out,hw,ahw}});
assert.equal(r.want.length,16,'망자군 4병종×4방향');assert.deepEqual(r.have.sort(),r.want.sort(),'망자군 그림 모두 로드');for(const[k,f,w]of r.feet)assert(w!=null&&f===w,'발 위치 고정값 '+k);
assert.equal(r.out.tf,'gui');for(const t of['shield','bow','spear','horse']){for(const k of['fr','fl','br','bl']){const e=r.out['1'+t+k],a=r.out['0'+t+k];assert(e.src.includes('/soldier-gui/'+t+'/'+k+'.webp'),'귀왕 '+t+' '+k+' 전용 그림(색 입히지 않음) '+e.src);assert(!a.src.includes('soldier-gui'),'아군은 망자군 그림 아님')}
for(const k of['fr','fl','br','bl'])assert(r.out['1'+t+k].a>0,'방향 그림은 뒤집지 않고 그린다 '+t+' '+k)}
assert.equal(r.hw,false,'망자군은 걷기 프레임 없음(코드 걸음)');assert.equal(r.ahw,true,'아군 걷기 프레임 유지');
assert.notEqual(r.out.xtf,'gui');assert(!r.out.x.src.includes('soldier-gui'),'다른 진영 적은 기존 진영색 그림');
// 실제 화면: 적 병사가 보이게 카메라를 옮겨 찍는다
await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c2');R.saga.act=c.act;launchChapter(c);await new Promise(r=>setTimeout(r,1500));const e=units.filter(u=>u.side===1&&u.hp>0&&u.type!=='keep'&&u.type!=='gate');const m=e.reduce((a,u)=>a.y<u.y?u:a);setZoom&&setZoom(1);focusPoint(m.x,m.y);draw()});await p.waitForTimeout(300);if(process.env.SHOT)await p.screenshot({path:process.env.SHOT+'-'+vp.width+'.png'});await p.close()}
assert.deepEqual(errors,[]);console.log('PASS gui soldier: 16 loaded, gui enemies use matching four-direction undead art untinted and unmirrored, allies/other factions unchanged, 3 viewports');await b.close()})();
