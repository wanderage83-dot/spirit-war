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


def recolor(im, f, name='', head=None):
  if f == 'bai' and head is None:
    return recolor_bai(im, name)
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


def recolor_bai(im, name=''):
  """백호: 머리·얼굴·머리카락만 남기고 옷·갑옷·장식을 모두 하양으로(노랑·주황·갈색 천도 바랜다). 말 탄 인물은 말도 흰말로."""
  im = im.convert('RGBA'); a = np.asarray(im).astype(float) / 255
  rgb, al = a[..., :3], a[..., 3]
  h, s, v = rgb2hsv(rgb); hd = h * 360; vis = al > .05
  ys = np.where(vis.any(1))[0]
  top, bot = (ys[0], ys[-1]) if len(ys) else (0, al.shape[0] - 1)
  hh = max(bot - top, 1)
  yy = np.arange(al.shape[0])[:, None] * np.ones((1, al.shape[1]))
  if name in MOUNTED:   # 말 머리가 사람 머리 높이까지 올라오므로 사람 머리 둘레만 남긴다
    xx = np.arange(al.shape[1])[None, :] * np.ones((al.shape[0], 1))
    band = vis[top:int(top + hh * .14)]; cx = np.where(band.any(0))[0].mean() if band.any() else al.shape[1] / 2
    inh = (yy < top + hh * .42) & (np.abs(xx - cx) < hh * .21)
    red = ((hd < 8) | (hd > 330)) & (s >= .45)
    hair = ((v < .55) & ~red) | ((hd >= 8) & (hd <= 34) & (s >= .3) & (v < .7))
    face = (hd >= 5) & (hd <= 45) & (s >= .05) & (s <= .62) & (v >= .5)
    wgt = np.where(inh & (hair | face), 0, 1.)
    cloth = vis & (wgt > 0) & (v >= .1) & ~((v < .3) & (s < .5))
  else:
    hy = top + hh * HEAD.get(name, .36); ramp = hh * .05
    wgt = np.clip((yy - hy) / max(ramp, 1), 0, 1)
    skin = (hd >= 0) & (hd <= 42) & (s >= .08) & (s <= .62) & (v >= .58)
    cloth = vis & (wgt > 0) & (v >= .1) & ~((v < .3) & (s < .5)) & ~(skin & (yy < top + hh * .62) & (s < .45))
  S, V = s.copy(), v.copy()
  S[cloth] = s[cloth] * .1; V[cloth] = np.clip(.42 + v[cloth] * .7, 0, 1)
  out = hsv2rgb(h, S, V); w = (wgt * cloth)[..., None]
  out = rgb * (1 - w) + out * w
  return Image.fromarray((np.clip(np.concatenate([out, al[..., None]], -1), 0, 1) * 255 + .5).astype(np.uint8), 'RGBA')


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
    recolor(Image.open(src), f, os.path.basename(os.path.dirname(rel)) if '/dir/' in rel or '/walk/' in rel else os.path.splitext(os.path.basename(rel))[0]).save(dst, 'WEBP', lossless=pixel, quality=90, method=6)
    n += 1
  print('만든 그림', n)


def sheet(path, kind='pixel'):
  W, H = 200, 240
  names = list(CHARS)
  out = Image.new('RGB', (W * 8, H * 4), (70, 90, 70))
  for i, n in enumerate(names):
    f, vn, face = CHARS[n]
    rel = {'pixel': 'characters/pixel/%s.webp' % n, 'vn': vn, 'face': face}[kind]
    a = Image.open(os.path.join(ROOT, rel)).convert('RGBA'); b = recolor(a, f, n)
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
