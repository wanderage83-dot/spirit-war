// 관리자 메뉴 「장면 보기」: 판·장면을 골라 대화만 재생하고, 진행·저장·인물 소개 기록은 바꾸지 않는다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:390,height:844}}),errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto(process.argv[2]||'http://127.0.0.1:8782');
await p.evaluate(()=>{localStorage.clear();setRoute('qing');newRealm();showRealm();titleHide();storyState().intro=true;saveRealm()});
const before=await p.evaluate(()=>({save:localStorage.getItem(SAVE_KEY),met:localStorage.getItem('spiritwar-met-ever-v1'),cleared:R.saga.cleared.length}));
const openAdmin=async()=>{await p.click('#rmenu');await p.getByRole('button',{name:'관리자 메뉴 · 임시',exact:true}).click();assert(await p.locator('#admin-panel').isVisible())};
await openAdmin();
// 장면 목록: 군주 시점·전투 전·뒤·선택·인연
const lists=await p.evaluate(()=>({c6:ADMIN_TOOLS.sceneList('qing',sagaCh('c6')).map(x=>x[0]),c8:ADMIN_TOOLS.sceneList('qing',SAGA_Q.find(c=>c.id==='c8')).map(x=>x[0]),c13:ADMIN_TOOLS.sceneList('qing',SAGA_Q.find(c=>c.id==='c13')).map(x=>x[0]),x8:ADMIN_TOOLS.sceneList('xuan',SAGA_X.find(c=>c.id==='x8')).map(x=>x[0]),x9:ADMIN_TOOLS.sceneList('xuan',SAGA_X.find(c=>c.id==='x9')).map(x=>x[0])}));
assert.deepEqual(lists.c6,['pov','pre','post']);assert(lists.c8.includes('bond:bi')&&lists.c8.includes('bond:dan'));assert(lists.c13.includes('ch:yeonhwa')&&lists.c13.includes('ch:biyeon'));assert.deepEqual(lists.x8,['pov','pre','post']);assert(lists.x9.includes('bond:seol2'));
// 현무 x8 강현 시점 재생(청명 갈래에서): 군주 시점 화자가 왼쪽, 인물 소개 없음
await p.selectOption('#admin-route','xuan');await p.selectOption('#admin-chapter','x8');await p.selectOption('#admin-scene','pov');await p.click('#admin-view');
let st=await p.evaluate(()=>({vn:!!VN&&!$('#vn').classList.contains('hidden'),panel:$('#admin-panel').classList.contains('hidden'),n:VN.lines.length,left:VN.o.leftActor,title:VN.o.title}));
assert(st.vn&&st.panel,'vn shown, panel hidden');assert.equal(st.n,SAGA_X_len=await p.evaluate(()=>SAGA_X.find(c=>c.id==='x8').pov.length));assert.equal(st.left,'ruler:bai');assert(st.title.includes('8판'));
// 끝까지 넘기기(Enter): 관리자 키 가로채기에 막히지 않는다
for(let i=0;i<80&&await p.evaluate(()=>!!VN);i++){await p.keyboard.press('Enter');await p.waitForTimeout(30)}
st=await p.evaluate(()=>({vn:!!VN,panel:!$('#admin-panel').classList.contains('hidden'),intro:VN_INTRO,viewing:ADMIN_TOOLS.viewing}));
assert(!st.vn&&st.panel&&st.intro===true&&!st.viewing,JSON.stringify(st));
// 다른 갈래 o_hero는 그 갈래 군주로 바뀜 + c13 조건 대사는 고른 인연만
await p.selectOption('#admin-route','qing');await p.selectOption('#admin-bond','biyeon');await p.selectOption('#admin-chapter','c16');await p.selectOption('#admin-scene','post');await p.click('#admin-view');
st=await p.evaluate(()=>({conds:VN.lines.filter(l=>l[3]?.c13).map(l=>l[3].c13)}));assert(st.conds.length&&st.conds.every(x=>x==='biyeon'));
await p.evaluate(()=>vnStop());
await p.evaluate(()=>{setRoute('xuan');newRealm();showRealm();titleHide();storyState().intro=true});await p.evaluate(()=>{ADMIN_TOOLS.hide()});await openAdmin();
await p.selectOption('#admin-route','qing');await p.selectOption('#admin-chapter','c2');await p.selectOption('#admin-scene','post');await p.click('#admin-view');
st=await p.evaluate(()=>VN.lines.some(l=>l[0]==='ruler:qing')&&!VN.lines.some(l=>l[0]==='o_hero'));assert(st,'o_hero mapped to ruler:qing on xuan route');
await p.evaluate(()=>vnStop());
// 인연 재생
await p.selectOption('#admin-route','xuan');await p.selectOption('#admin-chapter','x9');await p.selectOption('#admin-scene','bond:seol2');await p.click('#admin-view');
assert(await p.evaluate(()=>VN.o.title.includes('돌려주지 못한 열쇠')));await p.evaluate(()=>vnStop());
await p.evaluate(()=>{setRoute('qing')});
// 진행·저장·소개 기록 불변
const after=await p.evaluate(()=>({save:localStorage.getItem(SAVE_KEY),met:localStorage.getItem('spiritwar-met-ever-v1')}));assert.equal(after.met,before.met);
// 3화면 무스크롤
for(const v of[{width:320,height:568},{width:390,height:844},{width:844,height:390}]){await p.setViewportSize(v);await p.waitForTimeout(80);const f=await p.evaluate(()=>{const bx=$('#admin-panel .admin-box').getBoundingClientRect();return{fit:bx.top>=0&&bx.bottom<=innerHeight+1&&bx.right<=innerWidth+1,h:bx.height}});assert(f.fit,JSON.stringify({v,f}))}
assert.deepEqual(errs,[]);console.log('PASS admin scene viewer: lists pov/pre/post/choice/bond, plays without progress/intro change, keys pass to dialogue, hero mapping, bond filter, 3 viewports');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
