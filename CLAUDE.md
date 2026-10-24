# 청룡전기 / 사신전기 — 작업 안내

귀여운 동양 판타지 이야기 중심 SRPG. 빌드 도구·의존성 없는 **정적 HTML 단일 파일** 게임이다.
기능 목록은 `README.md` 참고.

## 파일
- `index.html` — 게임 전체(HTML·CSS·JS). 한 줄이 수천 자인 압축형 코드로 약 280KB.
- 그림: 루트 `hero/shield/bow/horse/spear.webp`(병종), `portraits/`(군주·장수 초상), `characters/`(장수 전투 그림), `terrain/`(지면·환경 오브젝트).
- `README.md`(플레이어용 기능 목록, 기능을 바꾸면 함께 고친다), `STORY.md`(세계관·인물·기승전결), `HANDOFF.md`(인수인계 기록).

## 게임 구조 — 창세기전식 이야기 중심 SRPG
천하도(장 진행 지도) → 출진 준비(편성·장비·상점) → RPG식 대화 → 15초 AP 동시 전투(부대별 순차 계획 → 실행 → 자동 정지) → 대화·선택 → 보상 → 막이 끝나면 기억 의식. 줄 번호는 자주 바뀌므로 아래 심볼 이름으로 `grep -o` 해서 찾는다.

| 영역 | 주요 심볼 |
|---|---|
| 장 진행 | `SAGA`(13장: `pre`/`post` 대화, `choices`, `join`/`joinAfter`, `item`, `capital`, `fallen`, `final`), `SAGA_ACTS`, `ACT_INTRO`, `newSaga`, `openChapter`(편성·장비·상점 탭), `startChapter`, `launchChapter`, `sagaBattleDone`, `sagaAfterChapter`, `sagaRitual` |
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
- 천하: 전역 `R`(`provs`, `story`, `saga`, `over`). `localStorage`의 `spiritwar-saga-v1`(청명)·`spiritwar-saga-xuan-v1`(현무), 각각 `-manual`(수동)에 저장. `R.saga.route`가 갈래.

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
