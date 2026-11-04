# Canva 등 흰 배경으로 받은 그림의 배경을 투명하게 만든다(테두리와 이어진 흰색 + 어두운 테두리에 둘러싸인 흰 구멍만; 흰 옷은 보존).
# 사용: python3 -I tools/unwhite.py <입력.png> <출력.png> [구멍최소픽셀=150] [구멍테두리어둠=90]
import sys
from PIL import Image, ImageFilter
import numpy as np
from collections import deque
src,dst=sys.argv[1],sys.argv[2]
im=np.array(Image.open(src).convert('RGB')).astype(int)
H,W,_=im.shape
dist=255*3-im.sum(2)            # 0=완전 흰색
bgish=dist<60
mask=np.zeros((H,W),bool); q=deque()
for x in range(W):
    for y in (0,H-1):
        if bgish[y,x]: mask[y,x]=1; q.append((y,x))
for y in range(H):
    for x in (0,W-1):
        if bgish[y,x] and not mask[y,x]: mask[y,x]=1; q.append((y,x))
while q:
    y,x=q.popleft()
    for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
        ny,nx=y+dy,x+dx
        if 0<=ny<H and 0<=nx<W and not mask[ny,nx] and bgish[ny,nx]:
            mask[ny,nx]=1; q.append((ny,nx))
# 테두리와 떨어진 흰 구멍(머리카락 사이 배경): 거의 순백·충분히 큰 덩어리만
RT=int(sys.argv[4]) if len(sys.argv)>4 else 300; hole=(dist<24)&~mask; seen=np.zeros((H,W),bool); MINA=int(sys.argv[3]) if len(sys.argv)>3 else 150; nh=0
for y0,x0 in zip(*np.nonzero(hole)):
    if seen[y0,x0]: continue
    comp=[(y0,x0)]; seen[y0,x0]=1; i=0
    while i<len(comp):
        y,x=comp[i]; i+=1
        for dy,dx in ((1,0),(-1,0),(0,1),(0,-1)):
            ny,nx=y+dy,x+dx
            if 0<=ny<H and 0<=nx<W and hole[ny,nx] and not seen[ny,nx]: seen[ny,nx]=1; comp.append((ny,nx))
    ring=[dist[y+dy,x+dx] for y,x in comp for dy,dx in ((3,0),(-3,0),(0,3),(0,-3)) if 0<=y+dy<H and 0<=x+dx<W and not hole[y+dy,x+dx]]
    if len(comp)>=MINA and ring and np.mean(ring)>RT:
        nh+=1
        for y,x in comp: mask[y,x]=1
print('holes',nh)
a=np.where(mask,0,255).astype(np.uint8)
A=Image.fromarray(a).filter(ImageFilter.MinFilter(3)).filter(ImageFilter.GaussianBlur(1))
out=Image.open(src).convert('RGBA'); out.putalpha(A)
bb=A.point(lambda v:255 if v>40 else 0).getbbox(); out=out.crop(bb)
out.save(dst); print(out.size)
