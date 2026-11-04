# 장수 전투 그림을 진짜 도트 격자로 바꾼다(64px 논리 높이·40색·1px 외곽선·4배 nearest 저장).
# 사용: python3 tools/pixelize.py <출력폴더> <그림...>   예) python3 tools/pixelize.py characters/pixel hero.webp characters/*.webp characters/factions/*.webp
import sys,glob,os
from PIL import Image,ImageFilter
def pixelize(src,H=64,colors=40,up=4):
    im=Image.open(src).convert('RGBA');bb=im.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox();im=im.crop(bb)
    w=max(1,round(im.width*H/im.height))
    # premultiplied box downscale
    r=im.resize((w,H),Image.BOX)
    a=r.getchannel('A').point(lambda v:255 if v>110 else 0)
    rgb=r.convert('RGB')
    q=rgb.quantize(colors=colors,method=Image.Quantize.MEDIANCUT,dither=Image.Dither.NONE).convert('RGB')
    out=Image.new('RGBA',(w+2,H+2),(0,0,0,0));
    body=q.copy();body.putalpha(a);out.alpha_composite(body,(1,1))
    # 1px dark outline around silhouette
    A=out.getchannel('A');dil=A.filter(ImageFilter.MaxFilter(3));px=out.load();Ap=A.load();Dp=dil.load()
    for y in range(out.height):
        for x in range(out.width):
            if Ap[x,y]==0 and Dp[x,y]>0: px[x,y]=(24,18,22,255)
    return out.resize((out.width*up,out.height*up),Image.NEAREST)
if __name__=='__main__':
    for f in sys.argv[2:]:
        os.makedirs(sys.argv[1],exist_ok=True)
        pixelize(f).save(os.path.join(sys.argv[1],os.path.basename(f).rsplit('.',1)[0]+'.webp'),'WEBP',lossless=True,quality=100,method=6)
