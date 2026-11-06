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

## 요청 6 · 전투 필드 지형·건물 다시 그리기(HD-2D 도트 디오라마) — 상태: 프롬프트 준비, 그림 대기

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
2. `road` → `A worn dirt road surface with wheel ruts and scattered flat stones (texture only, the road fills the whole tile).`
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
> A short straight segment of a layered rock cliff wall, isometric view from 30 degrees above, the top surface covered with {진영 윗면} and the cliff face showing stacked rock strata, designed so that copies placed side by side along the diagonal join seamlessly. Transparent background. {진영 색}. [공통 문장]

진영 윗면(`{진영 윗면}`): 청룡 `grass and ferns`, 현무 `snow`, 백호 `dry grass on sandstone`, 주작 `red leaves and moss`, 귀왕 `ash and dead grass`. 파일 이름 `<진영>-cliff.png`, 같은 문장으로 모서리용 `<진영>-cliff-corner.png`도 한 장(「an outer corner piece of the same cliff」).

### D. 건물(등각 시점, 투명 배경) — 크기는 아래 표
공통 앞문장:
> A single {건물}, isometric view from 30 degrees above (2:1 dimetric, no vanishing point), East-Asian fantasy architecture with curved tiled roofs, base touching the bottom 3% of the canvas, transparent background, no ground shadow, no people. {진영 색}. [공통 문장]

| 파일 이름 | 캔버스 | `{건물}` 문장 |
|---|---|---|
| `<진영>-house.png` | 768×768 | `small village house with a curved tiled roof, wooden walls and a stone base` |
| `<진영>-house-long.png` | 1024×768 | `long farmhouse with a storage shed and stacked firewood` |
| `ally-keep.png` | 1024×1024 | `fortified command hall of the player's army: a two-storey keep with a large curved roof, banners and a stone platform` (청룡 색) |
| `ally-wall.png` | 1024×512 | `straight section of a stone fortress wall with crenellations and a wooden walkway, designed to tile side by side` (청룡 색) |
| `ally-tower.png` | 512×1024 | `wooden watchtower with a small tiled roof and an archer platform` |
| `ally-facility-shield.png` | 768×768 | `training yard with shield racks and wooden pells` |
| `ally-facility-spear.png` | 768×768 | `spear training ground with long spear racks` |
| `ally-facility-bow.png` | 768×768 | `archery workshop with bows drying on racks and straw targets` |
| `ally-facility-horse.png` | 768×768 | `horse stable with hay and a water trough` |
| `supply-depot.png` | 768×768 | `field supply depot: stacked rice sacks, crates and a canvas awning` |
| `beacon.png` | 512×768 | `stone signal beacon tower with a fire basin on top (unlit)` |
| `pass-gate.png` | 1024×768 | `heavy wooden pass gate with two log towers and a closed double door, part of a palisade line` |
| `palisade.png` | 1024×512 | `straight section of a sharpened log palisade fence, designed to tile side by side` |
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
