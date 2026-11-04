// 병사 4방향(characters/soldier-dir/<병종>/<fr|fl|br|bl>.webp, SOLDIER_DIR_READY): 방향별 그림 선택·뒤집기 상쇄·적 진영색·등록 그림 로드.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c3');R.saga.act=c.act;launchChapter(c);await new Promise(r=>setTimeout(r,2500));
const want=Object.entries(SOLDIER_DIR_READY).flatMap(([n,ks])=>ks.split(',').map(k=>n+'/'+k)),have=[...soldierDir].flatMap(([n,t])=>Object.keys(t).map(k=>n+'/'+k));
// 가짜 방향 그림(빨강·초록·파랑)으로 선택 검사
const feet=[...soldierDir].flatMap(([n,t])=>Object.entries(t).map(([k,im])=>[n+'/'+k,im.foot,SOLDIER_FOOT[n]?.[k]]));const real=new Map(soldierDir);soldierDir.clear();const fake={};for(const[k,col]of[['fl','#f00'],['br','#0f0'],['bl','#00f']]){const cv=document.createElement('canvas');cv.width=60;cv.height=80;const x=cv.getContext('2d');x.fillStyle=col;x.fillRect(10,0,40,80);cv.tag=k;fake[k]=cv}soldierDir.set('spear',fake);
const orig=ctx.drawImage.bind(ctx);let log=[];ctx.drawImage=function(img,...a){log.push({tag:img.tag||null,src:img.src||'canvas',a:ctx.getTransform().a,tintOf:[...tintCache].find(([k,m])=>[...m.values()].includes(img))?.[0]?.tag||null});return orig(img,...a)};
const out={};for(const side of[0,1])for(const[vb,f]of[[0,1],[0,-1],[1,1],[1,-1]]){const u={type:'spear',side,dir:0,vback:!!vb,vface:f};log=[];ctx.save();ctx.scale(f,1);animUnit=u;drawUnitArt('spear',side,-16,-35,32,38);animUnit=null;ctx.restore();out[side+(vb?'b':'f')+(f<0?'l':'r')]=log[0]}
// 등록 안 된 병종은 기존 그대로
log=[];ctx.save();ctx.scale(-1,1);animUnit={type:'bow',side:0,dir:0,vface:-1};drawUnitArt('bow',0,-16,-35,32,38);animUnit=null;ctx.restore();const bow=log[0];
ctx.drawImage=orig;soldierDir.clear();for(const[k,v]of real)soldierDir.set(k,v);return{want,have,out,bow,feet}});
assert.deepEqual(r.have.sort(),r.want.sort(),'등록한 병사 방향 그림이 모두 불러와져야 한다');for(const[k,f,w]of r.feet)assert(w!=null&&f===w,'발 위치 고정값 '+k);
assert(r.out['0fr'].src.endsWith('/spear.webp')&&r.out['0fr'].a>0,'앞-오른쪽은 원본');
for(const k of['fl','br','bl']){assert.equal(r.out['0f'.slice(0,1)+k].tag,k,'아군 '+k);assert(r.out['0'+k].a>0,'아군 '+k+' 뒤집지 않음');assert.equal(r.out['1'+k].tintOf,k,'적 '+k+'는 진영색 입힌 같은 그림');assert(r.out['1'+k].a>0)}
assert(r.out['1fr'].src==='canvas'&&r.out['1fr'].a>0,'적 앞-오른쪽은 기존 진영색 원본');
assert(r.bow.src.endsWith('/bow.webp')&&r.bow.a<0,'방향 그림 없는 병종은 기존처럼 뒤집어 그림');
assert.deepEqual(errors,[]);console.log('PASS soldier dir',r.want.length,'registered; fake 3 dirs selected, unflipped, enemy tinted; others unchanged');await b.close()})();
