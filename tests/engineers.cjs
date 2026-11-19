// 공병·투석기: 공병은 현무 도겸 1·백호 은랑·사율 2 부대뿐(근접 약함), 백호는 빨리 짓고 강한 투석기, 멈춰 있으면 18초 뒤 투석기, 공병이 곁에 있어야 쏨(범위 피해·성문 1.6배),
// 부서지면 처음부터 다시 짓기, 정해진 판의 적 공병 부대도 같은 규칙. 그리기·3화면 오류 없음.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');
(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),url=process.argv[2]||'http://127.0.0.1:8782';
const p=await b.newPage({viewport:{width:1280,height:800}}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(url);await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const o={};const run=sec=>{for(let i=0;i<sec*30;i++){if(state!=='playing'){for(const g of apPending()){selected=g;apSkip();apCancelAdvance()}apReadyClose();resumeCombat(true)}advancePhase(1/30)}};
 localStorage.clear();titleHide();CHRON=false;setRoute('qing');newRealm();storyState().intro=true;VN_INTRO=false;const S=R.saga;['o_dog','o_eun','o_sa'].forEach(id=>{if(!S.roster.includes(id))S.roster.push(id)});S.party=['o_dog','o_muk'];
 launchChapter(sagaCh('c7'));o.types=['o_dog','o_eun','o_sa','o_un','o_ho','o_seol','o_yeon'].map(heroType).join();const g=groups.findIndex(x=>x.leader==='o_dog');o.type=groups[g].type;o.name=groups[g].name;const us=units.filter(u=>!u.side&&u.g===g&&u.hp>0);o.eng=us.filter(u=>u.type==='eng').length;o.weak=stats.eng[1]<stats.spear[1]&&stats.eng[0]<stats.spear[0];
 // 적을 멀리 두어 아군이 멈춰 있게 한다
 for(const u of units)if(u.side&&!['gate','keep','cat'].includes(u.type)&&!u.fence){u.x=200;u.y=200;u.speed=0;u.damage=0}
 for(const u of units)if(!u.side){u.order='hold';u.speed=0}
 run(17);o.p17=Math.round(engState.get(us[0].squad)?.p||0);o.cat17=!!units.find(u=>u.type==='cat'&&!u.side);run(2);const cat=units.find(u=>u.type==='cat'&&!u.side);o.cat=!!cat;o.catG=cat?.g;o.inSoldier=units.filter(isSoldier).includes(cat);o.inApUnits=apUnits(g).includes(cat);
 // 사거리 안 표적 → 발사 → 범위 피해
 const t=units.find(u=>u.side&&u.hp>0&&isSoldier(u)),t2=units.find(u=>u.side&&u.hp>0&&isSoldier(u)&&u!==t);t.x=cat.x;t.y=cat.y-600;t2.x=cat.x+50;t2.y=cat.y-600;t.seen=t2.seen=true;t.hid=t2.hid=false;const h0=t.hp,h1=t2.hp;cat.cd=0;run(3);o.hit=[h0-t.hp,h1-t2.hp];
 // 공병이 멀리 가면 쏘지 않음
 for(const u of us){u.x+=900;u.rx=u.x}const n0=catShots.length;cat.cd=0;run(.2);o.noCrew=[catShots.length-n0,cat.crew];for(const u of us){u.x-=900;u.rx=u.x}
 // 부수면 다시 짓기
 hit(cat,1e6,'');run(.1);o.reset=Math.round(engState.get(us[0].squad).p);run(19);o.rebuilt=units.filter(u=>u.type==='cat'&&!u.side&&u.hp>0).length;
 // 성문 1.6배
 {const c2=units.find(u=>u.type==='cat'&&!u.side&&u.hp>0),gt=units.find(u=>u.side&&u.type==='gate'&&u.hp>0)||null;if(gt){gt.x=c2.x;gt.y=c2.y-500;const g0=gt.hp;catShots.push({x0:c2.x,y0:c2.y,x1:gt.x,y1:gt.y,t:0,T:.1,side:0,dmg:100});run(.2);o.gate=(g0-gt.hp)/(100*DMG)}}
 draw();
 // 적 공병
 const sqN=()=>new Set(units.filter(u=>u.side&&u.type==='eng').map(u=>u.squad)).size;setRoute('qing');newRealm();storyState().intro=true;launchChapter(sagaCh('c3'));o.xuanSq=sqN();setRoute('qing');newRealm();storyState().intro=true;launchChapter(sagaCh('c5'));const es=units.filter(u=>u.side&&u.type==='eng'&&u.hp>0);o.enemyEng=es.length;o.baiSq=sqN();o.baiLed=units.filter(u=>u.side&&u.type==='eng'&&u.commander).map(u=>u.commander).sort().join();for(const u of units)if(!u.side&&u.hp>0){u.x=WW/2;u.y=WH-100;u.speed=0;u.order='hold'}for(const u of es)u.order='hold';run(13);const ec=units.filter(u=>u.type==='cat'&&u.side&&u.hp>0);o.enemyCat=ec.length;o.baiCat=ec[0]&&[ec[0].tech,Math.round(ec[0].range)];draw();for(const id of['c9','c12','c7']){setRoute('qing');newRealm();launchChapter(sagaCh(id));o['n'+id]=sqN()}
 // 아군 백호 은랑: 12초에 강한 투석기
setRoute('qing');newRealm();storyState().intro=true;{const S2=R.saga;['o_eun'].forEach(id=>{if(!S2.roster.includes(id))S2.roster.push(id)});S2.party=['o_eun'];launchChapter(sagaCh('c7'));for(const u of units)if(u.side&&!['gate','keep','cat'].includes(u.type)&&!u.fence){u.x=200;u.y=200;u.speed=0;u.damage=0}for(const u of units)if(!u.side){u.order='hold';u.speed=0}run(13);const bc=units.find(u=>u.type==='cat'&&!u.side);o.baiAlly=bc&&[bc.tech,Math.round(bc.max/stats.cat[0]*100)]}
 return o});
console.log(JSON.stringify(r));
assert.equal(r.type,'eng');assert(/공병대/.test(r.name));assert(r.eng>=4&&r.weak);
assert(r.p17>=15&&!r.cat17&&r.cat&&r.catG===-2&&!r.inSoldier&&!r.inApUnits,'투석기 짓기');
assert(r.hit[0]>0&&r.hit[1]>0,'범위 피해');assert.deepEqual(r.noCrew,[0,false],'공병 없으면 안 쏨');
assert(r.reset===0&&r.rebuilt===1,'다시 짓기');if(r.gate!=null)assert(Math.abs(r.gate-1.6)<.05,'성문 1.6배 '+r.gate);
assert.equal(r.types,'eng,eng,eng,bow,horse,bow,shield');assert(r.xuanSq===1&&r.baiSq===2&&r.enemyEng>=6&&r.nc9===0&&r.nc12===0&&r.nc7===0,'적 공병 수 '+JSON.stringify(r));assert(r.enemyCat>=1&&r.baiCat[0]===true&&r.baiCat[1]>1000,'백호 적 투석기 12초·사거리');assert(r.baiAlly&&r.baiAlly[0]&&r.baiAlly[1]>=135,'아군 백호 투석기 12초·튼튼');
const art=await p.evaluate(async()=>{for(let i=0;i<40&&!(unitArt.has('eng0')&&soldierDir.get('eng')?.bl&&catImg('ready')&&catImg('fire'));i++)await new Promise(r=>setTimeout(r,100));return{fr:!!unitArt.get('eng0'),dirs:Object.keys(soldierDir.get('eng')||{}).sort().join(),cat:!!catImg('ready')&&!!catImg('fire'),src:artSrc('eng')}});
assert(art.fr&&art.dirs==='bl,br,fl'&&art.cat&&art.src.endsWith('eng.webp'),'공병·투석기 그림 '+JSON.stringify(art));
for(const vp of[{width:390,height:844},{width:844,height:390}]){await p.setViewportSize(vp);await p.evaluate(()=>{measure&&measure();draw()})}
assert.deepEqual(errs,[]);console.log('PASS engineers: 전용 그림(공병 4방향·투석기 2장), 현무 1(도겸)·백호 2(은랑·사율), 백호 12s 강화, catapult build 18s, splash, crew needed, rebuild after destroyed, gate x1.6, enemy engineers in listed chapters');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
