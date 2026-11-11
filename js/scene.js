/* Phaser Scene: sprite, đối tượng, camera, vòng lặp */
const BKO=[[-4,0],[4,0],[-4,-3],[4,-3]],ANW=[80,100,100,80,100,100],ANC=ANW.reduce((a,b)=>a+b,0),ANL=70;   /* nhịp 6 khung đi của An (ms/khung), khớp An_clean_v3.gif */
class G extends Phaser.Scene{preload(){if(typeof MAPART!=='undefined')for(const k in MAPART)this.load.image(k,MAPART[k])}create(){const sc=this;
const mk=(k,w,h,f)=>{const g=sc.make.graphics({add:false});f((c,x,y,a,b,al=1)=>{g.fillStyle(c,al);g.fillRect(x,y,a,b)},w,h);g.generateTexture(k,w,h);g.destroy()};
const disc=(P,cx,cy,r,c)=>{for(let y=-r;y<=r;y++){const d=Math.floor(Math.sqrt(r*r-y*y));P(c,cx-d,cy+y,d*2+1,1)}};
const BS={0:[0x78b347,0x72ac43,0x80ba4e],4:[0x5f9d3c,0x66a640,0x5a9638],1:[0xc7a26a,0xbf9a62,0xcfab74],2:[0x4fa8cb,0x4aa0c4,0x56b0d2],3:[0xd8743a],5:[0xd0c9b6],6:[0x9fae7e,0x97a876],7:[0x9b6a3a],8:[0xc4c6c1,0xbdbfba],9:[0x8a8c8b,0x848684],10:[0xdcdcd4]};
/* Nền: Tilemap (ô 16 px, 460x352 ô). Bộ ô (tileset) sinh bằng canvas theo từng tổ hợp loại ô + viền bờ nước/viền lối đi — không cần ảnh nền khổng lồ. */
const NB=[[0,-1],[0,1],[-1,0],[1,0]],hx=c=>'#'+c.toString(16).padStart(6,'0');
const NBX=[0,0,-1,1],NBY=[-1,1,0,0];
/* khoá ô = (loại*256 + mặt nạ viền)*24 + biến thể (chỉ cỏ mới có 24 biến thể vì có hoa; loại khác 4 → ít tổ hợp, dựng tileset nhanh) */
const keyOf=(x,y)=>{const t=M[y][x];let m=0;
 for(let i=0;i<4;i++){const n=M[y+NBY[i]]?.[x+NBX[i]];
  if(t===2){if(n!==undefined&&n!==2&&n!==7&&n!==11)m|=1<<i}
  else if(t===0||t===4||t===1||t===8||t===5||t===7||t===11){if(n===2)m|=1<<i}
  if((t===8||t===5)&&(n===0||n===4||n===1))m|=16<<i}
 const h=((x*73856093)^(y*19349663))>>>0;return(t*256+m)*24+(t===0?h%24:h%4)};
/* ô nền vẽ bằng pxl (assets/art/map.px.js → js/mapart.js): mỗi ô = ảnh gốc + lớp phủ viền (bờ nước, mép nước, viền lối đi, lan can cầu) */
const TI=k=>sc.textures.get(k).getSourceImage(),DN=['n','s','w','e'];
const drawTile=(cx,X,Y,t,m,v)=>{const D=k=>cx.drawImage(TI(k),X,Y);
 D(t==0?(v>=22?'m_gf'+(v==22?0:2):'m_g'+v%4):t==4?'m_d'+v%2:t==1?'m_dirt'+v%2:t==2?'m_w'+v%4:t==3?'m_bd'+v%2:t==5?'m_plz'+(v%4==0?'1':''):t==6?'m_out'+v%2:t==7?'m_pk_h':t==11?'m_pk_v':t==8?'m_p'+v%4:t==9?'m_rd'+v%2:'m_lot');
 DN.forEach((d,i)=>{if(t==2){if(m&(1<<i))D('m_wedge_'+d)}else if([0,4,1,8,5].includes(t)){if(m&(1<<i))D('m_bank_'+d)}else if((t==7||t==11)&&m&(1<<i)&&((t==7)==(i<2)))D('m_rail_'+d);
  if((t==8||t==5)&&m&(16<<i))D('m_pedge_'+d)})};
/* Nền dựng theo MẢNG (chunk 32x32 ô = 512 px) quanh khung nhìn thay cho Phaser Tilemap (162.000 đối tượng Tile, ~1.000 quad/khung): chỉ giữ vài mảng gần người chơi trong bộ nhớ, mỗi mảng là 1 ảnh → vài quad/khung */
const tkeys=[],tmap=new Map(),TG=new Uint16Array(W*H),TCOLS=40,PHS=[],STARS=[];
for(let y=0;y<H;y++)for(let x=0;x<W;x++){const k=keyOf(x,y);let i=tmap.get(k);if(i===undefined){i=tkeys.length;tmap.set(k,i);tkeys.push(k)}TG[y*W+x]=i}
const TSC=document.createElement('canvas');TSC.width=TCOLS*T;TSC.height=Math.ceil(tkeys.length/TCOLS)*T;
{const cx=TSC.getContext('2d');tkeys.forEach((k,i)=>drawTile(cx,(i%TCOLS)*T,(i/TCOLS|0)*T,Math.floor(k/6144),Math.floor(k/24)%256,k%24))}
console.info('[psk] tileset',tkeys.length,'ô');
const CT=32,CPX=CT*T,GCN=Math.ceil(W/CT),GCM=Math.ceil(H/CT),GC=new Map();let gSt=0,gKey=-1,gQ=[],gJ=null,gCap=99;
/* viền trắng \"chỗ chưa có dữ liệu\" (PHS) + sao vàng đánh dấu (STARS): vẽ thẳng vào ảnh nền thay cho Graphics/Star (đỡ phải đổi pipeline vẽ mỗi khung) */
const gOver=g=>{g.strokeStyle='#fff';g.lineWidth=2;for(const q of PHS){g.beginPath();if(q[0]=='r')g.rect(q[1],q[2],q[3],q[4]);else if(q[0]=='p'){q[1].forEach((p,i)=>i?g.lineTo(p.x,p.y):g.moveTo(p.x,p.y));g.closePath()}else g.arc(q[1],q[2],q[3],0,6.2832);g.stroke()}
 g.fillStyle='#ffd27a';g.strokeStyle='#3b2412';g.lineWidth=1;for(const[x,y]of STARS){g.beginPath();for(let i=0;i<8;i++){const a=-1.5708+i*.7854,r=i%2?2.2:5.5,px=x+Math.cos(a)*r,py=y+Math.sin(a)*r;i?g.lineTo(px,py):g.moveTo(px,py)}g.closePath();g.fill();g.stroke()}};
const gNew=(cx,cy)=>{const n=CT+1,cv=document.createElement('canvas');cv.width=cv.height=n*T;return{cx,cy,cv,g:cv.getContext('2d'),row:0}};   /* +1 ô gối đầu sang mảng bên cạnh → không bao giờ hở khe */
const gRows=(j,r)=>{const n=CT+1,g=j.g,e=Math.min(n,j.row+r);for(let ty=j.row;ty<e;ty++){const Y=j.cy*CT+ty;if(Y>=H)continue;for(let tx=0;tx<n;tx++){const X=j.cx*CT+tx;if(X>=W)break;const i=TG[Y*W+X];g.drawImage(TSC,(i%TCOLS)*T,(i/TCOLS|0)*T,T,T,tx*T,ty*T,T,T)}}j.row=e;return e>=n};
const gFin=j=>{const g=j.g,k=j.cx+j.cy*64,key='gc'+k;g.save();g.translate(-j.cx*CPX,-j.cy*CPX);gOver(g);g.restore();sc.textures.addCanvas(key,j.cv);sc.textures.get(key).setFilter(Phaser.Textures.FilterMode.NEAREST);const e={im:sc.add.image(j.cx*CPX,j.cy*CPX,key).setOrigin(0,0).setDepth(0),key,u:gSt};GC.set(k,e);return e};
const gBuild=(cx,cy)=>{const k=cx+cy*64;let e=GC.get(k);if(e)return e;let j;if(gJ&&gJ.cx==cx&&gJ.cy==cy){j=gJ;gJ=null}else j=gNew(cx,cy);gRows(j,99);return gFin(j)};   /* dựng ngay (mảng đang nhìn thấy mà chưa có) */
const gUpd=force=>{const v=sc.cameras.main.worldView,x0=Math.max(0,Math.floor(v.x/CPX)),x1=Math.min(GCN-1,Math.floor(v.right/CPX)),y0=Math.max(0,Math.floor(v.y/CPX)),y1=Math.min(GCM-1,Math.floor(v.bottom/CPX)),kk=x0+x1*64+y0*4096+y1*262144;
 if(kk!==gKey||force){gKey=kk;gSt++;
  for(let y=y0;y<=y1;y++)for(let x=x0;x<=x1;x++)gBuild(x,y).u=gSt;   /* mảng đang nhìn thấy: dựng ngay nếu thiếu */
  gQ=[];for(let y=Math.max(0,y0-1);y<=Math.min(GCM-1,y1+1);y++)for(let x=Math.max(0,x0-1);x<=Math.min(GCN-1,x1+1);x++){const e=GC.get(x+y*64);if(e)e.u=gSt;else gQ.push([x,y,Math.abs(x-(x0+x1)/2)+Math.abs(y-(y0+y1)/2)])}
  gQ.sort((a,b)=>a[2]-b[2]);
  gCap=(x1-x0+3)*(y1-y0+3)+2}
 if(GC.size>gCap)for(const[k,e]of GC)if(e.u!==gSt){e.im.destroy();sc.textures.remove(e.key);GC.delete(k);break}   /* dọn dần: tối đa 1 mảng cũ mỗi khung */
 /* vòng ngoài: dựng dần từng lát ~9 hàng ô mỗi khung (một mảng = 4 khung) để không gây khựng */
 if(!gJ){while(gQ.length&&!gJ){const q=gQ.shift();if(!GC.has(q[0]+q[1]*64))gJ=gNew(q[0],q[1])}}
 if(gJ&&gRows(gJ,9)){const j=gJ;gJ=null;gFin(j).u=gSt}};
sc.gupd=gUpd;sc.GC=GC;
/* Atlas lúc chạy: gộp mọi ảnh trang trí/công trình pxl vào MỘT texture 'mpk' → ít đổi texture, ít ngắt batch khi vẽ */
const AT=new Set();{const re=/^m_(h_|bang|phuong|dua|tre|lieu|giay|bush|fl_|lau|pad|lotus|lantern|bench|stone|petal)/,ks=Object.keys(typeof MAPART!=='undefined'?MAPART:{}).filter(k=>re.test(k)).map(k=>[k,TI(k)]).sort((a,b)=>b[1].height-a[1].height);
 let x=2,y=2,rowH=0,AW=1024;const pos=[];for(const[k,im]of ks){if(x+im.width+2>AW){x=2;y+=rowH+2;rowH=0}pos.push([k,x,y,im]);x+=im.width+2;rowH=Math.max(rowH,im.height)}
 let AH=64;while(AH<y+rowH+2)AH*=2;const cv=document.createElement('canvas');cv.width=AW;cv.height=AH;const cx=cv.getContext('2d');pos.forEach(([k,px,py,im])=>cx.drawImage(im,px,py));
 const tex=sc.textures.addCanvas('mpk',cv);pos.forEach(([k,px,py,im])=>{tex.add(k,0,px,py,im.width,im.height);AT.add(k)})}
const AI=(x,y,k)=>AT.has(k)?sc.add.image(x,y,'mpk',k):sc.add.image(x,y,k),FR=k=>AT.has(k)?sc.textures.getFrame('mpk',k):sc.textures.getFrame(k);
/* ===== Luồng khu vực (streaming): đối tượng ngoài khung nhìn (+lề 160 px) bị gỡ khỏi danh sách vẽ và dừng tween; chỉ đối tượng ở gần mới \"thức\" ===== */
const SG=new Map(),SALL=[],SACT=[],LA=[],SCELL=256,SMAR=160;let sSt=0,sKey=-1,LI=0;
const sreg=(o,mk,o2)=>{o2=o2||{};const b=o.getBounds(),it={o,mk,amb:!!o2.amb,lamp:!!o2.lamp,ph:o2.ph||0,hx:o.x,hy:o.y,ha:o.alpha,hr:o.angle,tw:null,on:false,st:0};o.removeFromDisplayList();
 for(let cy=Math.floor(b.y/SCELL);cy<=Math.floor(b.bottom/SCELL);cy++)for(let cx=Math.floor(b.x/SCELL);cx<=Math.floor(b.right/SCELL);cx++){const k=cx+cy*4096;let a=SG.get(k);if(!a)SG.set(k,a=[]);a.push(it)}
 SALL.push(it);return o};
const sWake=it=>{if(it.amb&&sc.lite)return;it.on=true;SACT.push(it);const o=it.o;o.addToDisplayList();if(it.mk){o.setPosition(it.hx,it.hy).setAlpha(it.ha).setAngle(it.hr);it.tw=it.mk().map(c=>sc.tweens.add(c))}if(it.lamp)LA.push(it)};
const sSleep=it=>{it.on=false;if(it.tw){it.tw.forEach(t=>t.remove());it.tw=null}if(it.lamp)LA.splice(LA.indexOf(it),1);it.o.removeFromDisplayList()};
const sRun=force=>{const v=sc.cameras.main.worldView,c0=Math.floor((v.x-SMAR)/SCELL),c1=Math.floor((v.right+SMAR)/SCELL),r0=Math.floor((v.y-SMAR)/SCELL),r1=Math.floor((v.bottom+SMAR)/SCELL),kk=(c0+2)+(c1+2)*128+(r0+2)*16384+(r1+2)*2097152;if(kk===sKey&&!force)return;sKey=kk;const s=++sSt;
 for(let r=r0;r<=r1;r++)for(let c=c0;c<=c1;c++){const a=SG.get(c+r*4096);if(a)for(let i=0;i<a.length;i++){const it=a[i];if(it.st!==s){it.st=s;if(!it.on)sWake(it)}}}
 for(let i=SACT.length-1;i>=0;i--){const it=SACT[i];if(it.st!==s){sSleep(it);SACT[i]=SACT[SACT.length-1];SACT.pop()}}};
sc.strm=sRun;sc.SACT=SACT;sc.SALL=SALL;
const house=(k,w,h,r1,r2,wl)=>mk(k,w*T,h*T,(P,Wd,Hd)=>{const rh=Hd*.6|0;P(0,2,Hd-3,Wd-2,3,.2);P(wl,0,rh-6,Wd,Hd-rh+6);P(0,0,Hd-4,Wd,4,.15);
 for(let r=0;r<rh;r+=4){P(r%8?r1:r2,0,r,Wd,3);P(0,0,r+3,Wd,1,.25)}P(0xffffff,0,0,Wd,2,.25);P(0,0,rh-2,Wd,3,.3);
 P(0x6b4423,Wd/2-3|0,Hd-9,6,9);P(0xf2d27a,Wd/2+1|0,Hd-5,1,1);P(0x7fc4e0,4,rh+1,5,5);P(0x7fc4e0,Wd-9,rh+1,5,5);P(0x4a3018,4,rh+3,5,1);P(0x4a3018,Wd-9,rh+3,5,1)});
house('exh',5,4,0xc4552b,0xb34a24,0xefe3c0);house('th',4,3,0xc8a050,0xb58d3c,0xa8783f);house('th2',3,3,0xb58d3c,0xc8a050,0x9a6c38);house('cafe',3,3,0x3b83a8,0x336f90,0xf4f1e6);house('bql',4,2,0xb34a24,0xc4552b,0xf3e6a8);house('dt',3,3,0xc4552b,0xb34a24,0xefe3c0);house('nd',2,3,0xc8a050,0xb58d3c,0xa8783f);house('chua',3,3,0xd9a441,0xc98f2e,0xefe3c0);
const kio=(k,c,w,h)=>mk(k,w,h,P=>{P(0,1,h-2,w-2,2,.25);P(c,0,0,w,h-2);P(0xffffff,0,0,w,2,.3);P(0,0,h-5,w,3,.25);P(0xffffff,3,3,w-6,1,.2)});
kio('pk',0xe0408a,24,24);kio('bl',0x2a2f9e,24,24);kio('mr',0x7a1633,22,22);kio('bk',0x1b1b1b,18,18);kio('bg',0x2a3aa8,48,40);
mk('stat',10,18,P=>{P(0xbdb8aa,0,12,10,6);P(0xe9e4d6,3,3,4,10);P(0xd0a870,3,0,4,4)});mk('rg',24,8,P=>{P(0xc8282a,0,0,24,8);P(0xff6a5a,0,0,24,2,.5);P(0,0,6,24,2,.3)});
mk('san',4*T,3*T,(P,Wd)=>{for(let r=0;r<26;r+=2){const i=Math.floor((26-r)/4);P(r%4?0xc9a24f:0xb58d3c,2+i,r,Wd-4-2*i,2)}P(0xa8783f,8,26,Wd-16,8);P(0x6b4423,6,34,3,14);P(0x6b4423,Wd-9,34,3,14);P(0x8b5a2b,4,32,Wd-8,3);P(0x4a3018,Wd/2-3,27,6,7)});
mk('tomb',6*T,5*T,(P)=>{P(0,6,68,84,8,.2);P(0xcfc8b5,8,36,80,36);P(0xe2dccb,8,36,80,3);P(0xa39c88,8,69,80,3);P(0xb8b19c,34,72,28,5);disc(P,48,42,22,0x9d988a);disc(P,47,40,20,0xb9b4a6);disc(P,43,34,12,0xd6d2c6);disc(P,40,30,6,0xeeebe2);P(0x7a4b24,38,62,20,6);P(0xd9b26b,44,58,8,4);P(0xc33,47,50,1,8)});
mk('pil',8,28,P=>{P(0xc23a2a,1,6,6,22);P(0xf2c14e,0,3,8,4);P(0x8a2418,5,6,2,22);P(0,0,26,8,2,.25)});
mk('stall',3*T,2*T,P=>{for(let i=0;i<6;i++)P(i%2?0xc23a2a:0xf6e7bd,i*8,0,8,10);P(0,0,10,48,2,.25);P(0x8b5a2b,2,14,44,16);P(0xe0c28e,2,14,44,3);P(0xf08fb0,8,10+3,4,4);P(0x6bbf59,20,13,4,4);P(0xf7d84a,32,13,4,4)});
mk('tree',48,48,P=>{P(0,10,40,28,6,.2);P(0x6b4423,21,28,6,18);disc(P,24,22,18,0x3f7d2c);disc(P,22,20,15,0x4f9a38);disc(P,19,15,9,0x69b84a);for(let i=0;i<22;i++)P(R()<.5?0x35692a:0x7ccf5a,8+R()*30|0,6+R()*28|0,2,2)});
mk('palm',48,64,P=>{P(0,12,56,24,6,.2);for(let i=0;i<34;i++)P(i%4<2?0x8b6a3a:0x6f522b,22+Math.sin(i/9)*3|0,58-i,4,1);const cx=25,cy=26;[[-1,-.2],[1,-.2],[-.7,.5],[.7,.5],[0,-1],[-.4,-.7],[.4,-.7]].forEach(([a,b])=>{for(let k=0;k<16;k++)P(k%3?0x3f9a3a:0x2f7d30,cx+a*k*1.4+0|0,cy+b*k*.9+k*k*.03|0,3,2)});disc(P,cx,cy,2,0x6b4423)});
mk('pad',10,6,P=>{P(0x3f8f3a,1,1,8,4);P(0x58b04a,2,1,5,2);P(0x2e6e2e,4,2,2,1)});mk('flw',4,4,P=>{P(0xf6a1c4,0,1,4,2);P(0xf6a1c4,1,0,2,4);P(0xf7d84a,1,1,2,2)});
mk('boat',32,12,P=>{P(0,2,10,30,2,.2);P(0x6b4423,2,6,28,4);P(0x8b5a2b,0,4,32,3);P(0xc9a85a,6,5,18,1)});mk('lf',2,2,P=>P(0xd9a441,0,0,2,2));mk('sp',3,1,P=>P(0xffffff,0,0,3,1));
mk('arr',9,8,P=>{P(0xf5c542,3,0,3,4);P(0xf5c542,1,4,7,1);P(0xf5c542,2,5,5,1);P(0xf5c542,3,6,3,1);P(0x7a4b24,4,7,1,1)});
const chr=(k,o,d=0,f=0)=>mk(k,12,16,P=>{P(0,2,15,8,1,.3);P(o.pa,3,11,3,4-f);P(o.pa,6,11,3,4-(1-f));P(o.sh,2,6,8,6);P(o.sh,1,7,1,3);P(o.sh,10,7,1,3);P(o.sk,1,10,1,1);P(o.sk,10,10,1,1);P(o.sk,3,1,6,6);
if(d==1)P(o.ha,3,0,6,6);else{P(o.ha,3,0,6,2);P(o.ha,3,2,1,2);P(o.ha,8,2,1,2);if(d!=3)P(0x222,d==0?4:3,4,1,1);if(d!=2)P(0x222,d==0?7:8,4,1,1)}
if(o.long){P(o.ha,2,1,1,8);P(o.ha,9,1,1,8)}if(o.bag&&d!=0){P(o.bag,2,6,8,5);if(o.pk)P(o.pk,4,8,4,2)}
if(o.strap){[3,4,5,6].forEach((i)=>P(0x2b2b2b,i,i+3,1,1));if(d!=1)P(0x2b2b2b,7,10,3,3)}
if(o.hp&&d!=1){P(0x2a2a2a,2,3,1,3);P(0x2a2a2a,9,3,1,3);P(0x2a2a2a,3,0,6,1)}
if(o.scarf)for(let i=0;i<6;i++)P(i%2?0xc23a2a:0xf0f0f0,3+i,7,1,2);
if(o.nb&&d!=1){P(0xf6e7bd,9,9,3,4);P(0x7a4b24,9,9,1,4)}if(o.pc)P(0xf5c542,8,3,1,3);
if(o.ph&&d!=1){P(0x111,9,9,2,3);P(0x7fc4e0,9,9,2,1)}if(o.rec&&d!=1){P(0x888,9,10,2,3);P(0xc33,9,10,1,1)}if(o.wr&&d!=1){P(0xaaa,10,8,1,5);P(0xaaa,9,8,3,1)}});
const AN={ha:0x1b1b1b,sk:0xf0c8a0,sh:0xdfe6ee,pa:0x2c3e6b,bag:0xa0622d,pk:0xc48a50,nb:1,pc:1};
for(let d=0;d<4;d++)for(let f=0;f<2;f++)chr('a'+d+f,AN,d,f);
/* An (nhân vật chính, có balo): sprite tay vẽ 48x64 (nguồn assets/art/an_sprite.aseprite -> an_idle.png; an_w0..5.png là 6 khung đi), hiển thị theo số nguyên điểm ảnh màn hình (xem update).
   4 hướng: xuống (an_w0..5 + an_idle, nhịp ANW) · lên (an_u0..8, nguồn back.gif) · phải (an_s0..8 ← left-right-an.gif) · trái (an_l0..8 ← Sprite-0002-Recovered.aseprite). Khung 0 của lên/ngang = đứng yên, 8 khung còn lại là một vòng đi (ANL ms/khung).
   Ảnh nhúng nạp bất đồng bộ: chưa xong thì dùng hình chr cũ, xong thì tự chuyển. */
for(const[k,im]of[['anidle',IM.an_idle],['emmaidle',IM.emma_idle],...[0,1,2,3,4,5].map(i=>['anw'+i,IM['an_w'+i]]),...[0,1,2,3,4,5,6,7,8].map(i=>['anu'+i,IM['an_u'+i]]),...[0,1,2,3,4,5,6,7,8].map(i=>['ans'+i,IM['an_s'+i]]),...[0,1,2,3,4,5,6,7,8].map(i=>['anl'+i,IM['an_l'+i]])]){const add=()=>{if(!sc.textures.exists(k)){sc.textures.addImage(k,im);sc.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST)}};if(im.complete&&im.naturalWidth)add();else im.addEventListener('load',add)}
mk('psh',14,5,P=>{P(0,3,1,8,3,.3);P(0,2,2,10,1,.3);P(0,4,0,6,1,.3);P(0,4,4,6,1,.3)});
chr('emma',{ha:0x6b4423,sk:0xf3d0b0,sh:0xf2d27a,pa:0x3a5a8c,hp:1,rec:1,long:1});chr('khoa',{ha:0x222222,sk:0xe8bd90,sh:0x2a6f6a,pa:0x444444,strap:1,ph:1});chr('tu',{ha:0xcfcfcf,sk:0xc99b70,sh:0x6f7d5a,pa:0x3a3a2a,scarf:1,wr:1});
mk('eng',14,10,P=>{P(0,1,9,12,1,.3);P(0x4a5a4a,1,3,10,6);P(0x6a7a6a,1,3,10,2);P(0xb33,3,1,3,2);P(0x222,10,5,3,3)});
const ob=(k,cx,cy,m=1)=>{const kk=(typeof MAPART!=='undefined'&&MAPART['m_h_'+k])?'m_h_'+k:k,ss=kk!==k?1:SS*m,f=FR(kk),w=f.width/T*ss,h=f.height/T*ss,x0=cx*Q-w/2,y0=cy*Q-h/2;sreg(AI(x0*T,(y0+h)*T,kk).setOrigin(0,1).setScale(ss).setDepth((y0+h)*T));for(let i=0;i<Math.ceil(w);i++)for(let j=0;j<Math.ceil(h);j++){const X=Math.floor(x0)+i,Y=Math.floor(y0)+j;if(B[Y]?.[X]===0)B[Y][X]=1}};
const lab=(x,y,t,c='#fff')=>sreg(sc.add.text(x*Q*T,y*Q*T,t,{fontFamily:"'VT323','Be Vietnam Pro',monospace",fontSize:'8px',color:c,stroke:'#3b2412',strokeThickness:2,align:'center'}).setOrigin(.5).setResolution(4).setDepth(9998));
/* Công trình: đặt theo 51 hạng mục của sơ đồ chuẩn (features.js), toạ độ px sơ đồ đã cắt khung — chỉ vẽ hình dáng, không thêm công trình ngoài sơ đồ */
FT.forEach(f=>{const id=f[1],x=f[7],y=f[8],S=SPR[id],MU=MULTI[id];if(S)ob(S[0],x,y,S[1]);if(MU)MU[1].forEach(([dx,dy])=>ob(MU[0],x+dx,y+dy));
 if(['A4_NHA_KIENG','B2_DIEU_KHAC_1','B3_DIEU_KHAC_2'].includes(id))STARS.push([x*Q*T,y*Q*T])});
const tb=FID.A1_MO_CU;sreg(sc.add.image(tb[7]*Q*T,(tb[8]+46)*Q*T,'tomb').setOrigin(.5,1).setScale(3).setDepth((tb[8]+46)*Q*T));for(let y=126;y<=140;y++)for(let x=204;x<=228;x++)B[y][x]=1;
/* Chỗ chưa có dữ liệu → viền trắng (MAPDATA.PH, sinh từ tools/build_map.py): để tự vẽ thêm sau. Chùa Hòa Long chặn lối đi; còn lại chỉ viền. */
{const g={strokeRect:(a,b,c,d)=>PHS.push(['r',a,b,c,d]),strokePoints:(pts)=>PHS.push(['p',pts]),strokeCircle:(a,b,r)=>PHS.push(['c',a,b,r])};
MAPDATA.PH.forEach(([id,ty,p])=>{if(ty=='rect'||ty=='rect2'){const[x,y,w,h]=p;g.strokeRect(x*T,y*T,w*T,h*T);if(ty=='rect2')g.strokeRect((x+1)*T,(y+1)*T,(w-2)*T,(h-2)*T);if(id.startsWith('A6_'))for(let j=y;j<y+h;j++)for(let i=x;i<x+w;i++)B[j][i]=1}
 else if(ty=='poly')g.strokePoints(p.map(([x,y])=>({x:x*T,y:y*T})),true);else if(ty=='circle')g.strokeCircle(p[0]*T,p[1]*T,p[2]*T);
 if(PSK.cfg.debug){const c=ty=='circle'?[p[0],p[1]]:ty=='poly'?p[0]:[p[0]+p[2]/2,p[1]+p[3]/2];lab(c[0]/Q/1,c[1]/Q,id.slice(0,14),'#fff')}})}
/* Mũi tên vàng "hướng xe khách vào tham quan" (2) và mũi tên lối bộ Cổng 1 (trên sơ đồ) */
[[743,400,0],[1130,455,0],[640,968,1]].forEach(([x,y,up])=>sreg(sc.add.image(x*Q*T,y*Q*T,'arr').setScale(3).setFlipY(!!up).setDepth(2)));
LBL.filter(l=>!HIDE.has(l[7])||PSK.cfg.debug).forEach(([x,y,t,c,,,,id])=>lab(x,y,t,PSK.cfg.debug&&VERIFY.has(id)?'#ffb4a8':c||'#fff'));
GATES.forEach(([gx,gy,n,a,b,x,y])=>{sreg(sc.add.image(x*Q*T,y*Q*T,'rg').setScale(4).setDepth(y*Q*T-1));if(n)lab(x,y-14,n,'#ffd27a')});
const tree=(x,y,k,z=1)=>{if(B[y]?.[x]!==0)return;B[y][x]=1;sreg(AI((x+.5)*T,(y+1)*T,k).setOrigin(.5,1).setScale(z).setDepth((y+1)*T))};
MAPDATA.TREES.forEach(([x,y],i)=>tree(x,y,i%3?'m_bang':'m_phuong',2));
for(let i=0;i<1200;i++){const x=R()*W|0,y=R()*H|0;if(M[y][x]==2){const px=x*T+R()*12,py=y*T+R()*14,du=700+R()*1200,de=R()*2000,p=sc.add.image(px,py,'sp').setDepth(2).setAlpha(0);sreg(p,()=>[{targets:p,alpha:.8,yoyo:true,repeat:-1,duration:du,delay:de}],{amb:1})}}
for(let i=0;i<90;i++){const px=R()*W*T,py=R()*H*T,du=6000+R()*4000,de=R()*5000,p=sc.add.image(px,py,'lf').setDepth(9000).setAlpha(0);sreg(p,()=>[{targets:p,x:'+=40',y:'+=55',alpha:{from:0,to:1},duration:du,delay:de,repeat:-1}],{amb:1})}
const npc=(k,x,y)=>sc.add.image(x*Q*T,y*Q*T,k).setOrigin(.5,1).setDepth(y*Q*T);
const emmaN=npc('emma',620,1160);npc('khoa',676,1160);npc('tu',1108,952);
sc.add.image(1136*Q*T,952*Q*T,'eng').setOrigin(.5,1).setDepth(952*Q*T-1).setScale(3);
const psh=sc.add.image(163*T,290*T,'psh').setOrigin(.5,.5).setScale(2),pl=sc.add.image(163*T,290*T,'a00').setOrigin(.5,1),arr=sc.add.image(0,0,'arr').setDepth(9999);

/* ===== Trang trí & khí quyển chiều muộn (DECOR sinh từ tools/build_map.py, chỉ là lớp thẩm mỹ) ===== */
{const gl=document.createElement('canvas');gl.width=gl.height=128;const g=gl.getContext('2d'),gr=g.createRadialGradient(64,64,0,64,64,64);gr.addColorStop(0,'rgba(255,240,180,1)');gr.addColorStop(.3,'rgba(255,200,120,.5)');gr.addColorStop(1,'rgba(255,170,90,0)');g.fillStyle=gr;g.fillRect(0,0,128,128);sc.textures.addCanvas('glow',gl);
 const GRD=new Set(['fl_pink','fl_yellow','fl_white','stone0','stone1']),WET=k=>k.startsWith('pad')||k.startsWith('lotus'),SWAY=new Set(['lieu','dua','tre']),PET=[];
 MAPDATA.DECOR.forEach(([k,x,y])=>{const wet=WET(k),im=AI(x*T,y*T,'m_'+k).setOrigin(k=='lantern'?.46:.5,wet?.5:1).setScale(wet?1:2);im.setDepth(GRD.has(k)?1:wet?2.5:y*T);let mk=null;
  if(wet){const du=1800+R()*1800,de=R()*1500;mk=()=>[{targets:im,y:y*T+1.5,yoyo:true,repeat:-1,duration:du,ease:'Sine.inOut',delay:de}]}
  if(SWAY.has(k)){im.setOrigin(.5,1);const du=2600+R()*2200,de=R()*2000;mk=()=>[{targets:im,angle:{from:-1.1,to:1.1},yoyo:true,repeat:-1,duration:du,ease:'Sine.inOut',delay:de}]}
  sreg(im,mk);
  if(k=='lantern')sreg(sc.add.image(x*T+14,y*T-54,'glow').setBlendMode(Phaser.BlendModes.ADD).setScale(2.1).setAlpha(.3).setDepth(8000),null,{amb:1,lamp:1,ph:LI++});
  if(k=='phuong'||k=='lieu')PET.push([x,y])});
 /* cánh hoa rơi quanh cây phượng/liễu */
 for(let i=0;i<70&&PET.length;i++){const [x,y]=PET[R()*PET.length|0],px=x*T+(R()-.5)*60,py=y*T-30-R()*30,pk=R()<.5?'m_petal0':'m_petal1',p=AI(px,py,pk).setDepth(8500).setAlpha(0),dx=20+R()*40,dy=50+R()*40,an=R()<.5?200:-200,du=5000+R()*4000,de=R()*7000;
  sreg(p,()=>[{targets:p,x:'+='+dx,y:'+='+dy,angle:an,alpha:{from:.95,to:0},duration:du,delay:de,repeat:-1}],{amb:1})}
 /* đom đóm quanh mặt nước */
 let nf=0;for(let n=0;n<4000&&nf<110;n++){const x=R()*W|0,y=R()*H|0;if(M[y][x]==6||M[y][x]==9||M[y][x]==3)continue;let near=false;for(const[dx,dy]of[[6,0],[-6,0],[0,6],[0,-6],[10,10],[-10,-10]])if(M[y+dy]?.[x+dx]==2)near=true;if(!near)continue;nf++;
  const f=sc.add.image(x*T+8,y*T+8,'glow').setBlendMode(Phaser.BlendModes.ADD).setTint(0xd8ff8a).setScale(.1+R()*.05).setDepth(8200).setAlpha(0),dx=(R()-.5)*70,dy=(R()-.5)*50,d1=3500+R()*3000,d2=900+R()*1200,de=R()*3000;
  sreg(f,()=>[{targets:f,x:'+='+dx,y:'+='+dy,duration:d1,yoyo:true,repeat:-1,ease:'Sine.inOut'},{targets:f,alpha:{from:0,to:.9},duration:d2,yoyo:true,repeat:-1,delay:de}],{amb:1})}
 /* màu nắng chiều: lớp phủ DOM alpha thường (rẻ hơn blend/postFX toàn màn hình), ấm vàng → tím hồng theo đồng hồ game (17:30 → 18:40) */
 const tint=document.getElementById('tint');let lastD=-1;
 sc.mood=t=>{const d=Math.max(0,Math.min(1,((typeof clk!=='undefined'?clk:1050)-1050)/70));if(Math.abs(d-lastD)>.006){lastD=d;if(tint){const L=(a,b)=>Math.round(a+(b-a)*d);tint.style.background='rgba('+L(255,150)+','+L(176,100)+','+L(110,190)+','+(.07+.15*d).toFixed(3)+')'}}
  if(!sc.lite)for(let i=0;i<LA.length;i++)LA[i].o.setAlpha((.2+.5*lastD)*(.86+.14*Math.sin(t/260+LA[i].ph*1.7)))};
 /* chế độ nhẹ: tắt đom đóm, cánh hoa, lấp lánh, ánh đèn khi máy yếu (tự bật nếu FPS thấp, hoặc mở với ?lite, hoặc phím F4) */
 sc.setLite=on=>{on=!!on;if(!!sc.lite===on)return;sc.lite=on;if(on){for(let i=SACT.length-1;i>=0;i--){const it=SACT[i];if(it.amb){sSleep(it);SACT[i]=SACT[SACT.length-1];SACT.pop()}}}else sRun(true);console.info('[psk] chế độ nhẹ',on?'BẬT':'tắt')};
 if(/[?&]lite\b/.test(location.search))sc.setLite(true)}
const cam=sc.cameras.main;cam.setBounds(0,0,W*T,H*T);cam.startFollow(pl,true,.12,.12);
const zoom=()=>cam.setZoom(Math.max(1,Math.round(Math.min(innerWidth/560,innerHeight/340))));zoom();sc.scale.on('resize',zoom);cam.centerOn(pl.x,pl.y);cam.preRender();gUpd(true);sRun(true);
Object.assign(sc,{pl,psh,arr,cam,d:0,wt:0,emmaN});PSK.scene=sc;hudInit(sc);hud();PSK.emit('ready',sc);
seq([['Học sinh (hồi tưởng)','Chuyện ngày xưa có liên quan gì tới tụi em bây giờ không thầy?'],['An','Mình đã trả lời bằng thêm một mốc thời gian. Câu trả lời đúng, nhưng không chạm được điều em ấy muốn biết.'],['Gợi ý','Đi: phím mũi tên / WASD, hoặc chạm giữ trên màn hình. Nói chuyện: E hoặc nút Tương tác. Mở sổ: N.']])}
update(t,dt){const sc=this,pl=this.pl,S=STEPS[st.step];if(ended)return;sc.gupd();sc.strm();if(sc.mood)sc.mood(t);if(!sc.lite&&!sc.manLite&&t>8000&&t-(sc.fpsT||0)>1500){sc.fpsT=t;sc.lowN=(this.game.loop.actualFps<38?(sc.lowN||0)+1:0);if(sc.lowN>=4)sc.setLite(true)}
 let vx=0,vy=0;if(!busy&&!nbOpen){if(kd.arrowleft||kd.a)vx--;if(kd.arrowright||kd.d)vx++;if(kd.arrowup||kd.w)vy--;if(kd.arrowdown||kd.s)vy++;
  const p=this.input.activePointer;if(!vx&&!vy&&p.isDown){const w=this.cam.getWorldPoint(p.x,p.y),dx=w.x-pl.x,dy=w.y-pl.y+6,h=Math.hypot(dx,dy);if(h>5){vx=dx/h;vy=dy/h}}}
 if(vx||vy){const l=Math.hypot(vx,vy),sp=120*dt/1000;vx=vx/l*sp;vy=vy/l*sp;const bk=(x,y)=>{for(let i=0;i<4;i++){const o=BKO[i];if(B[Math.floor((y+o[1])/T)]?.[Math.floor((x+o[0])/T)]!==0)return true}return false};
  if(!bk(pl.x+vx,pl.y))pl.x+=vx;if(!bk(pl.x,pl.y+vy))pl.y+=vy;{const ax=Math.abs(vx),ay=Math.abs(vy),hz=this.d>=2;/* đang quay ngang thì chỉ đổi sang dọc khi hướng dọc trội hẳn (và ngược lại) -> đi chéo không bị nhấp nháy giữa hai hướng */
  const horiz=hz?ax*1.25>=ay:ax>ay*1.25;this.d=horiz?(vx<0?2:3):(vy<0?1:0)}this.wt+=dt;const sk=this.wt/300|0;if(sk!==this.sk){this.sk=sk;window.SFX&&SFX.step(M[Math.floor((pl.y-1)/T)]?.[Math.floor(pl.x/T)])}}
 {const mv=!!(vx||vy),d=this.d;let k;
  if(d==0){let fi=0;if(mv){let t=this.wt%ANC;while(t>=ANW[fi]){t-=ANW[fi];fi++}}k=fi?'anw'+fi:'anidle'}
  else{const fi=mv?1+((this.wt/ANL|0)%8):0;k=(d==1?'anu':d==2?'anl':'ans')+fi}   /* lên: back.gif · trái/phải: left-right-an.gif (trái: an_l0..8 ← Sprite-0002-Recovered.aseprite) */
  const z=this.cam.zoom,n=Math.max(1,Math.round(.625*z)),u=n/z;   /* mỗi điểm ảnh sprite = n điểm ảnh MÀN HÌNH (số nguyên) -> luôn sắc nét ở mọi mức zoom */
  if(sc.textures.exists(k)){pl.setTexture(k).setOrigin(.5,62/64).setScale(u).setFlipX(false);this.psh.setScale(2*u)}else{pl.setTexture('a'+d+((this.wt/150|0)%2)).setOrigin(.5,1).setScale(1).setFlipX(false);this.psh.setScale(2)}
  /* Emma (đứng yên ở lối vào, cùng cỡ điểm ảnh với An) */
  if(this.emmaN&&sc.textures.exists('emmaidle')){this.emmaN.setTexture('emmaidle').setOrigin(.5,62/64).setScale(u)}
  pl.setDepth(pl.y);this.psh.setPosition(pl.x,pl.y-1).setDepth(pl.y-1)}hudTick(this,dt);
 if(S){this.arr.setVisible(!S.zone||qt<20).setX(S.p[0]*T).setDepth(9999);if(!this.arr.tw)this.arr.tw=1;this.arr.y=S.p[1]*T-30+Math.sin(t/220)*3;
  near=!busy&&Math.hypot(pl.x-S.p[0]*T,pl.y-S.p[1]*T)<28&&!S.zone;$('act').style.display=near&&!nbOpen?'block':'none';
  if(S.zone){const[a,b,c,d]=S.zone,tx=pl.x/T,ty=pl.y/T,inz=tx>=a&&tx<=c&&ty>=b&&ty<=d;if(inz&&!busy){qt+=dt/1000;if(qt<20){$('ui').style.opacity=0;$('vig').className='q'}}
   if(qt>=20&&!busy&&!S.done){S.done=1;$('vig').className='';$('ui').style.opacity=1;
    seq([['Sổ nghe','Bạn vừa quan sát điều gì mà lúc nãy mình đã đi quá nhanh?',[['Tiếng gió và tiếng lá xa xa.',()=>{K.known.push('Khu mộ yên tĩnh: gió, lá, bước chân xa.')}],['Bậc thềm, mái vòm và làn khói hương.',()=>{K.known.push('Mái vòm, bậc thềm và làn khói hương ở khu mộ.')}],['Mình vừa đi quá nhanh, chưa nhìn gì.',()=>{K.open.push('Mình chưa nhìn kỹ khu mộ – quay lại sau?')}]]],
    ['Sổ nghe','Một nơi tưởng niệm cần người đến xem, hay cần người đến hiểu?',[['Cần người đến hiểu.',()=>{st.tr++}],['Cần người đến xem, để nhớ.',()=>{}],['Mình chưa biết – cần hỏi thêm.',()=>{K.open.push('Nơi tưởng niệm cần người đến xem hay đến hiểu?')}]]],
    ['Khoa','…Im lặng lâu vậy mà tớ không thấy sốt ruột. Lạ thật.']],()=>nx())}}}}}
