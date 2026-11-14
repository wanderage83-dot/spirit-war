#!/usr/bin/env python3
"""요청 10 정지 4방향(규격본 PNG) → 게임용 파생 파일.

art-requests/request-10-standing/exports/<name>/<name>-<dir>.png 를 읽어
characters/illust/dir/<name>/<dir>.webp (무손실) 로 저장한다. 원본 PNG는 건드리지 않는다.

- 좌우 반전·재채색·덧그림 없음. 한 인물의 네 방향을 같은 상자로 잘라
  발 기준점·머리 위 기준점이 네 방향에서 같은 비율에 오게 한다(방향 전환 때 크기·위치 고정).
- 기준점은 규격본 명세(exports/manifest.json)의 target_foot_anchor·display_head_to_foot_height를 쓴다.
  귀왕은 검 끝 때문에 발 기준선이 y=223(다른 보병 239)이다.
- 결과 기준점 표를 stdout에 JS 한 줄(ILLUST_META)로 출력한다.

사용: python3 tools/illust-leaders.py
"""
import hashlib, json, os, sys
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'art-requests/request-10-standing/exports')
OUT = os.path.join(ROOT, 'characters/illust/dir')
DIRS = ['fr', 'fl', 'br', 'bl']
PAD = 2

man = json.load(open(os.path.join(SRC, 'manifest.json')))
by = {}
for it in man['images']:
    by.setdefault(it['name'], {})[it['direction']] = it

meta = {}
for name in sorted(by):
    d = by[name]
    assert set(d) == set(DIRS), (name, d.keys())
    ims = {}
    for k in DIRS:
        it = d[k]
        p = os.path.join(ROOT, 'art-requests/request-10-standing', it['file'])
        raw = open(p, 'rb').read()
        if hashlib.sha256(raw).hexdigest() != it['sha256']:
            sys.exit('해시 불일치: ' + p)
        im = Image.open(p).convert('RGBA')
        assert list(im.size) == it['size'], (p, im.size)
        ims[k] = im
    fx, fy = d['fr']['target_foot_anchor']
    hh = d['fr']['display_head_to_foot_height']
    for k in DIRS:
        assert d[k]['target_foot_anchor'] == [fx, fy], (name, k)
        assert abs(d[k]['display_head_to_foot_height'] - hh) < 1e-6, (name, k)
    W, H = ims['fr'].size
    x0, y0, x1, y1 = W, H, 0, 0
    for im in ims.values():
        b = im.getchannel('A').getbbox()
        x0, y0, x1, y1 = min(x0, b[0]), min(y0, b[1]), max(x1, b[2]), max(y1, b[3])
    x0, y0, x1, y1 = max(0, x0 - PAD), max(0, y0 - PAD), min(W, x1 + PAD), min(H, max(y1, fy + 1) + PAD)
    os.makedirs(os.path.join(OUT, name), exist_ok=True)
    for k, im in ims.items():
        im.crop((x0, y0, x1, y1)).save(os.path.join(OUT, name, k + '.webp'), 'WEBP', lossless=True, quality=100, method=6)
    cw, ch = x1 - x0, y1 - y0
    # [발 x 비율, 발선 y 비율, 머리 위 y 비율]
    meta[name] = [round((fx - x0) / cw, 4), round((fy - y0) / ch, 4), round((fy - hh - y0) / ch, 4)]

cav = man['cavalry']
print('const ILLUST_META=' + json.dumps(meta, separators=(',', ':')) + ',ILLUST_CAV=' + json.dumps(cav, separators=(',', ':')) + ';')
