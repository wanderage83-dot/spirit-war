# Canva 작업 디자인(1054×816 페이지, 3:2 그림 3장을 가로 한 줄로 배치)을 가로 6324px PNG로 내보낸 것을
# 세 장으로 잘라 흰 배경 제거 → 도트 변환해 characters/pixel/dir/<이름>/<방향>.webp로 저장한다.
# 사용: python3 -I tools/canva-sheet.py <시트.png> <이름> <방향1,방향2,방향3>   (방향: fr fl br bl, 빈 칸은 -)
import sys,os,subprocess,tempfile
from PIL import Image
here=os.path.dirname(os.path.abspath(__file__))
sheet,name,keys=sys.argv[1],sys.argv[2],sys.argv[3].split(',')
im=Image.open(sheet).convert('RGB');W=im.width;cw=W*351/1054;ch=cw*2/3
out=os.path.join(here,'..','characters','pixel','dir',name);os.makedirs(out,exist_ok=True)
tmp=tempfile.mkdtemp()
for i,k in enumerate(keys):
    if k=='-':continue
    box=(round(i*cw)+3,3,round((i+1)*cw)-3,round(ch)-3)
    raw=os.path.join(tmp,f'raw-{k}.png');im.crop(box).save(raw)
    al=os.path.join(tmp,k+'.png')
    subprocess.run([sys.executable,'-I',os.path.join(here,'unwhite.py'),raw,al,'150','90'],check=True)
    subprocess.run([sys.executable,'-I',os.path.join(here,'pixelize.py'),out,al],check=True)
    print('saved',os.path.join('characters/pixel/dir',name,k+'.webp'))
