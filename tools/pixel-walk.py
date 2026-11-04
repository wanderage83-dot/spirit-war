# 장수 도트 그림(64px 논리 높이, ×4 nearest)에서 걷기 4프레임을 직접 만든다. 그림 생성 서비스가 필요 없다.
# 논리 픽셀로 되돌린 뒤 아래쪽 다리 띠(LEG 비율)를 발 중심에서 좌우로 나눠 엉덩이를 축으로 진자처럼 흔든다(발끝 STRIDE px).
#  1: 한쪽 다리 앞·뒷발 LIFT px 들림  2: 모음  3: 반대 다리 앞  4: 모음. 모든 픽셀을 원본에서 끌어와 구멍이 생기지 않는다.
# 몸통은 그대로 두고(위아래 도약은 게임 코드가 한다), 네 장 모두 원본과 같은 크기라 발 위치·크기가 그대로다.
# 사용: python3 tools/pixel-walk.py [이름...]   (없으면 DIR_READY 전원) → characters/pixel/walk/<이름>/<fr|fl|br|bl>-1..4.webp
import sys,os,re
from PIL import Image
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');UP=4
LEG=float(os.environ.get('LEG','.24'))
def foot(a,w,h):
    xs=n=0
    for y in range(int(h*.85),h):
        for x in range(w):
            if a[x,y]>100:xs+=x;n+=1
    return round(xs/n) if n else w//2
def frames(src,D=None,LIFT=None):
    D=float(os.environ.get('STRIDE','4')) if D is None else D;LIFT=int(os.environ.get('LIFT','2')) if LIFT is None else LIFT
    big=Image.open(src).convert('RGBA');w,h=big.width//UP,big.height//UP;im=big.resize((w,h),Image.NEAREST)
    px=im.load();A=im.getchannel('A').load();fx=foot(A,w,h);top=h-max(5,round(h*LEG))
    out=[]
    for f in range(4):
        o=Image.new('RGBA',(w,h),(0,0,0,0));op=o.load()
        sg=1 if f==0 else -1 if f==2 else 0      # 1·3번: 서로 반대 다리를 앞으로
        for y in range(h):
            t=0 if y<top else (y-top+1)/(h-top)   # 엉덩이(띠 위)는 고정, 발끝으로 갈수록 크게 흔든다(진자)
            for x in range(w):
                if y<top or sg==0:op[x,y]=px[x,y];continue
                left=x<fx;off=(-D if left else D)*t*sg   # 왼다리·오른다리가 반대로
                sx=round(x-off);sy=y
                back=(left and sg<0) or (not left and sg>0)   # 뒤로 간 발은 살짝 든다
                if back and y>=h-LIFT-2:sy=y+LIFT
                if (sx<fx)!=left:sx=fx-1 if left else fx     # 반대쪽 다리에서 끌어오지 않고 경계 픽셀로 늘린다
                op[x,y]=px[sx,sy] if 0<=sx<w and 0<=sy<h else (0,0,0,0)
        out.append(o.resize((w*UP,h*UP),Image.NEAREST))
    return out
if __name__=='__main__':
    s=open(os.path.join(root,'index.html'),encoding='utf8').read()
    ready=dict(re.findall(r'"?([\w-]+)"?:\'([a-z,]+)\'',re.search(r'DIR_READY=\{([^}]*)\}',s).group(1)))
    LEFT={'heukcheol','mujin','gui-ruler','zhu-ruler'}
    for n in (sys.argv[1:] or sorted(ready)):
        native='fl' if n in LEFT else 'fr';keys={native:f'characters/pixel/{n}.webp'}
        for k in ready.get(n,'').split(','):
            if k:keys[k]=f'characters/pixel/dir/{n}/{k}.webp'
        d=os.path.join(root,'characters','pixel','walk',n);os.makedirs(d,exist_ok=True)
        for k,p in keys.items():
            for i,fr in enumerate(frames(os.path.join(root,p))):fr.save(os.path.join(d,f'{k}-{i+1}.webp'),'WEBP',lossless=True,quality=100,method=6)
        print('완료',n,','.join(sorted(keys)))
