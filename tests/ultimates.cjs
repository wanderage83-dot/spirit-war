// 필살기: 장수 12명 각자 고유 효과(화살비·창벽·도발·대돌격·질풍·저격·회복·공성·사거리·창벽 기절·수레 엄호·사기 꺾기)와 군주 두 개(청명 청룡강림·청류 회복진 / 서진 현무진동·현무 귀갑진), 원형 메뉴 「필살기」, 이름 띄우기. 「도술」 문구 없음.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),p=await b.newPage({viewport:{width:390,height:844}}),errs=[];p.on('pageerror',e=>errs.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8782/');await p.waitForTimeout(1000);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t)),o={};const start=async(route,id)=>{closeModal();setRoute(route);newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);hideBattleVoice();await wait(2500);closeRing()};
 await start('qing','c3');o.noDosul=!document.body.innerHTML.includes('도술');
 const g=1,us0=apUnits(g),gate=units.find(u=>u.side&&u.hp>0&&u.type==='gate');
 const setup=(id)=>{// 부대를 관문 앞에 두고 적 몇 명을 둘레에
  const us=apUnits(g),cx=gate.x,cy=gate.y+260;us.forEach((u,i)=>{u.x=cx+(i%5)*40-80;u.y=cy+Math.floor(i/5)*40;u.hp=u.max*.5;u.focus=null;u.stun=0});groups[g].leader=id;
  const foes=units.filter(u=>u.side&&u.hp>0&&u.type!=='gate'&&u.type!=='boss'&&!u.fence).slice(0,6);foes.forEach((v,i)=>{v.x=cx+(i-3)*50;v.y=cy-120;v.hp=v.max;v.stun=0;v.focus=null});
  const ally=apUnits(2)[0];ally.x=cx+150;ally.y=cy+60;ally.hp=ally.max*.5;
  const boss=units.find(u=>u.side&&u.type==='boss');if(boss){boss.x=cx+300;boss.y=cy-300;boss.hp=boss.max}
  return{us,foes,ally,boss,c:centroid(us)}};
 const run=(id)=>{skillAt[id]=-1e9;selected=g;ap.applying=true;useHeroSkill();ap.applying=false};
 const res={};
 for(const id of Object.keys(HERO_SKILLS)){const S=setup(id),before={foeHp:S.foes.map(v=>v.hp),foePos:S.foes.map(v=>[v.x,v.y]),gate:gate.hp,ally:S.ally.hp,self:S.us.map(u=>u.hp),boss:S.boss?.hp,mor:S.foes.map(v=>mor(v.squad).v)};run(id);
  const dmg=S.foes.reduce((n,v,i)=>n+Math.max(0,before.foeHp[i]-v.hp),0),moved=S.foes.some((v,i)=>Math.hypot(v.x-before.foePos[i][0],v.y-before.foePos[i][1])>20),stun=S.foes.some(v=>v.stun>0),taunt=S.foes.some(v=>v.focus===S.us.find(u=>u.commander===id)||v.focus===S.us[0]),heal=S.ally.hp>before.ally,selfHeal=S.us.some((u,i)=>u.hp>before.self[i]),gateHit=gate.hp<before.gate,bossHit=S.boss&&S.boss.hp<before.boss,mdrop=S.foes.some((v,i)=>mor(v.squad).v<before.mor[i]-30||mor(v.squad).rout>0),rng=S.us[0].type==='bow'||units.some(u=>!u.side&&u.type==='bow'&&u.rngUntil>time),run2=S.us.some(u=>u.run>=200);
  res[id]={ult:HERO_SKILLS[id].ult,dmg:Math.round(dmg),moved,stun,taunt,heal,selfHeal,gateHit,bossHit,mdrop,rng,run:run2,banner:$('#powerup b').textContent};gate.hp=gate.max}
 o.res=res;
 // 사거리 배율
 const bw=units.find(u=>!u.side&&u.type==='bow');if(bw){bw.rngUntil=0;const r0=attackRange(bw);bw.rngUntil=time+5;o.rngMul=+(attackRange(bw)/r0).toFixed(2);bw.rngUntil=0}
 // 군주 필살기: 청명
 const L=(route)=>{const foes=units.filter(u=>u.side&&u.hp>0&&u.type!=='gate'&&u.type!=='boss'&&!u.fence).slice(0,4);const x=foes[0].x,y=foes[0].y;foes.forEach(v=>{v.x=x;v.y=y;v.hp=v.max;v.stun=0});const h0=foes.map(v=>v.hp);resolveSpell('dragon',x,y);const dd=foes.reduce((n,v,i)=>n+(h0[i]-v.hp),0)/foes.length;const st=foes.some(v=>v.stun>0);const a=apUnits(0)[0];a.hp=a.max*.3;const ah=a.hp;resolveSpell('heal',a.x,a.y);return{dmg:Math.round(dd),stun:st,heal:+((a.hp-ah)/a.max).toFixed(2),def:bfv(a,'def'),banner:$('#powerup b').textContent}};
 o.qing=L('qing');choose(0);await wait(30);document.querySelector('#ring .ring-item[data-k="spell"]')?.click();await wait(30);o.qingRing=[...document.querySelectorAll('#ring .ring-item span')].map(s=>s.textContent);closeRing();
 await start('xuan','x2');o.xuan=L('xuan');choose(0);await wait(30);o.spellLabel=document.querySelector('#ring .ring-item[data-k="spell"] span')?.textContent;document.querySelector('#ring .ring-item[data-k="spell"]')?.click();await wait(30);o.xuanRing=[...document.querySelectorAll('#ring .ring-item span')].map(s=>s.textContent);return o});
console.log(JSON.stringify(r,null,0));
const R=r.res,ex={volley:x=>x.dmg>0,spearwall:x=>x.moved&&x.stun,taunt:x=>x.taunt,charge:x=>x.run,gale:x=>x.dmg>0&&x.moved,snipe:x=>x.bossHit||x.dmg>0,rally:x=>x.heal&&x.selfHeal,siege:x=>x.gateHit,survey:x=>x.rng,wall:x=>x.stun&&x.moved,cover:x=>x.heal,scheme:x=>x.mdrop};
assert.equal(Object.keys(R).length,12,'장수 12명');for(const [id,x] of Object.entries(R)){assert(ex[x.ult](x),id+' '+x.ult+' '+JSON.stringify(x));assert(x.banner.includes('✦'),id+' 이름 띄우기')}
assert.equal(r.rngMul,1.25);assert(r.noDosul,'도술 문구 없음');
assert(r.qing.dmg>80&&!r.qing.stun&&r.qing.heal>=.4,'청명 '+JSON.stringify(r.qing));assert(r.xuan.dmg>50&&r.xuan.dmg<r.qing.dmg&&r.xuan.stun&&r.xuan.heal>=.2&&r.xuan.def<1,'서진 '+JSON.stringify(r.xuan));
assert(r.qingRing.includes('청룡강림')&&r.qingRing.includes('청류 회복진'),'청명 고리');assert.equal(r.spellLabel,'필살기');assert(r.xuanRing.includes('현무진동')&&r.xuanRing.includes('현무 귀갑진'),'서진 고리');
assert.deepEqual(errs,[]);console.log('PASS 12 hero ultimates with unique effects, two lord ultimates per route, ring 「필살기」, no 도술 text');await b.close()})();
