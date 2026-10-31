// 장수 전투 특성(HERO_TRAITS): 각 장수가 출진해 살아 있을 때와 없을 때를 비교해 수치가 바뀌는지 검사한다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage(),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{window.requestAnimationFrame=()=>0;const fresh=()=>{setRoute('qing');newRealm();showRealm();launchChapter(SAGA[1]);hideBattleVoice&&hideBattleVoice();events=[];nextRaid=1e9;state='playing';groups.forEach((g,i)=>{if(i)g.leader=null});units.forEach(u=>{if(!u.side)u.commander=null})};
 // g번 부대를 id 장수가 이끌게 만든다(시험용)
 const lead=(g,id)=>{groups[g].leader=id;const us=apUnits(g);us.forEach(u=>{if(u.commander)u.commander=null});us[0].commander=id;return us};
 const out={};
 fresh();const h=units.find(u=>!u.side&&u.type==='hero');let hp=h.hp;hit(h,100);out.mukOff=hp-h.hp;const mk=lead(1,'o_muk');mk[0].x=h.x+100;mk[0].y=h.y;hp=h.hp;hit(h,100);out.mukOn=hp-h.hp;
 fresh();let g0=gold;updateEconomy(1);out.danOff=gold-g0;lead(1,'o_dan');g0=gold;updateEconomy(1);out.danOn=gold-g0;
 fresh();queue.length=0;queue.push({...recipes[1],n:2,left:99});let l0=queue[0].left;updateEconomy(1);out.biOff=l0-queue[0].left;lead(1,'o_bi');l0=queue[0].left;updateEconomy(1);out.biOn=l0-queue[0].left;
 fresh();const u1=apUnits(1)[0],t=units.find(u=>u.side&&u.type!=='boss'),m={charged:true,blocked:false,shield:.55};out.atkOff=traitAtkMul(u1,t,m);lead(1,'o_ho');out.ho=traitAtkMul(apUnits(1)[0],t,{charged:true,blocked:false,shield:1});lead(1,'o_seol');out.seol=+traitAtkMul(apUnits(1)[0],t,{shield:.55}).toFixed(3);lead(1,'o_eun');out.eun=traitAtkMul(apUnits(1)[0],{type:'gate'},{shield:1});
 fresh();let us=apUnits(1),sq=us[0].squad;morale.delete(sq);shaken(us[1],20,'side');out.yeonOff=+(100-mor(sq).v).toFixed(3);lead(1,'o_yeon');us=apUnits(1);morale.delete(sq);shaken(us[1],20,'side');out.yeonOn=+(100-mor(sq).v).toFixed(3);
 fresh();const P={x:900,y:2300};apUnits(1).forEach(u=>{u.x=P.x;u.y=P.y});units.filter(u=>u.side&&!['gate','boss'].includes(u.type)).forEach(u=>{u.x=200;u.y=200});out.saOff=+updatePoint(0,P,170,1,'시험').toFixed(4);lead(1,'o_sa');apUnits(1).forEach(u=>{u.x=P.x;u.y=P.y});out.saOn=+updatePoint(0,P,170,1,'시험').toFixed(4);
 fresh();const shield=units.find(u=>!u.side&&u.type==='shield'),foe=units.find(u=>u.side&&!['boss','gate'].includes(u.type));units.forEach(u=>{if(!u.side&&u!==shield){u.x=100;u.y=100}});const zocAt=()=>{foe.zocT=0;foe.x=shield.x+120;foe.y=shield.y;foe.order='move';zocCheck(foe,units.filter(u=>u.hp>0),shield.x+125,shield.y);return foe.zocT>0};out.hongOff=zocAt();lead(shield.g,'o_hong');shield.oppCd=0;out.hongOn=zocAt();
 fresh();const cart=spawnCart('center',{name:'시험 수레',cart:'supply',to:'home'});hp=cart.hp;hit(cart,100);out.haOff=hp-cart.hp;const ha=lead(2,'o_ha');ha[0].x=cart.x+100;ha[0].y=cart.y;hp=cart.hp;hit(cart,100);out.haOn=hp-cart.hp;
 fresh();const es=units.find(u=>u.side&&u.squad&&!['boss','gate'].includes(u.type)&&!u.royalGuard).squad;routSquad(es);out.dogOff=mor(es).rout;fresh();lead(1,'o_dog');const es2=units.find(u=>u.side&&u.squad&&!['boss','gate'].includes(u.type)&&!u.royalGuard).squad;routSquad(es2);out.dogOn=mor(es2).rout;
 return out});
console.log(r);
assert(Math.abs(r.mukOn/r.mukOff-.7)<.01,'묵철');assert(Math.abs(r.danOn-r.danOff-3)<.01,'단심');assert(Math.abs(r.biOn/r.biOff-1.5)<.01,'비연');
assert.equal(r.atkOff,1);assert.equal(r.ho,1.25);assert.equal(r.seol,+(1/.55).toFixed(3));assert.equal(r.eun,1.6);
assert(Math.abs(r.yeonOn/r.yeonOff-.5)<.01,'연백');assert(Math.abs(r.saOn/r.saOff-2)<.01,'사율');assert(!r.hongOff&&r.hongOn,'홍염');assert(Math.abs(r.haOn/r.haOff-.6)<.01,'해린');assert.equal(r.dogOff,7);assert.equal(r.dogOn,10);
assert.deepEqual(errors,[]);console.log('PASS 11 hero traits change the intended numbers only while the hero fights');await b.close()})();
