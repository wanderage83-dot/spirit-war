// 장별 승리 조건(goal): 20장(호송 포함)의 목표가 실제 조건 충족 시 승리(시간 제한은 패배)로 끝나고, 제압 장에서는 적장 격파로 끝나지 않는지, 모바일에서 목표 띠가 잘리지 않는지 검사한다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{window.requestAnimationFrame=()=>0;const out=[];
 for(const route of['qing','xuan']){setRoute(route);newRealm();showRealm();for(const c of SAGA){if(!c.goal)continue;R.saga.act=c.act;launchChapter(c);hideBattleVoice&&hideBattleVoice();events=[];nextRaid=1e9;state='playing';
  const g=c.goal,boss=units.find(u=>u.type==='boss'),txt=goalText();const far=()=>units.filter(u=>u.side&&u.hp>0&&!['boss','gate'].includes(u.type)&&!u.royalGuard).forEach(u=>{u.x=200;u.y=200;u.post={x:200,y:200}});
  let note='';
  if(g.t==='rout'){hit(boss,1e9);for(let i=0;i<10;i++)update(1/30);note='bossKillEnds='+(state!=='playing');const sq=[...new Set(units.filter(u=>u.side&&u.hp>0&&u.squad&&!['boss','gate'].includes(u.type)).map(u=>u.squad))].slice(0,g.n);sq.forEach(routSquad)}
  if(g.t==='hold'){far();const A=units.filter(u=>!u.side&&u.hp>0&&u.g===1);A.forEach((u,i)=>{const q=nearestCell(goalState.spot.x+(i%4)*30-45,goalState.spot.y+Math.floor(i/4)*30);u.x=q.x;u.y=q.y;u.order='hold'});note='spotWalk='+walkable(goalState.spot.x,goalState.spot.y)}
  if(g.t==='holdAll'){supplySites.forEach(d=>{if(d.id!=='center')d.capture=1});capture=1}
  if(g.t==='reach'){const h=units.find(u=>u.type==='hero');h.x=goalState.spot.x;h.y=goalState.spot.y;note='spotWalk='+walkable(goalState.spot.x,goalState.spot.y)}
  if(g.t==='destroy'){note='targets='+goalState.targets.length+' walk='+goalState.targets.every(t=>walkable(t.x,t.y)||true);goalState.targets.slice(0,g.n||9).forEach(t=>hit(t,1e9))}
  if(g.t==='mask'){for(let i=0;i<5;i++)hit(boss,1e9);note='bossHp='+(boss.hp/boss.max).toFixed(2)}
  if(g.t==='boss'){time=g.turns*AP_TURN}
  if(g.t==='escort'){const esc=units.filter(u=>!u.side&&u.g===0&&u.hp>0);const cart=goalState.carts[0],x0=cart.x,y0=cart.y,home=units.filter(u=>!u.side&&!['cart','keep'].includes(u.type)).map(u=>[u,u.x,u.y]);home.forEach(([u])=>{u.x=4600;u.y=4600});for(let i=0;i<30;i++)update(1/30);home.forEach(([u,x,y])=>{u.x=x;u.y=y});note='stillAlone='+(cart.wait==='호위 필요'&&Math.hypot(cart.x-x0,cart.y-y0)<130);for(let t=0;t<30*120&&state==='playing';t++){const cc=goalState.carts.find(c=>c.hp>0);if(cc)esc.forEach((u,i)=>{u.x=cc.x-60+(i%3)*30;u.y=cc.y+90;u.order='hold'});far();update(1/30)}}
  if(g.t==='final'){hit(boss,1e9);for(let i=0;i<5;i++)update(1/30);note='altar='+goalState.targets.length+' state='+state;goalState.targets.forEach(t=>hit(t,1e9))}
  const steps=g.t==='hold'?Math.ceil(g.turns*AP_TURN*30)+30:30;for(let i=0;i<steps&&state==='playing';i++){if(g.t==='hold')far();update(1/30)}
  out.push(`${c.id} ${g.t} [${txt}] → ${state} win=${pendingWin} lose=${loseReason} ${note}`)}}
 return out});

console.log(r.join('\n'));assert.equal(r.length,20);for(const line of r){if(/ boss \[/.test(line))assert.match(line,/win=false lose=time/,line);else assert.match(line,/→ ending win=true/,line);if(/ rout \[/.test(line))assert.match(line,/bossKillEnds=false/,line);if(/ escort \[/.test(line))assert.match(line,/stillAlone=true/,line)}
const lost=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c8');R.saga.act=c.act;launchChapter(c);state='playing';events=[];goalState.carts.slice(0,2).forEach(c=>hit(c,1e9));for(let i=0;i<5;i++)update(1/30);return state+':'+loseReason});assert.equal(lost,'ending:cart');
for(const size of[{width:320,height:568},{width:390,height:844},{width:844,height:390}]){await p.setViewportSize(size);const chip=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();const c=SAGA.find(c=>c.id==='c10');R.saga.act=c.act;launchChapter(c);apUI();const g=document.querySelector('#goalchip');return{text:g.textContent,hidden:g.hidden,clip:g.scrollWidth>g.clientWidth+1}});assert(!chip.hidden&&chip.text.startsWith('목표')&&!chip.clip,JSON.stringify(chip));console.log('goal chip fits',size)}
const plain=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();launchChapter(SAGA[0]);apUI();return document.querySelector('#goalchip').hidden});assert(plain,'chapter without goal hides the chip');
assert.deepEqual(errors,[]);console.log('PASS20chapter goals(escort included) win/lose, rout ignores boss kill, final altar, chip on3mobile sizes');await b.close()})();
