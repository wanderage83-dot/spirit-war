# 청룡전기 / 사신전기 — 작업 안내

왕인 전쟁과 네 나라의 동맹을 그리는 동양 판타지 SRPG. 빌드 도구·의존성 없는 **정적 HTML 단일 파일** 게임이다.
기능 목록은 `README.md` 참고.

## 파일
- `index.html` — 게임 전체(HTML·CSS·JS). 한 줄이 수천 자인 압축형 코드로 약 280KB.
- 그림: 루트 `hero/shield/bow/horse/spear.webp`(병종), `portraits/`(군주·장수 초상), `characters/`(장수 전투 그림), `terrain/`(지면·환경 오브젝트).
- `README.md`(플레이어용 기능 목록, 기능을 바꾸면 함께 고친다), `STORY.md`(세계관·인물·기승전결), `사신기.md`(청명16판·현무10판의 전체 대사·군주 시점·선택·결말), `HANDOFF.md`(인수인계 기록, 맨 위가 최신).

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
