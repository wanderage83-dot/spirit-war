// 좌우 떨림 제거와 전투 볼거리: 실제 전투 4턴에서 그림 방향 깜빡임·화면 위치 미세 흔들림을 재고, 먼지·베기 궤적·기병 질주선이 생기는지 확인한다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:1280,height:800}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(800);
const r=await p.evaluate(()=>{setRoute('qing');newRealm();showRealm();launchChapter(SAGA[2]);hideBattleVoice&&hideBattleVoice();events=[];
 const st={flips:0,fast:0,frames:0,acc:0,dust:0};const last=new Map();
 for(let turn=0;turn<4;turn++){for(let g=0;g<groups.length;g++){const us=apUnits(g);if(!us.length)continue;selected=g;const e=units.filter(v=>v.side&&v.hp>0&&v.type!=='keep'&&v.type!=='gate').sort((a,b)=>Math.hypot(a.x-us[0].x,a.y-us[0].y)-Math.hypot(b.x-us[0].x,b.y-us[0].y))[0];if(e)apAdd('engage',{target:e,x:e.x,y:e.y})}
  apCancelAdvance();while(apPending().length)apSkip();$('#apready-run').click();
  for(let i=0;i<560&&state==='playing';i++){advancePhase(1/40);st.dust=Math.max(st.dust,fx.filter(f=>f.kind==='dust').length);for(const u of units){if(u.hp<=0||['keep','gate','cart'].includes(u.type))continue;const s=project(RX(u),RY(u)).x,l=last.get(u);if(!l){last.set(u,{x:s,f:u.vface});continue}st.frames++;if(u.vface!==l.f){st.flips++;if(l.ft!==undefined&&time-l.ft<.3)st.fast++;l.ft=time}if(l.px!==undefined)st.acc+=Math.abs(s-2*l.x+l.px);l.px=l.x;l.x=s;l.f=u.vface}}
  if(state!=='planning')break}
 // 정지 후에는 그림이 실제 좌표로 맞춰진다
 const u=units.find(v=>!v.side&&v.hp>0&&v.type!=='keep');u.rx=u.x+9;u.ry=u.y;settleBattleVisuals();st.snap=u.rx===u.x&&u.ry===u.y&&!(u.vmT>0);
 // 방향은 짧은 반대 신호로 바뀌지 않고, 유지되면 바뀐다
 u.vface=1;u.vfT=0;faceTo(u,-1,.1);st.hold=u.vface;faceTo(u,1,.1);faceTo(u,-1,.2);faceTo(u,-1,.3);st.turned=u.vface;
 // 베기 궤적·기병 질주선
 const e=units.find(v=>v.side&&v.hp>0&&v.type!=='keep'&&v.type!=='gate');fx=[];slashFx(u,e,'charge');st.slash=fx.some(f=>f.kind==='slash'&&f.big);
 return st});
console.log(r);assert.ok(r.frames>50000);assert.ok(r.fast<=r.frames/4000,'facing flicker');assert.ok(r.acc/r.frames<.04,'screen jitter '+r.acc/r.frames);assert.ok(r.dust>0);assert.ok(r.snap);assert.equal(r.hold,1);assert.equal(r.turned,-1);assert.ok(r.slash);assert.deepEqual(errors,[]);console.log('PASS facing hysteresis, smoothed sprite position, dust/slash effects');await b.close()})();
