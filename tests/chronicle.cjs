// 사신전기 연대기: 청명·서진 이야기를 한 플레이에서 번갈아, 흑수 충돌은 편 선택
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errors=[];
for(const [vp,side]of[[{width:1280,height:800},'c3'],[{width:390,height:844},'x2'],[{width:844,height:390},'c3']]){const p=await b.newPage({viewport:vp});p.on('pageerror',e=>errors.push(String(e)));p.on('dialog',d=>d.accept());await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1200);
const menu=await p.evaluate(()=>({h:$('#rmodal h3')?.textContent,fit:(m=>m.scrollHeight<=m.clientHeight+1)(document.querySelector('#rmodal .scroll')),rows:[...document.querySelectorAll('#rmodal .route-row')].map(r=>r.querySelector('b').textContent)}));
await p.evaluate(()=>{startNewRealm();prologueEnd()});await p.waitForTimeout(300);
const r=await p.evaluate(async side=>{const wait=t=>new Promise(r=>setTimeout(r,t));const flush=async()=>{for(let k=0;k<40;k++){if(VN){VN.o.choices?vnStop():vnStop(true);await wait(5);continue}const g=document.querySelector('#saga-next,#chron-go');if(g){g.click();await wait(5);continue}break}};
const log=[],shots=[];let clash=null,guard=0;closeModal();sagaAfterChapter();await flush();
while(guard++<40){const n=chronNext();if(!n)break;if(n.length>1){clash={modal:!!document.querySelector('.chron-pick'),opts:document.querySelectorAll('.chron-side').length,fits:(m=>m.scrollHeight<=m.clientHeight+1)(document.querySelector('#rmodal .scroll'))};chronPick(side);closeModal()}
const id=chronNext().length>1?side:chronNext()[0];const c=sagaCh(id);if(!c||!chapterOpen(c))return{err:'not open '+id+' route '+ROUTE,log};log.push(ROUTE[0]+':'+id);if(c.choices){R.saga.choices[c.id]=c.choices[0][0]}battleCfg={...battleCfg,campaign:{saga:id}};sagaBattleDone(true);await flush();if(R.over)break}
const q=chronR('qing'),x=chronR('xuan');return{log,clash,over:R.over,route:ROUTE,qc:q.saga.cleared.length,xc:x.saga.cleared.length,xover:x.over,qlv:q.saga.heroes.o_hero?.lv,xlv:x.saga.heroes.o_hero?.lv,key:SAVE_KEY,saved:!!localStorage.getItem(CHRON_KEY)}},side);
assert(!r.err,JSON.stringify(r));
const want=['c1','x1','c2',side,'c4','x3','c5','c6','x4','c7','x5','c8','c9','x6','c10','x7','c11','c12','x8','c13','x9','c14','c15','x10','c16'];assert.deepEqual(r.log.map(s=>s.slice(2)),want);
assert(r.log.every(s=>s[0]===(s[2]==='x'?'x':'q')),'각 장은 자기 군주 갈래에서');assert.equal(r.qc,16);assert.equal(r.xc,10);assert.equal(r.over,'win');assert.equal(r.route,'qing');assert(!r.xover,'현무 마지막 장은 게임을 끝내지 않음');
assert(r.clash.modal&&r.clash.opts===2&&r.clash.fits,JSON.stringify(r.clash)+'흑수 편 선택 창');assert.equal(r.key,'spiritwar-chronicle-v1');assert(r.saved);
assert.equal(menu.h,'사신전기');assert(menu.fit,'시작 메뉴 무스크롤');assert.equal(menu.rows[0],'사신전기');
// 이어하기: 저장을 다시 불러와도 두 갈래 유지
const res=await p.evaluate(()=>{localStorage.removeItem(CHRON_KEY);startNewRealm();prologueEnd();R.saga.cleared.push('c1');saveRealm();resumeRealmSave(CHRON_KEY);return{route:ROUTE,twin:R.twin?.saga.route,chron:R.chron,turn:!!document.querySelector('#chron-go')}});
assert.deepEqual(res,{route:'xuan',twin:'qing',chron:true,turn:true},JSON.stringify(res));
await p.close()}
assert.deepEqual(errors,[]);console.log('PASS chronicle: single save, qing/xuan alternate in 25 steps, clash side choice (both sides), proxy clear, xuan final not ending, resume switches, 3 viewports');await b.close()})();
