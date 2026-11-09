/* Phù Sa Ký – Thư viện (Cảnh 01–03, bản thiết kế §4) vẽ bằng pxl.
   Khung 440x220 = thế giới 320x180 mở rộng (-60,-20) cho camera có thị sai (khớp js/cine_art.js).
   Mọi toạ độ trong layer dùng TOẠ ĐỘ THẾ GIỚI của game (layer x:60,y:20 tự dịch vào khung).
   Lớp: wall (kệ, cửa sổ, quạt, nắng) · desk (bàn đọc + đồ vật) · book (cuốn bìa xanh, chỉ hiện khi cô Hạnh đặt lên bàn).
   Sprite: hanh (cô Hạnh, cùng tỉ lệ với An: 1 điểm ảnh sprite = 1,6 px thế giới).
   Dựng: node <pxl>/bin/pxl.js build assets/art/library.px.js --out assets/art/out  &&  node tools/build_img.js */
pal({
  k:"#0b0604", q:"#150c06", d:"#24150b", D:"#3a2210", s:"#4a2c12", S:"#5e3a1a",
  b:"#7a4a24", B:"#8b5a2b", a:"#a0622d", c:"#c3a06a", e:"#e0b25a",
  y:"#ffd98c", Y:"#fff1c4", z:"#fffbe8",
  w:"#e8d6a6", W:"#f3e6bd", h:"#fff6dc",
  g:"#7f8f4a", G:"#566b34", f:"#9aa75e", F:"#c8d08a", v:"#3e5230",
  r:"#8b2a1c", R:"#c9605f", u:"#1d3558", U:"#3b5a8c", t:"#2f5a3a", m:"#8a4b66", n:"#3d4f7a", p:"#5a2a3a", l:"#b8863c",
  C:"#b98250", V:"#d9a46c", E:"#8a5a30", J:"#c33a3a", P:"#e8b830",
  M:"#6f7782", N:"#aeb7c2", X:"#4a505b", I:"#0b0c18", A:"#8fa68a", Z:"#6b7f61",
  /* Hạnh */
  H:"#2b1d1a", j:"#4a3530", T:"#a59d92", L:"#e0a878", O:"#bd8458", Q:"#a8524a", K:"#6b4a34", x:"#cdd9d6", o:"#1a1018", i:"#efe2c0", 
})
ramps("kqdDsSbBaceyYz")

/* ----------------------------- bộ dựng chung ----------------------------- */
const BK=["r","u","a","w","t","m","s","l","n","p","c","B","U","C"]
const inPoly=(pts,x,y)=>{let ins=false;for(let i=0,j=pts.length-2;i<pts.length;j=i,i+=2){const xi=pts[i],yi=pts[i+1],xj=pts[j],yj=pts[j+1];if(((yi>y)!==(yj>y))&&x<(xj-xi)*(y-yi)/(yj-yi)+xi)ins=!ins}return ins}

/* một hàng sách trên kệ; gaps=[[x,w]] là chỗ trống đúng nơi cuốn sách lẽ ra phải nằm (Cảnh 01) */
const bookRow=(c,x0,x1,y0,seed,gaps=[],flat=[])=>{
  const r=c.rng(seed);c.rect(x0,y0,x1-x0,34,"q");
  let x=x0+1;
  while(x<x1-2){
    const gp=gaps.find(g=>g[0]>=x);
    if(gp&&x>=gp[0]){x=gp[0]+gp[1];continue}
    let w=2+(r()*5|0);if(gp&&x+w>gp[0])w=Math.max(1,gp[0]-x);
    const h=17+(r()*14|0),col=BK[r()*BK.length|0],top=y0+34-h;
    if(r()<.05&&!gp){c.poly([x,y0+34,x+w,y0+34,x+w+4,top+4,x+4,top+3],col);x+=w+4;continue}
    c.rect(x,top,w,h,col);c.vline(x+w-1,top,h,"d");if(w>2)c.vline(x,top+1,h-1,"Y");
    if(r()<.55)c.hline(x,top+2+(r()*5|0),w,"w");
    if(r()<.3)c.hline(x,top+h-6-(r()*4|0),w,"e");
    x+=w;if(r()<.1)x+=2+(r()*5|0)
  }
  /* chỗ trống: hốc tối hơn, vệt bụi sáng ở đáy, cuốn bên cạnh nghiêng vào */
  gaps.forEach(([gx,gw])=>{
    c.rect(gx,y0+3,gw,31,"d");c.vline(gx+gw-1,y0+3,31,"k");c.hline(gx,y0+33,gw,"s");c.hline(gx+1,y0+32,gw-2,"b");
    c.poly([gx-5,y0+34,gx-1,y0+34,gx+3,y0+9,gx-1,y0+9],"a");c.line(gx-1,y0+9,gx+3,y0+9,"w");c.line(gx+3,y0+9,gx-1,y0+34,"d");
  });
  /* sách xếp nằm: lô tư liệu cũ chưa kịp lên kệ */
  flat.forEach(([fx,n])=>{for(let i=0;i<n;i++){const w=12+(r()*6|0),col=BK[r()*BK.length|0],yy=y0+34-3*(i+1);c.rect(fx+(r()*3|0),yy,w,3,col);c.hline(fx,yy,w,"Y");c.vline(fx+w-1,yy,3,"w")}})
}
/* một khoang kệ: ván + sách; uprights vẽ riêng */
const bay=(c,x0,x1,seed,rowsGaps,flats,label)=>{
  [-31,6,43,80,117].forEach((y0,i)=>{
    bookRow(c,x0,x1,y0,seed+i*7,rowsGaps[i]||[],flats[i]||[]);
    c.rect(x0,y0+34,x1-x0,3,"B");c.hline(x0,y0+34,x1-x0,"c");c.hline(x0,y0+36,x1-x0,"k");
  });
  /* thẻ mã kệ (nhãn giấy trên ván, như trên kệ thật) */
  c.rect(x0+5,39,22,8,"W");c.box(x0+5,39,22,8,"c");c.text(x0+7,41,label,"D")
}
const upright=(c,x)=>{c.rect(x,-34,4,192,"S");c.vline(x,-34,192,"b");c.vline(x+3,-34,192,"d")}

/* ----------------------------- lớp tường ----------------------------- */
const wallBase=(c)=>{
  c.rect(-60,-20,440,220,"d");
  /* kệ: ba khoang mỗi bên cửa sổ; mỗi khoang có một chỗ trống ở đúng hàng An đã tra mã kệ */
  bay(c,-58,-2,5,{2:[[-30,6]]},{1:[[-54,2]]},"959.7");
  bay(c,2,54,15,{3:[[26,6]]},{3:[[8,0]]},"959.7");
  bay(c,58,110,25,{2:[[86,6]]},{},"959.7");
  bay(c,210,264,35,{},{3:[[216,2]]},"900");
  bay(c,268,322,45,{},{},"910");
  bay(c,326,380,55,{},{1:[[332,1]]},"920");
  [-62,-2,54,110,206,264,322,380].forEach(x=>upright(c,x));
  /* xà trần + gờ trên kệ */
  c.rect(-60,-20,440,24,"q");c.hline(-60,4,440,"D");c.hline(-60,3,440,"s");
  [-30,70,250,350].forEach(x=>{c.rect(x,-20,6,24,"d");c.vline(x,-20,24,"s")});
  /* quạt trần (tiếng quạt là âm thanh duy nhất khi An ngồi lặng) */
  c.vline(160,-20,10,"S");c.rect(157,-11,7,3,"b");c.ellipse(160,-8,5,2,"B");c.hline(156,-9,9,"c");
  c.ellipse(133,-6,19,2,"s");c.hline(116,-7,34,"b");c.ellipse(187,-6,19,2,"s");c.hline(171,-7,34,"b");
  c.ellipse(160,-3,4,2,"S");c.hline(157,-4,6,"c");c.ellipse(160,-12,4,1,"d");
}
const windowArt=(c)=>{
  /* khung cửa + kính ngược sáng */
  c.rect(112,2,96,118,"S");c.box(112,2,96,118,"d");c.rect(116,6,88,108,"s");c.rect(119,9,82,102,"b");c.hline(119,9,82,"c");
  c.grad(125,14,70,90,"yYzzYzYy","v",.7);
  c.hline(125,14,70,"y");
  /* bên ngoài: tán cây mờ, nắng chiếu xuyên lá */
  const r=c.rng(9);
  c.clip([125,14,70,90],()=>{
    for(let i=0;i<30;i++){const x=126+(r()*68|0),y=70+(r()*36|0),rr=3+(r()*5|0);c.circ(x,y,rr,["g","f","G","g"][r()*4|0])}
    for(let i=0;i<14;i++){const x=126+(r()*68|0),y=64+(r()*34|0);c.circ(x,y,2,"F")}
    for(let i=0;i<10;i++){const x=126+(r()*68|0),y=16+(r()*16|0);c.circ(x,y,2+(r()*3|0),"h")}
    c.line(125,70,160,56,"G",2);c.line(160,56,196,66,"G",1);
    for(let i=0;i<7;i++){const x=130+i*9;c.circ(x,58+(i%3)*3,2,i%2?"f":"g")}
  });
  /* chấn song, thanh ngang, bậu cửa */
  c.rect(158,14,4,90,"S");c.vline(158,14,90,"c");c.rect(125,56,70,4,"S");c.hline(125,56,70,"c");
  c.rect(110,106,100,8,"B");c.hline(110,106,100,"e");c.hline(110,113,100,"d");c.rect(112,114,96,2,"q");
  /* chậu cây + hai cuốn sách nằm trên bậu */
  c.rect(124,96,10,10,"a");c.hline(123,96,12,"V");c.hline(124,105,10,"E");
  c.ellipse(129,90,7,5,"G");c.ellipse(127,88,4,3,"g");c.ellipse(133,86,3,3,"f");c.line(129,96,129,89,"v");
  c.rect(172,100,20,3,"u");c.hline(172,100,20,"U");c.rect(174,97,16,3,"r");c.hline(174,97,16,"R");c.vline(191,97,6,"w");
}
/* vệt nắng chiều: điểm ảnh rải thưa (dither) trong các dải chéo, kèm bụi lơ lửng */
const shafts=[
  [112,18,112,44,-60,128,-60,100],
  [112,52,112,78,-60,168,-60,140],
  [208,16,208,42,380,126,380,98],
  [208,50,208,76,380,166,380,138],
  [150,104,172,104,196,200,120,200]
]
const sunItems=()=>[
  (c)=>{const r=c.rng(77);let n=0;while(n<14){const x=-55+(r()*430|0),y=-10+(r()*190|0);if(shafts.some(p=>inPoly(p,x,y))){c.px(x,y,r()<.4?"z":"Y");n++}}}]

scene("library",{w:440,h:220,layers:true},
  layer("wall",{x:60,y:20},wallBase,windowArt,
    /* tối dần lên trần và xuống sàn: hai dải dither theo ramp (không rải đốm) */
    shade([-60,-20,440,22],1,.5),shade([-60,142,440,40],1,.5),
    ...sunItems()),
  layer("desk",{x:60,y:20},
    /* mặt bàn đọc: ván ngang, mối nối so le */
    rect(-60,132,440,56,"S"),
    (c)=>{for(let y=138;y<188;y+=6){c.hline(-60,y,440,"s");const off=(y*13)%67;for(let x=-60+off;x<380;x+=110)c.vline(x,y-6>132?y-6:132,6,"s")}
          const r=c.rng(21);for(let i=0;i<46;i++){const y=134+(r()*6|0)*6+2+(r()*3|0),x=-60+(r()*400|0);c.hline(x,y,6+(r()*18|0),"b")}},
    hline(-60,132,440,"e"),hline(-60,133,440,"c"),
    rect(-60,188,440,12,"D"),hline(-60,188,440,"b"),rect(-60,198,440,2,"k"),
    /* vệt lau của cô Hạnh: khăn vừa lướt qua chỗ định đặt sách */
    light([112,134,106,34],1,.6),
    /* chồng sách nhỏ bên trái */
    rect(16,127,40,5,"r"),hline(16,127,40,"R"),hline(16,131,40,"d"),rect(16,128,2,3,"w"),
    rect(18,122,34,5,"t"),hline(18,122,34,"Z"),rect(18,123,2,3,"w"),hline(24,124,22,"e"),
    rect(20,117,28,5,"c"),hline(20,117,28,"W"),hline(24,119,18,"B"),
    /* hộp bút */
    rect(4,121,9,11,"n"),hline(4,121,9,"U"),vline(6,114,7,"P"),vline(8,112,9,"J"),vline(10,115,6,"w"),
    /* laptop của An – nhìn từ sau nắp máy, viền sáng ngược sáng */
    rect(51,131,36,2,"M"),hline(51,131,36,"N"),
    rect(53,114,32,17,"X"),hline(53,114,32,"y"),vline(53,114,17,"e"),vline(84,114,17,"c"),rect(53,129,32,2,"I"),
    circ(68,123,2,"N"),rect(76,117,5,5,"P"),hline(77,119,3,"e"),
    /* giáo án của An: vòng bút đỏ quanh câu hỏi của học sinh, bút chì gác bên cạnh */
    poly([94,141,126,141,129,158,91,158],"W"),
    (c)=>{for(let i=0;i<4;i++)c.line(97-i*.6,145+i*3,121+i*.6,145+i*3,"c")},
    ellipse(112,154,9,2,"J",true),
    line(100,161,134,153,"P",1),px(135,152,"c"),px(99,161,"m"),
    /* khăn lau và phiếu tiếp nhận lô sách */
    poly([200,140,224,140,226,150,198,150],"i"),hline(200,140,24,"h"),hline(202,145,20,"w"),
    poly([234,140,254,140,257,162,231,162],"W"),
    (c)=>{for(let i=0;i<5;i++)c.hline(236-i*.3,145+i*3,16,"c")},
    rect(246,154,7,5,"J"),box(246,154,7,5,"r"),
    /* thùng sách mới chuyển – lô chờ kiểm kê */
    (c)=>{
      c.rect(268,117,50,24,"C");c.hline(268,117,50,"V");c.hline(268,139,50,"E");c.vline(268,117,24,"E");c.vline(317,117,24,"E");
      c.poly([266,117,274,108,320,108,320,117],"V");c.hline(274,108,46,"h");
      const bk=["r","u","c","t","m","n"];for(let i=0;i<8;i++)c.rect(278+i*5,98+(i*7%5),4,13,bk[i%6]);
      for(let i=0;i<8;i++)c.vline(278+i*5,98+(i*7%5),13,"Y");
      c.rect(289,117,7,24,"w");c.hline(289,117,7,"W");
      c.rect(298,122,14,10,"W");c.box(298,122,14,10,"c");c.hline(300,125,10,"S");c.hline(300,127,8,"b");c.hline(300,129,9,"B");
    }),
  layer("book",{x:60,y:20},
    /* cuốn bìa xanh sẫm đã sờn, chữ nhũ phai gần hết */
    poly([128,138,190,138,194,162,124,162],"u"),
    poly([128,138,190,138,191,141,127,141],"U"),
    rect(124,160,70,4,"w"),hline(124,160,70,"W"),hline(124,163,70,"c"),rect(123,162,2,2,"I"),
    box(131,142,56,16,"n"),
    (c)=>{const l=[[140,146,38],[144,149,30],[148,152,22]];l.forEach(([x,y,w])=>{c.hline(x,y,w,"l");for(let i=0;i<w;i+=7)c.px(x+i+2,y,"u")})},
    vline(126,140,22,"I"),hline(125,141,4,"R"),
    /* cánh sen ép khô và tờ giấy gấp tư ba cột rơi ra */
    ellipse(176,166,6,2,"m"),ellipse(176,165,4,1,"R"),px(171,166,"p"),
    poly([142,164,168,164,171,180,138,180],"W"),vline(150,165,15,"c"),vline(160,165,15,"c"),(c)=>{for(let i=0;i<3;i++)c.hline(140,168+i*4,28,"w")}
  )
)

/* ----------------------------- cô Hạnh ----------------------------- */
/* 40x44, nhìn chính diện hơi nghiêng, ngược sáng từ cửa sổ bên trái: viền sáng bên trái. Cùng tỉ lệ với An (1 ô = 1,6 px thế giới). */
sprite("hanh",{w:40,h:44,outline8:"d"},
  /* tóc búi, hai mảng tóc buông, vài sợi bạc */
  circ(20,3,4,"H"),ellipse(20,10,11,8,"H"),rect(9,10,3,14,"H"),rect(28,10,3,14,"H"),
  px(14,5,"j"),px(24,3,"j"),line(12,12,12,20,"T"),line(27,9,28,16,"T"),
  /* mặt */
  ellipse(20,17,9,9,"L"),hline(12,18,2,"O"),rect(12,24,16,1,"L"),
  poly([11,12,29,12,27,9,13,9],"H"),line(11,12,13,16,"H"),line(29,12,27,16,"H"),
  /* kính tròn gọng nâu */
  ring(16,17,3,"K"),ring(24,17,3,"K"),hline(19,17,2,"K"),px(15,16,"x"),px(23,16,"x"),
  px(16,18,"o"),px(24,18,"o"),hline(14,14,5,"H"),hline(22,14,5,"H"),
  hline(18,22,5,"Q"),px(17,21,"O"),px(23,21,"O"),
  /* cổ + áo: sơ mi sáng, cardigan nâu, thẻ nhân viên */
  rect(17,25,7,4,"O"),
  poly([4,44,5,33,11,28,17,27,24,27,29,28,35,33,36,44],"K"),
  poly([14,28,26,28,20,40],"A"),poly([17,28,24,28,20,33],"i"),
  vline(20,34,10,"S"),
  rect(25,35,5,7,"W"),box(25,35,5,7,"c"),hline(26,37,3,"K"),
  /* viền sáng ngược sáng bên trái và đỉnh đầu */
  (c)=>{for(let y=0;y<44;y++)for(let x=0;x<40;x++){if(!c.is(x,y,"*"))continue;
    if(x>0&&!c.is(x-1,y,"*"))c.px(x,y,"y");else if(x>1&&!c.is(x-2,y,"*"))c.px(x,y,"e");
    if(y>0&&!c.is(x,y-1,"*")&&y<20)c.px(x,y,"e")}}
  )
