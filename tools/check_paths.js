/* v17: kiểm tra mạng gạch bằng flood-fill (4 hướng) trên MAPDATA.M — chỉ ĐỌC.
   - ô gạch = M==8 (gồm lối làng X bit1); ô nối = 5 (sân), 7/11 (cầu), cổng
   - mỗi thành phần liên thông: kích thước, bbox, chạm sân/cầu/cổng, bề rộng min/max (ô), đi tới được từ Cổng 1
   - ô mồ côi = thành phần ≤3 ô hoặc không chạm sân/cầu/cổng/thành phần khác  */
const fs=require('fs'),vm=require('vm');
const ctx={PSK:{},console};vm.createContext(ctx);
['js/config.js','js/data/mapdata.js','js/map.js','js/data/features.js'].forEach(f=>vm.runInContext(fs.readFileSync(f,'utf8').replace(/^(const|let) /gm,'var '),ctx));
const {M,B,W,H,GATES,T,Q}=ctx,X=ctx.MAPDATA.X;
const lab=Array.from({length:H},()=>new Int32Array(W).fill(-1)),comps=[];
const isB=(x,y)=>M[y]?.[x]===8;
for(let y=0;y<H;y++)for(let x=0;x<W;x++)if(isB(x,y)&&lab[y][x]<0){const id=comps.length,q=[[x,y]];lab[y][x]=id;const c={id,n:0,x0:x,x1:x,y0:y,y1:y,lane:0,plaza:0,bridge:0,cells:[]};
 for(let i=0;i<q.length;i++){const[a,b]=q[i];c.n++;c.cells.push([a,b]);c.x0=Math.min(c.x0,a);c.x1=Math.max(c.x1,a);c.y0=Math.min(c.y0,b);c.y1=Math.max(c.y1,b);if((X[b]?.charCodeAt(a)-48)&2)c.lane++;
  for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=a+dx,ny=b+dy,t=M[ny]?.[nx];if(t===5)c.plaza++;if(t===7||t===11)c.bridge++;if(t===8&&lab[ny][nx]<0){lab[ny][nx]=id;q.push([nx,ny])}}}
 comps.push(c)}
/* cổng: ô lân cận (±3 ô) có gạch */
const gateNear=c=>GATES.filter(g=>c.cells.some(([a,b])=>Math.hypot(a-g[5]*Q,b-g[6]*Q)<=3)).map(g=>g[7]);
/* bề rộng: với mỗi ô, độ rộng chạy ngang/dọc nhỏ hơn */
const run=(x,y,dx,dy)=>{let n=1;for(let s=1;isB(x+dx*s,y+dy*s);s++)n++;for(let s=1;isB(x-dx*s,y-dy*s);s++)n++;return n};
/* đi tới được từ Cổng 1 (cùng luật va chạm với check_map.js, lưới 4 px) */
const blocked=(x,y)=>[[-4,0],[4,0],[-4,-3],[4,-3]].some(([a,b])=>{const tx=Math.floor((x+a)/T),ty=Math.floor((y+b)/T);return !B[ty]||B[ty][tx]!==0});
const S=4,GW=W*T/S,GH=H*T/S,seen=new Uint8Array(GW*GH),qx=[Math.round(163*T/S)],qy=[Math.round(290*T/S)];seen[qy[0]*GW+qx[0]]=1;
for(let i=0;i<qx.length;i++)for(const[dx,dy]of[[1,0],[-1,0],[0,1],[0,-1]]){const nx=qx[i]+dx,ny=qy[i]+dy;if(nx<0||ny<0||nx>=GW||ny>=GH||seen[ny*GW+nx]||blocked(nx*S,ny*S))continue;seen[ny*GW+nx]=1;qx.push(nx);qy.push(ny)}
const reach=c=>c.cells.some(([a,b])=>seen[Math.round((b*T+8)/S)*GW+Math.round((a*T+8)/S)]);
let orphan=0;const rows=comps.sort((a,b)=>b.n-a.n).map((c,i)=>{let wmin=99,wmax=0,ws=0;c.cells.forEach(([a,b])=>{const w=Math.min(run(a,b,1,0),run(a,b,0,1));wmin=Math.min(wmin,w);wmax=Math.max(wmax,w);ws+=w});
 const g=gateNear(c),o=c.n<=3||(!c.plaza&&!c.bridge&&!g.length&&c.n<12);if(o)orphan++;
 return{thanh_phan:i+1,o:c.n,bbox:[c.x0,c.y0,c.x1,c.y1],lane:c.lane,chamSan:c.plaza>0,chamCau:c.bridge>0,cong:g.join('|'),rong_min:wmin,rong_max:wmax,rong_tb:+(ws/c.n).toFixed(2),di_toi_duoc:reach(c),mo_coi:o}});
console.log('Tổng ô gạch:',comps.reduce((s,c)=>s+c.n,0),'· thành phần liên thông:',comps.length,'· mồ côi:',orphan);
console.table(rows.slice(0,25));
const small=rows.filter(r=>r.o<12);console.log('Thành phần nhỏ (<12 ô):',small.length);small.forEach(r=>console.log(' ',JSON.stringify(r)));
const wd={};comps.forEach(c=>c.cells.forEach(([a,b])=>{const w=Math.min(run(a,b,1,0),run(a,b,0,1));wd[w]=(wd[w]||0)+1}));console.log('Phân bố bề rộng (ô):',JSON.stringify(wd));
fs.writeFileSync('/tmp/paths_report.json',JSON.stringify(rows,null,1));process.exit(0);
