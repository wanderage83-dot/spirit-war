# characters/pixel/dir/<이름>/<fr|fl|br|bl>.webp 를 훑어 index.html의 DIR_READY={...} 를 실제 파일과 같게 고친다.
# 사용: python3 tools/dir-ready.py   (make-dir-views.sh가 끝에서 자동 호출)
import os,re,json
root=os.path.join(os.path.dirname(os.path.abspath(__file__)),'..');d=os.path.join(root,'characters','pixel','dir')
ready={}
for n in sorted(os.listdir(d)) if os.path.isdir(d) else []:
    ks=[k for k in ('fr','fl','br','bl') if os.path.isfile(os.path.join(d,n,k+'.webp'))]
    if ks: ready[n]=','.join(ks)
lit='{'+','.join((n if re.fullmatch(r'[A-Za-z_$][\w$]*',n) else json.dumps(n))+":'"+v+"'" for n,v in ready.items())+'}'
p=os.path.join(root,'index.html');s=open(p,encoding='utf8').read()
s2,c=re.subn(r'DIR_READY=\{[^}]*\}','DIR_READY='+lit,s,count=1)
if c!=1: raise SystemExit('index.html에서 DIR_READY를 찾지 못했습니다')
if s2!=s: open(p,'w',encoding='utf8').write(s2)
print('DIR_READY =',lit,'(%d명)'%len(ready))
