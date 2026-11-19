// 목표 지점 표식·부두 잔교·장수 창 장비 칸 장착·성장 곡선 문구 제거·대화 중간 서술 소설식·목표 띠의 관문 구분
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),url=process.argv[2]||'http://127.0.0.1:8782/',errors=[];
for(const [w,h] of[[1280,800],[390,844],[844,390]]){const p=await b.newPage({viewport:{width:w,height:h}});p.on('pageerror',e=>errors.push(String(e)));await p.goto(url);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));titleHide();const open=async id=>{setRoute(id[0]==='x'?'xuan':'qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(150);return c};const o={};
 await open('c2');const s=goalState;o.dock=!!s.dock;let wd=1e9;for(let a=0;a<6.3;a+=.1)for(let r=0;r<700;r+=20)if(terrainAt(s.spot.x+Math.cos(a)*r,s.spot.y+Math.sin(a)*r)==='water'){wd=Math.min(wd,r);break}o.waterNear=wd;o.walk=walkable(s.spot.x,s.spot.y);o.mark2=goalMarks().map(m=>m.ic).join('');
 await open('c3');o.mark3=goalMarks().length;await wait(80);o.chip3=document.querySelector('#goalchip').textContent;
 await open('c10');o.mark10=goalMarks().map(m=>m.ic).join('');
 await open('c9');o.mark9=goalMarks().map(m=>m.ic).join('');
 // 그리기 호출에 표식 객체가 들어감
 await open('c2');focusPoint(goalState.spot.x,goalState.spot.y);const objs=[];goalObjs(objs);o.objs=objs.length;
 // 장수 창
 showRealm();if(!R.saga.roster.includes('o_muk'))joinHero('o_muk');bagAdd('glaive');openGrowth('o_muk');await wait(30);o.curve=!!document.querySelector('.gr-curve')||/조숙형|꾸준형|대기만성/.test(document.querySelector('#rmodal').textContent);o.slots=document.querySelectorAll('.gr-slot').length;
 document.querySelector('.gr-slot').click();await wait(30);o.pickN=document.querySelectorAll('.gp-it').length;document.querySelector('.gp-it').click();await wait(30);o.eq=sagaHero('o_muk').eq['무기'];o.bag=R.saga.bag.glaive||0;document.querySelector('.gr-slot').click();await wait(30);[...document.querySelectorAll('.gp-cur .rbtn')].find(b=>/벗기/.test(b.textContent)).click();await wait(30);o.off=sagaHero('o_muk').eq['무기']||null;o.bag2=R.saga.bag.glaive;const m=document.querySelector('#rmodal .scroll')||document.querySelector('#rmodal');o.fit=[...document.querySelectorAll('#rmodal *')].every(e=>e.scrollWidth<=e.clientWidth+2||getComputedStyle(e).overflow!=='hidden');closeModal();
 // 중간 서술
 VN_INTRO=false;vnPlay([[null,'앞 서술'],['o_hero','대사'],[null,'중간 서술 하나'],[null,'중간 서술 둘'],['o_hero','다시']],{});const el=$('#vn');o.lead=el.classList.contains('novel');VN.i=3;vnShow();await wait(20);o.mid=el.classList.contains('novel')&&document.querySelectorAll('.vn-nv-body p').length===2&&!/앞 서술/.test(document.querySelector('.vn-nv-body').textContent);document.querySelector('.vn-nv-skip').click();o.skipTo=VN.i;o.after=!el.classList.contains('novel');vnStop();
 // 대사
 const all=JSON.stringify(SAGA_Q);o.lines=!/살살 하겠소/.test(all)&&/옆에 앉아도 될까요/.test(all);
 return o});
assert.ok(r.dock&&r.waterNear<=260&&r.walk,'부두는 물가 '+JSON.stringify(r));assert.equal(r.mark2,'⚓');assert.equal(r.mark3,0,'붕괴 목표엔 지점 표식 없음');assert.match(r.chip3,/🚪 관문 \d\/\d 열림/);assert.ok(!/돌파/.test(r.chip3));assert.ok(/✖/.test(r.mark10),'파괴 대상 '+r.mark10);assert.ok(/👑/.test(r.mark9),'면갑 적장 '+r.mark9);assert.ok(r.objs>=1);
assert.ok(!r.curve,'성장 곡선 문구 없음');assert.equal(r.slots,3);assert.ok(r.pickN>=1);assert.equal(r.eq,'glaive');assert.equal(r.off,null);assert.equal(r.bag2,r.bag+1,'벗으면 가방으로');
assert.ok(r.lead&&r.mid&&r.skipTo===4&&r.after,'중간 서술 소설식 '+JSON.stringify(r));assert.ok(r.lines,'대사 수정');console.log(w+'x'+h,JSON.stringify(r));await p.close()}
assert.deepEqual(errors,[]);console.log('goal-marks-gear ok');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
