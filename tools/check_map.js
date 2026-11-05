/* Kiểm tra bản đồ không cần trình duyệt: node tools/check_map.js
   - mọi bước nhiệm vụ và 7 cổng có đi tới được từ Cổng số 1 (cùng quy tắc va chạm với game)
   - mỗi hạng mục trong 51 mục có điểm đi được gần (<= 4 ô)  */
const fs=require('fs'),vm=require('vm');
const ctx={PSK:{},console};vm.createContext(ctx);
const load=f=>vm.runInContext(fs.readFileSync(f,'utf8').replace(/^(const|let) /gm,'var '),ctx);
['js/config.js','js/data/mapdata.js','js/map.js','js/data/features.js'].forEach(load);
const {M,B,W,H,T,FT,GATES}=ctx;
const q=fs.readFileSync('js/data/quests.js','utf8');
const steps=[...q.matchAll(/(?:zone:\[[^\]]*\],)?p:\[([\d.]+),([\d.]+)\],o:'([^']{0,40})/g)].map(m=>[+m[1],+m[2],m[3]]);
const blocked=(x,y)=>[[-4,0],[4,0],[-4,-3],[4,-3]].some(([a,b])=>{const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);return !B[ty]||B[ty][tx]!==0});
const S=4,GW=W*T/S,GH=H*T/S,seen=new Uint8Array(GW*GH);
const start=[81.5*T,145*T];let qx=[Math.round(start[0]/S)],qy=[Math.round(start[1]/S)];seen[qy[0]*GW+qx[0]]=1;
for(let i=0;i<qx.length;i++){for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=qx[i]+dx,ny=qy[i]+dy;if(nx<0||ny<0||nx>=GW||ny>=GH||seen[ny*GW+nx])continue;if(blocked(nx*S,ny*S))continue;seen[ny*GW+nx]=1;qx.push(nx);qy.push(ny)}}
const near=(px,py,r)=>{for(let y=Math.max(0,Math.floor((py-r)/S));y<=Math.min(GH-1,Math.ceil((py+r)/S));y++)for(let x=Math.max(0,Math.floor((px-r)/S));x<=Math.min(GW-1,Math.ceil((px+r)/S));x++)if(seen[y*GW+x]&&Math.hypot(x*S-px,y*S-py)<=r)return true;return false};
let bad=0;const rep=(n,ok)=>{if(!ok)bad++;console.log((ok?'OK  ':'LỖI ')+n)};
console.log('ô đi được từ Cổng 1:',qx.length,'/',GW*GH);
steps.forEach(([x,y,o],i)=>rep('bước '+(i+1)+' '+o,near(x*T,y*T,24)));
GATES.forEach(g=>rep('cổng '+(g[7]),near(g[0]*T+8,g[1]*T+8,12)));
FT.filter(f=>!['water','path'].includes(f[4])).forEach(f=>{if(!near(f[5]*T+8,f[6]*T+8,4*T))rep('hạng mục '+f[0]+' '+f[1]+' (xa lối đi >4 ô)',false)});
console.log(bad?('Có '+bad+' lỗi'):'Tất cả đạt');process.exit(bad?1:0);
