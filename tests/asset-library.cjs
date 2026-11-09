// Catalogue discovery, original file downloads, sheet metadata, filtering, and mobile layout.
const{chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()>=400&&!r.url().endsWith('favicon.ico'))errors.push(r.status()+' '+r.url())});
 await p.goto(process.argv[2]||'http://127.0.0.1:8808/asset-library/');
 const meta=await p.evaluate(()=>({all:D.image_count,recent:D.assets.filter(a=>a.recent).length,filtered:filtered.length,shown}));assert(meta.all>900&&meta.recent===67&&meta.filtered===67&&meta.shown===48);
 await p.locator('#search').fill('qing-canopy');assert.equal(await p.locator('.card').count(),1);await p.locator('.preview').click();assert(await p.locator('#detail').evaluate(e=>e.open));assert((await p.locator('#details').textContent()).includes('1024 × 1024'));await p.locator('#repeat').click();assert(await p.locator('#large').evaluate(e=>e.classList.contains('repeat')));await p.locator('#close').click();
 await p.locator('#search').fill('qing-prop-willow');await p.locator('.preview').click();assert((await p.locator('#details').textContent()).includes('4칸 × 1줄'));await p.locator('#close').click();
 await p.getByRole('button',{name:'인물 초상',exact:true}).click();await p.locator('#search').fill('청명');assert.equal(await p.locator('.card').count(),1);assert((await p.locator('.card .actions a').getAttribute('href')).endsWith('/portraits/qing.webp'));
 await p.getByRole('button',{name:'전체 종류',exact:true}).click();await p.locator('#search').fill('무진');await p.locator('#direction').selectOption('fl');assert(await p.evaluate(()=>filtered.length===5&&filtered.every(a=>a.direction==='fl'&&a.path.includes('mujin'))));
 const download=p.waitForEvent('download');await p.locator('#export-list').click();assert.equal((await download).suggestedFilename(),'spirit-war-assets.json');
 for(const size of[{width:320,height:568},{width:390,height:844},{width:844,height:390},{width:1280,height:900}]){
  await p.setViewportSize(size);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'page overflow');await p.locator('.preview').first().click();assert(await p.locator('#detail').evaluate(e=>{const r=e.getBoundingClientRect();return r.left>=0&&r.right<=innerWidth&&r.top>=0&&r.bottom<=innerHeight+1}),'dialog overflow');await p.locator('#close').click();
 }
 await p.locator('#background').click();assert(await p.evaluate(()=>document.body.classList.contains('dark-check')));assert.deepEqual(errors,[]);await b.close();console.log('PASS asset library: recent/all search, 4-direction filter, sheets, repeat preview, JSON download, 4 viewport sizes');
})().catch(e=>{console.error(e);process.exit(1)});
