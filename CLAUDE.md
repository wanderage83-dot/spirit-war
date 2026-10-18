# 청룡전기 / 사신의 천하 — 작업 안내

귀여운 동양 판타지 전술 게임. 빌드 도구·의존성 없는 **정적 HTML 단일 파일** 게임이다.
기능 목록은 `README.md` 참고.

## 파일
- `index.html` — 게임 전체(HTML·CSS·JS). 약 640줄이지만 한 줄이 수천 자인 압축형 코드라 실제 분량은 약 150KB.
- `hero.webp`, `shield.webp`, `bow.webp`, `horse.webp`, `spear.webp` — 병종 일러스트. `artSrc(type)`가 `./<type>.webp`로 불러온다.
- `README.md` — 플레이어용 기능 목록. 기능을 바꾸면 함께 고친다.

## index.html 구조 (줄 번호는 대략)
| 줄 | 내용 |
|---|---|
| 1–59 | `<style>` — 마을·전장·천하 화면 CSS. `@media(max-width:800px)`가 모바일 대응 |
| 60–62 | 마크업: `header`, `#stage`(캔버스·오버레이·패널), `#battlefooter`(부대 카드·명령 버튼) |
| 64–103 | **마을(버들마을)**: `drawTown`, `townClick`, `openTown`(병영·보급 등 건물 패널), `changeLoadout`, `departTown`(출진) |
| 104–180 | **전장 기본**: 상수(`WW/WH=2400`, `KEEP`·`CITADEL`·`GRANARY`·`SPIRIT`·`BEACON`, `ROADS`, `ROUTES`), `WEATHER_FX`, 지형(`terrainAt`), 길찾기(`buildBlock`·`findPath`·`navStep`), `stats`·`makeUnit`·`reset` |
| 181–245 | 웨이브 `events`, UI(`ui`·카드), 진형(`formation`·`faceOrder`), 명령(`order`·`commandAt`), 도술(`cast`·`resolveSpell`), 카메라·포인터·키보드 입력 |
| 246–300 | **전투 시뮬레이션**: `acquire`(표적), `update`(이동·충돌·투사체), `attackDamage`(측면·배후·방패·창진 보정), `performAttack`, 타격 효과, `showResult`, `RAIDS`·`launch` |
| 301–320 | 경제·생산(`updateEconomy`, `train`, `recipes`), 미니맵, `tacticsUI`, 시야(`computeVision`) |
| 321–420 | **렌더링**: `background`, 구조물(`drawKeep`·`drawCitadel`·`drawBeacon`…), 유닛(`drawUnitArt`·`soldier`), `drawFog`, `draw`, `drawMinimap`, `drawWeather` |
| 421–434 | **작전 모드**(일시정지 지시): `beginPlanning`, `resumeCombat`, `advancePhase`, `phaseUI` |
| 436–633 | **사신의 천하(전략 화면)**: `FACTIONS`·`PROV0`(15개 지역)·`OFF0`(장수)·`POOL0`, 저장(`saveRealm`/`loadRealm`), 지도(`buildRealmRaster`·`drawRealm`), 명령(`doAct`·`diplo`), 출진(`openMarch`·`commitMarch`·`autoResolve`), 턴(`endSeason`·`aiTurn`·`loyaltyTurn`·`defect`), 실시간 전투 연결(`launchRealmBattle`·`realmBattleDone`), `showRealm`·`bootRealm` |
| 634–642 | 적 색조, `loop`(requestAnimationFrame 메인 루프), 초기화 호출 |

## 핵심 상태
- `state`: `'realm'`(천하) → `'village'`(마을) → `'ready'` → `'playing'` ↔ `'planning'`(작전 모드) / `'paused'` → `'ending'` → `'over'`
- 전장 데이터: `units`(모든 유닛, `side` 0=아군 1=적, `type`: hero·shield·bow·horse·spear·boss·keep), `groups`(아군 5개 부대), `shots`, `fx`
- `stats[type] = [체력, 공격력, 이동속도, 사거리, 공격간격]`, 전역 피해 배율 `DMG`
- 천하 데이터: 전역 `R`(연도·계절·금·군량·지역·장수·외교). `localStorage`의 `spiritwar-realm-v1`에 저장한다.

## 작업 원칙
- **단일 파일을 유지한다.** 파일 분리, 프레임워크, 번들러, npm 의존성을 넣지 않는다.
- 기존 압축 스타일(짧은 이름, 한 줄에 여러 문장)을 따른다. 고친 부분만 바꾸고 전체 재포맷은 하지 않는다.
- 줄이 매우 길다. 편집 전에 `grep -o`로 고칠 부분을 찾고, 문맥이 유일하게 맞는 짧은 문자열로 교체한다.
- **세로 모바일 화면에서도 확인한다**(터치 드래그·핀치, 800px 이하 레이아웃).
- 천하 저장 구조(`R`)를 바꾸면 이전 저장본과의 호환성을 고려한다. `loadRealm`에서 기본값을 채우거나 `SAVE_KEY` 버전을 올린다.
- 게임 내 문구는 한국어로 쓴다.
- 기능을 추가하거나 바꾸면 `README.md`에도 반영한다.

## 확인 방법
빌드가 없다. `python3 -m http.server`로 띄워 브라우저에서 연다(Playwright·Chromium 사용 가능). 수정 후 최소한 콘솔 오류가 없는지 확인한다.
