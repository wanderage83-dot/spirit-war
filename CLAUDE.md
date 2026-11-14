# 청룡전기 / 사신전기 — 작업 안내

> **클로드 인수인계 시작점:** [CLAUDE_HANDOFF.md](CLAUDE_HANDOFF.md)를 먼저 읽는다. **맨 위 「0. 최신 인계 · 2026-11-05」가 가장 최근 상태다.** 2026-10-31의 현재 상태·규칙·검증·남은 실기 확인을 한 문서로 정리했다. 기준 게임 커밋은 `a1389f1`이다.
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
- **자동 병합(사용자 지시 2026-11-13):** 작업을 마치면 따로 묻지 않고 작업 브랜치에 커밋·푸시한 뒤 `main`에 fast-forward 병합하고 `main`도 푸시한다. 검사가 실패하면 병합하지 않고 알린다.

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
- `ART_LEFT`(현재 gui-ruler·zhu-ruler, 2026-11-07 무진·흑철은 오른쪽 원본으로 정정)·`artFacesLeft(src)`. companionArt 이미지/`:dark` 캔버스에 `faceLeft`, soldier의 `ctx.scale`에 `artFlip(u)` 곱. 대화 `vnActor`가 `.lf`(왼쪽 원본) 토글, `#vn .vn-p.vn-l.lf`/`.vn-r.lf`로 거울 방향 반대. 천하도 `rSpr`가 `left` 저장, `rDrawSpr`가 flip과 XOR. 새 그림이 왼쪽을 보면 ART_LEFT에 추가.
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
- 병사 걷기 프레임 64장 등록(Codex, 64a8cc8).
- 장수 걷기 프레임(2026-11-04, 그림 서비스 없이 코드로 생성): `tools/pixel-walk.py`가 장수 도트 그림(정면 원본+방향 3장)을 논리 64px로 되돌려 아래 24% 띠를 발 중심에서 좌우로 나눠 엉덩이 축 진자 흔들기(발끝 STRIDE 4px, 뒷발 LIFT 2px, 모든 픽셀을 원본에서 끌어와 구멍 없음) → `characters/pixel/walk/<이름>/<키>-1..4.webp` 320장(1.4MB). 2·4번은 원본과 같다(위아래는 코드 도약 3). `PIXEL_WALK_READY`(dir-ready가 갱신), `leaderWalk`·`leaderWalkOf(src)`·`leaderSrc(u)`·`artName`. drawCompanionArt/drawUnitArt(군주·적장 rulerArt)에서 걷기>방향>원본, 흑화 제외, 네 장 발 위치는 2번 프레임 footAnchor 공통. `tests/leader-walk.cjs`. 손으로 그린 프레임이 생기면 같은 경로에 덮어쓰면 된다.

## 희끄무레함·광원·걷는 박자 · 2026-11-05
- 원인: soldier의 `dim`(다른 부대 globalAlpha .62)이 계획 뿐 아니라 실행 중에도 켜져 있었다(실행 중에도 selected가 마지막 명령 부대로 남음). `dim=state==='planning'&&…`로 한정. HD는 상시 광원(본진·보급소·성문·적장·군주)·빛 입자·화면 전체 번짐(screen .3)을 제거하고 `hdImpact()`(hitStop 또는 slam/bolt/crit pfx 남은 수명)일 때만 번짐(.3×세기)과 pfx 광원. 틸트시프트는 위 12%·아래 10%·최대 .55로 축소. 색 보정·가장자리 어둠은 유지. `tests/no-wash.cjs`(이전 코드에서 실패).
- 걷는 박자: 걸음 길이를 병사13·장수19·기병20(장수 기병26)으로 줄여 보통 속도에서 프레임 7~8회/초(이전 병사 4.6). 걷기 프레임이 있는 병사 코드 도약 1.2→2.5, 장수 3→3.5. 장수 도트 걷기 STRIDE 4→5·LIFT 2→3으로 320장 재생성.
- 2026-11-05 후속(「발이 안 보이고 통통 튀기만」): 휴대폰 기본 배율에서 병사 키가 약 30px라 다리 프레임 차이(5~6px 발)가 안 보이고 도약만 보였다. 도약을 병사 1·기병 2.5로 거의 없애고, 걸음마다 좌우 기우뚱(회전 sin(phase)×.11, 기병 .05)과 착지 살짝 찌부(y−5%)로 걸음을 표현. `footfall(u)`가 stp 정수가 바뀔 때(디딜 때) 발밑 좌우 번갈아 작은 먼지(병사 .42·장수 .6·기병 .75, 수명 .32, 전체 110개 상한). 보병의 시간 기준 dustTick 먼지는 끔(기병 질주 먼지는 유지). soldier-walk 검사의 도약 비교를 「도약 ≤1.6」으로 바꿈.
## 무진 방향·좌우 떨림 · 2026-11-05
- 무진·흑철·주작 군주의 `characters/pixel/dir/<이름>/fr.webp`가 원본(왼쪽을 봄)과 거의 같아 좌우 전환이 안 보였다. 원본 좌우 반전으로 교체하고 `tools/pixel-walk.py`로 fr 걷기 프레임 재생성. 귀왕(gui-ruler) fr은 정상.
- facingFromMotion 접전(engT) 방향: 좌우·앞뒤 성분이 .35 이상일 때만, 반대로 되돌림은 `ENG_LOCK`.55초 뒤(대상이 바로 위아래일 때 초당 3번 뒤집히던 문제). 이동 방향 되돌림 잠금 `MOVE_LOCK`.35→.55, 빠른 이동(60px/s 이상)도 .4초. 걸음 기우뚱 병사 .11→걷기 프레임 있으면 .035/없으면 .07, 기병 .03. 0.5초 안 좌우 되돌림 c2 203→9, c6 42→8, x3 22→8. walk-facing 통과(접전 등짐 3.9% < 4).

## 길찾기: 아군 부대 우회·추격 · 2026-11-05
- 측정: 실제 교전에서 아군이 적에게 가려는데 거의 못 움직인 프레임 19.6%(c7 55%)의 97%가 separateUnits에 되밀림, 그 94%가 같은 부대 병사. 길찾기(findPath, 40px 격자 BFS)가 지형만 보고 유닛을 몰랐다.
- `crowdGrid(side)`(.4초마다): 같은 편 부대 중 장수가 hold/garrison·.5초 이상 정지·접전(engT)인 부대의 병사 둘레 58px 칸에 부대 번호(`crowdId`), 겹치면 −1. `crowdBlocked(g,me,x0,y0,x1,y1)` 직선 판정. `navStep`은 직선 지름길·경로 줄이기에서 이 칸을 막힘으로 보고, `findPath(...,cg,me)`가 자기 부대·목표 칸만 허용(경로 없으면 기존 findPath). `squadSlotPoint`는 다른 부대 칸이나 그 칸을 지나는 자리를 고르지 않는다(부하가 B 안쪽 자리로 1200px 돌아가며 장수가 기다리던 교착).
- `sepWeight`: 다른 부대끼리, 공격·이동·wave로 걷는 쪽과 한가한(멈춤·공격 대기 아님) 쪽이면 한가한 쪽 1·걷는 쪽 .15. 같은 부대에서 공격(attack) 명령으로 걷는(싸우는 중 아님) 장수는 .15(자기 병사가 비켜 줌, 부하에 둘러싸여 되밀리던 교착). move 명령에는 적용하지 않음(나무 통과 검사 8/12 실패). 부하의 대형 자리 복귀 문턱은 장수가 걸을 때 18→4.
- 결과: 막힘 19.6→6.9%(7판), c3·c7·x2 약 31→9%. 추격은 기존대로 focus 부대를 남은 AP로 쫓는다(같은 속도 방패병끼리 거리 거의 유지). 전투 계산 약 9% 증가. `tests/crowd-pathing.cjs`. no-flee/movement-cavalry/cohesion-flanks/zoc-pathing/formation-spacing/royal-guards/battle-goals/fortress-combat/walk-facing 통과.

## 행군 막힘: 자리 겹침 · 2026-11-05
- 측정(7판, 적에게 가려는데 거의 못 움직인 아군 프레임): 13.5%(c6 44%). 대부분 같은 부대 병사끼리 되밀림. 원인1: `squadFrames`가 위치×1.2를 반경 .7로 자르며 만든 자리가 서로 64 미만으로 겹쳐 두 병사가 한 자리를 두고 영원히 밀침. 원인2: `formation`의 자리 상한(반경−32=288)과 `squadSlotPoint` 고리 탐색(반경−12)이 straggler 선(반경×.92=294) 근처·바깥이라 자리에 선 병사가 계속 뒤처진 병사로 잡혀 장수가 기다림(pace 0).
- `spreadSlots(us,L,cap)`: 같은 부대 자리 쌍을 unitSeparation+6 이상으로 12회 이완, 장수 자리(0,0) 고정, cap 안. squadFrames 재계산(cap 반경×.7)과 formation(cap 반경×.85, 자리만 벌리고 이동 목적지 tx/ty는 그대로)에서 호출. formation 상한과 squadSlotPoint clear 반경을 반경×.85로.
- 방향: 자리가 넓어지자 c2에서 공격하러 다가가던 장수가 자기 병사에게 밀려 뒤로 미끄러지며 등을 보이는 장면이 늘었다(walk-facing 접전 등짐 6.8%). `facingFromMotion`이 engT가 없어도 attack/wave/engage로 사거리+60 안의 combatTarget에게 가려는데 실제 이동이 그 반대면(밀림) 대상을 본다(기병 backT·rout 제외). 3.7%.
- 결과 13.5→7.8%(c6 44→4%). 남은 막힘은 대부분 대상 250 안에서 앞줄 뒤에 줄 선 뒷줄(측면 감싸기 미구현). `tests/march-queue.cjs`. crowd-pathing/formation-spacing/cohesion-flanks/no-flee/movement-cavalry/zoc-pathing/royal-guards/battle-goals/fortress-combat/walk-facing/team-planning/matchups/ap-stragglers 회귀.

## 신병 합류 행군 · 2026-11-05
- 문제: 앞에 나간 부대에 본진 신병이 붙으면 다음 턴부터 신병이 「뒤처진 병사」(pace 0, 「대형 유지 · 뒤처진 병사 대기」)이고, 장수의 squadStepAllowed가 모든 부대원과의 거리를 묶어 장수가 신병에게서 멀어지는 이동도 막혔다(장수 이동 1px). 신병 자신도 성벽 우회 경로가 장수에게서 멀어지는 첫 걸음이라 반경 규칙에 막혀 본진에 갇혔다.
- `u.joining`(updateEconomy의 신병 생성 때 true, squadFrames에서 장수 반경×.85 안에 오면 false): stragglers·장수 반경 제한에서 제외, 신병 자신의 squadStepAllowed는 항상 허용, 부대 행동(move/engage 등)이 없어도 이동(합류 턴 joinedRound 정지는 그대로). 전투 임시 상태라 저장 불변. `tests/recruit-join.cjs`(이전 코드 실패 확인).

## 측면 감싸기 · 2026-11-05
- `wrapPoint(u,t,live,f)`(update의 cohesion·backT 사이): 장수가 아닌 근접(사거리≤120) 병사가 attack/wave로 대상에게 직진 중이고 대상이 사거리+260 안일 때, `wrapBlocked`(같은 편 중 멈춰 있거나 engT이거나 대상 사거리+40 안에 몰린 유닛이 직선 폭 unitSeparation−2 안에 있음)면 ① 사거리+180 안·장수 반경 안의 다른 적 중 직선이 트인 가장 가까운 적, ② 대상 둘레 앞쪽 ±100°(20° 간격, 반경 사거리×.75와 +60)의 빈 자리 중 직선이 트인 곳, ③ 아군이 적은 쪽으로 80 옆걸음. 선택은 `u.wrap`에 .5초 유지. 양 진영 공통. 전투 임시 상태.
- 측정: 7판 아군 「적 170 안·사거리 밖·제자리」 10.6→8.4%, 막힘 7.8→5.3%. 트인 들판 1부대 대 1부대 3턴 평균 참여(적 생존 중) c3/c5/c11 이전 6.7/7.1/6.8 → 6.0/7.7/7.3, 감싼 각도 173~186°→180~204°. 들판에서는 기존 분리 동작도 몇 턴이면 감싸므로 차이가 작다. 시도했다 버린 것: 적 부대를 둘러싼 호에 미리 고르게 세우기(감싼 각도 220~300°지만 참여 6.4로 낮음, 뒤로 돌아가느라 이동 AP 소진).
- `tests/flank-wrap.cjs`(c5·c11 들판 시나리오, 참여율 .6·각도 170 이상, 이전 코드도 통과하는 회귀 방지용). 18개 회귀 통과, walk-facing 접전 등짐 2.6%.

## 관문선·초반 4부대 · 2026-11-05
- 장 데이터 `pass:1`(공격전 c3·c5·c7·c9·c11·c12·c14·c15·c16·x6·x8·x10). launchChapter가 goalInit 전에 `passInit(c)`. `PASS_Y=2700` 선을 따라 `battleRoutes()` C/W/E가 그 선을 지나는 x에 관문(type 'gate'+`fence:'door'`, w220·h64, 정문 .7·샛문 .4 × stats.gate[0]×max(1,enemyF)), 선 위 walkable 칸(±40) 전부를 목책(`fence:'wall'`, ≤400 폭, 1.6배)으로 막는다. pass·canyon은 동쪽 길이 선을 안 지나 관문 2개.
- `fortBlocked`가 살아 있는 fence도 막힘으로 본다(양쪽 모두 막음), `gap`은 fence를 직사각형으로 잰다. 무너지면 `gateDown`→`passBreach`(그 길 tag 수비대의 반격 event, at+3초), `fortDown`이 buildBlock·경로 초기화. `drawFence`는 지면 좌표(성벽과 같은 방식) 나무 목책·관문, 관문 이름·내구 막대. commandAt은 fence 직사각형 안 탭을 적으로 인식.
- 수비대: tag center/west/east의 hold 병력을 각 관문 뒤로(창 PASS_Y−150, 활 −230, 그 외 −260 이후). 정해진 남하 event(tag 있는 것)는 지운다. 남서 배후 기습·귀문 증원은 그대로. `passText()`가 목표 띠에 「관문 n/m 돌파」. reset이 passState를 지운다. 전투 임시 상태라 저장 불변.
- 시험(c3·c5·c7·c11·c12): 정문을 전 부대로 2~7턴·손실 9~29명·반격 18~24명, 샛문을 1부대로 4~6턴. c11 서쪽 샛문은 1부대로 못 뚫음.
- c1·c2·x1·x2 `slots` 2→3(시작 동료 3명이 모두 출진, 아군 4부대). walk-facing 접전 등짐이 4.75%로 올라 `facingFromMotion`의 밀림 기준을 사거리+120으로, 감싸기(wrap) 이동 중에는 사거리+140 안 대상을 보게 함(2.9%).
- `PASS_LINES=false`면 관문선을 만들지 않는다(들판 이동 규칙 검사 crowd-pathing·march-queue·flank-wrap 전용). cohesion-flanks의 AP0 검사는 4번째 부대와 겹치지 않는 빈 자리를 고른다. `tests/gate-pass.cjs`(12장 봉쇄/돌파/수비대 위치/반격/목표 띠, 수비·호송 장 관문 없음, 초반 4부대).

## 적 증원 다양화·본진 수비·보급소 쟁탈·빠른 클로즈업 · 2026-11-05
- 증원(beodeul 연습전 외): 옛 RAIDS 4방향 순환 대신 `WAVES`(horse·siege·elite·rear·archer·supply)에서 `planWave(at)`가 가중치로 고른다(보급소를 쥐면 supply 3, 성벽이 서 있으면 siege 2.2). 방향은 그 gdir 귀문이 살아 있는 것만(`waveGateLive`), 없으면 null로 끊김. reset이 resetSupplySites 뒤 `nextWave=planWave(84)`, updateEvents가 at−30에 `waveEvent`를 events에 넣고 다음을 `at+max(34,60−waveN×4)(+20 군량소)`에 계획. 병력은 +⌊waveN/2⌋씩. supply는 남쪽 모서리에서 쥔 보급소로 가 `raidPost`에 hold. 기존 room 상한(96×적 배율) 그대로라 적이 많으면 작게 온다.
- launch: elite는 체력×1.3·공격×1.2, siege 플래그, 관문선이 안 뚫린 길(n→C·w→W·e→E)의 증원은 그 관문 뒤(PASS_Y−420)에 hold로 합류. drawSquadFlags 적 이름표 접두 「공성/정예/습격」.
- `raidText()`→#raidchip(goalchip 아래 66px, 없으면 42px). 「적 증원 n턴 뒤」, `waveKnown()`(beacon≥1 또는 scribe)일 때만 방향·종류. 1턴 이하면 .soon 강조, #stage.raid-on이면 #toast margin-top 24.
- 공성: attackDamage 끝에 siege×아군 keep 구조물 3배, acquire 평가 −400. 망루: initFort가 (1890,3990)·(2910,3990)에 `structure:'tower'`(64×64, hp0, 사거리400·피해22·간격1.5), `buildTower(i)` 군량 `TOWER_COST`120·AP_TURN 건설, update의 keep 공격 분기가 완공 망루도 쏨, drawFortPart 망루 그림, 탭하면 본진 창. `repairFort`/`fortRepairNeed`: 100+무너진 성벽당 60, 발자국 +6 안에 유닛이 없으면 40%로 재건 후 buildBlock. 본진 창 시설 탭에서 「본진으로 보기」 버튼을 빼고 망루 칸을 넣었다(320×568 무스크롤, 정보 줄 「시설 12초 뒤 완공」).
- 보급소: `sideIncome()` 서·동 확보 각 +4/초(updateEconomy·economyUI). 피탈 시 cine.
- 클로즈업: 확대 max(원배율×1.7,1.05)·최대1.6, 유지 2.2초, 쿨다운 2.6초, 다가갈 때 보간 7/초(돌아올 때 3.2). 새 사건: 증원 등장/반격(launch), 관문 합류, 아군 구조물 붕괴(fortDown), 본진 50·25%(hit), 보급소 피탈(updatePoint). `tests/waves-defense.cjs`.

## 현무편 부대 늘림 · 2026-11-06
- 현무편은 동료가 끝까지 3명(아군 4부대)이라 출진 칸 4~5가 비었다. 대사에 이미 나오는 동맹 장수를 장 뒤 합류로: x3 `joinAfter:['o_muk']`(청룡 원군), x5 `['o_hong','o_ha']`(주작), x8 `['o_eun']`(백호). x4·x5 slots 3→4. 결과 동료 3→4(x4)→6(x6)→7(x9), 아군 4→5→6부대(청명편과 같은 흐름). 대사·장 순서·목표 불변, 국가 소속과 동맹 파견 편성은 별개 원칙대로.
- `loadRealm`: route xuan 저장이면 SAGA_X의 cleared 장 joinAfter 중 roster에 없는 인물을 joinHero로 채운다(옛 저장 호환, 저장 키 불변).

## 강화·신병 연출 · 2026-11-06
- `powerFx(list,col,big)`: 대상마다 fx `pillar`(지면 빛 타원+upright 세로 그라데이션 기둥, lighter 합성, 1.6초, 장수 280/병사 220/건물 300 높이)와 `mote` 3개(오르는 별빛, 동작 줄이기면 생략), 한 번에 최대 40명. `powerBanner(title,sub,col)`: #stage 안 #powerup(가운데 28%, 큰 명조 글씨+진영 빛, 2.2초 powerPop, 동작 줄이기면 페이드, pointer-events 없음).
- 연결: updateFort 시설 완공(금 #ffd34d, 그 병종 전원+시설, 「★ ○○ 강화 완료」·병사 수·효과, cine pri2), 망루 완공(주황 #ffa94d), updateEconomy 신병 합류(청록 #5ff0d8, 「⚑ 신병 합류」), repairFort(주황, 살아 있는 성벽). settleBattleVisuals가 pillar·mote를 남겨 턴 끝 완공(12초 시점)에도 보인다. 판정·수치 불변.
- 2026-11-06 후속(「업데이트되면 카메라도 그쪽」): `cineFocus(x,y,label)`=cineEvent pri3(쿨다운 무시)+`cine.plan`(1.8초). cineTick이 planning에서 plan 지점으로 setCamera 보간(6/초, 확대 없음), 사용자 입력 1.5초 안·다른 state면 해제. 시설 완공·망루 완공·신병 합류·성곽 보수가 사용. 턴 끝(12초) 완공은 실행 중 확대가 바로 끝나고 choose가 카메라를 옮겨도 plan이 그 뒤 다시 비춘다. cineReset이 plan 삭제. waves-defense에 턴 끝 망루 완공 후 화면 중심 80 안 검사.

## 방패병 이동 속도 · 2026-11-06
- 사용자 요청 「방패병이 궁병보다 빠르게」: `stats.shield` 속도 44→50(궁병 45, 창병 52, 기병 100). MARCH_SPEED·지형·시설 배율은 그대로 곱해진다. 군주 부대는 호위가 방패병이라 부대 최저 속도도 함께 오른다.

## 창병 사거리 · 2026-11-06
- 사용자 요청 「창병은 공격범위가 길게」: `stats.spear` 사거리 228→300(방패병 76, 궁병 420). 장창병 시설 +30%면 390. attackRange≤120 근접 판정에는 원래부터 해당하지 않는다.

## 백호 강현 비극적 적대자 · 2026-11-06
- 사용자 요청 「사신국 군주 하나를 악역으로, 백호」+「죽음」. 강현은 옳다고 믿고 끝까지 간 적대자(순수 악당 아님). 흔들리는 장수는 호연.
- 대사: c5 pov 「한 번만 더」, c6 post 「멈출게. 왕인을 찾기 전까지는」(복선). c12 pov/pre/post 전면 개정(설계도를 백륜에게 넘김, 호연 첫 거부, 강현이 장치를 싣고 떠남). c14 pre 강현 2줄→사율·호연, c15 post 백륜과 강현 돌입+2줄, c16 pre 장치 폭발·강현 사망 9줄, c16 post 은랑 1줄. 현무편 x8 pre 2줄, x10 post 설화 1줄. sceneCast: c14 +o_sa,o_ho, c15 +o_ho, c16 +o_ho,o_eun.
- ACT_INTRO_Q 4막, RULER_LORE bai quote/relic, STORY_ENDINGS_Q 두 결말에 백호 한 문장. 반전 규칙(9판 전 「아버지」 금지)·장 순서·목표·합류·전투 데이터·저장 구조 불변. 강현은 전투 유닛이 아니다. 사신기.md·STORY.md·CHARACTERS.md 동기화.

## 천하도 휴대폰 잘림 · 2026-11-06
- 원인: 전체 보기 배율·중앙을 #rmap 전체로 계산해 가로 휴대폰(844×390)에서 #rpanel(장 안내)이 남쪽(주작성·남화·모래관)을 덮었다. `realmView(r)`: #rzoom 아래~#rpanel 위 영역과 #rpanel 오른쪽 영역 중 지도가 더 크게 들어가는 쪽을 고른다. realmCamera의 base·지역 확대 배율·중앙 정렬·이동 한계가 이 영역 기준. 입력(realmAt)은 rView 그대로. tests/map-portraits가 전체 지도가 이 영역 안·안내 상자와 겹치지 않음을 3규격에서 검사.

## 도술 뒤 자동 공격·전투 UI 편의 · 2026-11-06
- 원인: apCanStrike가 진행 중 행동이 dragon/heal/skill이면 그 시간(3 AP·2 AP) 내내 부대 공격을 막았다(apStrike가 apCommitted). `AP_CAST`·`apReserve(g)`(아직 시작 안 한 예약 행동 비용 합): 시전 구간에는 u.ap−예약 ≥ apCost이거나 apFree이면 제자리 자동 공격, apStrike는 무행동과 같이 AP 차감·apStrikeAt. engage 전용 apActionLeft는 engage일 때만 깎는다. `tests/spell-strike.cjs`(시전 구간 명중 6→14, 기술 0→6, 뒤 예약 이동 AP 보존, 가로 명령 판 ≤120px).
- UI(전투 화면 최대 유지): style 끝 「전투 UI 편의」 블록. body.battle-wide #toast 두 줄 줄바꿈, .battle-voice pointer-events:none·4.5초, #restart 붉은색, 가로(max-height:500px) commands-open에서 #orders 7열 한 줄·도술 26px·#compass 한 줄 5칸을 skills 오른쪽에(판 154→104px). 군주 카드 「군주·호위대」→「군주」.

## 넓은 전장(세 판 중 한 판) · 2026-11-06
- 사용자 요청 「같은 지역이면 같은 맵」(이미 지역별 지형·소품 시드가 같아 변경 없음, 날씨만 다름)·「세 판 중 한 판은 맵 두 배」. 장 데이터 `big:1`(c3·c6·c9·c12·c15·x3·x6·x9), `BIG_WS=1.4`(한 변 6720, 넓이 1.96배).
- `setWorldScale(ws)`(launchRealmBattle 첫머리, saga 장의 big으로 결정, 그 밖은 1): `WS`·`MAP_SCALE=2*WS`·`WW/WH`·`GW/GH/FW/FH`·`ISO_W/ISO_H`를 바꾸고 격자 배열(blockGrid·treeGrid·cellOK·prevBuf·qBuf)을 다시 만든다. 처음 호출 때 `WS_BASE`에 KEEP·CITADEL·GRANARY·SPIRIT·BEACON·REAR_SUPPLY·GOAL_SPOTS·RAIDS 원본을 저장하고 매번 원본×ws로 다시 계산(누적 없음). PASS_Y=2700×ws, GOAL_SPOTS.home은 KEEP 기준.
- 지형: terrainAt은 MAP_SCALE로 나눠 2400 논리 좌표를 보므로 자동으로 늘어난다. 배경(`background`)과 소품 생성(`genProps`)은 `withBaseMap`(MAP_SCALE=2·WW=4800·HILLS 원본)으로 원래 지도 기준으로 만든 뒤 bg는 drawImage로 늘리고 소품 위치만 ×WS(크기 그대로). HILLS는 ×WS. `battleRoutes()`는 `battleRoutesBase()`(원래 좌표, canyonRoute는 ×2 고정)를 ×WS. battleRoads/nearRoad는 원래 좌표(배경·소품 생성에서만 사용).
- 본진 기준(크기 고정): initFort 성벽·시설·망루, 본진 보급소(KEEP.y−380), 신병 집결지, 아군 부대 시작 위치(groups x·y를 KEEP 기준 오프셋으로), 본진 구역 표시. ×WS: 서·동 보급소, waveEvent 경로·보급소 습격 출발지, 연습전 후방 기습, 다리 지도 테두리. setZoom 하한 .25/WS.
- 병사 크기·속도·사거리·간격·통제 구역·장수 반경 불변. 저장 구조 불변(지도 배율은 전투 임시 상태). `tests/big-map.cjs`(8개 큰 판+일반 판: 배율, 배치 걸을 수 있음, 성벽 본진 기준 오프셋, 아군·적 거리, 관문 PASS_Y, 관문 뺀 적 진군로→본진 경로, 보급소, 실제 3턴, 일반 판으로 돌아오면 원래 값).
- 호송 수레(cartStep): 큰 협곡에서 직선 북쪽에 얇은 절벽 조각이 있어 c6 수레가 멈췄다. 막히면 축 미끄러짐 뒤 ±.5~1.5rad 옆걸음을 시도하고, 1.5초 정체 복구는 경로점 중 30~160 거리의 첫 점으로 옮긴다(바로 옆 점으로 옮겨 제자리에 머물던 문제). battle-goals 호송 검사 시간은 120초×WS².

## HD 도트 지형 시험 연결(요청 6) · 2026-11-07
- `terrain/hd/` 5파일(qing-ground·qing-road·qing-prop-bamboo-clump·qing-house·ally-wall, 크기·여백은 terrain/hd/README.md). `HD_ART_REGIONS=['beodeul']`·`hdOn()`(지역+theme qing)·`hdImg(k)`·`loadHdArt()`(부팅, 로드되면 HD 지역이면 background 재생성)·`hdTile(k)`(바닥 1024→256 nearest, 길은 x40~984 잘라 236×256, `-m`은 원본 크기 좌우 반전).
- pixelRegionBackground: HD면 캔버스 2400(한 점=월드 2, 기존 600)·바닥 패턴 채움·덤불/들판 칸 진영색 옅게(.32/.16)·15000 잡점/paintBattleGround/길 잡점 생략·길 안쪽 선을 길 패턴·성 안 마당 길 패턴·고지 안쪽/테두리 반투명. 나머지(물·절벽·논·다리)는 기존 그대로 위에 그린다. 성능 prepare 약 95→100~134ms.
- drawPixelProp: tree 종류는 대숲 시트 칸(p.v%4), 높이 r×5.4, 발 x=HD_BAMBOO_FOOT. pixelHouse: 폭 w×1.5, 발밑 y=744/768을 y+h×.13에. drawHdWall: 그림 바닥선 기울기 .34를 정등각 .707에 맞춰 전단(transform a=s, b=ty/span±.34s, d=s), 조각 수 round(|화면 x 길이|/280), 세로벽 원본·가로벽 반전. 바위·논·탑·관문은 기존 그림.
- 판정·충돌·경로·저장 불변. `tests/hd-terrain.cjs`(3규격: 버들골 HD·타일 크기·바닥 세밀도·그림별 drawImage 수·HD를 빼도 blockGrid/경로 동일·청룡성은 HD 아님). forest-field는 HD 지역을 빼고 청룡성으로 숲·들판 질감을 검사.
- 2026-11-07 2차(①~③): ally-wall 교체(기울기 .602, HD_WALL={u0:310,u1:716,mid:[512,393],slope:.602,piece:170,s:.42}), qing-road 전체 타일(자르기 없음), `ally-wall-corner` 추가: `hdWallCorners()`(살아 있는 세로 외벽 양 끝 4곳, x+y 최소 = 북서가 full)·`drawHdCorner(c)`(full은 전체 512×768, 그 밖은 x136~376 기둥만, 기준점 (256,690), 배율 .42), draw의 objs에 구조물 다음 y+1로 넣는다. hd-terrain: 그림 6장·길 256·벽 조각 8/9·모서리 4(전체 1).
- 2026-11-07 3차(④~⑦, 17장): HD_ART_FILES 23장. 바닥: bamboo 칸=qing-bush, plain 칸=qing-field, water 안쪽=qing-water(물가 테두리는 기존 돌, HD에서 흰 물보라 점 생략), marsh/ford=qing-marsh, 성 안 마당=qing-stone(`HP` 패턴 묶음). 소품 `hdPropArt(p)`: rock→boulder(r×3.4), block 나무 v%3===2→대숲(r×5.4) 그 외 willow(r×6), 테두리 장식(block:false) v%4===0→reeds(r×4.2); 칸별 발 x는 `HD_PROP_FOOT`(manifest bottom_envelope_center). 건물 `HD_HOUSE[kind]`(house/pixelHouse 7번째 인자): keep→ally-keep(폭 w×1.9, 발 992/1024), depot(군량·후방 보급)→supply-depot(1.6), fac-<병종>→ally-facility-*(1.7), 그 밖(적 거점)→qing-house. 망루: ally-tower 폭 110·발 992, 건설 중 .55. 관문선: `drawHdStrip(u,C)` 일반화(가로 fence는 `-m` 반전), `HD_PALISADE`(끝 x344~680·mid(512,375)·slope .679·piece 110), `HD_GATE`(184~840·mid(512,572)·slope .70·배율 .4 고정, 한 장). 버들골(c1)은 관문선이 없어 검사에서 passInit({pass:1})로 세운다. hd-terrain이 구조물 그리기 함수를 직접 불러 시설4·망루2·보급소·관문=문 수·목책 조각을 센다.
- 2026-11-07 4차(⑧~⑬, 6장, qing-third-manifest.json): HD_ART_FILES 29장. HP.paddy(논 구획 3곳, 테두리 그림자 유지)·HP.hill(고지 안쪽, 테두리는 반투명 유지)·HP.bank(물가: 북쪽 테두리 칸+물 아닌 곳에서 위 20·아래 28 안의 물 칸). drawCitadel: `<battleCfg.faction>-outpost`(지금 gui만) 폭 400·발 992/1024, 이름표만 남김. drawGate(gdir 귀문): gui-ghost-gate 폭 160·발 992, 은은한 깜박임 .85~1, 체력·이름 그림 위 18%. drawBeacon: beacon 폭 120·발 744, 점화 불꽃은 그림 위 12% 지점. 청룡성(bridges) 강가는 다리 레이아웃의 돌 둑 띠가 그 위에 그려져 물가 그림이 거의 안 보인다(그 띠도 HD로 바꿀 때 정리). hd-terrain: 그림 29장·적 거점·귀문·봉화대 그리기 확인.

## 귀왕 외 공통 HD 전장 · 2026-11-07 (최신 사용자 결정)
- 사용자 「귀왕 진영 빼고 나머진 통일」: 진영별 신규 그림 제작은 보류. HD_ART_REGIONS는 REGION_MAPS 중 theme!=='gui'인 12지역, hdOn은 그 목록만 확인. pixelColors/mapTheme의 전장 색도 청룡 공통(이름·경로 지명은 지역 그대로). 귀왕성·혼령곡·망자벌은 기존 잿빛 그림 유지. 적이 귀왕일 때 전용 거점·귀문 PNG는 공통 HD 지역에서 계속 쓴다. 지역별 전술 배치·날씨·충돌·길찾기·천하도·인물 불변.
- pixelRegionBackground의 bridges 돌 둑 띠는 HP.bank로 그려 qing-bank가 가려지던 문제 해결. 기존 다리/여울/홍수/결빙 판정은 그대로. tests/hd-common.cjs(12지역 공통·3귀왕 예외·15지역 그림 유무 충돌/경로 보존·물가 실제 그리기·3화면), hd-terrain의 청룡성 기대값은 HD true.

## 귀왕 망자군 병사 그림 · 2026-11-07
- `characters/soldier-gui/<병종>/fr.webp`(ART_REQUESTS 요청 7, 원본 PNG는 `raw/`). `GUI_SOLDIER_READY={병종:'fr'}`·`GUI_SOLDIER_FOOT`(눈으로 잰 발 중심)·`guiSoldier`·`guiSoldierOf(type,side)`: side 1이고 `tintFaction==='gui'`일 때만, drawUnitArt의 걷기/방향 분기보다 먼저 진영색 없이 그린다. 해당 방향 그림이 있으면 뒤집기를 상쇄(own), 없으면 fr을 기존 변환대로(왼쪽이면 뒤집힘). `hasWalk`는 망자군에 false(코드 걸음). 아군·다른 진영 적·장수·흑화는 불변. 방향·걷기 그림이 오면 READY 키와 발 위치를 더한다. `tests/gui-soldier.cjs`.

## 무진·흑철 옆걸음 방향 등록 정정 · 2026-11-07
- 사용자 제보로 20명 정지/걷기 자료와 일반 4병종 4방향을 비교했다. mujin·heukcheol 원본은 앞-오른쪽인데 ART_LEFT에 들어 있었고, 원본을 fl에/그 반대 그림을 fr에 등록한 것이 원인이었다. DIR_READY 두 항목을 fl,br,bl로 바꾸고 기존 dir/<이름>/fr.webp는 픽셀 변경 없이 fl.webp로 이동했다. 앞-오른쪽은 기존 characters/pixel/<이름>.webp를 쓴다. 두 인물의 walk fr/fl 각 4프레임도 파일 내용을 서로 재배정했다. 재그리기·추가 좌우 반전·발 위치 이동은 하지 않았다.
- ART_LEFT는 gui-ruler|zhu-ruler만 남긴다. 원본을 쓰는 대화/천하도/흑화 장수에도 올바른 방향 메타데이터가 적용된다. tools/pixel-walk.py·make-dir-views.sh·make-back-views.sh의 왼쪽 원본 목록도 함께 정정해 재생성 시 되돌아가지 않게 했다.
- tests/leader-facing.cjs 추가: 무진/흑철의 네 실제 이동 벡터→그리는 정지/걷기 파일과 양의 변환, 원본과 fr 중립 프레임의 픽셀 일치, fl 정지/중립 프레임 일치. 이전 테스트는 vface/vback 플래그나 파일명만 검사해 잘못된 그림 방향 분류를 놓쳤다. tests/facing.cjs는 왼쪽 원본 예시를 ruler:gui로 바꾸고 흑철은 오른쪽으로 기대한다. 기존 걷기/4방향/실제 이동 검사도 수행한다.

- 작업 중 Claude의 47119ba가 올라와 받아 합쳤다. 그 기본 망자군 연결·fr WebP 4장은 보존했고, fr 한 장을 뒷방향에도 쓰는 현상을 해결하려고 2단계 fl/br/bl 12장을 생성·연결했다. GUI_SOLDIER_READY 각 병종 fr,fl,br,bl; GUI_SOLDIER_FOOT 방향별 값은 characters/soldier-gui/README.md에 있다. 걷기 시트는 미제작, hasWalk false/코드 걸음 유지. guiSoldierOf의 own 분기로 방향별 그림의 반전 상쇄. tests/gui-soldier.cjs를 16로드/네 방향 전용 파일/모두 양의 변환 기준으로 갱신했다. 옆걸음 수정과 새 그림을 함께 커밋하며 47119ba 위에 쌓는다.

## 사신전기 연대기(청명·서진 번갈아) · 2026-11-07
- 사용자 요청 「창세기전처럼 번갈아, 시작 시 고르기 없음, 맞붙는 곳은 편 선택」(사용자가 「무진」이라 쓴 것은 현무편 주인공 서진으로 해석). `CHRONICLE`(25항목, `['c3','x2']`가 충돌)·`CLASH`·`CHRON`(기본 true)·`CHRON_KEY='spiritwar-chronicle-v1'`. 순서는 각 장의 f 난도(시간순)를 따른다: c1 x1 c2 [c3|x2] c4 x3 c5 c6 x4 c7 x5 c8 c9 x6 c10 x7 c11 c12 x8 c13 x9 c14 c15 x10 c16.
- 상태: 활성 갈래의 R에 다른 갈래 R을 `R.twin`으로 품고 둘 다 `chron:true`. 저장 하나에 둘 다 들어간다. `newChronicle(r)`(twin의 서막 intro=true), `chronSwap()`(저장→R 교환→setRoute→편성 복원→showRealm), `chronNext()`(첫 미완료 항목), `chronStep()`(sagaAfterChapter 래퍼: 다음이 다른 갈래면 교환+「시점 전환」 카드→`sagaAfterChapter0`(옛 본문, 막 전환 포함), 충돌이면 `chronClash`), `chronPick(id)`, `chronProxy(id)`(이긴 충돌 장의 상대 장을 twin에서 완료·경험치·금 지급, 지역 소유는 바꾸지 않음). sagaBattleDone의 `final`은 연대기가 남아 있으면 무시(x10). resumeRealmSave가 불러온 뒤 충돌·갈래 전환을 이어 준다.
- setRoute의 SAVE_KEY는 CHRON이면 연대기 키. 옛 이야기별 키는 지우지 않고 메뉴 「예전 저장」으로 그 갈래만 이어하기(CHRON=false). 관리자 메뉴 점프는 기존처럼 단일 갈래 fixture(twin 없음)다. `tests/chronicle.cjs`(25단계 순서·두 편 선택·대리 완료·현무 최종장 비종료·저장/재개·3화면).

## 1장 적장 격파 즉시 승리 · 2026-11-07
- 사용자 제보 「청명 1스테이지 적 지휘관을 잡아도 판이 안 끝난다」: 버들골(beodeulTrial)에서 후방 보급소가 끊긴 채(rearSupplyCut) 적장을 쓰러뜨리면 「후방 보급소를 되찾아야 승리합니다」 문구만 띄우고 계속했다. 이 조건을 빼고 적장 격파(goalBossWins)면 바로 end(true). 후방 보급소 차단의 수입·증원 정지는 그대로. `supplyVictoryWarn` 변수는 남지만 쓰이지 않는다.

## 판의 틀·전투 중 사건 · 2026-11-07
- 사용자 「매번 같은 패턴」→ 제안 A(판의 틀)·B(전투 중 사건) 선택. 장 데이터 `form`: siege(c4·x3·x5)·field(c7·x8)·raid(c11·x7, slots 3). `ev:[[턴,종류,방향]]`: rear·flank·elite·aid 16장(c2·c5·c6·c8·c9·c10·c12·c13·c14·c15·c16·x2·x4·x6·x9·x10).
- launchChapter 끝 `formInit(c)`(goalInit 뒤). field/raid는 passInit에 빈 객체(관문선 없음). `FORM_INFO`·`SCRIPT_EV`·`formState{alarm,aid,woke}`. siege: 망루 hp=max, 1턴 w·e 기병·2턴 n 공성·3턴 s 배후 events(script:'포위'), updateEvents 다음 증원 간격 34초 고정. field: `formMove`로 아군 중심 WH×.6·적(boss 제외) WH×.4(세로 .45배 압축), boss는 그 앞 −420, 적 일반병 tag 'field'→ AP_TURN+1에 tag 행진 event(route 가운데→본진). raid: 적 전원 `u.sleep`, 태그 행진 event 삭제·nextWave=null, updateEvents는 경보 전 증원 계획 안 함(경보 뒤 time+60). acquire는 sleep이면 null, zocCheck는 sleep 적 무시, hit이 `formWake(squad,true)`, attackDamage 끝 ×2.5(t.sleep). `formTick`(update의 goalTick 앞, .25초): 아군 380 안·sleepWake 도래·경보 후 2턴이면 깨움, 첫 깨어남이 경보(배너·cineFocus·1100 안 2초 뒤 깨움). `drawNight`(drawHD 뒤 multiply+가장자리 어둠).
- ev: 파도 종류는 `waveEvent({k,dir,at:턴×AP_TURN−1})`+`script/sub`로 events에 넣고, launch가 script면 powerBanner+cineFocus. 기존 경보(warnLead)가 한 턴 전 알린다. script 사건은 적 병력 상한(room)을 최소 14 허용. aid는 `aidArrive()`: 살아 있는 g≥1 부대 중 남은 비율 낮은 2개에 recruitType 8(기병 6)명(spawnAt actual, applySagaUnitLevel, joining·joinedRound), 아군 체력 +20%·아군 부대 사기 +20, 배너.
- `restartBattle`은 saga 장이면 `launchChapter`로 다시 차린다(이전에는 launchRealmBattle만 불러 목표·관문선·틀이 빠졌다). openChapter 브리핑 줄에 틀 이름·「⚠ 전투 중 사건」. 저장 구조 불변(전투 임시 상태). `tests/battle-forms.cjs`.

## 시작 승리 조건 알림·전장 선명도 · 2026-11-07
- `goalHeadline(c)`(goal 종류별 짧은 문구, goal 없으면 버티기/적장 격파)·`goalBanner(c)`: formInit 끝에서 250ms 뒤 powerBanner에 `.goalb`(어두운 판·줄바꿈 keep-all·세로 34%, 가로 휴대폰 52%·작은 글씨). 2.3초 뒤 사라지고 판의 틀 설명 배너는 2.7초에 이어서. powerBanner는 `goalb`를 지운다.
- 선명도: `measure`의 dpr을 min(3, devicePixelRatio, √(4.2e6/CSS면적))로(이전 상한 2라 3배 휴대폰에서 1.5배 늘어나 흐렸다). drawHD의 틸트시프트 띠 제거, 색 보정 알파×.45, 가장자리 어둠 .55→.26. 계획 중 비선택 아군 dim .62→.85.

## 클로즈업 슬로우모션·본진 피습 경보 · 2026-11-07
- cineEvent: 유지 `CINE_HOLD`3.2초(이전 2.2), 쿨다운 4.2초(pri<3), 모든 사건 사이 최소 1.8초(`cine.last`, 겹치면 무시). 받아들인 사건마다 `slowmo`(pri3 .85초, 그 외 .55초, rReduced 제외)를 켜고 loop가 advancePhase에 dt×.35(마지막 .25초에 1로 복귀)를 넘긴다. 테스트의 advancePhase 직접 호출은 영향 없음. cineReset/cineUser가 slowmo를 끈다.
- 새 클로즈업: battleImpactEmit priority≥3(아군 장수·부대 위기·전멸), launch의 첫 진격/증원은 pri3·라벨 「적 진격」(관문선 없을 때)·script 이름. `B0.first`(reset이 초기화).
- `baseAlarm{t,warn,cine,at}`: hit이 아군 keep(본진·성벽·시설·망루)에 맞으면 기록. `baseAlarmTick`(update, formTick 뒤): 3초 안 피격이면 `#basewarn`(붉은 깜박 띠, 누르면 `baseAlarmGo` 본진으로) 표시, 실행 중 8초마다 say·combatCue·단심 음성, 20초마다 cineEvent. reset/showRealm이 숨김. `tests/cine-alarm.cjs`, auto-camera는 3.2초 유지·최소 간격에 맞춤.

## 계략·원형 명령 메뉴 · 2026-11-08
- `STRATS`(fire 군량150·3AP·숲 / water 90·남은 AP 전부(≥3)·숲·물가·다음 턴 / lure 40·2AP·적 부대)·`HERO_STRATS`(장수별, `heroStrats(id)`: o_hero는 청명 lure·서진 water+lure)·`groupLeaderId(g)`. 자원은 군량 `gold`. AP_NAMES·apAdd 비용에 추가, apUndo가 `a.food` 환불, apStart가 `stratStart`. commandAt은 `STRATS[mode]`면 `stratTarget`(lure는 1000 안 적, fire/water는 1600 안·`stratWhere`(forestNear: 나무 forestProps/borderProps 수×.07+bamboo·forest cliff 비율, 물 비율)).
- 화공: `fires[]`{r210,life15,wind(rand),tick .5,spread 2.2}; .5초마다 반경 안 양군(구조물 제외) max×7%(장수 2.5%) hit 'fire'; 바람 ±.55rad 190 앞에 자식 불(숲이면, 아니면 35%), gen<4·총 14개 상한, 물에 막힘. 수공: `floods[]`{at=다음 턴 시작+1초}: 반경 340 양군 max×24%(장수 10%)·기절 .9·흐름 방향 150 밀림·불 끔·6초 감속. 유인: 성공 확률 .6(+.05 군주, +.1 계략 1개 장수) → 적 squad order attack·focus 우리 장수·post 해제·`lureUntil`(1턴, 출발 900 넘으면 복귀)·`vul`(2턴); 실패 → 우리 부대 vul 2턴·적에게 돌진. hit이 `u.vul>time`이면 ×1.4. `stratTick`(update, formTick 뒤), `drawStratGround`(drawGroundFx 뒤)·`drawStratFlames`(objs 뒤 upright 불꽃·연기). reset이 fires/floods 초기화.
- 원형 메뉴 `#ring`(stage 안, `openRing(g,sub)`·`ringItems`·`ringTick`(loop가 매 프레임 부대 화면 위치 따라감, planning·선택·apReady/advance 아니면 닫음)·`closeRing`). choose(i)가 계획 중이면 다음 틱에 연다(apNext 자동 넘김 포함). commandAt 첫머리에서 닫는다(땅 누르기 그대로 동작). `toggleBattleTray`는 계획 중 부대 선택이면 고리를 토글(전군일 때만 옛 판). 항목: 공격·이동·진형·돌격(기병)·필살기(HERO_SKILLS 있을 때, 재사용 대기 표시)·계략(가진 것)·도술(g0만)·방향(하위)·주둔·후퇴·넘기기. 쓸 수 없는 것은 숨기고, 가진 것 중 군량·AP 부족은 흐리게+이유. 옛 판의 청룡강림·회복진은 selected>0이면 숨김. `tests/strats-ring.cjs`.

## PC 클릭 번쩍임 수정 · 2026-11-08
- 원인: ui()가 0.2초마다 `#apstrip`(넘김·취소·비우기·결과)·`#trainbuttons`·`#basebuttons`의 innerHTML을 같은 내용이라도 다시 써서, PC에서 누름~뗌 사이에 버튼이 바뀌어 번쩍이고 클릭이 사라졌다. `guardHTML(el)`이 그 요소의 innerHTML 쓰기를 내용이 같으면 건너뛴다. 실행 중 남은 초(`.apsec`)와 시간표 표시선(`.apnow`)은 다시 그리지 않고 글자·위치만 바꾼다. `tests/slow-click.cjs`(0.45초 눌렀다 떼기, 이전 코드에서 실패 확인).

## 대화 이름표 진영 표시 · 2026-11-08
- `vnFaction(id)`: o_hero는 갈래 진영, ruler:f는 f, fallen:/fallenh:는 gui, 그 밖은 characterInfo의 faction(group 있으면 그 이름, 예: 통일파). 라벨은 FACTIONS 이름에서 「국」을 빼고 「진영」(귀왕은 「귀왕군」), 색은 FACTIONS ink. vnShow가 `.vn-name` 앞에 `small.vn-fac`를 붙인다. 전장 머리 위 진영 배지는 예전 결정대로 넣지 않는다.

## 고르기 취소·턴 끝 본진 창 · 2026-11-08
- `#ringback`(`ringBackTick` 매 프레임, `ringBack`): 계획 중 선택 부대가 PICK_MODES(apengage·apcharge·dragon·heal·fire·water·lure)이거나 고리 「이동」(`ring.pick`)을 고른 상태면 「✕ 취소 · 메뉴로」(모드 끄고 openRing), 명령 직후 ap.advance 동안은 「↶ 방금 명령 취소 · 메뉴로」(apCancelAdvance+apUndo → choose가 고리를 다시 연다). 고리가 열려 있으면 숨김. commandAt이 ring.pick을 끈다.
- `baseTurnMenu()`(apNext의 「모두 지정 완료」 분기, apReadyOpen 앞): `BASE_TURN_MENU`·본진 생존·이번 턴 처음(`ap.baseRound`)이면 openBase(0)+`#baserun`(「▶ 다 했다 · 작전 실행으로」) 표시. 실행 확인(apReady)은 그대로 열리되 `#apready.behind`로 숨겨 두고, 본진 창이 떠 있는 동안 canCommand는 `ap.baseOpen`이면 허용(충원·건설). `baseTurnDone()`(#baserun·#closeprod)이 behind를 풀어 실행 확인을 보인다. apReadyClose가 본진 창·플래그를 정리. 320×568·390×844·844×390 무스크롤. team-planning은 실제 UI 흐름이라 #baserun을 누르고, 실행 확인 창 크기 검사에서는 BASE_TURN_MENU=false. `tests/ring-back-base.cjs`.

## 남은 AP로 같은 부대 이어서 지정 · 2026-11-08
- apConfirm의 1초 타이머 끝에서 `AP_RING_CONTINUE`이고 그 부대 남은 AP>0이면 apNext 대신 selected=g·openRing(g). ringItems의 add에 필요 AP(`need`)를 받아 남은 AP보다 큰 행동은 숨김(공격·이동·진형·방향·주둔·후퇴 1, 필살기 2, 돌격·도술 3, 계략 화공·수공 3·유인 2). 군량·기력·재사용 대기는 흐리게+이유 유지. 마지막 항목은 계획이 있으면 「다음 부대」(apSkip). team-planning은 마지막 부대에서 apSkip 후 실행 확인을 기대, ring-back-base에 검사 추가.

## 취소 버튼 위치·왼쪽 안내 쌓기·군량 표시 · 2026-11-08
- #ringback이 bottom:12px라 #battlefooter(카드 줄)·#apstrip 아래에 가려 이동 고르기 중 보이지 않았다. ringBackTick이 보일 때 두 요소 중 가장 높은 top 위 10px로 bottom을 맞추고 z-index 12.
- `hudStack()`(loop, ringBackTick 뒤): #goalchip·#raidchip·#basewarn·#basealert 중 보이는 것을 42px부터 4px 간격으로 왼쪽에 쌓고(최대 폭은 군량 표시 왼쪽까지), #toast top을 그 아래(최소 78px)로 둔다. raidchip의 옛 top 지정은 제거. #basewarn은 가운데→왼쪽, 문구 「⚠ 본진 피습 n% · 눌러서 보기」(cine-alarm 검사 갱신).
- `#foodhud`(`foodTick`, 오른쪽 위 42px): 🌾 군량·`foodRate()`(economyUI와 공용)/초. 늘면 .9초마다(25 이상이면 즉시) 바뀐 자리 숫자 `.fd.roll` 굴림+`.ffloat` 「+N」 떠오름, 줄면 즉시 바꿈. 동작 줄이기면 페이드. 판정·저장 불변. `tests/hud-food.cjs`(4규격 겹침 없음·취소 버튼 최상단·+N).

## 천하도 담채 풍경화 지도
- 사용자 요청: 천하도를 더 멋지고 서정적으로, 귀왕 영토는 음산하게. terrain/realm/atlas.webp(1499×1049, 불투명, 약 724KiB)를 기존 rBase 바탕 지리를 참고해 생성했다. 전투 필드/캐릭터 그림을 바꾸지 않는다.
- realmArt/loadRealmArt: 비동기 이미지 로딩 후 rBase가 있으면 buildRealmRaster 재생성. 실패하면 console 경고와 기존 코드 바탕 유지. buildRealmRaster의 종이/물결/삼각 산맥/옛 지역 소품 단계만 realmArt가 있을 때 새 그림으로 대체하고, 강·성벽·문자/낙관/방위는 그대로 위에 그린다. rIdx/rAdj/buildRoads/클릭 데이터는 같은 코드 그대로다.
- buildOwnerLayer: 새 그림일 때 소유 색 alpha 20(기존72), 국가 경계135(기존220), 지역 경계65(기존120). drawRealmFolk의 화면 높이는 새 그림일 때 clamp(22*s+16,20,52), 기존은 유지. 풍경을 가리지 않으면서 확대하면 부대가 커진다. 지도 카메라/장 표지/진군 경로/저장 형식은 불변.
- tests/realm-art.cjs 추가: 새 그림/기본 그림의 idx·adj·도로 동일, 복구 후 같은 그림, 귀왕 영역이 다른 4진영보다 어두움, 소유권 갱신, 3화면×15클릭, 이미지 요청 차단 시 기본 지도 동작. tests/map-portraits.cjs도 통과. 상세는 terrain/realm/README.md.

## 대화 첫머리 소설 서술 · 2026-11-08
- vnShow: 앞에서부터 이어지는 화자 없는(null) 줄(lead개, 뒤에 대사가 있을 때만)은 `#vn.novel`로 `.vn-novel`(어두운 덮개, 명조 문단, 앞 문단은 흐리게·현재 문단 타자, ▼ 표시) 위에 쓰고 .vn-box·.vn-stage는 숨긴다. 첫 대사에서 클래스가 빠지며 .55초 걷힘. 타자 대상은 `VN.tx`(vnNext 즉시 완성도 그 요소). `.vn-nv-skip`「대화로 ›」은 첫 대사로 이동(대화 전체 건너뛰기 아님). vnStop이 novel 해제. 대사·장면·저장 불변. `tests/vn-novel.cjs`, dialogue-stage/prologue/map-portraits/story-death/admin-menu 회귀.

## 클로즈업 짧게·원래 화면 복귀 · 2026-11-08
- 사용자 「안 누르면 12초 실행 중 잠깐 클로즈업 후 바로 원래 화면으로」: `CINE_HOLD` 3.2→1.3초. cineEvent가 처음 확대할 때 화면 가운데 월드 좌표 `cine.c0`를 저장하고, 복귀 때 `cineHome(k)`로 배율과 함께 카메라 위치도 그 화면으로 되돌린다(`CINE_BACK`7/초, 이전에는 배율만 3.2×.8로 천천히 돌아오고 위치는 사건 지점에 남았다). 계획 단계로 넘어가면 즉시 복귀(단 cine.plan이 있으면 위치는 그대로 두어 완공 지점을 계속 비춘다). cineUser·cineReset이 c0를 지운다. 슬로우모션·최소 간격 1.8초·쿨다운은 그대로. auto-camera(복귀 3.2초 안·위치 오차<6), cine-alarm(유지 .5~1.3초, 바로 뒤 겹침 무시).

## 누르기 손맛·실행 시작 군주 시점 · 2026-11-09
- 사용자 「조작감이 흐물흐물」: 휴대폰 기본 배율(.42)에서 판정 반지름이 우리 8px·적 12px(지도 24/34)라 빗나가면 지금 부대 이동 명령이나 160 안 적 짐작 공격 창이 됐고, 선택·명령 때 카메라가 즉시 95~187px 순간이동했고, 누르는 순간 반응이 없었다.
- `tapPick(x,y)`: 화면 픽셀 판정 `tapPx`(pointerdown의 pointerType: touch 24·pen 18·mouse 12, 프로그램 호출 14). 발~머리(병사 49.4·장수 91.2·관문 120 × 화면 배율) 선분까지의 거리가 가장 작은 우리/적 중 가까운 쪽. 예전 지도 거리 판정도 인정. 목책은 직사각형. commandAt의 160 근처 적 짐작은 제거(`near=enemy`). 고리 「이동」 고르기(`wasPick`) 중에는 우리 부대를 옛 24 거리로만 잡아 이동 지점이 부대 선택으로 바뀌지 않게 한다. `scrPt`·`inView`.
- `#tapring`: `tapDown`(pointerdown, 판정 결과 색 ally 금·enemy 빨강·ground 흰)·`tapMark(k)`(commandAt 결과, 조여드는 .38초)·`tapCancel`(끌기·핀치). 고른 부대는 soldier에서 selFlash .6→.42 동안 크기 1→1.13→1(동작 줄이기 제외).
- `glideCam`·`camGlideTick`(loop, clampCam 앞, .22초 감속): choose의 focusPoint(…,true), apConfirm은 지점이 `inView`면 카메라 고정·아니면 미끄럼. pointerdown이 미끄럼을 끊는다. 다른 focusPoint 호출(배치·전체 보기)은 즉시.
- `lordView()`: resumeCombat(true)에서 실행 시작 때 군주(ally hero)로 focusPoint 미끄럼. 클로즈업 복귀 기준(cine.c0)도 군주 화면이 된다.
- `tests/tap-feel.cjs`(휴대폰 터치·PC 마우스: 12~18px 빗나간 누르기 우리 5/5·적 5/5, 땅은 이동, 미끄럼, 화면 안 지점 고정, 실행 시작 군주). select-focus는 미끄럼이 끝난 뒤(320ms) 가운데 오차를 잰다. 저장·전투 판정 불변.

## 군량 표시 다듬기 · 2026-11-08
- 사용자 「군량 글자 없애고, 자리 숫자가 굴러 올라가게, 매초 말고 턴마다, 조금 작게, 다른 데 안 겹치게」. #foodhud는 🌾+숫자(13px)만, title/aria-label 「군량」. `foodTick`: 줄어들면 즉시, 늘어난 것은 state==='planning'일 때만(턴 끝에 한 번) 반영. `foodDigits(el,nv,ov)`: 자리 k마다 floor(nv/10^k)−floor(ov/10^k)칸(최대 20) 숫자 띠를 `fdSpin` 1.1초로 위로 굴림, `.fnum` dataset.v에 값. 「+N」은 아래에서 떠올라 그 자리에서 사라짐(숫자를 가리지 않음). 동작 줄이기면 굴림 없음.
- 겹침: 전체 폭 #warning(적 진격 안내)도 hudStack 왼쪽 쌓기에 넣어 right:auto·최대 폭 제한. #turnflash top을 hudStack이 왼쪽 쌓기 아래·군량 아래+6으로. `tests/hud-food.cjs`(글자 없음·13px·실행 중 불변·턴 끝 일괄·일의 자리 굴림·진격 안내 포함 4규격 무겹침).

## 진영 꼬리표 축소·이름표와 이등신 겹침 · 2026-11-08
- 사용자 「진영 꼬리표 작게, UI끼리 겹치지 않게」: .vn-fac 9px·여백 축소. `#vn .vn-box.vn-box{margin-top:16px}`로 이등신 발이 위로 올라가 이름표(상자 위로 14px 튀어나옴)와 겹치지 않음(320·390·844·1280에서 이등신 아래 < 이름표 위). 같은 요청의 소설식 첫 서술은 다른 창에서 먼저 병합된 main 구현(vn-nv-body, 「대화로 ›」)을 그대로 쓴다. 계획 중 완공 비추기 보간 6→9/초(부하 시 waves-defense towerCam 안정).

## 장수 옷 진영색 · 2026-11-08 (되돌리기 가능)
- 사용자 「장수들도 진영색으로, 롤백하자고 하면 원래대로」. `tools/faction-outfit.py`가 16명(청룡·현무·백호·주작 각 군주+3)의 `characters/pixel/<이름>`·`pixel/dir/<이름>/*`·`pixel/walk/<이름>/*`·대화 이등신 원본을 읽어 `fc/<같은 경로>`에 사본 336장(4.2MB)을 만든다. 원본 파일은 그대로. 규칙: 그림 위쪽 머리(36%, 말 탄 호연·사율 40%·비연 36% 등 HEAD)는 그대로, 아래 몸에서 피부·진한 갈색(말·가죽·나무·금)을 뺀 천을 청룡 색조212·주작356(채도 .38+)·현무 어둡게(V×.5)·백호 하얗게(채도×.18), 머리 경계 5% 부드럽게. 말 탄 인물은 아래 40% 말 몸통의 따뜻한 색 제외. 초상(배경 있는 불투명 그림)·귀왕군·통일파 제외. 호연·사율은 옷이 대부분 갈색 가죽이라 변화가 작다.
- 게임: `FACTION_OUTFIT=true`·`FC_NAMES`·`fcSrc(p)`가 loadCompanionArt·rulerArt(loadUnitArt)·loadDirArt·loadLeaderWalk·vnActor의 img.src만 fc/로 바꾼다(dataset.sprite·artName·발 위치 계산은 원래 이름 기준 그대로). **되돌리기: `let FACTION_OUTFIT=true`를 false로**(fc/ 폴더는 남아도 무해, 완전히 지우려면 fc/·tools/faction-outfit.py·tests/faction-outfit.cjs 삭제). `tests/faction-outfit.cjs`(켜짐/꺼짐 경로·귀왕·통일파·초상 그대로·404 없음·사본 수).

## 지키기 목표 턴 판정·승리 확인·군량 숫자 · 2026-11-08
- 사용자 「부두 4턴 지키기가 끝나지 않는다, 전체 확인」. 26장 모두 목표를 채우면 ending→결과 화면→천하 지도→장 완료가 되는 것은 확인(c13 holdAll은 중앙 보급소가 `capture` 변수라 그것까지 채워야 함). 문제는 hold 진행이 「적이 없을 때 1배·아군>적×2일 때 .5배·적만 있으면 감소」라서 지점에 서 있어도 적이 오가면 1~2턴이 늘거나 줄어 표시 「n/4턴」과 체감이 달랐다(c12·x4 실제 진행 12턴에도 미달).
- goalTick hold: 턴(`Math.floor(time/AP_TURN)`)마다 `s.ok`(아군>적 시간)·`s.bad`(적>아군 시간), `HOLD_TURN`=.6 × 턴을 먼저 채운 쪽으로 그 턴 1회 판정(`s.cnt`) → `s.n` ±1(say 알림), `s.n>=turns`면 그 순간 win. `s.prog`는 그리기·문구용((n+진행)×턴). showResult 승리 제목은 goal이 있으면 「목표 달성 · goalText」(남은 턴 문구 제거). `tests/all-goals.cjs`(26장 강제 달성→종료·결과·완료, hold 5장 실제 서 있기→정해진 턴에 종료), ap-stragglers hold 검사를 새 상태로 맞춤.
- 군량 숫자: 굴림이 끝난 자리 띠가 화면 배율에 따라 위 칸 조각을 남겼다. foodDigits가 1.25초 뒤 굴림을 정적 숫자로 다시 그리고, 칸 높이를 정수 16px, 굴림 중 위아래 가장자리 마스크.

## 절벽·협곡·능선·숲 HD 연결(요청 8) · 2026-11-08
- HD_ART_FILES에 qing-cliff-top·qing-gorge·qing-ridge·qing-canopy·qing-cliff-face. pixelRegionBackground(HD일 때만): pass·canyon `cliff` 안쪽=HP.cliffTop(북 끝 밝게·옆 그늘), 앞쪽 띠(아래 44 안에 통행 칸)=HP.ridge+깊이 그늘, `pass` 지형=HP.gorge(빗금 대신), valley `cliff`=HP.ridge(+북 밝게·남 그늘, 돌무더기 루프 생략), forest `cliff`=HP.canopy(+가장자리 그늘, 수관 덩어리 루프 생략). 헬퍼 `pat`·`tint`.
- 절벽 면: `HD_CLIFF`{u0 334,u1 694,k0 .6422,c0 696.2(측정 아랫선),g 32,h .6}, `cliffEdges()`(canyon·pass·valley에서 cliff 칸 중 +y/+x 이웃이 통행 칸이면 가장자리 점, battleRegion·layout·WS 키로 캐시 `cliffEdgeCache`), `drawCliffSlice(e)`: 칸 하나 길이의 화면 벡터에 그림 조각(폭 sw=화면 폭/h)을 아랫선 기울기 보정해 붙임(남쪽 면은 '-m' 반전), 조각 x는 가장자리 좌표로 순환. draw의 objs에 project y+1로 넣어 유닛과 깊이 정렬. 귀왕 지역은 hdImg가 없어 그리지 않는다. `tests/hd-cliff.cjs`.

## 제자리 공격 = 남은 AP 전부로 계속 공격 · 2026-11-08
- 사용자 「AP가 남아 있을 때 공격하면 몇 번이고 다시 공격을 누르게 됨, 일단 공격하면 계속 공격」. 원인: `attack`(제자리 공격)이 2 AP 고정이라 남은 AP로 원형 메뉴가 다시 뜨고, 그 행동은 첫 타격에 `apCommitted`가 되어 한 번만 쳤다. apAdd에서 attack 비용을 engage·garrison·water처럼 남은 AP 전부로, apStart는 attack도 u.ap를 미리 빼지 않고 `apActionLeft`=비용, apCanStrike/apStrike는 attack을 engage와 같이 공격마다 apCost만큼 apActionLeft·u.ap 차감(이동은 없음, 신호 문구 없음). 목표 창 문구 「남은 n AP · 계속 공격」. c2 측정: 궁병 실행 11→28회, 창병 11→46회, 공격 뒤 남은 AP 0(메뉴 재표시 없음).

## 대화 장면 늘리기·「폐하」 호칭 · 2026-11-08
- 사용자 「대화가 너무 짧다, 장면을 늘리고 다양한 대화·상호작용, 성격·말투 일관, 신하는 자기 군주를 폐하로」. SAGA_Q/X 26장 pre·post를 장면당 14~20줄(+456줄), pov 8장면 +2~4줄. **기존 줄은 그대로 순서도 유지하고 사이에 끼워 넣었다**(반전·목표 숫자·선택 조건 줄 보존). 새 줄 55자 이하, c9/x6 전 「아버지」·새 암시 없음, 귀왕·흑철 새 대사 없음, 묵철 c16·강현 사망 뒤 새 대사 없음. 새로 말하는 합류 동료는 그 장 `sceneCast`에 추가(partyLines가 출진 안 한 합류 동료 대사를 빼므로). 현무편에서 묵철은 x2·x3에서만 말한다(청명편 c6·c8·c11과 겹치지 않게).
- 호칭: 기존 대사·인연(BONDS)·인물 소개의 신하→자기 군주 「군주님·여왕님·스승님(설화→서진)」·이름 부르기(묵철·운학→청명)를 「폐하」로. 다른 나라 군주 호칭은 그대로. battleVoice는 대사 첫머리 「청명,」을 같은 나라 장수면 「폐하,」, 청명편 다른 나라 장수면 「청명 님,」, 현무편 다른 나라 장수면 「군주님,」으로. CHARACTERS.md 9절 호칭표 갱신. 사신기.md는 장별 대사 블록을 데이터에서 다시 만들었다(934→1413줄).
- 만든 방법: 장별 JSON을 3묶음(c1~8, c9~16, x1~10)으로 나눠 작성, 검사 스크립트(기존 줄 부분열 보존·길이·화자·호칭·반전·생사 규칙)로 확인한 뒤 index.html의 각 배열을 JSON 문자열 그대로 교체.

## 남성 말투·합류 이유·현무편 묵철 · 2026-11-08
- 사용자 「남자 캐릭터 대사가 여자 같다, 남성스럽게」. 남성 화자(o_hero 양 갈래·ruler:qing/xuan·묵철·운학·연백·도겸·호연·은랑·홍염·무진·백륜, 흑철·귀왕 제외)의 해요체 「~요」 어미를 없앴다(「~지요」 합쇼체만 허용). 청명은 신하·비연에게 해라, 묵철에게 하오, 다른 나라 군주에게 합쇼, 다른 나라 장수에게 하오. 운학은 폐하·묵철에게 합쇼, 은랑은 군주에게 합쇼·동료에게 반말. SAGA 53장면(남성 줄 약 230줄)·BONDS 13줄·전투 음성 4줄. 여성·서술·보호 문구(서른두 명·80초·90초·「이번엔 내가 남는다」 등) 불변. CHARACTERS.md 9절 「남성 인물 말투」.
- 「진영을 옮기면 이유가 있어야」: 합류 장면에 그 나라 군주의 파견 명령과 본인 이유를 2~3줄씩 추가(c2 비연, c4 설화·연백, c5 호연·사율, c6 은랑, c8 홍염·해린, x5 홍염·해린, x8 은랑).
- 현무편 x3 `joinAfter:['o_muk']` 삭제(사용자 결정: 청명편에서 같은 시기 묵철이 청명 곁에 있음). x4·x5 slots 4→3. loadRealm이 xuan 저장(연대기 twin 포함)의 roster·party에서 o_muk을 뺀다. x4 이후 묵철 대사 없음.


## 에셋 보관·재사용 도감
- asset-library/index.html: 최근 지형/천하도/망자군 67파일과 전체 게임 그림 957파일(최초 정리 기준)을 검색·확대·다운로드하는 독립 도감. 파일 경로를 옮기거나 게임 코드를 바꾸지 않는다. catalog.js를 읽으므로 로컬 HTML에서도 fetch가 필요 없다. 프레임·방향·알파·크기·SHA·HD 소품 4칸 분할·사용 문서 링크를 보관한다.
- 그림을 추가한 뒤 python3 tools/asset-library.py build로 catalog.json/catalog.js를 재생성한다. Pillow 사용, 기존 생성/변환 도구와 같은 환경. 새 종류를 만들면 도구 분류/라벨도 보완한다. 이미지와 index.html은 수정하지 않는 명령이다.
- python3 tools/asset-library.py pack --output /workspace/exports/spirit-war-art-library.zip; --collection recent이면 최근 묶음만. 저장소 밖에 ZIP을 만들고 Git에 중복 저장하지 않는다. ZIP에는 원래 폴더 경로·도감·목록·제작 요청서·기준점 문서·효과 라이선스·재생성 도구를 함께 넣는다. 업로드된 게임용 PNG/WebP를 보관하며 생성 서비스의 임시 고해상도 초안까지 포함한다는 뜻은 아니다.
- tests/asset-library.cjs: 최근/전체 검색·인물명·방향·시트 정보·반복 보기·JSON 다운로드·4화면 검사. ZIP은 CRC/모든 이미지 SHA를 검사했고 압축 내용만 공급한 브라우저로 도감/이미지 경로 완결을 확인했다. 현재 클라우드 Chrome은 file:// 이동을 관리자 정책으로 차단하므로 그 프로토콜 자체의 실행 검증은 하지 못했고, 네트워크 의존성을 없앤 로컬 구성으로 제공한다.
## 대화 이등신 마주 보기·귀왕 그림 요청 · 2026-11-10
- 사용자 「백륜이 바라보는 방향이 이상, 대화에서 서로 바라보게」: 오른쪽 자리는 기본 거울(원본이 오른쪽을 본다는 가정)이라 원본이 왼쪽을 보는 이등신은 바깥을 봤다. 19장 대화 이등신을 오른쪽 자리 모습으로 늘어놓고 확인해 백륜·도겸이 해당. 전장 도트 그림 방향(ART_LEFT)과 섞지 않으려고 대화 전용 `VN_FACE_LEFT=/(baekryun|dogyeom)\.webp/`를 vnActor의 `.lf` 판정에 더했다. 새 이등신이 왼쪽을 보면 여기에 추가. `tests/vn-facing.cjs`(양 갈래 32화자가 오른쪽 자리에서 가운데를 봄, 왼쪽 주인공은 원본).
- ART_REQUESTS 요청 9: 귀왕 영토 3전장(숲 2·협곡 1)이 실제 쓰는 지형에 맞춘 `gui-*` 16장(바닥 10·절벽 면·소품 시트 4·폐가) 프롬프트. qing-* 파일과 하나씩 짝이라 받으면 theme gui에서 키만 바꿔 연결한다. 물·습지·논은 귀왕 전장에 없어 제외.

## 요청 9 귀왕 전장 그림 전달 · 2026-11-10 (Codex)
- terrain/hd/gui-* 새16장: 바닥10·절벽면1·소품4시트·폐가1. 파일명은 ART_REQUESTS 요청9 표 그대로. 게임 선택/로더/판정은 수정하지 않았다. 청룡 원본·기존 gui-outpost/ghost-gate도 그대로다. theme gui 연결은 다음 작업.
- gui-request9-manifest.json: 각도·칸별 bbox·밑끝·해시·프롬프트·검수. 바닥1024불투명, 소품2048×512(각512칸, 밑끝496), 집1024투명(밑끝992), 절벽1024×512투명. 모두4×4·40색 이하, 알파0/255. 작은 부적/바위/나무는 게임 배율을 별도로 잡는다.
- 절벽은 약32.78도(base y=-.6439171x+676.2742), 위쪽 y=-.7050983x+526.1326, bbox320,40,704,468, 회귀x333~690. 목표-.70710678 보정·끝 겹침/클리핑 필요. 두 차례 생성에도 정확한35.26도가 아니므로 무보정 접합 완료로 취급하지 않는다. 청룡 drawCliffSlice 수치를 그대로 복사하지 말 것.
- PNG16장 규격/알파/색/격자/해시, 소품4시트 칸/발 위치, Chromium16장 decode, 에셋 도감 모바일·PC 검사 통과. 바닥2×2 미리보기 확인; 게임 연결/휴대폰 실기와 실제 투영 배율 반복은 대기. 그림을 연결했다는 의미가 아니다.
- 도감 catalog 갱신: 전체973/최근83(HD50). tools/asset-library.py의 새 소품 한글 이름·절벽 주의와 ZIP manifest 동봉, 도감 테스트의 고정67개 기대값만 최신 확장 가능하게 바꿨다. 게임 코드는 이번 그림 제작 커밋에서 그대로다. 기존 도감 보존을 위해 최신 main을 작업 브랜치에 가져온 merge99226e7 이후에 제작했다. main으로 병합하지 않는다.

## 귀왕 전장 HD 연결(요청 9) · 2026-11-10
- HD_ART_REGIONS 15지역 전부. `hdGui()`(지역 theme gui)·`GUI_HD`(qing→gui 키 16개)·`hdKey(k)`. hdImg·hdTile(캐시 키도 gui 이름)·hdPropArt(`GUI_PROP_FOOT`)·pixelHouse(gui-house 발 992)·drawCliffSlice(`HD_CLIFF_GUI`{u0 333,u1 690,k0 .6439,c0 676.27,h .53})가 사용. pixelColors·mapTheme는 귀왕 지역이면 청룡 공통 대신 귀왕 팔레트. 귀왕 거점·귀문·망자군 병사는 기존 그대로. hd-common(15지역 HD, 귀왕은 gui-prop·귀왕 팔레트)·hd-cliff(혼령곡 gui 타일·절벽 면) 기대값 갱신.

## 이어 찍은 이동 경유·원형 메뉴 계속 공격 · 2026-11-10
- 원인: 이동은 AP 시간 칸으로 나뉘어 둘째 이동이 첫 칸 끝에 시작되므로, 지형·대형 유지로 늦어 A에 못 닿으면 출발 위치에서 B로 지름길을 갔다(측정: A에 가장 가까이 간 거리 228). apStart의 move/retreat가 바로 앞의 이어진 move/retreat 중 `reached`가 아닌 것을 `ap.wp`(부대별 경유지 목록)에 넣고 첫 경유지로 formation, `apWpTick`(apTick 첫머리, 매 프레임)이 중심이 `WP_REACH`110 안이면 reached·다음 경유지로 formation. 시간 칸이 끝나면 기존대로 apHold. apEndRound가 ap.wp를 비운다. AP 비용 계산(apPoint 기준)은 그대로. 경로가 길어지므로 시간이 모자라면 B 앞에서 멈출 수 있다(의도).
- `ap.intent`: attack·engage·charge의 대상을 기억(`ap.intentKind` attack/engage), retreat·garrison에서만 지운다(이전에는 engage 외 모든 행동이 지움). 라운드 넘김 시 쓰러진 대상의 같은 squad 병사로 바꾸는 기존 처리 유지. `apContinue`: 지난 행동이 제자리 공격이고 apTargetInfo 사거리 안이면 attack, 아니면 engage. ringItems 맨 앞 `cont` 「⟳ 계속 공격」(hint=대상 이름, `intentLabel`, 보이지 않는 적이면 숨김, 2 AP 필요). `tests/ring-move-continue.cjs`(이전 코드 실패 확인).

## 도술 → 필살기 · 2026-11-10
- 사용자 「도술을 필살기로, 캐릭터마다 개성 있는 필살기 하나, 군주는 두 개」. 화면 문구 「도술」 전부 「필살기」(AP_NAMES skill·dragon·heal 「필살기」, 원형 메뉴 spell 항목 ✦ 필살기, HELP, 단축키 안내).
- 군주: `LORD_ULTS`{qing:{dragon 청룡강림, heal 청류 회복진}, xuan:{dragon 현무진동, heal 현무 귀갑진}}·`lordUlt(k)`. 내부 종류 dragon/heal·기력 45/35·지점 지정·3 AP는 그대로. resolveSpell이 서진이면 피해 ×.7+기절 2.5(적장·관문 제외)·pfx slam, 회복 25%+bf def .6 8초. ROUTE_CFG xuan spell 「현무진동」(오타 정정). #dragon/#heal 버튼 이름·예약 표시도 lordUlt.
- 장수: HERO_SKILLS에 `ult`·`desc`, o_dog 「흑수 반간계」 추가(12명). `ultEffect(id,sk,us)`(useHeroSkill의 버프 적용 뒤): volley(가까운 적 부대 170 화살비 85·적장110)·spearwall(230 밀어냄 90·기병 기절2.5/그 외 .8)·taunt(380 적 focus=묵철)·charge(기존)·gale(260 피해70·밀어냄)·snipe(760 안 가장 가까운 적장/장수 300·적장 420)·rally(360 안 다른 아군 15% 회복)·siege(520 안 관문·목책 최대 체력 30%, 없으면 200 범위 120)·survey(아군 궁병 전체 `rngUntil` 8초 → attackRange ×1.25)·wall(기존 기절+밀어냄 110)·cover(수레 30%·다른 아군 15%)·scheme(420 안 적 부대 사기 −45, 0 이하면 routSquad). 운학 버프는 rate만(atk 대신 화살비), 설화 atk 1.5, 은랑 1.5, 호연 atk 1.4, 사율 이름 「측량 사격도」. `ultFoes(c,r)`. 발동 시 powerBanner(✦ 이름, 장수 필살기·설명). `tests/ultimates.cjs`(12명 효과·군주 두 갈래·고리·도술 문구 없음). 저장 구조 불변.

## 시야·잠행·매복·기습(1~3단계) · 2026-11-10
- 약한 안개: `computeVision`(110ms 실시간 간격)이 모든 유닛의 `hid`(상대에게 숨음)·`hidT`(마지막으로 숨어 있던 time)를 계산, 적은 `seen=!hid`. `concealR(v)`: 구조물·적장(boss)·패주·`revT`(공격·피격 뒤 2초) 0, 매복 `HIDE_AMBUSH`120, 잠행 덤불 140/트인 곳 260, 그 밖은 `FOG_ON&&coverAt`이면 `HIDE_COVER`220. 상대 유닛 o의 정면 기준 cos<−.35(등 뒤)면 거리 ×`SIGHT_REAR`.45. `coverAt`(80px 칸, bamboo 또는 forestNear(110).forest≥.45, `coverCache`)·`coverNear`(5점 중 2). `FOG_ON=false`면 숲 은폐만 끈다(잠행·매복은 유지).
- acquire: 적은 hid 아군을 고르지 않고 hid focus를 지움, 아군은 직접 지정(focus)한 숨은 적만 친다. squadFrames도 전원 hid인 부대를 목표로 고르지 않는다. 적 부대가 전원 숨으면 `ghosts`(중심·time, `GHOST_LIFE`24초)·`drawGhosts`(점선 고리+「?」). `visionReset`은 reset에서.
- AP: `sneak`(이동과 같은 경로/경유지·apPoint, 비용 ceil(거리/(속도×`SNEAK_SPD`.6×칸))+1, 2 AP 이상, 기병·g0 불가, `u.sneakMv` 동안 이동 속도 ×.6), `ambush`(남은 AP 전부, apPoint `coverNear` 필수, 기병 불가, engage처럼 ap 미리 차감 없음·apActionLeft로 타격). apStart가 move·retreat·garrison·skill·필살기·계략에서 stealth/ambush를 끈다(hold·face·attack·engage·charge는 유지). apCanStrike: ambush 중 금지, stealth면 attack/engage/charge/ambush 행동일 때만. 원형 메뉴 `sneak`(ring.pick='sneak'→commandAt이 apAdd('sneak'))·`ambush`(덤불 아니면 흐림 「숲·덤불에서만」).
- `ambushTick`(update, stratTick 뒤): 매복 부대 250(`AMBUSH_R`) 안에 보이는 적이 오면 ambush 해제·`u.sprung=ap.round`·order attack·focus, 배너 「🍃 매복 발동」·cineEvent. 이동 게이트는 sprung 턴의 attack을 허용. `revealSquad`: performAttack(공격자)·hit(d>0 피격자)에서 부대 전체 stealth/ambush 해제.
- `surpriseMul(u,t,m)`(attackDamage 끝): time−hidT<3(`SURPRISE_WIN`)이면 ×min(1.5, 6/m.total)(최소1), 같은 적 부대 8초 재사용(`surprised`), 같은 공격 부대 .6초 동시 타격은 배율만. 첫 타격에 기절 .8·사기 −30·impact 「기습!/후방 기습!」·cine pri3·아군이면 powerBanner. matchupPreview가 숨은 부대에 「숨어 있음 · 기습」. `facingArc`(targetMark, 계획 중)가 적 지휘관 dir 기준 정면/측면/후방 부채꼴. HELP 상성 2줄. 저장 구조 불변. `tests/stealth-ambush.cjs`. 4단계(적 매복·정찰 맞대응)는 미구현.

## 적 매복·정찰(4단계)·인물 첫 등장 소개 · 2026-11-10
- 장 데이터 `amb:n`(c6·c8·c10·c12·c14·c15·c16 / x4·x6·x8·x9·x10). launchChapter 끝 `enemyAmbushInit(c)`(formInit 뒤): battleRoutes 길을 160 간격으로 훑어 지도 가운데 높이 쪽부터, 아군 1100(수레 520)·본진 1500 밖·서로 900 떨어진 곳 근처 140~340 안의 덤불 칸(coverAt+coverNear)에 적 보병 부대(적장·기병·호위·잠든 부대 제외, tag 없는 부대 우선)를 옮겨 stealth·ambush·post. 옮긴 부대 tag의 행진 event는 지운다. `ghostVis`를 false로 두어 처음 흔적이 생기지 않는다. 발동은 기존 ambushTick(적이면 「⚠ 적의 매복!」 배너).
- 정찰: computeVision에서 사율 부대(`SCOUT_SA`1.4, 매복은 최소 HIDE_COVER 220)·기병(`SCOUT_HORSE`1.25)이 발견 거리를 늘린다. `scoutTick`(computeVision 끝): 매복이 남아 있으면 운학 출진 시 `ambushHints('운학의 기록',1)`(본진에 가장 가까운 1곳), 봉화대 확보(beacon≥1) 시 전부. 흔적은 ghosts에 `hint:true`·`life`(4턴)·60~150 어긋난 자리, drawGhosts가 노란 「매복?」. `scout`는 visionReset에서 초기화. 브리핑 「⚠ 매복 가능」, HELP 상성 한 줄. `tests/enemy-ambush.cjs`.
- 인물 첫 등장: vnShow가 novel이 아닌 화자 줄에서 `vnIntroCheck(id)`. 키 `vnMetKey`(o_hero→'ruler:'+갈래 진영, fallen 제외), `R.saga.met`(없으면 생성, 연대기 R.twin.saga.met과 공유)에 없으면 `vnIntroShow`: #vn 안 `.vn-intro`(pointer-events none, 위쪽 띠·진영색 `--vi`·이등신 vnSprite(fcSrc, 오른쪽 자리 거울 규칙)·talkPortrait 초상·vnFaction 꼬리표·이름·역할·소개 bio(군주는 RULER_LORE.body) 38ms 한 글자씩 → 1.7초 뒤 .4초 페이드). 동작 줄이기는 즉시 전체 글. vnStop이 `vnIntroHide`. `VN_INTRO=false`로 끈다. 저장은 R.saga에 배열 하나 추가(옛 저장은 처음부터 다시 소개). `tests/vn-intro.cjs`(4화면 대화창과 겹치지 않음).
- 2026-11-10 후속(휴대폰 큰 글씨에서 소개가 띠 밖으로 넘침): `.vn-intro`를 전체 덮개(inset 0, 어두운 배경, 띠 높이 화면 84%)로, 카드는 머리(초상·이름·역할 + 오른쪽 이등신)와 아래 소개 상자 `.vi-bio`(넘치면 숨은 스크롤, 타자마다 scrollTop=끝·smooth, 동작 줄이기는 전체 글 뒤 30ms마다 1px 내림). 이제 덮개가 입력을 받는다: 화면·Enter의 첫 누르기는 `vnIntroOn()`이면 vnNext가 소개만 닫고 대사는 넘기지 않는다. 가로(높이 ≤500)는 이등신을 카드 오른쪽 28% 칸에. vn-intro 검사: 첫 누르기 닫기·띠 ≥60%·카드 화면 안·넘침 자동 스크롤. dialogue-stage·vn-novel·vn-facing·prologue·map-portraits·story-death·admin-menu·cast-deployment·forest-field·chronicle·all-goals 통과.
- 2026-11-10 후속2(「첫 대사 뒤에 날아와서 소개」): vnIntroCheck는 `VN.pend`{id,k,inf,i}만 두고(met 기록 안 함) `vnIntroWait`(150ms 확인, 대사 타자가 끝난 뒤 `VN_INTRO_WAIT`2400ms 그대로면 시작). vnNext 순서: 소개 열림→`vnIntroClose(true)`(닫고 다음 줄, 마지막 줄이면 선택지·닫기 규칙대로) / 타자 중→완성 / pend가 이 줄→`vnIntroStart`(met·twin 기록 후 vnIntroShow(...,true)) / 그 밖 다음 줄. 자동 숨김도 vnIntroClose(true). vnIntroShow fly: 무대 .vn-l/.vn-r(그 인물 쪽)의 사각형에서 `.vi-fly` 복제 그림(position fixed)을 .vi-sd 자리로 620ms(중간 밝게·커지며, 거울 방향은 CSS scale 속성까지 읽어 m0→m1), 그동안 무대 그림 visibility hidden·`.fly`로 .vi-sd 숨김, 도착 뒤 타자 시작. vnIntroHide가 복제 제거·무대 그림 복원·대기 타이머 해제. 동작 줄이기면 날기 없이 즉시. vn-intro 검사 새 흐름(첫 대사 먼저·누르기/기다림·날기·닫으면 다음 줄·다시 안 나옴·c1 대화 전체 기록 일치).

## 인물 대사·소개 개정 · 2026-11-10 (Codex)
- 병합된 최신 main c3f689b(인물 소개가 무대에서 날아오는 최신 수정 포함)를 기반으로 codex/vivid-dialogue에서 작업. 대사 외 함수/레이아웃/전투·저장 데이터는 변경하지 않았다.
- SAGA_Q16장·SAGA_X10장의 pre/post/pov 대사758줄, c13 선택 뒤9줄, BONDS_Q3편/BONDS_X1편을 개정. 죽은 군주·흑철의 고정 명령은 그대로. 도겸의 반복 「솔직히 말씀드리지요」, 전원의 약속/기록 선언과 감정 해설을 줄이고 인물별 현장 판단·요구·말다툼·머뭇거림으로 썼다. 농담은 초반/휴식 장면에 두고 사별 장면에서 걷어냈다.
- COMPANIONS5·FACTION_CHARACTERS10·RULER_LORE5의 소개/인용 개정. 첫 등장/인물첩은 기존 공유 데이터를 그대로 읽는다. 소개는 앞으로의 결말을 요약하지 않고 관찰 가능한 행동과 현재 갈등을 보여 준다. ASSET_MANIFEST20명도 bio/quote 동기화. 성별·소속·초상·병종·스킬·기존 인물 관계는 그대로.
- 사신기.md는 게임의 모든 대화/조건별 선택/인연과 동기화. CHARACTERS.md 개요/인용/대사 수(두 분기 모두 계산)·청명 말투와11절 집필 기준 갱신. 과거 검토 메모/행적 인용은 당시 표현으로 남겨 두었다.
- 원본 비교: chapter별 대화 수·화자·조건 메타데이터·앞머리 서술·고정 망자 명령 유지. 나머지 chapter 필드 전부 동일(목표·생사·합류·req·보상·slots·amb·survive·배경). index.html은 위7개 텍스트 선언을 제외하면 main과 동일함을 확인. c9/x6 이전 정체 비공개, c15 묵철/무진 퇴장·c16 강현 죽음·연화/비연 선택 조건 그대로.
- 검증: story-death(생사/편성/조건별 대사), dialogue-stage(대본 일치·반전·914줄/선택 320/390/844 화면), vn-intro(첫 대사→소개·자동/누르기·타이핑·자동 스크롤·4화면·갈래/연대기), vn-novel(소설식 서술3화면) 통과. 말투를 다시 손볼 때 CHARACTERS11절과 실제 앞뒤 대사를 함께 읽을 것. 「말버릇 한 단어」를 전 줄에 반복해 캐릭터성을 대신하지 않는다.

## 조연 관계·피난·신뢰 손상 서사 · 2026-11-10 (Codex)
- codex/vivid-dialogue의 대사 개정 위에서 후속 작업. SAGA_Q/X에 대화96줄 추가, 기존 표현3줄 수정. 운학–단심(호감→부상 명부 무단 전달→배포 동의→함께 부고), 호연–사율(호감→공동 항명→강현 사별 뒤 동행), 홍염–해린(이전 피난에서 죽은 오라비→구출 순서 충돌→청명 오해 제지), 묵철–연백(국숫집 초대→사별 편지)을 장별로 연결했다.
- c10 성 밖 주민 피난·동쪽 골목 화재·관사 개방은 고정 대화 서사. 새 피난 미션/손실 계산/호감도 시스템은 아님. 백륜의 협박, 강현의 공방 개방, 서진의 중단 약속 위반을 기존 원인과 연결한다. 추가 정체 반전이나 주요 인물 사망은 없음.
- STORY_RELATIONSHIPS.md: 관계별 동기·진행·결말, 군주 고난의 원인/결과, 집필 기준과 게임 반영 범위. 사신기.md 전체 대사 동기화. CHARACTERS.md 대사 수/관계 기준 갱신. 새 화자가 편성 때문에 사라지지 않도록 해당 sceneCast에 포함.
- 검증: index.html은 SAGA_Q/X 두 선언 외 HEAD와 동일. 전투/합류/생사/선택/보상 메타데이터 동일, 새 대화 화자 sceneCast 검사. story-death 통과. dialogue-stage는 전체1010줄/선택 및 모바일 세로·가로 검사.

## 소개를 서사 중심으로 수정·식사 대사 축소 · 2026-11-10
- 사용자 지적 반영: 20명 소개를 과거 사건·현재 목적·관계 갈등 중심으로 재작성. 생활 버릇과 식사 묘사로 인물성을 대신하지 않는다. 게임 소개 데이터/ASSET_MANIFEST/CHARACTERS 동기화.
- SAGA_Q/X 53줄 수정. 식사 권유 반복을 유족 면담·부상병 방문·교대로 교체. 호연–사율은 강변 동행, 묵철–연백은 갑옷 벗고 재회하는 약속으로 변경. x1의 왼손 식사도 삭제. 작전에 직접 영향을 주는 군량·배급은 유지. 사신기와 관계 설계서 동기화.
- 텍스트 외 코드 동일, 화자·대사 수·조건 메타데이터·생사·전투 목표 동일 확인.

## 대사·소개 균형 조정 · 2026-11-11 (Claude)
- 사용자 「너무 지엽적, 밥 얘기 그만, 소개 줄여」: SAGA_Q/X에서 줄거리와 무관한 생활 잔가지 155줄 삭제(붕대·신발·바느질·인원/수레 세기·계단·빨래·경첩·호칭 실랑이 등), 이어지는 8줄은 다듬음(1001→846줄). 사건·갈등·관계의 핵심 줄, 선택 조건 줄(c13), 보호 문구(서른두 명·80초·90초·이번엔 내가 남는다), 반전 규칙은 그대로. 화자·장 순서·목표·합류·저장 불변.
- 인물 소개 20명(COMPANIONS/FACTION_CHARACTERS bio, RULER_LORE body)을 두 문장(정체+갈등)으로 줄임. ASSET_MANIFEST·CHARACTERS·사신기·STORY_RELATIONSHIPS 동기화. 집필 기준 0번: 생활 묘사는 장면당 하나, 식사 장면은 쓰지 않는다.

## 인물 소개 날아온 뒤 크기 유지 · 2026-11-11
- 원인: 복제 그림을 상자 높이 비율(tr.height/sr.height)로만 키웠는데 무대 .vn-p와 소개 .vi-sd는 상자 비율·object-position(가운데/오른쪽 아래)·최대 폭이 달라 object-fit:contain으로 실제 그려지는 그림 크기가 달랐다(320에서 도착 순간 약 39px 변함). `vnImgRect(im)`(natural 크기·object-position·거울 반영 실제 그림 영역)로 출발·도착을 재고 복제는 그 영역 크기에 objectFit fill로, `vnIntroFly`가 그 영역끼리 이동·확대. 소개 그림이 아직 안 불러졌으면 load 뒤 날린다. vn-intro에 4화면×5인물 도착 직전 복제 = 도착 뒤 그림(오차<4px, 실제 0) 검사, 이전 코드 실패 확인.

## 적 매복·기습 큰 경보 · 2026-11-11
- 사용자 「적도 기습·매복 하나? 알 수가 없다, 크게 띄워」: 적 매복(amb 12장)·적 기습(숨어 있던 적의 첫 타격, surpriseMul)은 이미 있었지만 매복은 일반 powerBanner, 기습은 say 한 줄뿐이었다(적은 잠행 이동은 하지 않는다). `alertBanner(title,sub)`: #powerup에 `.alert`(화면 가로 붉은 띠·글씨 30~58px·3.4초 alertPop)+#stage의 `#dangerflash`(가장자리 붉은 번쩍임 1.6초), `alertAt`(reset이 −99). powerBanner는 경보가 떠 있는 2.6초 동안 무시(이어진 기습 경보도 같은 간격으로 생략). ambushTick 적 쪽·surpriseMul 적 쪽(당한 부대 이름)에서 호출. goalBanner sub에 c.amb면 「⚠ 숲에 적 매복 주의」. 동작 줄이기는 페이드만. `tests/danger-alert.cjs`(3화면 큰 글씨·화면 안·덮지 않음·우리 기습은 기존 금빛).

## 인물 소개 오래 머물기·천천히 들고 나기 · 2026-11-11
- 사용자 「소개가 좀 오래 머물게, 들어갈 때도 나갈 때도」: `VN_INTRO_PAUSE`320ms 뒤 `VN_INTRO_FLY`1100ms(이전 0·620)로 날아옴(fill both), 다 쓴 뒤 `VN_INTRO_HOLD`4800ms 머묾(이전 1700), `vnIntroLeave()`가 소개 그림을 무대 자리로 되돌려 날리며(vnImgRect 기준, 오차 ≤1px) .vn-intro.out 1초 페이드 후 vnIntroClose(true)(`VN_INTRO_OUT`1000, 이전 .42초 즉시). `vnIntroTap()`(vnNext가 소개 중 호출): 날아오는 중이면 an.finish+skip(글 전체 즉시), 쓰는 중이면 글 완성+머묾 재시작, 다 보이면 leave, 나가는 중이면 무시. vnIntroHide가 leaving/typing/skip/an 정리. vn-intro 검사 갱신(느린 날기·쓰는 중 누르기=완성·머묾·되돌아 날기·자동 머묾).

## 줄거리 개편: 쫓겨난 왕·현무의 추적·주작의 비밀 지원 · 2026-11-11
- 사용자 「청명의 초반 배신과 쫓겨나 피해 다님, 현무는 추적하며 신념에 의문, 몰래 돕는 주작. 일단 대사와 스토리만」. 정본은 STORY.md 「쫓겨난 왕 · 몰래 내민 손」. 배신자는 운학의 스승 사관장 노헌(초상 없음, 서술·대사로만)+통일파 백륜. 전투 장소·목표·합류·적 진영·선택·생사·반전 위치(c9/x6) 불변, 데이터 필드는 title·brief·pre/post/pov·sceneCast만 바꿨다.
- 다시 쓴 장: c2(「쫓겨난 왕」, 연화 시점 포함)·c3(「추격대가 막은 국경」, 서진 시점)·c7(「몰래 내민 손」, 연화 시점)·x2(「쫓으라는 명령」) 전체. 부분: c1 끝(군적을 스승에게 보냄→금군), c4(서진이 「놓쳤다」·설화·연백을 추격대 명목으로 동행), c5(상금·쫓겨난 왕), c8(「깃발 없는 원군」, 국경 순찰 명목 동행), c9(백륜 첫 대면), c10(「돌아온 왕」, 내쫓은 성을 구함·노헌 자백), x1 끝(칙서 도착), x3(놓아줌·통일파 지원 끊김), x4(강현의 비웃음), x5(「숨겨 준 여왕」·눈감아 줌), x6(쫓던 왕), x9. 운학–단심 갈등은 c7에서 「현무에 넘긴 병사 명단이 청룡 조정에 가면 가족이 위험」으로 바꿨다(c10 명부 사본 후속 그대로).
- ACT_INTRO_Q 2·3막, ACT_INTRO_X 2막, SAGA_ACTS_Q 1·2막(쫓겨난 왕·몰래 내민 손)·X 1막(쫓으라는 명령) 제목, PROLOGUE 3장 자막. 사신기.md는 장별 대사 블록을 데이터에서 다시 만들고 서막·막 서술·전개 구조 동기화. sceneCast에는 각 장의 o_ 화자를 모두 포함. 검사: dialogue-stage·story-death·vn-intro·vn-novel·chronicle·all-goals·admin-menu·prologue·battle-forms.

## 줄거리에 맞춘 전투 규칙: 쫓기는 몸·항복 받기 · 2026-11-11
- 사용자 「다음작업」(줄거리 개편 후속으로 전투도 맞추기). 장 데이터 `exile`(c2~c6=1, c7~c9=2)·`mercy`(c3·x2). formInit이 `exileLv=c.exile||0`·`battleCfg.mercy`를 정하고 reset이 exileLv=0.
- `EXILE`[{inc1,cost1},{inc .6,cost 1.5,'쫓기는 몸'},{inc .8,cost 1.25,'쫓기는 몸 · 주작의 몰래 보급'}]. foodRate(표시·HUD)와 updateEconomy(실제 수입)에 inc를 곱하고, `rcost(r)`가 충원 비용(기존 r.cost 7곳: 버튼 비활성·표시·자동 판단·train). queue에는 낸 값(cost:rcost(r))을 저장해 취소·전멸 반환이 낸 만큼. 레시피 원본은 바꾸지 않는다(재시작 누적 없음).
- mercy: shaken 첫머리에서 적 일반병이 hp0이면 `fled`(항복, 35% 확률로 「항복」 라벨), 적 사기 감소 k×1.6. 승리 조건(rout 3)은 그대로라 더 빨리 무너진다.
- 브리핑 줄 「⚠ 쫓기는 몸…」「🕊 항복 받기」, goalBanner 아래 줄에 효과 문구. 저장 구조 불변. `tests/exile-mercy.cjs`.

## 인물 소개는 평생 한 번 · 2026-11-11
- 사용자 「한 번이라도 나온 인물 소개는 두 번 다시 나오지 않게」. 기존 R.saga.met(이야기별 저장)에 더해 브라우저 전체 기록 localStorage `spiritwar-met-ever-v1`(`metEver`·`metEverAdd`, try/catch). vnIntroCheck가 셋 중 하나라도 있으면 건너뛰고, vnIntroStart가 기록한다. 새 게임·다른 갈래·다른 저장에서도 다시 안 나온다. 검사에서 소개를 다시 보려면 그 키를 지운다(vn-intro는 R.saga.met을 비울 때 함께 지움, 새 게임·다른 갈래 검사 추가).
- hero-traits는 c2(쫓기는 몸)에서 재므로 launchChapter 뒤 exileLv=0으로 특성만 비교한다.

## 거점 단순화·봉화 올리기·레벨업·상점·천하도 새 단장 · 2026-11-11
- 거점 문구 통일(「이름 · 효과」/「세우면 확보(효과)」): 군량소 군량 +8/초, 영맥 기력 2배, 봉화대. 중앙 보급소의 겹친 이름표는 그리지 않는다(군량소 이름표 하나). #tactics 상태 단추 문구도 같다.
- 봉화: `BEACON_CD=4`턴·`beaconAt`(reset −999)·`beaconLeft()`·`beaconFire()`(planning/playing, beacon≥1): 적 전원 `revT=time+AP_TURN`(숨은 적 드러남)·`aidArrive(.5,'beacon')`(원군 절반·체력 +10%·사기 +20·주황 배너). `beaconUI()`가 `#beaconbtn`을 #stage에 만들고 hudStack 왼쪽 쌓기 맨 아래에 둔다. commandAt 첫머리: 봉화대 90 안 탭이면 올림. 조기 경보·증원 미리 보기·매복 흔적은 그대로. `aidArrive(k=1,src)`.
- 레벨: `sagaHero`가 `st{atk,hp,cd}`·`pt`를 채운다(옛 저장은 pt=레벨−1). `gainXp(h,n)`(LV_MAX 20, 레벨마다 pt+1)·`GROW`·`GROW_MAX`8·`growSpend/growReset/growPoints/growStat`·`heroPower`·`openGrowth(id,back)`(back 'close'|'prep:<장>')·`openRoster`. applySagaUnitLevel이 ×(1+.04·수비)·×(1+.03·무력)·`battleCfg.vigor`, skillCd ×(1−.05·지략)(saga 전투만), 군주 지략은 시작 기력 +5. joinHero는 pt=레벨−1.
- 전공: `merit{kills,dead,n0}`(reset·launchChapter), hit 전사 분기 `meritDown(u)`(쓰러진 적은 700 안 가장 가까운 아군 부대 장수의 공, 적장·장수 5), end(true)에서 `meritReport()`→`battleReport{id,rank,kills,mvp}`. `RANKS` S ≤20%·A ≤50% 손실. sagaBattleDone: 출진 c.xp+min(킬×2, c.xp×.5)+수훈 15%(×장비 xp), 대기 30%, 금 보너스. 결과 창 `xpRows(gains)`(div role=button, 창의 첫 button은 #saga-next 유지)·`xpAnimate()`.
- 상점: `SHOP_CATS`·`shopCat`·`shopBody(cid)`(출진 준비 탭 2와 `openShop()` 공용)·`buyItem/sellItem/shopRefresh`·`shopLocked`(ITEMS.act). 새 장비 glaive·scalemail·sealshard(act 2), 보급 ration(food)·manastone(mana0)·herbs(vigor), `SUPPLY_MAX`3. `useSupplies(c)`(launchChapter 끝): 종류마다 1개 소모, `R.saga.supUsed{id,list}`로 재시작·이어하기 때 다시 쓰지 않음, sagaBattleDone 승리 때 삭제.
- 천하도: `</style>` 앞 「천하도 새 단장」 블록(#realm.saga 한정). #rend는 숨김(위쪽 `#rcoin` 금 단추=상점), #rmapwrap::before가 atlas 그림을 흐리게 깔고 drawRealm은 clearRect+지도 그림자, drawSagaMarks 장 표지는 어두운 알약+금테. sagaPanel `.saga-peek.dock`(dk-main·dk-steps·dk-party·dk-side). realmView 계산은 그대로.
- `tests/growth-shop-beacon.cjs`. 저장: R.saga.heroes[id].st/pt, R.saga.supUsed 추가(기본값 채움, 키 불변).

## 원형 메뉴 누르기 씹힘 · 2026-11-11
- 사용자 「여전히 종종 메뉴가 번쩍이며 안 눌림」. 재현: 부대를 고른 직후 0~0.16초에 원형 메뉴 항목을 누르면 휴대폰 11/24·PC 15/24 실패. 원인 ① choose의 카메라 미끄럼(.22초) 동안 ringTick이 메뉴를 매 프레임 따라 옮김 ② 항목 등장 `ringPop`이 transform을 덮어써 .22초 동안 항목이 가운데에서 바깥으로 날아감(누를 자리가 움직이고 번쩍임).
- ringTick: camGlide 중에는 도착 카메라(gx,gy) 기준 자리에 바로 고정, 반올림·3px 미만 변화 무시, `ring.hold`(메뉴 위 pointerdown~pointerup) 동안 위치 고정, --R 값 캐시(`ring.R`). openRing이 ring.x/y/R 초기화. ringPop은 `scale:.82`+투명도만(.14초, transform을 건드리지 않음).
- `tests/ring-tap-glide.cjs`(고른 뒤 0~500ms 터치·마우스 24번 전부 성공, 고치기 전 실패 확인).

## 대화 배경 장소 맞춤 · 2026-11-12
- 사용자 「7장 남화 국경 대화가 왕성 배경」: 줄거리 개편 뒤 배경이 옛 설정으로 남은 장면을 대사 내용으로 다시 고름. c7 pre·post palace→forest(남화 숲 국경), c10 pre palace→frontier(포위된 청룡성 밖), c11 pre→frontier·post→camp(현무 연구소 구출), c13 post→camp(그날 밤 염산), x7 pre→frontier·post→camp. 군주 시점(pov)·c10 post(성 안)·c16·x1 post·x9 pre는 왕성 그대로. 사신기.md 무대 표기 동기화.

## 백호 옷 하양 · 2026-11-12
- 사용자 「백호 인물 일부가 노랑·주황, 흰 옷으로」: 이전 규칙은 갈색·주황 천과 말 탄 인물의 따뜻한 색을 남겨 사율(주황 목도리·누런 말)·호연(갈색 가죽)이 그대로였다. `tools/faction-outfit.py`의 `recolor_bai`: 강현·은랑은 머리 위쪽 비율만 남기고 피부·어두운 외곽선 외 전부 하양(채도×.1, 밝기 .42+.7v), 말 탄 호연·사율은 (2026-11-12 후속 「말은 원래 색으로, 사람 옷만」) 말과 옷 색이 겹쳐 색으로 못 가르므로 `RIDER_POLY`(그림별 사람 몸통 윤곽, 픽셀 fr·fl·br·bl·대화 vn, 걷기 프레임은 같은 방향 윤곽)를 손으로 잡아 그 안만 하양, 진한 빨강 망토·주황 목도리는 윤곽 밖(그림 위 60%, 사율은 `SCARF_X`로 말 머리 쪽 제외)도 하양. 말은 원래 색. `--only bai`로 백호 84장만 다시 만듦. 원본·다른 진영 불변, 되돌리기는 기존대로 FACTION_OUTFIT=false.

## 연대기 화면·장 제목 연출·옛 저장 무시 · 2026-11-12
- 사용자 「청명·현무를 돌아가며, 이전 세이브 무시, 청명|현무 두 칸 장 목록에 연출, 장 대화 전 제목 연출, 골라서 따로 진행 없음, 맞붙을 때 편만 고름」. `CHRON_KEY` v1→`spiritwar-chronicle-v2`(옛 저장 전부 무시). 시작 메뉴의 「예전 저장」 줄 삭제, resumeRealmSave는 CHRON 고정, 부팅 때 저장이 없거나 chron이 아니면 newChronicle. HELP[0] 문구 갱신.
- `openTimeline(o)`({mode:'start'|'step'|'clash'|'view', done, next, onGo, K}): 모달에 `.chron-tl`·`.ctl-cols`(qing·xuan 열, `chronRowsOf`, 창 높이로 행 수 K를 정하고 넘치면 K−1로 다시 그림, 「⋯ 앞/뒤 n장」). 순서: 열·행 등장 → .52초 `stamped`(끝낸 장 `.ctl-seal`「完」) → .98초 SVG `.ctl-link` 붓줄(stroke-dashoffset) → 1.7초 `arrived`(다음 장 빛·문구·단추). 동작 줄이기·view는 즉시. 단추: step/start/view `#chron-go`, clash는 `.chron-pick .chron-side`(chronPick). `chronStep`이 장마다 열고(다른 갈래면 chronSwap 먼저), `chronClash(ids)`=clash 화면, worldIntro 끝·이어하기에서 start. `chronLastId`(sagaBattleDone이 기록). 안내판 「📜 연대기」·메뉴 「사신전기 연대기」.
- `chapterCard(c,then)`(#chapcard, z 95): startChapter→chapterCard→`startChapter0`(옛 본문). 초상·「○○의 이야기」·「제n장」·제목(clip 펼침)·붓선·막·지역, 2.7초 자동(동작 줄이기 1.3초)·누르기/Enter/Esc로 넘김. `CHAPTER_CARD=false`면 바로 대화(dialogue-stage 검사). `tests/timeline-card.cjs`, chronicle 검사 키 v2.
- 2026-11-12 후속(「엑셀 문서 같다, 처음부터 모든 장을 드러내지 말고, 창세기전 2 챕터 진행 참고」): openTimeline을 전체 화면 `#chronscreen`(z 90, 흐린 천하도 바탕)의 두루마리로 다시 만듦. `.cs-strip` 안 `.cs-track`에 CHRONICLE 순서로 x=110+i·S(S=폭/5, 64~104), 위 청룡·아래 현무 y의 `.cs-node`(.done/.now/.was/.clash, `.cs-dot`·`.cs-lab`), 지나온 장과 지금 장만 그린다. SVG `.cs-old`(지나온 길)·`.cs-new`(끝낸 장→지금 장 붓줄)·`.cs-fog`(앞의 안개 점선). 연출: .45초 낙관 → .95초 붓줄+두루마리 이동(translateX, 지금 장이 62%) → 1.7초 지금 장 등장+아래 `.cs-card`(초상·「○○ · 이야기 · 막」·제n장·제목 펼침·brief·#chron-go). clash는 카드에 두 편 `.chron-side`. closeModal이 #chronscreen을 숨기고 비우며, openTimeline은 #rmodal을 닫고 비운다(숨은 결과 창 단추가 다시 눌리던 문제). timeline-card(드러난 장 수 1·2·5)·chronicle 검사 갱신.
- 2026-11-12 후속2(「챕터를 세로로, 궤적은 생략」): 두루마리를 세로로. `.cs-track`이 CHRONICLE 순서 i마다 y=top+18+i·S(S=(높이−44)/5.5, 40~64), x는 청명 10%·서진 55% 칸. SVG 붓줄(cs-old·cs-new·cs-fog) 제거, 이동은 translateY(지금 장이 60% 높이). 칸 머리 `.cs-lanes`는 위쪽 고정, 폭 최대 640 가운데. 가로 화면은 왼쪽 두루마리·오른쪽 카드. 카드 등장은 scale(.96)(translateY는 선택 창에서 4px 넘침). 연출 순서(낙관 .45→내려감 .95→지금 장 1.65초)는 그대로. timeline-card는 붓줄 0개·세로 순서를 검사.
- 2026-11-12 후속3(「호연 색이 말과 겹친다」): 호연은 갑옷·말이 같은 갈색이라 RIDER_POLY 몸통을 칠하면 말 목·안장까지 흰 얼룩이 생겼다. `CAPE_ONLY={'hoyeon'}`는 윤곽 없이 위 60%의 빨강 망토만 하양으로, 나머지(갑옷·말)는 원래 색. 사율은 그대로.

## 진영색 행군 먼지 · 2026-11-12
- 사용자 「부대가 이동할 때 뒤에 고유 색 흙먼지, 청룡 파랑·주작 빨강」. `TRAIL_COL`{qing #4fa6ff, zhu #ff5a3c, xuan #3c4a6a, bai #f6f2e6, gui #9a6ad8}·`TRAIL_ON`. `unitFac(u)`: 적은 battleCfg.faction(없으면 tintFaction), 아군은 부대 장수(groupLeaderId)의 characterInfo faction, 군주·없으면 갈래 진영. `trailTick(u,dt,dx,dy,sp)`를 facingFromMotion의 footfall 옆에서 실제 이동(sp≥MOVE_FACE)일 때 호출: 초당 병사 3.2·장수 6·기병 9개(속도/40 배, 최대 1.6), 진행 반대쪽 18(기병 34) 뒤에 fx dust `tr:1`·col. 화면 밖·건물·수레·rReduced 제외, `trailN`(drawGroundFx가 매 프레임 세어 다시 맞춤) 260 상한. drawGroundFx가 tr이면 진영색 덩어리 3개+흰 하이라이트(알파 .62)로 그린다. 판정·저장 불변. `tests/faction-trail.cjs`.
- 2026-11-13 후속(「흙먼지 더 크고 잘 보이게」): 반지름 (13+p·28)×s(이전 11+22), 크기 병사 .72·장수 .95·기병 1.25, 수명 .85/기병 1.1초, 알파 .72에서 줄어듦, 아래에 어두운 그림자(.3)를 깔아 바닥과 대비. 더 키운 시험(18+34, 알파 .85)은 부대가 파란 구름 덩어리처럼 덮여 버렸다.

## 이동 탄력: 출발·물결·정렬 · 2026-11-13
- 사용자 「부대 이동을 감칠맛·찰지게」→ 제안 1(출발·정지 탄력)·2(물결 출발)·6(도착 정렬) 선택. 모두 그림만, 판정·저장 불변. `MOVE_BEAT`(false면 끔)·`BEAT_GO`.2·`BEAT_STOP`.28·`BEAT_SET`.34·`BEAT_LAG`.22.
- `moveBeat(u,dt,sp)`(facingFromMotion에서 sp 계산 직후): 자기 걸음(`u.moving`, .15초 유지 `ownT`)+화면 속도≥MOVE_FACE를 「이동 중」으로, 0.08초 이상 꺼져야 정지로 본다. 정지 .25초 이상 뒤 출발이면 `goT`(웅크림 lag + 튀어 나감 .2초)와 `lag`=장수와 거리/320×.22(+.04, 기병 최대 .14, 장수 0), 이동 .35초 이상 뒤 정지면 `stopT`·`beatSq`. `mvAcc` 기본값 9(턴 시작부터 출발 연출). `beatTimers`(facingFromMotion 첫머리)가 타이머를 줄이고, 부대(side:g)에 이동 중인 병사가 하나도 없고 막 선 병사가 있으면 전원 `setT`(같은 순간)·대상 없으면 vback=false(정면). 출발 시차는 rx 저역통과를 lag 동안 멈춰 그림 위치만 붙잡는다(최대 약 11px, 40 넘으면 기존대로 즉시 맞춤).
- `beatPose(u)`(soldier 안쪽 변환에 x·y·회전·배율 곱, playing/paused에서만): 웅크림 y×.91·뒤로 .07rad, 튀어 나감 y×1.08·앞으로 .12rad·위 4px, 정지 앞쏠림 .13rad·앞 5px, 정렬 y×.9 내려앉았다 원래대로. 장수는 이동량 1.25배. settleBattleVisuals가 타이머 초기화·mvAcc 9. `tests/move-beat.cjs`(출발·정지 수, 먼 병사 시차 > 가까운 병사, 부대별 정렬 동시, 4단계 자세, 그림만 붙잡음, 계획 중 중립, 동작 줄이기 끔).

## 명령 손맛 · 2026-11-13
- 사용자 「3번 명령 손맛도」. `CMD_CUE`(false면 끔)·`CMD_SHOUT`(행동 종류→말풍선 문구)·`CMD_FLAG`(move·retreat·sneak·garrison·ambush·fire·water)·`CMD_HIT`(attack·engage·charge·lure). apConfirm 첫머리 `cmdCue(g,a)`: 부대원 `cmdAt`=지금+장수와 거리/320×140ms(최대 140), 장수 `shout{text,t,hit}`, 지점이 있으면 `ap.cmdFlag{x,y,t,hit}`. 모두 performance.now 기준이라 계획 중(시간 정지)에도 움직인다.
- `cmdPose(u,o)`: soldier가 beatPose 결과에 곱한다(계획 중에도 적용). .38초: 앞 28% 웅크림 y×.89, 뒤 72% y×1.07·위 8px(장수 1.25배). `drawCmdFx()`(drawStratGround 뒤, 지면층): 깃발이 .22초 동안 위에서 떨어져 꽂히고 착지 순간 눌림, 지면 물결 고리+점 6개, 1.1초부터 .5초 페이드(1.6초에 null). 이동 계열 금색 ▲, 공격 계열 붉은 ⚔. `drawCmdBubbles()`(drawSquadFlags 직전, upright): 장수 머리 위 둥근 말풍선(글씨 14/viewScale를 15~38로), 튀어나오며 커졌다 제자리, .95초부터 페이드, 1.3초에 삭제. 동작 줄이기면 움찔·낙하·튀어나옴 없음(말풍선·깃발은 정지 상태로 표시). 판정·AP·저장 불변. `tests/command-cue.cjs`.

## 장수 일러스트 4방향 요청(요청 10) · 2026-11-13
- 사용자 「모든 전장 캐릭터 움직임·상하좌우를 대화 모드 그림 기준으로, 도트 폐기」 → 대화 일러스트는 한 방향 한 장뿐이라 선택지 중 「그림 요청서만 작성」. ART_REQUESTS 요청 10: 20명×3방향(60장, `<이름>-<방향>.png`) + 걷기 4칸 시트 20명×4방향(80장, `<이름>-<방향>-walk.png`). 넣을 경로 `characters/illust/dir/<이름>/<방향>.webp`·`characters/illust/walk/<이름>/<방향>-1..4.webp`. 그림이 오면 흰 배경 제거·높이·발 위치·진영색 사본을 만들고 장수 그림을 일러스트로 교체·PIXEL_LEADERS를 끈다. 그 전까지 게임은 도트 그대로(현무 4명 일러스트 시험은 사용자 요청으로 되돌림, 2075c39).

## 장수 일러스트 4방향 연결(요청 10) · 2026-11-14
- 사용자 지시: 작업 브랜치 `art/request-10-standing-20`, **명시적 요청 전에는 main에 병합하지 않는다**(이 작업은 위 자동 병합 규칙의 예외). 걷기 시트는 만들지 않고 코드로.
- 원본: `art-requests/request-10-standing/exports/<이름>/<이름>-<방향>.png`(보병 256, 기병 호연·사율·비연 384, 명세 exports/manifest.json). 상위 폴더 1254 원본은 보존용. `tools/illust-leaders.py`가 해시 확인 후 인물마다 네 방향 알파 합집합+2px 상자로 잘라 `characters/illust/dir/<이름>/<fr|fl|br|bl>.webp`(무손실, 4.5MB)를 만들고 `ILLUST_META={이름:[발x비율,발선y비율,머리위y비율]}`·`ILLUST_CAV` JS 한 줄을 출력한다(그림을 바꾸면 다시 실행해 index.html의 그 줄을 교체). 귀왕 발선은 명세대로 y=223.
- 게임: `ILLUST_LEADERS`(주소 `?pixel=1`이면 false, 옛 도트·fc 경로 그대로)·`loadIllust`(loadDirArt에서, 켜져 있으면 도트 dir/walk 로드 생략)·`illustOf(src)`(walkKey로 방향)·`drawIllust(il,x,y,w,h,dark)`: 머리~발 = h×`ILLUST_BODY`(1, 즉 91.2), 발 기준점을 x+w/2·y+h에, 변환 a<0이면 되뒤집어 반전 없음, 보간 high. drawCompanionArt(id 있을 때만, 무명 병사 제외)·drawUnitArt 군주/적장이 맨 앞에서 사용. 흑화는 `illustDark` 캔버스. fcSrc(재채색) 미적용.
- 코드 걸음: vmT>0·보병·동작 줄이기 아님이면 머리~발의 아래 24%를 발 x에서 좌우로 나눠 엉덩이 선 기준 전단(발끝 ±`ILLUST_STRIDE`.05×몸높이×sin(stp·π))과 디딤 발 들기(`ILLUST_LIFT`.03) 두 조각+몸통 한 조각. 기병은 1장. hasWalk는 보병 장수 true(soldier 코드 도약 작게), 기병 false.
- 검사 `tests/illust-leaders.cjs`. 옛 도트 경로 검사 8개(battle-size·cast-deployment·dir-art·leader-walk·leader-facing·pixel-leaders·faction-outfit·sprite-anim)는 URL에 `?pixel=1`을 붙여 연다. 대화·인물첩·천하도 그림은 불변.
- 그림 방향 의심(반전 금지라 그대로): mujin·heukcheol·yeonbaek fr이 왼쪽을 보는 듯, bai-ruler·baekryun fr은 fl과 거의 같은 정면.

## 현무 서막·관리자 갈래 이동 · 2026-11-14
- `PROLOGUE_X` 3장(story/xuan-prologue-{1-north-gate,2-seal-research,3-dawn}.webp). `openPrologue(done,list)`: list 없고 done 없으면(메뉴 「서막 다시보기」) PROLOGUE+PROLOGUE_X 6장, done 있으면 PROLOGUE. `prologue.list`로 쪽수·끝 판정. `chronStep`이 현무로 넘어간 뒤 `xuanIntroDue()`(ROUTE xuan·현무 완료 0·`storyState().xintro` 없음)면 PROLOGUE_X 뒤 연대기 화면. worldIntro는 현무로 시작하면 두 서막을 이어 재생. xintro는 story에 새 불린(옛 저장은 없음=아직 안 봄, 현무 완료가 있으면 안 나옴).
- 관리자 메뉴: `#admin-route`(청명/현무)·`fill(r,sel)`(SAGA_Q/X 목록)·`jump(id,route)`·`build(route,index,bond)`(앞선 판 재구성, 옛 jump 본문)·`swap()`(천하도에서 chronSwap, 진행 그대로)·`bondOf()`. CHRON이면 jump가 CHRONICLE에서 그 판 앞 항목들의 다른 갈래 id 수만큼 다른 갈래를 build해 R.twin(chron)으로 붙인다. restore는 백업의 saga.route로 resumeRealmSave. tests/xuan-prologue-admin.cjs, chronicle·timeline-card는 현무 서막을 한 번 거친다.

## 땅에 붙은 건물 → 서 있는 그림 · 2026-11-14
- 사용자 「일부 건물이 여전히 땅에 붙은 그림」. 찾은 것: 보급소(서·동·본진, drawSupplySites가 지면층에 사각형·삼각형), 영맥(작은 마름모), 귀왕 외 적 거점(납작한 판+집), 목표 구조물(c10 유도 깃발·c15 관문·x10 북문이 보라색 「귀」 판에 「귀문 · undefined 증원」 글자).
- hdOn()이면: draw의 objs에 보급소 `drawDepotSite`(supply-depot, 확보 시 초록 깃발)·영맥 `drawSpiritStone`(gui-prop-talisman 2번 칸 비석+확보 시 빛)을 깊이 정렬로 넣고 지면층 도형은 그리지 않음. 보급소 글씨 y−172. drawCitadel은 `<faction>-outpost`가 없으면 ally-keep(폭 330)+진영 깃발 둘. drawGate 첫머리 `drawObjective(u)`(u.objective): 「깃발」이면 talisman 1번 칸(높이 190)+빛, 그 밖은 pass-gate(폭 250), 체력 막대·「목표 · 이름 n%」. HD가 없을 때의 옛 그림도 글자는 고침. 판정·충돌 불변. `tests/structure-art.cjs`.
- 남은 것: c10 가운데 유도 깃발이 군량소 자리와 겹친다(목표 위치 GOAL_SPOTS center = 군량소 근처, 기존 배치).

## 이동 속도 1.5배 · 2026-11-14
- 사용자 「이동속도와 거리를 좀 더 시원하게 1.5로」: `MARCH_SPEED` 1.6→2.4. 계획 apAdd의 AP당 거리도 u.speed를 쓰므로 함께 1.5배. 사거리·턴 길이·간격 불변.
- 후속: 붕괴 후퇴(아군 m.fall)에서 처음 거리 `u.routD0`보다 80 넘게 멀어지는 병사는 멈춤(막힌 길 옆걸음으로 711px 달아나던 것, no-flee 272). facingFromMotion `MOVE_EMA` 8→12, `MOVE_LOCK` .55→.45, 빠른 이동 좌우 `MOVE_LOCK_FAST`.3·앞뒤 `MOVE_LOCK_BACK`.35(이전 앞뒤는 빠르면 잠금 없음, 깜박임 .219→.149, 좌우 불일치 2.09→1.37%). battle-forms 야전은 「양쪽 체력 감소+전사 합 >0」으로(적이 빨리 와 3턴 적 전사 0이 나옴).
- 전체 84개 중 asset-library(이전 속도에서도 실패, 기존 문제)만 실패. vn-intro는 동시 실행 부하로 가끔 실패, 단독 통과.

## 아군 부대 전멸 클로즈업·소식 · 2026-11-14
- 원인: battleImpactTick의 부대 알림은 체력 35% 이하에서 「위기」를 한 번 내고 armed로 막아(55% 넘게 회복해야 풀림) 이어진 전멸은 알리지 않았다. 
- battleImpactTick 끝: `B.live`(살아 있는 아군 squad의 중심·대표 유닛·g)를 매 틱 기록, 기록된 squad에 살아 있는 유닛이 없으면 `squadWiped(sq,info)` 한 번(`B.wiped`, 군주 부대 g0 제외 — 군주 전사는 패배). say 「○○ 부대 전멸」, cine.last 무시하고 `cineEvent(...,4)`(그 자리 클로즈업·슬로우), battleImpactEmit '전멸'(띠, 우선순위 9, 게이트 무시), powerBanner 붉은 「✖ ○○ 부대 전멸」. `WIPE_CUE=false`면 기록만. reset이 battleImpacts를 새로 만들어 초기화. `tests/squad-wipe.cjs`.

