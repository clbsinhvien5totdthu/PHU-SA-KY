/* Phù Sa Ký – THƯ VIỆN mở đầu, bản vẽ lại ở ĐỘ PHÂN GIẢI GỐC (1 điểm ảnh sprite = 1 điểm ảnh màn hình, cùng mật độ với An 48x64).
   Viền nâu sẫm mảnh (như An/nhà trong game), ánh sáng từ cửa sổ trên-trái, bóng đổ nhẹ, gam ấm.  Dựng: pxl build assets/art/thuvien.px.js --out assets/art/out/tv */
pal({k:"#2b1b1a",
 a:"#3a2420",b:"#573629",c:"#7a4a31",d:"#9c6340",e:"#bf8250",f:"#dba468",g:"#f0c88c",h:"#fbe5b8",     /* gỗ: tối → sáng */
 p:"#efe3c8",q:"#d9c9a6",r:"#b9a57e",                                                                  /* giấy/kem */
 t:"#2e2230",u:"#4b3a4d",                                                                              /* nền tối trong kệ */
 y:"#e3b04b",Y:"#f6d77a",                                                                              /* đồng, vàng */
 G:"#4e7f4b",H:"#78ad62",I:"#2f5a3a",                                                                  /* lá */
 N:"#26385f",M:"#3c5a92",O:"#1a2745",                                                                  /* bìa xanh sẫm */
 S:"#f9bb92",s:"#d18e75",W:"#f5f1f2",L:"#c9c4d6",Z:"#40384e",X:"#58506e",
 P:"#7b5a9c",Q:"#9a7ab8",R:"#5a3f78"})
ramps("kabcdefgh")
const BK=[["#c4574a","#e58a73","#8f3a36"],["#3f8c86","#6fbcaf","#2a605f"],["#e0ac3a","#f6d577","#a97a22"],["#3a5f9a","#6f94cc","#243f6c"],["#8c5f9c","#b98fc6","#5d3d72"],["#6f9a4a","#a4c877","#486c2e"],["#d9c9a6","#f4ead0","#a99673"],["#b8683c","#e19a63","#80432a"],["#37566b","#6b93ab","#223a4a"]];
/* một gáy sách đứng: thân + sáng trái + tối phải + dải đồng + nhãn */
function book(c,x,base,w,h,col,r){const[m,l,d]=col,y0=base-h;c.rect(x,y0,w,h,m);c.vline(x,y0,h,l);c.vline(x+w-1,y0,h,d);if(w>8)c.vline(x+w-2,y0,h,d);c.hline(x,y0,w,l);
 c.hline(x+1,y0+3,w-2,"#f6d577");c.hline(x+1,y0+5,w-2,d);c.hline(x+1,base-4,w-2,"#f6d577");c.hline(x+1,base-6,w-2,d);
 if(w>=10&&h>22){c.rect(x+2,y0+9,w-5,Math.min(9,h-18),"#efe3c8");c.hline(x+3,y0+11,w-7,"#8a6e4a");c.hline(x+3,y0+14,w-8,"#8a6e4a")}
 else if(r()>.5){c.hline(x+2,y0+10,w-4,d);c.hline(x+2,y0+12,w-4,l)}c.hline(x,base-1,w,d)}
/* một tầng sách; gap=[x,w] chừa ô trống; lean = quyển nghiêng đổ vào ô trống */
function bay(c,x0,x1,base,r,gap){let x=x0;while(x<x1-8){const w=7+Math.floor(r()*8),h=20+Math.floor(r()*11),col=BK[Math.floor(r()*BK.length)];
  if(gap&&x>=gap[0]-2&&x<gap[0]+gap[1]){x=gap[0]+gap[1];continue}
  if(x+w>x1)break;
  if(r()>.93){x+=4;continue}                                   /* khoảng hở nhỏ */
  book(c,x,base,w,h,col,r);x+=w+(r()>.8?1:0)}}
function shelfArt(name,seed,gp){sprite(name,{w:392,h:132,outline:"k"},(c)=>{const r=c.rng(seed);
 c.rect(0,0,392,132,"c");                                                                   /* khung */
 c.rect(0,0,392,10,"e");c.hline(0,1,392,"g");c.hline(0,2,392,"f");c.hline(0,9,392,"b");c.hline(0,10,392,"a");  /* mũ kệ */
 for(const x of[0,382]){c.rect(x,10,10,110,"d");c.vline(x+(x?7:1),10,110,x?"b":"f");c.vline(x+(x?8:0),10,110,x?"a":"g")}
 c.rect(0,120,392,12,"d");c.hline(0,120,392,"f");c.hline(0,121,392,"e");c.rect(0,127,392,5,"b");c.hline(0,127,392,"c");c.hline(0,131,392,"a");
 c.rect(10,11,372,109,"t");c.grad(10,11,372,109,"tu","v",.5);for(let x=10;x<382;x+=26)c.vline(x,11,109,"#3a2c3c");   /* lưng kệ */
 const bases=[43,79,115];
 bases.forEach((b,i)=>{bay(c,13,380,b,r,gp.t==i?[gp.x,gp.w]:null);
  c.rect(10,b+1,372,4,"e");c.hline(10,b+1,372,"g");c.hline(10,b+2,372,"f");c.hline(10,b+4,372,"c");               /* ván tầng */
  c.rect(10,b+5,372,1,"a");c.dither(10,b+6,372,2,"a","t",.5);                                                  /* bóng dưới ván */
  c.dither(11,i?b-31:12,370,5,"a","t",.35)});                                                                  /* tối gần ván trên */
 /* ô trống: vệt bụi hình quyển sách + hai quyển bên cạnh nghiêng nhẹ */
 const gb=bases[gp.t],gx=gp.x,gw=gp.w;c.rect(gx,gb-30,gw,30,"#2a2030");c.rect(gx+1,gb-29,gw-2,28,"#3a2e42");c.rect(gx+2,gb-28,gw-4,2,"#2a2030");
 c.hline(gx+1,gb-1,gw-2,"#b8a98a");c.hline(gx+2,gb-2,gw-4,"#cdbf9f");c.noise(gx+1,gb-3,gw-2,3,"pq",.35,seed);
 c.vline(gx,gb-30,30,"#150f1a");c.vline(gx+gw-1,gb-30,30,"#150f1a");
 c.poly([gx+gw,gb-26,gx+gw+3,gb-26,gx+gw+8,gb,gx+gw,gb],BK[(seed+3)%BK.length][0]);c.vline(gx+gw+3,gb-26,22,"#fff3");
 c.px(gx+4,gb-6,"#cdbf9f");                         /* hạt bụi */
 /* nhãn đồng ở mũ kệ */
 c.rect(176,3,40,5,"y");c.hline(176,3,40,"Y");c.hline(176,7,40,"c");for(let k=0;k<4;k++)c.rect(180+k*8,4,5,2,"#7a5a1e")
 /* vật trang trí */
 c.shade([10,11,372,3],1)})}
shelfArt("lb_shelf1",5,{t:1,x:84,w:15});shelfArt("lb_shelf2",17,{t:2,x:260,w:14});shelfArt("lb_shelf3",29,{t:0,x:170,w:15})

/* ---- Chồng sách (66x50): 5 quyển lệch nhau, mép giấy kem, ruy-băng ---- */
function stackArt(name,blue){sprite(name,{w:66,h:50,outline:"k"},(c)=>{
 const cols=[BK[0],BK[1],BK[2],BK[3],BK[4]];let y=46;
 [[2,58,8],[5,54,9],[1,56,7],[6,50,9],[3,52,8]].forEach(([dx,w,h],i)=>{const[m,l,d]=cols[i];y-=h;
  c.rect(dx,y,w,h,m);c.hline(dx,y,w,l);c.hline(dx,y+h-1,w,d);c.vline(dx,y,h,l);
  c.rect(dx+w-6,y+1,6,h-2,"p");for(let k=y+2;k<y+h-1;k+=2)c.hline(dx+w-6,k,6,"q");c.vline(dx+w-6,y+1,h-2,"r");
  c.hline(dx+3,y+2,w-12,"#f6d577");c.hline(dx+3,y+h-3,w-12,"#f6d577")});
 c.line(42,y+1,45,y-3,"#c4574a");
 if(blue){c.rect(30,31,34,9,"N");c.hline(30,31,34,"M");c.hline(30,39,34,"O");c.rect(58,32,6,7,"p");c.hline(33,34,20,"y");c.hline(33,36,14,"y")}})}
stackArt("lb_stack",0);stackArt("lb_stack3",1)
/* ---- Quyển bìa xanh sẫm nằm phẳng (60x42) ---- */
sprite("lb_blue",{w:60,h:42,outline:"k"},(c)=>{
 c.poly([2,6,50,2,58,10,58,34,10,40,2,34],"N");c.poly([2,6,50,2,54,6,6,10],"M");
 c.rect(2,6,8,28,"O");c.vline(9,7,27,"#10182e");c.vline(3,7,27,"M");
 c.rect(14,13,36,2,"y");c.rect(14,31,36,1,"y");c.rect(14,13,1,19,"y");c.rect(49,13,1,19,"y");
 c.hline(20,19,24,"#c9a24f");c.hline(23,23,18,"#c9a24f");c.hline(26,27,12,"#a98a3f");
 c.noise(12,12,40,22,"NM",.12,3);
 c.rect(50,8,8,28,"p");for(let k=10;k<34;k+=3)c.hline(50,k,8,"q");c.vline(50,8,28,"r");
 c.px(55,6,"#7a6a52");c.px(3,33,"#5c70a8");c.px(3,34,"#5c70a8");c.px(8,39,"#5c70a8")})
/* ---- Thùng sách (104x72) ---- */
sprite("lb_crate",{w:104,h:72,outline:"k"},(c)=>{const r=c.rng(2);
 for(const y of[18,34,50]){c.rect(0,y,104,16,"d");c.hline(0,y,104,"f");c.hline(0,y+1,104,"e");c.hline(0,y+15,104,"b");for(let x=6+(r()*20|0);x<104;x+=22+(r()*10|0))c.vline(x,y+2,13,"c")}
 c.rect(8,52,88,2,"b");
 c.rect(0,18,8,54,"c");c.rect(96,18,8,54,"c");c.vline(7,18,54,"b");c.vline(96,18,54,"b");c.vline(0,18,54,"e");
 for(const[x,y]of[[3,24],[3,40],[3,56],[99,24],[99,40],[99,56]]){c.rect(x-1,y-1,3,3,"#8a8aa6");c.px(x-1,y-1,"#c9c4d6");c.px(x,y,"#58506e")}
 for(let x=10;x<94;x+=7){const col=BK[(x/7|0)%BK.length],h=8+(r()*7|0);c.rect(x,18-h+6,6,h,col[0]);c.vline(x,18-h+6,h,col[1]);c.hline(x+1,18-h+8,4,"#f6d577")}
 c.rect(0,16,104,5,"e");c.hline(0,16,104,"g");c.hline(0,20,104,"b");
 c.rect(60,36,28,16,"p");c.box(60,36,28,16,"r");c.hline(64,41,20,"#8a6e4a");c.hline(64,45,14,"#8a6e4a");
 c.line(2,26,2,36,"#d9c9a6",2);c.line(101,26,101,36,"#d9c9a6",2)})
/* ---- Bàn phòng đọc (188x84): sổ mở, bộ ấm trà tích, bình sen, đèn bàn ---- */
sprite("lb_table",{w:188,h:84,outline:"k"},(c)=>{const r=c.rng(7);
 c.rect(0,14,188,28,"f");c.grad(0,14,188,28,"gfe","v",.5);for(let k=0;k<16;k++)c.hline(4+(r()*50|0),17+(r()*22|0),16+(r()*70|0),"#d9a05f");c.noise(0,14,188,28,"gh",.04,3);
 c.hline(0,14,188,"h");c.rect(0,42,188,10,"d");c.hline(0,42,188,"g");c.hline(0,43,188,"f");c.hline(0,51,188,"b");
 c.rect(8,52,14,32,"d");c.rect(166,52,14,32,"d");c.vline(8,52,32,"f");c.vline(166,52,32,"f");c.vline(21,52,32,"b");c.vline(179,52,32,"b");c.rect(8,52,14,3,"b");c.rect(166,52,14,3,"b");
 c.rect(22,62,144,5,"c");c.hline(22,62,144,"e");c.hline(22,66,144,"a");
 /* khăn trải + sổ mở + bút */
 c.rect(14,20,64,20,"#efe3c8");c.hline(14,20,64,"#fff8e6");for(let x=14;x<78;x+=4)c.vline(x,38,2,"#b5524a");
 c.poly([20,22,46,20,46,34,18,36],"p");c.poly([46,20,72,22,74,36,46,34],"#fff8e6");c.vline(46,20,14,"r");for(let k=0;k<3;k++){c.hline(23,25+k*3,21,"#a9c0d8");c.hline(50,25+k*3,21,"#a9c0d8")}
 c.line(60,38,74,33,"#e0ac3a",2);
 /* bộ ấm trà tích đất + 2 chén */
 c.ellipse(96,34,9,6,"#8a4a2a");c.ellipse(96,32,8,5,"#a9633a");c.rect(93,24,6,3,"#6a3820");c.circ(96,23,2,"#8a4a2a");c.line(105,32,110,28,"#8a4a2a",2);c.line(87,31,83,34,"#8a4a2a",2);c.hline(91,30,4,"#c98152");
 c.ellipse(115,37,4,2,"#efe3c8");c.ellipse(115,36,3,1,"#9dd0e0");c.ellipse(124,36,4,2,"#efe3c8");c.ellipse(124,35,3,1,"#9dd0e0");
 /* bình sen */
 c.rect(134,26,9,12,"#2f7a6a");c.rect(134,26,9,3,"#4aa890");c.vline(134,28,10,"#7ad0b8");c.ellipse(138,38,6,2,"#1f5a4a");
 c.line(138,26,132,10,"#4e7f4b",1);c.line(138,26,146,6,"#4e7f4b",1);c.ellipse(132,10,6,3,"#78ad62");c.circ(146,8,4,"#e57fa0");c.circ(146,7,3,"#f6a5c0");c.px(146,7,"#f6d77a");c.circ(131,8,3,"#f6a5c0");
 /* đèn bàn xanh */
 c.rect(160,12,18,3,"I");c.ellipse(169,11,11,6,"G");c.ellipse(169,9,8,4,"H");c.rect(168,15,3,10,"y");c.ellipse(169,27,7,2,"c");c.hline(162,8,12,"#9cc87f")})
/* ---- Xe đẩy sách (84x72) ---- */
sprite("lb_cart",{w:84,h:72,outline:"k"},(c)=>{const r=c.rng(3);
 c.rect(3,6,5,52,"c");c.rect(76,6,5,52,"c");c.vline(3,6,52,"f");c.vline(76,6,52,"f");c.rect(0,1,84,5,"e");c.hline(0,1,84,"g");c.hline(0,5,84,"b");
 for(const b of[27,50]){c.rect(8,b-20,68,20,"t");c.dither(8,b-20,68,3,"a","t",.5);let x=10;while(x<70){const w=5+(r()*6|0),h=12+(r()*8|0);book(c,x,b,w,h,BK[(r()*BK.length)|0],r);x+=w}c.rect(5,b,74,4,"e");c.hline(5,b,74,"g");c.hline(5,b+3,74,"b")}
 c.rect(5,54,74,5,"d");c.hline(5,54,74,"f");c.hline(5,58,74,"a");
 for(const x of[13,66]){c.rect(x-1,59,3,5,"X");c.circ(x,66,5,"Z");c.circ(x,66,2,"L");c.px(x,66,"Z")}})
/* ---- Cô Hạnh (48x64): áo dài tím nhạt, quần trắng, tóc bạc búi, kính, thẻ nhân viên ---- */
const hanh=(name,blink)=>sprite(name,{w:48,h:64,outline:"k"},(c)=>{
 c.rect(14,44,8,16,"#f3efe6");c.rect(26,44,8,16,"#f3efe6");c.vline(14,44,16,"#fff");c.vline(33,44,16,"#cfc8b8");c.rect(13,60,9,3,"#8a5a3a");c.rect(26,60,9,3,"#8a5a3a");       /* quần trắng + dép */
 c.poly([11,29, 37,29, 38,52, 32,56, 24,52, 16,56, 10,52],"P");c.poly([11,29,37,29,37,31,11,31],"Q");c.vline(11,31,22,"Q");c.vline(36,31,22,"R");
 c.poly([24,30, 24,56, 16,56, 24,52],"#e9d5f0");c.line(24,33,24,52,"#b99ad0",1);                                                                                                   /* tà áo dài */
 c.rect(6,31,6,14,"P");c.vline(6,32,12,"Q");c.rect(36,31,6,14,"P");c.vline(41,32,12,"R");c.rect(6,45,6,3,"S");c.rect(36,45,6,3,"S");
 c.rect(18,29,12,3,"#efe3c8");c.px(19,34,"#efe3c8");c.px(21,40,"#efe3c8");c.px(27,46,"#efe3c8");                                                                              /* cổ đứng + hoa văn */
 c.rect(31,36,7,9,"#fff");c.box(31,36,7,9,"#b9a57e");c.hline(32,38,5,"#2f7a6a");c.line(30,31,33,36,"#2f7a6a",1);                                                                /* thẻ nhân viên */
 c.ellipse(24,8,14,8,"L");c.ellipse(24,2,6,4,"L");c.hline(17,3,14,"#e7e3ee");c.px(24,-1,"#c4574a");
 c.ellipse(24,19,12,11,"S");c.hline(14,27,20,"s");c.hline(16,29,16,"s");
 c.rect(9,8,5,15,"L");c.rect(34,8,5,15,"L");c.vline(9,10,12,"#8f8a9c");c.vline(38,10,12,"#8f8a9c");
 c.rect(14,10,20,4,"L");c.px(15,14,"L");c.px(18,14,"L");c.px(30,14,"L");c.px(33,14,"L");c.hline(16,11,14,"#e7e3ee");
 c.box(14,17,9,7,"X");c.box(25,17,9,7,"X");c.hline(23,19,2,"X");
 if(blink){c.hline(17,20,4,"k");c.hline(28,20,4,"k")}else{c.rect(17,19,3,3,"k");c.rect(28,19,3,3,"k");c.px(17,19,"W");c.px(28,19,"W")}
 c.hline(21,26,6,"#b5524a");c.rect(14,23,2,2,"#f08a7a");c.rect(32,23,2,2,"#f08a7a")})
hanh("lb_hanh",0);hanh("lb_hanh_b",1)
/* ---- Tủ thẻ danh mục (116x92): 3 hàng x 5 ngăn kéo, nhãn giấy, núm đồng ---- */
sprite("lb_catalog",{w:116,h:92,outline:"k"},(c)=>{
 c.rect(0,0,116,92,"c");c.rect(0,0,116,6,"e");c.hline(0,0,116,"g");c.hline(0,1,116,"f");c.hline(0,5,116,"b");
 c.rect(0,84,116,8,"b");c.hline(0,84,116,"d");c.rect(4,88,10,4,"a");c.rect(102,88,10,4,"a");
 for(let row=0;row<3;row++)for(let col=0;col<5;col++){const x=5+col*21,y=9+row*25;c.rect(x,y,20,23,"d");c.hline(x,y,20,"g");c.vline(x,y,23,"f");c.hline(x,y+22,20,"b");c.vline(x+19,y,23,"b");
  c.rect(x+4,y+4,12,8,"#efe3c8");c.box(x+4,y+4,12,8,"#b9a57e");c.hline(x+6,y+7,8,"#6a5a4a");c.hline(x+6,y+9,5,"#6a5a4a");
  c.rect(x+8,y+15,5,3,"y");c.hline(x+8,y+15,5,"Y");c.px(x+10,y+18,"#7a5a1e")}
 c.rect(44,-0,28,0,"k")})
/* ---- Quạt đứng (quạt cây) (44x96): thân inox, lồng quạt, cánh ---- */
sprite("lb_quat",{w:44,h:96,outline:"k"},(c)=>{
 c.ellipse(22,92,15,4,"#58506e");c.ellipse(22,91,15,4,"#8a8dab");c.rect(20,38,5,52,"#b0b3cc");c.vline(20,38,52,"#fff");c.vline(24,38,52,"#6a6d8c");c.rect(18,60,9,6,"#58506e");
 c.circ(22,22,20,"#dfe0ee");c.ring(22,22,20,"#6a6d8c");c.ring(22,22,14,"#8a8dab");c.ring(22,22,8,"#8a8dab");for(let a=0;a<12;a++){const t=a*Math.PI/6;c.line(22,22,22+Math.cos(t)*20,22+Math.sin(t)*20,"#8a8dab",1)}
 c.circ(22,22,20,"#dfe0ee33");
 c.poly([22,22, 30,8, 36,12, 28,24],"#8fc5e8");c.poly([22,22, 38,28, 34,36, 20,28],"#8fc5e8");c.poly([22,22, 8,36, 4,28, 16,20],"#8fc5e8");c.circ(22,22,4,"#c4574a");c.circ(22,22,2,"#fff")})
/* ---- Lan hồ điệp trong chậu gốm men lam (40x70) ---- */
sprite("lb_lan",{w:40,h:70,outline:"k"},(c)=>{
 c.rect(8,48,24,20,"#efe3c8");c.rect(8,48,24,4,"#fff8e6");c.vline(9,52,16,"#fff");c.vline(31,52,16,"#c9c4b0");c.ellipse(20,68,12,3,"#b9a57e");
 for(let k=0;k<3;k++){c.circ(20,57+k*4,3,"#2f6b97");c.circ(20,57+k*4,1,"#7bbdd2")}c.hline(8,50,24,"#2f6b97");c.hline(8,66,24,"#2f6b97");
 c.ellipse(20,46,12,3,"#3a5a30");c.line(20,46,16,36,"#78ad62",2);c.line(20,46,26,34,"#78ad62",2);c.ellipse(15,44,6,3,"#4e7f4b");c.ellipse(26,44,6,3,"#4e7f4b");
 c.line(18,44,10,22,"#7a8a3a",1);c.line(10,22,16,8,"#7a8a3a",1);
 for(const[x,y,r2]of[[10,24,4],[12,17,4],[15,11,4],[18,7,3],[8,30,3]]){c.circ(x,y,r2,"#fff");c.circ(x,y,r2-2,"#f6c3d8");c.px(x,y,"#e0ac3a")}})
/* ---- Ô sáng để đặt sách (72x30) ---- */
sprite("lb_slot",{w:72,h:30},(c)=>{for(let x=6;x<66;x+=6){c.hline(x,2,3,"#f6d77a");c.hline(x,27,3,"#f6d77a")}for(let y=6;y<24;y+=5){c.vline(2,y,3,"#f6d77a");c.vline(69,y,3,"#f6d77a")}
 c.px(3,3,"#fff2b8");c.px(68,3,"#fff2b8");c.px(3,26,"#fff2b8");c.px(68,26,"#fff2b8");c.ellipse(36,15,28,9,"#f6d77a33");c.ellipse(36,15,18,5,"#fff2b844")})
/* ---- Chậu cây (42x66) & ghế gỗ (46x62) ---- */
sprite("lb_plant",{w:42,h:66,outline:"k"},(c)=>{c.rect(8,44,26,20,"#b8683c");c.rect(8,44,26,4,"#e19a63");c.hline(8,63,26,"#80432a");c.vline(33,48,15,"#80432a");c.rect(6,42,30,5,"#d58a55");
 for(const[tx,ty]of[[6,10],[10,4],[21,2],[32,6],[37,16],[4,26],[14,16],[28,14]]){c.line(21,42,tx,ty,"G",3);c.line(21,42,tx,ty,"H",1)}c.ellipse(21,40,9,3,"I")})
/* ---- Ghế gỗ lưng mây (40x52) ---- */
sprite("lb_chair",{w:40,h:52,outline:"k"},(c)=>{
 c.rect(5,1,30,5,"d");c.rect(5,1,30,2,"f");c.rect(5,6,4,22,"c");c.rect(31,6,4,22,"c");c.vline(5,6,22,"e");
 c.rect(9,7,22,20,"#e6cf82");for(let y=8;y<27;y+=3)c.hline(9,y,22,"#c9a24f");for(let x=10;x<31;x+=3)c.vline(x,7,20,"#c9a24f");for(let y=9;y<27;y+=6)for(let x=11;x<31;x+=6)c.px(x,y,"#8a6a2a");     /* mây đan */
 c.rect(3,27,34,7,"f");c.hline(3,27,34,"h");c.hline(3,33,34,"b");c.rect(5,34,4,18,"c");c.rect(31,34,4,18,"c");c.vline(5,34,18,"e");c.rect(9,44,22,2,"b")})
