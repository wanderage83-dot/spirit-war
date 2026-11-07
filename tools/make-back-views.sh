#!/usr/bin/env bash
# 장수 20명의 뒷모습(45도 뒤쪽 대각선)을 sprite-gen으로 그린 뒤 도트로 바꾼다.
# 사용자 컴퓨터에서 실행한다(ChatGPT/Codex 로그인 필요). 사용: SG=~/sprite-gen bash tools/make-back-views.sh [이름...]
set -euo pipefail
cd "$(dirname "$0")/.."
SG=${SG:-$HOME/sprite-gen}; OUT=${OUT:-$HOME/sg-back}; mkdir -p "$OUT" characters/pixel/back
names=("$@"); [ ${#names[@]} -eq 0 ] && names=(hero xuan-ruler bai-ruler zhu-ruler gui-ruler biyeon dansim hoyeon mukcheol unhak baekryun dogyeom eunrang haerin heukcheol hongyeom mujin sayul seolhwa yeonbaek)
for n in "${names[@]}"; do
  src=$(ls "$n.webp" "characters/$n.webp" "characters/factions/$n.webp" 2>/dev/null | head -1)
  [ -z "$src" ] && { echo "그림 없음: $n"; continue; }
  facing=right; case $n in gui-ruler|zhu-ruler) facing=left;; esac
  plan=(); case $n in biyeon|hoyeon|sayul|heukcheol) plan=(--body-plan "the horse=quadruped");; esac
  "$SG/.venv/bin/sprite-gen" gen --provider codex --ref "$src" --direction back_diagonal --facing $facing "${plan[@]}" \
    --transparent --trim-alpha --out "$OUT/$n.png" \
    --prompt "The same character as the reference, seen from behind at a 45-degree back diagonal, full body, same outfit, weapon, colors and cute chibi SD proportions, standing pose, transparent background"
  python3 tools/pixelize.py characters/pixel/back "$OUT/$n.png"
  echo "완료: characters/pixel/back/$n.webp"
done
echo "index.html의 BACK_READY=[] 에 만든 이름을 넣는다. 예: BACK_READY=['hero','mukcheol']"
