# 사신전기 아트 라이브러리

그림을 찾아 다음 작업에 재사용하는 도감이다. **[index.html](index.html)을 브라우저로 열면 된다.** 별도 서버나 빌드 없이도 동작한다. 그림은 기존 경로에 두며 게임의 로딩 경로를 바꾸지 않는다.

최근 제작 묶음은 HD 지형·건물 50장, 천하도 1장, 망자군 PNG 전달본/WebP 게임용 32개로 총 83개다. 전체 목록에는 초상·SD·장수 도트·방향·걷기·진영 의상·일반 병사·서막/대화 배경·기존 지형·수레·효과도 포함한다. 최초 정리 시 957개 파일, 약 32MiB다. PNG/WebP 변형이나 방향·프레임은 각각 한 파일로 센다. 새 그림을 추가한 뒤의 정확한 수는 도감 상단에서 확인한다.

## 찾기와 받기

- 「전체 펼쳐보기」를 누르면 검색·종류·방향 조건을 초기화하고 전체 그림을 작은 썸네일로 한 번에 펼친다. 더 보기 없이 끝까지 스크롤하고 그림을 눌러 확대할 수 있다. 펼친 상태에서도 검색·필터가 적용되며 「카드 보기로 돌아가기」로 상세 카드로 돌아온다. 이미지는 화면 근처에서 불러온다.
- 기본 화면은 최근 제작 묶음이다. 「모든 게임 그림」이나 종류 버튼으로 전체를 탐색한다.
- 이름·파일명·병종·진영 검색과 앞/뒤·좌/우 필터를 쓴다. 예: `무진`, `망자군 기병`, `qing-canopy`, `걷기`.
- 미리보기를 누르면 확대, 크기·알파 범위·용량·SHA-256·사용 문서를 확인한다. 바닥은 「반복 보기」, 투명 그림은 밝은/어두운 체크 배경으로 살핀다.
- 「파일 받기」는 저장소의 파일을 그대로 받는다. 「경로 복사」로 원래 경로를 복사하거나 검색 결과를 JSON으로 저장할 수 있다.
- [catalog.json](catalog.json)은 다른 도구에서 읽는 기계용 목록이다. `catalog.js`는 같은 목록을 담아 로컬 HTML에서 네트워크 요청 없이 읽는다.

## 재사용할 때 함께 볼 정보

걷기는 같은 인물·방향의 1~4번을 묶어 가져간다. HD 소품 시트는 같은 종류의 변형 4개이며 걷기 시트가 아니다.

- **HD 전장**: [크기·시트 분할·발밑·각도](../terrain/hd/README.md), [2차 JSON](../terrain/hd/qing-second-manifest.json), [3차 JSON](../terrain/hd/qing-third-manifest.json).
- **절벽 면**: `qing-cliff-face.png` 아랫선은 약 32.71도로 목표 35.26도에 맞춘 각도·끝점 보정이 필요하다. 상세 창에도 표시한다.
- **망자군**: [방향별 발 위치](../characters/soldier-gui/README.md). 진영색을 덧입히지 않는다. `raw/`는 받은 PNG, 병종 하위 WebP는 게임용이다.
- **천하도**: [그림과 지명/경로 레이어](../terrain/realm/README.md).
- **인물**: [인물·초상·전장 대응표](../ASSETS.md), [인물 JSON](../ASSET_MANIFEST.json).
- **프롬프트**: [ART_REQUESTS.md](../ART_REQUESTS.md)에 화풍·시점·색·작업 이력을 보관한다.
- **효과**: pixelfx 렌더 효과 10장은 [기존 MIT 라이선스](../fx/LICENSE-pixelfx.txt)를 함께 담는다.

## 목록 갱신

저장소 루트에서 Python과 Pillow로 실행한다. `characters/`, `portraits/`, `terrain/`, `story/`, `fc/`, `fx/`와 루트 병종/주인공 그림을 읽는다. 모형 화면·테스트 캡처는 수록하지 않는다.

```bash
python3 tools/asset-library.py build
```

크기·알파·해시를 다시 계산해 `catalog.json`·`catalog.js`를 갱신한다. 이미지와 게임 코드는 수정하지 않는다. 같은 그림에 대해 재생성 결과는 동일하다.

## ZIP 만들기

```bash
# 모든 그림·로컬 도감·프롬프트·사용 문서
python3 tools/asset-library.py pack --output /workspace/exports/spirit-war-art-library.zip

# 최근 제작 묶음만
python3 tools/asset-library.py pack --collection recent --output /workspace/exports/spirit-war-recent-art.zip
```

저장소 밖의 원하는 출력 경로로 바꿔도 된다. ZIP은 Git에 중복 저장하지 않으며 언제든 다시 만들 수 있다. 압축을 풀고 `spirit-war-art/asset-library/index.html`을 연다. 원래 폴더 구조를 보존하므로 오프라인에서 미리보기·검색·개별 파일 열기를 할 수 있다. 최근 묶음 ZIP에는 최근 파일만, 전체 ZIP에는 현재 목록의 모든 그림을 넣는다.
