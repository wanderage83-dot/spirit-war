// 묵철 15판 전사·삼각관계 선택 대사·갈등 장면: 15판 승리 뒤 편성에서 빠지고 결과에 「전사」, 16판에는 묵철 대사가 없고, 14·16판 선택 대사가 13판 선택대로 갈린다.
// Requires Playwright and Chromium. Serve the repository and pass its URL.
const{chromium}=require('playwright'),assert=require('node:assert/strict');(async()=>{const b=await chromium.launch({executablePath:'/usr/bin/chromium'}),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(String(e)));await p.goto(process.argv[2]||'http://127.0.0.1:8797/');await p.waitForTimeout(600);
const r=await p.evaluate(()=>{const out={};setRoute('qing');newRealm();showRealm();const S=R.saga,ids=SAGA.map(c=>c.id);
 // 14판 직전까지 진행한 것으로 만들기
 for(const c of SAGA.slice(0,13)){S.cleared.push(c.id);(c.join||[]).forEach(joinHero);(c.joinAfter||[]).forEach(joinHero)}S.choices.c13='biyeon';syncSagaOfficers();
 const c14=sagaCh('c14'),c15=sagaCh('c15'),c16=sagaCh('c16'),txt=L=>L.map(l=>l[1]).join('|');
 out.c14b=txt(partyLines(c14.pre,c14));S.choices.c13='yeonhwa';out.c14y=txt(partyLines(c14.pre,c14));
 out.mukBefore=S.roster.includes('o_muk');
 // 15판 승리 처리
 S.cleared.push('c14');R.pendingBattle=null;battleCfg={...battleCfg,campaign:{saga:'c15'}};const vn=window.vnPlay;let shown=null;window.vnPlay=(lines,o)=>{shown=lines;o?.onClose&&o.onClose()};sagaBattleDone(true);window.vnPlay=vn;
 out.post15=shown&&shown.some(l=>l[1].includes('이번엔 내가 남는다'));out.mukAfter=S.roster.includes('o_muk')||S.party.includes('o_muk');out.result=(document.querySelector('#rmodal')?.textContent||'').includes('전사');
 out.c16speakers=[...partyLines(c16.pre,c16),...partyLines(c16.post,c16)].map(l=>l[0]);out.c16y=txt(partyLines(c16.post,c16));S.choices.c13='biyeon';out.c16b=txt(partyLines(c16.post,c16));
 out.echo=endingEchoes().includes('묵철');out.depart=c15.depart;return out});
console.log(JSON.stringify(r).slice(0,600));
assert.ok(r.c14b.includes('이번엔 기다리는 쪽')&&!r.c14b.includes('오늘 밤엔 꼭 돌아와요'));assert.ok(r.c14y.includes('오늘 밤엔 꼭 돌아와요')&&!r.c14y.includes('이번엔 기다리는 쪽'));
assert.ok(r.mukBefore&&!r.mukAfter,'muk removed');assert.ok(r.post15);assert.ok(r.result,'result shows 전사');assert.ok(!r.c16speakers.includes('o_muk'));
assert.ok(r.c16y.includes('옆에 있을게요')&&!r.c16y.includes('같이 돌아가요'));assert.ok(r.c16b.includes('같이 돌아가요')&&!r.c16b.includes('옆에 있을게요'));assert.ok(r.echo);assert.deepEqual(r.depart,['o_muk']);assert.deepEqual(errors,[]);
console.log('PASS muk dies in c15 (roster/result/echo), c16 without him, c14/c16 lines follow the c13 choice');await b.close()})().catch(e=>{console.error(e);process.exit(1)});
