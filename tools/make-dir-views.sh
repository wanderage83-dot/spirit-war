#!/usr/bin/env bash
# 장수 20명의 45도 4방향(fr 앞-오른쪽·fl 앞-왼쪽·br 뒤-오른쪽·bl 뒤-왼쪽) 중 원본이 아닌 3방향을 sprite-gen으로 그린 뒤
# 도트로 바꿔 characters/pixel/dir/<이름>/<방향>.webp에 저장하고, index.html의 DIR_READY를 자동으로 고친다.
# 사용자 컴퓨터에서 실행한다(ChatGPT/Codex 로그인 필요).
#   SG=~/sprite-gen bash tools/make-dir-views.sh              # 아직 없는 그림 전부
#   SG=~/sprite-gen bash tools/make-dir-views.sh hoyeon dansim # 일부만
#   FORCE=1 SG=~/sprite-gen bash tools/make-dir-views.sh dansim   # 이미 있어도 다시 그림
set -uo pipefail
cd "$(dirname "$0")/.."
SG=${SG:-$HOME/sprite-gen}; OUT=${OUT:-$HOME/sg-dir}; FORCE=${FORCE:-0}
BIN="$SG/.venv/bin/sprite-gen"; [ -x "$BIN" ] || { echo "sprite-gen이 없습니다: $BIN (SG=설치폴더 로 지정)"; exit 1; }
PY=$(command -v python3); "$PY" -c "import PIL" 2>/dev/null || PY="$SG/.venv/bin/python"
names=("$@"); [ ${#names[@]} -eq 0 ] && names=(hero xuan-ruler bai-ruler zhu-ruler gui-ruler biyeon dansim hoyeon mukcheol unhak baekryun dogyeom eunrang haerin heukcheol hongyeom mujin sayul seolhwa yeonbaek)
fail=()
for n in "${names[@]}"; do
  src=$(ls "$n.webp" "characters/$n.webp" "characters/factions/$n.webp" 2>/dev/null | head -1)
  [ -z "$src" ] && { echo "그림 없음: $n"; continue; }
  # 원본이 왼쪽을 보는 4명은 fr을, 나머지는 fl을 새로 그린다
  case $n in heukcheol|mujin|gui-ruler|zhu-ruler) keys=(fr br bl);; *) keys=(fl br bl);; esac
  # 말을 탄 장수(원본 그림 기준)
  plan=(); horse=""; case $n in biyeon|hoyeon|sayul) plan=(--body-plan "the rider=biped" --body-plan "the horse=quadruped"); horse=", riding the same horse as in the reference, the whole horse visible and facing the same way";; esac
  mkdir -p "$OUT/$n" "characters/pixel/dir/$n"
  for k in "${keys[@]}"; do
    dst="characters/pixel/dir/$n/$k.webp"
    [ "$FORCE" != 1 ] && [ -f "$dst" ] && { echo "이미 있음(건너뜀): $dst"; continue; }
    case $k in fr) dir=front_diagonal; face=right;; fl) dir=front_diagonal; face=left;; br) dir=back_diagonal; face=right;; bl) dir=back_diagonal; face=left;; esac
    echo "== $n $k ($dir, $face)"
    if "$BIN" gen --provider codex --ref "$src" --direction $dir --facing $face "${plan[@]}" \
         --transparent --trim-alpha --out "$OUT/$n/$k.png" \
         --prompt "The same character as the reference${horse}, full body, same outfit, weapon, hair, colors and cute chibi SD proportions, standing pose, clean dark-brown outlines, soft cel shading, transparent background"; then
      "$PY" tools/pixelize.py "characters/pixel/dir/$n" "$OUT/$n/$k.png" && echo "완료: $dst"
    else
      echo "실패: $n $k"; fail+=("$n:$k")
    fi
  done
done
"$PY" tools/dir-ready.py
[ ${#fail[@]} -gt 0 ] && echo "실패한 그림(다시 실행하면 그것만 다시 그림): ${fail[*]}"
echo "원본 그림($OUT)과 비교해 얼굴·무기·색·방향이 다르면 FORCE=1 로 그 이름만 다시 실행한다."
