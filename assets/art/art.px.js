/* Phù Sa Ký – tranh cinematic mở đầu (pxl). Thế giới 320x180, đường chân trời y≈100.
   Mỗi cảnh xuất theo LỚP (layers:true) để camera giả 3D trong js/cine_art.js có thị sai.
   Dựng lại: node <pxl>/bin/pxl.js build assets/art/art.px.js --out assets/art/out  &&  node tools/build_img.js */
pal({k:"#060914",K:"#0b1020",n:"#161d42",N:"#232d5c",p:"#3d3763",P:"#5c4070",m:"#8a4d73",M:"#b65a6c",r:"#d97260",o:"#f29d5e",O:"#f9bc70",y:"#ffd98c",Y:"#ffeab5",S:"#fff7de",
 t:"#0e2326",T:"#091619",G:"#1f4a3a",g:"#3f7448",h:"#79a05a",d:"#2a1b22",D:"#3b272b",b:"#6b4430",B:"#94603c",c:"#c79a62",
 L:"#e58aa8",l:"#f7c8d4",R:"#7a362a",C:"#b86a40",w:"#e8d6a6",u:"#1d3558"})
ramps("kKnNpPmMrOyS","TtGgh","dDbBc")

/* ---------- bộ dựng dùng chung ---------- */
const SKY=(h)=>grad(0,0,320,h,"kknNNpPmMMrroOOyY","v",.75)
const stars=(c)=>{const r=c.rng(2);for(let i=0;i<46;i++){const x=Math.floor(r()*320),y=Math.floor(r()*30);c.px(x,y,r()<.25?"Y":"P")}}
const clouds=(seed,n)=>(c)=>{const r=c.rng(seed);for(let i=0;i<n;i++){const cy=10+Math.floor(r()*66),k=cy/76,cx=Math.floor(r()*350)-15,rx=16+Math.floor(r()*58),ry=2+Math.floor(r()*3);
 const body=k<.3?"p":k<.55?"P":"m",lit=k<.3?"m":k<.55?"M":"r",edge=k<.55?"o":"O";
 c.ellipse(cx,cy,rx,ry,body);c.ellipse(cx+Math.floor(rx*.12),cy+1,Math.floor(rx*.82),Math.max(1,ry-1),lit);
 c.hline(cx-Math.floor(rx*.55),cy+ry-1,Math.floor(rx*1.05),edge);if(r()<.5)c.hline(cx+Math.floor(rx*.2),cy-ry,Math.floor(rx*.5),"p")}}
const sunAt=(x,y)=>[circ(x,y,17,"o"),circ(x,y,13,"O"),circ(x,y,10,"y"),circ(x,y,7,"Y"),circ(x,y,4,"S")]

/* dừa: thân cong nhẹ + tàu lá rủ */
const palm=(c,x,b,h,col,lean=2)=>{const tx=x+lean,ty=b-h;c.line(x,b,tx,ty,col,h>34?2:1);
 [[-3.05,.9],[-2.6,1],[-2.15,.85],[-1.5,.55],[-.95,.85],[-.5,1],[-.1,.9],[.35,.4]].forEach(([a,s])=>{const L=(h>34?15:9)*s,mx=tx+Math.cos(a)*L*.6,my=ty+Math.sin(a)*L*.6-1,ex=tx+Math.cos(a)*L,ey=ty+Math.sin(a)*L+L*.38;c.line(tx,ty,mx,my,col);c.line(mx,my,ex,ey,col)})}
/* dừa nước / lá cọ khung cảnh gần: tàu lá dài, lá chét hai bên */
const frond=(c,x0,y0,ang,len,droop,col,acc)=>{let px=x0,py=y0;for(let i=1;i<=22;i++){const t=i/22,x=x0+Math.cos(ang)*len*t,y=y0+Math.sin(ang)*len*t+droop*t*t*len;c.line(px,py,x,y,col,t<.3?2:1);
 const L=11*(1-t*.65),nx=-(y-py),ny=(x-px),m=Math.hypot(nx,ny)||1;if(i%1===0){c.line(x,y,x+nx/m*L*.9+ (x-px)*.5,y+ny/m*L+L*.55,i%3?col:acc);c.line(x,y,x-nx/m*L*.9+(x-px)*.5,y-ny/m*L+L*.55,col)}px=x;py=y}}

/* ===================================================================
   SÔNG – hoàng hôn trên rạch (toàn cảnh mở đầu)
   =================================================================== */
sprite("_nha",{w:30,h:16},poly([0,7,15,0,30,7],"T"),rect(3,7,24,3,"T"),rect(5,10,2,6,"T"),rect(23,10,2,6,"T"),rect(11,11,8,2,"t"),px(15,9,"O"),px(14,9,"o"))
sprite("_sampan",{w:30,h:6},poly([0,1,30,0,27,6,4,6],"T"),hline(1,0,28,"M"))
sprite("_ghe",{w:64,h:30},
 poly([0,20,64,17,58,29,8,29],"T"),hline(2,19,60,"o"),          /* thân ghe + vệt sáng mép */
 poly([14,19,18,8,48,6,54,17],"T"),                              /* mái lá */
 hline(18,8,30,"M"),rect(22,10,22,8,"K"),rect(28,11,10,7,"o"),   /* khoang có đèn */
 vline(60,4,14,"T"),px(60,3,"O"),circ(60,3,1,"y"),                /* cột đèn hiệu */
 line(2,22,-2,16,"T",1))
sprite("_luc",{w:12,h:6},ellipse(3,4,3,1,"G"),ellipse(8,4,3,1,"G"),px(5,2,"g"),px(6,1,"L"),px(6,0,"l"),hline(2,3,8,"t"))

scene("intro_river",{w:320,h:180,layers:true},
 layer("sky",SKY(106),stars,clouds(7,20),
   light([200,94,26],1,.6),
   ...sunAt(200,94)),
 layer("far",
   rect(0,98,320,4,"T"),
   (c)=>{const r=c.rng(11);for(let x=-4;x<326;x+=5){const rr=4+Math.floor(r()*5),y=97-Math.floor(r()*5);c.circ(x,y,rr,"t");c.circ(x+1,y+3,rr-1,"T")}
         for(let x=0;x<320;x+=3)c.vline(x,95+Math.floor(r()*3),6,"T");},
   (c)=>{[[18,98,36],[44,98,26],[86,98,32],[132,98,24],[246,98,34],[276,98,40],[306,98,28]].forEach(([x,b,h],i)=>palm(c,x,b,h,"T",i%2?3:-3))},
   stamp("_nha",60,86),stamp("_nha",226,88),stamp("_nha",292,87),
   stamp("_sampan",120,96),stamp("_sampan",262,97,{flip:"x"}),
   grad(0,99,320,5,"tTKT","v")),
 layer("water",
   grad(0,100,320,80,"OooorrMmPNnnKkk","v",.8),
   (c)=>{const r=c.rng(5);
     /* vệt nắng trên nước: dải rộng dần về phía gần */
     for(let i=0;i<150;i++){const y=101+Math.floor(r()*78),k=(y-100)/80,w=Math.round(5+r()*(14+k*52)*(1-k*.25)),cx=200+Math.round((r()-.5)*(18+k*86));c.hline(cx-(w>>1),y,w,k<.35?"Y":k<.6?"y":"O")}
     /* gợn sóng tối ngang */
     for(let i=0;i<110;i++){const y=104+Math.floor(r()*75),k=(y-100)/80,w=Math.round(8+r()*(16+k*50));c.hline(Math.floor(r()*340)-10,y,w,k<.4?"M":k<.7?"N":"n")}
     for(let i=0;i<40;i++){const y=110+Math.floor(r()*68),w=Math.round(5+r()*20);c.hline(Math.floor(r()*330),y,w,"k")}},
   stamp("_luc",46,128),stamp("_luc",52,131),stamp("_luc",270,122),stamp("_luc",284,150),stamp("_luc",236,166),stamp("_luc",120,170,{flip:"x"})),
 layer("boats",stamp("_ghe",56,100),stamp("_sampan",226,116,{flip:"x"}),
   
   ),
 glow("yo",{where:[54,96,70,40],r:8,strength:.45}),
 layer("fore",(c)=>{
   frond(c,-8,34,.5,92,.55,"T","t");frond(c,-8,46,.12,78,.7,"T","t");frond(c,-8,16,.8,70,.5,"T","t");
   frond(c,328,30,2.65,92,.55,"T","t");frond(c,328,44,3.02,78,.7,"T","t");frond(c,328,14,2.35,70,.5,"T","t");
   c.line(-8,200,-6,34,"T",5);c.line(328,200,326,30,"T",4)}))

/* chèo xuồng: người đứng chèo, nón lá, mái chèo đưa theo chu kỳ (8 khung) */
anim("rower",{w:64,h:34,frames:8,fps:6},(c)=>{
 const k=c.phase*Math.PI*2,sw=Math.sin(k),bob=Math.round(Math.sin(k*2)*.6);
 c.poly([0,28,62,26,56,33,6,33],"T");c.hline(2,27,58,"M");                /* thân xuồng */
 c.poly([24,10+bob,30,4+bob,36,10+bob],"T");c.hline(24,10+bob,12,"O");    /* nón lá */
 c.circ(30,12+bob,2,"T");c.line(30,14+bob,29,20,"T",3);                   /* đầu, thân */
 c.line(29,20,27,28,"T",2);c.line(30,20,33,28,"T",2);                      /* chân */
 const hx=33+Math.round(sw*3),hy=18+bob;c.line(30,16+bob,hx,hy,"T");       /* tay */
 c.line(hx,hy,hx+Math.round(sw*9)+10,32,"T");c.line(hx,hy,hx-Math.round(sw*3)-2,10,"T");  /* mái chèo */
 c.px(hx+Math.round(sw*9)+10,32,"O")})

/* ===================================================================
   ĐƯỜNG QUÊ – xe đạp ngược nắng
   =================================================================== */
scene("road",{w:320,h:180,layers:true},
 layer("sky",SKY(110),stars,clouds(21,18),
   light([208,96,26],1,.6),...sunAt(208,96)),
 layer("far",
   rect(0,100,320,6,"T"),(c)=>{const r=c.rng(14);for(let x=-4;x<326;x+=6){const rr=3+Math.floor(r()*4);c.circ(x,98-Math.floor(r()*3),rr,"t")}},
   (c)=>{[[14,102,34],[100,102,30],[176,102,38],[272,102,32],[310,102,28]].forEach(([x,b,h],i)=>palm(c,x,b,h,"T",i%2?3:-2))},
   stamp("_nha",40,90),stamp("_nha",236,90),
   /* cột điện + dây */
   vline(60,50,52,"T"),hline(50,56,22,"T"),hline(54,62,14,"T"),vline(236,48,54,"T"),hline(226,54,22,"T"),hline(230,60,14,"T"),
   wire(72,56,226,54,10,"T"),wire(72,62,226,60,9,"T"),wire(-4,58,50,56,6,"T"),wire(248,54,324,58,7,"T"),
   grad(0,102,320,6,"tTKT","v")),
 layer("mid",rect(0,108,320,16,"K"),
   (c)=>{const r=c.rng(31);[8,70,128,196,252,306].forEach((x,i)=>{const h=36+Math.floor(r()*14);c.line(x,124,x+1,124-h,"T",3);for(let j=0;j<7;j++)c.circ(x+Math.floor((r()-.5)*26),124-h-4+Math.floor((r()-.3)*20),6+Math.floor(r()*5),j%2?"T":"t")})},
   rect(0,118,320,8,"T")),
 layer("ground",
   rect(0,122,320,58,"D"),grad(0,122,320,58,"DDdKkk","v"),
   rect(0,122,320,2,"G"),rect(0,124,320,3,"t"),                        /* bờ cỏ */
   rect(0,127,320,3,"b"),rect(0,130,320,26,"d"),                       /* lề đất + mặt đường */
   (c)=>{for(let x=-6;x<326;x+=34)c.hline(x,143,16,"c")},            /* vạch đường */
   rect(0,156,320,3,"b"),hline(0,126,320,"O"),
   (c)=>{const r=c.rng(3);for(let i=0;i<220;i++)c.px(Math.floor(r()*320),131+Math.floor(r()*24),r()<.5?"K":"D")},
   rect(0,159,320,21,"T"),
   light([140,131,260,131,300,156,110,156],1,.5)),
 layer("fore",(c)=>{const r=c.rng(8);for(let i=0;i<90;i++){const x=Math.floor(r()*330)-5,h=10+Math.floor(r()*26),l=(r()-.5)*7;c.line(x,182,x+Math.round(l),182-h,"T",1)}
   for(let i=0;i<10;i++){const x=Math.floor(r()*320);c.circ(x,172-Math.floor(r()*8),2,"T")}}))

/* ===================================================================
   CỔNG KHU DI TÍCH CỤ PHÓ BẢNG NGUYỄN SINH SẮC – vẽ theo ảnh thực, ở độ phân giải GẤP ĐÔI (640x360) để có chỗ cho ô hoa, đấu củng, tán lá.
   (cutscene tự co ảnh về toạ độ thế giới 320x180 nên các cảnh khác không bị ảnh hưởng)
   Hai tầng mái ngói âm dương màu cam, đầu đao cuộn trắng ngà; dải ô hoa; bảng đỏ chữ vàng (chữ vẽ bằng canvas trong cutscene để đủ dấu);
   bốn trụ tròn màu kem; hai cánh cổng sắt; hàng rào; bồn cây đá; bậc thềm; phía sau: sân, nhà mái cam, cột đèn, hàng cây cao.
   GX/GY: đổi toạ độ ảnh gốc (600x419) sang toạ độ cảnh 640x360 (tỉ lệ .68).
   =================================================================== */
pal({z:"#d65c2c",Z:"#9c3b1f",H:"#f5944f",q:"#e9d9a9",Q:"#b8a678",X:"#867654",x:"#f8efcf",j:"#7a1e25",J:"#e8bb4b",i:"#b1bbc7",I:"#5d6a7a",e:"#7f828a",E:"#4b4e58",F:"#262a36",v:"#2f6c3d",V:"#1b4629",W:"#fffbea"})
const GX=(ix)=>Math.round(150+(ix-50)*.68),GY=(iy)=>Math.round(72+(iy-28)*.68)
/* mái ngói: nền cam, hàng ngói lệch mạch như xây gạch, mép ngói đầu tròn, chấm sáng */
const tiled=(c,pts,yTop,yBot)=>{c.poly(pts,"z");const[p0x,p0y,,,,,,,p4x,p4y,p5x,p5y]=pts;
 const ext=(y)=>{let xl;if(y<=p5y){const t=(y-p0y)/Math.max(1,p5y-p0y);xl=p0x+(p5x-p0x)*t}else{const t=(y-p5y)/Math.max(1,p4y-p5y);xl=p5x+(p4x-p5x)*t}return[Math.round(xl),Math.round(640-xl)]};
 let row=0;for(let y=yTop+2;y<=yBot;y+=3,row++){const[a,b]=ext(y);c.hline(a,y,b-a,"Z");for(let x=a+(row%2)*3;x<b;x+=6)c.vline(x,y-2,2,"Z");for(let x=a+1+(row%2)*3;x<b;x+=6)c.px(x,y-1,"H")}
 const[a0,b0]=ext(yTop);c.hline(a0,yTop,b0-a0,"H");c.hline(a0,yTop+1,b0-a0,"H");
 const[a1,b1]=ext(yBot);c.hline(a1,yBot,b1-a1,"Z");for(let x=a1;x<b1;x+=3){c.px(x,yBot+1,"Z");c.px(x+1,yBot+1,"z");c.px(x+1,yBot+2,"Z")}}
/* đầu đao cuộn: thân cong lên rồi cuộn tròn ở đầu, trắng ngà có bóng */
const curl=(c,x,y,d)=>{c.line(x,y,x+d*3,y-5,"x",2);c.line(x+d*3,y-5,x+d*9,y-9,"x",2);c.line(x+d*9,y-9,x+d*14,y-6,"x",2);c.ring(x+d*12,y-3,3,"x");c.px(x+d*12,y-3,"Q");
 c.line(x+d*1,y+1,x+d*4,y-3,"Q");c.line(x+d*4,y-3,x+d*9,y-7,"Q");c.px(x+d*15,y-6,"x");c.px(x+d*16,y-5,"q")}
/* ô hoa: tấm lưới trắng ngà có hoa văn chữ thập/ô vuông */
const lattice=(c,x,y)=>{c.rect(x-4,y,9,9,"x");c.box(x-4,y,9,9,"Q");c.px(x,y+4,"Q");c.px(x-2,y+2,"Q");c.px(x+2,y+2,"Q");c.px(x-2,y+6,"Q");c.px(x+2,y+6,"Q");c.hline(x-3,y+4,7,"q");c.vline(x,y+1,7,"q");c.px(x,y+4,"X")}
/* đấu củng: củng cong chìa ra hai bên + đấu vuông kê trên đầu cột */
const dou=(c,cx,yT,yB)=>{c.poly([cx-12,yT,cx+12,yT,cx+7,yB,cx-7,yB],"q");c.line(cx-12,yT,cx-7,yB,"X");c.line(cx+12,yT,cx+7,yB,"X");
 c.rect(cx-9,yT+1,18,2,"x");c.rect(cx-5,yT+4,10,3,"Q");c.rect(cx-3,yT+7,6,yB-yT-7,"X");
 c.line(cx-12,yT+1,cx-3,yB,"Q");c.line(cx+12,yT+1,cx+3,yB,"Q");c.rect(cx-2,yB-1,4,2,"x")}
/* cụm lá: hàng chục lá nhỏ rải trong hình elip dẹt, 3 tông (đáy tối – thân – mặt sáng hướng mặt trời), mép lởm chởm có cành con;
   cols = [tối, thân, sáng]; d = hướng sáng (+1 sáng bên phải, -1 sáng bên trái) */
const leafy=(c,r,cx,cy,rx,ry,n,d,cols=["T","t","G"])=>{const pts=[];for(let i=0;i<n;i++){const a=r()*6.283,m=Math.pow(r(),.6);pts.push([Math.round(cx+Math.cos(a)*m*rx),Math.round(cy+Math.sin(a)*m*ry),2+Math.floor(r()*3)])}
 pts.sort((p,q)=>p[1]-q[1]);
 for(let i=0;i<Math.round(n/5);i++){const a=r()*6.283,x0=cx+Math.cos(a)*rx*.9,y0=cy+Math.sin(a)*ry*.9;c.line(Math.round(x0),Math.round(y0),Math.round(x0+Math.cos(a)*7),Math.round(y0+Math.sin(a)*5+3),cols[0])}
 pts.forEach(([x,y,rr])=>{c.circ(x,y+1,rr,cols[0]);c.circ(x,y,rr,cols[1])});
 pts.forEach(([x,y,rr])=>{if(r()<.6)c.circ(x+d,y-1,Math.max(1,rr-1),cols[2])});
 pts.forEach(([x,y,rr])=>{if(r()<.22){c.px(x+d*Math.max(1,rr-1),y-rr+1,"h");c.px(x+d*rr,y-rr+2,"o")}});
 pts.forEach(([x,y,rr])=>{if(r()<.3)c.px(x-d*(rr-1),y+rr-1,cols[0])})}
/* thân cây thon dần + vân vỏ + cành đỡ tán */
const trunk=(c,r,x,yb,yt,w,lean,d)=>{const xt=x+lean;for(let y=yb;y>yt;y-=2){const k=(yb-y)/(yb-yt),xx=Math.round(x+(xt-x)*k),ww=Math.max(2,Math.round(w*(1-k*.55)));c.rect(xx-(ww>>1),y-2,ww,3,"T");c.px(xx+d*(ww>>1),y-1,"d")}
 for(let i=0;i<24;i++){const y=yt+Math.floor(r()*(yb-yt)),k=(yb-y)/(yb-yt),xx=Math.round(x+(xt-x)*k);c.px(xx+Math.floor(r()*3)-1,y,r()<.5?"D":"t")}}
const blob=(c,x,y,r,d)=>{c.circ(x,y+1,r,"T");c.circ(x,y,r,"t");c.circ(x+d*Math.round(r*.3),y-Math.round(r*.25),Math.max(2,Math.round(r*.62)),"G");if(r>5)c.circ(x+d*Math.round(r*.4),y-Math.round(r*.4),Math.round(r*.28),"g")}
const person=(c,x,fy,h,hat)=>{const u=h/26;c.circ(x,fy-h+3*u,3*u,"T");if(hat)c.poly([x-4*u,fy-h+3*u,x,fy-h-2*u,x+4*u,fy-h+3*u],"T");c.poly([x-4*u,fy-h+7*u,x+4*u,fy-h+7*u,x+5*u,fy-4*u,x-5*u,fy-4*u],"T");c.rect(x-4*u,fy-4*u,3*u,4*u,"T");c.rect(x+1*u,fy-4*u,3*u,4*u,"T")}

scene("gate",{w:640,h:360,layers:true},
 layer("sky",grad(0,0,640,232,"kknNNpPmMMrroOOyY","v",.75),
   (c)=>{const r=c.rng(2);for(let i=0;i<90;i++)c.px(Math.floor(r()*640),Math.floor(r()*60),r()<.25?"Y":"P")},
   (c)=>{const r=c.rng(41);for(let i=0;i<16;i++){const cy=20+Math.floor(r()*130),k=cy/150,cx=Math.floor(r()*700)-30,rx=34+Math.floor(r()*110),ry=4+Math.floor(r()*6);
     const body=k<.3?"p":k<.55?"P":"m",lit=k<.3?"m":k<.55?"M":"r",edge=k<.55?"o":"O";
     c.ellipse(cx,cy,rx,ry,body);c.ellipse(cx+Math.floor(rx*.12),cy+2,Math.floor(rx*.82),Math.max(2,ry-2),lit);c.hline(cx-Math.floor(rx*.55),cy+ry-2,Math.floor(rx*1.05),edge)}},
   light([320,208,56],1,.6)),
 layer("trees",
   rect(0,248,640,48,"E"),rect(0,248,640,3,"e"),
   (c)=>{const r=c.rng(19);
     /* hậu cảnh xa: tán thấp, mờ trong khói chiều (xanh tím), thấy qua cổng */
     for(let i=0;i<26;i++)leafy(c,r,176+Math.floor(r()*290),216+Math.floor(r()*18),16+Math.floor(r()*12),8+Math.floor(r()*5),16,r()<.5?1:-1,["T","t","G"]);
     /* hàng cây cao thứ hai (nửa xa) hai bên, hơi nhạt hơn */
     [[88,70,220],[160,40,200],[480,50,210],[560,20,200]].forEach(([x,top,bot])=>{trunk(c,r,x,bot+40,top+30,6,x<320?4:-4,x<320?1:-1);for(let j=0;j<7;j++)leafy(c,r,x+Math.floor((r()-.5)*70),top+Math.floor(r()*(bot-top)*.75),22+Math.floor(r()*14),14+Math.floor(r()*8),30,x<320?1:-1,["n","G","g"])});
     /* cây cao lớn ở hai bên: thân thẳng, vài cành chính, tán nhiều tầng có khe trời, viền sáng phía mặt trời */
     const big=[[26,-6,1],[118,5,1],[196,-3,1],[438,4,-1],[524,-5,-1],[606,3,-1]];
     big.forEach(([x,lean,d],k)=>{const top=-6+k%3*22,bot=296;trunk(c,r,x,bot,top+60,9,lean,d);
       for(let j=0;j<4;j++){const by=bot-60-j*46-Math.floor(r()*14),ex=x+lean*(1-(by-top)/(bot-top))+d*-1*(18+Math.floor(r()*26));c.line(x+lean*.3,by,Math.round(ex),by-26-Math.floor(r()*18),"T",3)}
       for(let j=0;j<11;j++)leafy(c,r,x+Math.floor((r()-.5)*96),top+Math.floor(r()*190),24+Math.floor(r()*18),15+Math.floor(r()*10),44,d)});
     /* thảm lá thả xuống + cành thò vào khung để phá hình tròn */
     for(let i=0;i<22;i++){const x=Math.floor(r()*232)+(i%2?408:0),y=40+Math.floor(r()*190);leafy(c,r,x,y,10+Math.floor(r()*8),6+Math.floor(r()*5),12,i%2?-1:1)};
     c.noise(0,0,236,262,"T",.035,4,"t");c.noise(404,0,236,262,"T",.035,6,"t")},
   /* nhà mái cam phía sau + hai cột đèn đôi */
   rect(216,238,60,14,"q"),rect(220,242,52,6,"Q"),poly([210,238,224,226,268,226,282,238],"z"),hline(224,226,44,"H"),hline(212,236,70,"Z"),
   (c)=>{for(let x=214;x<282;x+=4)c.px(x,237,"Z")},
   rect(0,220,32,4,"z"),poly([0,222,28,222,36,236,0,236],"Z"),
   vline(300,208,44,"I"),vline(301,208,44,"i"),circ(296,208,4,"O"),circ(304,208,4,"O"),circ(296,208,2,"W"),circ(304,208,2,"W"),
   vline(344,212,40,"I"),vline(345,212,40,"i"),circ(340,212,4,"O"),circ(348,212,4,"O"),circ(340,212,2,"W"),circ(348,212,2,"W")),
 layer("gate",(c)=>{
   const R=GX,Y=GY;
   /* --- bồn cây đá (mạch đá, bụi cây nhiều tầng) + hàng rào giáo nhọn --- */
   [[0,R(58)],[R(540),640]].forEach(([x0,x1])=>{c.rect(x0,Y(298),x1-x0,Y(350)-Y(298),"e");c.hline(x0,Y(298),x1-x0,"i");c.hline(x0,Y(298)+1,x1-x0,"i");
     for(let y=Y(298)+7;y<Y(350);y+=9){c.hline(x0,y,x1-x0,"E");for(let x=x0+((y/9|0)%2)*10;x<x1;x+=20)c.vline(x,y-9,9,"E")}
     const rr=c.rng(x0+3);for(let i=0;i<26;i++)blob(c,x0+Math.floor(rr()*(x1-x0)),Y(292)+Math.floor(rr()*6)-3,4+Math.floor(rr()*4),(i%2)?1:-1);
     c.noise(x0,Y(274),x1-x0,Y(298)-Y(274),"v",.14,3,"V")});
   [[0,R(106)],[R(494),640]].forEach(([x0,x1])=>{const yT=Y(274),yB=Y(298);c.hline(x0,yT+4,x1-x0,"I");c.hline(x0,yB-5,x1-x0,"I");c.hline(x0,yT+5,x1-x0,"i");
     for(let x=x0;x<x1;x+=5){c.vline(x,yT+2,yB-yT-2,"i");c.px(x,yT,"J");c.px(x,yT+1,"J");c.px(x-1,yT+2,"J");c.px(x+1,yT+2,"J")}
     for(let x=x0+2;x<x1;x+=40){c.rect(x-2,yT,5,yB-yT+1,"q");c.vline(x+2,yT,yB-yT+1,"Q");c.rect(x-3,yT-2,7,3,"Q")}});
   /* --- hai cánh cổng sắt khép: khung, song, hoa văn vàng; hai cánh mở nghiêng --- */
   [[125,182],[418,478]].forEach(([a,b])=>{const x0=R(a),x1=R(b),yT=Y(262),yB=Y(330),w=x1-x0,mx=(x0+x1)>>1;
     c.rect(x0,yT,w,yB-yT,"I");c.box(x0,yT,w,yB-yT,"E");c.vline(mx,yT,yB-yT,"E");
     for(let x=x0+3;x<x1-2;x+=3)c.vline(x,yT+10,Y(296)-yT-10,"i");
     for(let x=x0+2;x<x1-1;x+=4){c.px(x,yT+7,"J");c.px(x,yT+8,"J");c.px(x-1,yT+9,"J");c.px(x+1,yT+9,"J")}
     c.hline(x0,yT+10,w,"J");c.rect(x0,Y(296),w,3,"J");c.rect(x0+2,Y(298)+4,w-4,yB-Y(298)-8,"i");
     [x0+(w>>2),x1-(w>>2)].forEach(cx=>{c.ring(cx,Y(312),4,"J");c.px(cx,Y(312),"J")});c.line(x0+2,yB-5,x1-2,yB-5,"J");c.vline(x0+1,yT,yB-yT,"i")});
   c.poly([R(205),Y(262),R(222),Y(256),R(222),Y(330),R(205),Y(330)],"I");c.poly([R(205),Y(262),R(210),Y(260),R(210),Y(330),R(205),Y(330)],"E");
   c.poly([R(374),Y(256),R(390),Y(262),R(390),Y(330),R(374),Y(330)],"I");c.poly([R(385),Y(260),R(390),Y(262),R(390),Y(330),R(385),Y(330)],"E");
   /* --- trụ sau (nhỏ, tối) --- */
   [[130,10],[385,9],[464,10]].forEach(([cx,w])=>{const x0=R(cx-w/2),ww=Math.max(4,Math.round(w*.68));c.rect(x0,Y(206),ww,Y(330)-Y(206),"Q");c.vline(x0+ww-1,Y(206),Y(330)-Y(206),"X");c.vline(x0+1,Y(206),Y(330)-Y(206),"q")});
   /* --- tầng mái trên: tường kem + dải ô hoa + mái ngói + đầu đao --- */
   c.rect(R(178),Y(82),R(422)-R(178),Y(114)-Y(82),"q");c.hline(R(178),Y(82),R(422)-R(178),"Q");c.hline(R(178),Y(82)+1,R(422)-R(178),"X");
   for(let i=0;i<11;i++)lattice(c,R(206)+Math.round(i*(R(378)-R(206))/10),Y(90));
   c.rect(R(178),Y(86),R(422)-R(178),2,"Q");c.rect(R(178),Y(104),R(422)-R(178),2,"Q");
   tiled(c,[R(190),Y(60),R(410),Y(60),R(421),Y(71),R(432),Y(82),R(168),Y(82),R(179),Y(71)],Y(60),Y(82));
   c.rect(R(184),Y(54),R(416)-R(184),4,"q");c.hline(R(184),Y(54),R(416)-R(184),"W");c.hline(R(184),Y(58),R(416)-R(184),"Q");
   for(let x=R(192);x<R(410);x+=9)c.rect(x,Y(54)-2,5,3,"x");
   curl(c,R(190),Y(54),-1);curl(c,R(410),Y(54),1);curl(c,R(214),Y(54),-1);curl(c,R(386),Y(54),1);
   /* --- tầng mái dưới: ngói + bờ nóc + đầu đao lớn hai đầu --- */
   tiled(c,[R(130),Y(112),R(470),Y(112),R(546),Y(130),R(540),Y(148),R(60),Y(148),R(54),Y(130)],Y(112),Y(148));
   c.rect(R(124),Y(106),R(476)-R(124),5,"q");c.hline(R(124),Y(106),R(476)-R(124),"W");c.hline(R(124),Y(106)+4,R(476)-R(124),"Q");
   for(let x=R(132);x<R(470);x+=9)c.rect(x,Y(106)-2,5,3,"x");
   curl(c,R(56),Y(112),-1);curl(c,R(124),Y(106),-1);curl(c,R(476),Y(106),1);curl(c,R(544),Y(112),1);
   /* --- xà ngang, hàng đấu củng trên đầu cột, xà dưới --- */
   c.rect(R(78),Y(148)+3,R(522)-R(78),Y(154)-Y(148),"q");c.hline(R(78),Y(148)+3,R(522)-R(78),"X");
   c.rect(R(92),Y(154)+3,R(508)-R(92),Y(170)-Y(154)-3,"X");
   for(let x=R(100);x<R(500);x+=9){c.rect(x,Y(154)+4,5,5,"q");c.px(x+2,Y(154)+6,"Q")}
   [112,195,400,486].forEach(cx=>dou(c,R(cx),Y(154)+2,Y(172)));
   c.rect(R(88),Y(168)+4,R(512)-R(88),Y(178)-Y(168),"q");c.hline(R(88),Y(168)+4,R(512)-R(88),"x");c.hline(R(88),Y(178)+3,R(512)-R(88),"X");
   /* --- bảng đỏ viền vàng kép (chữ vẽ trong cutscene) --- */
   c.rect(R(210),Y(171),R(390)-R(210),Y(212)-Y(171),"j");c.box(R(210),Y(171),R(390)-R(210),Y(212)-Y(171),"J");c.box(R(210)+3,Y(171)+3,R(390)-R(210)-6,Y(212)-Y(171)-6,"J");
   /* --- bốn trụ tròn màu kem: thân có bóng trụ, đầu cột nhiều lớp, chân đá --- */
   [[112,16],[195,20],[400,18],[486,16]].forEach(([cx,w])=>{const x0=R(cx-w/2),ww=Math.max(7,Math.round(w*.68)),yT=Y(182),yB=Y(324);
     c.rect(x0,yT,ww,yB-yT,"q");c.vline(x0+1,yT,yB-yT,"x");c.vline(x0+2,yT,yB-yT,"x");c.vline(x0+ww-1,yT,yB-yT,"X");c.vline(x0+ww-2,yT,yB-yT,"Q");c.vline(x0+ww-3,yT,yB-yT,"Q");
     c.rect(x0-2,Y(178),ww+4,3,"x");c.rect(x0-1,Y(178)+3,ww+2,2,"Q");c.rect(x0-2,yB-5,ww+4,2,"Q");c.rect(x0-3,yB-3,ww+6,3,"q");
     c.rect(x0-4,Y(322),ww+8,Y(336)-Y(322),"e");c.hline(x0-4,Y(322),ww+8,"i");c.hline(x0-4,Y(322)+1,ww+8,"i");c.vline(x0+ww+3,Y(322),Y(336)-Y(322),"E")});
   /* --- bậc thềm: ba bậc có mép sáng + khối đá hai bên --- */
   c.rect(R(82),Y(318),R(106)-R(82),Y(336)-Y(318),"e");c.rect(R(494),Y(318),R(518)-R(494),Y(336)-Y(318),"e");
   c.hline(R(82),Y(318),R(106)-R(82),"i");c.hline(R(494),Y(318),R(518)-R(494),"i");c.vline(R(106)-1,Y(318),Y(336)-Y(318),"E");c.vline(R(494),Y(318),Y(336)-Y(318),"E");
   c.rect(R(85),Y(336),R(515)-R(85),Y(350)-Y(336),"E");for(let y=Y(336);y<Y(350);y+=3){c.hline(R(85),y,R(515)-R(85),"e");c.hline(R(85),y+1,R(515)-R(85),"F")}}),
 layer("ground",rect(0,294,640,66,"F"),grad(0,294,640,66,"FFEFFKk","v"),
   (c)=>{const r=c.rng(23);for(let i=0;i<420;i++)c.px(Math.floor(r()*640),296+Math.floor(r()*62),r()<.5?"E":"K");for(let y=306;y<360;y+=16)for(let x=-20+((y/16|0)%2)*30;x<660;x+=60)c.hline(x,y,34,"E")},
   light([220,296,420,296,520,360,120,360],1,.35)),
 layer("people",(c)=>{person(c,204,298,52,1);person(c,226,296,54,0);person(c,430,300,52,1)}),
 layer("fore",(c)=>{const r=c.rng(12);for(let i=0;i<60;i++){const x=Math.floor(r()*660)-10,h=20+Math.floor(r()*52),l=(r()-.5)*16;c.line(x,368,x+Math.round(l),368-h,"T",2)}
   [[-8,356,24],[18,364,18],[648,356,24],[622,364,18]].forEach(([x,y,rr])=>{c.circ(x,y,rr,"T");c.circ(x,y-3,rr-4,"t")})}),
 glow("O",{where:[284,200,80,24],r:12,strength:.5,bands:3}))

/* chi tiết cận cảnh: cánh sen ép khô rơi ra từ sách (đặc tả 28x16, dùng cho cú máy insert) */
sprite("petal",{w:30,h:18,outline:"d"},poly([2,10,6,3,15,0,24,3,28,10,22,16,10,17],"L"),poly([8,9,13,3,17,3,21,9,15,14],"l"),line(15,2,15,15,"M"),line(9,9,20,9,"m"),noise(0,0,30,18,"M",.05,2,"L"))
