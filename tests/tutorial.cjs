// 튜토리얼: 처음 「새로 시작」에서 고르기, 저장하지 않는 연습 전투, 실제 조작으로 넘어가는 안내 단계, 끝내면 원래 상태로.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),url=process.argv[2]||'http://127.0.0.1:8782';
const shotDir=process.env.SHOT_DIR;
for(const vp of[{width:390,height:844},{width:844,height:390},{width:320,height:568}]){const p=await b.newPage({viewport:vp}),errs=[];p.on('pageerror',e=>errs.push(String(e)));
await p.goto(url);await p.evaluate(()=>localStorage.clear());await p.reload();await p.waitForTimeout(300);
// 시작 화면 → 새로 시작 → 튜토리얼 묻기
assert(await p.getByRole('button',{name:/^튜토리얼/}).isVisible(),'start menu tutorial button');
await p.getByRole('button',{name:'새로 시작',exact:true}).click();
assert(await p.getByRole('button',{name:'튜토리얼부터',exact:true}).isVisible(),'ask modal');
await p.getByRole('button',{name:'튜토리얼부터',exact:true}).click();
await p.waitForFunction(()=>TUT.on&&(state==='planning'||state==='playing'));
const keys0=await p.evaluate(()=>Object.keys(localStorage).sort().join());
await p.waitForFunction(()=>!$('#tutcoach').hidden,null,{timeout:6000});
const fit=async tag=>{const r=await p.evaluate(()=>{const c=$('#tutcoach').getBoundingClientRect(),st=$('#stage').getBoundingClientRect();return{top:c.top,bottom:c.bottom,left:c.left,right:c.right,sb:st.bottom,w:innerWidth}});assert(r.left>=0&&r.right<=r.w+1&&r.bottom<=r.sb+1,tag+' '+JSON.stringify(r))};
await fit('step0');if(shotDir)await p.screenshot({path:`${shotDir}/tut-${vp.width}x${vp.height}.png`});
await p.click('#tutcoach .go');assert.equal(await p.evaluate(()=>TUT.step),1);
// 부대 고르기 → 원형 메뉴
await p.evaluate(()=>{choose(1)});await p.waitForFunction(()=>TUT.step===2,null,{timeout:3000});
// 이동 명령
await p.evaluate(()=>{const u=apUnits(1)[0];selected=1;apAdd('move',{x:u.x,y:u.y-300});apCancelAdvance()});await p.waitForFunction(()=>TUT.step===3,null,{timeout:3000});
// 공격 명령
await p.evaluate(()=>{const e=units.find(u=>u.side===1&&u.hp>0&&isSoldier(u));selected=2;apAdd('engage',{target:e});apCancelAdvance()});await p.waitForFunction(()=>TUT.step===4,null,{timeout:3000});
await fit('step4');
// 실행
await p.evaluate(()=>{for(const g of apPending()){selected=g;apSkip();apCancelAdvance()}apReadyClose();resumeCombat(true)});await p.waitForFunction(()=>TUT.step===5,null,{timeout:3000});
// 12초 진행 → 다음 계획 턴
await p.evaluate(()=>{let n=0;while(state==='playing'&&n++<2000)advancePhase(1/30)});await p.waitForFunction(()=>TUT.step===6,null,{timeout:3000});
// 본진 열기
await p.evaluate(()=>openBase(0));await p.waitForFunction(()=>TUT.step===7,null,{timeout:3000});
assert(await p.evaluate(()=>$('#tutcoach').classList.contains('mini')),'coach shrinks while base open');
await p.evaluate(()=>$('#production').classList.add('hidden'));await p.waitForTimeout(300);
await p.click('#tutcoach .go');await p.click('#tutcoach .go');assert.equal(await p.evaluate(()=>TUT.step),9);
assert(await p.evaluate(()=>$('#tutcoach').classList.contains('mini')),'mini after last');
// 저장 안 함
assert.equal(await p.evaluate(()=>Object.keys(localStorage).sort().join()),keys0,'no saves during tutorial');
assert(!await p.evaluate(()=>localStorage.getItem(CHRON_KEY)),'no chronicle save');
// 승리로 끝 → 결과 버튼 → 튜토리얼 완료 창 → 이야기 시작
await p.evaluate(()=>{end(true)});await p.evaluate(()=>{let n=0;while(state==='ending'&&n++<200)advancePhase(1/30)});await p.waitForFunction(()=>!$('#overlay').classList.contains('hidden'),null,{timeout:4000});
await p.locator('#overlay button').first().click();
await p.waitForFunction(()=>!TUT.on&&$('#rmodal').classList.contains('on'));
assert(await p.evaluate(()=>$('#rmodal').textContent.includes('튜토리얼 승리')),'win modal');
assert.equal(await p.evaluate(()=>localStorage.getItem('spiritwar-tutorial-v1')),'win');
await p.getByRole('button',{name:'이야기 시작',exact:true}).click();await p.waitForTimeout(300);
const st=await p.evaluate(()=>({chron:R.chron,cleared:R.saga.cleared.length,route:ROUTE,saved:!!localStorage.getItem(CHRON_KEY),prologue:!!prologue}));
assert(st.chron&&st.cleared===0&&st.route==='qing'&&st.saved,JSON.stringify(st));
// 두 번째부터는 새로 시작에서 묻지 않음, 시작 화면 튜토리얼 버튼 → 중간에 끝내기 → 원래 진행 그대로
await p.evaluate(()=>{if(prologue)prologueEnd(true);closeModal();R.saga.gold=4321;saveRealm()});
await p.evaluate(()=>{startTutorial()});await p.waitForFunction(()=>TUT.on&&state==='planning');await p.waitForFunction(()=>!$('#tutcoach').hidden,null,{timeout:6000});
await p.click('#tutcoach button:not(.go)');
await p.waitForFunction(()=>!TUT.on);
const back=await p.evaluate(()=>({gold:R.saga.gold,chron:R.chron,state,save:JSON.parse(localStorage.getItem(CHRON_KEY)).saga.gold,modal:$('#rmodal').textContent.includes('튜토리얼을 마쳤습니다')}));
assert(back.gold===4321&&back.chron&&back.state==='realm'&&back.save===4321&&back.modal,JSON.stringify(back));
await p.evaluate(()=>{closeModal();openSaveMenu(true)});await p.getByRole('button',{name:'새로 시작',exact:true}).click();
assert(!await p.getByRole('button',{name:'튜토리얼부터',exact:true}).isVisible().catch(()=>false),'no ask after done');
assert.deepEqual(errs,[]);await p.close()}
console.log('PASS tutorial: first-new ask, no-save practice battle, 9 steps advanced by real actions, base/mini coach, win→story start, quit restores progress, 3 viewports');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
