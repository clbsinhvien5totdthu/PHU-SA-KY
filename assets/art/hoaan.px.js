/* Phù Sa Ký – Chương 1: cụm tái hiện làng Hòa An, vẽ lại ở ĐỘ PHÂN GIẢI GỐC (cùng mật độ điểm ảnh với nhà/An của game; trong game vẽ 1:1, không phóng).
   Chỉ là mô hình để quan sát — không vận hành dụng cụ. Ánh sáng từ trên-trái, viền nâu sẫm mảnh.  Dựng: pxl build assets/art/hoaan.px.js --out assets/art/out/ha */
pal({k:"#2b1b1a",
 a:"#3a2420",b:"#573629",c:"#7a4a31",d:"#9c6340",e:"#bf8250",f:"#dba468",g:"#f0c88c",h:"#fbe5b8",
 p:"#efe3c8",q:"#d9c9a6",r:"#b9a57e",
 G:"#4e7f4b",H:"#78ad62",I:"#2f5a3a",
 Z:"#40384e",X:"#58506e",L:"#c9c4d6",
 s:"#6a6d8c",t:"#8a8dab",u:"#b0b3cc",v:"#dfe0ee",           /* đá */
 y:"#e3b04b",Y:"#f6d77a",j:"#d98f2b",J:"#a9651c",           /* thuốc/vàng */
 T:"#c9a24f",U:"#e6cf82",V:"#a98536",                          /* rơm/lá */
 F:"#ff9a3c",E:"#ffd66b",O:"#e0502d",                         /* lửa */
 W:"#2f6b97",w:"#7bbdd2",P:"#e57fa0",N:"#26385f",K:"#c4574a"})
ramps("kabcdefgh","kstuv")
const R=(c,n)=>c.rng(n);
const HX=(c)=>c;                                                                   /* màu có thể viết thẳng mã hex */
/* nón lá (nón Việt): nón chóp + sườn + quai */
function non(c,cx,cy,w,h){c.poly([cx,cy-h, cx+w/2,cy, cx-w/2,cy],"#e6cf82");c.poly([cx,cy-h, cx-w/2,cy, cx-w/6,cy],"#efd78e");c.poly([cx,cy-h, cx+w/2,cy, cx+w/3,cy],"#c9a24f");
 for(let i=1;i<4;i++){const y=cy-h+Math.round(h*i/4),hw=Math.round(w/2*i/4);c.hline(cx-hw+1,y,hw*2-1,"#b8903f")}c.hline(cx-w/2,cy,w,"#8a6a2a");c.line(cx-w/4,cy,cx-w/6,cy+7,"#c4574a",1)}
/* ===== Cụm xay lúa – giã gạo (204x120): chày đạp chân + cối xay tre trét đất + chum sành + thúng lúa ===== */
sprite("ha_xay_gia",{w:204,h:120,outline:"k"},(c)=>{const r=R(c,4);
 /* rơm rải + cỏ lấn */
 c.ellipse(100,114,98,5,"#00000014");
 for(let i=0;i<46;i++){const x=4+(r()*190|0),y=108+(r()*8|0);c.line(x,y,x+3+(r()*5|0),y+(r()*2|0),r()>.5?"#e6cf82":"#c9a24f",1)}
 /* cối giã đá + chày + đòn đạp */
 c.ellipse(40,102,28,9,"#5a5e7c");c.ellipse(40,100,28,9,"#8a8dab");c.ellipse(40,99,22,7,"#6a6d8c");c.ellipse(40,100,17,5,"#3a3c58");c.noise(14,92,52,16,"su",.1,3);
 for(let i=0;i<20;i++)c.px(30+(r()*20|0),98+(r()*4|0),"#efe3c8");c.hline(13,104,54,"#4a4c68");
 c.rect(60,40,12,62,"#7a4a31");c.vline(60,40,62,"#bf8250");c.vline(71,40,62,"#573629");c.rect(86,48,10,54,"#7a4a31");c.vline(86,48,54,"#bf8250");c.vline(95,48,54,"#573629");  /* chân chạng */
 c.rect(58,84,40,4,"#573629");c.hline(58,84,40,"#9c6340");
 c.poly([6,60, 70,44, 70,56, 6,72],"#9c6340");c.poly([6,60, 70,44, 70,47, 6,63],"#dba468");c.poly([6,69, 70,53, 70,56, 6,72],"#573629");                 /* đòn dài (dốc lên) */
 c.poly([70,44, 128,28, 128,38, 70,56],"#9c6340");c.poly([70,44, 128,28, 128,31, 70,47],"#dba468");c.poly([70,53, 128,35, 128,38, 70,56],"#573629");
 for(const x of[68,76])c.rect(x,46,3,12,"#c9a24f");                                                                                                    /* dây buộc */
 c.rect(30,66,13,36,"#bf8250");c.vline(30,66,36,"#f0c88c");c.vline(42,66,36,"#7a4a31");c.rect(28,94,17,8,"#9c6340");c.hline(28,94,17,"#dba468");     /* chày */
 for(const y of[72,80,88])c.hline(31,y,11,"#9c6340");
 c.rect(120,10,6,92,"#7a8a3a");c.vline(120,10,92,"#a4b85a");c.vline(125,10,92,"#4f5e22");for(const y of[26,48,70,90]){c.rect(119,y,8,3,"#4f5e22");c.hline(119,y,8,"#a4b85a")}   /* cột tre vịn */
 non(c,123,10,34,16);
 /* cối xay lúa tre trét đất */
 c.rect(124,80,78,6,"#9c6340");c.hline(124,80,78,"#dba468");c.hline(124,85,78,"#573629");c.rect(130,86,8,26,"#7a4a31");c.rect(188,86,8,26,"#7a4a31");c.vline(130,86,26,"#bf8250");c.vline(188,86,26,"#bf8250");c.rect(138,98,50,4,"#573629");
 c.ellipse(163,76,36,12,"#6a4630");c.rect(127,64,72,12,"#8a5a3a");c.ellipse(163,64,36,12,"#a9633a");c.ellipse(163,63,31,9,"#c98152");     /* đĩa dưới */
 for(let x=130;x<198;x+=4){c.vline(x,64,12,x%8?"#6a4630":"#573629")}c.hline(127,75,72,"#3a2420");
 c.ellipse(163,54,32,11,"#6a4630");c.rect(131,44,64,10,"#8a5a3a");c.ellipse(163,44,32,11,"#b9703f");c.ellipse(163,43,26,8,"#d9935e");c.ellipse(163,43,9,3,"#5a3a2a");   /* đĩa trên */
 for(let x=134;x<192;x+=4)c.vline(x,44,10,x%8?"#6a4630":"#573629");c.hline(131,53,64,"#3a2420");
 for(let i=0;i<5;i++)c.line(163-9+i*4,40,163-14+i*7,30,"#c9a24f",2);c.ellipse(163,30,14,4,"#e6cf82");c.ellipse(163,30,14,4,"#8a6a2a",true);                  /* phễu tre đan */
 c.line(190,44,200,22,"#7a4a31",3);c.line(190,43,200,21,"#bf8250",1);c.rect(194,12,12,5,"#9c6340");c.hline(194,12,12,"#dba468");                            /* tay quay */
 c.ellipse(163,90,30,5,"#efe3c8");c.noise(140,86,46,8,"pq",.3,7);                                                                                    /* bột/ gạo rơi */
 /* nia gạo + thúng lúa + chum */
 c.ellipse(112,110,22,6,"#a98536");c.ellipse(112,108,22,6,"#e6cf82");c.ellipse(112,108,18,4,"#efe3c8");c.noise(96,105,32,6,"pq",.4,2);c.ellipse(112,108,22,6,"#8a6a2a",true);
 c.ellipse(24,114,0,0,"#0000");
 c.rect(166,98,26,18,"#c9a24f");c.ellipse(179,98,13,4,"#e3b04b");c.ellipse(179,98,11,3,"#f6d77a");for(let i=0;i<16;i++)c.px(171+(r()*16|0),97+(r()*3|0),"#a9651c");
 for(let y=102;y<116;y+=3)c.line(166,y,192,y,"#a98536",1);c.vline(166,100,16,"#e6cf82");
 c.rect(3,80,22,30,"#8a4a2a");c.ellipse(14,80,11,4,"#a9633a");c.ellipse(14,80,8,2,"#3a1f14");c.rect(3,84,22,3,"#a9633a");c.vline(4,86,22,"#c98152");c.vline(24,86,22,"#6a3820");c.ellipse(14,110,11,3,"#6a3820");      /* chum sành */
 c.line(6,96,22,94,"#c9a24f",1)})
/* ===== Cụm xắt thuốc lá (168x120): bàn xắt, nong phơi sợi vàng, giàn treo lá, ấm trà ===== */
sprite("ha_xat_thuoc",{w:168,h:120,outline:"k"},(c)=>{const r=R(c,6);
 c.ellipse(80,116,80,4,"#00000014");
 /* nong tre phơi sợi thuốc (nghiêng) */
 c.ellipse(138,62,26,26,"#a98536");c.ellipse(138,62,23,23,"#e3b04b");for(let i=0;i<150;i++){const a=r()*6.28,d=r()*21;c.px(138+Math.cos(a)*d,62+Math.sin(a)*d,["#f6d77a","#d98f2b","#e3b04b","#a9651c"][i%4])}
 c.ellipse(138,62,26,26,"#7a5a22",true);c.ellipse(138,62,26,26,"#c9a24f",true);
 /* giàn phơi: 2 cột tre, thanh ngang, lá thuốc nguyên tàu treo */
 c.rect(100,16,6,100,"#7a8a3a");c.vline(100,16,100,"#a4b85a");c.vline(105,16,100,"#4f5e22");for(const y of[34,60,86])c.hline(99,y,8,"#4f5e22");
 c.rect(160,16,6,100,"#7a8a3a");c.vline(160,16,100,"#a4b85a");c.vline(165,16,100,"#4f5e22");
 c.rect(96,14,74,6,"#9c6340");c.hline(96,14,74,"#dba468");c.hline(96,19,74,"#573629");
 for(let i=0;i<9;i++){const x=108+i*6,L=30+(r()*16|0);c.line(x,20,x+(r()*2|0)-1,20+L,"#a9651c",3);c.line(x-1,20,x-1,20+L-2,"#d98f2b",1);c.line(x+1,26,x-2,20+L-8,"#8a4a14",1)}
 /* bàn xắt */
 c.rect(6,70,86,10,"#bf8250");c.hline(6,70,86,"#fbe5b8");c.hline(6,71,86,"#f0c88c");c.rect(6,80,86,9,"#9c6340");c.hline(6,88,86,"#573629");
 c.rect(12,89,10,27,"#7a4a31");c.rect(76,89,10,27,"#7a4a31");c.vline(12,89,27,"#bf8250");c.vline(76,89,27,"#bf8250");c.rect(22,98,54,4,"#7a4a31");
 /* khung dao + lưỡi + tay cầm */
 c.rect(10,24,8,48,"#7a4a31");c.rect(80,24,8,48,"#7a4a31");c.vline(10,24,48,"#bf8250");c.vline(87,24,48,"#573629");c.rect(6,20,86,8,"#9c6340");c.hline(6,20,86,"#dba468");c.hline(6,27,86,"#573629");
 c.poly([12,40, 88,34, 88,38, 12,46],"#dfe0ee");c.poly([12,40, 88,34, 88,35, 12,41],"#fff");c.poly([12,44, 88,37, 88,38, 12,46],"#8a8dab");c.rect(86,32,16,7,"#7a4a31");c.hline(86,32,16,"#bf8250");c.rect(2,38,12,9,"#9c6340");c.hline(2,38,12,"#dba468");
 /* bó lá xếp ngay ngắn dưới dao */
 c.rect(22,54,56,16,"#8a4a14");c.rect(22,54,56,4,"#d98f2b");c.hline(22,54,56,"#f6d77a");for(let i=0;i<10;i++)c.hline(22+(r()*8|0),58+i*1.2,30+(r()*26|0),i%2?"#a9651c":"#c4781e");c.vline(22,54,16,"#f6d77a");c.vline(77,54,16,"#6a3a10");
 c.poly([28,50, 72,53, 72,55, 28,52],"#e3b04b");
 /* khay sợi + rổ */
 c.ellipse(46,108,28,7,"#a98536");c.ellipse(46,104,26,8,"#e6cf82");c.ellipse(46,103,23,6,"#e3b04b");for(let i=0;i<56;i++)c.line(26+(r()*40|0),100+(r()*5|0),28+(r()*40|0),104+(r()*4|0),["#f6d77a","#d98f2b","#e3b04b"][i%3],1);c.ellipse(46,104,26,8,"#7a5a22",true);
 /* ấm trà tích + chén trên ghế đẩu */
 c.rect(112,92,26,5,"#9c6340");c.hline(112,92,26,"#dba468");c.rect(114,97,5,18,"#7a4a31");c.rect(131,97,5,18,"#7a4a31");
 c.ellipse(124,86,9,7,"#8a4a2a");c.ellipse(124,84,8,5,"#a9633a");c.rect(121,76,6,3,"#6a3820");c.line(133,84,139,80,"#8a4a2a",2);c.line(115,83,110,86,"#8a4a2a",2);c.ellipse(134,91,3,2,"#efe3c8");
 non(c,152,116,34,16)})
/* ===== Cụm nghề rèn (176x144): mái lá dừa nước, lò đất sét, ống bễ, đe, giá treo dao rựa ===== */
sprite("ha_ren",{w:176,h:144,outline:"k"},(c)=>{const r=R(c,8);
 c.ellipse(88,140,84,4,"#00000018");
 c.rect(10,46,156,92,"#2e211f");c.grad(10,46,156,50,"ab","v",.5);
 for(let x=14;x<164;x+=8)c.vline(x,50,84,"#3a2a28");                                                                 /* phên tre sau lưng */
 /* cột gỗ */
 c.rect(4,40,10,100,"#7a4a31");c.rect(162,40,10,100,"#7a4a31");c.vline(4,40,100,"#bf8250");c.vline(162,40,100,"#bf8250");c.vline(13,40,100,"#573629");c.vline(171,40,100,"#573629");
 /* mái lá dừa nước: các tàu lá xếp lớp, rìa tua */
 c.poly([0,46, 88,2, 176,46, 172,58, 4,58],"#a98536");
 for(let k=0;k<7;k++){const y=6+k*7,hw=14+k*12;c.poly([88-hw,y+8, 88+hw,y+8, 88+hw+3,y+16, 88-hw-3,y+16],k%2?"#e6cf82":"#c9a24f");for(let x=88-hw;x<88+hw;x+=3)c.line(x,y+8,x-1,y+15,"#8a6a2a",1)}
 for(let x=2;x<174;x+=3){const L=4+((x*7)%7);c.vline(x,52,L,x%2?"#8a6a2a":"#c9a24f")}
 c.poly([88,2,176,46,172,52,88,8],"#efd78e");c.poly([88,2,0,46,4,52,88,8],"#c9a24f");c.rect(84,0,8,8,"#9c6340");c.hline(84,0,8,"#dba468");
 /* lò đất sét */
 c.ellipse(58,128,36,6,"#1c1418");c.rect(22,88,72,40,"#d98f2b");c.ellipse(58,88,36,14,"#a9651c");c.ellipse(58,84,30,11,"#d98f2b");c.ellipse(58,80,22,8,"#e3b04b");
 c.rect(22,88,12,40,"#e3b04b");c.vline(22,92,34,"#f6d77a");c.rect(82,88,12,40,"#a9651c");c.noise(22,88,72,40,"jJ",.1,9);
 c.rect(34,104,48,24,"#2a1a16");c.ellipse(58,104,24,8,"#2a1a16");c.rect(37,110,42,18,"#e0502d");c.rect(40,114,36,14,"#ff9a3c");c.rect(46,118,24,10,"#ffd66b");c.ellipse(58,111,20,5,"#e0502d");
 for(let i=0;i<10;i++)c.px(40+(r()*36|0),111+(r()*14|0),r()>.5?"#fff2b8":"#ff9a3c");
 c.rect(52,70,12,22,"#a9651c");c.rect(50,66,16,6,"#d98f2b");                                                          /* ống khói đất */
 /* ống bễ gỗ */
 c.rect(100,108,32,18,"#9c6340");c.hline(100,108,32,"#dba468");c.hline(100,125,32,"#573629");for(let x=104;x<130;x+=5)c.vline(x,109,16,"#7a4a31");
 c.rect(92,114,10,6,"#58506e");c.hline(92,114,10,"#8a8dab");c.line(132,112,156,92,"#7a4a31",3);c.line(132,111,156,91,"#bf8250",1);c.rect(152,86,8,6,"#9c6340");
 /* đe trên gốc cây + búa */
 c.rect(120,130,34,12,"#a98536");c.ellipse(137,130,17,5,"#c9a24f");c.ellipse(137,130,17,5,"#7a5a22",true);
 c.poly([112,118, 160,118, 152,130, 122,130],"#58506e");c.poly([112,118, 160,118, 160,121, 112,121],"#dfe0ee");c.poly([160,118,172,121,160,126],"#8a8dab");c.rect(128,128,16,3,"#2a2430");
 c.line(150,84,158,134,"#7a4a31",3);c.rect(140,78,26,12,"#6a6d8c");c.hline(140,78,26,"#dfe0ee");c.hline(140,89,26,"#3a3c58");
 /* giá treo dao, rựa, cuốc, liềm */
 c.rect(100,50,60,4,"#7a4a31");c.hline(100,50,60,"#bf8250");
 c.poly([106,54, 112,54, 112,86, 108,92, 106,86],"#b0b3cc");c.vline(106,54,32,"#fff");c.rect(105,50,8,8,"#573629");
 c.poly([122,54, 126,54, 126,96, 122,96],"#b0b3cc");c.rect(120,50,8,10,"#573629");c.poly([122,96,126,96,130,102,124,100],"#8a8dab");
 c.poly([138,54, 144,54, 150,80, 142,84, 138,70],"#8a8dab");c.vline(138,54,18,"#fff");c.rect(137,50,8,8,"#573629");
 c.line(152,56,152,72,"#7a4a31",3);c.poly([148,70, 160,70, 160,76, 150,78],"#b0b3cc");
 /* thùng nước + than */
 c.rect(8,106,20,26,"#9c6340");c.ellipse(18,106,10,3,"#3a2420");c.ellipse(18,107,8,2,"#5aa5c8");for(const y of[112,122])c.hline(8,y,20,"#573629");c.vline(9,108,24,"#dba468");
 c.ellipse(36,136,14,4,"#1c1418");for(let i=0;i<20;i++)c.px(24+(r()*24|0),132+(r()*5|0),["#2a2430","#3a3c58","#4a4c68"][i%3])},glow("OFE",{r:16,strength:.5,bands:4}))

/* người ngồi (áo bà ba + khăn rằn), nhìn thẳng: cx giữa, by đáy; ang: tay đưa lên đàn */
function ngoi(c,cx,by,o){const sh=o.shirt||"#5a3a2a",shl=o.shl||"#7a5238",hair="#1c1418";
 c.ellipse(cx,by-5,22,6,"#2a2430");c.ellipse(cx,by-7,22,6,"#3a3448");c.ellipse(cx-9,by-3,7,3,"#f9bb92");c.ellipse(cx+9,by-3,7,3,"#f9bb92");                       /* chân xếp bằng */
 c.rect(cx-12,by-32,24,26,sh);c.rect(cx-12,by-32,5,26,shl);c.vline(cx+11,by-32,26,"#3a2418");c.vline(cx,by-30,22,"#3a2418");for(const y of[by-27,by-21,by-15])c.px(cx+2,y,"#efe3c8");
 c.rect(cx-5,by-34,10,4,"#d18e75");                                                                                                                      /* cổ */
 /* khăn rằn vắt vai */
 c.poly([cx-12,by-32, cx-4,by-32, cx+10,by-10, cx+3,by-10],"#e8e4d8");for(let i=0;i<9;i++){const x=cx-10+i*2,y=by-30+i*2;c.px(x,y,"#2b2430");c.px(x+2,y+1,"#2b2430");c.px(x+1,y+3,"#2b2430")}
 /* đầu */
 c.ellipse(cx,by-44,13,12,"#f9bb92");c.ellipse(cx,by-54,13,7,hair);c.rect(cx-13,by-54,4,10,hair);c.rect(cx+9,by-54,4,10,hair);c.hline(cx-9,by-47,18,hair);c.px(cx-9,by-46,hair);c.px(cx+8,by-46,hair);
 c.rect(cx-7,by-43,3,4,"#1c1418");c.rect(cx+4,by-43,3,4,"#1c1418");c.px(cx-7,by-43,"#fff");c.px(cx+4,by-43,"#fff");c.rect(cx-11,by-39,3,2,"#ee9a8a");c.rect(cx+8,by-39,3,2,"#ee9a8a");c.hline(cx-2,by-37,5,"#b5524a");c.px(cx-1,by-38,"#d18e75");
 if(o.hat)c.rect(cx-14,by-58,28,3,"#e6cf82")}
/* ===== Điểm nghe đờn ca tài tử (152x100): chiếu hoa, hai nhạc công, đàn kìm + đàn tranh, bộ ấm trà ===== */
sprite("ha_don_ca",{w:152,h:100,outline:"k"},(c)=>{const r=R(c,12);
 /* chiếu hoa dệt cói: sọc màu + hoa văn */
 c.poly([4,62, 148,62, 152,96, 0,96],"#e6cf82");for(let x=2;x<150;x+=6){c.line(x+1,64,x-1,96,x%12?"#efd78e":"#c9a24f",1)}
 c.poly([4,62,148,62,148,66,4,66],"#c4574a");c.poly([0,92,152,92,152,96,0,96],"#c4574a");c.poly([4,66,148,66,149,70,4,70],"#2f7a6a");c.poly([0,88,152,88,152,92,0,92],"#2f7a6a");
 for(let x=14;x<140;x+=18){c.circ(x,79,4,"#c4574a");c.circ(x,79,2,"#f6d77a");c.px(x-6,79,"#2f7a6a");c.px(x+6,79,"#2f7a6a")}
 c.hline(4,62,144,"#fbe5b8");
 /* nhạc công trái: đàn kìm (nguyệt) */
 ngoi(c,32,86,{shirt:"#5a3a2a",shl:"#7a5238"});
 c.line(46,76,84,46,"#7a4a31",4);c.line(46,75,84,45,"#bf8250",1);c.ellipse(90,42,12,12,"#9c6340");c.ellipse(90,41,10,10,"#bf8250");c.ellipse(90,41,5,5,"#3a2420");c.ring(90,41,10,"#573629");     /* cần dài + thùng tròn */
 for(const[x,y]of[[54,70],[62,64],[70,58]])c.rect(x-2,y,5,3,"#f6d77a");c.line(46,72,88,40,"#dfe0ee",1);
 c.rect(42,74,10,6,"#f9bb92");c.rect(70,56,8,6,"#f9bb92");                                                                                                  /* hai tay */
 /* nhạc công phải: đàn tranh */
 ngoi(c,126,86,{shirt:"#2a2430",shl:"#4a3a52"});
 c.poly([60,84, 144,76, 148,84, 64,94],"#9c6340");c.poly([60,84, 144,76, 144,78, 60,86],"#dba468");c.poly([64,94,148,84,148,87,64,97],"#573629");
 for(let i=0;i<12;i++){const x=68+i*6;c.line(x,87-i*.6,x+2,79-i*.5,"#efe3c8",1);c.px(x+1,82-i*.5,"#c4574a")}
 c.rect(62,92,5,6,"#573629");c.rect(142,84,5,6,"#573629");c.rect(112,72,10,6,"#f9bb92");c.rect(130,68,8,6,"#f9bb92");
 /* bộ trà + đĩa trái cây */
 c.ellipse(78,98,8,4,"#8a4a2a");c.ellipse(78,96,7,4,"#a9633a");c.rect(76,91,4,3,"#6a3820");c.line(85,96,89,93,"#8a4a2a",2);
 for(const x of[60,68,92]){c.ellipse(x,98,4,2,"#efe3c8");c.ellipse(x,97,3,1,"#9dd0e0")}
 c.ellipse(108,97,9,3,"#efe3c8");c.circ(104,94,3,"#9bc96a");c.circ(110,94,3,"#e6cf82");c.circ(107,92,2,"#c4574a")})
/* ===== Bảng trạm diễn giải (44x70): khung gỗ, mái nhỏ, dòng chữ ===== */
sprite("ha_bang",{w:44,h:70,outline:"k"},(c)=>{
 c.rect(4,26,5,42,"#7a4a31");c.rect(35,26,5,42,"#7a4a31");c.vline(4,26,42,"#bf8250");c.vline(39,26,42,"#573629");
 c.poly([0,12, 22,2, 44,12, 44,18, 0,18],"#a98536");c.poly([0,12,22,2,44,12,44,14,22,5,0,14],"#e6cf82");for(let x=2;x<42;x+=4)c.vline(x,16,4,"#8a6a2a");
 c.rect(6,18,32,34,"#efe3c8");c.box(6,18,32,34,"#7a4a31");c.rect(8,20,28,6,"#2f7a6a");c.hline(10,22,12,"#efe3c8");c.hline(10,24,8,"#efe3c8");c.circ(31,23,2,"#f6d77a");
 for(let k=0;k<5;k++)c.hline(9,30+k*4,26-((k*5)%9),"#6a5a4a");c.rect(9,48,8,2,"#c4574a");
 c.ellipse(22,69,16,2,"#3a5a30");c.px(6,66,"#78ad62");c.px(38,65,"#78ad62");c.px(37,66,"#4e7f4b")})
/* ===== Gà mái mổ thóc (2 khung 26x22) ===== */
const ga=(n,peck)=>sprite(n,{w:26,h:22,outline:"k"},(c)=>{const by=peck?3:0;
 c.ellipse(12,14,10,7,"#a9651c");c.ellipse(11,12,9,6,"#d98f2b");c.poly([20,10,26,4,24,14],"#7a3a10");c.rect(5,12,12,4,"#e3b04b");c.hline(3,18,16,"#7a3a10");
 c.ellipse(19,8+by,5,5,"#d98f2b");c.rect(18,1+by,3,3,"#c4574a");c.rect(22,9+by,4,2,"#e6a02a");c.px(20,7+by,"#1c1418");c.rect(22,11+by,2,2,"#c4574a");
 c.vline(9,20,2,"#e6a02a");c.vline(14,20,2,"#e6a02a");c.hline(8,22,3,"#e6a02a");c.hline(13,22,3,"#e6a02a")})
ga("ha_ga0",0);ga("ha_ga1",1)
/* ===== Bàn bản đồ của Khoa (100x80) ===== */
sprite("ha_ban_khoa",{w:100,h:80,outline:"k"},(c)=>{
 c.rect(4,36,92,12,"#bf8250");c.hline(4,36,92,"#fbe5b8");c.hline(4,37,92,"#f0c88c");c.rect(4,48,92,8,"#9c6340");c.hline(4,55,92,"#573629");c.rect(10,56,10,22,"#7a4a31");c.rect(80,56,10,22,"#7a4a31");c.vline(10,56,22,"#bf8250");c.vline(80,56,22,"#bf8250");
 c.rect(14,4,52,36,"#40384e");c.rect(16,6,48,30,"#2f6b97");c.grad(16,6,48,30,"WwU","v",.5);c.poly([20,28,34,18,44,24,58,12,60,14,44,28,34,22,22,30],"#efe3c8");c.circ(44,24,2,"#c4574a");
 c.rect(32,40,16,3,"#58506e");c.rect(70,22,24,18,"#efe3c8");c.box(70,22,24,18,"#b9a57e");for(let k=0;k<4;k++)c.hline(73,26+k*3,18,"#a9c0d8");c.line(80,40,90,34,"#e3b04b",2);
 c.ellipse(84,52,5,3,"#8a4a2a");c.rect(81,44,6,4,"#6a3820")})

/* ===== Biểu tượng động từ 24x24 (hình riêng, không chỉ dựa vào màu) ===== */
const ICO={
 ic_quan_sat:(c)=>{c.ellipse(12,12,10,6,"p");c.ellipse(12,12,10,6,"k",true);c.circ(12,12,5,"W");c.circ(12,12,5,"N",true);c.circ(12,12,2,"k");c.px(10,10,"p");c.px(11,10,"p")},
 ic_nghe:(c)=>{c.poly([2,8,7,8,13,3,13,19,7,14,2,14],"y");c.poly([2,8,7,8,13,3,13,5,7,10,2,10],"Y");for(const[x,y0,y1]of[[16,8,14],[19,5,17],[22,2,20]]){c.vline(x,y0,y1-y0+1,"k");c.vline(x+1,y0+1,y1-y0-1,"y")}},
 ic_doi_chieu:(c)=>{c.rect(2,3,11,14,"p");c.box(2,3,11,14,"k");c.hline(4,7,7,"r");c.hline(4,10,7,"r");c.hline(4,13,5,"r");c.rect(11,8,11,14,"v");c.box(11,8,11,14,"k");c.hline(13,12,7,"t");c.hline(13,15,7,"t");c.hline(13,18,5,"t")},
 ic_hoi:(c)=>{c.rect(2,2,20,14,"p");c.box(2,2,20,14,"k");c.poly([6,16,10,16,6,22],"p");c.line(6,16,6,22,"k");c.line(6,22,10,16,"k");c.hline(12,5,1,"k");c.rect(10,5,5,2,"k");c.rect(14,7,2,3,"k");c.rect(12,10,2,2,"k");c.rect(12,13,2,2,"k")},
 ic_ghi_chu:(c)=>{c.rect(2,3,16,18,"p");c.box(2,3,16,18,"k");for(let k=0;k<4;k++)c.hline(5,8+k*3,10,"r");c.poly([14,18,20,4,23,6,17,20],"y");c.poly([14,18,17,20,13,22],"k");c.px(21,5,"K")}}
for(const k in ICO)sprite(k,{w:24,h:24},(c)=>ICO[k](c))


/* ===== Trạng thái vật thể 18x18: vòng rỗng · nửa · dấu tích (hình khác nhau, kèm chữ trong game) ===== */
sprite("st_0",{w:18,h:18},(c)=>{c.circ(9,9,8,"k");c.circ(9,9,6,"p");c.ring(9,9,6,"q");c.hline(5,6,3,"v")})
sprite("st_1",{w:18,h:18},(c)=>{c.circ(9,9,8,"k");c.circ(9,9,6,"p");for(let y=9;y<=15;y++){const w=Math.floor(Math.sqrt(36-(y-9)*(y-9)));c.hline(9-w,y,2*w+1,"Y")}c.hline(3,9,13,"j");c.ring(9,9,6,"j")})
sprite("st_2",{w:18,h:18},(c)=>{c.circ(9,9,8,"k");c.circ(9,9,6,"H");c.ring(9,9,6,"G");c.line(5,9,8,12,"p",2);c.line(8,12,13,5,"p",2)})
/* ===== Hình nhịp âm thanh 60x22: thụp thưa · quay liên tục · lách tách dày · keng tắt dần · giai điệu ===== */
const wv=(n,f)=>sprite(n,{w:60,h:22},(c)=>{c.hline(0,11,60,"t");f(c)})
wv("wv_gia",c=>{for(const x of[4,19,34,49]){c.rect(x,3,6,16,"d");c.rect(x,3,6,2,"f");c.vline(x+5,5,14,"b")}})
wv("wv_xay",c=>{for(let x=0;x<60;x++){const y=11+Math.round(Math.sin(x/3.2)*5);c.rect(x,y,1,2,"W");c.px(x,y,"w")}})
wv("wv_xat",c=>{for(let x=2;x<60;x+=4){const h=3+((x*7)%7);c.rect(x,11-h,2,h*2,"j");c.px(x,11-h,"Y")}})
wv("wv_ren",c=>{for(const[x,h]of[[4,9],[19,7],[33,5],[46,3]]){c.rect(x,11-h,3,h*2,"X");c.vline(x,11-h,h*2,"L");c.rect(x+4,11-(h>>1),2,h,"t")}})
wv("wv_don",c=>{for(let x=0;x<60;x++){const y=11+Math.round(Math.sin(x/7)*Math.sin(x/1.9)*7);c.rect(x,y,1,2,"P")}})
