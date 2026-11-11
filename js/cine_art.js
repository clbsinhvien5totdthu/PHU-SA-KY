/* Tranh nền cho cutscene mở đầu (vẽ bằng code, pixel-art độ phân giải 320x180 "thế giới").
   Mỗi cảnh gồm nhiều LỚP riêng (tường, bàn, nhân vật...) để camera có thị sai (parallax).
   Mỗi lớp được vẽ sẵn ở độ phóng đại K=5 (nearest) rồi camera phóng/thu bằng nội suy tuyến tính
   -> chuyển động mượt từng điểm ảnh con, không còn "bơi" hay rung như khi làm tròn kích thước mỗi frame. */
const CA=(()=>{
const VW=320,VH=180,K=5;
const mkc=(w,h)=>{const e=document.createElement('canvas');e.width=Math.max(1,Math.round(w));e.height=Math.max(1,Math.round(h));return e};
const rng=sd=>{let s=sd>>>0||1;return()=>((s=(Math.imul(s,1664525)+1013904223)>>>0)/4294967296)};
const FILT=(()=>{try{const g=mkc(1,1).getContext('2d');g.filter='blur(1px)';return g.filter==='blur(1px)'}catch(e){return false}})();

/* Một lớp: canvas K lần + vị trí/kích thước trong toạ độ thế giới */
function P(w,h,fn,ox=0,oy=0){const cv=mkc(w*K,h*K),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.scale(K,K);g.translate(-ox,-oy);
 const R=(a,b,c,d,col,al=1)=>{g.globalAlpha=al;g.fillStyle=col;g.fillRect(a,b,c,d)};fn(R,g);g.globalAlpha=1;return{cv,ox,oy,w,h}}
/* Tô đa giác theo từng hàng điểm ảnh (giữ nét pixel) */
const poly=(R,pts,col,al=1)=>{let y0=1e9,y1=-1e9;pts.forEach(p=>{y0=Math.min(y0,p[1]);y1=Math.max(y1,p[1])});
 for(let y=Math.floor(y0);y<Math.ceil(y1);y++){const yy=y+.5,xs=[];for(let i=0;i<pts.length;i++){const[a,b]=pts[i],[p,q]=pts[(i+1)%pts.length];if((b<=yy&&q>yy)||(q<=yy&&b>yy))xs.push(a+(yy-b)/(q-b)*(p-a))}
  xs.sort((m,n)=>m-n);for(let k=0;k+1<xs.length;k+=2){const a=Math.round(xs[k]),b=Math.round(xs[k+1]);if(b>a)R(a,y,b-a,1,col,al)}}};
const disc=(R,cx,cy,r,col,al=1)=>{for(let y=-r;y<=r;y++){const d=Math.floor(Math.sqrt(r*r-y*y+.25));R(cx-d,cy+y,2*d+1,1,col,al)}};
/* Làm mờ một lớp (cho nền khi lấy nét vào nhân vật) */
function blurred(L,px){const cv=mkc(L.cv.width,L.cv.height),g=cv.getContext('2d');
 if(FILT){g.filter='blur('+px+'px)';g.drawImage(L.cv,0,0);g.filter='none'}
 else{const a=mkc(cv.width/10,cv.height/10),b=a.getContext('2d');b.imageSmoothingQuality='high';b.drawImage(L.cv,0,0,a.width,a.height);g.imageSmoothingQuality='high';g.drawImage(a,0,0,cv.width,cv.height)}
 return{cv,ox:L.ox,oy:L.oy,w:L.w,h:L.h}}
/* Bóng người (silhouette) có viền sáng ngược sáng. dir: 'l' | 'r' | 'b' (cả hai bên) */
function sil(w,h,ox,oy,draw,dir,c1,c2){
 const m=mkc(w,h),mg=m.getContext('2d',{willReadFrequently:true});mg.translate(-ox,-oy);draw((a,b,c,d,col,al=1)=>{mg.globalAlpha=al;mg.fillStyle=col;mg.fillRect(a,b,c,d)});
 const id=mg.getImageData(0,0,w,h).data,on=(i,j)=>i>=0&&j>=0&&i<w&&j<h&&id[(j*w+i)*4+3]>60;
 const ds=dir==='b'?[-1,1]:[dir==='r'?1:-1];
 return P(w,h,R=>{draw(R);for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(!on(i,j))continue;
  for(const d of ds){if(!on(i+d,j))R(i+ox,j+oy,1,1,c1,.95);else if(!on(i+2*d,j))R(i+ox,j+oy,1,1,c2,.55)}
  if(!on(i,j-1))R(i+ox,j+oy,1,1,c1,.7)}},ox,oy)}

/* ---------- Giá sách ---------- */
const COL=['#8b2a1c','#1d3558','#7a4a24','#c3a06a','#2f5a3a','#8a4b66','#4a3328','#e8d6a6','#a0622d','#3d4f7a','#5a2a3a','#b8863c'];
function shelves(R,x0,x1,seed,rows){const r=rng(seed);
 for(const y0 of rows){R(x0,y0,x1-x0,34,'#1a0f08');let x=x0+1;
  while(x<x1-2){const w=2+(r()*5|0),h=17+(r()*14|0),col=COL[r()*COL.length|0],top=y0+34-h;
   if(r()<.06){/* sách nghiêng */R(x,top+3,w,h-3,col);R(x+1,top+1,w,2,col);x+=w+2;continue}
   R(x,top,w,h,col);R(x,top,1,h,'#fff',.12);R(x+w-1,top,1,h,'#000',.3);
   if(r()<.55)R(x,top+2+(r()*5|0),w,1,'#e8d6a6',.5);if(r()<.3)R(x,top+h-6-(r()*4|0),w,1,'#e0b25a',.55);
   x+=w;if(r()<.1)x+=2+(r()*6|0)}
  R(x0,y0+34,x1-x0,3,'#7a4a24');R(x0,y0+34,x1-x0,1,'#c3a06a',.85);R(x0,y0+37,x1-x0,1,'#000',.4)}}

/* ---------- Thư viện (góc chính, nhìn về phía cửa sổ) ---------- */
/* Thư viện vẽ bằng pxl (assets/art/library.px.js): lớp 440x220 gốc (-60,-20), 1 điểm ảnh = 1 px thế giới */
const libOk=()=>['lib_wall','lib_desk','lib_book','hanh'].every(k=>IM[k]&&IM[k].complete&&IM[k].width);
function pxLayer(key){const im=IM[key],cv=mkc(im.width*K,im.height*K),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,0,cv.width,cv.height);return{cv,ox:-60,oy:-20,w:im.width,h:im.height}}
const HS=1.6;
function buildLibPx(){
 const wall=pxLayer('lib_wall'),desk=pxLayer('lib_desk'),bookL=pxLayer('lib_book'),im=IM.hanh,hx=Math.round(236-21*HS),hy=Math.round(132-45*HS);
 const hanh=P(im.width*HS,im.height*HS,(R,g)=>{g.imageSmoothingEnabled=false;g.drawImage(im,hx,hy,im.width*HS,im.height*HS)},hx,hy);
 return{wall,wallBlur:blurred(wall,26),desk,bookL,an:null,hanh,px:1}}
function buildLib(){if(libOk())return buildLibPx();
 const wall=P(440,220,(R,g)=>{
  R(-60,-20,440,220,'#24150b');
  shelves(R,-60,116,5,[-31,6,43,80,117,154]);shelves(R,204,380,11,[-31,6,43,80,117,154]);
  R(-60,-20,440,25,'#150c06');R(110,0,100,112,'#2b1a0e');
  /* khung + kính cửa sổ */
  R(116,6,88,108,'#4a2c12');R(119,9,82,102,'#7a4a24');R(119,9,82,1,'#c3a06a',.8);
  const gl=g.createLinearGradient(0,14,0,104);gl.addColorStop(0,'#ffc070');gl.addColorStop(.3,'#ffeab8');gl.addColorStop(.62,'#fffbe8');gl.addColorStop(1,'#ffdc92');
  g.fillStyle=gl;g.fillRect(125,14,70,90);
  const r=rng(9);const lf=['#7f8f4a','#9aa75e','#6f8040','#b5b872'];
  for(let i=0;i<26;i++)disc(R,126+(r()*68|0),78+(r()*26|0),3+(r()*5|0),lf[r()*4|0],.6);
  for(let i=0;i<8;i++)disc(R,126+(r()*68|0),16+(r()*14|0),2+(r()*3|0),'#fff6dc',.5);
  R(158,14,4,90,'#6b4220');R(125,56,70,4,'#6b4220');R(158,14,1,90,'#c3a06a',.5);R(125,56,70,1,'#c3a06a',.5);
  R(112,106,96,7,'#8b5a2b');R(112,106,96,1,'#e0b25a',.8);R(112,113,96,2,'#000',.35);
  /* tối dần xuống sàn và lên trần (mượt) */
  let v=g.createLinearGradient(0,-20,0,200);v.addColorStop(0,'rgba(0,0,0,.6)');v.addColorStop(.3,'rgba(0,0,0,0)');v.addColorStop(.7,'rgba(0,0,0,.05)');v.addColorStop(1,'rgba(0,0,0,.5)');g.fillStyle=v;g.fillRect(-60,-20,440,220);
  /* sách gần cửa sổ ấm lên */
  const wg=g.createRadialGradient(160,58,10,160,58,150);wg.addColorStop(0,'rgba(255,190,110,.13)');wg.addColorStop(1,'rgba(255,190,110,0)');g.globalCompositeOperation='lighter';g.fillStyle=wg;g.fillRect(-60,-20,440,220);g.globalCompositeOperation='source-over';
 },-60,-20);
 const wallBlur=blurred(wall,26);
 /* bàn + vật dụng */
 const desk=P(440,100,R=>{
  const r=rng(21);R(-60,132,440,60,'#6b4220');
  for(let y=134;y<190;y+=6)R(-60,y,440,3,'#7a4a24',.55);
  for(let i=0;i<150;i++){const w=8+(r()*30|0);R(-60+r()*440|0,133+(r()*56|0),w,1,r()<.6?'#3a2210':'#b98550',.28)}
  R(-60,132,440,1,'#e0b25a',.9);R(-60,133,440,1,'#c3a06a',.4);
  /* chồng sách bên trái */
  R(16,127,40,5,'#8b2a1c');R(16,127,40,1,'#fff',.15);R(16,131,40,1,'#000',.3);R(18,122,34,5,'#2f5a3a');R(18,122,34,1,'#fff',.15);R(20,117,28,5,'#c3a06a');R(20,117,28,1,'#fff',.2);
  R(16,128,2,3,'#e8d6a6',.8);R(18,123,2,3,'#e8d6a6',.8);
  /* sổ tay của An */
  R(80,126,28,6,'#f1e2b4');R(80,126,28,1,'#fff',.4);R(80,131,28,1,'#8b5a2b',.8);R(80,126,3,6,'#7a4a24');R(92,128,10,1,'#3d4f7a',.7);R(86,129,14,1,'#3d4f7a',.5);
  R(100,124,12,1,'#222');R(110,123,2,2,'#c33');
  /* laptop của An: nhìn từ phía sau nắp máy (màn hình quay về phía An), mép trên ăn sáng ngược */
  R(51,131,36,2,'#6f7782');R(51,131,36,1,'#c9d0d8',.5);R(53,114,32,17,'#4a505b');R(53,114,32,1,'#ffcf8a',.9);R(53,114,1,17,'#ffcf8a',.35);R(84,114,1,17,'#ffcf8a',.25);
  R(53,129,32,2,'#2f343d');R(66,121,5,5,'#aeb7c2',.75);R(67,122,3,3,'#e8eef5',.6);
  /* thùng sách mới chuyển */
  R(268,117,50,24,'#b98250');R(268,117,50,2,'#e0b080',.8);R(268,139,50,2,'#000',.3);R(268,117,1,24,'#000',.25);
  poly(R,[[266,117],[274,108],[320,108],[320,117]],'#d9a46c');R(274,108,46,1,'#f2cf9a',.7);
  const bk=['#8b2a1c','#1d3558','#c3a06a','#2f5a3a','#8a4b66'];for(let i=0;i<7;i++)R(278+i*5,100+(i*7%5),4,12,bk[i%5]);
  R(289,117,7,24,'#e8d6a6',.55);R(298,123,14,9,'#f6ecd0');R(300,125,10,1,'#6b4220',.6);R(300,127,8,1,'#6b4220',.5);R(300,129,9,1,'#6b4220',.4);
 },-60,100);
 /* cuốn sách cũ: lớp riêng, chỉ hiện từ khi cô Hạnh đặt nó lên bàn (cú máy 'book') */
 const bookL=P(440,100,R=>{
  R(128,131,64,6,'#1d3558');R(128,131,64,1,'#3b5a8c');R(128,136,64,1,'#000',.4);
  poly(R,[[131,122],[159,124],[159,131],[130,131]],'#e8d6a6');poly(R,[[161,124],[189,122],[190,131],[161,131]],'#f3e6bd');
  poly(R,[[140,123],[159,125],[159,131],[139,131]],'#f6ecc8',.5);
  for(let i=0;i<4;i++){R(134+i,125+i,18-i,1,'#c3a06a',.55);R(166,126+i,18,1,'#c3a06a',.5)}
  R(136,127,9,1,'#6b3a14',.8);R(147,127,5,1,'#3d4f7a',.7);R(168,128,12,1,'#6b3a14',.7);R(172,130,8,1,'#3d4f7a',.6);
  R(159,123,2,15,'#8b2a1c');R(159,123,1,15,'#c9605f',.6);
 },-60,100);
 /* nhân vật (bóng ngược sáng) */
 const rim1='#ffcf8a',rim2='#c98a5a',ink='#0b0c18';
 const an=sil(60,50,36,88,R=>{
  disc(R,62,100,9,ink);R(53,96,18,5,ink);R(54,91,4,3,ink);R(65,90,5,3,ink);R(58,89,7,2,ink);R(70,94,2,4,ink);R(58,108,8,7,ink);
  poly(R,[[40,138],[41,122],[46,115],[56,111],[68,111],[78,114],[83,122],[84,138]],ink);poly(R,[[37,138],[38,118],[43,114],[46,126],[46,138]],ink)},'r',rim1,rim2);
 const hanh=sil(64,64,204,76,R=>{
  disc(R,236,80,4,ink);disc(R,236,92,8,ink);R(232,98,8,8,ink);
  poly(R,[[206,138],[210,114],[222,104],[250,104],[262,114],[266,138]],ink)},'l',rim1,rim2);
 return{wall,wallBlur,desk,bookL,an,hanh}}

/* Emma (sprite pixel assets/art/out/sprites/emma_idle.png ← Emma.aseprite): ngược sáng cửa nên chỉnh màu hơi tối/ấm và thêm viền sáng hai bên giống bóng Khoa.
   Cắt sát khung hình, phóng nearest 8 lần một lần; asp = rộng/cao để cú máy vẽ đúng tỉ lệ (không bị bóp). Chưa nạp xong ảnh -> null, cảnh dùng tạm bóng cũ. */
let EMS=null;
function emmaSprite(){if(EMS)return EMS;const im=IM.emma_idle;if(!im||!im.complete||!im.width)return null;
 const w=im.width,h=im.height,m=mkc(w,h),mg=m.getContext('2d',{willReadFrequently:true});mg.drawImage(im,0,0);const d=mg.getImageData(0,0,w,h).data,on=(i,j)=>i>=0&&j>=0&&i<w&&j<h&&d[(j*w+i)*4+3]>60;
 let x0=w,x1=0,y0=h,y1=0;for(let j=0;j<h;j++)for(let i=0;i<w;i++)if(on(i,j)){x0=Math.min(x0,i);x1=Math.max(x1,i);y0=Math.min(y0,j);y1=Math.max(y1,j)}
 const cw=x1-x0+3,ch=y1-y0+2,o=mkc(cw,ch),og=o.getContext('2d'),out=og.createImageData(cw,ch),od=out.data,at=(i,j)=>on(i+x0-1,j+y0-1),rim=(i,j,r,g,b,al)=>{const q=(j*cw+i)*4;od[q]=od[q]*(1-al)+r*al;od[q+1]=od[q+1]*(1-al)+g*al;od[q+2]=od[q+2]*(1-al)+b*al};
 for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){if(!at(i,j))continue;const s=((j+y0-1)*w+(i+x0-1))*4,q=(j*cw+i)*4;od[q]=Math.min(255,d[s]*.86+14);od[q+1]=Math.min(255,d[s+1]*.78+6);od[q+2]=d[s+2]*.66;od[q+3]=255}
 for(let j=0;j<ch;j++)for(let i=0;i<cw;i++){if(!at(i,j))continue;if(!at(i-1,j)||!at(i+1,j))rim(i,j,255,242,200,.8);else if(!at(i-2,j)||!at(i+2,j))rim(i,j,232,194,122,.4);if(!at(i,j-1))rim(i,j,255,242,200,.6)}
 og.putImageData(out,0,0);const cv=mkc(cw*8,ch*8),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(o,0,0,cv.width,cv.height);
 return EMS={cv,asp:cw/ch}}
/* ---------- Cửa ra vào (góc ngược): Emma và Khoa bước vào ---------- */
function buildDoor(){
 const wall=P(440,220,(R,g)=>{
  R(-60,-20,440,220,'#1a1009');shelves(R,-60,118,31,[-31,6,43,80]);shelves(R,202,380,47,[-31,6,43,80]);
  R(116,0,88,126,'#2b1a0e');R(120,18,80,110,'#4a2c12');
  const dg=g.createLinearGradient(0,26,0,124);dg.addColorStop(0,'#fffaf0');dg.addColorStop(.5,'#fff1cf');dg.addColorStop(1,'#ffdf9a');g.fillStyle=dg;g.fillRect(126,24,68,100);
  R(150,44,22,38,'#a9b6c2',.22);R(150,44,22,1,'#fff',.4);R(160,44,1,38,'#fff',.25);
  R(126,24,68,2,'#e8d6a6',.8);
  /* sàn gỗ có phối cảnh */
  const fl=g.createLinearGradient(0,124,0,200);fl.addColorStop(0,'#46301a');fl.addColorStop(1,'#120a05');g.fillStyle=fl;g.fillRect(-60,124,440,76);
  g.strokeStyle='rgba(10,5,2,.55)';g.lineWidth=.5;for(let i=-9;i<=9;i++){g.beginPath();g.moveTo(160+i*3,124);g.lineTo(160+i*46,200);g.stroke()}
  R(-60,124,440,1,'#7a4a24',.6);
  let v=g.createLinearGradient(0,-20,0,200);v.addColorStop(0,'rgba(0,0,0,.55)');v.addColorStop(.3,'rgba(0,0,0,.1)');v.addColorStop(1,'rgba(0,0,0,.35)');g.fillStyle=v;g.fillRect(-60,-20,440,220)},-60,-20);
 const wallBlur=blurred(wall,24);
 const ink='#0b0c18',c1='#fff2c8',c2='#e8c27a';
 const mir=(pts)=>pts.map(([a,b])=>[-a,b]);
 const emma=sil(44,86,-22,0,R=>{
  /* tóc dài, tai nghe quàng đầu, áo rộng, váy dài */
  disc(R,0,12,8,ink);R(-6,3,12,3,ink);R(-9,10,3,7,ink);R(6,10,3,7,ink);
  const hl=[[-8,8],[-9,24],[-12,40],[-7,42],[-6,22]];poly(R,hl,ink);poly(R,mir(hl),ink);
  R(-2,19,4,4,ink);poly(R,[[-4,22],[4,22],[12,26],[13,40],[10,54],[-10,54],[-13,40],[-12,26]],ink);
  const ar=[[-12,26],[-16,34],[-17,52],[-13,52],[-11,36]];poly(R,ar,ink);poly(R,mir(ar),ink);
  poly(R,[[-10,52],[10,52],[14,68],[-14,68]],ink);R(-8,68,7,16,ink);R(1,68,7,16,ink);R(-9,83,9,3,ink);R(1,83,9,3,ink)},'b',c1,c2);
 const khoa=sil(44,86,-22,0,R=>{
  /* tóc dựng, ba lô, tay cầm máy ghi âm */
  disc(R,0,12,8,ink);R(-6,3,12,3,ink);R(-5,1,3,3,ink);R(0,0,3,3,ink);R(4,2,3,3,ink);
  R(-2,19,4,4,ink);poly(R,[[-4,22],[4,22],[13,26],[14,40],[12,56],[-12,56],[-14,40],[-13,26]],ink);
  poly(R,[[-13,27],[-18,29],[-19,46],[-13,48]],ink);
  poly(R,[[-13,26],[-17,34],[-17,52],[-13,52]],ink);poly(R,[[13,26],[17,34],[18,46],[14,46]],ink);R(15,41,5,9,ink);
  R(-10,56,9,28,ink);R(1,56,9,28,ink);R(-11,83,11,3,ink);R(1,83,11,3,ink)},'b',c1,c2);
 return{wall,wallBlur,emma:emmaSprite()||emma,khoa,px:!!emmaSprite()}}

/* ---------- Lớp từ ảnh pixel có sẵn (img.js) ---------- */
const imgCache={};
function img(key,y0=0,y1){const im=IM[key];if(!im||!im.complete||!im.width)return null;if(y1==null)y1=im.height;const id=key+y0+'_'+y1;if(imgCache[id])return imgCache[id];
 const sc=VW/im.width,h=(y1-y0)*sc,cv=mkc(VW*K,h*K),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,y0,im.width,y1-y0,0,0,cv.width,cv.height);
 return imgCache[id]={cv,ox:0,oy:y0*sc,w:VW,h}}

/* Dải khung hoạt hoạ pxl (anims/*.png xếp ngang): phóng K lần (nearest) một lần, vẽ từng khung bằng drawImage cắt */
const stripC={};
function strip(key,n){if(stripC[key])return stripC[key];const im=IM[key];if(!im||!im.complete||!im.width)return null;const fw=im.width/n,cv=mkc(im.width*K,im.height*K),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.drawImage(im,0,0,cv.width,cv.height);return stripC[key]={cv,fw,fh:im.height,n}}

/* An (mặt trước, sprite pixel assets/art/out/sprites/an_front.png) ngồi sau laptop trong thư viện.
   Ánh nắng cửa sổ ở phía phải-sau: chỉnh sprite ấm và hơi tối lại, thêm viền sáng ngược sáng bên phải và đỉnh đầu
   (cùng kiểu với bóng Hạnh) để hoà vào cảnh. Chưa nạp xong ảnh -> trả về null, cảnh dùng tạm bóng cũ. */
const AN_S=8/K,AN_X=Math.round(62-24*AN_S),AN_Y=Math.round(112-37*AN_S);   /* phóng ≈1,6 lần sao cho mỗi điểm ảnh sprite = đúng 8 px trong canvas K (không bị lệch nét) cho cân với cô Hạnh và laptop; tâm đầu ≈ x62, cằm (hàng điểm ảnh thứ 37 của sprite) ≈ y112 nằm sát trên nắp laptop (y114) để thấy trọn khuôn mặt */
let ANL=null;
function anFront(){if(ANL)return ANL;const im=IM.an_front;if(!im||!im.complete||!im.width)return null;
 const w=im.width,h=im.height,m=mkc(w,h),mg=m.getContext('2d',{willReadFrequently:true});mg.drawImage(im,0,0);const id=mg.getImageData(0,0,w,h),d=id.data,on=(i,j)=>i>=0&&j>=0&&i<w&&j<h&&d[(j*w+i)*4+3]>60;
 /* chỉnh màu + viền sáng ngược sáng ngay ở độ phân giải gốc, rồi mới phóng nearest một lần (nét điểm ảnh không bị răng cưa) */
 const o2=mkc(w,h),og=o2.getContext('2d'),out=og.createImageData(w,h),od=out.data,rim=(i,j,r,g,b,al)=>{const o=(j*w+i)*4;od[o]=od[o]*(1-al)+r*al;od[o+1]=od[o+1]*(1-al)+g*al;od[o+2]=od[o+2]*(1-al)+b*al};
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){const o=(j*w+i)*4;if(d[o+3]<=60)continue;od[o]=Math.min(255,d[o]*.9+16);od[o+1]=Math.min(255,d[o+1]*.8+6);od[o+2]=d[o+2]*.66;od[o+3]=255}
 for(let j=0;j<h;j++)for(let i=0;i<w;i++){if(!on(i,j))continue;
  if(!on(i+1,j))rim(i,j,255,207,138,.9);else if(!on(i+2,j))rim(i,j,201,138,90,.45);
  if(!on(i,j-1))rim(i,j,255,207,138,.6)}
 og.putImageData(out,0,0);
 ANL=P(w*AN_S,h*AN_S,(R,g)=>{g.imageSmoothingEnabled=false;g.drawImage(o2,AN_X,AN_Y,w*AN_S,h*AN_S)},AN_X,AN_Y);
 return ANL}
let LIB,DOOR;
const drop=pre=>{for(const id in imgCache)if(id.startsWith(pre))delete imgCache[id]},dropStrip=k=>{delete stripC[k]};
return{VW,VH,K,FILT,strip,drop,dropStrip,anFront,get lib(){if(!LIB||(!LIB.px&&libOk()))LIB=buildLib();return LIB},get door(){if(!DOOR||(!DOOR.px&&IM.emma_idle&&IM.emma_idle.complete&&IM.emma_idle.width))DOOR=buildDoor();return DOOR},img,mkc,rng}})();
