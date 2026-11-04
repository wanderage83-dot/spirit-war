# 청룡전기 / 사신전기 — 작업 안내

> **클로드 인수인계 시작점:** [CLAUDE_HANDOFF.md](CLAUDE_HANDOFF.md)를 먼저 읽는다. 2026-10-31의 현재 상태·규칙·검증·남은 실기 확인을 한 문서로 정리했다. 기준 게임 커밋은 `a1389f1`이다.
>
> 아래 구현 이력 중 오래된 설명은 최신 변경으로 대체됐다. 현재는 **대화 배경5장/322줄,큰 초상 우선,12초 AP,보병320·기병360 장수 반경,한글 UI,진영색만 식별**이다. 머리 위 진영 배지·아군/적군 접두어·원/마름모 구분·기억 희생은 복원하지 않는다.


왕인 전쟁과 네 나라의 동맹을 그리는 동양 판타지 SRPG. 빌드 도구·의존성 없는 **정적 HTML 단일 파일** 게임이다.
기능 목록은 `README.md` 참고.

## 파일
- `index.html` — 게임 전체(HTML·CSS·JS). 한 줄이 수천 자인 압축형 코드로 약 470KB.
- 그림: 루트 `hero/shield/bow/horse/spear.webp`(병종), `portraits/`(군주·장수 초상), `characters/`(장수 전투 그림), `terrain/`(지면·환경 오브젝트).
- `README.md`(플레이어용 기능 목록, 기능을 바꾸면 함께 고친다), `STORY.md`(세계관·인물·기승전결), `사신기.md`(청명16판·현무10판의 전체 대사·군주 시점·선택·결말), `CHARACTERS.md`(20명 인물 사전·극중 역할·말투·정리 필요 목록, 나무위키식), `HANDOFF.md`(인수인계 기록, 맨 위가 최신). `ART_REQUESTS.md`(ChatGPT에 맡기는 그림 요청서·상태).

## 게임 구조 — 창세기전식 이야기 중심 SRPG
천하도(장 진행 지도) → 출진 준비(편성·장비·상점) → RPG식 대화 → 15초 AP 동시 전투(부대별 순차 계획 → 실행 → 자동 정지) → 대화·선택 → 보상 → 막이 끝나면 전선 회의. 줄 번호는 자주 바뀌므로 아래 심볼 이름으로 `grep -o` 해서 찾는다.

| 영역 | 주요 심볼 |
|---|---|
| 장 진행 | `SAGA`(청명16/현무10장: `pre`/`post` 대화, `choices`, `join`/`joinAfter`, `item`, `capital`, `fallen`, `final`), `SAGA_ACTS`, `ACT_INTRO`, `newSaga`, `openChapter`(편성·장비·상점 탭), `startChapter`, `launchChapter`, `sagaBattleDone`, `sagaAfterChapter`, `sagaRitual` |
| 장수 | `HERO_TYPES`, `heroType`·`heroName`·`squadName`, `sagaHero`(lv·xp·eq), `joinHero`, `applySagaLevels`, `HERO_SKILLS`·`useHeroSkill`·`bfv`(버프), `ITEMS`·`sagaGear`·`equipItem`·`buyItem` |
| 흑화·인연 | 군주: `R.saga.fallen`·`fallenFor`·`fallenLines`. 장수: `R.saga.fallenHeroes`/`goneHeroes`·`placeFallenHeroes`·`fallenHeroDown`. 인연: `BONDS`·`bondsOpen`·`playBond`, 결말 문장 `endingEchoes` |
| 대화 | `vnPlay(lines,{title,choices,onChoice,onClose,right})`, 화자 ID: `o_*`, `ruler:<f>`, `fallen:<f>`(흑화 군주), `fallenh:<id>`(흑화 장수), `null`(서술) |
| 천하도 | `PROV0`, `buildRealmRaster`·`buildRoads`(역로·다리), `drawRealm`, `drawRealmFolk`(미니 캐릭터), `drawSagaMarks`(장 표지), `sagaPanel`, `rTop`, `realmCamera` |
| 전투 | `launchRealmBattle(item)`(saga 항목은 `launchChapter` 경유), `groups`·`loadout`, `reset`·`spawn`·`update`·`navStep`·`formation`, `attackDamage`·`hit(u,d,tag)`, `HELP`·`openHelp` |
| 사기·예고·배치 | `morale`·`shaken`·`routSquad`·`moraleTick`·`drawSquadFlags`(order `'rout'`), `tele`·`teleTick`·`resolveTele`·`drawTele`·`teleScale`, `startDeploy`·`deploying`·`deployZoneY`, AP 계획/실행 `startDeploy`·`resumeCombat`·`apEndRound` |
| 이야기 갈래 | `ROUTE`·`ROUTE_CFG`·`ROUTE_DATA`·`setRoute(r)`. 청명(`*_Q`)·현무(`*_X`) 데이터를 `SAGA`·`SAGA_ACTS`·`ACT_INTRO`·`BONDS`·`SEASON_MEMORIES`·`LETTERS`·`STORY_ENDINGS`에 바꿔 끼운다. 장 옵션 `survive`(버티기 초), `cede`(넘어가는 세력), `depart`(떠나는 장수), `boss`, 선택 결과의 `end`(즉시 결말) |
| 이야기 데이터 | `COMPANIONS`, `FACTION_CHARACTERS`, `RULERS`·`RULER_LORE`, `WORLD_RULES`, `SEASON_MEMORIES`, `LETTERS`, `STORY_ENDINGS`, `storyState` |

## 핵심 상태
- `state`: `'realm'`(천하도) → `'planning'`(AP 계획) ↔ `'playing'`(15초 동시 실행) / `'paused'` → `'ending'` → `'over'`
- 전장: `units`(`side` 0=아군 1=적, `commander`=장수 ID, `fallenHero`=흑화 장수), `groups`(청명 + 최대 5개 부대), `shots`, `fx`. `stats[type]=[체력,공격력,속도,사거리,간격]`, 피해 배율 `DMG`.
- 천하: 전역 `R`(`provs`, `story`, `saga`, `over`). `localStorage`의 `spiritwar-seal-qing-v2`(청명)·`spiritwar-seal-xuan-v2`(현무), 각각 `-manual`(수동)에 저장. `R.saga.route`가 갈래.

## 작업 원칙
- **단일 파일을 유지한다.** 파일 분리, 프레임워크, 번들러, npm 의존성을 넣지 않는다.
- 기존 압축 스타일(짧은 이름, 한 줄에 여러 문장)을 따른다. 고친 부분만 바꾸고 전체 재포맷은 하지 않는다.
- 줄이 매우 길다. 편집 전에 `grep -o`로 고칠 부분을 찾고, 문맥이 유일하게 맞는 짧은 문자열로 교체한다.
- **세로 모바일 화면에서도 확인한다**(터치 드래그·핀치, 800px 이하 레이아웃).
- **메뉴와 창은 스크롤 없이 한 화면에 들어가게 한다**(320~1440px, 세로·가로). 설명은 `HELP` 도움말로 뺀다.
- 천하 저장 구조(`R`)를 바꾸면 이전 저장본과의 호환성을 고려한다. `loadRealm`에서 기본값을 채우거나 `SAVE_KEY` 버전을 올린다.
- 게임 내 문구는 한국어로 쓴다.
- 기능을 추가하거나 바꾸면 `README.md`에도 반영한다.

## 확인 방법
빌드가 없다. `python3 -m http.server`로 띄워 브라우저에서 연다(Playwright·Chromium 사용 가능). 수정 후 최소한 콘솔 오류가 없는지 확인한다.

- 모든 전투는 `apOn()`이 참이다. 연습전 여부는 `battleCfg.campaign`/`beodeulTrial()`로 구별한다. 재시작은 `restartBattle`을 사용한다. `apMax(u)`로 부대 장수도 부대 AP 속도를 따른다.
- `BATTLE_LAYOUTS`의 `canyon`은 혼령곡·모래관. `CANYON_SECTIONS`로 길·절벽 그림과 충돌·행군로를 함께 만들며, `attackSight`는 협곡 절벽 뒤 일반 공격을 차단한다.

- 공통 턴 길이는 `AP_TURN=12`(2026-11-01, 이전 15). `attackRange`가 고지 궁병+20%를 계획/실전 모두 적용한다. `apStart` 예약 AP 차감과 `apStrike`의 자동 공격 차감을 중복하지 않는다. 빈 시간에는 잔여 AP로 제자리 자동 공격하며 주둔 중에는 공격하지 않는다.
- `supplySites`/`updateSupplySites`가 보급소 1개·부대 1개의 독점 배정, 안전/점령/군량 조건, 주둔 치료·손실 병사 복귀를 담당한다. 전사 장수·전멸 부대는 복귀 대상이 아니다. 전체 아군의 위치 무관 자동 치료는 제거했다.

## 왕인 전쟁 정본 · 2026-10-27
- 세계 규칙은2개: 죽은 왕의 마지막 명령 고정 / 왕인 파괴로 망자군 정지. 기억 제물/왕관 저주/군주 흑화 수집은 이전 설정이다. `사신기.md`가 현재 전체 대본이다.
- 본편16장·현무10장. 본편의 `pov`/`povTitle`8장면은 `startChapter`가 먼저 재생하고 `VN.o.leftActor`로 실제 군주의 초상·화자를 표시한다. 별도 백호/주작 플레이 캠페인은 아니다.
- 귀왕의 정체는 c9/x6에서 드러나는 유일한 반전. 그 전에 인물첩·POV·운학/묵철 대사로 미리 공개하지 않는다. 통일파는 공개 세력이다.
- c13의 연화/비연 선택은 `playChapterChoice`와 `R.saga.pendingChoice`로 저장/재개한다. 결말까지 `R.saga.choices.c13`을 유지한다. 혼인과 동맹은 분리한다.
- `sagaRitual`이라는 기존 함수명은 남았지만 실제 동작은 기억 희생 없는 막 전환/전선 회의다. 이전 저장 키는 삭제하지 않고 새 키로 분리한다. 옛 진행을 새 장 순서에 이식하지 않는다.
- 각 진영 군주+3명, 총20명. 국가 소속과 동맹 파견 편성은 별개. `ASSET_MANIFEST.json`/`ASSETS.md`가 초상/전장40개 경로를 정리한다. `rulerSprite`/`characterPortrait`/`characterSprite`와 일치해야 한다.
- `FACTION_ROSTERS`는 청룡·현무·백호·주작·귀왕/통일파 모두 포함한다. COMPANIONS 출신도 faction을 가지므로 그림 경로는 명시적인 portrait/sprite 필드를 쓴다.
- 회담의 `sceneCast` 필수 인물은 출진 편성 밖이어도 대화한다. 실제 전투 임시 보고는 기존대로 출진 장수만 한다. 인물첩은 진영 탭별4명씩 표시한다.

## 본진·시설 강화 · 2026-10-28
- `BASE_TECH`4병종×2갈래, `initFort`가 아군 본진에 성벽5구간과 미건설 시설4개를 만든다. 별도 타입 대신 `type:'keep'`+`structure:'wall'/'facility'`; `baseMain()`은 structure 없는 진짜 본진. 일반 `find(type==='keep')`는 본진이 먼저 삽입되므로 유지되지만 새 코드는 baseMain 권장.
- `buildBlock`에 살아 있는 성벽·시설 발자국 반영. 파괴/건설 때 재생성하고 기존 경로 무효화. `gap`은 구조물의 직사각형 가장자리 거리를 계산한다. 성벽 렌더링은 지면 좌표, 건물은 upright으로 그린다.
- `unitTech`는 살아 있는 완공 시설을 조회. 능력 원본을 누적 변경하지 않고 attackRange/attackDamage/hit/실제 이동/계획 이동 비용/발사 간격에 배율 적용한다. 부대 장수도 자기 병종 효과를 받음, 독립 hero 제외. 시설 파괴 즉시 해제되므로 재건 중복 강화/회복 악용 없음.
- `updateFort`는 실제 update 시간으로만15초 건설. `baseTab`→`baseSelect`로 한 단계씩 선택; 320세로/844가로에서도 스크롤 없이 들어간다. 금색★·카드/깃발 이름·효과 문구. 본진 HP0은 적장 격파/버티기 성공보다 먼저 패배 판정.
- 전투 시설은 realm 저장 스키마에 추가하지 않는다. 전투 재실행 시 초기화. 기존 군주 전사 패배/독점 주둔 회복 유지. 새 훈련 병사는 joinedRound로 합류 턴의 무료 행동을 막는다. 전멸 부대 재생산 금지, 훈련 중 전멸 시 군량 반환.
- 환경에 설치된 Playwright/Chromium을 이용한 회귀 검사: 정적 서버 실행 뒤 `node tests/fortress-smoke.cjs http://127.0.0.1:8782` 및 `node tests/fortress-combat.cjs http://127.0.0.1:8782`. 빌드/런타임 npm 의존성은 추가하지 않는다.

## 전 지역 도트 배경·전술 전장 · 2026-10-28
- `pixelBattlefield()`는 모든15지역에 참. `background`→`pixelRegionBackground`:600px 캔버스에서 `terrainAt`(물/절벽/습지/결빙), `battleRoads`, `HILLS`를 사용해 그린 뒤 bg에 nearest 확대. 사진풍 groundArt는 전장 배경에서 사용하지 않는다. 천하도는 기존 형식 유지.
- `PIXEL_THEMES`5진영 팔레트. `pixelScenery` 키에 theme 포함, 현무 설송/귀왕 고사목은 실루엣도 별도. `pixelHouse`의 기와/성벽/외곽 흙 색도 지역별. `drawPixelProp`은 뒤의 병사를 가리면 alpha.3, save/restore로 캐릭터 보간·불투명도 보존.
- `BATTLE_LAYOUTS`8패턴(2026-11-01 개정, 아래 숲·골짜기 항목 참고):forest(주작/남화/귀왕/망자),valley(현무/빙설/염산/서량),farmland(버들골),pass(흑수),marsh(동해),plain(백호),canyon(모래/혼령),bridges(청룡만). 초반3장 서로 다른 패턴. bridges는 중앙 다리1개+서쪽 여울, 우천 시 W/E 진군로 모두 중앙으로 돌아감.
- `LAYOUT_TACTICS`가 전술 안내와 고지 배열을 소유. `prepareBattlefield`가 HILLS를 갱신하고 날씨도 캐시 키에 포함한다. `battlefieldTactic(id)`를 편성 화면과 전투 도움말6번에서 사용. 계획 중 고지 표시.
- pass 중앙은 logical x1120..1280, 서쪽290..530. `attackSight`는 pass와canyon 절벽을 모두 차단. CANYON_SECTIONS의1460/1020 굴곡은 직선 통행/사격이 실제 막히는 폭이며 그림/충돌/진군로 모두 공유.
- `walkable`은 blockGrid뿐 아니라 실제 좌표의 water/cliff 여부도 확인해 경계 타일 틈 통과를 방지. 소품은 물/절벽 위 배치를 피한다. 적이 모든 전장에서 본진·보급소까지 실제 경로를 찾을 수 있어야 한다.
- `node tests/pixel-map.cjs http://127.0.0.1:8782`:15지역×4날씨의 길/보급소/고지/배치/경계 및 경로 구간, 초반3유형, 실제 엄폐/우회/절벽 시야/외다리, 진영별 그림 분리, 모바일3규격의 전장 안내 검사. 과거 버들골 아트 변경 전 해시는 사용자 요청으로 지형 자체가 바뀌어 의미 기반 검사로 교체.
- `node tests/terrain-ui.cjs http://127.0.0.1:8782`:동일 지역 맑음↔비 배경 캐시 복원,5진영 가림 alpha/보간 복원,초반3장과 동료12명 합류한 마지막 장의 편성 창3규격 무스크롤 확인. `.chapter-prep`에만 작은 편성 카드 스타일을 적용하고 다른 메뉴는 영향받지 않게 한다.

## 군주 호위대·병력 절반 · 2026-10-28
- `TROOP_SCALE=.5`, `scaledTroops(raw,type)`가 표식 개수 올림. 원본 loadout/SQUAD_BASE/recipes는 이전 기준이며 실제 생성 때만 줄인다. `spawnAt(...,actual=false)`가 기본 축소, 이미 축소한 훈련 큐/적 증원은 actual=true로 이중 축소 금지. bossRings는 makeUnit 직결이라 별도 scaledTroops 적용. hero/boss 본체는 축소하지 않는다.
- 아군 hero spawnAt은 방패 호위(raw24×레벨/병력 배율)를 생성하고 `attachRoyalGuard`로 ally-0에 연결. 적 bossRings의 첫 shield 고리는 enemy-lord에 연결. royalGuard/guardLord/guardOffset은 전투 임시 상태이며 realm 저장에 넣지 않는다. 일반 soldier와 구분되는 추가 부대나 hero 복제 아님.
- `apMax`가 아군/적군 royalGuard 모두8. 적 이동 AP도 apMax 사용. 군주도 부대 중앙/집결 처리 대상, enemy guard의 post는 군주 현재 위치를 따른다. 혼성 formation에 boss도 포함. 사기 붕괴 시 군주/호위가 함께 후퇴하며 전사 군주 조건은 그대로.
- `recipes`의 마지막6번째 항목g0=호위대. 앞의5개 인덱스는 기존 장수 편성과 호환 유지. recruitType(0)=shield, recruitSize는 이미 축소된 실수량. 큐/표시/인구 검사 전부 같은 실수량. 실제 전투 캠페인의 신병도 applySagaUnitLevel로 해당 장수 레벨/장비를 받아 초기 병사와 일치. 미편성 빈 부대는 생산 목록에서 숨긴다.
- POP_LIMIT75(기존150), 적 증원 기준48(기존96). isSoldier/troopCount/leaderCount로 표식10병사와 고유 장수 분리, 군주 카드의 장수13명 오류 방지. 혼성 HP 막대는 sumHP/sumMax. 호위도 주둔 부활 가능하지만 hero/boss/commander는 제외 유지.
- `node tests/royal-guards.cjs http://127.0.0.1:8782`:군주+12호위, 양측8AP/같은 명령으로 실제15초 이동, 주둔 복귀/호위2명분 훈련 표식/중복 축소·군주 복제 금지, 적 증원,26장 인원/호위/통행,군주 사망 패배, 적 호위 추종,3모바일규격 생산 창.

- 이동 템포: `MARCH_SPEED=1.6`, makeUnit의 speed에 한 번만 적용한다. 계획 apAdd와 실제 이동이 동일한 u.speed를 쓰므로 다른 위치에서 또 곱하지 않는다. 15초/AP/공격 간격/지형 배율은 유지. 기존 저장 전투 재시작 시 적용.

## 일러스트 서막 · 2026-10-30
- worldIntro→openPrologue: PROLOGUE3장, story/*.webp. 수동 이전/다음/건너뛰기, 키보드 화살표/Enter/Escape/Tab. rBusy는 재생 중만 잠그고 기존 상태로 복원. 완료/건너뛰기에서 story.intro 저장; 중단하면 이어하기에서 재생. 메뉴 재감상은 저장/장 진행을 바꾸지 않음. 기존 저장 키/스키마 유지. 귀왕 정체 스포일러 금지.
- node tests/prologue.cjs <정적서버URL>:4화면 규격3장 이미지/자막/무스크롤, 장면별 건너뛰기, 저장/재개/재감상 보존, 키보드, 양갈래 첫 장 확인.

## 양군 식별·계획 완료 확인 · 2026-10-30
- TEAM_COLORS가 아군청록/적군빨강을 소유. soldier 발밑/머리 표식은 원/마름모, drawSquadFootprints는 아군실선/적군점선, drawSquadFlags는 ●아군/◆적군 및 같은 색. 병종 색 대신 진영색으로 구분하되 병종 아이콘/이름·선택 금색 유지. 미니맵도 원/마름모. 기존 seen 필터 보존.
- apNext 마지막 명령/넘김 완료→apReadyOpen. ap.advance의 목적지 피드백 지연이 끝난 후 열린다. #apready에서 부대별 명령/AP 요약, 계속 계획/15초 실행. 닫아도 계획 보존, 다시 실행/Enter/E도 확인창. resumeCombat(true)는 확인창의 실행 버튼에서만 호출. apReady.owner/round로 낡은 확인 방지; reset/apReset/showRealm/choose에서 닫음. canCommand/apAdd는 확인 중 차단. 키보드 초점 순환/Escape/반복Enter 방지.
- tests/team-planning.cjs:실제 명령지연 후 자동확인,계획 보존/취소/넘김/수동 재확인/키보드,15초 후 다음계획,6부대3모바일창,실제렌더 라벨/색/형태/숨은적,재시작닫힘. 기존 royal-guards/fortress-smoke의 엔진 실행은 새 확인버튼을 눌러 진행한다.

## 부대 결속·측후방 강화 · 2026-10-30
- squadFrames(live)가 대장/군주+일반병 전부를 묶고 일반병 중심의 medoid/bodyX/Y, 대장에서90 이내의 공통 기준점, 인원수 기반160~300 radius, 공통 최저 유효속도(기본/시설/버프), stragglers를 계산. 적 목표도 같은 squad의 본대 중심을 사용. acquire의 사거리 밖 추격만 공동 목표/영역으로 제한하며 사거리 안 공격은 유지.
- update의 기존 대장 전용 cohesion을 전 부대원으로 확대. 대장은 본대 중심, 병사는 대장 곁의 기준점으로 복귀. move/retreat 목적지 진형은 유지하고 추격만 radius 안으로 제한. 앞선 병사의 pace 감속/대기와 뒤처진 병사의 복귀1.2배; AP/합류턴 차단은 그 뒤 그대로 적용. 대기 cue 표시. rout는 기존 도주 우선. 신병은 합류 턴 기다림 대상으로 잡지 않음. AP 소진한 대장을 두고 부대만 멀리 떠나지 않도록 기준점 제한.
- FLANK_SIDE=1.5/FLANK_BACK=2. attackAspect는 목표 dir 기준현재각도,keep/gate는front. attackDamage가 실제 피해에 적용하고 기존 shaken의 tag별 사기 증폭 유지. 기병은 기존 후방×6 총량을 유지하도록 충돌계수를 rear3(×후방2)/기타3.2로 정리,측면총4.8. 표시는 누적총량. 건물은 방향 보너스 없음. apTargetUI 각도 안내는 이동 후 바뀔 수 있는 현재값.
- tests/cohesion-flanks.cjs:실제15초 양갈래 추격에서 부대분열 회귀,3지형 실제이동/충돌,잔여AP0 복귀금지,양측 근접/화살/기병 방향피해·건물예외,실제 타격/사기/cue,3모바일 공격확인창. 기존 royal-guards/fortress-combat/team-planning 회귀도 실행.

## 임시 관리자 메뉴 · 2026-10-30
- index.html 끝의 ADMIN_TOOLS_BEGIN~ADMIN_TOOLS_END 블록 하나. enabled:true. init이 CSS/자체 dialog와 천하도 메뉴 항목·전투 header 항목을 동적으로 추가. 블록 전체 제거 또는 enabled:false로 비활성화; 외부 호출/저장 helper 변경 없음.
- open은 실행을 paused로 바꾸고 닫으면 이전 state/resumeState로 복귀. 계획중 목적지타이머/확인창은 닫고 계속 시 남은부대/완료확인으로 복귀. 키보드 focus/Escape/Tab 처리. VN/서막 중에는 열지 않음.
- jump는 현재 ROUTE의 선택판 직전 기본 fixture를 newRealm로 구성:이전장 cleared/act/season/소유권/joins/XP/gold/items/depart/choice,목표 join. 첫 점프 전에 SAVE_KEY+'-admin-backup'에 진행 백업(저장 실패하면 점프 중단). 여러번점프해도 원본백업 유지. manual 키 미변경. restore는 resumeRealmSave(backup,ROUTE) 후 백업 삭제. 전투복구는 기존 pendingBattle 시작부터. 다음판은 마지막에서 disabled. 인연 선택은 c13 이후에 반영.
- node tests/admin-menu.cjs <정적서버URL>:실제 UI 선택/다음/닫기/복구,26장 fixture와 launchChapter,자동백업/수동저장 보존,인연,전투 pause/restore,두갈래×3모바일 무스크롤,마지막/잘못된id,전체블록제거 부팅 검사.

## 캐릭터 피격 연출 · 2026-10-30
- hit→hitFeedback는 양의 최종피해/캐릭터에만 hitLife=.22/강도1~1.25. 화면안 보이는 피격만 requestHitStop:기본25ms/후방·돌격·도술·큰피해·전사55ms. 기존 강타 impactBurst도 같은 gate,최대65ms/재사용140ms,연장·누적 금지. resolveTele/resolveSpell의 무조건 stop 제거,도술은 hit에 spell tag 전달. 회복/구조물/0피해는 신규피격효과 없음.
- hitPose는 순수 렌더 x확대/y압축→작은반동→원복,처음80ms 흰 실루엣 overlay(brightness0 invert1). soldier와 drawFlyers에만 적용. 위치/충돌/사거리 불변, save/restore로 alpha/filter/scale 보존. 기존 반복각도떨림·상시밝기필터 대신 단일섬광. 죽는타격도 fly에 강도 전달.
- advancePhase는 실제dt로 tickHitFeedback→hitStop차감→남는dt만 시뮬레이션. AP/전투시간 함께 정지,남은프레임시간 버리지 않음. 계획전환 settleBattleVisuals가 stop/gate/캐릭터 hitLife를 초기화. 주둔부활도 hitLife0. rReduced에서는 stop0/변형15%/섬광20%. 전투임시상태라 저장스키마 변경 없음.
- node tests/hit-feedback.cjs <정적서버URL>:실제피해→정지/AP/부분dt,캔버스mask/변형/복원,매프레임연타제한,화면밖/미발견/0피해/구조물,화살의실제명중/도술/회복/전사,턴정리/동작줄이기. royal-guards/cohesion-flanks/team-planning 회귀도 실행.

## 이등신 대화 무대·대사 개정 · 2026-10-31
- VN_SCENES3종(palace/camp/frontier),story/dialogue-*.webp. SAGA_Q/X 각 c.scene.pre/post/pov를 startChapter/sagaBattleDone/playChapterChoice가 vnPlay(scene)로 넘김. 기본camp라 막 전환/인연도 무대 적용. 배경3장은 첫대화 때 preload.
- vnSprite는 o_hero의 현재갈래/명시적ruler/일반장수/이전fallen ID 모두 전장 스프라이트로 매핑. vnActor가 새파트너 src시에만 등장애니메이션,동일화자는 재등장하지 않음. leftActor군주시점 보존. CSS object-fit contain/마스크없음/발밑그림자/활성화자밝기/오른쪽거울방향. 인물 높이/발 위치 통일(아래2026-10-31 크기 수정 참고). reduced-motion은등장·화자변환정지. 인물첩/전투보고 초상은 변경없음.
- VN의 다음span은 실제button으로 변경;기존클릭/이전/스킵/선택보호·타자효과·콜백은 유지. 전235줄/선택을320·390세로/844가로에서 무스크롤검사. 전체대사개정은 사건/조건/합류/보상/갈래ID불변. c9/x6정체공개,청명3막제목은 검은갑주의목소리로 사전누설차단. ACT_INTRO도 시점/시간순서에 맞게 수정. 사신기.md는 전장별대사/무대/선택/인연/막서술 동기화.
- node tests/dialogue-stage.cjs <URL>:3그림/전체SD경로,26장/8POV/80·90초/선택ID/반전비누설/대본동기화,235줄×3화면,실제POV→pre무대/인물,이전/다음/건너뛰기/선택. 전체강제승리이야기흐름·두관계결말·선택재개는 /tmp/test-story-dialogue.cjs로도확인(난도실플레이와구분). 관리자메뉴 회귀도 실행.

## 대화 크기 통일·장수 배치 누락 수정 · 2026-10-31
- 대화 .vn-p는 width:auto/max-width:none,공통height와발위치,무대25%/75%중심. 종횡비 보존하며 넓은무기 때문에 body가줄지 않음. 모바일/가로 media 뒤에 uniform규칙 배치(이전규칙이덮어쓰지않도록). 화자강조는밝기/3px상승만,scale제거. 등장translate도-50%중심유지. heuristic wide클래스/로드처리 제거.
- assignFactionCommander는 실제적장 campaign.actor 예약/동료 제외를검색조건에서처리. ensureBattleCommanders는 reset과실제launchRealmBattle배치완료후실행:편성된아군 장수1명 보장,적장중복제거,미배정적장각1명. 같은병종 모두이미지휘관있으면기존무명병일부를별도squad로분리해배정(최소2표식있을때). 총 units수유지/장수복제없음/군주호위제외. 레벨적용은최종배정뒤. 사망/전멸/증원 중에는재배정하지않아장수부활없음.
- 전장 기본 크기는 아래 BATTLE_FIGURE 통일 기준을 사용. gold고리/높은진영배지,drawSquadFlags는비선택아군도실제장수이름. 실제HP/AP/충돌크기변경없음.
- tests/cast-deployment.cjs:20인물의실제object-fit표시높이+실루엣높이차6%이내/중심/화자교체불변을3모바일규격검사.26장양군고유배정/15장수실제이미지렌더/호연·사율별도부대/총인원미증가/이름·크기검사. dialogue-stage/royal-guards/cohesion-flanks/hit-feedback 회귀.

## 전장 크기 통일·상성 설계서 · 2026-10-31
- BATTLE_FIGURE={leader:2.4,soldier:1.3},isBattleLeader/battleFigureScale. 군주/적장/일반장수의 고유그림 모두 같은91.2기본높이,병사는병종·진영상관없이49.4기본높이. soldier/drawFlyers 공통. 진영발판/배지/체력막대는줄어든몸높이에정리. 데이터좌표/충돌/사거리/AP/피해/상성수치 변경 없음. 피격압축/공격/전사반동의일시적변형은유지.
- MATCHUPS.md의설계는아래상성반영항목으로적용완료. 기존창→기병/방패/측후방/시설유지. 방향판정의기존 .35/.3/.2차이,돌격이중중첩방지,예측UI/기존투사체판정시점/군주중립/예비대/지형/검증을명시. 설계숫자를이미적용했다고보고하지않는다.
- tests/battle-size.cjs 실제drawImage변환높이를37장수변형/8병사변형에서검사,전사공통크기확인. Canvas float오차1e-4허용. cast-deployment/hit-feedback회귀. /tmp/battle-rank-size.png 시각확인.

## 상성 시스템 적용 · 2026-10-31
- matchupInfo(u,t,pos=u)는무부작용공통판정:기병→궁병1.4/궁병→창병1.35/창→기병1.7(준비정면2.7),방패화살.55/진형.8/측면1.5후방2. 방향은attackAspect공통 .35/-.35 경계. braced는이동/기절아님까지확인. 군주/적장/구조물기본상성중립. 돌격은max(counter,collision),정면3.2측면4.8후방6총량;정면창진저지는.3분기(진형.8도적용).시설버프는별도기존배율.
- attackDamage는공통결과를사용하고기존돌격소모/반격/기절을처리. performAttack에서공통결과를한번확정해shots.match/source에보존.명중시숲/비/현재방어적용,사망대상도착은버림. recordMatchup은명중때만상성·방어·측후방·지형요약/횟수를ap.matchups에기록,apEndRound가lastMatchups로보존.새턴/전투초기화.상성counter태그는기존기본사기계수를사용(추가사기배율없음).
- matchupPreview는혼성쌍개별/발견한적만판정.유리/보통/주의이유표시.실제선택대상과이동/가속/방향변화로결과달라질수있음.HELP7상성추가,기존전투HELP3유지. apReport(page,g) 결과3부대/상세3이유씩.HELP로paused된planning에서도페이지/상세탐색허용;닫으면planning복귀.
- tests/matchups.cjs:96일반/18돌격,창진준비·이동·기절·측후방,방패경계/중립/무부작용예측,실제숲+비화살피해/발사스냅샷/명중기록,혼성/피격기록,시설파괴재건,3모바일예측/결과/도움말+실제버튼. 기존cohesion-flanks/royal-guards/fortress-combat/team-planning/hit-feedback회귀.

## 천하도 전체 시작·대화 초상 복원 · 2026-10-31
- rCamera.overview=true,resetRealmCamera를showRealm에서호출. 선택rsel이있어도overview상태는realmFocus all. 지도실제click이overview해제/지역closeup,빈곳은전체. zoomRealm0은전체/null은선택자동/양수는수동,manual설정전focus키동기화. 전체상태는fit배율즉시반영해진입/리사이즈때안잘림;지역줌은기존보간.진군경로focus는기존우선.저장스키마불변.
- .vn-face-l/r의초상+이름을기존이등신위에복원. vnFace가갈래o_hero/군주/장수/legacyfallen을talkPortrait로연결하고화자밝기·on프레임동기화.숨은인물초상도숨김. .vn-stage변수face-size/body-height로초상자리예약,동일높이원칙유지하며모바일가로몸크기함께축소.
- tests/map-portraits.cjs:3규격실제touch 전체→지역→전체/수동/자동/전투복귀,20초상·갈래/화자/위치/숨김. dialogue-stage는235대사·선택×3규격에서초상범위까지검사. cast-deployment도회귀. /tmp/portraits-over-cast-{320,844}.png시각검사.

## 큰 얼굴 우선·숲/들판 배경 · 2026-10-31
- 초상PC160/모바일112/가로104px. SD상한PC32dvh/250,모바일28dvh/34vw/200,가로140. body-height는남는공간에맞춰min/max,얼굴/대사우선.비화자초상brightness.82로밝게.235대사선택×3화면에서초상범위/SD최소24px/무스크롤확인(이전48pxSD기준은사용자요청으로완화).
- VN_SCENES에forest/field추가(총5). c1/c3/c6/c9/c13/x4/x5의해당pre/post에배정. story/dialogue-{forest,field}.webp. 사신기.md장면표시동기화.인물20명그림/선택/스토리규칙불변.
- terrain/ground-{forest,field}.webp신규. loadBattleGroundArt→battleGroundArt,load시tilecache초기화/현재bg재생성. paintBattleGround는128px캐시타일에진영색입히고실제bamboo/plain에만그림.32논리픽셀cell모서리도동일지형일때만적용해경계누출방지.기존길/강/절벽/고지/시설은후속레이어.좌표/충돌/버프/경로불변.
- tests/forest-field.cjs:4규격큰초상/2새장면,5진영textureon/off의숲·들판변화/물·절벽색불변/충돌·경로불변. pixel-map15지역×4날씨/terrain-ui/캐릭터배치/전체대화/지도초상 회귀. ASSETS.md에4이미지등록.

## 人情·상황을 쉽게 설명하는 서사 · 2026-10-31
- SAGA_Q16/SAGA_X10의 pre/post,8POV,ACT_INTRO_Q/X6,BONDS3,PROLOGUE3,STORY_ENDINGS3 개정. 장 시작에 장소/위기/상대/싸울 이유,뒤에는 결과와 다음 행동. 추상 비유 대신 치료·식사·편지·두려움·사과로 관계를 쌓는다.
- c2돌봄/c8친밀감과질투/c13선택/결말의거리로 연화·비연 감정 누적. c9/x6의 유일한 반전 유지,그 이전 정체 언급 없음. 연구/공사/구출 등은 기존처럼 이야기 설정이며 별도 전투 기믹 추가 아님.
- partyLines가 새 화자를 누락하지 않도록 c11/c12/c16/x7의 sceneCast만 보충. 전투·합류·보상·장 순서·선택 키/효과·저장 구조 불변. 사신기.md 전체 대본/서막/막전환/인연/결말 동기화.
- dialogue-stage322대사·선택×3모바일규격,prologue4규격 검증. 양갈래 전체 진행과두인연결말/중단선택재개/보상중복금지/15초AP,추가인연·막전환·결말화면/필수화자도 확인.

## 턴 종료 요약 띠 · 2026-10-31
- turnResultStart/Hit/Summary→ap.lastSummary→turnFlashShow. roundStats는 확인된 resumeCombat에서만 새로 만들고 apEndRound가 결과를 만든 뒤 비운다. pause/resume에서는 유지. hit의 생존/방어/버티기 보정 후 실제 HP감소를 집계하고 표식10명/장수를 분리한다. 건물 피해는 병력피해 합계에서 제외하고 본진은 전후 HP로 경고한다.
- #turnflash는#stage내 비모달 role=status, pointer-events:none. turnRibbon4.2초 좌진입/우퇴장,동작줄이기는turnFade. 별도 wall-clock hide timer, 새실행/reset/apReset/end/showRealm에서 정리. turn-end의중복toast는비움. 다음명령/카메라/시간/AP는 막지 않는다.
- tests/turn-ribbon.cjs와team-planning/matchups로 실제15초/입력/회복/경고/모바일/상성 회귀. 저장스키마 불변,그림 추가 없음.

## 전투 중 위기·큰 피해 알림 · 2026-10-31
- battleImpactHit는hit의실제HP감소(생존보정후),battleImpactTick은update에서.3실전초마다장수/아군부대상태를감시한다. 장수25%단타/40%단타/체력30%위기,부대는죽은병사포함총체력비35%위기. 장수50%/부대55%회복시재무장. 병사피해를장수피해로보고하지않음.
- battleImpacts의cool/armed는턴사이유지,reset/apReset/showRealm/end에서초기화. 기본전역2.8초/사건10초,우선순위상승은.65초후교체. 표시된적만알림,버티기전보스는무적하한으로인한위기표시제외.
- #battleimpact2초임팩트/초상/짧은gleam+combatCue,입력통과. 기존hitstop변경/추가없음. turnFlashShow가숨김,reduced-motion은fade+gleam없음. tests/battle-impact.cjs 및hit-feedback/turn-ribbon검증. 저장/전투수치불변.

## 픽셀 전투 효과(pixelfx) · 2026-10-31
- `PFX`(시트 메타: w/h/n/c/px/py/fps), `loadPfx`, `pfx(k,x,y,s,flip)`, `pfxHit(u,t,tag,big)`, `drawPfx`. fx의 `kind:'px'`는 기존 fx 루프 맨 앞에서 `drawPfx`로 따로 그리며(upright, 보간 끔) 수명은 기존 fx 수명 감소를 따른다. 일반 명중·전사는 동시 60개를 넘으면 생략.
- 연결 지점: performAttack 근접(hit/crit/blunt), 화살 명중(hit, 방패 막기 parry), attackDamage 창진 저지(parry), hit 전사(poof, 귀왕 진영 적은 poofgui)·성벽/시설 붕괴(slam), resolveSpell(bolt/heal), resolveTele 돌진(slam), 화살비는 예고 0.55초 전 volley. `impactBurst`는 불꽃 수 0이면 링을 그리지 않고 피격 정지·흔들림만 담당한다.
- 시트 재생성: pixelfx 저장소에서 `node tools/render.mjs <id> --sheet [--opts]` 뒤 빈 여백을 잘라 WebP 무손실로 묶는다. 긴 효과(poof·bolt·heal·slam·volley)는 2프레임마다 1장(15fps). bolt는 충전 21프레임을 건너뛰고 번개부터 재생한다. 런타임 의존성 없음, 라이선스는 `fx/LICENSE-pixelfx.txt`.

## 대형 고정·한글/진영색 UI · 2026-10-31
- (2026-11-02 개정: 아래 「병사 간격 축소」) UNIT_SPACING 보병100/112·기병118/128,unitSeparation 같은부대90/108·장수116,다른부대124~140,양군접전52(기병56/방패76공격유지). 충돌격자는144로유지.
- formation이장수의중앙목적지를기준으로가까운자리에각병사를배정하고squadSlot={leader,x,y}저장. squadFrames는살아있는지휘관,없으면기존대형기준병사→중앙병사를안정되게선택. squadSlotPoint는좁은길/다른부대를피해장수반경안통행가능자리로조정.
- SQUAD_LEASH foot320/horse360. squadStepAllowed는실제이동/지형축fallback/분리에모두적용. 이미밖이면거리감소만허용,도주제외. 앞선장수는부하대기,집결도기존AP/기절/합류턴제약후실행. 부대임시slot은저장하지않음.
- UNIT_ROLE은군주/방패병/궁병/기병/창병,전체UI한자문구를한글로치환. 머리위진영배지/부대이름표의아군적군접두어삭제. 지면원/영역실선/미니맵원으로모양통일,진영색청록/빨강과선택금색유지.
- formation-spacing,cohesion-flanks,team-planning,royal-guards,matchups,pixel-map,terrain-ui 검사. cohesion은실제5열간격으로구성하고후열까지적좌표에모으는검사를전열접전+평균진군+거리320/간격으로갱신.

## 선왕의 마지막 원정 설정 · 2026-10-31
- STORY.md 「선왕의 마지막 원정」이 정본: 선왕이 통일 원정 때 왕인에 먼저 맹세(청룡 관습)→사후 귀왕, 혼령곡에서 묵철에게 「청명을 데리고 돌아가라」, 빈 관·「병으로 붕어」 기록, 진군을 멈춘 청룡을 탈영으로 보아 청룡 마을부터 공격, 무진은 산 사람, 백륜은 원정 설계 참모.
- 대사 14줄 추가(c1·c4·c6 복선, c9·c10·c15 해설). 9판 전에는 「아버지」를 쓰지 않는다(dialogue-stage 검사). c6 sceneCast에 운학 추가. 운학·무진·백륜 bio/role 갱신. 대사 총 336줄.

## 장별 승리 조건 1단계 · 2026-10-31
- 장 데이터 `goal:{t,...}`: rout(n)·hold(at,turns,name)·holdAll·reach(dir,name)·destroy(name,at[]|gates,n,hp,alt)·mask(floor)·boss(turns)·final. `goalInit(c)`(launchChapter 끝), `goalTick(dt,boss)`(update 승패 판정 직전, 'win'/'time'), `goalBossWins()`(적장 격파로 끝나는 목표만 참), `goalText`, `drawGoal`, `#goalchip`(apUI가 갱신). `GOAL_SPOTS` center/west/east/gate는 nearestCell로 보정. 파괴 목표는 `type:'gate'`+`objective/label`(gdir 없음, 증원 판정에서 제외). 면갑은 `u.maskFloor`가 hit에서 체력 하한. 붕괴 집계는 routSquad. 거점 목표는 `goalGuard`가 가까운 적 수비 부대를 지점으로 옮긴다.
- 17장 적용(c2·c3·c5·c7·c9~c16·x2·x4·x6·x7·x10). 브리핑·사신기 「실제 승리 조건」·관련 대사를 목표에 맞춤. 저장 구조 불변. 호송(c6·c8·x9)은 2단계.

## 호송 수레 2단계 · 2026-10-31
- `type:'cart'`(stats.cart, g=-1, side0). 부대·사기·집계·충돌·근접 반동·allyUnits·isSoldier 목록에서 제외(['keep','gate','cart']). `cartStep`: 아군 320 안·적 130 밖일 때만 이동, 막히면 축 미끄러짐, 1.5초 정체 시 다음 통행 칸으로 이동, 도착하면 hp=0·arrived. `drawCart`(characters/props/cart-*.webp, 오른쪽 기준 좌우 반전, 체력·상태 표시). goal `escort{cart,name,from[],to,need}`: c6·c8·x9. 수레 상실은 loseReason 'cart'. 회복진은 수레도 치료한다.

## 통제 구역·기회 공격·우회 길찾기 · 2026-10-31
- `ZOC`(shield/horse 90, hero 120, spear/boss 130), `zocCheck(u,live,ox,oy)`를 update 이동 직후 호출. 지나치거나 멀어지는 이동만 대상(그 적을 focus/pending 중이거나 attack·engage·wave·hold로 다가가는 이동 제외). `u.zocT` 0.5초 동안 이동 속도 ×0.5(기존 dist<30 「교전 이탈」 감속을 대체), `v.oppCd` 2.5초마다 v.damage×공격 버프×상성(counter)×0.6의 기회 공격(hit tag 'side'). AP를 쓰지 않는다. 양 진영 공통.
- `squadStepAllowed`: 경로(u.path)를 따라가는 중이고 그 상대와의 직선이 본진 성벽·시설에 막혀 있을 때만(`wallBetween`, fortBlocked 표본) 반경 한도를 f.radius×1.8로 완화. 트인 곳의 추격은 기존 320/360 그대로(cohesion-flanks 검사). 성벽 안쪽에서 장수와 부하가 서로를 기다리며 막히던 교착을 해소. 경로 없는 직진은 기존 320/360 유지.

## 적의 수레 우선 공격 · 2026-10-31
- `squadFrames`: 적 부대는 살아 있는 수레를 (거리−400)으로 비교해 우리 부대보다 먼저 공동 목표로 고른다(target.unit=cart). `acquire`: 적의 수레 평가값 −300, hold가 아닌 적은 수레 탐색 반경을 700까지 확장. 처음 수레를 고를 때 「수레 습격」 cue와 전투당 한 번 경고(goalState.cartWarn). hold 수비대의 post 제한(520)은 그대로.

## 본진 UI 직관화 · 2026-10-31
- `#basebtn`(setupBattleHUD가 phasehud에 추가, .ready 깜박임), `#basealert`(계획 중 새로 고를 수 있게 된 신병·시설 알림, 첫 턴(ap.round 1)에는 띄우지 않음, 누르면 해당 탭). `baseReady()`는 고를 수 있는 키 목록('r'+부대, 'f'+병종), `baseSeen`은 이미 본 것(사라지면 다시 알림, resetSupplySites에서 초기화), `openBase(tab)`, `baseAlertUI()`(economyUI에서 호출).
- 지도 탭: commandAt 맨 앞에서 본진(130 안)·시설(70 안)을 누르면 openBase. 시설 목록은 `.facrow` 카드에 두 갈래 버튼을 바로 두는 `#basebuttons.facgrid`(세로 2열·가로 4열). 기존 `baseSelect` 상세 화면은 호환용으로 남김. 신병 버튼은 비활성 이유(.why)를 표시.
- 실현 이펙트: buildFacility 착공(pfx slam+라벨), updateFort 완공(pfx heal+해당 병종 금빛 ring), 신병 합류(pfx heal+ring+라벨), updatePoint 확보(pfx heal+라벨), 주둔 복귀(pfx heal). 보급소 표지 글씨 20/15px와 상태·할 일 문구. 320×568·390×844·844×390에서 본진 창 무스크롤.

## 운학 역할 강화 · 2026-10-31
- 운학 = 「병으로 붕어」를 쓴 사관의 제자. 대사 11줄 추가(c1·c6·c9·c10·c14·c16), c10·c14·c16 sceneCast에 o_un 추가, BONDS_Q에 `un`(「고치지 않는 기록」, after c12, 결말 문장 포함). bio 갱신. STORY.md·CHARACTERS.md·사신기.md 동기화.

## 운학 전투 특성 「사관의 기록」 · 2026-10-31
- `scribe()`(출진한 o_un 지휘관 생존), `warnLead()`에 +10, 적장 돌진·화살비 tele의 t/max에 `scribeT()`(+1초, 운학 cue). 증원 경보 say 접두어 「운학의 기록」. 쓰러지면 즉시 해제.

## 장수별 전투 특성 · 2026-10-31
- `HERO_TRAITS`(id→[이름,설명]) 12명. `heroAlive(id)`(출진 지휘관 생존), `ledBy(u,id)`(그 장수가 이끄는 부대원), `traitDefMul(u)`(hit: 묵철 군주 300 안 .7, 해린 수레 350 안 .6), `traitAtkMul(u,t,m)`(attackDamage 끝: 호연 돌격1.25, 설화 m.shield<1 상쇄, 은랑 gate1.6). 연백 shaken k×.5, 도겸 routSquad 적 rout +3, 사율 updatePoint 확보×2, 단심 군량+3/초(#economy 표시 동일), 비연 훈련×1.5, 홍염 zocCheck R×1.5. 운학은 기존 scribe.
- 편성 카드에 `.trait` 이름+title 툴팁, ≤380px에서 이름 숨김(320 c16 무스크롤). matchupPreview는 특성 배율을 표시하지 않는다. 저장 구조 불변. `tests/hero-traits.cjs`가 켜짐/꺼짐 수치 비교.

## 그림 방향·뒷걸음질 수정 · 2026-10-31
- `ART_LEFT`(heukcheol·mujin·gui-ruler·zhu-ruler)·`artFacesLeft(src)`. companionArt 이미지/`:dark` 캔버스에 `faceLeft`, soldier의 `ctx.scale`에 `artFlip(u)` 곱. 대화 `vnActor`가 `.lf`(왼쪽 원본) 토글, `#vn .vn-p.vn-l.lf`/`.vn-r.lf`로 거울 방향 반대. 천하도 `rSpr`가 `left` 저장, `rDrawSpr`가 flip과 XOR. 새 그림이 왼쪽을 보면 ART_LEFT에 추가.
- `u.vface`: update에서 이동 중이면 화면 x 이동량(dx−dy)의 감쇠 합 `u.vsx`(|합|>2.5)로, 멈춰 있으면 want(대상/지정 방향)로 즉시 정한다. soldier의 face는 vface 우선, 없으면 dir. `u.dir`(측후방 판정·turnToward 선회 속도)은 그대로. 전투 임시 상태라 저장 불변. `tests/facing.cjs`(실제 이동 뒷걸음질 프레임 147/3599→10/3599).

## AP 소진 자동 공격·잔병 정리 · 2026-10-31
- `apFree(u)`(ap<2): `apCanStrike`가 무행동/engage(아군)·적군에서 AP 부족이어도 사거리 안 공격 허용, `apStrike`는 AP 차감 없이 반환(아군 턴당 한 번 cue, freeCue는 apEndRound 초기화). 이동·후퇴·주둔 중 공격 금지, 자동 추격 없음은 유지. 공격 2 AP 규칙은 AP가 남아 있을 때만.
- `remnantTick`(update의 moraleTick 뒤, .5초): 적 squad의 처음 병사 수 `remn.start`, 지휘관 없고 n≥4·남은 병사≤max(1,⌊n×.2⌋)이면 hp0·fled·poof·「남은 병사 항복」, goalState.routed 추가. 전멸 squad도 routed. 적장/guardLord/gate 제외. reset에서 remn 초기화.
- goal hold: a>e×2면 prog += dt×.5. `tests/ap-stragglers.cjs`.

## 이동·기병·방패·12초 턴 · 2026-11-01
- 나무: buildBlock 나무 막힘 rr=r×.55+6(줄기), `treeGrid`, `treeNear(cx,cy)`로 나무 둘레 길찾기 칸 제외(cellOK). update 이동이 막히면 `steerAround`(±.5~1.7rad, 고른 쪽 1.2초 유지) 후 축 미끄러짐. squadStepAllowed: 경로 추종 중 d≤radius×1.8 완화 조건에 `!clearLine`(나무·바위 등 직선 막힘) 추가(u.still 조건은 열린 길 반경 초과를 만들어 제외). 장수의 뒤처진 병사 대기는 still<1.5인 병사만.
- 기병: matchupInfo `rush`(run 60~170, 정면1.6/측면2.4/후방3, 창진 정면 .3)·`stand`(run<60, `HORSE_STAND=.6`), tag는 돌격과 같은 'charge'. attackDamage가 rush의 run 소모/짧은 기절. performAttack 근접 명중 시 같은 squad 기병 전체 `backT=.75`, update(squad 처리 뒤)가 `horseCanChase`(아군 engage/charge+행동 AP, 적 ap>0)일 때 squad 중심에서 공동 목표 반대쪽 110으로 물러남. backT 중 공격 금지.
- `apCost(u)`: shield·royalGuard 1, 그 외 2(apCanStrike/apStrike/apFree/apUI). stats.shield 간격 1.8→1.35. `AP_TURN=12`, 시설 건설도 AP_TURN, UI 「15초」→「12초」. `tests/movement-cavalry.cjs`.

## 좌우 떨림 제거·전투 볼거리 · 2026-11-01
- `faceTo(u,f,dt,fast)`: vface는 반대 방향이 .45초(|vsx|>6이면 .12초) 지속될 때만 바뀐다. 정지 중 대상 방향 임계 .3. `u.vmT`(실제 이동 25px/s 이상이면 .3초)로 soldier의 걷기 bounce/회전/늘림을 결정(u.moving 대신). `u.rx/ry`는 update의 분리·walkable 보정 뒤 dt*14 저역통과, 차이 40 이상이면 즉시 맞춤. `RX(u)/RY(u)`를 soldier translate와 objs upright에 사용(planning에서는 실제 좌표). settleBattleVisuals가 rx/vmT 초기화. 판정·충돌·사거리는 u.x/y 그대로.
- impactBurst는 정지 요청이 있을 때만 화면 흔들림(.08초 이상 8, 그 외 4). 작은 타격 3 흔들림 제거.
- `dustTick`(update, 화면 안, 기병 질주 run>60 빈도14) → fx `dust`, 총 110개 상한, `drawGroundFx`가 drawPlans 뒤 지면층에 그리고 질주 기병(run≥90) 질주선. `slashFx`(performAttack 근접 명중) → fx `slash` upright 초승달. 화살 지면 그림자. 모두 Math.random(rand 시드 불변), rReduced에서 생략. `tests/visual-calm.cjs`.

## 숲·골짜기 위주 전장 · 2026-11-01
- 강·다리 반복이 단조롭다는 요청으로 `forest`(숲속 갈림길)·`valley`(깊은 골짜기) 추가. 15곳 중 11곳이 막힌 지형, 강은 청룡 1곳. `LAYOUT_MIRROR`(남화·망자·빙설·서량)가 지형 마스크·숲길 도로(`mirrorPts`)·앞 2개 고지 x를 좌우 반전.
- `layoutWallAt(layout,x,y)`(캐시 좌표): forest는 `FOREST_LANES`(중앙·서·동 숲길+연결로 2개, 폭 105~120+잡음)와 `FOREST_GLADES` 밖이 벽(1), 숲길 가장자리 44·빈터 테두리는 덤불(2→bamboo), 빈터 안쪽은 들판(3→plain), valley는 남북 능선2개(폭105±16, 서쪽 y1480~1610/동쪽 880~1010만 끊김)+중앙 바위, 양쪽 골짜기 대숲. `layoutWall`이 지역별 240×240 마스크를 캐시하고 terrainAt이 벽을 'cliff'로 돌려 충돌·사격(attackSight)·길찾기가 기존 절벽 규칙을 그대로 쓴다. 띠 밖(y<680 또는 >1800)은 기존과 같다.
- 그림: forest 벽은 어두운 수관 바탕+나무 덩어리, genProps가 벽 가장자리에 장식 나무(block:false)를 borderProps로 둔다. valley 능선은 바위 질감+돌무더기, 가장자리 장식 바위. 지형 설명은 숲이면 「울창한 숲 · 통행·사격 차단」. battleRoads는 지역별 roadCache.
- pixel-map이 8패턴, 숲 벽/숲길/사격 차단/경로, 반전, 골짜기 능선/중앙 들판/능선 사격 차단/끊긴 곳을 검사. 26장 적 배치·본진 경로 확인.

## 공격 중 '도망' 수정 · 2026-11-01
- 원인1: separateUnits가 같은 부대 부하와 장수를 같은 몫으로 밀어, 앞으로 가려는 호위병이 멈춰 싸우는 군주를 뒤로 밀고 부하 자리(장수 기준)가 따라 밀려 부대 전체가 미끄러졌다. `sepWeight(u,o)`: u가 멈춰 있고 사거리+20 안의 combatTarget과 싸우며 o가 움직이면 .3(같은 부대 장수면 .05), hold 정지 .35, 그 외 1. 행군 중 밀림은 기존과 같다.
- 원인2: 아군 사기 붕괴가 본진까지 1.3배 속도로 달아나고 상태 문구는 「접근·거리 조절 중」이었다. routSquad가 아군에 `m.fall`(가장 가까운 적 600 안이면 그 반대, 아니면 본진 방향 260)을 정하고 update rout가 그곳으로 간다. 재집결 시 그 턴 engage/charge/attack이 진행 중이면 prevOrder attack·prevFocus를 복원. squadActionStatus 「사기 붕괴 · 잠시 물러남 n초」. 적 붕괴는 기존(post/CITADEL).
- 남은 '멀어짐'은 숲·호수 우회 경로(path)라 정상. `tests/no-flee.cjs`. cohesion-flanks 적 추격 평균 x 기준 2800→2780(변경 전에도 2802로 경계값). movement-cavalry 나무 통과는 옮겨 둔 적장이 걸어와 교전하며 통계를 오염시켜 적장 speed/damage 0으로 고정(옛/새 규칙 모두 6/12).

## 선택 표시·계획 차례 화면 맞춤 · 2026-11-01
- `focusPoint(x,y)`: #phasehud 아래~#battlefooter 위(#apstrip 높이만큼 더 뺌) 보이는 영역 가운데에 둔다(apstrip 위치는 첫 프레임에 불안정해 높이만 쓴다). choose()와 startDeploy, launchRealmBattle/reset의 apOverview 뒤(배율은 overview 유지)에서 호출. `clampCam`은 지도 가장자리 너머 화면의 35%까지 허용(본진 근처 군주 부대 가운데 정렬).
- `selRing(x,y,rx,ry,rgb,q,fill)` 공통 고리, drawSquadFootprints의 선택 부대는 외곽선 pad46·어두운 테두리·금색 6w·흐르는 점선·selFlash 퍼짐(w=1/viewScale, 최소 .25). `targetMark`가 적 목표 부대 고리·병사 고리·도는 조준 괄호, apTargetDraw는 굵은 흐르는 점선+화살촉. fx marker는 col/big을 받아 두 겹 퍼짐+내려오는 화살표(apTargetOpen 빨강, 집결 초록).
- 신병 집결: commandAt rally가 walkable·y≥WH*.3이 아니면 nearestCell로 맞춤. `drawRally` 바닥 고리+upright 큰 깃발 「신병 집결지」, 선택 중 본진→집결 점선과 빠른 맥동. `modeBanner`가 rally/도술 위치 선택 안내 띠(좁은 화면 글꼴 축소·말줄임). `tests/select-focus.cjs`(4규격 차례마다 중앙 오차 0, 숲 지도에서 벽 클릭 스냅).

## 대사 감정·말투 개정 · 2026-11-01
- SAGA_Q/X 369줄 중 361줄(귀왕·흑철 고정 대사 8줄 제외)과 BONDS 22줄을 인물 말투(CHARACTERS.md 9절 「말버릇·감정 표현」)에 맞춰 다시 썼다. 화자·줄 수·장면·선택 키·목표 숫자(서른두 명·80초·90초)·반전 규칙(9판/x6 전 「아버지」 금지)은 그대로. 최장 65자, 3규격 무스크롤(dialogue-stage).
- 바꿀 때는 SAGA_Q/SAGA_X를 JSON으로 읽고 다시 써도 원문과 똑같이 나오는 것을 확인한 뒤 줄 단위로 교체했다. 사신기.md는 같은 문장으로 바꿨다. 짧은 옛 문장이 긴 문장 안에 들어 있으면 부분 치환 사고가 나니, 원고에서 옛 문장의 출현 횟수를 먼저 센다.

## 설정 정합성 수정 · 2026-11-01
- 연표: 선왕 사망 때 청명은 어렸고 섭정 십 년 동안 청룡은 국경 전쟁을 계속해 망자군(정체 모를 귀왕군)이 다른 나라만 쳤다. 올봄 청명이 전쟁을 멈추자 청룡이 탈영 깃발이 되어 c1부터 공격받는다. 서막 1장·c1 pre0/post10·c4 연백 문구 반영.
- 묵철은 c1 군적에서 짐작했지만 믿기 싫어 침묵(c6→c9 「아니길 바랐는데」→c10 「짐작했다」). 규칙1은 WORLD_RULES에서 「전해지지만 시험한 사람 없음」, 연구는 '덧새기기' 시도, c16 서술 「옛말은 사실이었다」. 귀왕 쪽 산 사람은 무진뿐(c14 pov 무진 대사). STORY.md 「선왕의 마지막 원정」·정합성 점검 표가 정본.

## sprite-gen 동작 시트 연결 · 2026-11-01
- `ANIM_READY`(이름 목록, 기본 빈 배열)만 `loadAnim`이 `characters/anim/<이름>/manifest.json`+`sprite_sheet_alpha`를 불러 `registerAnim`(animBox: idle 첫 프레임 알파 bbox의 중심·발·높이). 이름은 원본 전장 그림 파일명(`animName`). sprite-gen manifest는 `frame_layout.rows.<동작>[{x,y,w,h}]`·`animation.rows.<동작>.fps`.
- `drawCompanionArt`/`drawUnitArt`가 시트가 있으면 `drawAnim`으로 먼저 그린다(없으면 기존 그림). 상태는 soldier가 넣는 `animUnit`: attackAnim>0→attack(.68초 1회), vmT>0→walk/run, 그 밖 idle(time×fps 반복, u.phase 엇갈림). 몸 높이·발=기존 상자(38·y+h)라 BATTLE_FIGURE 91.2/49.4 유지. 적 세력색(TINT)·흑화('dark')는 `animSheet`가 캔버스로 캐시. 시트가 있는 유닛은 soldier의 bounce/회전/늘림을 끄고 공격 전진은 35%로 줄인다.
- `tests/sprite-anim.cjs`(가짜 시트로 프레임 선택·높이·발·색·폴백). 요청서·명령·request.json·대상 24개는 `ART_REQUESTS.md` 요청 2.

## 인간 드라마·묵철 전사 · 2026-11-02
- 묵철 c15 전사: c15 `depart:['o_muk']`+`departLabel:'전사'`(결과 화면 표시). c15 post를 무진 재기→묵철 「이번엔 내가 남는다」→무진과 함께 쓰러짐→백륜 돌입으로 다시 씀. c16 묵철 대사는 단심·운학으로, 서술은 빈자리로. c16 sceneCast에서 o_muk 제거·o_bi 추가, c14에 o_bi 추가. BONDS muk end·endingEchoes(c15 클리어 시)·STORY_ENDINGS_Q 두 결말에 묵철의 방패. 현무편 x10에 묵철 부재 2줄.
- 대사 줄 4번째 칸 `{c13:'yeonhwa'|'biyeon'}`이면 `partyLines`가 선택이 같을 때만 남긴다(c14 pre 4줄, c16 post 3줄). 대본에는 「(연화를 고른 경우)」 접두로 적는다.
- 갈등: c7 단심 반대 3줄(장부·빈 성벽), c10 단심 「그때 제가 말렸잖아요」·묵철 대사 교체, c10 post 묵철↔운학 공개 기록 충돌 4줄, c14 post 화해·죽음 예고 3줄, c8 post 홍염 마음 변화 3줄·비연 질투(국 한 그릇) 2줄, c13 pre 비연 속마음 2줄. `tests/story-death.cjs`.

## 병사 간격 축소·근접 참여 · 2026-11-02
- UNIT_SPACING 보병84/92·기병100/108, formation SP 84/100, unitSeparation 같은 부대 80(기병88·장수90), 다른 부대 104(장수·기병 116), 양군 52 유지. 장수 쪽 거리가 대형 간격보다 크게 남으면 장수 주위가 밀치며 멈춰(장수 94일 때 추격 정지 재현) 90으로 맞췄다. 조합별로 협곡 이동·양측 추격·근접 참여를 함께 재서 골랐다.
- update cohesion: `closing`(order attack·이동 중·대상이 장수 반경-40 안)이면 병사를 대형 자리로 되돌리지 않고 대상에게 직접 보낸다. 근접 참여 방패↔방패 6→9/12, 창→방패 11/11, 방패→창 7→9/12. squadStepAllowed 반경은 그대로.
- 검사: cohesion-flanks 최소 간격 80→70, 적 추격은 절대 x 대신 출발 평균 대비 +350, formation-spacing 기병 최소 90→78.

## 실행 중 자동 클로즈업 · 2026-11-02
- `cine`·`cineEvent(x,y,pri,label)`·`cineTick(dt)`(loop에서 wall dt)·`cineUser()`(canvas pointerdown/wheel/방향키). 첫 교전 `cineFirstClash`(performAttack 첫머리, squad 쌍 1회, 숨은 적 제외, pri2), 장수·적장·군주 전사(hit, pri3), 붕괴(routSquad, pri2), 적장 돌진 예고(teleTick, pri3), 성문·목표 파괴(gateDown, pri3). 확대 max(원배율×1.45,.9)·최대 1.5, 1.8초 유지 후 원배율 복귀, 쿨다운 3.2초(pri3 예외), 사용자 입력 3초 우선. playing에서만 발동, planning 등으로 바뀌면 즉시 원배율. rReduced는 보간 없이 바로. reset이 쌍 기록 초기화. `tests/auto-camera.cjs`.

## HD-2D 화면 효과 · 2026-11-04
- `HD`·`drawHD()`: draw()에서 objs 렌더 직후·drawSquadFlags 전에 화면 공간(setTransform 1)에서 처리. 전체 모드는 캔버스를 1/6 크기 `HD.cv`로 복사해 x³ 곱(`HD.bc`)을 screen .3(밝은 곳만 빛 번짐), 위 26%·아래 24%를 6띠로 흐린 복사본 겹치기(틸트시프트). 공통: `HD_GRADE[theme]` soft-light 색 보정, `hdLights()` 가산 광원(본진·확보 보급소·적 성문·적장·아군 군주·slam/bolt/heal/crit pfx), 빛 입자(rReduced 제외), 가장자리 어둠 .55. canvas filter 미사용(사파리 호환).
- `#hd2dbtn`(setupBattleHUD가 header의 퇴각 버튼 앞에 둠, 「효과 켬/끔」), localStorage `spiritwar-hd2d`. loop가 playing 중 평균 프레임 >1/28초가 3초 누적되면 `HD.lite=true`(화면 복사 없음). 천하도·village에서는 그리지 않음. 헤드리스 소프트웨어 렌더 기준 1280: 끔 32·전체 16·가볍게 28fps, 390: 60·44·57fps(GPU 기기는 더 가벼울 것). `tests/hd2d.cjs`.

## 병사 간격 추가 축소 · 2026-11-04
- UNIT_SPACING 보병66/74·기병82/90, formation SP 66/82, unitSeparation 같은 부대64(기병·장수72), 다른 부대86(장수·기병98), 양군52 유지. 근접 참여 방패↔방패9/12·창→방패11/11·방패→창10/12. 장수 쪽 거리는 대형 간격+6~8로 유지(더 크면 장수 주위가 밀려 추격 정지).
- 검사: cohesion-flanks 최소 간격56, 추격 표적을 간격 값과 무관한 고정 x(2950+i×84)에 두고, 협곡 반경 허용 321. formation-spacing 기병 최소64.
- acquire: 최선 목표가 닿지 않음(score≥2e4)·focus 없음일 때 같은 부대원이 사거리 안에서 싸우는 적(장수 반경 안) 중 가장 가까운 적으로 바꾼다(뒷줄 접전+앞쪽 수레/목표 사이 반경 교착 해소). squadFrames 새 대형 자리 상한 radius-32→radius×.7(288은 straggler .92·반경 320과 붙어 off<18 정지로 기어감). battle-goals 수레 검사의 아군 위치 −450→−650(접촉 시 가세가 정상).

## 장수급 도트 그림·뒷모습 준비 · 2026-11-04
- `characters/pixel/<원본파일명>.webp` 20장(군주5+장수15, 총61KB): `tools/pixelize.py`(알파 bbox crop→BOX 축소 논리높이64→median-cut40색→알파 이진화→1px 외곽선→×4 nearest, WebP 무손실). `PIXEL_LEADERS=true`·`pixelSrc(src)`는 loadCompanionArt와 rulerArt 로드에만 적용(대화 vnSprite·인물첩·천하도는 원본). ART_LEFT는 파일명으로 판정되어 그대로 동작.
- drawCompanionArt와 drawUnitArt의 hero/boss는 이전 imageSmoothingEnabled를 저장해 끈 뒤 복원. 그림 높이 h=38 그대로라 BATTLE_FIGURE 91.2 유지.
- 뒷모습(폴백, 아래 4방향 그림이 우선): `BACK_READY=[]`(이름=원본 파일명), `characters/pixel/back/<이름>.webp`를 backArt로 로드. update가 화면 y 이동량(dx+dy) 감쇠합 `u.vsy`로 `backTo`(반대 .45초/빠르면 .12초 유지)해 `u.vback`; 정지 중에는 want 각의 cos+sin. `backOf(src)`가 animUnit.vback일 때 뒷모습을 돌려준다. 흑화(:dark)는 뒷모습 미적용, 군주는 unitArt가 rulerArt 원본일 때만. 동작 시트(drawAnim)가 있으면 시트가 우선.
- 뒷모습 생성은 컨테이너에 그림 생성 계정이 없어 `tools/make-back-views.sh`(sprite-gen gen --direction back_diagonal --facing, 기병 body-plan, → pixelize)를 사용자 컴퓨터에서 실행. `tests/pixel-leaders.cjs`.

## 장수 4방향 그림 · 2026-11-04
- `DIR_READY={이름:'fl,br,bl'}`(이름=원본 전장 그림 파일명), `characters/pixel/dir/<이름>/<fr|fl|br|bl>.webp`를 `dirArt`로 로드(`loadDirArt`, 로드 때 `footAnchor`가 아래 15% 알파 x평균으로 발 위치 계산). `dirOf(src)`가 animUnit의 `vback`·`vface`로 키를 고르고, `drawDir`는 현재 변환 a<0이면 한 번 더 뒤집어 그림 방향 그대로 그린다. 원본이 보는 방향 키는 파일 없이 기존 그림(+기존 뒤집기)을 쓴다. 흑화(:dark)·동작 시트는 기존 우선순위. 옛 `BACK_READY`/backArt는 폴백으로 남김(지금 비어 있음).
- 2026-11-04 20명 전원 등록(57장은 Codex로 생성). 원본 도트 그림도 `footOf`(발 위치 캐시, 로드 전 .5)로 놓아 방향 전환 시 발 이동 ≤3px(이전 최대 28px, 무진). 생성 그림 높이 264로 통일·실루엣 높이 차 1% 이내. cast-deployment는 해당 장수의 방향 그림도 고유 그림으로 인정.
- 생성: Canva MCP(참고 그림 generate-image → 작업 디자인 3칸 → PNG 2108 내보내기) → `tools/canva-sheet.py`(자르기+`tools/unwhite.py` 흰 배경 제거+pixelize). `tests/dir-art.cjs`(모든 등록 그림 로드·청명 4방향 선택·뒤집기 상쇄), pixel-leaders는 dirArt를 비우고 옛 back 폴백을 검사.
- 병사 4방향(2026-11-04 준비): `SOLDIER_DIR_READY={병종:'fl,br,bl'}`, `characters/soldier-dir/<shield|bow|spear|horse>/<키>.webp`(SD 일러스트, 도트 아님, 높이 384). `soldierDirOf(type,side)`가 키를 고르고 적·비청룡 아군은 `tinted(im,TINT필터)` 캔버스 캐시. drawUnitArt는 등록된 병종만 방향 그림(뒤집기 상쇄, 발 기준)·원본도 발 기준, 미등록 병종은 기존 그대로. 넣기: `tools/soldier-dir.py`(흰 배경 제거·자르기·384 맞춤) → `tools/dir-ready.py`가 두 목록 갱신. `tests/soldier-dir.cjs`. 프롬프트는 ART_REQUESTS 요청 4. 2026-11-04 Codex로 12장 등록. 병사는 방패 아래·창끝·말다리 때문에 자동 발 위치가 틀어져(방패 fr .66, 기병 br .32) 눈으로 잰 두 발(기병은 말발굽 넷) 중심 `SOLDIER_FOOT[병종][키]`를 쓴다(원본 fr 포함, tinted 캔버스에 복사). 그림을 바꾸면 이 값도 다시 잰다.

## 이동 방향 = 그림 방향(문워크 제거) · 2026-11-04
- 원인: 그림 방향을 자기 걸음(update의 own step)으로만 정하고 .45초(빠르면 .12초) 늦게 바꿨다. 실제로는 hold 중인 병사가 옆 부대 밀림·대형 복귀로 20~50px/s씩 미끄러지는데 moving=false라 방향이 그대로였고(아군 궁병·장수 부대 100% 불일치), 옆으로 갈 때 앞뒤도 갱신되지 않았다.
- `facingFromMotion(live,dt)`: separateUnits·walkable 보정이 끝난 뒤(rx 저역통과 직전) 모든 유닛의 실제 위치 변화로 화면 속도 EMA(`mvx/mvy`, 속도 크기 EMA `msp`)를 내고, 속도≥`MOVE_FACE`14·일관성(합속도/속도크기)≥`MOVE_CONS`.7이면 성분이 `MOVE_AX`.25 이상인 축의 vface/vback을 즉시 바꾼다. 60px/s 미만에서 같은 축을 되돌리는 것은 `MOVE_LOCK`.35초 잠금(접전 밀치기 깜박임 방지). `knock`은 `kbT`.3초로 제외(맞아서 밀려남). 옛 moving 경로의 vsx/vsy faceTo/backTo는 제거(두 계산이 싸워 깜박임). 멈춘 유닛의 대상 바라보기는 실제 속도<14일 때만. settleBattleVisuals가 lfx/mvx/msp 초기화. 저장·판정·`u.dir`(측후방) 불변.
- 측정(c2·c6·c11·x3, 양군 13.6만 프레임): 좌우 불일치 10.0→0.4%, 앞뒤 4.9→0.2%, 최장 3초→0.5초, 0.3초 되돌림 .035→.074/유닛·분. `tests/walk-facing.cjs`(이전 코드에서 실패 확인).
- 2026-11-04 후속(접전 후퇴처럼 보임·둥둥 뜸): ① update cohesion에서 `engaged`(대상이 사거리+30 안)거나 `closing`에 「대상이 자기 사거리+120 안」을 추가해, 맞붙은 병사를 대형 자리로 끌어 적에게서 걸어 나가게 하던 것을 막음(아군 호위대 attack/own 이탈 173→22). ② 근접 병종(사거리≤120)은 지정 대상이 사거리 밖이면 사거리 안 적을 먼저 친다(target만 임시 교체, focus 유지). ③ `u.engT`(사거리+60 안·자기 걸음 없음·패주 아님)면 facingFromMotion이 밀림 대신 그 적을 본다. 접전 중 등짐 8.7→1.5%(엄격 기준 4.8→2.2%), walk-facing에 접전 검사(<4%) 추가. 패주(rout)·다른 지정 대상으로 걷기·기병 재돌격 물러남은 의도된 이동. ④ 걸음: 위상 `u.stp`를 실제 화면 이동 거리/(몸 배율×17, 기병 26)로 누적, soldier가 |sin| 도약·착지 찌부(y−7%/x+3.5%)·걸음마다 좌우 흔들림·이동 쪽 기울임(mvx/1600, ±.07). 밀릴 때도 vmT를 켜 발을 옮긴다. 진짜 다리 움직임은 걷기 프레임 그림이 필요(ANIM_READY 시트 경로 준비됨).
- 병사 걷기 프레임(2026-11-04 준비, 그림 대기): `SOLDIER_WALK_READY={병종:'fr,fl,br,bl'}`, `characters/soldier-walk/<병종>/<키>-1..4.webp`(네 장 공통 잘라내기 상자·높이 384). `walkFrameOf(type,side)`가 vmT>0일 때 `floor(u.stp*2)%4` 프레임(두 걸음 한 바퀴)·진영색 `tinted`, 네 장 공통 발 위치(`SOLDIER_WALK_FOOT` 우선, 없으면 네 장 footAnchor 평균). `hasWalk(u)`면 soldier의 코드 도약 1.2·흔들림 .01·찌부 없음(기울임 유지). drawUnitArt는 걷기 프레임>방향 그림>원본 순. 넣기 `tools/soldier-walk.py`(4칸 분할·칸별 흰 배경 제거 `UNWHITE_KEEP=1`·공통 상자) → `dir-ready.py`. `tests/soldier-walk.cjs`. 프롬프트는 ART_REQUESTS 요청 5.