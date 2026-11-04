# ChatGPT 등에서 받은 병사 방향 그림을 게임 규격으로 넣는다.
# 파일 이름: <병종>-<방향>.png|webp  (병종 shield bow spear horse, 방향 fl br bl[fr])  예) spear-fl.png
# 투명 배경이면 그대로, 흰 배경이면 tools/unwhite.py로 배경을 지운다. 알파 영역으로 잘라 높이 384px로 맞춰
# characters/soldier-dir/<병종>/<방향>.webp(투명, 품질 92)로 저장하고 DIR_READY/SOLDIER_DIR_READY를 갱신한다.
# 사용: python3 tools/soldier-dir.py 받은폴더/*.png
import sys,os,re,subprocess,tempfile
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__));root=os.path.join(here,'..')
for f in sys.argv[1:]:
    m=re.match(r'(shield|bow|spear|horse)[-_](fr|fl|br|bl)$',os.path.splitext(os.path.basename(f))[0])
    if not m: print('이름 규칙(병종-방향.png)과 다름, 건너뜀:',f);continue
    t,k=m.groups();im=Image.open(f).convert('RGBA')
    if im.getchannel('A').getextrema()[0]==255:  # 불투명 = 흰 배경
        tmp=os.path.join(tempfile.mkdtemp(),'a.png');subprocess.run([sys.executable,'-I',os.path.join(here,'unwhite.py'),f,tmp,'150','90'],check=True);im=Image.open(tmp).convert('RGBA')
    bb=im.getchannel('A').point(lambda a:255 if a>40 else 0).getbbox();im=im.crop(bb)
    im=im.resize((max(1,round(im.width*384/im.height)),384),Image.LANCZOS)
    out=os.path.join(root,'characters','soldier-dir',t);os.makedirs(out,exist_ok=True)
    im.save(os.path.join(out,k+'.webp'),'WEBP',quality=92,method=6);print('저장:',f'characters/soldier-dir/{t}/{k}.webp',im.size)
subprocess.run([sys.executable,'-I',os.path.join(here,'dir-ready.py')],check=True)
