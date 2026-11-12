#!/usr/bin/env python3
"""장수·군주 그림의 옷 색을 진영색으로 바꾼 사본을 fc/ 아래에 만든다(원본은 그대로).

청룡=파랑, 주작=빨강, 현무=검정, 백호=하양. 귀왕군·통일파는 만들지 않는다. 초상(배경이 있는 불투명 그림)은 바꾸지 않는다.
머리(그림 위쪽 36%, 말 탄 인물 27%)는 그대로 두고, 그 아래에서 피부·진한 갈색(말·가죽·나무)·금을 뺀 천만 바꾼다.
게임은 FACTION_OUTFIT=true일 때 fcSrc()로 fc/<원래 경로>를 읽는다. false로 두면 원래 그림.

사용: python3 tools/faction-outfit.py            # 전부 다시 만들기
      python3 tools/faction-outfit.py --only bai         # 한 진영만
      python3 tools/faction-outfit.py --sheet out.png   # 비교 시트만
"""
import os, sys, glob
import numpy as np
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
# 이름(원본 파일명) → 진영, 대화 이등신, 초상
CHARS = {
  'hero': ('qing', 'hero.webp', 'portraits/qing.webp'),
  'mukcheol': ('qing', 'characters/mukcheol.webp', 'portraits/companions/mukcheol.webp'),
  'dansim': ('qing', 'characters/dansim.webp', 'portraits/companions/dansim.webp'),
  'unhak': ('qing', 'characters/unhak.webp', 'portraits/companions/unhak.webp'),
  'xuan-ruler': ('xuan', 'characters/xuan-ruler.webp', 'portraits/xuan.webp'),
  'seolhwa': ('xuan', 'characters/factions/seolhwa.webp', 'portraits/factions/seolhwa.webp'),
  'yeonbaek': ('xuan', 'characters/factions/yeonbaek.webp', 'portraits/factions/yeonbaek.webp'),
  'dogyeom': ('xuan', 'characters/factions/dogyeom.webp', 'portraits/factions/dogyeom.webp'),
  'bai-ruler': ('bai', 'characters/bai-ruler.webp', 'portraits/bai.webp'),
  'hoyeon': ('bai', 'characters/hoyeon.webp', 'portraits/companions/hoyeon.webp'),
  'eunrang': ('bai', 'characters/factions/eunrang.webp', 'portraits/factions/eunrang.webp'),
  'sayul': ('bai', 'characters/factions/sayul.webp', 'portraits/factions/sayul.webp'),
  'zhu-ruler': ('zhu', 'characters/zhu-ruler.webp', 'portraits/zhu.webp'),
  'biyeon': ('zhu', 'characters/biyeon.webp', 'portraits/companions/biyeon.webp'),
  'hongyeom': ('zhu', 'characters/factions/hongyeom.webp', 'portraits/factions/hongyeom.webp'),
  'haerin': ('zhu', 'characters/factions/haerin.webp', 'portraits/factions/haerin.webp'),
}
HUE = {'qing': 212 / 360, 'zhu': 356 / 360, 'xuan': 228 / 360, 'bai': 40 / 360}


def rgb2hsv(a):
  r, g, b = a[..., 0], a[..., 1], a[..., 2]
  mx = a.max(-1); mn = a.min(-1); d = mx - mn
  h = np.zeros_like(mx)
  m = d > 1e-6
  rc = np.where(m, (mx - r) / np.where(m, d, 1), 0); gc = np.where(m, (mx - g) / np.where(m, d, 1), 0); bc = np.where(m, (mx - b) / np.where(m, d, 1), 0)
  h = np.where(r == mx, bc - gc, np.where(g == mx, 2 + rc - bc, 4 + gc - rc))
  h = np.where(m, (h / 6) % 1, 0)
  s = np.where(mx > 1e-6, d / np.where(mx > 1e-6, mx, 1), 0)
  return h, s, mx


def hsv2rgb(h, s, v):
  i = np.floor(h * 6).astype(int) % 6; f = h * 6 - np.floor(h * 6)
  p = v * (1 - s); q = v * (1 - s * f); t = v * (1 - s * (1 - f))
  out = np.zeros(h.shape + (3,))
  for k, (R, G, B) in enumerate([(v, t, p), (q, v, p), (p, v, t), (p, q, v), (t, p, v), (v, p, q)]):
    m = i == k
    out[..., 0][m] = R[m]; out[..., 1][m] = G[m]; out[..., 2][m] = B[m]
  return out


MOUNTED = {'hoyeon', 'biyeon', 'sayul'}
HEAD = {'hoyeon': .4, 'sayul': .4, 'biyeon': .36, 'bai-ruler': .4, 'eunrang': .38}   # 머리 끝(그림 높이 비율)


def recolor(im, f, name='', head=None, key='fr'):
  if f == 'bai' and head is None:
    return recolor_bai(im, name, key)
  """머리(그림 위쪽 head 비율)는 그대로, 그 아래 몸에서 피부·진한 갈색(말·가죽·나무)·금을 뺀 천을 진영색으로."""
  im = im.convert('RGBA'); a = np.asarray(im).astype(float) / 255
  rgb, al = a[..., :3], a[..., 3]
  h, s, v = rgb2hsv(rgb)
  hd = h * 360
  vis = al > .05
  ys = np.where(vis.any(1))[0]
  top, bot = (ys[0], ys[-1]) if len(ys) else (0, al.shape[0] - 1)
  if head is None:
    head = HEAD.get(name, .36)
  hy = top + (bot - top) * head; ramp = (bot - top) * .05
  yy = np.arange(al.shape[0])[:, None] * np.ones((1, al.shape[1]))
  wgt = np.clip((yy - hy) / max(ramp, 1), 0, 1)   # 머리 경계를 부드럽게
  body = wgt > 0
  skin = (hd >= 0) & (hd <= 42) & (s >= .08) & (s <= .62) & (v >= .58)
  brown = (hd >= 8) & (hd <= 52) & (s >= .38)        # 말·가죽·나무·금장식
  warm = (hd >= 5) & (hd <= 60)
  cloth = vis & body & ~skin & ~brown & (v >= .12)
  if f == 'bai':   # 하양은 갈색·베이지 천까지 바랜다(말 탄 인물은 진한 갈색 말을 남긴다)
    cloth = vis & body & ~skin & (v >= .12)
    if name in MOUNTED:
      cloth &= ~(warm & (s >= .3))
  if name in MOUNTED:   # 아래쪽 말 몸통은 따뜻한 색을 건드리지 않는다
    horse = np.zeros_like(vis); horse[int(top + (bot - top) * .6):] = True
    cloth &= ~(horse & warm)
  H, S, V = h.copy(), s.copy(), v.copy()
  t = HUE[f]
  if f in ('qing', 'zhu'):
    H[cloth] = t; S[cloth] = np.clip(.38 + s[cloth] * .55, 0, .9); V[cloth] = v[cloth] * .96
  elif f == 'xuan':
    H[cloth] = t; S[cloth] = .14; V[cloth] = v[cloth] * .5
  else:  # bai
    S[cloth] = s[cloth] * .18; V[cloth] = np.clip(.3 + v[cloth] * .78, 0, 1)
  out = hsv2rgb(H, S, V)
  w = (wgt * cloth)[..., None]
  out = rgb * (1 - w) + out * w
  res = np.concatenate([out, al[..., None]], -1)
  return Image.fromarray((np.clip(res, 0, 1) * 255 + .5).astype(np.uint8), 'RGBA')


def _sc(p, k):
  return [(round(x / k), round(y / k)) for x, y in p]


# 말 탄 백호 장수(호연·사율)는 말과 옷 색이 겹쳐 색으로는 못 가른다. 그림마다 사람 몸통 윤곽(그 그림의 픽셀 좌표)을 잡아 그 안만 하양으로,
# 목도리·망토처럼 사람에게만 있는 진한 빨강·주황은 윤곽 밖에서도(그림 위 60%) 하양으로. 말은 원래 색. 걷기 프레임은 같은 방향의 기본 그림 윤곽을 쓴다.
RIDER_POLY = {
  'hoyeon': {'fr': [(60, 95), (135, 95), (140, 170), (120, 185), (75, 185), (55, 170)],
             'fl': [(70, 95), (150, 95), (160, 170), (140, 190), (90, 190), (75, 170)],
             'br': [(55, 95), (135, 95), (140, 170), (120, 185), (70, 185), (50, 170)],
             'bl': [(55, 95), (135, 95), (140, 170), (120, 185), (70, 185), (50, 170)],
             'vn': _sc([(10, 190), (130, 175), (280, 215), (300, 245), (260, 300), (290, 330), (290, 470), (220, 480), (130, 500), (90, 480), (85, 400), (110, 330), (20, 250)], 600 / 512)},
  'sayul': {'fr': [(90, 90), (160, 90), (160, 150), (145, 175), (140, 210), (112, 210), (105, 170), (88, 150)],
            'fl': [(96, 90), (166, 90), (168, 150), (150, 170), (146, 210), (118, 210), (110, 170), (94, 150)],
            'br': [(60, 100), (140, 100), (142, 150), (125, 162), (78, 162), (58, 150)],
            'bl': [(80, 100), (160, 100), (162, 150), (145, 162), (98, 162), (78, 150)],
            'vn': _sc([(30, 190), (170, 175), (240, 190), (370, 215), (360, 300), (330, 330), (335, 420), (300, 490), (240, 490), (230, 400), (240, 330), (180, 300), (130, 280), (30, 300)], 600 / 491)},
}


# 목도리 색 규칙을 쓸 가로 범위(사율은 주황 마구가 있는 말 머리 쪽을 뺀다)
SCARF_X = {'sayul': {'fr': (0, 162), 'fl': (92, 256), 'br': (0, 142), 'bl': (78, 220), 'vn': (0, 300)}}


def _white(rgb, h, s, v, al, cloth, wgt):
  S, V = s.copy(), v.copy()
  S[cloth] = s[cloth] * .1; V[cloth] = np.clip(.42 + v[cloth] * .7, 0, 1)
  out = hsv2rgb(h, S, V); w = (wgt * cloth)[..., None]
  out = rgb * (1 - w) + out * w
  return Image.fromarray((np.clip(np.concatenate([out, al[..., None]], -1), 0, 1) * 255 + .5).astype(np.uint8), 'RGBA')


def recolor_bai(im, name='', key='fr'):
  """백호: 머리·얼굴·머리카락만 남기고 옷·갑옷·장식을 하양으로(노랑·주황·갈색 천도 바랜다). 말 탄 인물은 사람만, 말은 그대로."""
  from PIL import ImageDraw
  im = im.convert('RGBA'); a = np.asarray(im).astype(float) / 255
  rgb, al = a[..., :3], a[..., 3]
  h, s, v = rgb2hsv(rgb); hd = h * 360; vis = al > .05
  ys = np.where(vis.any(1))[0]
  top, bot = (ys[0], ys[-1]) if len(ys) else (0, al.shape[0] - 1)
  hh = max(bot - top, 1)
  yy = np.arange(al.shape[0])[:, None] * np.ones((1, al.shape[1]))
  dark = (v < .3) & (s < .5)
  if name in RIDER_POLY:
    m = Image.new('L', im.size, 0); ImageDraw.Draw(m).polygon(RIDER_POLY[name].get(key, RIDER_POLY[name]['fr']), fill=255)
    zone = np.asarray(m) > 0
    red = ((hd < 10) | (hd > 340)) & (s >= .5) & (v >= .3); scarf = (hd >= 22) & (hd <= 36) & (s >= .64) & (v >= .5)
    xx = np.arange(al.shape[1])[None, :] * np.ones((al.shape[0], 1))
    x0, x1 = SCARF_X.get(name, {}).get(key, (0, al.shape[1]))
    zone = zone | ((red | scarf) & (yy < top + hh * .6) & (xx >= x0) & (xx <= x1))
    headz = yy < top + hh * .42
    face = (hd >= 5) & (hd <= 45) & (s >= .05) & (s <= .62) & (v >= .55) & headz
    hair = ((v < .55) | ((hd >= 8) & (hd <= 34) & (s >= .3) & (v < .7))) & headz & ~red
    cloth = vis & zone & (v >= .1) & ~dark & ~face & ~hair
    return _white(rgb, h, s, v, al, cloth, np.ones_like(v))
  hy = top + hh * HEAD.get(name, .36); ramp = hh * .05
  wgt = np.clip((yy - hy) / max(ramp, 1), 0, 1)
  skin = (hd >= 0) & (hd <= 42) & (s >= .08) & (s <= .62) & (v >= .58)
  cloth = vis & (wgt > 0) & (v >= .1) & ~dark & ~(skin & (yy < top + hh * .62) & (s < .45))
  return _white(rgb, h, s, v, al, cloth, wgt)


def targets():
  for n, (f, vn, face) in CHARS.items():
    yield f, 'characters/pixel/%s.webp' % n
    for p in sorted(glob.glob(os.path.join(ROOT, 'characters/pixel/dir/%s/*.webp' % n))):
      yield f, os.path.relpath(p, ROOT)
    for p in sorted(glob.glob(os.path.join(ROOT, 'characters/pixel/walk/%s/*.webp' % n))):
      yield f, os.path.relpath(p, ROOT)
    yield f, vn


def build(only=None):
  n = 0
  for f, rel in targets():
    if only and f != only:
      continue
    src = os.path.join(ROOT, rel); dst = os.path.join(ROOT, 'fc', rel)
    if not os.path.exists(src):
      print('없음', rel); continue
    os.makedirs(os.path.dirname(dst), exist_ok=True)
    pixel = rel.startswith('characters/pixel/')
    key = 'vn' if not pixel else (os.path.basename(rel)[:2] if '/dir/' in rel or '/walk/' in rel else 'fr')
    recolor(Image.open(src), f, os.path.basename(os.path.dirname(rel)) if '/dir/' in rel or '/walk/' in rel else os.path.splitext(os.path.basename(rel))[0], key=key).save(dst, 'WEBP', lossless=pixel, quality=90, method=6)
    n += 1
  print('만든 그림', n)


def sheet(path, kind='pixel'):
  W, H = 200, 240
  names = list(CHARS)
  out = Image.new('RGB', (W * 8, H * 4), (70, 90, 70))
  for i, n in enumerate(names):
    f, vn, face = CHARS[n]
    rel = {'pixel': 'characters/pixel/%s.webp' % n, 'vn': vn, 'face': face}[kind]
    a = Image.open(os.path.join(ROOT, rel)).convert('RGBA'); b = recolor(a, f, n, key='fr' if kind == 'pixel' else 'vn')
    for j, im in enumerate((a, b)):
      im = im.copy(); im.thumbnail((W - 10, H - 10), Image.NEAREST if kind == 'pixel' else Image.LANCZOS)
      x = ((i % 4) * 2 + j) * W + 5; y = (i // 4) * H + 5
      out.paste(im, (x, y), im)
  out.save(path)


if __name__ == '__main__':
  if '--sheet' in sys.argv:
    p = sys.argv[sys.argv.index('--sheet') + 1]
    sheet(p, sys.argv[sys.argv.index('--sheet') + 2] if len(sys.argv) > sys.argv.index('--sheet') + 2 else 'pixel')
  else:
    build(sys.argv[sys.argv.index('--only') + 1] if '--only' in sys.argv else None)
