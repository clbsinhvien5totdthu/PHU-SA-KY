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
   CỔNG KHU DI TÍCH – hồ sen lúc chạng vạng
   =================================================================== */
sprite("_cong",{w:140,h:72},
 /* nóc + hai lớp mái ngói, đầu đao cong */
 rect(44,3,52,4,"T"),px(42,2,"T"),px(41,1,"T"),px(98,2,"T"),px(99,1,"T"),rect(66,0,8,4,"T"),
 poly([26,22,44,6,96,6,114,22],"T"),
 poly([10,32,28,17,112,17,130,32],"T"),line(10,32,3,27,"T"),line(130,32,137,27,"T"),px(2,26,"T"),px(138,26,"T"),
 hline(38,10,64,"R"),hline(24,20,92,"R"),hline(12,30,116,"R"),
 rect(26,32,88,3,"K"),rect(26,35,88,1,"R"),
 /* trụ + cổng giữa */
 rect(26,34,9,38,"T"),rect(105,34,9,38,"T"),rect(24,32,13,3,"T"),rect(103,32,13,3,"T"),
 rect(35,35,70,37,"K"),
 rect(48,37,44,7,"R"),hline(50,39,40,"O"),hline(54,41,32,"o"),
 /* hai đèn lồng treo dưới mái hiên, ngoài hai trụ */
 vline(19,33,3,"T"),circ(19,39,3,"O"),px(19,39,"Y"),vline(121,33,3,"T"),circ(121,39,3,"O"),px(121,39,"Y"),
 /* ánh sáng ấm hắt ra từ cổng */
 rect(44,62,52,6,"R"),hline(44,62,52,"o"),
 /* cánh phụ + hàng rào */
 rect(0,44,22,28,"T"),rect(118,44,22,28,"T"),hline(0,44,22,"R"),hline(118,44,22,"R"),
 rect(34,68,72,4,"b"),hline(34,68,72,"B"),
 glow("Oy",{r:4,strength:.25,bands:3}))

sprite("_nguoi",{w:9,h:26},circ(4,3,3,"T"),poly([1,7,8,7,9,22,0,22],"T"),rect(1,22,3,4,"T"),rect(5,22,3,4,"T"))
sprite("_nguoi2",{w:11,h:26},poly([0,5,5,0,10,5],"T"),circ(5,6,2,"T"),poly([1,9,9,9,10,24,0,24],"T"),rect(1,24,4,2,"T"),rect(6,24,4,2,"T"))
sprite("_la",{w:22,h:7},ellipse(11,3,10,3,"G"),ellipse(11,3,10,3,"g",true),hline(4,3,14,"t"),px(14,2,"h"))
sprite("_sen",{w:9,h:12},line(4,11,4,5,"G"),poly([4,0,7,4,6,7,2,7,1,4],"L"),poly([4,1,5,4,4,6,3,4],"l"))

scene("gate",{w:320,h:180,layers:true},
 layer("sky",SKY(112),stars,clouds(41,14),
   light([160,92,26],1,.6),...sunAt(160,92)),
 layer("trees",rect(0,92,320,26,"T"),
   (c)=>{const r=c.rng(9);for(let x=-6;x<330;x+=5){const rr=7+Math.floor(r()*7);c.circ(x,84-Math.floor(r()*12),rr,"t");c.circ(x-2,83-Math.floor(r()*10),rr-3,"G");c.circ(x+2,92,rr,"T")}},
   (c)=>{[[18,100,52],[290,100,56],[64,100,40],[246,100,44]].forEach(([x,b,h],i)=>palm(c,x,b,h,"T",i%2?4:-4))},
   light([90,70,230,70,230,96,90,96],1,.4)),
 layer("gate",stamp("_cong",90,48),rect(0,117,320,3,"b"),rect(0,116,320,1,"B"),
   rect(0,118,320,2,"K"),
   /* lối đi gạch dẫn tới cổng */
   poly([132,118,188,118,214,126,106,126],"d"),hline(132,118,56,"c")),
 layer("water",grad(0,120,320,60,"nnNnkkKk","v"),
   stamp("_cong",90,119,{flip:"y"}),
   shade([0,120,320,60],1,.45),
   (c)=>{const r=c.rng(6);for(let y=122;y<178;y+=2){const k=(y-120)/58;for(let i=0;i<4;i++)c.hline(Math.floor(r()*330)-10,y,Math.round(8+r()*30),r()<.25?"M":"N")}},
   light([112,121,208,121,260,178,60,178],1,.3),
   stamp("_la",30,142),stamp("_la",242,148),stamp("_la",276,166),stamp("_la",70,170),stamp("_la",214,134),
   stamp("_sen",34,134),stamp("_sen",250,140),stamp("_sen",284,158)),
 layer("people",stamp("_nguoi",58,100),stamp("_nguoi2",70,99),stamp("_nguoi",262,101,{flip:"x"}),stamp("_nguoi2",116,101)),
 layer("fore",(c)=>{const r=c.rng(12);for(let i=0;i<26;i++){const x=Math.floor(r()*330)-5,h=14+Math.floor(r()*40),l=(r()-.5)*10;c.line(x,184,x+Math.round(l),184-h,"T",1)}
   [[14,172,16],[300,168,18],[40,160,10],[264,176,12]].forEach(([x,y,rad])=>{c.ellipse(x,y,rad,Math.round(rad*.3),"T");c.ellipse(x,y-1,rad-3,Math.round(rad*.2),"t")});
   c.line(22,190,24,150,"T",1);c.circ(24,148,3,"T");c.line(296,190,294,140,"T",1);c.circ(294,138,3,"T")}))

/* chi tiết cận cảnh: cánh sen ép khô rơi ra từ sách (đặc tả 28x16, dùng cho cú máy insert) */
sprite("petal",{w:30,h:18,outline:"d"},poly([2,10,6,3,15,0,24,3,28,10,22,16,10,17],"L"),poly([8,9,13,3,17,3,21,9,15,14],"l"),line(15,2,15,15,"M"),line(9,9,20,9,"m"),noise(0,0,30,18,"M",.05,2,"L"))
