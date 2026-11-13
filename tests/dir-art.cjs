// 장수 4방향(45도 앞-오른쪽/앞-왼쪽/뒤-오른쪽/뒤-왼쪽) 도트 그림: DIR_READY 그림을 방향별로 고르고, 화면에서 그 방향 그대로(뒤집기 상쇄) 그린다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c16');R.saga.act=c.act;launchChapter(c);await new Promise(r=>setTimeout(r,2500));
const out={},want=Object.entries(DIR_READY).filter(([n])=>!ILLUST_LEADERS.has(n)).flatMap(([n,ks])=>ks.split(',').map(k=>n+'/'+k)),have=[...dirArt].flatMap(([n,t])=>Object.keys(t).map(k=>n+'/'+k));
const lord=units.find(u=>!u.side&&u.type==='hero'),orig=ctx.drawImage.bind(ctx);let log=[];ctx.drawImage=function(img,...a){log.push({src:img.src||'canvas',a:ctx.getTransform().a});return orig(img,...a)};
for(const[vb,f]of[[0,1],[0,-1],[1,1],[1,-1]]){lord.vback=!!vb;lord.vface=f;log=[];ctx.save();ctx.scale(f*artFlip(lord),1);animUnit=lord;drawUnitArt('hero',0,-16,-35,32,38);animUnit=null;ctx.restore();out[(vb?'b':'f')+(f<0?'l':'r')]=log[0]}
ctx.drawImage=orig;return{want,have,out}});
assert.deepEqual(r.have.sort(),r.want.sort(),'모든 DIR_READY 그림이 불러와져야 한다');
assert(r.out.fr.src.includes('/characters/pixel/hero.webp')&&r.out.fr.a>0,JSON.stringify(r.out.fr));
for(const k of['fl','br','bl']){assert(r.out[k].src.endsWith('/characters/pixel/dir/hero/'+k+'.webp'),k+JSON.stringify(r.out[k]));assert(r.out[k].a>0,k+' 방향 그림은 뒤집지 않고 그린다')}
assert.deepEqual(errors,[]);console.log('PASS dir art',r.want.length,'images, 4 directions drawn unflipped');await b.close()})();
