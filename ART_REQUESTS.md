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

## 요청 1 · 호송 수레 3종 — 상태: 대기

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
