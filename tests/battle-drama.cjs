// 전투 중 위기·구원(DRAMA): 정해진 턴에 사방 증원+포위 경보+전장 대화, 버티는 동안 남은 턴 표시·중간 대화, n턴 뒤 구원군(컷인·원군·포위 적 타격·대화). 세 장(c10·c14·x9)과 그 밖 장은 없음, 휴대폰 화면 대화 상자.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),url=process.argv[2]||'http://127.0.0.1:8782/',errors=[];
for(const [w,h] of[[1280,800],[390,844],[844,390]]){const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.waitForTimeout(1500);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));titleHide?.();
 const open=async id=>{setRoute(id[0]==='x'?'xuan':'qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(150);return c};
 const turn=()=>{if(btalkOn())btalkStop(true);selected=-1;apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();for(let i=0;i<18/.025&&state==='playing';i++)advancePhase(.025)};
 const out={};for(const id of['c10','c14','x9']){const c=await open(id),d=DRAMA[id],o=out[id]={};
  o.none0=!events.some(e=>e.drama)&&!btalkOn();
  while(ap.round<d.t&&state==='planning')turn();
  o.round=ap.round;o.dirs=[...new Set(events.filter(e=>e.drama).map(e=>e.dir))].sort().join('');o.talk=btalkOn();o.alert=document.querySelector('#powerup').classList.contains('alert');await wait(400);
  const bt=document.querySelector('#btalk'),box=bt.querySelector('.bt-box').getBoundingClientRect();o.box=[box.left,box.right,box.top,box.bottom,innerWidth,innerHeight];o.lines=BT.L.length;o.first=bt.querySelector('.bt-line').textContent;
  // 누르기로 넘김
  bt.click();o.i1=BT?.i;o.chip=document.querySelector('#dramachip')?.textContent||'';
  turn();o.spawned=units.filter(u=>u.drama&&u.hp>0).length;o.dirsU=[...new Set(units.filter(u=>u.drama).map(u=>u.waveDir))].length;o.midTalk=btalkOn();await wait(120);o.chip2=document.querySelector('#dramachip')?.textContent||'';
  // 구원
  const foesHp=()=>units.filter(u=>u.drama&&u.hp>0).reduce((s,u)=>s+u.hp/u.max,0);while(ap.round<d.t+d.n-0&&state==='planning')turn();
  o.rescueRound=ap.round;o.step=dramaState?.step;o.cutin=document.querySelector('#cutin .ci-name')?.textContent||'';await wait(1500);o.rescueTalk=btalkOn()&&BT.L.some(l=>l[0]===d.by);o.chipGone=!document.querySelector('#dramachip')||document.querySelector('#dramachip').hidden;
  // Esc로 전부 넘김
  dispatchEvent(new KeyboardEvent('keydown',{key:'Escape'}));o.escClosed=!btalkOn();
 }
 // 다른 장에는 없음
 await open('c2');let t=0;while(t++<6&&state==='planning'){const was=btalkOn();turn();if(was)break}out.c2={drama:!!dramaState,ev:events.some(e=>e.drama)};
 // 출진하지 않은 장수 줄은 빠짐
 out.filter=(()=>{btalk([['o_zzz','x'],['o_hero','a'],[null,'b']]);const n=BT.L.length;btalkStop();return n})();
 return out});
for(const id of['c10','c14','x9']){const o=r[id];assert.ok(o.none0,id+' 시작엔 없음');assert.equal(o.round,{c10:4,c14:3,x9:4}[id],id+' 위기 턴');assert.equal(o.dirs,'ensw',id+' 네 방향');assert.ok(o.talk&&o.alert,id+' 대화·경보');assert.ok(o.box[0]>=-1&&o.box[1]<=o.box[4]+1&&o.box[3]<=o.box[5]+1&&o.box[2]>o.box[5]*.35,id+' 대화 상자 화면 안·아래쪽 '+o.box);assert.ok(o.i1===1||o.lines===1,id+' 누르면 다음 줄');assert.match(o.chip,/2턴 버텨라/,id+' 남은 턴');assert.ok(o.spawned>=12&&o.dirsU>=3,id+' 실제 증원 '+o.spawned+'/'+o.dirsU);assert.ok(o.midTalk,id+' 중간 대화');assert.match(o.chip2,/1턴/,id+' 남은 턴 줄어듦');assert.equal(o.step,3,id+' 구원');assert.match(o.cutin,/원군 도착/,id+' 컷인');assert.ok(o.rescueTalk,id+' 구원 대화(구원자 등장)');assert.ok(o.chipGone,id+' 표시 사라짐');assert.ok(o.escClosed,id+' Esc')}
assert.ok(!r.c2.drama&&!r.c2.ev,'다른 장 없음');assert.equal(r.filter,2,'출진 안 한 장수 줄 제외');console.log(w+'x'+h,JSON.stringify(r.c14));await p.close()}
assert.deepEqual(errors,[]);console.log('battle-drama ok');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
