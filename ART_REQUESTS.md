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

## 요청 3 · 장수 4방향(45도 앞·뒤 × 좌·우) — 상태: 진행 중 (2026-11-04, Claude가 Canva MCP로 생성)

장수급 20명은 전투에서 도트 그림으로 나오며, 원본 그림이 바라보는 앞쪽 한 방향 외에 **세 방향을 따로 그려** 뒤집기 없이 쓴다. 파일은 `characters/pixel/dir/<원본이름>/<fr|fl|br|bl>.webp`(앞-오른쪽·앞-왼쪽·뒤-오른쪽·뒤-왼쪽), `index.html`의 `DIR_READY={이름:'fl,br,bl'}`에 등록한다. 원본이 오른쪽을 보면 fl·br·bl, 왼쪽을 보면(흑철·무진·귀왕·주작 군주) fr·br·bl을 만든다.

### Canva로 만드는 순서
1. 원본 전장 그림을 PNG로 바꿔 Canva에 올리고 참고 그림으로 `generate-image`(3:2). 프롬프트: 같은 캐릭터를 해당 45도 방향에서 본 전신, 같은 옷·무기·머리·색·SD 비율, 흰 단색 배경, 그림자·바닥·글자 없음. 기마 장수는 같은 말도 같은 방향.
2. Canva 배경 제거는 유료라 쓰지 않는다. 작업용 디자인(1054×816 페이지) 맨 위에 3:2 그림 세 장을 351×234로 나란히 놓고 PNG(가로 2108, 더 크면 거부됨)로 내보낸다.
3. `python3 -I tools/canva-sheet.py 시트.png <이름> fl,br,bl` → 세 장을 잘라 `tools/unwhite.py`(테두리와 이어진 흰색+어두운 테두리 안의 흰 구멍만 투명) → `tools/pixelize.py`로 저장.
4. `DIR_READY`에 등록, `node tests/dir-art.cjs <URL>`.

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
