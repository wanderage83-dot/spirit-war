# 걷기 그림이 없는 병종(지금 공병 eng)의 걷기 4프레임을 방향 그림에서 코드로 만든다(tools/pixel-walk.py와 같은 방식, 고해상도 일러스트용).
# 그림 아래쪽 다리 띠(LEG 비율, 그림 실루엣 높이 기준)를 발 중심에서 좌우로 나눠 엉덩이를 축으로 진자처럼 흔든다(발끝 STRIDE·뒷발 LIFT, 실루엣 높이 비율).
#  1: 한쪽 다리 앞·뒷발 들림  2: 원본  3: 반대 다리 앞  4: 원본. 모든 픽셀을 원본에서 끌어와 구멍이 없고, 네 장 크기·발 위치가 원본과 같다.
# 사용: python3 tools/soldier-code-walk.py eng   → characters/soldier-walk/<병종>/<fr|fl|br|bl>-1..4.webp, 끝에 dir-ready.py로 SOLDIER_WALK_READY 갱신
import sys,os,subprocess
import numpy as np
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__));root=os.path.join(here,'..')
LEG=float(os.environ.get('LEG','.26'));STRIDE=float(os.environ.get('STRIDE','.05'));LIFT=float(os.environ.get('LIFT','.03'))
def frames(src):
    im=np.array(Image.open(src).convert('RGBA'));h,w=im.shape[:2];a=im[...,3]
    ys=np.where(a.max(1)>100)[0];top0,bot=ys[0],ys[-1];fh=bot-top0+1
    band=a[max(0,bot-int(fh*.05)):bot+1]>100;fx=int(round(np.nonzero(band)[1].mean()))
    top=bot-int(round(fh*LEG));D=fh*STRIDE;L=int(round(fh*LIFT))
    yy,xx=np.mgrid[0:h,0:w];out=[]
    for sg in (1,0,-1,0):
        if sg==0:out.append(im.copy());continue
        t=np.clip((yy-top+1)/(bot-top+1),0,1);t[yy<top]=0;left=xx<fx
        off=np.where(left,-D,D)*t*sg;sx=np.rint(xx-off).astype(int)
        back=(left&(sg<0))|(~left&(sg>0));sy=np.where(back&(yy>=bot-L-2)&(yy>=top),yy+L,yy)
        sx=np.where(left&(sx>=fx),fx-1,sx);sx=np.where(~left&(sx<fx),fx,sx)
        ok=(sx>=0)&(sx<w)&(sy>=0)&(sy<h);o=np.zeros_like(im);o[ok]=im[sy[ok],sx[ok]]
        out.append(o)
    return [Image.fromarray(f) for f in out]
SRC={'eng':{'fr':'eng.webp','fl':'characters/soldier-dir/eng/fl.webp','br':'characters/soldier-dir/eng/br.webp','bl':'characters/soldier-dir/eng/bl.webp'}}
for t in (sys.argv[1:] or ['eng']):
    d=os.path.join(root,'characters','soldier-walk',t);os.makedirs(d,exist_ok=True)
    for k,p in SRC[t].items():
        for i,f in enumerate(frames(os.path.join(root,p))):f.save(os.path.join(d,f'{k}-{i+1}.webp'),'WEBP',quality=92,method=6)
    print('완료',t)
subprocess.run([sys.executable,'-I',os.path.join(here,'dir-ready.py')],check=True)
