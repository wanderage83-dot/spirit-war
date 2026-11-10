# 그림 요청서

프로그램은 Claude Code, 일러스트는 ChatGPT가 맡는다. 이 문서에 요청을 적고, 그림이 완성되면 아래 **경로 그대로** 저장소에 커밋한다. 커밋된 그림은 Claude가 게임에 연결하고 이 문서의 상태를 ✓로 바꾼다.

## 공통 규칙

- **화풍**: 지금 전장 캐릭터와 같은 귀여운 SD(이등신~삼등신) 애니메이션 일러스트. 깨끗한 짙은 갈색 외곽선, 부드러운 셀 셰이딩, 밝은 채도. 사진풍·3D 렌더·도트는 안 된다.
- **참고 그림**(같은 저장소): `horse.webp`(기병), `characters/biyeon.webp`(비연), `characters/dansim.webp`(단심), `terrain/pine.webp`(소나무). 이 그림들과 나란히 놓았을 때 같은 게임처럼 보여야 한다.
- **배경**: 완전 투명(알파). 그림자·바닥·테두리·글자·로고를 넣지 않는다.
- **시점**: 살짝 위에서 본 3/4 옆모습, **오른쪽을 향함**(왼쪽은 게임에서 뒤집는다).
- **구도**: 대상 하나만, 바퀴 아래가 그림 맨 아래에서 3~5% 위에 오게 하고 좌우 여백은 5% 안팎.
- **파일**: PNG로 만들어 WebP(무손실 또는 품질 90 이상, 투명 유지)로 저장. 캔버스 **1024×768**.
- 사람은 그리지 않는다(수레를 끄는 동물은 그린다). 게임에서 병사들이 곁을 지킨다.

---

## 요청 1 · 호송 수레 3종 — 상태: ✓ 완료(2026-10-31, 게임 연결)

전투 승리 조건 「호송」에 쓴다. 수레가 길을 따라 움직이고, 적이 노리고, 목적지에 닿으면 이긴다. 게임 화면에서는 기병 한 명보다 조금 큰 크기로 보인다.

| 파일 경로 | 쓰는 장 | 내용 |
|---|---|---|
| `characters/props/cart-engineer.webp` | 본편 6장 · 끊긴 다리의 휴전 | 백호 공병대 수레 |
| `characters/props/cart-refugee.webp` | 본편 8장 · 약속을 지키는 원군 | 주작 피난민 수레 |
| `characters/props/cart-supply.webp` | 현무편 9장 · 원군의 약속 | 청룡성 보급 수레 |

### 1-1. 백호 공병대 수레 `cart-engineer.webp`

> Cute chibi SD anime-style game prop, transparent background, three-quarter side view facing right, slightly from above. A sturdy wooden engineering cart pulled by one small stocky white-and-grey ox. The cart carries stacked bridge planks, coiled ropes, a brass winch with gears, wooden mallets and toolboxes. Brass fittings and goggles hung on a hook — White Tiger kingdom inventor style (white, steel grey, brass, small tiger-stripe cloth). Clean dark-brown outlines, soft cel shading, bright but not neon colors, matching the style of cute chibi RPG units. No people, no ground, no shadow, no text. 1024×768.

- 색: 흰색·강철 회색·황동, 작은 호랑이 줄무늬 천.
- 짐: 다리 널빤지, 밧줄, 황동 도르래·톱니, 망치, 공구함.

### 1-2. 주작 피난민 수레 `cart-refugee.webp`

> Cute chibi SD anime-style game prop, transparent background, three-quarter side view facing right, slightly from above. A modest wooden refugee cart with a red cloth canopy, pulled by one small brown pony. Loaded with cloth bundles, rice sacks, a small pot, a child's rag doll and a paper lantern tied to the side — Vermilion Bird kingdom colors (red, warm orange, gold trim, simple). Looks lived-in and a little worn, warm and sympathetic, not grim. Clean dark-brown outlines, soft cel shading, matching cute chibi RPG units. No people visible, no ground, no shadow, no text. 1024×768.

- 색: 붉은 덮개·주황·금빛 테두리. 낡았지만 따뜻한 느낌.
- 짐: 보따리, 쌀자루, 냄비, 헝겊 인형, 종이 등.

### 1-3. 청룡 보급 수레 `cart-supply.webp`

> Cute chibi SD anime-style game prop, transparent background, three-quarter side view facing right, slightly from above. A military supply cart of the Azure Dragon kingdom pulled by one small dark-bay horse. Neatly stacked rice sacks and wooden crates with a blue-green banner with a simple dragon motif on a short pole, rope lashings, a spare wheel on the side. Colors: teal, blue-green, dark wood, silver fittings. Clean dark-brown outlines, soft cel shading, matching cute chibi RPG units. No people, no ground, no shadow, no text. 1024×768.

- 색: 청록·푸른 녹색·짙은 나무색·은빛 장식, 용 문양 깃발.
- 짐: 쌀자루, 나무 상자, 예비 바퀴.

### 확인 기준

- [ ] 세 장 모두 투명 배경, 1024×768, 오른쪽을 향함
- [ ] 위 참고 그림과 같은 화풍(SD, 외곽선, 셀 셰이딩)
- [ ] 바퀴가 그림 아래쪽에 닿아 있고 잘린 곳이 없음
- [ ] 사람·글자·그림자 없음
- [ ] 위 경로 그대로 커밋

### 전달 방법

ChatGPT에서 세 장을 만든 뒤 위 경로에 저장해 커밋하거나, 이 대화에 이미지를 올려 주면 Claude가 같은 경로로 넣는다. 들어오면 Claude가 2단계(호송 규칙, 적이 수레를 노리는 행동, c6·c8·x9 적용, 검사)를 진행한다.

---

## 요청 3 · 장수 4방향(45도 앞·뒤 × 좌·우) — 상태: 완료 (2026-11-04)

청명 기존 3장을 유지하고 나머지 19명×3장=57장을 추가했다. 이 클라우드 서버에서는 sprite-gen 설치와 Codex 로그인 확인까지 성공했으나, Codex CLI의 `/home/agent/.codex/generated_images`가 읽기 전용이라 생성이 실패했다. 따라서 Codex 내장 이미지 생성 도구로 원본을 참고한 투명 4방향 시트를 만들고, 필요한 세 방향만 추출해 기존 `tools/pixelize.py`(64px·40색·외곽선·4배 nearest)로 변환했다. 좌우 반전으로 대체하지 않았고 기마 장수 3명은 말도 포함했다. 그림 등록은 기존 `tools/dir-ready.py`로 갱신했으며 게임 로직은 변경하지 않았다. `tests/dir-art.cjs`(60장 로딩·방향 선택), `tests/pixel-leaders.cjs`, JavaScript 구문 검사와 이미지 규격 검사를 통과했다.

장수급 20명은 전투에서 도트 그림으로 나오며, 원본 그림이 바라보는 앞쪽 한 방향 외에 **세 방향을 따로 그려** 뒤집기 없이 쓴다. 파일은 `characters/pixel/dir/<원본이름>/<fr|fl|br|bl>.webp`(앞-오른쪽·앞-왼쪽·뒤-오른쪽·뒤-왼쪽), `index.html`의 `DIR_READY={이름:'fl,br,bl'}`에 등록한다. 원본이 오른쪽을 보면 fl·br·bl, 왼쪽을 보면(흑철·무진·귀왕·주작 군주) fr·br·bl을 만든다.

### 내 컴퓨터에서 한 번에 만들기 (sprite-gen + ChatGPT/Codex 로그인)
```bash
git clone https://github.com/aldegad/sprite-gen ~/sprite-gen
```
```bash
cd ~/sprite-gen && python3 -m venv .venv && .venv/bin/pip install -e .
```
```bash
cd ~/spirit-war && git pull && SG=~/sprite-gen bash tools/make-dir-views.sh
```
- 아직 없는 그림만 그린다(현재 20명 모두 완료되어 기본 실행은 건너뜀). 일부만: `... make-dir-views.sh dansim hoyeon`. 마음에 안 드는 것만 다시: `FORCE=1 ... make-dir-views.sh dansim`.
- 끝나면 `tools/dir-ready.py`가 `index.html`의 `DIR_READY`를 실제 파일에 맞춰 고친다. 원본은 `~/sg-dir/<이름>/`에 남는다. 확인 뒤 `git add characters/pixel/dir index.html && git commit -m "장수 4방향 그림" && git push`, 또는 Claude에게 「올렸다」고 말한다.
- 기마 장수(비연·호연·사율)는 말까지 같은 방향으로 그리게 한다. 흑철은 원본이 도보라 말 없이 그린다.

### Canva로 만드는 순서
1. 원본 전장 그림을 PNG로 바꿔 Canva에 올리고 참고 그림으로 `generate-image`(3:2). 프롬프트: 같은 캐릭터를 해당 45도 방향에서 본 전신, 같은 옷·무기·머리·색·SD 비율, 흰 단색 배경, 그림자·바닥·글자 없음. 기마 장수는 같은 말도 같은 방향.
2. Canva 배경 제거는 유료라 쓰지 않는다. 작업용 디자인(1054×816 페이지) 맨 위에 3:2 그림 세 장을 351×234로 나란히 놓고 PNG(가로 2108, 더 크면 거부됨)로 내보낸다.
3. `python3 -I tools/canva-sheet.py 시트.png <이름> fl,br,bl` → 세 장을 잘라 `tools/unwhite.py`(테두리와 이어진 흰색+어두운 테두리 안의 흰 구멍만 투명) → `tools/pixelize.py`로 저장.
4. `DIR_READY`에 등록, `node tests/dir-art.cjs <URL>`.

| 이름 | 상태 |
|---|---|
| hero(청명) | ✓ fl·br·bl (2026-11-04) |
| 나머지 19명 | ✓ 각 3방향, 총 57장 추가 (2026-11-04) |

이전 Canva 작업 참고 기록(현재 요청은 완료, 재개할 필요 없음):
- 군주: xuan-ruler `MAHZ8h9MELM`(나머지 군주·biyeon은 미업로드)
- dansim `MAHZ8llCk_4`(fl은 이미 생성: `MAHZ8rVIQ7Y`), hoyeon `MAHZ8noem_Y`, mukcheol `MAHZ8mG1Y3c`, unhak `MAHZ8uoYCdY`, baekryun `MAHZ8gUp_2U`
- dogyeom `MAHZ8hzcI-Y`, eunrang `MAHZ8lkJ_u8`, haerin `MAHZ8mEzUX0`, heukcheol `MAHZ8ghjoyk`, hongyeom `MAHZ8nXIu3E`
- mujin `MAHZ8k5nss4`, sayul `MAHZ8mOCLiE`, seolhwa `MAHZ8jppUpU`, yeonbaek `MAHZ8gi5QBE`
- 기마 그림은 biyeon·hoyeon·sayul만. heukcheol 원본은 도보이므로 말 문구를 넣지 않는다.
- 작업 디자인 페이지 크기가 1054가 아니어도 세 칸을 가로 1/3씩(높이는 그 2/3) 맨 위에 두면 canva-sheet.py가 비율로 자른다.

(이전 방식·참고) 뒷모습 한 장을 뒤집어 쓰는 `BACK_READY`/`characters/pixel/back/`과 sprite-gen 스크립트도 남아 있다. 4방향 그림이 있으면 그쪽이 우선한다.

```bash
# sprite-gen 설치(요청 2와 같음) 후, spirit-war 폴더에서
SG=~/sprite-gen bash tools/make-back-views.sh            # 20명 전부
SG=~/sprite-gen bash tools/make-back-views.sh hero mukcheol   # 일부만
```

- 결과는 `characters/pixel/back/<이름>.webp`(도트 변환까지 자동). 원본과 **같은 좌우 방향**의 뒤쪽 대각선으로 그린다(흑철·무진·귀왕·주작 군주는 왼쪽).
- 다 되면 `index.html`의 `BACK_READY=[]`에 이름을 넣거나 Claude에게 「뒷모습 올렸다」고 말한다. 목록에 없는 이름은 불러오지 않는다.
- 얼굴·무기·색이 원본과 다르면 그 이름만 다시 실행한다.

## 요청 2 · 전장 동작 시트(sprite-gen) — 상태: 게임 연결 준비 완료, 그림 대기

지금 전장 캐릭터는 그림 한 장을 코드로 늘이고 기울여 걷기·공격을 흉내 낸다. [sprite-gen](https://github.com/aldegad/sprite-gen)(Apache-2.0)으로 같은 그림에서 **대기·걷기·공격 프레임**을 만들면 게임이 그대로 재생한다. 그림 생성은 사용자 계정(Codex/ChatGPT 로그인 등)으로 사용자 컴퓨터에서 돌린다.

### 게임 쪽 약속 (이미 구현됨)

- 위치: `characters/anim/<이름>/manifest.json` + 시트 그림. `<이름>`은 원본 전장 그림의 파일 이름(확장자 제외)이다. 예: `characters/factions/seolhwa.webp` → `characters/anim/seolhwa/`.
- 게임은 manifest의 `frame_layout.rows`(프레임 사각형)와 `animation.rows`(fps)만 읽는다. 시트 파일 이름은 manifest의 `sprite_sheet_alpha`를 따른다.
- 동작 이름: `idle`(반복), `walk`(반복, 없으면 `run`), `attack`(공격 0.68초 동안 한 번). 다른 동작은 무시한다.
- 크기·위치는 **idle 첫 프레임의 몸 높이와 발**을 지금 그림에 맞춘다(장수 91.2·병사 49.4). 그래서 모든 프레임은 **같은 칸 크기·같은 발 기준선**이어야 한다(`align_y: bottom`).
- 적 세력색·흑화 장수 색·왼쪽을 보는 그림 반전은 게임이 원래 그림과 똑같이 입힌다. 시트는 원본 그림과 **같은 방향**으로 만든다.
- 다 만들면 `index.html`의 `ANIM_READY=[]`에 이름을 넣는다(또는 Claude에게 「○○ 시트 올렸다」고 말한다). 목록에 없는 이름은 불러오지 않는다.

### 만드는 법

```bash
# 한 번만: 설치 (Python 3.11+)
git clone https://github.com/aldegad/sprite-gen && cd sprite-gen
python3 -m venv .venv && .venv/bin/pip install -e .

# 캐릭터 하나 (예: 청명 = hero.webp)
R=$HOME/sg-runs/hero
.venv/bin/sprite-gen prepare --out-dir $R --character-id hero \
  --base-image /경로/spirit-war/hero.webp --request /경로/request-hero.json
.venv/bin/sprite-gen gen-set --run-dir $R --provider codex
.venv/bin/sprite-gen extract --run-dir $R
.venv/bin/sprite-gen compose-atlas --run-dir $R
.venv/bin/sprite-gen compose-gif --run-dir $R --out-dir $R/previews   # 움직임 눈으로 확인

# 게임에 넣기: WebP로 줄이고 manifest의 시트 이름을 바꾼다
mkdir -p /경로/spirit-war/characters/anim/hero
cwebp -lossless $R/sprite-sheet-alpha.png -o /경로/spirit-war/characters/anim/hero/sheet.webp
sed 's/"sprite_sheet_alpha": "[^"]*"/"sprite_sheet_alpha": "sheet.webp"/' $R/manifest.json \
  > /경로/spirit-war/characters/anim/hero/manifest.json
```

`request-hero.json` 예시(인물마다 `action` 문장만 바꾼다):

```json
{
  "cell": { "size": 256 },
  "states": {
    "idle":   { "frames": 4, "fps": 4,  "loop": true,  "action": "standing guard, subtle breathing, cape and hair sway" },
    "walk":   { "frames": 6, "fps": 10, "loop": true,  "action": "marching walk cycle, legs alternate clearly, weapon held steady" },
    "attack": { "frames": 4, "fps": 10, "loop": false, "action": "windup, sword slash forward, follow-through, recover; no detached effects" }
  },
  "fit": { "align_x": "foot-centroid", "align_y": "bottom" },
  "style": "same cute chibi SD anime style and outline as the base image, transparent background, facing the same direction as the base"
}
```

- 기병(`horse.webp`, 호연·사율·비연·흑철)은 말 다리가 잘리지 않게 `"cell": { "width": 320, "height": 256 }`.
- 공격 동작 문장: 방패병 「shield bash then short sword thrust」, 궁병 「draw bow, release, lower bow」, 창병 「spear thrust forward and pull back」, 기병 「rider leans forward, lance thrust while horse lunges」, 군주·적장 「two-handed weapon slash」.
- 프레임마다 얼굴·무기가 달라지면 `sprite-gen curation`에서 빼거나 다시 생성한다. 움직임 확인은 `previews/` GIF로 한다.

### 순서와 대상 (24개)

| 순서 | 이름(`characters/anim/<이름>/`) | 원본 그림 | 비고 |
|---|---|---|---|
| 1 시험 | `hero` | `hero.webp` | 청명. 먼저 하나 만들어 게임 화면에서 확인한 뒤 나머지를 진행 |
| 2 | `shield`, `bow`, `spear`, `horse` | 루트 `*.webp` | 이름 없는 병사 전원. 효과가 가장 크다(적은 세력색이 자동으로 입혀짐) |
| 3 | `mukcheol`, `unhak`, `dansim`, `biyeon`, `hoyeon` | `characters/*.webp` | 청룡·동료 |
| 4 | `xuan-ruler`, `bai-ruler`, `zhu-ruler`, `gui-ruler` | `characters/*-ruler.webp` | 군주·귀왕. `zhu-ruler`·`gui-ruler`는 왼쪽을 보는 원본 그대로 |
| 5 | `seolhwa`, `yeonbaek`, `dogyeom`, `eunrang`, `sayul`, `hongyeom`, `haerin`, `heukcheol`, `mujin`, `baekryun` | `characters/factions/*.webp` | 다른 나라 장수·적장. `heukcheol`·`mujin`은 왼쪽을 보는 원본 그대로 |

용량: 256px 칸 × 14프레임 WebP 무손실은 대략 150~400KB다. 24개 모두면 모바일 첫 로딩이 늘어나니, 2단계까지 넣은 뒤 실제 로딩 시간을 보고 나머지를 정한다.

---

## 요청 4 · 병사 4방향(45도 앞·뒤 × 좌·우) — 상태: 완료 (2026-11-04)

### 완료 결과 (Codex)
- `shield.webp`·`bow.webp`·`spear.webp`·`horse.webp`를 각각 참고 그림으로 첨부하고 아래 프롬프트로 fl·br·bl을 개별 생성했다. 총 12장, 투명 배경의 SD 일러스트이며 도트 변환·좌우 반전을 사용하지 않았다.
- 원본과 방향별 결과를 나란히 비교해 투구·의상·무기·방향·전신과 무기 손을 검수했다. 검은 오른손, 방패와 활은 왼손을 유지하며 창은 원본의 양손 잡기를 유지한다. 궁병 뒷방향 2장은 원본보다 다리가 길어 다시 생성하고 짧은 다리와 큰 머리 비율로 수정했다. 기병은 같은 말과 기수가 함께 돌아간다.
- 원본 생성 PNG는 작업 서버 `/workspace/soldier-directions/<병종>-<방향>.png`에 보관했다(이 경로는 Git에 포함되지 않음). `python3 tools/soldier-dir.py /workspace/soldier-directions/*.png`로 게임에 넣어 `characters/soldier-dir/<병종>/<fl|br|bl>.webp` 총 12장(높이 384px, 투명, 품질 92)을 저장하고 `SOLDIER_DIR_READY`를 자동 갱신했다.
- `node tests/soldier-dir.cjs http://127.0.0.1:8799/`: **PASS, 12 registered**. 등록 그림 로딩·방향 선택·뒤집기 상쇄·적군 진영색·미등록 병종 원본 동작 검사 통과.
- `node tests/dir-art.cjs http://127.0.0.1:8799/`: **PASS, 장수 60장**. JavaScript 구문·`git diff --check`·12장 투명도/높이/필수 방향 검사도 통과.
- 원본 병사 4장과 기존 장수 그림은 유지했다. `index.html`은 `SOLDIER_DIR_READY` 목록만 변경했으며 렌더러·전투 로직·테스트 코드는 수정하지 않았다. 작업 브랜치는 `claude/pensive-hawking-pekoel`, main에는 병합하지 않는다.

전장 병사 4병종(방패병·궁병·창병·기병)도 장수처럼 4방향을 따로 그린 그림으로 바꾼다. 지금 그림(`shield.webp`·`bow.webp`·`spear.webp`·`horse.webp`)은 모두 **앞-오른쪽(fr)** 이므로 **앞-왼쪽(fl)·뒤-오른쪽(br)·뒤-왼쪽(bl)** 세 장씩, 총 **12장**을 만든다. 적군은 게임이 같은 그림에 진영색을 입혀 쓰므로 따로 그리지 않는다. 병사는 장수와 달리 도트로 바꾸지 않고 지금 그림과 같은 SD 일러스트로 둔다.

### 공통 규칙
- **원본 그림을 꼭 첨부**한다. 같은 병사의 다른 각도여야 한다(얼굴·투구·옷·무기·색·비율 동일).
- 화풍: 귀여운 SD(이등신) 애니메이션 일러스트, 짙은 갈색 외곽선, 부드러운 셀 셰이딩. 사진풍·3D·도트 금지.
- 배경 **완전 투명**(안 되면 흰 단색). 그림자·바닥·글자·테두리 없음. 한 명만, 전신, 발(말발굽) 아래가 잘리지 않게.
- 45도 대각선 시점, 살짝 위에서. **좌우를 뒤집은 그림 금지**: 무기를 든 손이 원본과 같은 손이어야 한다.
- 파일 이름: `<병종>-<방향>.png` (예: `spear-fl.png`, `horse-bl.png`).

### 붙여 넣을 프롬프트 (원본 1장 첨부 + 아래 한 줄씩, 방향 3번 반복)

방향 문구(아래 `{방향}` 자리에 넣는다):
- **fl** → `turned to face the viewer's LEFT: front three-quarter view at 45 degrees, face and chest visible, looking toward the lower left`
- **br** → `seen from behind at a 45-degree back diagonal, body turned away from the viewer toward the upper RIGHT, back of the head visible`
- **bl** → `seen from behind at a 45-degree back diagonal, body turned away from the viewer toward the upper LEFT, back of the head visible`

기본 문장:
> The same soldier as the attached image, {방향}. Full body, same face, helmet, armor, clothes, weapon, colors and cute chibi SD proportions as the reference; the weapon stays in the same hand as in the reference (do not mirror the character). {병종 문장} Clean dark-brown outlines, soft cel shading, bright colors. Single character only, transparent background, no shadow, no ground, no text, nothing cropped.

병종 문장(`{병종 문장}` 자리):
- **shield** (`shield.webp`, 방패병) → `Blue-and-gold samurai-style armor with a white plume, a large blue tower shield with a gold turtle emblem in one hand and a short sword in the other, sturdy guarding stance.`
- **bow** (`bow.webp`, 궁병) → `Green hooded cloak with gold trim, brown hair, a large curved wooden bow held in one hand and a quiver of white-feathered arrows on the back, light ready stance.`
- **spear** (`spear.webp`, 창병) → `Pale jade conical helmet with a white plume, teal scarf, light scale armor, a long spear with a red tassel held upright, alert stance.`
- **horse** (`horse.webp`, 기병) → `A rider in a tiger-hood helmet and orange-gold armor holding a curved sabre, riding the same small white-and-brown pony with jade harness; the whole pony is visible and faces the same direction as the rider.`

예) 창병 뒤-왼쪽 = `spear.webp` 첨부 + 「The same soldier as the attached image, seen from behind at a 45-degree back diagonal, body turned away from the viewer toward the upper LEFT, back of the head visible. Full body, … Pale jade conical helmet … alert stance. Clean dark-brown outlines, …」

### 확인 기준
- [x] 12장 모두 원본과 같은 병사로 보임(투구·색·무기)
- [x] 방향이 맞음: fl은 얼굴이 왼쪽 아래, br/bl은 뒤통수가 보이고 각각 오른쪽/왼쪽 위로 향함
- [x] 무기 손이 원본과 같음, 전신·발 안 잘림, 배경 투명

### 게임에 넣기
```bash
python3 tools/soldier-dir.py 받은폴더/*.png
```
- 흰 배경이면 자동으로 지우고, 그림 영역으로 잘라 높이 384px로 맞춰 `characters/soldier-dir/<병종>/<방향>.webp`에 저장한 뒤 `index.html`의 `SOLDIER_DIR_READY`를 자동으로 고친다. 이후 `git add characters/soldier-dir index.html` → 커밋 → 푸시, 또는 Claude에게 「올렸다」고 말한다.
- 게임 쪽(`soldierDirOf`·`tinted`)은 이미 구현됨: 그림이 있는 병종만 방향 그림을 쓰고(뒤집지 않음), 적군은 같은 그림에 진영색을 입혀 쓴다. `node tests/soldier-dir.cjs <URL>`.

---

## 요청 5 · 병사 걷기 프레임(4방향 × 4동작) — 상태: 완료 (2026-11-04)

### 완료 결과 (Codex)
- 표의 각 방향 정지 그림을 각각 참고 이미지로 첨부하고 위 요청의 프롬프트로 4병종×4방향, 총 16개 가로 시트를 생성했다. 각 시트는 2172×724px, 동일 너비 543px의 4칸이며 투명 배경이다. 병사는 SD 일러스트를 유지하고 도트 변환·전체 좌우 반전을 사용하지 않았다.
- 정지 그림과 나란히 비교해 병사·방향·무기 손·전신을 검수했다. 1·3번이 같은 발을 내딛던 초안은 이미지 생성 도구로 해당 다리 동작을 다시 그렸고, 기병도 앞다리 동작을 교대하도록 수정했다. 무기 끝이 칸 경계에 닿던 시트, 배경/그림자가 남은 수정본, 모은 다리의 발이 떠 있던 시트도 다시 생성·보정했다.
- 네 칸의 등분·투명도·빈 칸·실루엣 잘림을 검사하고 시트를 직접 비교했다. 공통 상자 안에서 몸 중심을 유지하며, 땅선의 미세한 생성 편차는 최종 384px 프레임 기준 최대 5px(48px로 표시할 때 약 0.63px)이다. 2·4번의 몸이 조금 높아지는 보행 동작은 유지한다.
- 최종 시트 PNG는 작업 서버 `/workspace/soldier-walk-sheets/<병종>-<방향>.png`에 보관했다(서버 로컬 경로로 Git에 포함되지 않음). `python3 tools/soldier-walk.py /workspace/soldier-walk-sheets/*.png`를 실행해 `characters/soldier-walk/<병종>/<방향>-1..4.webp` **64장**을 저장했다. 각 세트는 공통 잘라내기 상자·동일 크기·높이 384px·투명 WebP(품질 92)이며 `SOLDIER_WALK_READY`가 자동 갱신됐다.
- `node tests/soldier-walk.cjs http://127.0.0.1:8800/`: **PASS, 16 registered**. 64프레임 로딩·걸음 위상별 순환·방향 선택·뒤집기 상쇄·적군 색상·멈추면 정지 그림·도약 감소 검사 통과.
- `node tests/soldier-dir.cjs http://127.0.0.1:8800/`: **PASS, 12 registered**. 이미지 규격/필수 파일/투명도 검사, JavaScript 구문 검사, `git diff --check`도 통과했다.
- 정지 원본 4장과 기존 방향 그림 12장을 보존했다. `index.html`은 `SOLDIER_WALK_READY` 등록 목록만 변경했고 전투 로직·렌더러·도구·테스트는 수정하지 않았다. `SOLDIER_WALK_FOOT`는 기존 자동 발 기준점을 그대로 사용한다. 작업 브랜치 `claude/pensive-hawking-pekoel`에 커밋·푸시하며 main에는 병합하지 않는다.

지금 병사는 그림 한 장을 위아래로 튀겨 걷는 흉내만 내서 다리가 움직이지 않는다. 4병종(방패병·궁병·창병·기병) × 4방향(fr·fl·br·bl)마다 **걷기 4동작을 한 줄로 그린 시트 1장**, 총 **16장**을 만든다. 게임은 실제로 걸은 거리에 맞춰 1→2→3→4를 돌리고(두 걸음에 한 바퀴), 멈추면 지금의 정지 그림으로 돌아간다. 적군은 같은 그림에 진영색을 입힌다. 장수 20명은 병사 결과를 본 뒤 정한다.

### 참고 그림(꼭 첨부)
| 병종 | fr(앞-오른쪽) | fl(앞-왼쪽) | br(뒤-오른쪽) | bl(뒤-왼쪽) |
|---|---|---|---|---|
| 방패병 shield | `shield.webp` | `characters/soldier-dir/shield/fl.webp` | `.../shield/br.webp` | `.../shield/bl.webp` |
| 궁병 bow | `bow.webp` | `characters/soldier-dir/bow/fl.webp` | `.../bow/br.webp` | `.../bow/bl.webp` |
| 창병 spear | `spear.webp` | `characters/soldier-dir/spear/fl.webp` | `.../spear/br.webp` | `.../spear/bl.webp` |
| 기병 horse | `horse.webp` | `characters/soldier-dir/horse/fl.webp` | `.../horse/br.webp` | `.../horse/bl.webp` |

해당 방향의 정지 그림 1장을 첨부한다(방향이 이미 맞는 그림이라 각도를 다시 설명할 필요가 적다).

### 공통 규칙
- **한 장에 4동작을 가로 한 줄로**, 같은 너비 4칸(예: 2048×640이면 칸마다 512). 칸 사이 선·숫자·글자 없음.
- 네 칸 모두 **같은 크기·같은 땅선(발바닥 높이)·같은 위치**. 몸이 칸 안에서 옮겨 다니지 않고 제자리에서 걷는다(트레드밀처럼).
- 첨부 그림과 같은 병사·같은 방향·같은 옷·무기·무기 든 손·색·SD 비율. 좌우 반전 금지.
- 배경 **완전 투명**(안 되면 흰 단색). 그림자·바닥 없음. 발·말발굽이 잘리지 않게.
- 파일 이름: `<병종>-<방향>.png` (예: `spear-fl.png`).

### 붙여 넣을 프롬프트(정지 그림 1장 첨부 + 아래 문장)
> A 4-frame walk cycle sprite sheet of the same soldier as the attached image, facing exactly the same direction as the attached image. Four poses in ONE horizontal row, equal-width cells, no borders, no gaps, no text, no numbers. Frame 1: right foot forward touching the ground, left foot back. Frame 2: passing pose, legs together under the body, body slightly higher. Frame 3: left foot forward touching the ground, right foot back. Frame 4: passing pose, legs together, body slightly higher. The character walks in place: same size, same position and the same ground line in every cell, only the legs, arms and cloth move. {병종 문장} Same face, helmet, armor, weapon in the same hand, colors and cute chibi SD proportions as the reference; do not mirror. Clean dark-brown outlines, soft cel shading. Transparent background, no shadow, no ground, nothing cropped.

`{병종 문장}`:
- **shield** → `He keeps the large tower shield raised in front and the short sword in the other hand while marching.`
- **bow** → `She carries the bow in one hand, the quiver stays on the back, the cloak sways with each step.`
- **spear** → `He holds the long spear upright while marching; the red tassel and scarf sway with each step.`
- **horse** → `The pony walks with a four-beat walk (Frame 1: near front leg forward, Frame 2: legs gathered, Frame 3: far front leg forward, Frame 4: legs gathered); the rider bobs gently with the pony and keeps the sabre raised. The whole pony is visible.`

### 확인 기준
- [x] 16장 모두 4칸·같은 너비, 칸마다 땅선·몸 위치 검수(미세 편차는 완료 결과에 기록)
- [x] 1·3번이 서로 반대 발 앞, 2·4번이 모은 다리(기병은 앞다리가 번갈아 나옴)
- [x] 정지 그림과 같은 병사·방향·무기 손, 투명 배경, 잘림 없음

### 게임에 넣기
```bash
python3 tools/soldier-walk.py 받은폴더/*.png
```
- 4칸으로 나누고(흰 배경이면 칸마다 지움), 네 칸 공통 상자로 잘라 같은 배율로 높이 384px에 맞춰 `characters/soldier-walk/<병종>/<방향>-1..4.webp`로 저장, `index.html`의 `SOLDIER_WALK_READY`를 자동 갱신한다.
- 게임 쪽(`walkFrameOf`·`hasWalk`·`SOLDIER_WALK_FOOT`)은 이미 구현됨. 넣은 뒤 `node tests/soldier-walk.cjs <URL>`. 발 위치가 어긋나면 Claude가 눈으로 재서 `SOLDIER_WALK_FOOT`에 넣는다.

### 장수 걷기(2026-11-04) — 코드로 생성 완료
Canva 크레딧이 없어 `tools/pixel-walk.py`로 장수 20명×4방향×4동작(320장)을 도트 그림에서 직접 만들었다(다리 띠를 엉덩이 축으로 흔듦). 다리가 크게 보이는 손그림 프레임을 원하면 같은 경로(`characters/pixel/walk/<이름>/<방향>-1..4.webp`, 원본 도트와 같은 크기)에 덮어쓰면 된다.


---

## 요청 6 · 전투 필드 지형·건물 다시 그리기(HD-2D 도트 디오라마) — 상태: 29파일 연결, 귀왕 외 4진영 12지역 공통 HD 적용(2026-11-07), 진영별 확장 제작 보류

### 최신 사용자 결정 · 귀왕 외 공통 사용 (2026-11-07)
- 청룡·현무·주작·백호는 지금 만든 청룡 HD 그림과 보조 색을 공통으로 사용한다. 아래의 진영별 신규 바닥·소품·현무 건물 제작 계획은 보류한다. 사용자 재요청 전에는 그 계획대로 추가 제작하지 않는다.
- `HD_ART_REGIONS`는 귀왕 영토를 뺀 12지역이다. 귀왕성·혼령곡·망자벌은 기존 잿빛 지형/소품을 유지한다. 다른 전장에 등장하는 귀왕군 거점과 귀문은 이미 만든 전용 그림을 계속 쓴다.
- 지역별 강·길·협곡·고지·숲 배치, 충돌·경로·날씨 판정은 유지했다. 청룡성의 예전 다리 돌 둑 띠도 공통 HD 물가 질감으로 바꿨다. 천하도·대화·인물·병사는 이번 공통화 대상이 아니다.
- `tests/hd-common.cjs`는 12개 공통 지역/3개 귀왕 예외, 15지역의 그림 유무에 따른 충돌·경로 보존, 물가 질감 실제 그리기, 모바일 세로·가로/PC 화면을 검사한다. `tests/hd-terrain.cjs`의 청룡성 HD 기대값도 공통 정책에 맞췄다.

### 청룡 시험 세트 전달 (Codex · 2026-11-06)
- 권장 순서 1의 `qing-ground.png`, `qing-road.png`, `qing-prop-bamboo-clump.png`, `qing-house.png`, `ally-wall.png`를 `terrain/hd/`에 추가했다. 대숲 파일은 512×512 네 칸의 변형 시트(2048×512)다. 나머지 진영과 종류는 아직 만들지 않았다.
- 아래 영어 프롬프트와 공통 문장으로 새로 생성했다. 타 게임 화면을 참고 이미지로 첨부하지 않았다. 큰 바위가 있던 바닥, 집의 잘린 발밑, 성벽의 지나치게 완만한 방향, 배경이 남은 대숲, 반복 시 길 자국이 어긋나던 초안은 수정·재생성했다.
- 문서에서 허용한 도트/색상 정리와 같은 방식으로 BOX 축소·40색 제한·nearest 4배 확대를 적용했다. 바닥은 1024×1024 불투명 PNG, 세운 물체는 투명 PNG이며 캔버스와 발밑 여백을 맞췄다. 상세 크기·시트 자르기 좌표는 `terrain/hd/README.md` 참고.
- 규격·40색 이하·4×4 도트 격자·바닥 불투명/소품 이진 알파·대숲 네 칸·잘림/발밑 여백을 검사했다. 바닥은 2×2 반복 미리보기로 시각 검수했다. 실제 브라우저 PNG 로딩/디코딩도 검사했다.
- **게임 연결은 하지 않았다.** `index.html`·렌더러·판정·충돌·길찾기·천하도·대화·인물·병사 파일은 수정하지 않았다. 버들골에서 휴대폰 기준 크기·각도·빛·타일 반복·성벽 연결점을 Claude가 확인한 뒤 나머지를 같은 화풍으로 확장한다. 전체 요청 6 완료나 실기 검수 완료로 취급하지 않는다.
- 요청 6이 실제로 올라온 브랜치는 `ccr-fa9b3dba-6er4z1`이다. 이번 시험 세트도 그 브랜치에 커밋·푸시하며 main에는 병합하지 않는다.

### 버들골 연결 결과 (Claude · 2026-11-07)
- `HD_ART_REGIONS=['beodeul']`인 전장에서만 쓴다. 다른 지역은 지금 그림 그대로다. 판정·충돌·길찾기·지형 마스크는 그림과 무관하게 같다(`tests/hd-terrain.cjs`가 그림을 빼고 다시 만들어 비교).
- **바닥**: HD 지역은 배경을 2400px(한 점=월드 2)로 그린다. 그림 4px 한 칸이 배경 한 점, 타일 한 장이 월드 512다. 휴대폰 확대 0.45~1.2에서 이음새가 보이지 않았다. 덤불·들판 칸은 그 위에 진영색을 옅게 덮는다. 성 안 마당도 길 질감으로 깐다.
- **길**: `qing-road.png`는 양쪽 x=8~36·988~1016에 진한 세로 띠가 있어 반복하면 줄무늬가 생긴다. 게임은 가운데 x=40~984만 잘라 반복한다. **다음 그림은 띠 없이 전체가 길 표면이어야 한다.**
- **대숲**: 기존 나무 자리(크기 r)에 높이 r×5.4(약 120~160, 병사 2.5~3.5명)로, 칸마다 줄기 밑끝 x(282·254·168·242)를 발 위치로 놓는다. 앞을 가리면 투명해지는 처리는 기존과 같다. 바위는 아직 옛 그림.
- **집**: 본진·군량소·시설·적 거점이 모두 이 집 그림을 쓴다(폭 = 기존 집 폭×1.5, 발밑 y=744). 건설 중 시설은 반투명. 본진·적 거점 전용 그림이 오면 나눠 쓴다.
- **성벽**: 그림 속 벽 아랫선 기울기가 −0.34인데, 게임 바닥 축은 **±0.707(35° 정등각)**이다. 요청서에 「2:1 dimetric」이라고 잘못 적은 탓이다. 지금은 그림을 세로로 기울여(전단) 각도를 맞추고 벽 길이 약 400마다 한 조각씩 이어 붙인다(앞벽 1·1, 옆벽 2·2, 뒷벽 3). 세로로 가는 벽(오른쪽 위로 오르는 방향)은 그대로, 가로로 가는 벽은 좌우 반전 그림을 쓴다. 기울인 탓에 벽돌이 약간 비스듬하고, 모서리는 조각이 맞닿기만 한다. **다음 성벽·목책·절벽은 아래 「바로잡은 각도」로 다시 그려야 한다.**

### 바로잡은 각도 (2026-11-07, 성벽·목책·절벽처럼 땅을 따라 이어지는 조각)
- 게임 투영은 **정등각(true isometric)**: 땅의 두 축이 화면에서 각각 오른쪽 아래·왼쪽 아래 35.26°(기울기 0.707, 가로 1.414 : 세로 1)로 보인다. 2:1 등각(26.57°)이 아니다.
- 이어 붙이는 조각은 **벽 아랫선이 왼쪽 아래에서 오른쪽 위로 기울기 0.707**(35°)로 오르게 그리고, 양 끝을 잘라 같은 그림을 끝과 끝이 맞닿게 반복할 수 있게 한다. 반대 방향은 게임이 좌우 반전한다(빛이 오른쪽 위로 바뀌니, 원하면 반대 방향을 따로 그려도 된다).
- 프롬프트에 넣을 문장: `true isometric projection (35.26° — the wall's base line rises from lower left to upper right with a slope of 0.707, i.e. 1 pixel up for every 1.414 pixels across), no perspective`.
- 모서리 조각(`ally-wall-corner.png`: 바깥 모서리, 두 벽이 직각으로 만나는 기둥)도 함께 그리면 연결이 깔끔해진다.
- 집·나무·탑처럼 혼자 서 있는 물체는 각도가 조금 달라도 괜찮다(지금 그림 그대로 쓴다).

전투 필드 배경만 다시 그린다. **천하도·대화 무대·인물·병사·효과는 그대로**다. 목표 느낌은 「도트 그림으로 만든 미니어처 디오라마」다. 도트 질감의 땅·풀·돌 위에 부드러운 빛과 그림자, 가장자리의 이끼와 풀, 층층이 쌓인 바위 절벽이 있다. 참고 그림(사용자가 보여 준 화면)은 **느낌을 말로 옮기는 데만** 쓰고, 그 게임의 화면을 첨부해 베끼게 하지는 않는다(남의 게임 그림을 닮은 결과가 나오면 쓸 수 없다).

게임에는 이미 틸트시프트(위아래 흐림)·색 보정·가장자리 어둠·빛 번짐이 있다(`HD`, 「효과 켬/끔」). 그래서 **그림 자체에는 흐림·안개·비네트를 넣지 않는다.** 선명한 그림을 받아 게임이 흐리게 만든다.

### 게임 쪽 약속(그림이 맞춰야 하는 것)
- **바닥 질감**은 **바로 위에서 내려다본 정사각형**으로 그린다. 게임이 이것을 마름모(등각)로 눕혀 깐다. 원근·기울기·그림자 방향이 없어야 하고, 네 변이 이어지는 **이음새 없는 반복 타일**이어야 한다.
- **세워진 물체**(나무·바위·집·성벽·탑·문)는 **등각 시점**으로 그린다. 위 30도에서 내려다보는 2:1 등각 투영이고, 지붕과 정면이 함께 보인다. 원근 소실점이 없다. 물체 하나만 **투명 배경**에 그리고, 발밑(바닥에 닿는 면)이 그림 맨 아래에서 3% 위에 오게 한다. 바닥 그림자는 게임이 그리므로 넣지 않는다.
- 빛은 **모든 그림이 같은 방향**이다. 왼쪽 위에서 오는 따뜻한 해, 오른쪽 아래에 그늘.
- 크기: 전투 화면에서 병사는 휴대폰에서 키 30~50px로 보인다. 집 한 채는 병사 6~8명 높이, 나무는 병사 3~5명 높이 정도.
- 도트: 그림의 한 점(도트)이 화면 4×4px 크기라고 생각하고 굵은 도트로 그린다. 받은 그림은 `tools/pixelize.py`로 색 수·도트 크기를 다시 맞출 수 있으니 조금 매끈해도 괜찮다.
- 5진영 색: **청룡**(청록 기와, 푸른 강, 대숲, 초록 들), **현무**(눈, 검푸른 성곽, 설송, 회청색 돌), **백호**(황토, 사암, 마른 풀, 황동), **주작**(붉은 단풍, 붉은 기와, 따뜻한 흙, 검은 화산석), **귀왕**(잿빛 돌, 보랏빛 그늘, 고사목, 부적, 묘비).

### 공통 문장(모든 프롬프트 끝에 붙인다)
> Style: high-detail pixel art with an HD-2D diorama feel — crisp chunky pixel textures (each art pixel reads as a 4×4 block), a limited palette of about 40 colors per image, soft volumetric sunlight from the upper left, gentle ambient occlusion in crevices, warm rim light on edges, moss and grass tufts along stone edges, a handcrafted miniature-set look. Clean and sharp: no depth-of-field blur, no fog, no vignette, no bloom, no text, no logo, no UI, no characters or soldiers.

### A. 바닥 질감(위에서 본 반복 타일) — 진영 5 × 7종, 각 1024×1024 PNG
> A seamless tileable top-down ground texture, viewed straight down at 90 degrees with no perspective and no cast shadows, 1024×1024, edges tile perfectly on all four sides. {바닥 종류} {진영 색}. [공통 문장]

바닥 종류(`{바닥 종류}`):
1. `ground` → `Plain packed earth with short grass patches and tiny pebbles.`
2. `road` → `A worn dirt road surface with wheel ruts and scattered flat stones (texture only, the road fills the whole tile edge to edge, no curbs, no darker border strips at the sides).`
3. `field` → `Open meadow / farm field with soft tall grass and small wildflowers.`
4. `bush` → `Dense undergrowth: bamboo shoots, ferns and low shrubs packed together, seen from above.`
5. `stone` → `Paved courtyard of irregular flagstones with moss in the joints.`
6. `water` → `Calm shallow river water seen from above, with soft ripples and a few submerged stones.`
7. `snowice` / `sand` / `ash` → 진영에 맞는 특수 바닥: 현무 `Packed snow with blue-tinted ice patches.`, 백호 `Wind-rippled sand with dry grass.`, 귀왕 `Grey ash soil with cracked dark earth.`, 청룡·주작은 `Muddy marsh with reeds and puddles.`

진영 색(`{진영 색}`):
- 청룡 `qing` → `Palette: fresh greens, teal, jade, cool river blue.`
- 현무 `xuan` → `Palette: snow white, slate blue, dark navy stone, pale frost.`
- 백호 `bai` → `Palette: ochre loess, warm sandstone, dry straw yellow, brass accents.`
- 주작 `zhu` → `Palette: crimson and orange autumn leaves, warm red-brown soil, black volcanic stone.`
- 귀왕 `gui` → `Palette: ash grey, muted violet shadows, bone white, desaturated dead grass.`

파일 이름: `<진영>-<종류>.png` (예: `zhu-field.png`, `xuan-snowice.png`).

### B. 자연 소품(세워진 물체, 등각 시점) — 진영별, 각 512×512 투명 PNG, 같은 종류 4가지 변형
> A single {소품} standing alone, isometric view from 30 degrees above (2:1 dimetric, no vanishing point), base touching the bottom 3% of the canvas, transparent background, no ground shadow. Make 4 slightly different variations side by side on a 2048×512 sheet with clear transparent space between them. {진영 색}. [공통 문장]

소품(`{소품}`):
- 청룡: `bamboo clump`, `weeping willow`, `river reeds`, `mossy boulder`
- 현무: `snow-covered pine tree`, `frozen rock with icicles`, `snowy shrub`, `iron ore rock`
- 백호: `layered sandstone rock`, `dry steppe bush`, `lone poplar tree`, `brass gear scrap pile`
- 주작: `red maple tree`, `tea bush row`, `black basalt rock with glowing red cracks`, `stone lantern`
- 귀왕: `dead twisted tree`, `leaning grave marker`, `talisman pole with paper charms`, `cracked ruin pillar`

파일 이름: `<진영>-prop-<영어 이름>.png` (예: `gui-prop-dead-tree.png`).

### C. 절벽·능선(타일처럼 이어 붙이는 벽) — 진영별 512×512 투명 PNG
> A short straight segment of a layered rock cliff wall, true isometric projection (35.26° — the base line rises from lower left to upper right with a slope of 0.707), no perspective, the top surface covered with {진영 윗면} and the cliff face showing stacked rock strata, designed so that copies placed side by side along the diagonal join seamlessly. Transparent background. {진영 색}. [공통 문장]

진영 윗면(`{진영 윗면}`): 청룡 `grass and ferns`, 현무 `snow`, 백호 `dry grass on sandstone`, 주작 `red leaves and moss`, 귀왕 `ash and dead grass`. 파일 이름 `<진영>-cliff.png`, 같은 문장으로 모서리용 `<진영>-cliff-corner.png`도 한 장(「an outer corner piece of the same cliff」).

### D. 건물(등각 시점, 투명 배경) — 크기는 아래 표
공통 앞문장:
> A single {건물}, isometric view from 30 degrees above (2:1 dimetric, no vanishing point), East-Asian fantasy architecture with curved tiled roofs, base touching the bottom 3% of the canvas, transparent background, no ground shadow, no people. {진영 색}. [공통 문장]

| 파일 이름 | 캔버스 | `{건물}` 문장 |
|---|---|---|
| `<진영>-house.png` | 768×768 | `small village house with a curved tiled roof, wooden walls and a stone base` |
| `<진영>-house-long.png` | 1024×768 | `long farmhouse with a storage shed and stacked firewood` |
| `ally-keep.png` | 1024×1024 | `fortified command hall of the player's army: a two-storey keep with a large curved roof, banners and a stone platform` (청룡 색) |
| `ally-wall.png` | 1024×512 | `straight section of a stone fortress wall with crenellations and a wooden walkway, designed to tile end to end; true isometric projection: the wall's base line rises from lower left to upper right with a slope of 0.707 (35.26°)` (청룡 색) — 시험본은 기울기 0.34라 게임이 기울여 쓰는 중 |
| `ally-tower.png` | 512×1024 | `wooden watchtower with a small tiled roof and an archer platform` |
| `ally-facility-shield.png` | 768×768 | `training yard with shield racks and wooden pells` |
| `ally-facility-spear.png` | 768×768 | `spear training ground with long spear racks` |
| `ally-facility-bow.png` | 768×768 | `archery workshop with bows drying on racks and straw targets` |
| `ally-facility-horse.png` | 768×768 | `horse stable with hay and a water trough` |
| `supply-depot.png` | 768×768 | `field supply depot: stacked rice sacks, crates and a canvas awning` |
| `beacon.png` | 512×768 | `stone signal beacon tower with a fire basin on top (unlit)` |
| `pass-gate.png` | 1024×768 | `heavy wooden pass gate with two log towers and a closed double door, part of a palisade line` |
| `palisade.png` | 1024×512 | `straight section of a sharpened log palisade fence, designed to tile end to end; true isometric projection: the base line rises from lower left to upper right with a slope of 0.707 (35.26°)` |
| `<적진영>-outpost.png` | 1024×1024 | `enemy forward fortress gate with dark banners` (현무·백호·주작·귀왕 각 1장) |
| `gui-ghost-gate.png` | 768×1024 | `ominous stone gate of the undead army, glowing faint violet, covered in talismans` |

### E. 지역 특징 소품(지역마다 1~2개, 등각·투명, 768×768)
청룡성 `jade pavilion by the river`, 버들골 `rice paddy terraces with a scarecrow`, 동해포 `wooden pier with fishing boats and cargo`, 현무성 `stone archive building with scroll shelves under the eaves`, 빙설령 `mine entrance with ore carts on rails`, 흑수 `frozen river crossing with stepping stones`, 백호성 `brass workshop with large gears and a chimney`, 서량 `horse pen fence with hoofprints`, 모래관 `sandstone canyon arch`, 주작성 `red shrine gate with stone lanterns`, 남화 `terraced tea hill`, 염산 `volcanic vent with glowing embers`, 귀왕성 `broken throne platform in a ruined palace`, 혼령곡 `rope bridge hung with paper talismans`, 망자벌 `field of tilted grave markers and burial mounds`.
파일 이름: `feature-<지역 id>.png` (지역 id는 `REGION_MAPS` 키: cheong·beodeul·donghae·hyeonmu·bingseol·heuksu·baekho·seoryang·moraegwan·jujak·namhwa·yeomsan·gwiwang·honryeong·mangja).

### 만드는 순서(권장)
1. **시험 1세트**: 청룡 `qing-ground`·`qing-road`·`qing-prop-bamboo-clump`·`qing-house`·`ally-wall`을 먼저 만든다. Claude가 한 전장(버들골)에 연결해 휴대폰 화면에서 크기·각도·색을 확인한다.
2. 시험이 맞으면 같은 문장으로 나머지 진영을 만든다(진영 색 문장만 바꿔 같은 대화창에서 이어 그리면 화풍이 덜 흔들린다).
3. 한 대화창에서 첫 그림이 마음에 들면 「같은 화풍·같은 빛 방향·같은 도트 크기로」를 붙여 계속 요청한다.

### 확인 기준
- [ ] 바닥 타일: 네 변을 이어 붙여도 선이 안 보임, 원근·그림자 없음
- [ ] 세운 물체: 등각(지붕과 정면이 같이 보임), 소실점 없음, 투명 배경, 바닥 그림자 없음, 발밑이 아래쪽
- [ ] 빛이 왼쪽 위, 흐림·안개 없음, 사람 없음, 글자 없음
- [ ] 같은 진영끼리 색이 맞고, 다섯 진영이 한눈에 구별됨

### 게임에 넣기
받은 그림은 `terrain/hd/` 아래에 파일 이름 그대로 올리고 Claude에게 「올렸다」고 말한다. 지금 전장은 바닥·나무·바위·집·성벽·탑·관문을 코드로 그리므로, 그림이 오면 Claude가 그 자리에 연결하는 작업을 한다(그림이 없는 것은 지금 그림 유지). 판정·충돌·길찾기·크기는 바뀌지 않는다.

### 다음 세트 · 청룡 2차 (2026-11-07) — 붙여 넣을 프롬프트
**①~③ 제작·업로드 결과 (Codex · 2026-11-07):** `terrain/hd/ally-wall.png`와 `qing-road.png`를 교체하고 `ally-wall-corner.png`를 추가했다. 각각 1024×512·1024×1024·512×768이며 40색·4×4 도트 격자, 성벽 두 장은 투명/길은 불투명 PNG다. 요청한 참고 그림과 공통 문장을 사용했고 성벽은 「더 가파르게, 35도」로 재생성했다. 최종 아랫선은 약 −0.6054(31.19°), 이전 약 −0.3409보다 개선됐지만 목표 −0.707에 정확히 맞지는 않아 허용대로 이 상태로 전달한다. 길의 진한 양옆 띠는 제거했고 반복 미리보기를 검수했다. 측정값·알파 범위·기존 `HD_WALL` 보정값이 더 이상 맞지 않는 점은 `terrain/hd/README.md`에 기록했다. 기존 게임 코드와 다른 1차 그림은 변경하지 않았다. **새 그림 재연결·휴대폰 확인은 아직이며 ④~⑦은 미착수다.**

**①~③ 버들골 재연결 (Claude · 2026-11-07):** 성벽 기준값을 새 그림으로 다시 쟀다(아랫선 y≈−0.602x+700.2, 조각 끝 x=310~716, 중심 (512,393)). 게임이 −0.602를 0.707로 기울여(전단 폭이 1차의 절반 이하라 벽돌이 덜 비스듬함) 약 170px마다 이어 붙인다(옆벽 4·4, 앞벽 2·2, 뒷벽 5조각). 모서리 그림은 아랫선을 재 보니 기둥이 안쪽(화면 위)이고 두 날개가 왼쪽·오른쪽 아래로 뻗어 **본진 북서(맨 위) 모서리**에 전체 그림을 쓰고, 나머지 세 모서리에는 가운데 기둥(x=136~376)만 잘라 세운다(기준점: 기둥 앞 밑끝 (256,690)). 날개 기울기는 약 0.52라 벽과 살짝 어긋나지만 벽이 앞에 그려져 가려진다. 길은 전체 1024 타일을 그대로 반복한다(가장자리 차이 10.0, 내부 8.2 수준으로 이음새가 보이지 않음). `tests/hd-terrain.cjs` 3규격 통과. ④~⑦ 진행 가능.

**④~⑦ 버들골 연결 (Claude · 2026-11-07):** 17장 모두 연결했다. 바닥은 덤불 칸=`qing-bush`, 들판 칸=`qing-field`, 물 안쪽=`qing-water`, 습지·여울=`qing-marsh`, 본진 마당=`qing-stone`. 2×2 반복과 실제 화면(청룡성 강에 검사용으로 켜 봄)에서 물결·돌 줄눈 반복 경계가 보이지 않았다. 버드나무를 숲 나무의 기본으로, 대숲은 3그루 중 1그루, 지도 가장자리 장식은 4그루 중 1그루를 갈대로, 바위는 모두 이끼 바위로 바꿨다. 본진·망루·시설 4종·군량소(보급소 그림)는 manifest의 밑끝에 맞춰 세웠다(적 거점은 아직 집 그림). 관문·목책은 manifest 기울기(.70/.686, 실측 끝점 .679)를 0.707로 아주 조금만 기울여 붙였다. 관문은 관문선의 문 자리에 한 장, 목책은 길이에 맞춰 이어 붙이며 휴대폰에서 병사 3명 키 정도로 보인다. 버들골은 관문선이 없는 방어전이라 검사에서 관문선을 강제로 세워 확인했다. 남은 예전 그림: 논(들판 구획)·고지 테두리·물가 돌 테두리·적 거점·귀문·봉화대.

**④~⑦ 제작·업로드 결과 (Codex · 2026-11-07):** 아래 목록의 새 PNG 17파일을 `terrain/hd/`에 추가했다. 바닥 5종(1024×1024 불투명), 소품 3종(2048×512, 각 512 네 칸 투명 시트), 본진·탑·시설 4종·보급소 7종, 관문·목책 2종이다. 기존 청룡 그림을 화풍 참고로 첨부하고 해당 프롬프트와 공통 문장으로 생성했다. 물의 수면, 본진·마구간 밑끝, 관문 지붕의 잘린 부분을 수정·재생성했고, 관문·목책도 더 가파르게 재생성했다. 원본 비율을 유지해 규격 캔버스에 배치한 뒤 40색·4×4 도트로 정리했다. 관문 아래 윤곽은 약 −0.70078(35.02°), 목책은 약 −0.68637(34.46°)이며 정확한 연결점/접합은 게임에서 재측정한다. 크기·색 수·도트 격자·알파·네 칸 분할·밑끝 여백과 브라우저 17파일 디코딩 검사를 통과했다. 바닥 반복 미리보기를 검수했으나 물결·돌 줄눈의 경계와 휴대폰 실제 배율에서는 추가 확인이 필요하다. 기존 HD 검사도 세 화면 규격에서 통과했다. **게임 코드는 변경하지 않았으며 새 17파일의 연결·휴대폰 검수는 아직이다.** 상세 규격·기준점·검사 범위는 `terrain/hd/README.md`와 `qing-second-manifest.json` 참고. 기존 PNG 6파일은 그대로 유지했다. 브랜치 `ccr-fa9b3dba-6er4z1`에 올리며 main에는 병합하지 않는다. 다른 진영·절벽·지역 특징 소품 등 전체 요청 6의 남은 항목은 미완료다.

1차 시험 세트를 버들골에 연결해 보니 성벽 각도와 길 테두리를 고쳐야 했다. 2차 세트는 **고칠 그림 2장 + 새 그림 2장 + 청룡 나머지**다. 같은 대화창에서 1차 그림(`qing-house.png` 또는 `qing-ground.png`)을 **화풍 참고로 첨부**하고 아래 문장을 하나씩 보낸다. 끝에는 항상 위의 [공통 문장]을 붙인다.

**① 성벽 다시 (`ally-wall.png`, 1024×512, 투명)**
> Redraw the attached stone fortress wall segment in exactly the same pixel-art style, colors and details (grey stone blocks, teal wooden walkway rail, crenellations with small arrow slits, moss tufts), but in true isometric projection: the wall's base line must rise from lower left to upper right with a slope of 0.707 (35.26 degrees — 1 pixel up for every 1.414 pixels across), no perspective. A straight segment cut cleanly at both ends so identical copies placed end to end along that diagonal join seamlessly (no end pillars). Base touching the bottom 3% of the canvas, transparent background, no ground shadow. [공통 문장]

**② 성벽 모서리 (`ally-wall-corner.png`, 512×768, 투명)**
> The outer corner pillar where two of the same stone fortress walls meet at a right angle, true isometric projection (35.26°, no perspective): one wall stub leaves toward the lower left and one toward the lower right, each about 1/5 of a segment long, with a slightly taller square stone pillar and a small teal-tiled cap at the corner. Same style and colors as the attached wall. Base touching the bottom 3% of the canvas, transparent background, no ground shadow. [공통 문장]

**③ 길 다시 (`qing-road.png`, 1024×1024, 불투명)**
> A seamless tileable top-down dirt road surface viewed straight down at 90 degrees: packed earth with faint wheel ruts and scattered small flat stones, the texture fills the whole tile edge to edge with no curbs and no darker border strips at the sides, tiles perfectly on all four sides, no perspective, no cast shadows. Palette: warm light brown earth that matches the attached ground texture. [공통 문장]

**④ 청룡 바닥 나머지 (각 1024×1024, 불투명)** — 위 A의 문장에 `{바닥 종류}`만 바꿔 넣는다: `qing-field.png`(field), `qing-bush.png`(bush), `qing-stone.png`(stone), `qing-water.png`(water), `qing-marsh.png`(`Muddy marsh with reeds and puddles.`). 진영 색은 `Palette: fresh greens, teal, jade, cool river blue.`

**⑤ 청룡 소품 나머지 (각 2048×512 네 칸 시트, 투명)** — 위 B의 문장으로 `qing-prop-willow.png`(`weeping willow tree`), `qing-prop-reeds.png`(`clump of river reeds`), `qing-prop-boulder.png`(`mossy boulder`). 칸마다 발밑이 아래 16px 여백 위에 오게 한다.

**⑥ 본진·탑·시설 (청룡 색, 투명)** — 위 D 표의 `ally-keep.png`·`ally-tower.png`·`ally-facility-shield.png`·`ally-facility-spear.png`·`ally-facility-bow.png`·`ally-facility-horse.png`·`supply-depot.png`. 집·탑처럼 혼자 서는 건물은 `isometric view from about 30 degrees above, no vanishing point`면 된다.

**⑦ 관문·목책 (투명)** — `pass-gate.png`(1024×768)·`palisade.png`(1024×512). 목책은 ①과 같은 **기울기 0.707** 문장을 넣고 양 끝을 잘라 이어 붙일 수 있게 한다. 관문은 목책 선 위에 서므로 문짝 양옆 통나무 기둥 아랫선도 같은 기울기로.

올리는 곳은 그대로 `terrain/hd/`. ①~③만 먼저 와도 바로 바꿔 끼운다(성벽은 기울이지 않고 그대로, 길은 자르지 않고 그대로).

### 다음 세트 · 청룡 3차 + 다른 진영 (2026-11-07) — 붙여 넣을 프롬프트
버들골에 아직 예전 그림으로 남은 것(논·고지·물가·적 거점·귀문·봉화대)을 먼저 채우고, 그다음 같은 목록을 진영 색만 바꿔 현무·백호·주작·귀왕으로 넓힌다. 첨부는 지금까지 만든 청룡 그림 1~2장(화풍 참고), 끝에는 항상 [공통 문장].

**⑧~⑬ 제작·업로드 결과 (Codex · 2026-11-07):** 아래 여섯 PNG를 지정한 이름·크기·배경으로 `terrain/hd/`에 추가했다. 청룡 집·바닥·물·성벽 중 항목마다 1~2장을 화풍 참고로 첨부하고 각 영어 프롬프트 끝에 공통 문장을 붙였다. 물가 초안의 위쪽 육지/아래쪽 물 구분은 세로 반복에 맞지 않아, 얕은 물 속 젖은 돌이 전체에 고르게 퍼지도록 재생성했다. 귀문은 과도하게 밝은 막을 없애고 내부를 투명하게, 돌 안쪽에 옅은 보라색이 남도록 수정했다. 세운 물체의 원본 잘림을 확인한 뒤 비율을 유지해 여백을 맞추고 BOX 축소·40색·nearest 4배로 정리했다. 바닥 세 장은 1024×1024 전체 불투명, 적 거점은 1024×1024, 귀문은 768×1024, 봉화대는 512×768 이진 알파 투명 PNG다. 밑끝은 앞 두 건물 y=992 직전, 봉화대 y=744 직전이다. 크기·색 수·4×4 도트·알파·여백·브라우저 6파일 디코딩 검사를 통과했고 바닥 2×2 반복 미리보기를 검수했다. 기존 `tests/hd-terrain.cjs`도 390×844·844×390·1280×800에서 통과했다. 이는 새 그림의 게임 연결/모바일 실기 검수 완료를 뜻하지 않는다. 기존 23 PNG·`index.html`·검사 코드는 `504b06d`와 같으며 수정하지 않았다. 상세 기준은 `terrain/hd/README.md`와 `qing-third-manifest.json` 참고. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다. **이번 전달은 ⑧~⑬ 여섯 장까지이며, 다른 진영 묶음은 아직 제작하지 않았다.**

**⑧ 논 (`qing-paddy.png`, 1024×1024, 불투명)**
> A seamless tileable top-down rice paddy texture viewed straight down at 90 degrees: shallow water between neat rows of young green rice seedlings, thin earthen dividing ridges every few rows, no perspective, no cast shadows, tiles perfectly on all four sides. Palette: fresh greens, teal water, warm earth that matches the attached ground texture.

**⑨ 고지 윗면 (`qing-hill.png`, 1024×1024, 불투명)**
> A seamless tileable top-down texture of a slightly raised grassy hilltop viewed straight down: short sunlit grass, small wildflowers and a few flat pale stones, a little lighter and drier than the attached ground texture, no perspective, no cast shadows, tiles perfectly on all four sides.

**⑩ 물가 돌 (`qing-bank.png`, 1024×1024, 불투명)**
> A seamless tileable top-down texture of a river bank edge: wet rounded pebbles and mossy stones half in shallow clear water, viewed straight down, no perspective, no cast shadows, tiles perfectly on all four sides. Palette: grey-green stones, teal water matching the attached water texture.

**⑪ 적 거점 (`gui-outpost.png`, 1024×1024, 투명)** — 버들골 적은 귀왕군
> A single enemy forward fortress of the undead army: a dark stone gatehouse with a heavy closed gate, tattered dark-violet banners, broken roof tiles and grey ash stains, isometric view from about 30 degrees above, no vanishing point, base touching the bottom 3% of the canvas, transparent background, no ground shadow, no people. Palette: ash grey, muted violet shadows, bone white, desaturated dead wood.

**⑫ 귀문 (`gui-ghost-gate.png`, 768×1024, 투명)**
> A single ominous stone torii-like spirit gate of the undead army, two cracked pillars and a crossbeam hung with paper talismans, a faint violet glow inside the opening, isometric view from about 30 degrees above, no vanishing point, base touching the bottom 3% of the canvas, transparent background, no ground shadow, no people. Palette: ash grey stone, violet glow, pale paper.

**⑬ 봉화대 (`beacon.png`, 512×768, 투명)**
> A single stone signal beacon tower with a square base, a short ladder and an iron fire basin on top (unlit, a little firewood stacked inside), isometric view from about 30 degrees above, no vanishing point, base touching the bottom 3% of the canvas, transparent background, no ground shadow, no people. Palette: grey stone, teal tiles, warm wood, matching the attached wall.

**다른 진영으로 넓히기 (현무·백호·주작·귀왕)**
청룡에서 쓴 문장을 그대로 다시 보내고, ① 파일 이름 앞부분(`qing-`)을 진영 이름으로, ② 마지막 색 문장(`Palette: …`)을 아래 진영 색으로 바꾼다. 화풍 참고로 같은 종류의 청룡 그림을 첨부하면 크기·각도·도트가 덜 흔들린다.
- 바닥 9종: ground·road·field·bush·stone·water·marsh(또는 진영 특수)·paddy(현무·귀왕은 생략)·hill·bank
- 소품 4칸 시트 3종: 진영 나무(현무 `snow-covered pine tree`, 백호 `lone poplar tree`, 주작 `red maple tree`, 귀왕 `dead twisted tree`), 진영 덤불(현무 `snowy shrub`, 백호 `dry steppe bush`, 주작 `tea bush row`, 귀왕 `talisman pole with paper charms`), 진영 바위(현무 `frozen rock with icicles`, 백호 `layered sandstone rock`, 주작 `black basalt rock with glowing red cracks`, 귀왕 `cracked ruin pillar`)
- 건물: house·keep·tower·facility 4종·supply-depot (본진·시설은 청룡이 아군이라 다른 진영은 **현무편에서 쓸 `xuan-` 한 벌만** 만들면 된다), 적 거점 `<진영>-outpost.png`
- 진영 색: 현무 `Palette: snow white, slate blue, dark navy stone, pale frost.` / 백호 `Palette: ochre loess, warm sandstone, dry straw yellow, brass accents.` / 주작 `Palette: crimson and orange autumn leaves, warm red-brown soil, black volcanic stone.` / 귀왕 `Palette: ash grey, muted violet shadows, bone white, desaturated dead grass.`
- 성벽·모서리·목책·관문은 진영과 관계없이 지금 청룡 그림을 같이 쓴다(현무편 본진만 `xuan-wall`·`xuan-wall-corner`가 있으면 좋다. 각도 문장 그대로).

올리는 곳은 `terrain/hd/`. 순서 추천: 청룡 3차 ⑧~⑬ → 귀왕(적 거점이 가장 자주 나옴) → 현무 → 주작 → 백호.

**⑧~⑬ 버들골 연결 (Claude · 2026-11-07):** 6장 연결. 논 구획 3곳은 `qing-paddy`, 고지 안쪽은 `qing-hill`, 물가 테두리는 `qing-bank`(청룡성 강에서 검사용으로 확인, 다리 레이아웃의 돌 둑 띠가 그 위에 그려져 강가는 아직 예전 띠가 주로 보임). 적 진영이 귀왕일 때 적 거점은 `gui-outpost`(폭 400, 밑끝 992), 귀문은 `gui-ghost-gate`(폭 160, 은은히 깜박임), 봉화대는 `beacon`(폭 120, 점화 시 불꽃을 그림 꼭대기에 얹음). 휴대폰 세로·가로에서 크기·가림 순서(거점·귀문·봉화대 앞뒤로 병사가 자연스럽게 겹침)·논/고지/물가 반복 경계 확인. 버들골 1판에는 귀문이 없어 검사에서 세워 확인했다. 다른 진영 적 거점(`xuan-`·`bai-`·`zhu-outpost`)이 없으면 예전 집 그림을 쓴다.

---

## 요청 7 · 귀왕 망자군 병사(4병종 전용 그림) — 상태: 1·2단계 4병종×4방향 16장 게임 연결(2026-11-07), 3단계 걷기 시트 대기

### 옆걸음 제보 후 방향 보완 (Codex · 2026-11-07)
- Claude의 `47119ba`를 받아 기본 4장 연결을 보존하고, 빠져 있던 fl·br·bl을 각 병종 3장씩 총 12장 생성했다. 망자군 기본 PNG를 디자인 참고, 아군 같은 병종의 해당 방향을 자세 참고로 첨부했다. 왼쪽 앞모습은 왼쪽을, 두 뒷모습은 뒤통수/망토/화살통/기병의 등을 보이며 각각 오른쪽 위·왼쪽 위를 향하도록 검수했다. 비트맵을 좌우 반전해서 만들지 않았다.
- `characters/soldier-gui/raw/gui-<병종>-<fl|br|bl>.png`와 게임용 `<병종>/<방향>.webp`에 저장했다. 캔버스는 병종 원본 크기 그대로이고 전신·무기 끝·말발굽·투명 배경을 확인했다. 기존 fr PNG/WebP는바이트 그대로 보존했다.
- `GUI_SOLDIER_READY`를 네 방향으로 늘리고 방향별 발 기준을 넣었다. 이제 뒤쪽 이동도 전용 뒷모습을 쓰며 왼쪽/뒷모습의 뒤집기를 상쇄한다. 귀왕 적 병사만 진영색 없이 쓰는 조건, 다른 진영/아군/장수는 그대로다. 걷기 시트는 아직 없으므로 기존 코드 걸음을 유지한다.
- 무진·흑철은 별개로 원본 방향 분류가 잘못돼 있었다. 원본을 오른쪽으로 정정하고 정지·걷기 fr/fl 연결을 맞췄다. `tests/leader-facing.cjs`로 실제 네 이동 방향에서 선택하는 그림과 정지/걷기 픽셀 일치를 검사했다. `tests/gui-soldier.cjs`는 16장 로드·각 방향 전용 파일·뒤집힘 없음·아군/타 진영 보존·세 화면 규격 검사로 갱신했다. 상세 재현/수정은 CLAUDE.md 마지막 절 참고.


### 1단계 게임 연결 (Claude · 2026-11-07)
- `characters/soldier-gui/<병종>/fr.webp`(원본 캔버스 그대로, 품질 92). `GUI_SOLDIER_READY`·`GUI_SOLDIER_FOOT`(눈으로 잰 발 중심: 방패 .47·궁 .44·창 .5·기병 .47)·`guiSoldier`·`guiSoldierOf`. 적 진영이 귀왕(`tintFaction==='gui'`)인 적 병사만 진영색 없이 이 그림을 쓴다. 방향 그림이 없는 동안은 fr을 왼쪽일 때 뒤집어 쓰고(뒷모습도 앞모습), 걷기 프레임 대신 코드 걸음(`hasWalk` false). 아군·다른 진영 적·장수는 그대로. 2단계 방향 그림이 오면 `GUI_SOLDIER_READY`에 키를 더하고 발 위치를 잰다.
- 26판 중 c3(현무)·c5(백호)·c7(주작)·x2(청룡)를 뺀 22판의 적 병사가 망자군이다. `tests/gui-soldier.cjs`(로드·전용 그림·뒤집기·아군/다른 진영 불변·3화면).

### 1단계 전달 (Codex · 2026-11-07)
- `characters/soldier-gui/raw/gui-shield-fr.png`·`gui-bow-fr.png`·`gui-spear-fr.png`·`gui-horse-fr.png`를 추가했다. 각 병종 아군 원본을 첨부하고 아래 7-1의 병종 문장과 공통 문장으로 생성했다. 해골 방패병·해골 궁병·창백한 망자 창병·해골 조랑말 기병이며, 보라 넋불·녹슨 갑옷·해진 천·부적/사슬을 사용했다. 나라 문장·피·살점은 넣지 않았다.
- 최종 PNG는 각각 원본과 같은 431×384·407×384·350×384·330×384다. RGBA 투명이며 작은 넋불/가장자리 부분 알파를 유지했다. 원본을 뒤집거나 무기 손을 바꾸지 않았다. 셀 셰이딩 스타일을 유지하고 40색/도트 변환은 하지 않았다.
- 원본 크기 비교·약 50px 미리보기·투명 합성으로 자세/장비/잘림을 검수했고, PNG 규격·알파·윤곽 여백과 브라우저 4파일 로딩/디코딩 검사를 통과했다. 발 위치는 원본과 약간 달라 게임에서 수동 보정해야 한다. 범위와 인계는 `characters/soldier-gui/README.md` 참고.
- **이번 작업은 1단계 네 장만이다.** 게임 코드와 기존 아군 그림·방향·걷기는 변경하지 않았다. 게임 연결·모바일 실기 검수·사용자 디자인 확인은 아직이며, 2·3단계는 기본 그림 확인 후 진행한다. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다.

지금 귀왕 적 병사는 아군 병사 그림에 잿빛 진영색만 입힌 것이라 「색만 다른 사람 군대」로 보인다. 귀왕군은 **왕인에 묶여 되살아난 망자들의 군대**이므로 4병종(방패병·궁병·창병·기병)을 따로 그린다. 같은 게임 그림체(SD 이등신, 짙은 외곽선, 셀 셰이딩)는 유지하되 **무섭되 징그럽지 않게**(피·내장·살점 없음, 해골·빛바랜 갑옷·넋불 위주).

### 디자인 기준(모든 병종 공통)
- **몸**: 뼈가 드러난 해골 병사 또는 회색 피부의 창백한 망자. 눈구멍 안에 **보랏빛 넋불**(작은 두 점), 표정 없음.
- **장비**: 오래 묻혀 있던 **녹슨·금 간 옛 갑옷**, 해진 천 조각, 끊어진 끈. 여러 나라 갑옷이 섞인 듯 낡았지만 **특정 나라 문장은 넣지 않는다**(귀왕 정체 스포일러 방지). 무늬는 빛바랜 **보라색 부적 띠**와 사슬.
- **색**: 잿빛 회색·뼈 흰색·녹 갈색·바랜 남색, 강조색은 **어두운 보라와 옅은 넋불 보라(#b48cff 근처)**. 아군의 밝은 파랑·초록·금색은 쓰지 않는다.
- **분위기**: 다리 끝·옷자락에서 옅은 보랏빛 연기가 살짝 피어오름(그림 안쪽에서 끝나고 배경으로 퍼지지 않게).
- 게임은 이 그림에 **진영색을 입히지 않고 그대로** 쓴다(아군 그림과 따로).

### 만드는 순서
1. **기본 그림 4장(fr, 앞-오른쪽)**: 아래 7-1 프롬프트. 아군 원본(`shield.webp`·`bow.webp`·`spear.webp`·`horse.webp`)을 **크기·자세·구도 참고**로 첨부한다. 4장을 먼저 올리면 Claude가 게임에 넣어 크기·느낌을 확인한다.
2. **방향 12장(fl·br·bl)**: 1단계 그림을 첨부해 요청 4의 방향 문구를 그대로 쓴다(7-2).
3. **걷기 시트 16장**: 각 방향 그림을 첨부해 요청 5의 프롬프트를 그대로 쓴다(7-3).

파일 이름: `gui-<병종>-<방향>.png`(예: `gui-spear-fr.png`, `gui-horse-bl.png`), 걷기 시트는 `gui-<병종>-<방향>-walk.png`. 올리는 곳: `characters/soldier-gui/raw/`.

### 7-1. 기본 그림(fr) 프롬프트 — 아군 같은 병종 그림 1장 첨부
공통 문장(병종 문장 뒤에 붙인다):
> Same canvas size, pose, framing, scale and cute chibi SD proportions as the attached soldier, facing the same direction (front three-quarter view toward the lower RIGHT, seen slightly from above), but redesigned as an UNDEAD soldier of a ghost king's army of the dead. Spooky but not gory: no blood, no flesh, no guts. Small glowing violet ghost-fire eyes, rusted and cracked ancient armor, torn cloth, faded purple talisman strips and chains, a faint violet mist curling from the feet and cloth hems. Palette: ash grey, bone white, rust brown, faded navy, dark purple, pale ghost violet (#b48cff); no bright blue, green or gold. No national emblem or crest. Clean dark-brown outlines, soft cel shading. Single character only, full body, transparent background, no shadow, no ground, no text, nothing cropped.

병종 문장:
- **shield** (`shield.webp` 첨부) → `A skeleton shield-bearer in a rusted, dented helmet with a broken plume, holding a large cracked wooden tower shield bound with iron bands and purple talisman strips in one hand and a notched short sword in the other, in a sturdy guarding stance.`
- **bow** (`bow.webp` 첨부) → `A hooded skeletal archer in a tattered grey cloak, holding a bow carved from pale bone strung with a glowing violet string in one hand, a frayed quiver of black-feathered arrows on the back, in a light ready stance.`
- **spear** (`spear.webp` 첨부) → `A pale undead spearman in a cracked conical helmet and rusted scale armor, holding a long chipped spear upright with a tattered, faded purple pennant instead of a tassel, in an alert stance.`
- **horse** (`horse.webp` 첨부) → `A skeleton rider in rusted armor and a ragged cape, holding a notched curved sabre, riding a small skeletal pony made of bones with violet ghost-fire mane and tail and ghost-fire eyes, wearing a broken old harness; the whole pony is visible and faces the same direction as the rider.`

### 7-2. 방향(fl·br·bl) — 7-1 결과 1장 첨부
요청 4의 기본 문장과 방향 문구를 그대로 쓰고, `{병종 문장}` 자리에 7-1의 병종 문장을 넣는다. 맨 끝에 `Keep the undead design, violet ghost-fire eyes and palette exactly as the reference.`를 덧붙인다. 뒷모습(br·bl)은 해진 망토 뒷면·등의 부적 띠·화살통이 보이게.

### 7-3. 걷기 시트 — 해당 방향 그림 1장 첨부
요청 5의 프롬프트를 그대로 쓰고 `{병종 문장}`을 아래로 바꾼다. 끝에 `Keep the undead design and palette exactly as the reference; the violet mist trails slightly behind the feet.`
- **shield** → `He shambles forward stiffly, keeping the cracked tower shield raised in front and the notched sword in the other hand.`
- **bow** → `The archer glides with stiff steps, bone bow in one hand, the tattered cloak dragging and swaying.`
- **spear** → `He marches stiffly with the spear upright; the torn purple pennant flutters with each step.`
- **horse** → `The skeletal pony walks with a four-beat walk (Frame 1: near front leg forward, Frame 2: legs gathered, Frame 3: far front leg forward, Frame 4: legs gathered); its ghost-fire mane flickers, the rider bobs gently and keeps the sabre raised. The whole pony is visible.`

### 확인 기준
- [x] 1단계 4병종은 망자군 디자인·병종별 무기/투구 시각 검수 완료(사용자 확인 대기)
- [ ] 아군 원본과 키·머리 크기·발 위치가 비슷함(전장에서 크기 49.4로 같이 맞춘다)
- [x] 1단계 피·살점 없음, 나라 문장 없음, 배경 투명, 발·말발굽 안 잘림
- [ ] 방향·걷기 그림은 요청 4·5 기준과 같음(무기 손 유지, 좌우 반전 금지)

### 게임에 넣기(그림이 올라오면 Claude가 연결)
- 귀왕 적 병사만 `characters/soldier-gui/<병종>/`(fr·방향·걷기)을 진영색 없이 쓰고, 그림이 없는 병종·방향은 지금처럼 아군 그림+잿빛 색을 쓴다. 발 위치는 `SOLDIER_FOOT`처럼 눈으로 재서 넣는다. 다른 진영 적·흑화 장수·장수 그림은 바꾸지 않는다.

## 요청 8 · 절벽·협곡·능선·숲 벽 HD 그림 — 상태: 5장 게임 연결 완료(2026-11-08, cliff-face 각도는 코드에서 보정), 휴대폰 실기 검수 대기

### canopy 전달 (Codex)
- `terrain/hd/qing-canopy.png` 한 장을 추가했다. 사용자 숲 수관 프롬프트와 요청 6 공통 문장을 사용하고 `qing-bush.png`를 화풍/색 참고로 첨부했다. 바닥이 보이지 않는 빽빽한 활엽수 수관과 소수의 소나무·대나무 꼭대기다. 초안의 옆모습 삼각 소나무는 바로 위에서 보는 방사형 잎 모양으로 수정했다. 길·빈터·줄기·테두리·사람·글자는 넣지 않았다.
- 최종 1024×1024 불투명 RGB PNG, 40색, 4×4 도트 격자다. BOX 축소·40색 제한·nearest 4배 확대 후 규격·불투명·색 수·격자와 브라우저 PNG 디코딩을 확인하고 2×2 반복 미리보기를 검수했다. 전장 배율에서의 경계는 연결 후 확인한다.
- 이번 전달은 canopy 한 장만이다. 기존 그림·게임 코드·판정·충돌·길찾기는 변경하지 않았다. 요청 8의 다섯 파일은 모두 올라왔으며 Claude가 forest 벽을 포함해 연결한다. cliff-face의 목표 각도/양 끝 높이 보정 필요 사항은 해당 전달 기록 그대로다. 전체 실기 검수 완료는 아니다. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다.

### ridge 전달 (Codex)
- `terrain/hd/qing-ridge.png` 한 장을 추가했다. 사용자 능선 바위 프롬프트와 요청 6 공통 문장을 사용하고 `qing-cliff-top.png`를 화풍/광물 색 참고로 첨부했다. 바로 위에서 본 날카로운 회색 화강암 덩어리·깊은 균열·지의류·작은 관목이 촘촘한 바위 표면이며, 흙길/풀 고원과 구분되도록 바위 비중을 높였다. 길·절벽 옆면·테두리는 넣지 않았다.
- 최종 1024×1024 불투명 RGB PNG, 40색, 4×4 도트 격자다. BOX 축소·40색 제한·nearest 4배 확대 후 규격·불투명·색 수·격자와 브라우저 PNG 디코딩을 확인하고 2×2 반복 미리보기를 검수했다. 실제 전장 투영의 반복 경계는 연결 후 확인한다.
- 이번 전달은 ridge 한 장만이다. 기존 그림·게임 코드·판정·충돌·길찾기는 변경하지 않았다. Claude가 valley 능선 바위 패턴으로 연결한다. canopy는 아직 만들지 않았다. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다.

### gorge 전달 (Codex)
- `terrain/hd/qing-gorge.png` 한 장을 추가했다. 사용자가 준 협곡 바닥 프롬프트와 요청 6 공통 문장을 사용하고 `qing-cliff-top.png`를 화풍/색 참고로 첨부했다. 바로 위에서 본 다져진 흙·자갈·흩어진 평평한 돌·틈새의 드문 풀이다. 전체가 길 표면이며 테두리·줄무늬·절벽 옆면은 넣지 않았다.
- 최종 1024×1024 불투명 RGB PNG다. BOX 축소·40색 제한·nearest 4배 확대를 적용해 4×4 도트 격자를 맞췄다. 규격·불투명·색 수·도트 격자와 브라우저 PNG 디코딩을 확인하고 2×2 반복 미리보기를 검수했다. 실제 전장 배율의 경계는 연결 후 확인한다.
- 이번 전달은 gorge 한 장만이다. 기존 그림·게임 코드·판정·충돌·길찾기는 변경하지 않았다. Claude가 협곡 바닥 길 패턴으로 연결한다. ridge·canopy는 아직 만들지 않았다. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다.

### cliff-face 전달 (Codex)
- `terrain/hd/qing-cliff-face.png`를 추가했다. cliff-top을 화풍/색 참고로 첨부하고 사용자 프롬프트와 공통 문장을 사용했다. 얇은 풀 윗단·회갈색 퇴적암 층·균열·양치식물·발밑 잔돌이 있는 직선 조각이다. 별도의 땅/투사 그림자는 없고 양 끝은 수직 절단 형태다.
- 최초 초안이 완만해 두 차례 더 가파르게/평행하게 수정 요청했다. 최종 1024×512, 40색, 4×4 도트 격자, 알파 0/255 투명 PNG다. 바위 면의 세로 두께 중앙값은 약 159px로 캔버스 높이 약 1/3이다. 형식·알파·도트/색 수·브라우저 PNG 디코딩을 확인했다. 게임 코드는 바꾸지 않았다.
- **목표 기울기에 정확히 맞지는 않는다.** 알파 아래 윤곽 회귀는 약 −0.6422(32.71°), 위 윤곽은 약 −0.71888이다. 장식 픽셀을 포함한 근사값이며 오른쪽 끝에 조금 더 두꺼운 부분도 남아 있다. 성벽 때처럼 연결 시 목표 0.707에 맞춘 각도 보정과 끝부분 자르기/겹침 정렬이 필요하다. 완전 무보정 접합 검수 완료로 취급하지 않는다. 실제 캔버스/연결점 범위와 회귀식은 `terrain/hd/README.md` 참고.
- 이번 전달은 cliff-face 한 장이며 게임 연결은 Claude가 한다. gorge·ridge·canopy는 아직 만들지 않았다. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다.

### cliff-top 전달 (Codex)
- 사용자에게 받은 첫 번째 프롬프트와 요청 6 공통 문장을 사용해 `terrain/hd/qing-cliff-top.png` 한 장을 생성했다. 기존 `qing-ground.png`·`qing-hill.png`를 화풍 참고로 첨부했다. 바로 위에서 본 마른 짧은 풀·드러난 평평한 회색 판석·지의류·잔돌·작은 들풀이며, 절벽 옆면/가장자리/길 테두리는 넣지 않았다.
- 최종 1024×1024 불투명 RGB PNG다. BOX 축소·40색 제한·nearest 4배 확대를 적용해 4×4 도트 격자를 맞췄다. 규격·불투명·색 수·도트 격자 검사와 Chromium PNG 디코딩을 통과했고 2×2 반복 미리보기를 검수했다. 타일 끝의 픽셀이 수학적으로 동일하다고 보장하는 검사는 아니며 실제 전장 배율에서 반복 경계를 확인한다.
- 이번 전달은 요청한 cliff-top 한 장만이다. `index.html`·판정·충돌·길찾기는 바꾸지 않았다. Claude가 로더/절벽 위 고원에 연결하고 휴대폰에서 크기와 반복을 확인한다. cliff-face·gorge·ridge·canopy는 아직 만들지 않았다. 브랜치 `ccr-fa9b3dba-6er4z1`에 커밋·푸시하며 main에는 병합하지 않는다.

### 왜 필요한가
흑수(x2)·모래관(x4)·혼령곡 같은 **pass·canyon 전장**의 절벽 위가 아직 HD 그림이 없어 「연두색 평면 + 흰 점선」으로 보이고, 절벽 사이 협곡 길은 빗금 친 계단처럼 보인다. **valley 전장**의 능선 바위(회색 띠)와 **forest 전장**의 숲 벽(진한 녹색 덩어리)도 옛 단순 그림이다. 판정·충돌·길찾기는 그대로 두고 그림만 바꾼다.

### 만들 그림 5장 (`terrain/hd/`에 이 이름으로 커밋)
| 파일 | 크기·형식 | 쓰는 곳 |
|---|---|---|
| `qing-cliff-top.png` | 1024×1024 불투명, 위에서 본 반복 타일 | 절벽 위 고원(지금 연두색 평면) |
| `qing-cliff-face.png` | 1024×512 투명, 등각 띠(끝끼리 이어짐) | 절벽 가장자리, 고원과 협곡 바닥이 만나는 낭떠러지 면 |
| `qing-gorge.png` | 1024×1024 불투명, 위에서 본 반복 타일 | 협곡 바닥 길(지금 빗금 계단) |
| `qing-ridge.png` | 1024×1024 불투명, 위에서 본 반복 타일 | 골짜기 능선 바위(지금 회색 띠) |
| `qing-canopy.png` | 1024×1024 불투명, 위에서 본 반복 타일 | 숲 벽(지금 진한 녹색 덩어리) |

- 바닥 타일 4장은 요청 6의 「게임 쪽 약속」과 같다. 바로 위에서 본 정사각형이고 원근·그림자 방향이 없으며 네 변이 이음새 없이 이어진다. 타일 한 장은 월드 512(병사 약 10명 폭)에 깔린다.
- 절벽 면은 요청 6의 「바로잡은 각도」와 같다. 아랫선이 왼쪽 아래→오른쪽 위로 기울기 0.707로 오른다. 양 끝은 같은 그림을 이어 붙여도 맞닿게 하고, 반대 방향은 게임이 좌우 반전한다. 위 가장자리는 고원 풀(cliff-top과 같은 색)이 살짝 걸치고, 아래는 협곡 바닥에 닿는다. 높이는 병사 2~3명 정도다.
- 진영 색은 청룡 공통(귀왕 외 4진영이 함께 쓴다, 요청 6 최신 결정). 혼령곡은 귀왕 영토라 지금처럼 잿빛 그림을 유지한다.

### ChatGPT 프롬프트 (각각 따로, 끝에 요청 6 「공통 문장」을 붙인다)
1. `qing-cliff-top.png`
> A seamless tileable top-down ground texture of a highland plateau on top of a cliff, viewed straight down at 90 degrees with no perspective and no cast shadows, 1024×1024, edges tile perfectly on all four sides. Short wind-swept grass with patches of exposed flat grey rock slabs, small lichen spots, a few pebbles and tiny wild herbs; slightly paler and drier than lowland grass so it reads as higher ground. Palette: fresh greens, teal, jade, cool grey stone. [공통 문장]
2. `qing-cliff-face.png`
> A horizontal strip of a natural rock cliff face for a game map edge, true isometric projection (35.26° — the cliff's base line rises from lower left to upper right with a slope of 0.707, i.e. 1 pixel up for every 1.414 pixels across), no perspective. Layered grey-brown sedimentary rock with cracks and ledges, moss and grass tufts hanging over the top edge, small ferns and loose stones at the foot. The strip is 1024×512 with a transparent background, the left and right ends cut cleanly so identical copies join end to end seamlessly. Height of the cliff about one third of the canvas height. Light from the upper left. No ground shadow. Palette: cool grey stone, warm brown strata, fresh green moss. [공통 문장]
3. `qing-gorge.png`
> A seamless tileable top-down ground texture of a narrow mountain gorge floor, viewed straight down at 90 degrees with no perspective and no cast shadows, 1024×1024, edges tile perfectly on all four sides. Packed gravel and dirt trail surface with scattered flat stepping stones, small rocks, sparse grass in the cracks; the trail fills the whole tile edge to edge, no borders or stripes. Palette: warm brown earth, cool grey stone, a few green tufts. [공통 문장]
4. `qing-ridge.png`
> A seamless tileable top-down texture of a bare rocky mountain ridge, viewed straight down at 90 degrees with no perspective and no cast shadows, 1024×1024, edges tile perfectly on all four sides. Jagged grey granite outcrops and boulders packed together with deep cracks, patches of lichen and small hardy shrubs between the rocks; clearly impassable terrain. Palette: cool grey stone, slate blue shadows, small jade-green shrubs. [공통 문장]
5. `qing-canopy.png`
> A seamless tileable top-down texture of a dense old forest canopy, viewed straight down at 90 degrees with no perspective and no cast shadows, 1024×1024, edges tile perfectly on all four sides. Rounded clusters of tree crowns of different sizes (broadleaf and a few pines and bamboo tops) packed tightly with dark gaps between crowns, varied greens with a warm sunlit side on the upper left of each crown; no ground visible. Palette: deep forest green, jade, teal, a few yellow-green highlights. [공통 문장]

### 검수(받은 뒤)
- [ ] 바닥 4장은 2×2로 붙였을 때 이음새·줄무늬·큰 반복 무늬가 없음
- [ ] 절벽 면은 아랫선 기울기 약 0.7, 두 장을 이었을 때 끊김 없음, 배경 투명
- [ ] 글자·사람·그림자 방향 없음, 도트 4×4 느낌(조금 매끈하면 `tools/pixelize.py`로 맞춤)

### 게임에 넣기(그림이 올라오면 Claude가 연결)
- `HD_ART_FILES`에 5장을 추가하고, `pixelRegionBackground`의 pass·canyon 절벽 칸은 `cliff-top`, 절벽과 통행 칸의 경계에는 `cliff-face` 띠를, 협곡 길은 `gorge`, valley 능선은 `ridge`, forest 벽은 `canopy` 패턴으로 바꾼다. 충돌·사격 차단·길찾기는 지형 마스크 그대로라 변하지 않는다.

### 연결 결과 (Claude · 2026-11-08)
- `cliff-top`: pass·canyon 절벽 안쪽. 북쪽 끝은 밝게, 옆은 살짝 그늘. `gorge`: 협곡 통로(`pass` 지형, 예전 빗금 계단 대신). `ridge`: valley 능선 전체와 pass·canyon 절벽 앞쪽 띠(아래로 갈수록 그늘). `canopy`: forest 숲 벽(예전 녹색 덩어리·흩뿌린 수관 대신, 숲길 쪽 가장자리 그늘).
- `cliff-face`: 남·동쪽이 트인 절벽 칸(격자 32)마다 그림의 폭 약 82px 조각을 하나씩 세운다(`cliffEdges`·`drawCliffSlice`). 측정한 아랫선 y=−0.6422x+696.2를 게임 투영에 맞게 기울여 붙이므로 각도·끝점은 코드에서 처리했고 그림 수정은 필요 없다. 조각 위치에 따라 그림의 다른 부분(x 334~694)을 써서 이어 보이며, 대각선 가장자리는 계단식 절벽으로 보인다. 높이 배율 .6(병사 1.5명 정도). 남쪽 면은 좌우 반전 그림.
- 귀왕 지역(혼령곡 등)은 예전 잿빛 그림 그대로. 충돌·사격 차단·길찾기는 지형 마스크 그대로(`tests/hd-cliff.cjs`가 그림을 빼고 다시 만든 충돌 격자와 비교).
- 소프트웨어 렌더 기준 협곡 전장 전체 화면 그리기 21.6→26.3ms(절벽 조각 254개 중 화면 안 것만).

---

## 요청 9 · 귀왕 영토 전장 HD 그림(귀왕성·혼령곡·망자벌) — 상태: 프롬프트 작성(2026-11-10), 그림 대기

### 왜 필요한가
귀왕 영토 세 전장(귀왕성·망자벌은 숲 배치, 혼령곡은 협곡 배치)은 요청 6 결정대로 예전 잿빛 단순 그림이 남아 있다. 다른 12지역은 청룡 HD 그림이라 귀왕 전장만 낡아 보인다. 판정·충돌·길찾기는 그대로 두고 그림만 바꾼다. 귀왕군 거점(`gui-outpost.png`)·귀문(`gui-ghost-gate.png`)·망자군 병사는 이미 있다.

세 전장에서 실제로 쓰는 지형(검사로 확인): 맨땅, 길, 덤불(숲길 가장자리), 빈터 들판, 본진 마당, 고지, 숲 벽, 절벽 위·절벽 면·협곡 바닥·능선. **물·습지·논은 없다.** 그래서 아래 16장은 지금 쓰는 청룡 HD 파일과 하나씩 짝이 맞는다(이름의 `qing-`만 `gui-`로). 아군 본진·성벽·망루·시설·보급소·관문·목책은 우리 군 건물이라 청룡 그림을 그대로 쓴다.

### 첨부(화풍 참고)
- 같은 종류의 청룡 그림 1장(예: `gui-ground`를 만들 때 `terrain/hd/qing-ground.png`) — 크기·시점·도트 굵기를 맞추기 위해.
- 귀왕 분위기 참고 1장: `terrain/hd/gui-outpost.png` 또는 `terrain/hd/gui-ghost-gate.png`.
- 끝에는 항상 요청 6의 **[공통 문장]**을 붙인다. 한 대화창에서 이어 그리고, 첫 장이 마음에 들면 「같은 화풍·같은 빛 방향·같은 도트 크기·같은 팔레트로」를 붙인다.

### 귀왕 팔레트(모든 프롬프트에 들어 있음)
`Palette: ash grey, cold slate, muted violet shadows, bone white, desaturated dead grass, rare faint violet glow.` 음산하지만 **너무 어둡지 않게**: 병사(검은 갑주 망자군·청록 아군)가 바닥 위에서 또렷이 보여야 한다. 바닥은 중간 밝기 회색 계열, 가장 어두운 색은 그늘·틈에만.

### 만들 그림 16장 (`terrain/hd/`에 이 이름으로 커밋)
| 파일 | 크기·형식 | 짝(청룡) | 쓰는 곳 |
|---|---|---|---|
| `gui-ground.png` | 1024×1024 불투명 타일 | qing-ground | 맨땅 |
| `gui-road.png` | 1024×1024 불투명 타일 | qing-road | 길 |
| `gui-bush.png` | 1024×1024 불투명 타일 | qing-bush | 숲길 가장자리 덤불 |
| `gui-field.png` | 1024×1024 불투명 타일 | qing-field | 숲속 빈터 |
| `gui-stone.png` | 1024×1024 불투명 타일 | qing-stone | 본진 마당 |
| `gui-hill.png` | 1024×1024 불투명 타일 | qing-hill | 고지 |
| `gui-canopy.png` | 1024×1024 불투명 타일 | qing-canopy | 숲 벽(지나갈 수 없음) |
| `gui-cliff-top.png` | 1024×1024 불투명 타일 | qing-cliff-top | 협곡 절벽 위 |
| `gui-gorge.png` | 1024×1024 불투명 타일 | qing-gorge | 협곡 바닥 길 |
| `gui-ridge.png` | 1024×1024 불투명 타일 | qing-ridge | 절벽 앞 바위 띠 |
| `gui-cliff-face.png` | 1024×512 투명 띠 | qing-cliff-face | 절벽 낭떠러지 면 |
| `gui-prop-dead-tree.png` | 2048×512 투명, 4칸 | qing-prop-willow | 숲·들판 나무 |
| `gui-prop-dead-grove.png` | 2048×512 투명, 4칸 | qing-prop-bamboo-clump | 나무 무리 |
| `gui-prop-ruin-rock.png` | 2048×512 투명, 4칸 | qing-prop-boulder | 바위 |
| `gui-prop-talisman.png` | 2048×512 투명, 4칸 | qing-prop-reeds | 지도 가장자리 장식 |
| `gui-house.png` | 1024×1024 투명 | qing-house | 전장 안 적 쪽 건물 |

### ChatGPT 프롬프트 (각각 따로, 끝에 [공통 문장])

**바닥 타일 10장** — 모두 같은 앞문장:
> A seamless tileable top-down ground texture, viewed straight down at 90 degrees with no perspective and no cast shadows, 1024×1024, edges tile perfectly on all four sides. {내용} Palette: ash grey, cold slate, muted violet shadows, bone white, desaturated dead grass, rare faint violet glow. [공통 문장]

`{내용}`:
1. `gui-ground` → `Grey ash soil with cracked dark earth, sparse withered grass tufts, small bone-white pebbles and a few fallen dead leaves; medium brightness so dark-armoured figures stand out on it.`
2. `gui-road` → `A worn road of packed grey ash and broken old paving stones with faint cart ruts; the road fills the whole tile edge to edge, no curbs, no darker border strips at the sides.`
3. `gui-bush` → `Dense withered undergrowth seen from above: dry thorny shrubs, dead ferns, brittle grey-violet brambles and a few pale mushrooms, packed together.`
4. `gui-field` → `An open clearing of pale dead grass and dry reeds lying flat, scattered small bones and grey stones, a few faint violet wildflowers.`
5. `gui-stone` → `A paved courtyard of cracked grey flagstones, some tilted or missing, with ash and dead moss in the joints and a few faded paper talisman scraps.`
6. `gui-hill` → `A low rocky rise of grey shale and ash, loose scree, sparse dry grass; slightly lighter than the surrounding ground so it reads as higher ground.`
7. `gui-canopy` → `A dense dead forest seen from directly above: tightly packed crowns of leafless twisted grey branches with a few dark withered pines, deep shadowy gaps between the trees, no ground visible; clearly an impassable wall of trees.`
8. `gui-cliff-top` → `A highland plateau on top of a cliff: grey ash soil with exposed flat slate slabs, cracks, lichen in bone white and dull violet, a few withered shrubs; slightly paler than the lowland ground.`
9. `gui-gorge` → `A narrow ravine floor: packed grey gravel and ash trail with scattered flat stones, small fallen rocks and a few old paper talismans pressed into the dirt; the trail fills the whole tile edge to edge, no borders or stripes.`
10. `gui-ridge` → `A bare rocky ridge: jagged dark slate outcrops and boulders packed together with deep cracks, a few dead shrubs and faint violet crystals in the crevices; clearly impassable terrain.`

**절벽 면 1장**:
11. `gui-cliff-face`
> A horizontal strip of a natural rock cliff face for a game map edge, true isometric projection (35.26° — the cliff's base line rises from lower left to upper right with a slope of 0.707, i.e. 1 pixel up for every 1.414 pixels across), no perspective. Layered dark slate and ash-grey rock strata with cracks and ledges, dead roots and withered grass hanging over the top edge, a few faded paper talismans tied to roots, loose stones at the foot. The strip is 1024×512 with a transparent background, the left and right ends cut cleanly so identical copies join end to end seamlessly. Height of the cliff about one third of the canvas height. Light from the upper left. No ground shadow. Palette: ash grey, cold slate, muted violet shadows, bone white, desaturated dead grass. [공통 문장]

**소품 시트 4장** — 모두 같은 앞문장:
> A single {소품} standing alone, isometric view from 30 degrees above (2:1 dimetric, no vanishing point), base touching the bottom 3% of the canvas, transparent background, no ground shadow. Make 4 slightly different variations side by side on a 2048×512 sheet with clear transparent space between them (each variation centered in its own 512×512 cell). Palette: ash grey, cold slate, muted violet shadows, bone white, desaturated dead grass. [공통 문장]

`{소품}`:
12. `gui-prop-dead-tree` → `dead twisted leafless tree with grey bark and a few hanging paper charms, about as tall as four soldiers`
13. `gui-prop-dead-grove` → `tight cluster of three or four thin withered dead trees and dry thorn bushes growing together`
14. `gui-prop-ruin-rock` → `cracked grey boulder with an old carved rune and dead moss, some variations a fallen ruin pillar fragment`
15. `gui-prop-talisman` → `low talisman pole or tilted grave marker with fluttering paper charms and dry reeds at its base, knee to waist height of a soldier`

**건물 1장**:
16. `gui-house`
> A single ruined village house of the undead realm, isometric view from 30 degrees above (2:1 dimetric, no vanishing point), East-Asian fantasy architecture with a curved tiled roof that is partly broken, grey weathered wooden walls, torn violet banners and paper talismans on the door, a stone base, base touching the bottom 3% of the canvas, transparent background, no ground shadow, no people. Palette: ash grey, cold slate, muted violet shadows, bone white, desaturated dead grass, rare faint violet glow. [공통 문장]

### 검수(받은 뒤)
- [ ] 바닥 10장: 2×2로 붙여 이음새·줄무늬·큰 반복 무늬 없음, 원근·그림자 없음
- [ ] 바닥이 너무 어둡지 않음(검은 갑주 망자군·청록 아군이 위에서 또렷이 보임), 숲 벽(canopy)·능선(ridge)은 맨땅보다 확실히 어둡고 지나갈 수 없어 보임
- [ ] 절벽 면: 아랫선 기울기 약 0.7, 두 장을 이었을 때 끊김 없음, 투명 배경
- [ ] 소품 시트: 512 네 칸 각각 한 물체, 칸을 넘지 않음, 발밑이 칸 아래쪽
- [ ] 글자·사람·그림자 방향·흐림 없음, 도트 4×4 느낌(조금 매끈하면 `tools/pixelize.py`로 맞춤)

### 게임에 넣기(그림이 올라오면 Claude가 연결)
- `HD_ART_FILES`에 16장을 추가하고, 귀왕 지역(theme `gui`)에서는 `HP`·`hdPropArt`·`HD_HOUSE`가 `qing-*` 대신 같은 짝의 `gui-*`를 쓰게 한다. 소품 발 위치(`HD_PROP_FOOT`)는 받은 그림에서 다시 잰다. 충돌·사격 차단·길찾기는 지형 마스크 그대로라 변하지 않는다.
