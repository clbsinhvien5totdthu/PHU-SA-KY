/* Phù Sa Ký – bộ ô nền + đồ trang trí cho Map 01 (pxl). Gam "chiều muộn Mekong": xanh lá ngả vàng nắng, bóng tím, nước xanh ngọc có ánh hồng.
   Dựng:  node <pxl>/bin/pxl.js build assets/art/map.px.js --out assets/art/out  &&  node tools/build_mapart.js
   Quy ước: m_* là tile 16x16 hoặc lớp phủ viền; mã_* là đồ trang trí. Sáng từ trên-trái, bóng đổ xuống dưới-phải. */
pal({k:"#2a1f3d",K:"#3d3159",
 Z:"#2c5a45",G:"#437f52",g:"#6fae5e",h:"#a2cf72",H:"#d4e88f",
 Y:"#22503f",y:"#2f6a4a",u:"#42865a",
 W:"#2f6b97",w:"#4a92b8",v:"#7bbdd2",V:"#b2e0e2",F:"#effaf2",Q:"#f4b6c8",q:"#d98fb0",
 C:"#b8a487",c:"#d6c6a6",e:"#eadfc3",E:"#f8f0dc",I:"#98825f",
 D:"#a77c54",d:"#cba374",s:"#e3cb92",
 X:"#b9722e",x:"#e09a42",j:"#f6c966",
 R:"#5f6280",r:"#777a98",o:"#9a9db8",M:"#ece4d2",
 B:"#6b4128",b:"#9c5f37",n:"#d49a62",
 L:"#d9483b",l:"#f08a5d",O:"#ffcf7a",
 P:"#e57fa0",p:"#f6bfd0",A:"#fff0f4",m:"#d9468f",N:"#f07ab4",
 T:"#6a4a3a",t:"#8c6a4a",S:"#1d1b3a55",a:"#b79a5a",f:"#d9c27a"})
ramps("ZGghH","YyuG","BbnO")

/* ============ TILE 16x16 ============ */
const tuft=(c,r,n,dk,lt,hi)=>{for(let i=0;i<n;i++){const x=1+Math.floor(r()*13),y=2+Math.floor(r()*12);c.px(x,y,dk);c.px(x,y-1,lt);if(hi&&r()<.45)c.px(x+1,y-1,hi)}}
const grass=(seed,flower)=>(c)=>{c.rect(0,0,16,16,"g");const r=c.rng(seed);tuft(c,r,5,"G","h","H");
 if(flower){const cols=flower==1?["p","A"]:flower==2?["O","H"]:["N","p"];for(let i=0;i<3;i++){const x=2+Math.floor(r()*11),y=3+Math.floor(r()*10);c.px(x,y+1,"G");c.px(x,y,cols[i%2]);if(i==0)c.px(x+1,y,cols[1])}}}
for(let i=0;i<4;i++)sprite("m_g"+i,{w:16,h:16},grass(11+i*7,0))
for(let i=0;i<3;i++)sprite("m_gf"+i,{w:16,h:16},grass(41+i*5,i+1))
/* cỏ khu mộ: bãi cắt sọc (cỏ cắt tạo sọc nhạt/đậm), trang nghiêm, không hoa */
const mow=(seed)=>(c)=>{c.rect(0,0,16,16,"y");c.rect(0,8,16,8,"u");const r=c.rng(seed);tuft(c,r,3,"Y","u","u")}
for(let i=0;i<2;i++)sprite("m_d"+i,{w:16,h:16},mow(71+i*3))
/* ngoài ranh: đồng cỏ nhạt, phủ sương tím */
sprite("m_out0",{w:16,h:16},(c)=>{c.rect(0,0,16,16,"#a9c08f");const r=c.rng(5);tuft(c,r,3,"#97b27f","#bcd29d")})
sprite("m_out1",{w:16,h:16},(c)=>{c.rect(0,0,16,16,"#a9c08f");const r=c.rng(9);tuft(c,r,3,"#97b27f","#bcd29d")})
sprite("m_dirt0",{w:16,h:16},(c)=>{c.rect(0,0,16,16,"d");c.rect(3,4,2,1,"D");c.rect(10,11,3,1,"D");c.px(7,8,"s");c.px(13,3,"s")})
sprite("m_dirt1",{w:16,h:16},(c)=>{c.rect(0,0,16,16,"d");c.rect(8,3,3,1,"D");c.rect(2,12,2,1,"D");c.px(5,7,"s");c.px(12,9,"s")})
/* nước: sóng ngang ngắn + ánh hồng phản chiếu bầu trời chiều */
const water=(seed,pink)=>(c)=>{c.rect(0,0,16,16,"w");const r=c.rng(seed);
 for(let i=0;i<3;i++){const x=Math.floor(r()*11),y=1+Math.floor(r()*14);c.hline(x,y,3+Math.floor(r()*3),"v");if(r()<.6)c.hline(x+1,y-1,2,"V")}
 if(pink){const x=3+Math.floor(r()*8),y=4+Math.floor(r()*8);c.hline(x,y,3,"Q");c.px(x+1,y+1,"q")}}
for(let i=0;i<4;i++)sprite("m_w"+i,{w:16,h:16},water(3+i*13,i==1))
/* lối đi: gạch lát xếp so le */
const paver=(seed,moss)=>(c)=>{c.rect(0,0,16,16,"c");c.hline(0,7,16,"C");c.hline(0,15,16,"C");c.vline(7,0,7,"C");c.vline(15,8,8,"C");
 c.rect(0,0,7,1,"e");c.rect(0,8,7,1,"e");c.rect(8,8,7,1,"e");c.rect(8,0,7,1,"e");c.px(0,1,"e");c.px(0,9,"e");c.px(8,9,"e");c.px(8,1,"e");
 if(moss){const r=c.rng(seed);for(let i=0;i<3;i++){const x=1+Math.floor(r()*13),y=1+Math.floor(r()*13);c.px(x,y,"g");c.px(x+1,y,"G")}}}
sprite("m_p0",{w:16,h:16},paver(1,0));sprite("m_p1",{w:16,h:16},paver(2,1));sprite("m_p2",{w:16,h:16},paver(3,0));sprite("m_p3",{w:16,h:16},paver(4,1))
/* sân lát (Hồ Sao, Tượng cụ): ô vuông 8x8 xen sáng/nhạt */
sprite("m_plz",{w:16,h:16},(c)=>{c.rect(0,0,16,16,"e");c.rect(8,0,8,8,"c");c.rect(0,8,8,8,"c");c.hline(0,7,16,"C");c.hline(0,15,16,"C");c.vline(7,0,16,"C");c.vline(15,0,16,"C")})
sprite("m_plz1",{base:"m_plz"},px(3,3,"E"),px(11,11,"E"))
/* lề vàng: bó vỉa gạch */
sprite("m_bd0",{w:16,h:16},rect(0,0,16,16,"x"),rect(0,0,16,3,"j"),rect(0,12,16,4,"X"),vline(4,3,9,"X"),vline(11,3,9,"X"))
sprite("m_bd1",{w:16,h:16},rect(0,0,16,16,"x"),rect(0,0,16,3,"j"),rect(0,12,16,4,"X"),vline(8,3,9,"X"),vline(15,3,9,"X"))
/* đường nhựa quanh khu: xám tím, hạt nhựa thưa */
sprite("m_rd0",{w:16,h:16},rect(0,0,16,16,"r"),noise(0,0,16,16,"oR",.04,3))
sprite("m_rd1",{w:16,h:16},rect(0,0,16,16,"r"),noise(0,0,16,16,"oR",.04,8),hline(3,8,6,"M"))
sprite("m_lot",{w:16,h:16},rect(0,0,16,16,"e"),hline(0,15,16,"c"),vline(15,0,16,"c"))
/* cầu gỗ: ván ngang (m_pk_h) / dọc (m_pk_v) */
sprite("m_pk_h",{w:16,h:16},rect(0,0,16,16,"b"),(c)=>{for(let i=0;i<4;i++){c.vline(i*4+3,0,16,"B");c.vline(i*4,0,16,"n");c.px(i*4+1,3,"B");c.px(i*4+1,11,"B")}})
sprite("m_pk_v",{base:"m_pk_h",rot:90})

/* ============ LỚP PHỦ VIỀN (trong suốt) ============ */
/* bờ nước: ô đất cạnh nước, cạnh trên = phía có nước. Viền tối → cát → rìa cỏ rủ */
sprite("m_bank_n",{w:16,h:16},hline(0,0,16,"Z"),hline(0,1,16,"s"),hline(0,2,16,"d"),(c)=>{const r=c.rng(4);for(let i=0;i<7;i++){const x=Math.floor(r()*16);c.px(x,3,"g");if(r()<.5)c.px(x,4,"G")}for(let i=0;i<3;i++)c.px(1+Math.floor(r()*14),1,"E")})
sprite("m_bank_s",{base:"m_bank_n",flip:"y"});sprite("m_bank_e",{base:"m_bank_n",rot:90});sprite("m_bank_w",{base:"m_bank_n",rot:270})
/* mép nước ăn vào bờ: bóng bờ + bọt */
sprite("m_wedge_n",{w:16,h:16},rect(0,0,16,2,"W"),hline(0,2,16,"w"),(c)=>{const r=c.rng(6);for(let i=0;i<4;i++)c.hline(Math.floor(r()*13),3,2+Math.floor(r()*2),"V")})
sprite("m_wedge_s",{base:"m_wedge_n",flip:"y"});sprite("m_wedge_e",{base:"m_wedge_n",rot:90});sprite("m_wedge_w",{base:"m_wedge_n",rot:270})
/* viền lối đi tiếp giáp cỏ */
sprite("m_pedge_n",{w:16,h:16},hline(0,0,16,"I"),hline(0,1,16,"C"))
sprite("m_pedge_s",{base:"m_pedge_n",flip:"y"});sprite("m_pedge_e",{base:"m_pedge_n",rot:90});sprite("m_pedge_w",{base:"m_pedge_n",rot:270})
/* lan can cầu: cạnh trên (phía nước), trụ cách 8 px */
sprite("m_rail_n",{w:16,h:16},rect(0,0,16,2,"n"),hline(0,2,16,"B"),(c)=>{for(const x of [0,8]){c.rect(x,0,2,6,"b");c.px(x,0,"O");c.px(x,1,"n");c.hline(x,6,2,"B")}})
sprite("m_rail_s",{base:"m_rail_n",flip:"y"});sprite("m_rail_e",{base:"m_rail_n",rot:90});sprite("m_rail_w",{base:"m_rail_n",rot:270})

/* ============ ĐỒ TRANG TRÍ ============ */
const shadow=(cx,cy,rx,ry)=>ellipse(cx,cy,rx,ry,"S")
const leafD=sprite("_lfd",{w:3,h:2},".GG\nGG.")
sprite("_lfl",{w:3,h:2},".hh\nhh.");sprite("_lfL",{w:2,h:2},"HH\n.H")
/* cây bàng: tán tầng, mỗi tầng dẹt, sáng phía trên-trái */
const tier=(cx,cy,rx,ry)=>[ellipse(cx,cy+2,rx,ry,"Z"),ellipse(cx-1,cy,rx-1,ry-1,"G"),ellipse(cx-3,cy-2,rx-5,ry-3,"g"),ellipse(cx-5,cy-3,Math.max(3,rx-11),Math.max(2,ry-4),"h")]
sprite("m_bang",{w:60,h:64},shadow(33,60,22,4),rect(28,38,5,22,"T"),vline(28,38,22,"t"),line(30,44,22,38,"T"),line(31,46,40,40,"T"),
 ...tier(30,40,27,8),...tier(30,31,22,7),...tier(30,22,15,6),
 scatter("_lfd",6,12,48,36,40,{on:"g",clip:true}),scatter("_lfl",6,12,48,36,26,{on:"G",clip:true}),scatter("_lfL",10,12,30,30,14,{on:"h",clip:true}))
/* phượng vĩ: tán tròn đầy hoa đỏ cam (mùa hè Đồng Tháp) */
sprite("_fr",{w:3,h:2},"lLl\n.L.");sprite("_fo",{w:2,h:2},"Ol\nl.")
sprite("m_phuong",{w:56,h:60},shadow(30,56,20,4),rect(25,36,5,22,"T"),vline(25,36,22,"t"),
 circ(28,26,22,"Z"),circ(26,24,20,"G"),circ(22,19,14,"g"),circ(19,15,7,"h"),
 scatter("_lfd",8,6,40,38,30,{on:"g",clip:true}),scatter("_fr",6,6,44,40,22,{on:"gGh",clip:true}),scatter("_fo",6,6,44,40,14,{on:"gGh",clip:true}))
/* dừa: thân cong, tàu lá dài rủ */
const frond=(c,x0,y0,ang,len)=>{let px=x0,py=y0;for(let i=1;i<=10;i++){const t=i/10,x=Math.round(x0+Math.cos(ang)*len*t),y=Math.round(y0+Math.sin(ang)*len*t+t*t*len*.55);c.line(px,py,x,y,i%3?"G":"g");if(i>2&&i<9){c.px(x,y+1,"Z");c.px(x+(Math.cos(ang)<0?-1:1),y-1,"h")}px=x;py=y}}
sprite("m_dua",{w:68,h:84},shadow(36,80,12,3),(c)=>{for(let i=0;i<54;i++){const x=Math.round(32+Math.sin(i/17)*4+i*.08),y=78-i;c.rect(x,y,3,1,i%4<2?"t":"T")}
 const tx=35,ty=24;[[-3.1,27],[-2.6,29],[-2.1,25],[-1.6,17],[-.95,22],[-.5,28],[-.05,27],[.4,19]].forEach(([a,l])=>frond(c,tx,ty,a,l));c.circ(tx,ty+1,2,"B");c.px(tx-1,ty+2,"t");c.px(tx+2,ty+3,"t")})
/* bụi tre */
sprite("_tl",{w:5,h:3},".h.h.\nhGhGh\n.G.G.")
sprite("m_tre",{w:44,h:68},shadow(22,64,16,3),(c)=>{const st=[[10,56,6],[17,60,16],[24,62,26],[31,58,12],[37,56,22]];st.forEach(([x,b,top])=>{c.rect(x,top,2,b-top,"#8fb86a");c.vline(x,top,b-top,"#c4dc8a");for(let y=top+6;y<b;y+=9)c.hline(x-1,y,4,"y");
  for(let k=0;k<5;k++){const ly=top+k*4;c.line(x+1,ly,x+(k%2?7:-6),ly+3,"g");c.line(x+1,ly,x+(k%2?5:-4),ly-2,"h")}})})
/* liễu rủ */
sprite("m_lieu",{w:64,h:68},shadow(34,64,20,4),rect(30,34,5,30,"T"),vline(30,34,30,"t"),line(32,40,20,30,"T"),line(33,42,46,32,"T"),
 ellipse(32,26,24,12,"G"),ellipse(30,23,20,9,"g"),ellipse(27,20,12,5,"h"),
 (c)=>{const r=c.rng(21);for(let i=0;i<22;i++){const x=10+Math.floor(i*2.3),top=26+Math.floor(r()*4),len=14+Math.floor(r()*18);for(let y=0;y<len;y++)c.px(x+Math.round(Math.sin((y+i)/5)*1),top+y,y<len*.5?"g":(y%5?"h":"H"))}})
/* hoa giấy + bụi + hoa cỏ */
sprite("m_giay",{w:28,h:22},shadow(15,20,11,2),ellipse(14,12,12,8,"G"),ellipse(12,10,9,6,"g"),scatter("_fm",2,3,24,16,22,{on:"gG",clip:true}))
sprite("_fm",{w:2,h:2},"mN\nNm")
sprite("m_bush",{w:24,h:18},shadow(13,16,10,2),ellipse(12,10,11,7,"Z"),ellipse(11,9,9,6,"G"),ellipse(9,7,5,3,"g"),px(7,10,"L"),px(14,8,"L"),px(16,12,"L"),px(5,8,"l"))
for(const [n,a,b] of [["pink","P","p"],["yellow","x","O"],["white","E","A"]])sprite("m_fl_"+n,{w:14,h:9},(c)=>{[[2,6],[6,4],[10,6],[4,7],[8,7]].forEach(([x,y],i)=>{c.px(x,y+1,"G");c.px(x,y,i%2?b:a);c.px(x-1,y,i%2?a:b);c.px(x+1,y-1,"g")})})
/* lau lách bên bờ nước */
sprite("m_lau",{w:18,h:30},(c)=>{[[3,28,6],[8,29,2],[13,28,9],[6,29,12]].forEach(([x,b,t],i)=>{c.vline(x,t,b-t,i%2?"#c9b06c":"a");c.px(x,t,"T");c.px(x,t+1,"T");c.line(x,b,x-3,b-9,"g");c.line(x,b-3,x+4,b-11,"h")})})
/* sen: lá + hoa */
sprite("m_pad0",{w:14,h:8},ellipse(7,4,6,3,"u"),px(9,3,"_"),px(10,3,"_"),px(10,4,"_"),hline(3,3,5,"g"),px(5,5,"Y"))
sprite("m_pad1",{w:12,h:7},ellipse(6,3,5,3,"u"),px(2,3,"_"),px(2,2,"_"),hline(4,2,4,"g"),px(8,5,"Y"))
sprite("m_lotus",{w:18,h:16},ellipse(9,12,7,3,"u"),hline(5,11,6,"g"),px(13,12,"_"),px(14,12,"_"),vline(9,8,4,"G"),
 poly([5,8, 7,3, 9,6, 11,3, 13,8, 9,10],"p"),poly([7,8, 9,2, 11,8],"A"),px(9,2,"A"),hline(7,8,5,"P"),px(9,7,"O"))
sprite("m_lotus2",{base:"m_lotus",swap:{p:"Q",A:"p",P:"q"}})
/* đèn lồng trên cột */
sprite("m_lantern",{w:20,h:44,outline:"k"},shadow(9,40,6,2),rect(8,10,2,30,"K"),rect(6,38,6,2,"K"),hline(8,10,9,"K"),vline(16,10,3,"K"),
 rect(12,13,9,10,"L"),rect(13,14,7,8,"l"),rect(15,16,3,4,"O"),hline(12,12,9,"B"),hline(12,23,9,"B"),vline(16,24,3,"L"),px(16,27,"O"))
/* ghế đá, đá cuội */
sprite("m_bench",{w:24,h:14,outline:"k"},shadow(13,12,10,1),rect(2,5,20,3,"e"),rect(2,5,20,1,"E"),rect(3,8,3,4,"c"),rect(18,8,3,4,"c"),rect(2,2,20,2,"c"))
sprite("m_stone0",{w:12,h:8},shadow(7,7,5,1),ellipse(6,4,5,3,"C"),ellipse(5,3,3,2,"c"),px(4,2,"e"))
sprite("m_stone1",{w:9,h:6},shadow(5,5,4,1),ellipse(4,3,4,2,"I"),ellipse(3,2,2,1,"C"))
/* cánh hoa bay, đom đóm (khung 5x5 phát sáng vẽ trong game) */
sprite("m_petal0",{w:4,h:3},".pp.\nPAAp\n.PP.");sprite("m_petal1",{w:3,h:3},".A.\nApA\n.A.")

/* ============ CÔNG TRÌNH (vẽ đúng độ phân giải hiển thị, game đặt scale 1) ============ */
pal({J:"#ffd98c",U:"#fff3c4"})
/* nhà mái ngói nhìn chính diện: mái hông (hip) có sống, hiên nhô, tường ván, cửa vòm sáng đèn, cửa sổ chớp, chậu hoa, đèn lồng */
const house=(name,W,H,o)=>sprite(name,{w:W,h:H},(c)=>{
 const rh=Math.round(H*.56),wy=rh-4,m=Math.round(W*.07);
 c.ellipse(W/2,H-4,W*.47,5,"S");
 c.rect(m,wy,W-2*m,H-wy-6,o.wall);                                    /* tường */
 for(let x=m+6;x<W-m;x+=10){c.vline(x,wy+4,H-wy-14,o.plank)}          /* ván đứng */
 c.rect(m,H-14,W-2*m,8,"#8d7f6a");c.hline(m,H-14,W-2*m,"#b8a98f");   /* móng đá */
 for(let x=m+8;x<W-m-8;x+=22)c.vline(x,H-13,7,"#6c6152");
 c.rect(m,wy,5,H-wy-6,o.post);c.rect(W-m-5,wy,5,H-wy-6,o.post);c.vline(m,wy,H-wy-6,"#c89a62");   /* cột */
 /* mái */
 for(let y=4;y<rh;y++){const t=(y-4)/(rh-4),xl=Math.round(m*.2+(-m*.2)*t),xr=W-xl;const row=Math.floor((y-4)/6),f=(y-4)%6;
  c.hline(xl-Math.round(t*m*.5),y,xr-xl+Math.round(t*m),o.r2);
  for(let x=xl-Math.round(t*m*.5);x<xr+Math.round(t*m*.5);x++){const col=(x+(row%2)*5)%10;if(f<4)c.px(x,y,col<5?o.r1:o.r2);else if(f==4)c.px(x,y,o.r3)}}
 c.hline(Math.round(m*.2),4,W-Math.round(m*.4),o.ridge);c.hline(Math.round(m*.2),5,W-Math.round(m*.4),o.r3);          /* sống mái */
 c.rect(0,rh-2,W,3,o.eave);c.hline(0,rh+1,W,"#00000033");c.hline(2,rh+2,W-4,"#2a1f3d44");                          /* mép hiên + bóng */
 for(let x=6;x<W-6;x+=12)c.rect(x,rh,2,3,o.post);
 const dw=Math.round(W*.15),dx=Math.round(W/2-dw/2),dy=H-14-Math.round(H*.26);                                      /* cửa vòm */
 c.rect(dx,dy,dw,H-14-dy,"#4a2d1c");c.ellipse(dx+dw/2,dy,dw/2,dw/2.4,"#4a2d1c");c.rect(dx+3,dy+2,dw-6,H-16-dy,"J");c.ellipse(dx+dw/2,dy+2,dw/2-3,dw/2.8,"J");c.vline(dx+dw/2,dy,H-14-dy,"#6b4128");c.px(dx+dw-6,dy+10,"#4a2d1c")
 for(const wx of [Math.round(W*.2),Math.round(W*.68)]){const ww=Math.round(W*.12),wh=Math.round(H*.12),wyy=wy+Math.round((H-wy)*.18);                             /* cửa sổ */
  c.rect(wx-2,wyy-2,ww+4,wh+4,o.post);c.rect(wx,wyy,ww,wh,"J");c.vline(wx+ww/2,wyy,wh,o.post);c.hline(wx,wyy+wh/2,ww,o.post);c.rect(wx-5,wyy-1,4,wh+2,"#6aa38a");c.rect(wx+ww+1,wyy-1,4,wh+2,"#6aa38a")}
 for(const px_ of [m+2,W-m-14]){c.rect(px_,H-22,12,8,"#b4553a");c.hline(px_,H-22,12,"#d97a55");c.circ(px_+3,H-25,3,"P");c.circ(px_+8,H-26,3,"p");c.circ(px_+6,H-24,2,"A");c.px(px_+5,H-27,"g")}   /* chậu hoa */
 c.vline(W-m-20,rh+3,5,"K");c.rect(W-m-23,rh+8,7,9,"L");c.rect(W-m-22,rh+9,5,7,"l");c.rect(W-m-21,rh+11,3,3,"O")      /* đèn lồng hiên */
 })
const RED={r1:"#c8562e",r2:"#a8442a",r3:"#e8825a",ridge:"#7a2f20",eave:"#8a3a26",wall:"#efe0bd",plank:"#d9c79d",post:"#8a5a3a"}
const GOLD={r1:"#c9a24a",r2:"#a8823a",r3:"#e9cb78",ridge:"#7a5a26",eave:"#8a6a30",wall:"#c98f56",plank:"#b27a45",post:"#6b4128"}
const BRN={r1:"#9c4a35",r2:"#7a3828",r3:"#c26a4e",ridge:"#4a2418",eave:"#5a2c1e",wall:"#d9b784",plank:"#bf9a66",post:"#6b4128"}
house("m_h_exh",360,288,RED);house("m_h_th",192,144,GOLD);house("m_h_th2",144,144,BRN);house("m_h_dt",192,192,RED);house("m_h_bql",224,112,RED)
/* nhà sàn Bác Hồ: mái lá, sàn nâng trên cột, thang */
sprite("m_h_san",{w:192,h:144},(c)=>{c.ellipse(96,138,84,5,"S");
 for(const x of [22,60,98,136,170]){c.rect(x,92,5,46,"#6b4128");c.vline(x,92,46,"#a8683c")}
 c.rect(14,82,164,10,"#b27a45");c.hline(14,82,164,"#e0b87c");for(let x=22;x<176;x+=14)c.vline(x,83,9,"#8a5a3a");
 c.rect(26,48,140,34,"#c98f56");for(let x=32;x<164;x+=9)c.vline(x,50,31,"#b27a45");
 c.rect(80,56,24,26,"#4a2d1c");c.rect(83,59,18,23,"J");c.rect(40,56,18,14,"J");c.rect(130,56,18,14,"J");
 for(const x of [38,128]){c.rect(x,54,22,2,"#6b4128");c.rect(x,70,22,2,"#6b4128");c.vline(x+11,56,14,"#6b4128")}
 for(let y=6;y<50;y++){const t=(y-6)/44,xl=Math.round(70-t*66),xr=192-xl;c.hline(xl,y,xr-xl,((y-6)%5<4)?"#c9a24a":"#a8823a");for(let x=xl;x<xr;x+=6)c.px(x+((y/5|0)%2)*3,y,"#e9cb78")}
 c.hline(60,6,72,"#7a5a26");c.rect(0,48,192,3,"#8a6a30");c.hline(4,52,184,"#2a1f3d55");
 c.rect(84,92,14,46,"#8a5a3a");for(let y=96;y<138;y+=6)c.hline(84,y,14,"#4a2d1c")})
glow("J",{r:7,strength:.45})
