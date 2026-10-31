# 청룡전기 / 사신전기 — 작업 안내

> **클로드 인수인계 시작점:** [CLAUDE_HANDOFF.md](CLAUDE_HANDOFF.md)를 먼저 읽는다. 2026-10-31의 현재 상태·규칙·검증·남은 실기 확인을 한 문서로 정리했다. 기준 게임 커밋은 `a1389f1`이다.
>
> 아래 구현 이력 중 오래된 설명은 최신 변경으로 대체됐다. 현재는 **대화 배경5장/322줄,큰 초상 우선,15초 AP,보병320·기병360 장수 반경,한글 UI,진영색만 식별**이다. 머리 위 진영 배지·아군/적군 접두어·원/마름모 구분·기억 희생은 복원하지 않는다.


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

- 공통 턴 길이는 `AP_TURN=15`. `attackRange`가 고지 궁병+20%를 계획/실전 모두 적용한다. `apStart` 예약 AP 차감과 `apStrike`의 자동 공격 차감을 중복하지 않는다. 빈 시간에는 잔여 AP로 제자리 자동 공격하며 주둔 중에는 공격하지 않는다.
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
- `BATTLE_LAYOUTS`6패턴:farmland(버들골/주작),pass(현무/빙설/흑수/염산/귀왕),marsh(동해/남화),plain(백호/서량/망자),canyon(모래/혼령),bridges(청룡만). 초반3장 서로 다른 패턴. bridges는 중앙 다리1개+서쪽 여울, 우천 시 W/E 진군로 모두 중앙으로 돌아감.
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
- UNIT_SPACING 보병100/112·기병118/128,unitSeparation 같은부대90/108·장수116,다른부대124~140,양군접전52(기병56/방패76공격유지). 충돌격자는144로유지.
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
