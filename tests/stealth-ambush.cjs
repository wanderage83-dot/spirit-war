// 시야·잠행·매복·기습: 숲·덤불 은폐(220)·등 뒤 45%, 잠행(+1 AP·느림·260), 매복(덤불에서만·250 안 적이 오면 덮침), 기습 배율 ×1.5·기절·사기 −30·8초 재사용, 마지막 본 자리 표시, 고리 항목.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),fs=require('fs'),assert=require('node:assert/strict');(async()=>{const exe=['/usr/bin/chromium','/opt/pw-browsers/chromium'].find(p=>fs.existsSync(p)),b=await chromium.launch(exe?{executablePath:exe}:{}),errs=[],URL=process.argv[2]||'http://127.0.0.1:8782/';
const p=await b.newPage({viewport:{width:1280,height:800}});p.on('pageerror',e=>errs.push(String(e)));await p.goto(URL);await p.waitForTimeout(1200);
const r=await p.evaluate(async()=>{const wait=t=>new Promise(r=>setTimeout(r,t));const o={};const L=u=>u.hp>0&&!['keep','gate','cart','boss'].includes(u.type)&&!u.structure&&!u.fence;
const open=async id=>{closeModal();setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id===id);R.saga.act=c.act;launchChapter(c);await wait(200)};
const vis=()=>{visAt=0;computeVision()};const step=(n=.025)=>advancePhase(n);
const place=(us,x,y,dir)=>us.forEach((u,i)=>{u.x=x+(i%4)*60-90;u.y=y+Math.floor(i/4)*60;u.tx=u.x;u.ty=u.y;u.dir=dir;u.holdDir=dir;u.path=null;u.goal=null;u.order='hold';u.lfx=null;u.rx=u.x;u.ry=u.y});
await open('c7');const A=units.filter(u=>!u.side&&L(u)),E=units.filter(u=>u.side&&L(u));
// 은폐 칸·트인 칸 찾기
let cov=null,openP=null;for(let y=WH*.25;y<WH*.85&&!(cov&&openP);y+=40)for(let x=200;x<WW-200;x+=40){if(!walkable(x,y))continue;if(!cov&&coverNear(x,y)&&coverAt(x,y)&&[[0,0],[60,0],[0,60],[60,60],[-60,0],[120,0]].every(([a,c])=>walkable(x+a,y+c)))cov={x,y};if(!openP&&!coverAt(x,y)&&!coverNear(x,y)&&forestNear(x,y,300).forest<.05)openP={x,y}}
o.cov=!!cov;o.open=!!openP;
// 1. 은폐: 숲 속 적은 멀리 있으면 안 보이고, 정면 200에서는 보이고, 등 뒤 150에서는 안 보인다
const e=E.find(u=>!units.some(v=>v.squad===u.squad&&(v.type==='boss'||v.guardLord)));const eq=E.filter(u=>u.squad===e.squad);units.filter(u=>u.hp>0&&!['keep','gate','cart'].includes(u.type)&&!u.structure&&!u.fence).forEach(u=>{u.x=-9999;u.y=-9999});
eq.forEach(u=>{u.x=cov.x;u.y=cov.y;u.dir=0});const a0=A[0];a0.x=cov.x+1500;a0.y=cov.y;vis();o.farHid=e.hid&&!e.seen;a0.x=cov.x+200;a0.y=cov.y;vis();o.frontSeen=!e.hid&&e.seen;a0.dir=Math.PI;a0.x=cov.x-150;vis();o.rearHid=e.hid;a0.x=cov.x-90;vis();o.rearClose=!e.hid;a0.dir=0;
FOG_ON=false;a0.x=cov.x+1500;vis();o.fogOffSeen=!e.hid;FOG_ON=true;
// 마지막 본 자리
a0.dir=Math.PI;a0.x=cov.x+200;vis();e.squad&&ghosts.delete(e.squad);a0.x=cov.x+1500;vis();o.ghost=ghosts.has(e.squad);eq.forEach(u=>{u.x=-9999;u.y=-9999});
// 2. 숨은 아군은 적이 고르지 않는다
const v=A.find(u=>u.type!=='hero');v.x=cov.x;v.y=cov.y;v.dir=0;const foe=E.find(u=>u.type==='shield'||u.type==='spear')||E[1];foe.x=cov.x+400;foe.y=cov.y;foe.dir=Math.PI;foe.order='attack';foe.focus=null;vis();o.allyHid=v.hid;const live=units.filter(u=>u.hp>0);o.foeTarget=acquire(foe,live,null)===v;v.x=cov.x+800;v.y=cov.y+600;vis();
// 3. 기습 배율
await open('c2');{const A2=units.filter(u=>!u.side&&L(u)),E2=units.filter(u=>u.side&&L(u));const u=A2.find(x=>x.type==='spear')||A2[0],t=E2.find(x=>x.type!=='horse');t.dir=0;u.x=t.x-60;u.y=t.y;const m=matchupInfo(u,t);u.hidT=-99;const base=attackDamage(u,t,m);const mv0=mor(t.squad).v;u.hidT=time;surprised.clear();t.stun=0;const sur=attackDamage(u,t,m);o.mul=+(sur/base).toFixed(3);o.stun=t.stun;o.moraleDrop=Math.round(mv0-mor(t.squad).v);o.cool=+(attackDamage(A2.find(x=>x.squad!==u.squad&&x.type!=='hero')||u,t,m)/1).toFixed(1);const other=A2.find(x=>x.squad!==u.squad&&x.type!=='hero');other.hidT=time;other.x=t.x-60;other.y=t.y;const om=matchupInfo(other,t);const ob=(()=>{const k=other.hidT;other.hidT=-99;const d=attackDamage(other,t,om);other.hidT=k;return d})();o.coolMul=+(attackDamage(other,t,om)/ob).toFixed(3);
// 같은 부대 동시 타격은 배율 유지
const mate=A2.find(x=>x.squad===u.squad&&x!==u);if(mate){mate.hidT=time;mate.x=t.x-60;mate.y=t.y+20;const mm=matchupInfo(mate,t),k=mate.hidT;mate.hidT=-99;const mb=attackDamage(mate,t,mm);mate.hidT=k;o.mateMul=+(attackDamage(mate,t,mm)/mb).toFixed(3)}
// 총 배율 6 상한(기병 후방 돌격 ×6이면 추가 없음)
const h=A2.find(x=>x.type==='horse');if(h){h.run=200;t.dir=0;h.x=t.x-60;h.y=t.y;surprised.clear();const hm=matchupInfo(h,t);h.hidT=-99;const hb=attackDamage(h,t,hm);h.run=200;h.hidT=time;const hs=attackDamage(h,t,matchupInfo(h,t));o.capMul=+(hs/hb).toFixed(3);o.capTotal=hm.total}}
// 4. 잠행: 비용 +1·느림·숨어 도착
await open('c2');{const g=groups.findIndex((x,i)=>i>0&&x.type!=='horse');selected=g;const us=apUnits(g),c=centroid(us),tx=c.x,ty=c.y-500;apAdd('move',{x:tx,y:ty});const mc=apPlan(g)[0].cost;apUndo();apCancelAdvance?.();selected=g;apAdd('sneak',{x:tx,y:ty});const sp=apPlan(g)[0];o.sneakCost=sp.cost;o.moveCost=mc;o.sneakKind=sp.kind;selected=-1;closeRing();apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();for(let i=0;i<4/.025;i++)step();o.sneakMv=us.every(u=>u.sneakMv);o.stealth=us.every(u=>u.stealth);const c4=centroid(us);o.sneakDist=Math.round(Math.hypot(c4.x-c.x,c4.y-c.y));for(let i=0;i<14/.025&&state==='playing';i++)step();o.stealthAfter=us.some(u=>u.stealth);o.flag=fieldSquads().some(s=>s[0].g===g)}
// 5. 매복: 들판에서는 거절, 덤불에서는 숨고, 적이 250 안에 오면 덮친다
await open('c7');{const A3=units.filter(u=>!u.side&&L(u));const g=groups.findIndex((x,i)=>i>0&&x.type!=='horse'&&apUnits(i).length);const us=apUnits(g);units.filter(u=>u.side&&u.hp>0&&!['keep','gate','cart'].includes(u.type)&&!u.structure&&!u.fence).forEach(u=>{u.x=-9999;u.y=-9999});place(us,openP.x,openP.y,0);selected=g;apAdd('ambush');o.plainRejected=!apPlan(g).length&&/숲/.test($('#toast').textContent);apCancelAdvance?.();place(us,cov.x,cov.y,0);selected=g;apAdd('ambush');o.ambushPlanned=apPlan(g).some(a=>a.kind==='ambush');selected=-1;closeRing();apSkip();if(!apReady)apReadyOpen();document.querySelector('#apready-run').click();for(let i=0;i<2/.025;i++)step();o.ambushing=us.every(u=>u.ambush&&u.stealth);vis();o.ambushHid=us.every(u=>u.hid);
const fs=units.filter(u=>u.side&&L(u)&&u.type!=='horse');const sq=fs[0].squad,fq=fs.filter(u=>u.squad===sq);fq.forEach((u,i)=>{u.x=cov.x+600+(i%4)*50;u.y=cov.y+Math.floor(i/4)*50;u.order='attack';u.goal={x:cov.x-600,y:cov.y};u.focus=null;u.dir=Math.PI});const hp0=fq.reduce((n,u)=>n+u.hp,0);let sprung=-1;for(let i=0;i<8/.025&&state==='playing';i++){{const dmin=Math.min(...fq.map(f=>Math.min(...us.map(a=>Math.hypot(a.x-f.x,a.y-f.y)))));if(dmin>70)fq.forEach(u=>{u.x-=4;u.tx=u.x;u.order='hold'})}step();if(sprung<0&&!us.some(u=>u.ambush))sprung=i}o.sprung=sprung>=0;o.sprungOrder=us.filter(u=>u.order==='attack').length;o.banner=$('#powerup')?.textContent||'';o.ambushSurprise=surprised.has(sq);o.foeLoss=Math.round(hp0-fq.reduce((n,u)=>n+Math.max(0,u.hp),0))}
// 6. 고리 항목
await open('c2');{for(let g=0;g<groups.length;g++){if(!apUnits(g).length)continue;choose(g);await wait(30);const ks=[...document.querySelectorAll('#ring .ring-item')].map(b=>b.dataset.k+(b.classList.contains('off')?':off':''));o['ring'+g]={type:groups[g].type,ks}}}
// 7. 정면·측면·후방 부채꼴 그리기
{const g=groups.findIndex((x,i)=>i>0);selected=g;const t=units.find(u=>u.side&&L(u));apTargetOpen(t,t.x,t.y);draw();o.arcOk=true;apTargetClose()}
return o});
console.log(JSON.stringify(r));
assert(r.cov&&r.open,'은폐 칸·트인 칸');assert(r.farHid&&r.frontSeen&&r.rearHid&&r.rearClose,'숲 은폐 220·등 뒤 45%');assert(r.fogOffSeen,'FOG_ON=false면 은폐 없음');assert(r.ghost,'마지막 본 자리');
assert(r.allyHid&&!r.foeTarget,'숨은 아군은 적이 고르지 않음');
assert.equal(r.mul,1.5,'기습 ×1.5');assert(r.stun>=.8&&r.moraleDrop===30,'기절·사기 −30');assert.equal(r.coolMul,1,'다른 부대 8초 안 재기습 없음');if(r.mateMul!=null)assert.equal(r.mateMul,1.5,'같은 부대 동시 타격 배율');if(r.capMul!=null)assert(r.capMul<=Math.max(1,6/r.capTotal)+1e-3,'총 배율 6 상한');
assert.equal(r.sneakKind,'sneak');assert(r.sneakCost>=r.moveCost+1||r.sneakCost===8,'잠행 +1 AP');assert(r.sneakMv&&r.stealth,'잠행 중 숨음');assert(r.stealthAfter,'잠행 뒤 숨어 대기');
assert(r.plainRejected,'들판 매복 거절');assert(r.ambushPlanned&&r.ambushing&&r.ambushHid,'덤불 매복');assert(r.sprung&&r.sprungOrder>0&&/매복|기습/.test(r.banner)&&r.foeLoss>0&&r.ambushSurprise,'적 접근 시 매복 발동·기습 피해');
for(const [k,x] of Object.entries(r).filter(([k])=>/^ring\d/.test(k))){const g=+k.slice(4);if(x.type==='horse'){assert(!x.ks.some(s=>/^sneak|^ambush/.test(s)),'기병 잠행·매복 없음')}else{assert.equal(x.ks.some(s=>s.startsWith('sneak')),g>0,'잠행 '+g);assert(x.ks.some(s=>s.startsWith('ambush')),'매복 항목 '+g)}}
assert(r.arcOk);assert.deepEqual(errs,[]);console.log('PASS cover/rear sight, ghosts, hidden allies ignored, sneak +1AP, ambush spring, surprise x1.5/stun/morale/cooldown/cap, ring items');await b.close()})();
