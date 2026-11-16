# 두 사람의 링

선수 2명(홍코너·청코너)과 관중 30명이 들어오는 3D 대결 방. 정적 `index.html`과 Vercel 함수 `api/ring.js`, 저장소는 Upstash Redis(REST).

- 이 브랜치는 사신전기와 공유 기록이 없는 별도 역사다. **main에 병합하지 않는다.**
- 환경 변수: `RING_PASSWORD`(입장 암호), `KV_REST_API_URL`/`KV_REST_API_TOKEN`(Vercel Storage에서 Upstash를 연결하면 자동).
- 점검: `GET /api/ring?selftest=1` → `{"store":true,"password":true,"sync":"ok","data":"ok","atk":"ok"}`.
- 규칙: 둘 다 「준비 완료」 → 3초 뒤 90초 경기. 잽 5·스트레이트 9·어퍼컷 15, 가드는 80% 막음(어퍼컷은 50%), 피하기 0.55초. KO 못 하면 남은 체력으로 판정, 경기 중 링을 내려가거나 나가면 기권. 한쪽 응원이 20 넘게 앞서면 그 선수 주먹 +1.
- 대화: 선수는 30초에 한 번(서버가 판정), 관중석 대화는 따로 제한 없음. 🤝 화해를 두 선수가 6초 안에 서로 하면 화해의 악수.
