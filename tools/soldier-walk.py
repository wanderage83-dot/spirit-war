# ChatGPT/Codex에서 받은 병사 걷기 시트(한 줄에 4동작, 같은 너비 4칸)를 게임 규격으로 넣는다.
# 파일 이름: <병종>-<방향>.png|webp  (병종 shield bow spear horse, 방향 fr fl br bl)  예) spear-fl.png
# 4칸으로 나눠(흰 배경이면 tools/unwhite.py로 제거) 네 칸 공통 잘라내기 상자로 자른 뒤 같은 배율로 높이 384px에 맞춰
# characters/soldier-walk/<병종>/<방향>-<1..4>.webp 로 저장하고 SOLDIER_WALK_READY를 갱신한다(네 장이 같은 상자라 몸이 떨리지 않는다).
# 사용: python3 tools/soldier-walk.py 받은폴더/*.png
import sys,os,re,subprocess,tempfile
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__));root=os.path.join(here,'..')
for f in sys.argv[1:]:
    m=re.match(r'(shield|bow|spear|horse)[-_](fr|fl|br|bl)$',os.path.splitext(os.path.basename(f))[0])
    if not m: print('이름 규칙(병종-방향.png)과 다름, 건너뜀:',f);continue
    t,k=m.groups();im=Image.open(f).convert('RGBA')
    cw=im.width/4;cells=[];opaque=im.getchannel('A').getextrema()[0]==255
    for i in range(4):
        c=im.crop((round(i*cw),0,round((i+1)*cw),im.height))
        if opaque:  # 흰 배경: 칸마다 원래 크기를 유지한 채 배경만 지운다(네 칸 상자 위치가 어긋나지 않게)
            d=tempfile.mkdtemp();a=os.path.join(d,'in.png');b=os.path.join(d,'out.png');c.save(a)
            subprocess.run([sys.executable,'-I',os.path.join(here,'unwhite.py'),a,b,'150','90'],check=True,capture_output=True,env={**os.environ,'UNWHITE_KEEP':'1'})
            c=Image.open(b).convert('RGBA')
        cells.append(c)
    boxes=[c.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox() for c in cells]
    if any(b is None for b in boxes): print('빈 칸이 있음, 건너뜀:',f);continue
    u=(min(b[0] for b in boxes),min(b[1] for b in boxes),max(b[2] for b in boxes),max(b[3] for b in boxes))
    sc=384/(u[3]-u[1]);out=os.path.join(root,'characters','soldier-walk',t);os.makedirs(out,exist_ok=True)
    for i,c in enumerate(cells):
        r=c.crop(u);r=r.resize((max(1,round(r.width*sc)),384),Image.LANCZOS);r.save(os.path.join(out,f'{k}-{i+1}.webp'),'WEBP',quality=92,method=6)
    print('저장:',f'characters/soldier-walk/{t}/{k}-1..4.webp',(round((u[2]-u[0])*sc),384))
subprocess.run([sys.executable,'-I',os.path.join(here,'dir-ready.py')],check=True)
