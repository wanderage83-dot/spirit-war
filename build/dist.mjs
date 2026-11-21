// 공개 배포용 압축본 만들기: index.html의 스크립트를 terser로 줄이고(지역 변수 이름 바꾸기·주석/공백 제거),
// CSS 공백을 줄여 dist/에 쓴다. 그림 폴더는 그대로 복사한다. 원본 index.html은 건드리지 않는다.
// 저장소에 npm 의존성을 두지 않으려고 terser는 빌드할 때만 npx로 받는다.
// 사용: node build/dist.mjs   (Vercel 빌드 명령도 이것, 출력 폴더 dist)
import {readFileSync,writeFileSync,mkdirSync,rmSync,cpSync,readdirSync,statSync,existsSync} from 'node:fs';
import {execFileSync} from 'node:child_process';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {tmpdir} from 'node:os';

const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..'),OUT=join(ROOT,'dist'),TERSER='terser@5.36.0';
// .vercelignore와 같은 것 + 빌드 자체
const SKIP=new Set(['art-requests','tests','tools','mockups','asset-library','build','dist','.git','.vercel','node_modules','__pycache__','ASSET_MANIFEST.json','index.html','notes']);
const skip=n=>SKIP.has(n)||n.startsWith('.')||/\.(md|py|sh)$/.test(n)||n==='raw';

rmSync(OUT,{recursive:true,force:true});mkdirSync(OUT,{recursive:true});
const copy=(src,dst)=>{for(const n of readdirSync(src)){if(skip(n))continue;const s=join(src,n),d=join(dst,n);if(statSync(s).isDirectory()){mkdirSync(d,{recursive:true});copy(s,d)}else cpSync(s,d)}};
copy(ROOT,OUT);

let html=readFileSync(join(ROOT,'index.html'),'utf8');
const tmp=join(tmpdir(),'sw-dist-'+process.pid);mkdirSync(tmp,{recursive:true});
let n=0;
html=html.replace(/<script>([\s\S]*?)<\/script>/g,(m,js)=>{const a=join(tmp,`s${n}.js`),b=join(tmp,`s${n}.min.js`);n++;writeFileSync(a,js);
 // toplevel은 건드리지 않는다: onclick="함수()" 같은 HTML 문자열이 전역 이름을 그대로 부른다.
 execFileSync('npx',['-y',TERSER,a,'-o',b,'--compress','passes=1,keep_fargs=true','--mangle','--comments','false','--ecma','2020'],{stdio:['ignore','ignore','inherit']});
 return '<script>'+readFileSync(b,'utf8').replace(/<\/script/gi,'<\\/script')+'</script>'});
html=html.replace(/<style>([\s\S]*?)<\/style>/g,(m,css)=>'<style>'+css.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*\n\s*/g,'').replace(/\s*([{};])\s*/g,'$1')+'</style>');
writeFileSync(join(OUT,'index.html'),html);rmSync(tmp,{recursive:true,force:true});
const kb=f=>Math.round(statSync(f).size/1024);
console.log(`dist/index.html ${kb(join(ROOT,'index.html'))}KB → ${kb(join(OUT,'index.html'))}KB, scripts ${n}`);
if(!existsSync(join(OUT,'characters')))throw new Error('assets not copied');
