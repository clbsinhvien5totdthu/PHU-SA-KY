/* Phù Sa Ký – bộ ô nền + đồ trang trí cho Map 01 (pxl) — v5 "thực tế hơn".
   Dựng:  node <pxl>/bin/pxl.js build assets/art/map.px.js --out assets/art/out  &&  node tools/build_mapart.js
   Quy ước: m_* là tile 16x16 hoặc lớp phủ viền; m_* lớn là đồ trang trí. Sáng từ trên-trái, bóng đổ xuống dưới-phải.
   Nguyên tắc v5 (nghiên cứu từ cảnh quan Đồng Tháp / ĐBSCL):
   - Nước kênh ĐBSCL là nước phù sa: xanh lục đục ngả nâu, không xanh dương; phản chiếu trời chiều (hồng cam) và bóng cây.
   - Bờ kênh là bùn phù sa nâu đỏ, mép ướt sẫm, mép khô sáng, cỏ rủ ra mép.
   - Cỏ nhiệt đới: nhiều sắc xanh, từng búi lá có hướng, mảng vàng-xanh do nắng; KHÔNG rải chấm ngẫu nhiên.
   - Gạch lát: từng viên có tông riêng, mạch vữa tối, rêu ở mạch ẩm.
   - Mọi ô đều tuần hoàn (tileable) nên ghép liền không thấy mối. */
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
 T:"#6a4a3a",t:"#8c6a4a",S:"#1d1b3a55",a:"#b79a5a",f:"#d9c27a",J:"#2f1a14"})
ramps("ZGghH","YyuG","BbnO")

/* ---------- tiện ích tuần hoàn (mọi thao tác quấn quanh mép 16 px nên ô ghép liền) ---------- */
const WR=(v)=>((v%16)+16)%16
const wp=(c,x,y,k)=>c.px(WR(x),WR(y),k)
/* vệt tông màu mềm: elip quấn mép, rìa dither bàn cờ → chuyển sắc tự nhiên, không viền cứng */
const blob=(c,cx,cy,rx,ry,col,soft=1.4)=>{for(let y=0;y<16;y++)for(let x=0;x<16;x++){const dx=((x-cx+8)%16+16)%16-8,dy=((y-cy+8)%16+16)%16-8,d=(dx*dx)/(rx*rx)+(dy*dy)/(ry*ry);
 if(d<1||(d<soft&&(x+y)%2==0))c.px(x,y,col)}}
const rnd=(r,n)=>Math.floor(r()*n)

/* ============ CỎ ============ */
const GRS={base:"#5d9b4b",dk:"#336c3a",d2:"#3f7c41",md:"#4f8f46",lt:"#78b556",hi:"#a1cf6e",hh:"#c8e48c",
 pa:"#53924a",pb:"#6fab52",pc:"#84b452"}
/* búi cỏ: gốc tối, 2–3 lá xòe, ngọn sáng phía trên-trái, lá phải chìm bóng */
const blade=(c,x,y,h,lean,P)=>{wp(c,x,y,P.dk);for(let i=1;i<=h;i++){const top=i==h;
 wp(c,x+(lean<0&&i>1?-1:0),y-i,top?P.hi:P.lt);
 if(h>=3&&i<h){wp(c,x-1-(lean<0&&i>2?1:0),y-i,i==h-1?P.lt:P.md)}
 if(i<h){wp(c,x+1+(lean>0&&i>2?1:0),y-i+(i>2?0:1),i==h-1?P.md:P.d2)}}}
const clover=(c,x,y,P)=>{wp(c,x,y,"#69aa50");wp(c,x+1,y,"#82c05e");wp(c,x,y+1,"#4c8a40");wp(c,x+1,y+1,"#69aa50");wp(c,x+1,y-1,"#4c8a40")}
const grassTile=(seed,opt={})=>(c)=>{const P=Object.assign({},GRS,opt.P||{});c.rect(0,0,16,16,P.base);const r=c.rng(seed);
 blob(c,rnd(r,16),rnd(r,16),6+rnd(r,3),3+rnd(r,3),P.pa);blob(c,rnd(r,16),rnd(r,16),5+rnd(r,3),3+rnd(r,2),P.pb);
 if(opt.yellow)blob(c,rnd(r,16),rnd(r,16),4,2.5,P.pc);
 const n=opt.n||6;for(let i=0;i<n;i++)blade(c,rnd(r,16),3+rnd(r,12),2+rnd(r,3),r()<.5?-1:1,P);
 if(opt.clover)for(let i=0;i<2;i++)clover(c,rnd(r,14),rnd(r,14),P);
 if(opt.flower){const cols=opt.flower==1?["#fffaf0","#f6e27a"]:opt.flower==2?["#ffd54a","#fff1a8"]:["#f27fb4","#ffd0e4"];
  for(let i=0;i<3;i++){const x=2+rnd(r,11),y=4+rnd(r,10);wp(c,x,y+1,"#336c3a");wp(c,x,y,cols[0]);if(i==0){wp(c,x+1,y,cols[1]);wp(c,x,y-1,cols[1])}}}}
for(let i=0;i<8;i++)sprite("m_g"+i,{w:16,h:16},grassTile(11+i*7,{yellow:i%3==1,clover:i%4==2,n:5+i%3}))
for(let i=0;i<3;i++)sprite("m_gf"+i,{w:16,h:16},grassTile(41+i*5,{flower:i+1,clover:i==0,n:5}))
/* cỏ khu mộ: bãi cắt sọc — sọc nhạt/đậm do cỏ nằm theo hai hướng ngược nhau; xanh thẫm, trang nghiêm */
const mow=(seed)=>(c)=>{const r=c.rng(seed);const dk="#2f6e4c",lt="#3f8458",dd="#265c40",ll="#56a06a";
 c.rect(0,0,16,8,dk);c.rect(0,8,16,8,lt);
 for(let x=0;x<16;x+=2){c.px(x,7,lt);c.px(x+1,8,dk);c.px(x,6,x%4?dk:lt)}                         /* mép sọc răng cưa mềm */
 for(let i=0;i<7;i++){const x=rnd(r,16),y=rnd(r,16),up=y<8;                      /* lá cỏ nằm nghiêng theo hướng cắt */
  wp(c,x,y,up?dd:ll);wp(c,x+(up?1:-1),y-1,up?"#3f8458":"#78b88a");wp(c,x+(up?2:-2),y-1,up?dk:lt)}
 for(let i=0;i<3;i++){const x=rnd(r,16),y=rnd(r,16);wp(c,x,y,y<8?"#4a8f60":"#2f6e4c")}}
for(let i=0;i<2;i++)sprite("m_d"+i,{w:16,h:16},mow(71+i*3))
/* ngoài ranh: đồng cỏ nhạt phủ sương tím, lá cỏ thưa và bạc hơn */
const OUTP={base:"#a5bd8c",dk:"#7a9768",d2:"#8aa876",md:"#94b080",lt:"#b8d09a",hi:"#cfe0b0",hh:"#e0ecc4",pa:"#9bb683",pb:"#b0c797",pc:"#b9c98f"}
sprite("m_out0",{w:16,h:16},grassTile(5,{P:OUTP,n:2,yellow:true}));sprite("m_out1",{w:16,h:16},grassTile(9,{P:OUTP,n:2}));sprite("m_out2",{w:16,h:16},grassTile(17,{P:OUTP,n:3}));sprite("m_out3",{w:16,h:16},grassTile(23,{P:OUTP,n:2,yellow:true}))

/* ============ ĐẤT NỆN ============ */
/* đường đất nén: vệt tông do đi lại, sỏi nằm nghiêng có bóng, vài khe nứt khô */
const dirt=(seed)=>(c)=>{const r=c.rng(seed);c.rect(0,0,16,16,"#c39c6a");
 blob(c,rnd(r,16),rnd(r,16),7,3,"#b48b5a");blob(c,rnd(r,16),rnd(r,16),6,3,"#d1ad7c");blob(c,rnd(r,16),rnd(r,16),4,2,"#a67f50");
 for(let i=0;i<3;i++){const x=rnd(r,15),y=rnd(r,15);wp(c,x,y,"#e6cfa0");wp(c,x+1,y,"#d4b88a");wp(c,x,y+1,"#8c6a42");wp(c,x+1,y+1,"#8c6a42")}
 {let x=rnd(r,16),y=rnd(r,16);for(let i=0;i<5;i++){wp(c,x,y,"#946f46");x+=r()<.6?1:0;y+=r()<.5?1:0;}}}
sprite("m_dirt0",{w:16,h:16},dirt(21));sprite("m_dirt1",{w:16,h:16},dirt(33))

/* ============ NƯỚC (phù sa: xanh lục đục) ============ */
const WA={base:"#4a7b72",dk:"#42726a",deep:"#3a665f",mid:"#58897e",lt:"#7fb0a0",crest:"#a6cbb6",spark:"#d3e6d2",warm:"#e3b49c",warm2:"#f2d3bb"}
const water=(seed,mode)=>(c)=>{c.rect(0,0,16,16,WA.base);const r=c.rng(seed);
 blob(c,rnd(r,16),rnd(r,16),6,2.2,WA.dk,1.8);blob(c,rnd(r,16),rnd(r,16),7,2,WA.mid,1.8);blob(c,rnd(r,16),rnd(r,16),5,1.8,WA.mid,1.8);if(mode==3)blob(c,rnd(r,16),rnd(r,16),9,2.6,WA.deep);   /* mode 3: bóng cây đổ xuống nước */
 for(let i=0;i<3;i++){const x=rnd(r,16),y=rnd(r,16),L=2+rnd(r,4);                                                                  /* gợn sóng: đỉnh sáng nhạt + máng tối thưa ngay dưới */
  for(let k=0;k<L;k++){wp(c,x+k,y,k==0?WA.crest:k==L-1?WA.mid:WA.lt)}
  for(let k=2;k<L-1;k+=2)wp(c,x+k,y+1,WA.dk)}
 if(mode==1){const x=rnd(r,10),y=3+rnd(r,9);for(let k=0;k<4;k++)wp(c,x+k,y,k==1||k==2?"#d9ad98":"#9d9e8e");for(let k=0;k<3;k++)wp(c,x+k+1,y+1,"#7f9a88")}   /* phản chiếu trời chiều */
 if(mode==2){for(let i=0;i<2;i++){const x=rnd(r,15),y=rnd(r,15);wp(c,x,y,"#6c9f4e");wp(c,x+1,y,"#8fbf63");wp(c,x,y+1,"#4f8240")}}                /* bèo tấm */
}
for(let i=0;i<4;i++)sprite("m_w"+i,{w:16,h:16},water(3+i*13,i))

/* ============ LỐI ĐI ============ */
/* gạch lát: viên 7x3 + mạch vữa, mỗi viên một tông, cạnh trên sáng / cạnh dưới tối, hàng so le */
const BRK=["#d9c9a7","#ddceac","#d4c4a2","#dacbaa","#d6c6a4"]
const paver=(seed,moss)=>(c)=>{const r=c.rng(seed);c.rect(0,0,16,16,"#b5a384");
 for(let row=0;row<4;row++)for(let k=0;k<2;k++){const ox=(row%2)*4+k*8,y0=row*4,col=BRK[rnd(r,BRK.length)];
  for(let yy=0;yy<3;yy++)for(let xx=0;xx<7;xx++)wp(c,ox+xx,y0+yy,yy==0?"#e6dbbf":yy==2?"#cbbb9a":col);
  
  if(r()<.28){wp(c,ox+1+rnd(r,4),y0+1,"#b8a785")}}
 if(moss){for(let i=0;i<3;i++){const x=rnd(r,13),y=3+rnd(r,3)*4;const L=2+rnd(r,3);for(let k=0;k<L;k++)wp(c,x+k,y,k%2?"#4f8c46":"#6aa551");wp(c,x+1,y-1,"#78b556")}}}
sprite("m_p0",{w:16,h:16},paver(1,0));sprite("m_p1",{w:16,h:16},paver(2,1));sprite("m_p2",{w:16,h:16},paver(3,0));sprite("m_p3",{w:16,h:16},paver(4,1))
/* sân lát đá granit 8x8: hai tông xen kẽ, vát cạnh, mạch tối */
const slab=(c,x0,y0,col,hi,lo)=>{for(let yy=0;yy<7;yy++)for(let xx=0;xx<7;xx++)c.px(x0+xx,y0+yy,yy==0||xx==0?hi:yy==6||xx==6?lo:col)}
sprite("m_plz",{w:16,h:16},(c)=>{c.rect(0,0,16,16,"#b8a98a");
 slab(c,0,0,"#e3d9bf","#ebe2c9","#d4c8a8");slab(c,8,0,"#d9cdb0","#e1d6bb","#c6b998");slab(c,0,8,"#d9cdb0","#e1d6bb","#c6b998");slab(c,8,8,"#e3d9bf","#ebe2c9","#d4c8a8");
 c.px(3,3,"#cdc09f");c.px(12,12,"#cdc09f")})
sprite("m_plz1",{base:"m_plz"},hline(2,4,3,"#c9bc9c"),px(5,5,"#c9bc9c"),px(10,10,"#9cae7e"),px(11,10,"#7fa062"),px(12,11,"#9cae7e"))
/* lề vàng: bó vỉa sơn vàng, sơn bong ở mép */
sprite("m_bd0",{w:16,h:16},rect(0,0,16,16,"#dc9340"),rect(0,0,16,3,"#f2c05f"),hline(0,3,16,"#c27c32"),rect(0,12,16,4,"#b56d2c"),vline(4,4,8,"#b56d2c"),vline(11,4,8,"#b56d2c"),px(2,1,"#e8b48a"),px(9,0,"#d9a566"),px(13,13,"#8c5222"),px(6,14,"#9c5e26"))
sprite("m_bd1",{w:16,h:16},rect(0,0,16,16,"#dc9340"),rect(0,0,16,3,"#f2c05f"),hline(0,3,16,"#c27c32"),rect(0,12,16,4,"#b56d2c"),vline(8,4,8,"#b56d2c"),vline(15,4,8,"#b56d2c"),px(5,2,"#e8b48a"),px(12,0,"#d9a566"),px(3,13,"#8c5222"))
/* đường nhựa: hạt đá thưa (vật liệu có hạt), vết nứt, vạch kẻ mòn */
const asphalt=(seed,crack,line)=>(c)=>{const r=c.rng(seed);c.rect(0,0,16,16,"#6d6f86");blob(c,rnd(r,16),rnd(r,16),6,3,"#656780");blob(c,rnd(r,16),rnd(r,16),5,2,"#75778e");
 for(let i=0;i<9;i++){wp(c,rnd(r,16),rnd(r,16),i%3?"#80829a":"#5a5c72")}
 if(crack){let x=rnd(r,16),y=2;for(let i=0;i<6;i++){wp(c,x,y,"#5c5e74");x+=r()<.4?(r()<.5?-1:1):0;y++}}
 if(line){for(let x=3;x<9;x++)if(r()>.12)wp(c,x,8,"#e6e2d2");for(let x=3;x<9;x++)if(r()>.5)wp(c,x,9,"#a9a8b0");}}
sprite("m_rd0",{w:16,h:16},asphalt(14,false,false));sprite("m_rd1",{w:16,h:16},asphalt(29,false,true))
sprite("m_lot",{w:16,h:16},rect(0,0,16,16,"#e6dcc2"),blob_(),hline(0,15,16,"#c9bc9c"),vline(15,0,16,"#c9bc9c"),px(4,5,"#d6caa9"),px(5,5,"#d6caa9"),px(11,10,"#f0e8d0"))
function blob_(){return (c)=>{blob(c,5,4,6,3,"#dfd4b8");blob(c,12,11,4,3,"#ece3cb")}}
/* cầu gỗ: 4 tấm ván/ô, mỗi tấm một tông, thớ gỗ dọc, đầu đinh, khe tối giữa các tấm */
const PLK=["#a2663a","#ae7243","#985f35","#a86c3f"]
sprite("m_pk_h",{w:16,h:16},(c)=>{const r=c.rng(8);for(let i=0;i<4;i++){const x=i*4;c.rect(x,0,4,16,PLK[i]);c.vline(x,0,16,"#c58b55");c.vline(x+3,0,16,"#4a2d1c");
  for(let k=0;k<2;k++){const gy=rnd(r,12);c.vline(x+1+k,gy,3+rnd(r,3),"#86502e")}
  c.px(x+1,2,"#3a2418");c.px(x+2,2,"#6d4a32");c.px(x+1,13,"#3a2418");c.px(x+2,13,"#6d4a32")}})
sprite("m_pk_v",{base:"m_pk_h",rot:90})

/* ============ LỚP PHỦ VIỀN (trong suốt) ============ */
/* bờ nước: ô đất cạnh nước, cạnh trên = phía có nước. Mép ướt sẫm → bùn phù sa nâu đỏ → bùn khô sáng → cỏ rủ ra mép */
sprite("m_bank_n",{w:16,h:16},(c)=>{const r=c.rng(4);
 for(let x=0;x<16;x++){const dep=4+Math.round(Math.sin((x/16)*Math.PI*2+1)*1.1+Math.sin((x/16)*Math.PI*4+2)*.5);
  for(let y=0;y<dep;y++){const t=y/(dep-1||1);c.px(x,y,y==0?"#2d3a33":t<.35?"#573f2e":t<.7?"#7d5b3f":"#9c7a54")}
  if(r()<.4)c.px(x,dep-2,"#b79c6c");                                                                                          /* bùn khô sáng */
  if(r()<.55){c.px(x,dep-1,"#3f7a41");c.px(x,dep-2,r()<.5?"#5f9f4b":"#78b556");if(r()<.3)c.px(x+(r()<.5?-1:1),dep-1,"#4f8f46")}   /* cỏ rủ */
  else c.px(x,dep,"#3a6a3c")}                                                                                                 /* bóng cỏ trên bùn */
 })
sprite("m_bank_s",{base:"m_bank_n",flip:"y"});sprite("m_bank_e",{base:"m_bank_n",rot:90});sprite("m_bank_w",{base:"m_bank_n",rot:270})
/* mép nước ăn vào bờ: bóng bờ đổ xuống nước + nước sẫm dần + vệt phản chiếu bùn sáng */
sprite("m_wedge_n",{w:16,h:16},(c)=>{c.rect(0,0,16,2,"#2c4f4a");for(let x=0;x<16;x++){c.px(x,2,x%2?"#37625c":"#2c4f4a");if((x+1)%2==0)c.px(x,3,"#3f6d66")}
 const r=c.rng(6);for(let i=0;i<4;i++){const x=rnd(r,13);c.hline(x,4+rnd(r,2),2+rnd(r,2),"#6d9d8f")}c.px(2,5,"#a6cbb6");c.px(10,5,"#a6cbb6")})
sprite("m_wedge_s",{base:"m_wedge_n",flip:"y"});sprite("m_wedge_e",{base:"m_wedge_n",rot:90});sprite("m_wedge_w",{base:"m_wedge_n",rot:270})
/* viền lối đi tiếp giáp cỏ: mép vữa sẫm, vài lá cỏ bò ra mặt gạch */
sprite("m_pedge_n",{w:16,h:16},(c)=>{const r=c.rng(12);c.hline(0,0,16,"#8d795a");c.hline(0,1,16,"#b8a787");for(let x=0;x<16;x++)if(r()<.35){c.px(x,0,"#4f8f46");if(r()<.5)c.px(x,1,"#78b556")}})
sprite("m_pedge_s",{base:"m_pedge_n",flip:"y"});sprite("m_pedge_e",{base:"m_pedge_n",rot:90});sprite("m_pedge_w",{base:"m_pedge_n",rot:270})
/* lan can cầu: thanh trên có thớ + trụ có khối sáng/tối + bóng đổ xuống ván */
sprite("m_rail_n",{w:16,h:16},(c)=>{c.rect(0,0,16,2,"#a9693c");c.hline(0,0,16,"#d49a62");c.hline(0,2,16,"#5a3520");c.hline(0,3,16,"#2a1f3d55");c.px(5,1,"#8a5430");c.px(12,1,"#8a5430");
 for(const x of [0,8]){c.rect(x,0,3,7,"#9c5f37");c.vline(x,0,7,"#d49a62");c.vline(x+2,0,7,"#6b4128");c.px(x,0,"#ffcf7a");c.hline(x,7,3,"#4a2d1c");c.vline(x+3,2,6,"#2a1f3d44")}})
sprite("m_rail_s",{base:"m_rail_n",flip:"y"});sprite("m_rail_e",{base:"m_rail_n",rot:90});sprite("m_rail_w",{base:"m_rail_n",rot:270})

/* ============ LỐI ĐẤT LÀNG (đất nện phù sa, cỏ lấn mép) — thay gạch lát ở các lối trong làng ============ */
/* ánh sáng trung tính (ô dùng chung mọi hướng): vệt khô sáng hơn một bậc, đất ướt sẫm hơn, sỏi nằm nghiêng có bóng, vài khe nứt khô */
const EA={base:"#b4895d",lt:"#c8a074",hi:"#dcbb8e",dk:"#9b7350",dd:"#80603f",peb:"#e4d2b0",pebm:"#c2a87f",pebs:"#7a5c40",brick:"#b9663f"}
const earth=(seed,opt={})=>(c)=>{c.rect(0,0,16,16,EA.base);const r=c.rng(seed);
 blob(c,rnd(r,16),rnd(r,16),7,3,EA.lt);blob(c,rnd(r,16),rnd(r,16),6,2.6,EA.dk);blob(c,rnd(r,16),rnd(r,16),4,2,EA.hi);blob(c,rnd(r,16),rnd(r,16),3,1.6,EA.dk)
 for(let i=0;i<(opt.peb||3);i++){const x=rnd(r,15),y=rnd(r,15);wp(c,x,y,EA.peb);wp(c,x+1,y,EA.pebm);wp(c,x,y+1,EA.pebs);wp(c,x+1,y+1,EA.pebs)}   /* sỏi: mặt sáng + bóng dưới-phải */
 if(opt.brick){const x=rnd(r,13),y=rnd(r,13);for(let k=0;k<3;k++)wp(c,x+k,y,EA.brick);wp(c,x,y,"#d68a5f");for(let k=0;k<3;k++)wp(c,x+k,y+1,"#8a4528")}   /* mảnh gạch vỡ */
 if(opt.crack){let x=rnd(r,16),y=rnd(r,16);for(let i=0;i<7;i++){wp(c,x,y,EA.dd);x+=r()<.5?1:0;y+=r()<.7?1:0;if(r()<.3)wp(c,x-1,y,EA.dk)}}               /* rạn khô */
 if(opt.tuft){const x=2+rnd(r,11),y=6+rnd(r,8);wp(c,x,y,"#336c3a");wp(c,x-1,y-1,"#5d9b4b");wp(c,x,y-2,"#78b556");wp(c,x+1,y-1,"#4f8f46");wp(c,x+1,y-2,"#a1cf6e")}  /* cỏ mọc giữa lối */
 if(opt.leaf){const x=rnd(r,13),y=rnd(r,14);wp(c,x,y,"#a98536");wp(c,x+1,y,"#c9a24f");wp(c,x+2,y+1,"#7a5a22")}}                                                    /* lá khô */
sprite("m_e0",{w:16,h:16},earth(101,{peb:3}));sprite("m_e1",{w:16,h:16},earth(113,{peb:2,crack:1}));sprite("m_e2",{w:16,h:16},earth(127,{peb:4,brick:1}));sprite("m_e3",{w:16,h:16},earth(139,{peb:2,tuft:1,leaf:1}))
/* mép lối đất giáp cỏ: cỏ rủ vào mặt đường, ngay dưới là môi đất ướt sẫm (bóng cỏ), vài lá cỏ lẻ chui ra */
sprite("m_eedge_n",{w:16,h:16},(c)=>{const r=c.rng(33);let d=2;for(let x=0;x<16;x++){d=Math.max(1,Math.min(4,d+(r()<.35?(r()<.5?-1:1):0)));
  for(let y=0;y<d;y++)c.px(x,y,y==d-1?"#4f8f46":y==d-2?"#78b556":"#5d9b4b");c.px(x,d,"#7d5d3e");if(r()<.45)c.px(x,d+1,"#9a7552");
  if(r()<.22)c.px(x,d+1+rnd(r,2),"#78b556")}})
sprite("m_eedge_s",{base:"m_eedge_n",flip:"y"});sprite("m_eedge_e",{base:"m_eedge_n",rot:90});sprite("m_eedge_w",{base:"m_eedge_n",rot:270})
/* ô cỏ có mảng đất trơ (chỗ trâu bò, người qua lại làm mòn cỏ) — rải thưa */
const grassBare=(seed)=>(c)=>{grassTile(seed,{n:3,clover:true})(c);const r=c.rng(seed*5+1);blob(c,rnd(r,16),rnd(r,16),4,2.6,"#a8835a",1.7);blob(c,rnd(r,16),rnd(r,16),2.5,1.6,"#c19b6e",1.6)
 for(let i=0;i<3;i++){const x=rnd(r,15),y=rnd(r,15);wp(c,x,y,"#7d5d3e");wp(c,x+1,y,"#94704c")}}
sprite("m_gs0",{w:16,h:16},grassBare(211));sprite("m_gs1",{w:16,h:16},grassBare(223))
/* nước kênh phù sa: đục ngả nâu-ô liu hơn hồ sen (nước ngọt trong hơn); cùng nhịp gợn nhưng ít vệt sáng, nhiều bùn lơ lửng */
const WP={base:"#6f8a66",dk:"#628060",deep:"#527058",mid:"#7f9a72",lt:"#a6bd8c",crest:"#d0dcb4",warm:"#e0b79a"}
const waterP=(seed,mode)=>(c)=>{c.rect(0,0,16,16,WP.base);const r=c.rng(seed);
 blob(c,rnd(r,16),rnd(r,16),6,2.2,WP.dk,1.8);blob(c,rnd(r,16),rnd(r,16),7,2,WP.mid,1.8);blob(c,rnd(r,16),rnd(r,16),5,1.8,WP.dk,1.8);if(mode==3)blob(c,rnd(r,16),rnd(r,16),9,2.6,WP.deep)
 for(let i=0;i<3;i++){const x=rnd(r,16),y=rnd(r,16),L=2+rnd(r,4);for(let k=0;k<L;k++)wp(c,x+k,y,k==0?WP.crest:k==L-1?WP.mid:WP.lt);for(let k=2;k<L-1;k+=2)wp(c,x+k,y+1,WP.dk)}
 if(mode==1){const x=rnd(r,10),y=3+rnd(r,9);for(let k=0;k<4;k++)wp(c,x+k,y,k==1||k==2?WP.warm:"#9a9c80")}
 if(mode==2){for(let i=0;i<2;i++){const x=rnd(r,15),y=rnd(r,15);wp(c,x,y,"#6c9f4e");wp(c,x+1,y,"#8fbf63");wp(c,x,y+1,"#4f8240")}}}
for(let i=0;i<4;i++)sprite("m_wp"+i,{w:16,h:16},waterP(53+i*11,i))
sprite("m_wedgep_n",{w:16,h:16},(c)=>{c.rect(0,0,16,2,"#3f5a45");for(let x=0;x<16;x++){c.px(x,2,x%2?"#496650":"#3f5a45");if((x+1)%2==0)c.px(x,3,"#52725a")}
 const r=c.rng(8);for(let i=0;i<4;i++){const x=rnd(r,13);c.hline(x,4+rnd(r,2),2+rnd(r,2),"#8f9a72")}c.px(2,5,"#c2c4a0");c.px(10,5,"#c2c4a0")})
sprite("m_wedgep_s",{base:"m_wedgep_n",flip:"y"});sprite("m_wedgep_e",{base:"m_wedgep_n",rot:90});sprite("m_wedgep_w",{base:"m_wedgep_n",rot:270})

/* ============ ĐỒ TRANG TRÍ (cây & vật nhỏ) ============ */
/* bóng đổ mềm: hai elip chồng, lệch xuống phải (nắng từ trên-trái) */
const shd=(cx,cy,rx,ry)=>[ellipse(cx,cy,rx,ry,"#1d1b3a30"),ellipse(cx+1,cy,Math.max(2,rx-3),Math.max(1,ry-1),"#1d1b3a40")]
/* bảng tông lá, tối → sáng: 0 sẫm bóng, 1 tối, 2 vừa, 3 sáng, 4 nắng rọi */
const LF={bang:["#1e4a3a","#2c6446","#3f8350","#62a85a","#9acb6c"],phuong:["#21503a","#2f6a42","#468a4c","#6ab05a","#a3d26c"],lieu:["#2f6a44","#4b8a4f","#6fae5e","#97cb70","#c4e08c"]}
/* tán lá bằng lưới cụm lá lệch ngẫu nhiên phủ kín elip tán: mỗi cụm có mặt dưới tối, thân giữa, đỉnh sáng lệch trên-trái; flat<1 cho tầng dẹt */
const foliage=(c,o)=>{const r=c.rng(o.seed),T=o.tones,fl=o.flat||1,cl=[],step=o.step||Math.round((o.rmin+o.rmax)*.6);
 for(let gy=o.cy-o.ry;gy<=o.cy+o.ry;gy+=Math.max(2,step*fl))for(let gx=o.cx-o.rx;gx<=o.cx+o.rx;gx+=step){
  const x=gx+(r()-.5)*step*.9,y=gy+(r()-.5)*step*fl*.9,e=((x-o.cx)/o.rx)**2+((y-o.cy)/o.ry)**2;if(e<=1.05)cl.push({x,y,s:o.rmin+r()*(o.rmax-o.rmin)})}
 cl.sort((a,b)=>a.y-b.y);
 for(const k of cl){const t=(k.y-(o.cy-o.ry))/(2*o.ry),sh=t>.62?1:0,rx=Math.round(k.s),ry=Math.max(2,Math.round(k.s*fl)),X=Math.round(k.x),Y=Math.round(k.y);
  c.ellipse(X,Y+1,rx,ry,T[sh]);c.ellipse(X,Y,Math.max(2,rx-1),Math.max(1,ry-1),T[1+sh]);
  c.ellipse(X-1,Y-1,Math.max(2,rx-2),Math.max(1,ry-2),T[Math.min(3,2+sh)]);
  if(rx>=4&&r()<.75)c.ellipse(X-2,Y-2,Math.max(1,rx-4),Math.max(1,Math.round((ry-3)>0?ry-3:1)),T[sh?3:4])}}
/* lá lẻ: những nhóm 2–3 px sáng/tối nằm trên cụm lá, hướng như lá thật */
const leaves=(c,seed,n,lt,dk,w,h,x0=0,y0=0)=>{const r=c.rng(seed);for(let i=0;i<n;i++){const x=x0+rnd(r,w),y=y0+rnd(r,h);if(c.is(x,y,"*")){const lit=(x-x0)+(y-y0)*1.2<(w+h)*.45;c.px(x,y,lit?lt:dk);if(lit&&r()<.6)c.px(x+1,y-1,lt);if(!lit&&r()<.5)c.px(x,y+1,dk)}}}
/* viền tán lá gồ ghề: thêm/bớt px biên theo xác suất → hình bóng hữu cơ, không tròn trịa */
const rough=(c,seed,pAdd=.3,pDel=.22)=>{const r=c.rng(seed),add=[],del=[];
 for(let y=1;y<c.h-1;y++)for(let x=1;x<c.w-1;x++){const nb=[[0,1],[-1,0],[1,0],[0,-1]];
  if(c.is(x,y,".")){for(const [dx,dy] of nb){if(c.is(x+dx,y+dy,"*")){if(r()<pAdd)add.push([x,y,c.get(x+dx,y+dy)]);break}}}
  else if(nb.some(([dx,dy])=>c.is(x+dx,y+dy,"."))&&r()<pDel)del.push([x,y])}
 add.forEach(([x,y,k])=>c.px(x,y,k));del.forEach(([x,y])=>c.px(x,y,"_"))}
/* thân cây: vân vỏ dọc, sáng trái / tối phải, chân xòe rễ */
const trunk=(c,x,y0,y1,w,P)=>{const r=c.rng(x*7+y0);for(let y=y0;y<=y1;y++){const fl=y>y1-4?Math.max(0,y-(y1-4)):0;
  for(let i=-fl;i<w+fl;i++){const k=i<0||i>=w?P[1]:i==0?P[2]:i>=w-1?P[0]:P[1];c.px(x+i,y,k)}}
 for(let i=0;i<w*2;i++){const xx=x+1+rnd(r,Math.max(1,w-2)),yy=y0+rnd(r,y1-y0-2);c.vline(xx,yy,2+rnd(r,3),P[0])}}
const BK=["#4a3226","#6a4a3a","#8f6b4c"]

/* cây bàng: tán nhiều tầng dẹt (đặc trưng), mỗi tầng một dải cụm lá, thân thẳng có cành ngang */
sprite("m_bang",{w:60,h:64},
 layer("sh",...shd(35,60,22,4)),
 layer("tr",(c)=>{trunk(c,28,36,60,5,BK);c.line(30,44,21,38,BK[1]);c.line(30,45,21,39,BK[0]);c.line(32,46,41,40,BK[1]);c.line(32,47,41,41,BK[0])}),
 layer("crown",(c)=>{
  foliage(c,{seed:1,cx:30,cy:43,rx:28,ry:7,flat:.5,rmin:4,rmax:7,tones:LF.bang});
  foliage(c,{seed:2,cx:30,cy:33,rx:23,ry:6,flat:.5,rmin:4,rmax:6,tones:LF.bang});
  foliage(c,{seed:3,cx:30,cy:24,rx:16,ry:6,flat:.55,rmin:3,rmax:5,tones:LF.bang});
  leaves(c,9,60,"#62a85a","#2c6446",60,50,0,10);leaves(c,11,40,"#9acb6c","#1e4a3a",60,50,0,10);rough(c,5,.2,.15)}))
/* phượng vĩ: tán dù rộng, lá kép mịn, chùm hoa đỏ cam dày ở mép nắng */
sprite("m_phuong",{w:56,h:60},
 layer("sh",...shd(32,56,20,4)),
 layer("tr",(c)=>{trunk(c,25,34,58,5,BK);c.line(27,40,16,33,BK[1]);c.line(28,40,40,32,BK[1])}),
 layer("crown",(c)=>{
  foliage(c,{seed:21,cx:28,cy:26,rx:27,ry:21,flat:.85,rmin:5,rmax:8,tones:LF.phuong});
  leaves(c,31,70,"#6ab05a","#21503a",56,40,0,5);
  const r=c.rng(77);for(let i=0;i<90;i++){const x=3+rnd(r,50),y=3+rnd(r,42);if(c.is(x,y,"*")){const sunny=(x+y)<62||r()<.4;c.px(x,y,sunny?"#e8482e":"#c2321f");c.px(x+1,y,"#f2693a");if(r()<.6)c.px(x,y-1,"#ff8a4a");if(sunny&&r()<.4)c.px(x-1,y+1,"#d9392a")}}
  rough(c,22,.25,.2)}))
/* dừa: thân cong có vòng, tàu lá dài rủ có lá chét hai bên, buồng dừa dưới tán */
const frond=(c,x0,y0,ang,len,up)=>{let px_=x0,py_=y0;const n=14;
 for(let i=1;i<=n;i++){const t=i/n,x=x0+Math.cos(ang)*len*t,y=y0+Math.sin(ang)*len*t+t*t*len*.62;
  c.line(Math.round(px_),Math.round(py_),Math.round(x),Math.round(y),"#3d7a3f");px_=x;py_=y;
  if(i>=2){const L=Math.max(2,Math.round((1-t*.7)*6));for(let k=1;k<=L;k++){const lx=Math.round(x-k*.55),rx_=Math.round(x+k*.55),yy=Math.round(y+k*.95-(up?k*.4:0));
   c.px(lx,yy,k==L?"#87c15f":(k%2?"#4f9448":"#397236"));c.px(rx_,yy,k==L?"#6aa851":(k%2?"#2f6a3a":"#265a32"))}}}}
sprite("m_dua",{w:68,h:84},
 layer("sh",...shd(38,80,13,3)),
 layer("tr",(c)=>{for(let i=0;i<54;i++){const y=78-i,x=Math.round(32+Math.sin(i/17)*4+i*.08),fl=i<5?(5-i)>>1:0,ring=i%4==0;
   c.rect(x-fl,y,3+2*fl,1,ring?"#4a3226":"#7d5f40");c.px(x-fl,y,ring?"#6a4a3a":"#9b7a54");c.px(x+2+fl,y,"#4a3226")}}),
 layer("crown",(c)=>{const tx=35,ty=24;
  [[-3.1,27],[-2.5,28],[-2.0,25],[-1.55,16],[-.9,22],[-.45,28],[.0,27],[.5,19]].forEach(([a,l],i)=>frond(c,tx,ty,a,l,i%3==0));
  c.circ(tx-2,ty+3,2,"#5a7a2f");c.circ(tx+2,ty+3,2,"#4f7028");c.circ(tx,ty+5,2,"#6f9238");c.px(tx-3,ty+2,"#a3c65a");c.px(tx+1,ty+2,"#9bbd50");
  c.circ(tx,ty+1,2,"#5a412c");c.px(tx-1,ty,"#8f6b4c")}))
/* bụi tre: thân 3 tông có mấu đốt và mầm cành, lá thon từng chùm rủ */
const bamboo=(c,x,b,top)=>{c.rect(x,top,3,b-top,"#7fa857");c.vline(x,top,b-top,"#b5d583");c.vline(x+2,top,b-top,"#4f7a3e");
 for(let y=top+7;y<b;y+=8){c.hline(x-1,y,5,"#355e30");c.px(x-1,y-1,"#8fb35f");c.px(x+3,y,"#2b4c28");if((y/8|0)%2)c.hline(x+3,y-1,2,"#4f7a3e")}}
const leafcl=(c,x,y,dir)=>{for(let i=0;i<5;i++){const a=-.9+i*.45+(dir<0?3.14:0),L=5+(i%2)*2;for(let k=1;k<=L;k++){const lx=Math.round(x+Math.cos(a)*k+(dir<0?-1:1)*0),ly=Math.round(y+Math.sin(a)*k*.8+k*k*.04);c.px(lx,ly,k>L-2?"#a8d070":(i%2?"#5f9a4a":"#477f3c"))}}}
sprite("m_tre",{w:44,h:68},
 layer("sh",...shd(24,64,16,3)),
 layer("b",(c)=>{[[10,56,8],[17,60,18],[24,62,26],[31,58,14],[37,56,22]].forEach(([x,b,top])=>bamboo(c,x,b,top));
  [[11,8],[18,18],[25,26],[32,14],[38,22]].forEach(([x,y],i)=>{leafcl(c,x+1,y+1,i%2?1:-1);if(i%2==0)leafcl(c,x+1,y+6,-1)});rough(c,4,.1,.1)}))
/* liễu rủ: tán nhỏ, nhiều cành mảnh rủ đến gần đất, sẫm ở gốc cành, nhạt dần ở ngọn */
sprite("m_lieu",{w:64,h:68},
 layer("sh",...shd(36,64,21,4)),
 layer("tr",(c)=>{trunk(c,30,34,64,5,BK);c.line(32,40,20,30,BK[1]);c.line(33,42,46,32,BK[1])}),
 layer("crown",(c)=>{foliage(c,{seed:41,cx:32,cy:26,rx:26,ry:11,flat:.6,rmin:4,rmax:7,tones:LF.lieu});
  const r=c.rng(21);for(let i=0;i<44;i++){const x=7+Math.floor(i*1.28),top=28+rnd(r,4),len=14+rnd(r,20),ph=r()*6;
   for(let y=0;y<len;y++){const t=y/len;c.px(x+Math.round(Math.sin(y/6+ph)*1.1),top+y,t<.35?"#4b8a4f":t<.75?"#6fae5e":(y%4?"#97cb70":"#c4e08c"))}}
  rough(c,6,.15,.1)}))
/* hoa giấy: bụi rậm phủ cánh hoa (lá bắc) hồng tím, nắng làm sáng phía trên-trái */
sprite("m_giay",{w:28,h:22},layer("sh",...shd(16,20,11,2)),layer("b",(c)=>{foliage(c,{seed:8,cx:14,cy:11,rx:13,ry:9,flat:.8,rmin:3,rmax:5,tones:LF.phuong});
 const r=c.rng(3);for(let i=0;i<40;i++){const x=2+rnd(r,24),y=2+rnd(r,16);if(c.is(x,y,"*")){c.px(x,y,(x+y)<22?"#f06aae":"#c93d86");c.px(x+1,y,"#fa9ccb");if(r()<.4)c.px(x,y+1,"#a82e6e")}}rough(c,2,.2,.15)}))

/* ============ CÂY MIỀN TÂY (vườn Cao Lãnh – Đồng Tháp, nước ngọt): xoài, mít, bưởi, cau, chuối, tràm ============ */
LF.xoai=["#16392c","#1f5538","#2f7343","#4a9150","#7fbc62"];LF.mit=["#173a2a","#235a38","#33783f","#52984a","#8cc468"];LF.buoi=["#1f4a35","#2f6a42","#468a4c","#6ab05a","#a3d26c"];LF.tram=["#2a5446","#3a6e5c","#52876f","#78a78c","#a8c8a6"]
/* quả lủng lẳng: cuống + thân quả có mặt sáng trên-trái, tối dưới-phải */
const fruit=(c,x,y,rx,ry,mid,lt,dk)=>{c.vline(x,y-ry-2,2,"#2a4a2a");c.ellipse(x,y,rx,ry,dk);c.ellipse(x-1,y-1,Math.max(1,rx-1),Math.max(1,ry-1),mid);c.px(x-1,y-2,lt);if(rx>=2)c.px(x-2,y-1,lt)}
/* xoài (đặc sản Cao Lãnh): tán tròn đầy, xanh sẫm bóng, quả xoài thuôn xanh vàng thòng dưới tán */
sprite("m_xoai",{w:60,h:62},
 layer("sh",...shd(32,59,21,4)),
 layer("tr",(c)=>{trunk(c,26,34,59,7,BK);c.line(28,40,18,32,BK[1]);c.line(31,40,43,31,BK[1])}),
 layer("crown",(c)=>{
  foliage(c,{seed:31,cx:30,cy:27,rx:27,ry:23,flat:.92,rmin:5,rmax:8,tones:LF.xoai});
  leaves(c,32,80,"#7fbc62","#16392c",60,52,0,2);
  const r=c.rng(33);let n=0;for(let i=0;i<60&&n<11;i++){const x=6+rnd(r,48),y=26+rnd(r,22);if(c.is(x,y,"*")&&c.is(x,y+4,"*")){fruit(c,x,y+3,2,3,"#c9b83e","#ecdf6a","#8e8a2c");n++}}
  rough(c,34,.22,.16)}))
/* mít: tán đứng sẫm, lá dày bóng; quả mít to sần chín xanh ôliu bám thẳng vào thân và cành lớn */
sprite("m_mit",{w:50,h:62},
 layer("sh",...shd(27,59,18,4)),
 layer("tr",(c)=>{trunk(c,22,32,59,7,BK);c.line(25,40,14,33,BK[1]);c.line(27,40,38,32,BK[1]);
  for(const[x,y]of[[19,43],[31,47],[23,52]]){c.ellipse(x,y,4,6,"#566b22");c.ellipse(x-1,y-1,3,5,"#8d9a38");for(const[dx,dy]of[[-1,-3],[1,-1],[-2,1],[0,3],[1,4]])c.px(x+dx,y+dy,"#6f7c28");c.px(x-2,y-3,"#c2cf5a");c.px(x-2,y-2,"#c2cf5a")}}),
 layer("crown",(c)=>{
  foliage(c,{seed:51,cx:25,cy:24,rx:22,ry:21,flat:.95,rmin:5,rmax:7,tones:LF.mit});
  leaves(c,52,90,"#8cc468","#173a2a",50,44,0,2);rough(c,54,.2,.15)}))
/* bưởi: tán tròn gọn, vài quả to vàng xanh */
sprite("m_buoi",{w:46,h:52},
 layer("sh",...shd(25,49,15,3)),
 layer("tr",(c)=>{trunk(c,20,30,49,5,BK);c.line(22,34,13,29,BK[1])}),
 layer("crown",(c)=>{
  foliage(c,{seed:61,cx:23,cy:22,rx:20,ry:18,flat:.95,rmin:4,rmax:6,tones:LF.buoi});
  leaves(c,62,60,"#a3d26c","#1f4a35",46,40,0,2);
  const r=c.rng(63);let n=0;for(let i=0;i<50&&n<6;i++){const x=6+rnd(r,34),y=18+rnd(r,18);if(c.is(x,y,"*")){c.ellipse(x,y,3,3,"#9aa831");c.ellipse(x-1,y-1,2,2,"#d4d64e");c.px(x-2,y-2,"#f2eb86");n++}}
  rough(c,64,.2,.15)}))
/* cau: cụm 3 thân thẳng mảnh, vòng sẹo đều, bẹ xanh dưới tán lá, buồng quả cam */
sprite("m_cau",{w:44,h:80},
 layer("sh",...shd(24,76,14,3)),
 layer("tr",(c)=>{for(const[x,top,b]of[[11,22,76],[21,12,77],[31,26,75]]){
   for(let y=top;y<=b;y++){const ring=(y-top)%5==0;c.rect(x,y,3,1,ring?"#7d7658":"#b8b08a");c.px(x,y,ring?"#a49c78":"#dad4ae");c.px(x+2,y,"#8a8466")}
   c.rect(x-1,top-5,5,7,"#7aa844");c.vline(x-1,top-5,7,"#a8d060");c.vline(x+3,top-5,7,"#4f7a2f");c.rect(x,top+2,3,3,"#d8832e");c.px(x,top+2,"#f3a64a")}}),
 layer("crown",(c)=>{[[12,17],[22,7],[32,21]].forEach(([tx,ty],j)=>{[[-2.9,13],[-2.3,15],[-1.7,11],[-1.1,12],[-.4,15],[.1,13]].forEach(([a,l],i)=>frond(c,tx,ty,a,l+(j==1?3:0),i%2==0))})}))
/* chuối: bẹ mập xanh nhạt, lá bản rộng bị gió xé dọc, buồng chuối + bắp tím lủng lẳng */
sprite("m_chuoi",{w:46,h:56},
 layer("sh",...shd(24,49,15,3)),
 layer("tr",(c)=>{for(const[x,top]of[[10,24],[20,16],[30,26]]){c.rect(x,top,5,49-top,"#8fc060");c.vline(x,top,49-top,"#b9e080");c.vline(x+4,top,49-top,"#5e8c40");c.hline(x-1,49,7,"#4a6e32")}}),
 layer("crown",(c)=>{
  const leaf=(x0,y0,x1,y1,wd)=>{const dx=x1-x0,dy=y1-y0,L=Math.hypot(dx,dy),nx=-dy/L,ny=dx/L,mx=(x0+x1)/2,my=(y0+y1)/2;
   c.poly([x0,y0,mx+nx*wd,my+ny*wd,x1,y1,mx-nx*wd*.85,my-ny*wd*.85],"#4f9a3c");c.poly([x0,y0,mx+nx*wd,my+ny*wd,x1,y1],"#7cc254");c.line(x0,y0,x1,y1,"#b5e07a");c.line(x0+Math.round(nx*-1),y0+Math.round(ny*-1),x1,y1,"#2f6a2c")};
  leaf(12,24,1,6,7);leaf(21,16,14,-2,7);leaf(22,16,40,3,7);leaf(32,26,45,14,6);leaf(12,24,2,38,6);leaf(32,26,44,40,6);leaf(21,18,27,-1,6);
  const r=c.rng(4);for(let i=0;i<10;i++){const x=1+rnd(r,43),y=2+rnd(r,34);if(c.is(x,y,"*"))c.line(x,y,x+2,y+3,"_")}
  for(let i=0;i<5;i++){c.ellipse(24+i*2,32+i,2,4,"#a9c43a");c.px(23+i*2,30+i,"#d4e060")}c.ellipse(32,40,3,4,"#6a2a5a");c.px(31,38,"#9a4a86")}))
/* tràm: thân thẳng vỏ trắng ngà bong từng mảng, tán thưa xanh xám, cành rủ mảnh */
sprite("m_tram",{w:44,h:78},
 layer("sh",...shd(24,75,12,3)),
 layer("tr",(c)=>{for(let y=24;y<=74;y++){const x=20+Math.round(Math.sin(y/22)*1.6);c.rect(x,y,4,1,"#cdbf9c");c.px(x,y,"#ece2c4");c.px(x+3,y,"#a89877")}
   const r=c.rng(7);for(let i=0;i<16;i++){const y=28+rnd(r,44),x=20+Math.round(Math.sin(y/22)*1.6);c.vline(x+1+rnd(r,2),y,3+rnd(r,4),"#8a7a5a")}
   c.line(22,40,10,28,"#cdbf9c");c.line(23,46,34,30,"#cdbf9c")}),
 layer("crown",(c)=>{
  foliage(c,{seed:71,cx:22,cy:20,rx:19,ry:16,flat:.8,rmin:3,rmax:5,step:7,tones:LF.tram});
  const r=c.rng(72);for(let i=0;i<26;i++){const x=6+rnd(r,32),top=18+rnd(r,12),len=6+rnd(r,16);if(c.is(x,top,"*"))for(let y=0;y<len;y++)c.px(x+Math.round(Math.sin(y/4+i)*.8),top+y,y<len*.6?"#6fa08a":"#98c0a6")}
  rough(c,73,.25,.3)}))

/* ====================================================================================================
   NHÀ QUÊ NAM BỘ (vẽ lại): thấp, hiên rộng, mái thoải; ngói âm dương hai tông xen kẽ hoặc mái lá dừa/lá chằm; vách ván/vách lá;
   cột tròn kê chân đá; lu nước, nón lá, giỏ tre treo hiên. Sáng từ trên-trái (mặt trái mái sáng hơn mặt phải), bóng đổ về dưới-phải.
   Viền chọn lọc: nâu đỏ sẫm cho gỗ/ngói, không viền đen. Chỉ vẽ hình khối nhà; sân đất, hàng rào, giàn bầu là vật trang trí rời.
   ==================================================================================================== */
const WD={k:"#2f1a14",a:"#4a2a1c",b:"#6b3f27",c:"#8a5836",d:"#b27a4b",e:"#d9a46a",f:"#f0c88c"}
const TL={ld:"#d67c49",la:"#b05830",md:"#c4703f",ma:"#9c4c2c",sd:"#a85c37",sa:"#7f3e26",gap:"#5a2a1e",hi:"#ec9f68",moss:"#7c8d5b",moss2:"#9aab72",fade:"#d3a07a"}
/* mái ngói âm dương: hình thang (tl,tr trên · bl,br dưới); cột ngói rộng 3 px xen hai tông; mỗi lớp ngói 5 hàng có khe tối cuối lớp; trái sáng → phải tối; rêu rải ở nửa dưới */
function ngoi(c,tl,tr,bl,br,yt,yb,seed){const r=c.rng(seed),H=yb-yt;
 for(let y=yt;y<yb;y++){const t=(y-yt)/H,l=Math.round(tl+(bl-tl)*t),rr=Math.round(tr+(br-tr)*t),course=(y-yt)%5;
  for(let x=l;x<rr;x++){const u=(x-l)/(rr-l),band=u<.3?0:u<.68?1:2,col=Math.floor((x-l)/3)%2==0;
   let k=band==0?(col?TL.ld:TL.la):band==1?(col?TL.md:TL.ma):(col?TL.sd:TL.sa);
   if(course==4)k=TL.gap;else if(course==0&&col)k=band==2?TL.md:TL.hi;
   c.px(x,y,k)}}
 for(let i=0;i<7;i++){const x=tl+4+rnd(r,tr-tl),y=yt+Math.floor(H*.45)+rnd(r,Math.floor(H*.5)-2);c.rect(x,y,3+rnd(r,3),2,TL.moss);c.px(x,y,TL.moss2)}
 for(let i=0;i<4;i++){const x=tl+6+rnd(r,tr-tl-10),y=yt+3+rnd(r,H-8);c.rect(x,y,4,2,TL.fade)}}
/* bờ nóc + đầu ống ngói, đuôi cong hai đầu */
function nocNgoi(c,x0,x1,y){c.rect(x0,y,x1-x0,5,"#9c4c2c");c.hline(x0,y,x1-x0,TL.hi);c.hline(x0,y+4,x1-x0,TL.gap);for(let x=x0+2;x<x1-2;x+=6){c.rect(x,y-2,4,3,"#b05830");c.hline(x,y-2,4,TL.hi)}
 c.poly([x0-2,y+4,x0+2,y,x0+2,y-5,x0-4,y-3],"#b05830");c.poly([x1+2,y+4,x1-2,y,x1-2,y-5,x1+4,y-3],"#9c4c2c")}
/* mái lá chằm: lớp lá chồng, đầu sợi tua dưới chân, nóc dày có dây buộc */
function la(c,tl,tr,bl,br,yt,yb,seed){const r=c.rng(seed),H=yb-yt;const T=["#e6cf82","#d3b468","#c9a05a","#b58a42"],D=["#a07c34","#8a6a2a","#6e5222"];
 for(let y=yt;y<yb;y++){const t=(y-yt)/H,l=Math.round(tl+(bl-tl)*t),rr=Math.round(tr+(br-tr)*t);
  for(let x=l;x<rr;x++){const u=(x-l)/(rr-l),sh=u<.3?0:u<.65?1:2;c.px(x,y,T[Math.min(3,sh+((x*7+y*3)%5<2?1:0))])}}
 for(let y=yt+3;y<yb-1;y+=4){const t=(y-yt)/H,l=Math.round(tl+(bl-tl)*t),rr=Math.round(tr+(br-tr)*t);for(let x=l+1;x<rr-1;x+=2+rnd(r,3)){const u=(x-l)/(rr-l);c.vline(x,y,3,u<.3?"#f0dc9a":u<.65?"#c9a05a":"#a07c34");c.px(x,y+3,D[1])}
  c.hline(l,y+3,rr-l,"#9a7630")}
 for(let x=bl;x<br;x+=2){const L=2+rnd(r,4),u=(x-bl)/(br-bl);c.vline(x,yb,L,u<.3?"#c9a05a":"#8a6a2a");c.px(x,yb+L,"#6e5222")}
 for(let i=0;i<5;i++){const x=tl+3+rnd(r,tr-tl-6),y=yt+Math.floor(H*.5)+rnd(r,Math.floor(H*.4));c.rect(x,y,3,2,"#9aa26a")}}
function nocLa(c,x0,x1,y){c.rect(x0,y,x1-x0,6,"#c9a05a");c.hline(x0,y,x1-x0,"#f0dc9a");c.hline(x0,y+5,x1-x0,"#8a6a2a");for(let x=x0+3;x<x1-2;x+=8){c.rect(x,y,2,6,"#6b3f27");c.px(x,y,"#b27a4b")}c.poly([x0-1,y+5,x0+3,y,x0+3,y-4,x0-3,y-2],"#d3b468");c.poly([x1+1,y+5,x1-3,y,x1-3,y-4,x1+3,y-2],"#b58a42")}
/* vách ván nằm ngang: mỗi tấm một tông, mép trên sáng, khe tối dưới, mối nối đầu ván so le; dải ám bùn ở chân */
function van(c,x,y,w,h,seed,pal){const r=c.rng(seed),T=pal||["#8c6a4c","#7f5f44","#96735a","#86684a"];
 for(let yy=0;yy<h;yy+=6){const col=T[rnd(r,T.length)],hh=Math.min(6,h-yy);c.rect(x,y+yy,w,hh,col);c.hline(x,y+yy,w,"#b5917a");if(hh>=5)c.hline(x,y+yy+5,w,"#4d3626");
  for(let k=0;k<2;k++){const sx=x+2+rnd(r,w-4);c.vline(sx,y+yy+1,4,"#5a3f2c")}for(let k=0;k<2;k++)c.px(x+2+rnd(r,w-4),y+yy+2,"#3a281e")}
 c.rect(x,y+h-4,w,4,"#5a4634");c.hline(x,y+h-4,w,"#6e5844")}
/* vách vôi: nền kem ngả tím nhạt ở bóng, vệt mưa dọc dưới mái, chân ám bùn */
function voi(c,x,y,w,h,seed){const r=c.rng(seed);c.rect(x,y,w,h,"#e5dbc4");for(let i=0;i<w/5;i++){const sx=x+2+rnd(r,w-4);c.vline(sx,y+6,5+rnd(r,16),"#d4c8ae")}
 c.rect(x,y,w,4,"#b3a68c");c.rect(x,y+h-5,w,5,"#a89572");c.hline(x,y+h-5,w,"#bfae88");c.vline(x,y,h,"#f2ead6");c.vline(x+w-1,y,h,"#c9bca0")}
/* vách lá: lá dừa đan dọc, hai tông, nẹp tre ngang */
function vachLa(c,x,y,w,h,seed){const r=c.rng(seed);c.rect(x,y,w,h,"#a98c52");for(let xx=x;xx<x+w;xx+=3){c.vline(xx,y,h,(xx/3|0)%2?"#bfa266":"#97793f");c.vline(xx+2,y,h,"#7d6232")}
 for(const yy of[y+Math.floor(h*.32),y+Math.floor(h*.68)]){c.rect(x,yy,w,2,"#6f8a3a");c.hline(x,yy,w,"#a4b85a");c.hline(x,yy+2,w,"#3f5a1f")}
 c.rect(x,y+h-4,w,4,"#6e5636");c.rect(x,y,w,5,"#6e5636")}
/* cột tròn: sáng trái, tối phải, kê chân đá */
function cot(c,x,y0,y1,w){c.rect(x,y0,w,y1-y0,WD.c);c.vline(x,y0,y1-y0,WD.e);c.vline(x+1,y0,y1-y0,WD.d);c.vline(x+w-1,y0,y1-y0,WD.a);if(w>=5)c.vline(x+w-2,y0,y1-y0,WD.b);
 c.rect(x-1,y1-4,w+2,4,"#8a8aa0");c.hline(x-1,y1-4,w+2,"#c4c4d4");c.hline(x-1,y1-1,w+2,"#4c4c64");c.rect(x-1,y0,w+2,2,WD.b)}
/* cửa hai cánh ván dọc, khung sáng hơn, then đồng */
function cua(c,x,y,w,h){c.rect(x-2,y-2,w+4,h+2,WD.d);c.hline(x-2,y-2,w+4,WD.f);c.rect(x,y,w,h,"#2a1f1a");const hw=Math.floor(w/2)-1;
 for(const lx of[x+1,x+hw+2]){c.rect(lx,y+1,hw,h-1,"#7a5238");for(let xx=lx;xx<lx+hw;xx+=3)c.vline(xx,y+1,h-1,"#8e6446");c.vline(lx,y+1,h-1,"#a4784f");c.hline(lx,y+h*.5,hw,"#4d3626")}
 c.px(x+hw-1,y+Math.floor(h*.55),"#e3b04b");c.px(x+hw+3,y+Math.floor(h*.55),"#e3b04b")}
/* cửa sổ song tiện: nền tối, song dọc sáng trái/tối phải, khung + bệ cửa */
function sotien(c,x,y,w,h){c.rect(x-2,y-2,w+4,h+4,WD.d);c.hline(x-2,y-2,w+4,WD.f);c.rect(x,y,w,h,"#2a1f1a");c.rect(x+1,y+h-5,w-2,5,"#3a2c26");
 for(let xx=x+2;xx<x+w-1;xx+=4){c.rect(xx,y,2,h,WD.d);c.vline(xx,y,h,WD.e);c.px(xx,y+Math.floor(h/2),WD.b)}c.rect(x-3,y+h+2,w+6,3,WD.c);c.hline(x-3,y+h+2,w+6,WD.e)}
/* cửa sổ chớp (gỗ lá sách): hai cánh nửa mở */
function chop(c,x,y,w,h){c.rect(x-2,y-2,w+4,h+4,"#f0e8d0");c.rect(x,y,w,h,"#3a4a56");c.poly([x+2,y+2,x+w-3,y+2,x+w-5,y+h*.55,x+2,y+h*.7],"#6c8c9a");
 for(const sx of[x-1,x+w-w/3+1]){c.rect(sx,y-1,Math.floor(w/3)+1,h+2,"#4f7a4a");for(let yy=y+1;yy<y+h;yy+=3){c.hline(sx,yy,Math.floor(w/3)+1,"#78a468");c.hline(sx,yy+1,Math.floor(w/3)+1,"#2f5a34")}}c.rect(x-3,y+h+2,w+6,3,"#d6cdb4")}
/* thềm gạch tàu */
function them(c,x,y,w,h,seed){const r=c.rng(seed);c.rect(x,y,w,h,"#9b5a3a");for(let yy=0;yy<h;yy+=4)for(let xx=0;xx<w;xx+=6){const o=(yy/4%2)*3;c.rect(x+xx+o,y+yy,5,3,["#c06a43","#b45f3b","#c97a50","#ad583a"][rnd(r,4)]);c.hline(x+xx+o,y+yy,5,"#dc9468")}c.hline(x,y+h-1,w,"#6e3a26")}
/* bóng đổ xuống nền dưới hiên (dài ra phải-xuống) */
function bong(c,cx,y,w,h){c.ellipse(cx,y,w/2,h,"#1d1b3a30");c.ellipse(cx+3,y,w/2-6,Math.max(1,h-2),"#1d1b3a38")}
/* nón lá treo vách */
function nonTreo(c,x,y){c.poly([x,y,x+7,y+7,x-7,y+7],"#e6cf82");c.poly([x,y,x-7,y+7,x-2,y+7],"#f0dc9a");c.poly([x,y,x+7,y+7,x+3,y+7],"#c9a05a");c.hline(x-7,y+7,14,"#8a6a2a");c.px(x,y-1,"#6b3f27")}
/* lu nước men nâu */
function lu(c,x,y,w,h){c.ellipse(x+w/2,y+h-2,w/2,3,"#1d1b3a30");c.rect(x+1,y+4,w-2,h-6,"#8a4a2a");c.ellipse(x+w/2,y+h-4,w/2,5,"#8a4a2a");c.ellipse(x+w/2,y+4,w/2-1,3,"#a9633a");c.ellipse(x+w/2,y+4,w/2-3,2,"#3a1f14");c.vline(x+2,y+6,h-10,"#c98152");c.vline(x+w-2,y+6,h-10,"#6a3820");c.hline(x+1,y+8,w-2,"#a9633a")}

/* ====================== v17 · NHÀ LÀNG HÒA AN — top-down 3/4 kiểu Stardew ======================
   Một nguồn sáng trên-trái cho cả dự án: mặt/mái trái sáng, phải tối; bóng đổ xuống dưới-phải (một lớp alpha 35%).
   Thấy mặt trên mái (4 mặt: sau · trước · hông trái · hông phải) + tường nam cao ~40-45% sprite; cửa chính ở tường nam.
   Viền nâu đỏ sẫm "1" (không #000). Mọi hàm mới đặt tiền tố h3 để KHÔNG đụng tới các công trình công cộng dùng hàm cũ.
   Vật nhỏ trên nhà (lu, nón treo, chùm ớt, tấm tôn, thang…) giữ đúng bộ của v16, không thêm vật mới. */
pal({"1":"#3b1b19"})
const H3={
 til:["#35192c","#5a2630","#84362f","#ad4a31","#cc6537","#e3853f","#f2a95a"],
 tha:["#3f2a22","#5f4326","#85602b","#a97f38","#c79d48","#dfba5c","#f0d578"],
 woo:["#2d1a1f","#4a2b27","#6a4331","#8a5c40","#a8774f","#c4946a","#dcb487"],
 sil:["#3a3438","#574c4c","#756a64","#8f8479","#a89c8c","#c2b6a2"],
 pla:["#5b4a5e","#85727a","#ad9a95","#cfc0b0","#e8dcc4","#f6edd8"],
 lea:["#3a2e22","#5d4a2c","#836a38","#a98c4c","#c7ab62","#dfc680"],
 bam:["#233420","#3a4f26","#5f7a33","#8fa84a","#b9cf6a"],
 bri:["#4a2230","#6e3033","#964236","#b9573a","#d4713f","#e8904f","#f4b36a"],
 stn:["#4b4960","#6c6a82","#908ea3","#b5b3c3"],
 mos:["#33492f","#4d6b3a","#6f9448","#97b863"],
 shu:["#2b4a3a","#3f6a4a","#5b8a5c","#8bb078"],
 dk:"#241418"}
const h3c=(R,i)=>R[Math.max(0,Math.min(R.length-1,Math.round(i)))]
const h3l=(a,b,t)=>a+(b-a)*t
const h3h=(a,b)=>((a*73856093)^(b*19349663))>>>0
const h3s=(c,x,y,w,h,a)=>c.rect(x,y,w,h,"#2b1a3a"+a)          /* bóng lạnh: đè alpha lên vật liệu (a = hex 2 ký tự) */

/* mặt phẳng của mái hông tại (x,y): B sau · F trước · L hông trái · R hông phải */
function h3plane(x,y,G){const t=(y-G.yt)/(G.yb-G.yt),xl=h3l(G.tl,G.bl,t),xr=h3l(G.tr,G.br,t);if(y<G.yt||y>=G.yb||x<xl||x>=xr)return null;
 if(y<G.yr){const u=(y-G.yt)/(G.yr-G.yt);return x<h3l(G.tl,G.rl,u)?"L":x>=h3l(G.tr,G.rr,u)?"R":"B"}
 const u=(y-G.yr)/(G.yb-G.yr);return x<h3l(G.rl,G.bl,u)?"L":x>=h3l(G.rr,G.br,u)?"R":"F"}
/* một điểm ngói/lá: b = bậc nền theo mặt (đã tính sáng-tối), (p,q) = pha cột & pha lớp */
function h3tile(mat,b,p,q,ci,x){
 if(mat=="til"){let i=b;if(p==0)i+=1;else if(p>=3)i-=1;if(q==4)i-=2;else if(q==0&&p==0)i+=1;return h3c(H3.til,i)}
 let i=b+[-2,-1,0,1][q];if(q==0&&h3h(x,ci)%3==0)i=b+1;if(((x*3+ci*5)%8+8)%8==0)i-=1;return h3c(H3.tha,i)}
/* mái hông: 4 mặt, ngói âm dương (cột 6 px, hai tông) hoặc lá chằm (lớp 4 px); rêu chỉ ở máng mái */
function h3roof(c,G,mat,seed){const per=mat=="til"?5:4,lv={F:3,L:4,R:2,B:3};
 for(let y=G.yt;y<G.yb;y++){const t=(y-G.yt)/(G.yb-G.yt),xl=Math.round(h3l(G.tl,G.bl,t)),xr=Math.round(h3l(G.tr,G.br,t));
  for(let x=xl;x<xr;x++){const pl=h3plane(x,y,G);if(!pl)continue;let b=lv[pl];
   if(pl=="F"){const u=(x-G.bl)/(G.br-G.bl);b=u<.3?4:3;if(Math.abs(u-.3)<.01&&((x+y)&1))b=4}
   const p=(((x-G.bl)%6)+6)%6,q=(((y-G.yr)%per)+per)%per,ci=Math.floor((y-G.yr)/per);
   c.px(x,y,h3tile(mat,b,p,q,ci,x))}}
 /* bờ hông (rafter): vạch sáng bên trên-trái, vạch tối bên phải */
 const R=H3[mat];for(let y=G.yr;y<G.yb;y++){const u=(y-G.yr)/(G.yb-G.yr),a=Math.round(h3l(G.rl,G.bl,u)),b2=Math.round(h3l(G.rr,G.br,u));
  c.px(a,y,h3c(R,5));c.px(a+1,y,h3c(R,2));c.px(b2-1,y,h3c(R,3));c.px(b2,y,h3c(R,1))}
 for(let y=G.yt;y<G.yr;y++){const u=(y-G.yt)/(G.yr-G.yt),a=Math.round(h3l(G.tl,G.rl,u)),b2=Math.round(h3l(G.tr,G.rr,u));c.px(a,y,h3c(R,4));c.px(b2-1,y,h3c(R,2))}
 /* mép máng: dải tối dưới cùng + đầu ngói bo; rêu theo máng (nước chảy tụ), vài đoạn ngắn */
 if(mat=="til"){const xl=G.bl,xr=G.br;for(let x=xl;x<xr;x++){const p=(((x-G.bl)%6)+6)%6;c.px(x,G.yb-1,H3.til[0]);c.px(x,G.yb-2,p<3?H3.til[5]:H3.til[2])}
  const r=c.rng(seed);for(let k=0;k<5;k++){const x=xl+10+Math.floor(r()*(xr-xl-30)),w=3+Math.floor(r()*4);for(let i=0;i<w;i++){c.px(x+i,G.yb-3,h3c(H3.mos,1+(i%2)));if(i%3!=2)c.px(x+i,G.yb-2,H3.mos[1])}}}
 else{for(let x=G.bl;x<G.br;x++){c.px(x,G.yb-1,H3.tha[1])}}}
/* bờ nóc ngói + đầu đao cong */
function h3ridgeTil(c,G){const x0=G.rl-2,x1=G.rr+2,y=G.yr;
 c.rect(x0,y-3,x1-x0,6,H3.til[3]);c.hline(x0,y-3,x1-x0,H3.til[5]);c.hline(x0,y-2,x1-x0,H3.til[4]);c.hline(x0,y+1,x1-x0,H3.til[2]);c.hline(x0,y+2,x1-x0,H3.til[0]);
 for(let x=x0+2;x<x1-2;x+=6){c.rect(x,y-4,4,2,H3.til[4]);c.hline(x,y-4,4,H3.til[6])}
 c.poly([x0-4,y+3,x0+2,y-3,x0+2,y-9,x0-2,y-9,x0-6,y-4],H3.til[4]);c.vline(x0+1,y-8,6,H3.til[6]);c.hline(x0-2,y-9,4,H3.til[6]);
 c.poly([x1+4,y+3,x1-2,y-3,x1-2,y-9,x1+2,y-9,x1+6,y-4],H3.til[2]);c.vline(x1-2,y-8,6,H3.til[3]);c.hline(x1-2,y-9,4,H3.til[4])}
/* nóc mái lá: bó lá dày, dây buộc, hai cây nọc bắt chéo ở đầu hồi */
function h3ridgeTha(c,G){const x0=G.rl-1,x1=G.rr+1,y=G.yr;
 c.rect(x0,y-3,x1-x0,7,H3.tha[3]);c.hline(x0,y-3,x1-x0,H3.tha[6]);c.hline(x0,y-2,x1-x0,H3.tha[5]);c.hline(x0,y+2,x1-x0,H3.tha[2]);c.hline(x0,y+3,x1-x0,H3.tha[1]);
 for(let x=x0+4;x<x1-3;x+=8){c.vline(x,y-3,7,H3.woo[2]);c.px(x,y-3,H3.woo[4])}
 c.line(x0-3,y-8,x0+3,y+1,H3.woo[4]);c.line(x0+3,y-8,x0-3,y+1,H3.woo[3]);c.line(x1-3,y-8,x1+3,y+1,H3.woo[2]);c.line(x1+3,y-8,x1-3,y+1,H3.woo[1])}
/* tua lá chằm dưới chân mái (độ dài theo hàm băm, không rắc ngẫu nhiên) */
function h3fringe(c,x0,x1,y){for(let x=x0;x<x1;x++){const L=1+(h3h(x,7)%4);const lit=x<(x0+(x1-x0)*.3);c.vline(x,y,L,lit?H3.tha[3]:H3.tha[2]);c.px(x,y+L,H3.tha[1])}}
/* vách ván nằm ngang: ván bạc ở mặt nắng (trái), nâu ở phải; mối nối so le; bóng mái; rêu + bùn ở chân tường */
function h3wallPlank(c,x0,y0,x1,y1,seed,eaveH=6){const w=x1-x0;
 for(let y=y0,row=0;y<y1;y+=6,row++){const hgt=Math.min(6,y1-y),sil=Math.round(w*(.07+.05*(h3h(row,seed)%3)));
  for(let x=x0;x<x1;x++){const isS=x<x0+sil||(x<x0+sil+2&&((x+row)&1)),R=isS?H3.sil:H3.woo,b=isS?3:3-(h3h(row,seed+1)%2);
   c.px(x,y,h3c(R,b+2));for(let k=1;k<hgt-1;k++)c.px(x,y+k,h3c(R,b));if(hgt>=5)c.px(x,y+hgt-1,h3c(R,b-2))}
  const jx=x0+8+((row*29+seed)%(w-16));c.vline(jx,y+1,4,H3.woo[1]);c.px(jx+1,y+1,H3.woo[4])}
 h3s(c,x0,y0,w,eaveH,"73");h3s(c,x0,y0+eaveH,w,3,"33");
 const r=c.rng(seed+9);for(let k=0;k<4;k++){const x=x0+4+Math.floor(r()*(w-14)),ww=4+Math.floor(r()*5);for(let i=0;i<ww;i++){const hh2=1+((i*5+k)%3==0?2:1);for(let j=0;j<hh2;j++)c.px(x+i,y1-1-j,h3c(H3.mos,j==hh2-1?2:1))}}
 c.hline(x0,y1-1,w,"#3a2a28")}
/* vách vôi: kem ngả tím ở bóng, vệt mưa dưới bệ cửa, bùn bắn chân tường mờ dần lên */
function h3wallPla(c,x0,y0,x1,y1,seed,eaveH=6){const w=x1-x0;
 for(let y=y0;y<y1;y++)for(let x=x0;x<x1;x++){const u=(x-x0)/w;c.px(x,y,h3c(H3.pla,u<.3?4:u<.82?3:2))}
 c.vline(x0,y0,y1-y0,H3.pla[5]);c.vline(x1-1,y0,y1-y0,H3.pla[1]);
 h3s(c,x0,y0,w,eaveH,"7a");h3s(c,x0,y0+eaveH,w,3,"3a");
 for(let y=y1-6;y<y1;y++){const d=y1-y;for(let x=x0;x<x1;x++)if(d>3||((x+y)&1)||d<=1)c.px(x,y,d<=2?"#8d7960":"#a89572")}
 c.hline(x0,y1-1,w,"#6e5844")}
/* vách lá đan: dải 3 px hai tông, nẹp tre xanh ngang */
function h3wallLea(c,x0,y0,x1,y1,seed,eaveH=6){const w=x1-x0;
 for(let x=x0;x<x1;x++){const s=Math.floor((x-x0)/3),ph=(x-x0)%3,u=(x-x0)/w,b=(u<.3?4:u<.7?3:2)-(s%2?0:1);
  for(let y=y0;y<y1;y++)c.px(x,y,h3c(H3.lea,ph==2?b-2:ph==0?b+1:b))}
 for(const yy of[y0+Math.floor((y1-y0)*.34),y0+Math.floor((y1-y0)*.7)]){c.rect(x0,yy,w,2,H3.bam[2]);c.hline(x0,yy,w,H3.bam[4]);c.hline(x0,yy+2,w,H3.bam[0])}
 h3s(c,x0,y0,w,eaveH,"73");h3s(c,x0,y0+eaveH,w,3,"33");
 c.rect(x0,y1-4,w,4,"#6e5636");c.hline(x0,y1-4,w,"#8a6f45");c.hline(x0,y1-1,w,"#3a2a28")}
/* cột tròn: sáng trái, tối phải, kê chân đá; bóng đổ phải-xuống lên tường */
function h3post(c,x,y0,y1,w=4,R=H3.woo){for(let i=0;i<w;i++){const b=i==0?5:i==1?4:i<w-1?3:1;c.vline(x+i,y0,y1-y0,h3c(R,b))}
 c.vline(x+w,y0+3,y1-y0-6,"#2b1a3a55");
 c.rect(x-1,y1-5,w+2,5,H3.stn[2]);c.hline(x-1,y1-5,w+2,H3.stn[3]);c.hline(x-1,y1-1,w+2,H3.stn[0]);c.vline(x+w,y1-5,5,H3.stn[1])}
function h3beam(c,x0,x1,y,hgt=4){c.rect(x0,y,x1-x0,hgt,H3.woo[3]);c.hline(x0,y,x1-x0,H3.woo[5]);c.hline(x0,y+hgt-1,x1-x0,H3.woo[1]);for(let x=x0+3;x<x1-3;x+=7)c.px(x,y+1,H3.woo[2])}
/* bao lam: diềm gỗ xẻ răng dưới xà (rộng 5 px, cao 6) */
function h3baolam(c,x0,x1,y){for(let x=x0;x<x1;x+=6){c.poly([x,y,x+5,y,x+2,y+6],H3.woo[4]);c.poly([x+3,y,x+5,y,x+3,y+4],H3.woo[2]);c.px(x,y,H3.woo[6])}}
/* cửa hai cánh ván dọc */
function h3door(c,x,y,w,h){c.rect(x-2,y-3,w+4,h+3,H3.woo[4]);c.hline(x-2,y-3,w+4,H3.woo[6]);c.vline(x-2,y-3,h+3,H3.woo[5]);c.vline(x+w+1,y-3,h+3,H3.woo[2]);
 c.rect(x,y,w,h,H3.dk);const hw=Math.floor(w/2)-1;
 for(const lx of[x+1,x+hw+2]){c.rect(lx,y+1,hw,h-1,H3.woo[2]);for(let xx=lx;xx<lx+hw;xx+=3)c.vline(xx,y+1,h-1,H3.woo[3]);c.vline(lx,y+1,h-1,H3.woo[4]);c.hline(lx,y+Math.floor(h*.5),hw,H3.woo[1])}
 c.px(x+hw-1,y+Math.floor(h*.55),"#e3b04b");c.px(x+hw+3,y+Math.floor(h*.55),"#e3b04b");
 c.rect(x-3,y+h,w+6,2,H3.stn[2]);c.hline(x-3,y+h,w+6,H3.stn[3])}
/* cửa sổ song tiện: nền tối, song sáng trái/tối phải, khung + bệ; vệt mưa ở dưới bệ */
function h3sotien(c,x,y,w,h){c.rect(x-2,y-2,w+4,h+4,H3.woo[4]);c.hline(x-2,y-2,w+4,H3.woo[6]);c.vline(x-2,y-2,h+4,H3.woo[5]);c.vline(x+w+1,y-2,h+4,H3.woo[2]);c.rect(x,y,w,h,H3.dk);
 for(let xx=x+2;xx<x+w-1;xx+=4){c.rect(xx,y,2,h,H3.woo[4]);c.vline(xx,y,h,H3.woo[6])}c.hline(x,y+Math.floor(h/2),w,H3.woo[3]);
 c.rect(x-3,y+h+2,w+6,3,H3.woo[3]);c.hline(x-3,y+h+2,w+6,H3.woo[5]);
 for(const sx of[x+2,x+w-3])c.vline(sx,y+h+5,5,"#2b1a3a40")}
/* cửa sổ chớp xanh (nhà vôi) */
function h3chop(c,x,y,w,h){c.rect(x-2,y-2,w+4,h+4,H3.pla[5]);c.vline(x+w+1,y-2,h+4,H3.pla[2]);c.rect(x,y,w,h,"#2f3e4c");c.poly([x+2,y+2,x+w-3,y+2,x+w-5,y+h*.55,x+2,y+h*.7],"#6c8c9a");
 const sw=Math.floor(w/3)+1;for(const sx of[x-1,x+w-sw+1]){c.rect(sx,y-1,sw,h+2,H3.shu[2]);c.vline(sx,y-1,h+2,H3.shu[3]);for(let yy=y+1;yy<y+h;yy+=3){c.hline(sx,yy,sw,H3.shu[3]);c.hline(sx,yy+1,sw,H3.shu[0])}}
 c.rect(x-3,y+h+2,w+6,3,H3.pla[3]);c.hline(x-3,y+h+2,w+6,H3.pla[5]);for(const sx of[x+1,x+w-2])c.vline(sx,y+h+5,6,"#85727a")}
/* thềm gạch tàu: so le nửa viên, 3 tông — cùng bảng gạch với ô lát đường m_br* */
function h3brick(c,x,y,w,h,seed){for(let yy=0,row=0;yy<h;yy+=3,row++){for(let xx=-(row%2)*3;xx<w;xx+=6){const t=h3h(Math.floor((xx+6)/6)+row*7,seed)%3,b=3+t-1,x1=Math.max(0,xx),x2=Math.min(w,xx+5);if(x2<=x1)continue;
   c.rect(x+x1,y+yy,x2-x1,Math.min(2,h-yy),h3c(H3.bri,b));c.hline(x+x1,y+yy,x2-x1,h3c(H3.bri,b+1))}
  c.hline(x,y+yy+2,w,"#7d5a52")}
 c.hline(x,y+h-1,w,H3.bri[1])}
/* bóng đổ nền: MỘT lớp alpha 35% (89/255) xám nâu ấm, rơi xuống dưới-phải; đặt ngoài phần viền để không bị viền theo */
const h3sh=(x0,x1,y)=>poly([x0+6,y-2,x1,y-2,x1+6,y+6,x0+12,y+6],"#2a1f1459")

/* ============================ 6 KIỂU NHÀ (thân có viền + bóng đổ riêng) ============================ */
/* ---- Nhà nọc ngựa (ngói âm dương, vách ván bạc, hiên rộng 4 cột, bao lam, song tiện) · dùng cho Nọc ngựa 1–2 và Nhà Cụ Sắc ---- */
sprite("_h3_noc",{w:144,h:144,outline:"1"},(c)=>{
 const G={tl:30,tr:114,yt:14,rl:38,rr:106,yr:25,bl:6,br:138,yb:60};
 h3wallPlank(c,6,64,138,124,11,7);
 h3beam(c,2,142,60,4);h3baolam(c,6,138,64);
 for(const x of[10,44,96,128])h3post(c,x,64,124,4);
 h3door(c,64,90,16,34);h3sotien(c,22,84,16,16);h3sotien(c,104,84,16,16);
 h3brick(c,2,124,140,7,3);h3brick(c,54,131,36,4,5);
 lu(c,46,106,12,16);c.vline(88,90,5,"#6b3f27");nonTreo(c,88,98);
 h3roof(c,G,"til",5);h3ridgeTil(c,G)})
sprite("m_h_noc",{w:146,h:146},h3sh(10,136,128),stamp("_h3_noc",0,0))

/* ---- Nhà bát dần (mái bốn phía thoải, vách vôi, cửa chớp xanh, hiên cột tròn) ---- */
sprite("_h3_bat",{w:144,h:144,outline:"1"},(c)=>{
 const G={tl:46,tr:98,yt:14,rl:57,rr:87,yr:24,bl:6,br:138,yb:64};
 h3wallPla(c,8,68,136,124,3,7);
 h3beam(c,4,140,64,4);
 for(const x of[12,52,88,128])h3post(c,x,68,124,4);
 h3chop(c,24,88,20,16);h3chop(c,98,88,20,16);h3door(c,62,92,20,32);
 h3brick(c,4,124,136,7,7);h3brick(c,56,131,32,4,8);
 lu(c,108,106,12,16);c.vline(46,94,5,"#6b3f27");nonTreo(c,46,102);
 h3roof(c,G,"til",15);h3ridgeTil(c,G)})
sprite("m_h_bat",{w:146,h:146},h3sh(10,134,128),stamp("_h3_bat",0,0))

/* ---- Nhà chữ đinh: nhà chính (trái) + nhà ngang (phải) lòi ra trước, đầu hồi hướng nam lát ván đứng ---- */
sprite("_h3_dinh",{w:144,h:144,outline:"1"},(c)=>{
 const GM={tl:16,tr:90,yt:18,rl:26,rr:80,yr:28,bl:2,br:98,yb:62};
 h3wallPlank(c,4,66,96,122,21,7);h3beam(c,0,98,62,4);h3baolam(c,4,94,66);
 for(const x of[4,36,60,90])h3post(c,x,66,122,4);
 h3door(c,38,92,16,30);h3sotien(c,14,86,14,14);h3sotien(c,64,86,14,14);
 h3brick(c,0,122,98,6,3);
 lu(c,66,104,12,16);nonTreo(c,28,100);
 h3roof(c,GM,"til",21);h3ridgeTil(c,GM);
 /* nhà ngang: mái chạy dọc bắc–nam (hông nhỏ phía sau), hai mái dốc trái sáng/phải tối, mặt trước là đầu hồi tam giác lát ván đứng */
 const wx0=96,wx1=140,rx=118,yb2=68,ya=52,yp=28,yc=40;
 const wing=(x,y)=>{const left=x<rx,d=left?x-wx0:wx1-1-x,span=rx-wx0;if(y<(left?yp+Math.round((yc-yp)*(1-d/span)):yp+Math.round((yc-yp)*(1-d/span))))return null;
  const bot=yb2-Math.round((yb2-ya)*(d/span));return y<bot?{left,d,y}:null}
 for(let y=yp;y<yb2;y++)for(let x=wx0;x<wx1;x++){const w=wing(x,y);if(!w)continue;const p=(((y-yp)%6)+6)%6,q=(((w.d)%5)+5)%5;let i=w.left?4:2;if(p==0)i+=1;else if(p>=3)i-=1;if(q==4)i-=2;else if(q==0&&p==0)i+=1;c.px(x,y,h3c(H3.til,i))}
 c.vline(rx,yp,ya-yp,H3.til[5]);c.vline(rx+1,yp,ya-yp,H3.til[1]);
 for(let x=wx0;x<rx;x++){const d=x-wx0;c.px(x,yb2-Math.round((yb2-ya)*(d/(rx-wx0)))-1,H3.til[5])}for(let x=rx;x<wx1;x++){const d=wx1-1-x;c.px(x,yb2-Math.round((yb2-ya)*(d/(rx-wx0)))-1,H3.til[1])}
 c.poly([rx,ya,wx0,yb2,wx1,yb2],H3.woo[3]);for(let x=wx0;x<wx1;x++){const d=x<rx?x-wx0:wx1-1-x,yt2=yb2-Math.round((yb2-ya)*(d/(rx-wx0)));for(let y=yt2+1;y<yb2;y++)c.px(x,y,h3c(x<wx0+10?H3.sil:H3.woo,(((x-wx0)>>1)%2?3:2)+(x<rx?1:0)))}
 c.circ(rx,62,3,H3.dk);c.ring(rx,62,3,H3.woo[4]);
 h3wallPlank(c,wx0+1,yb2,wx1-1,128,23,6);h3beam(c,wx0-2,wx1+2,yb2-1,3);
 h3post(c,94,yb2+2,128,4);h3post(c,136,yb2+2,128,4);h3sotien(c,104,90,14,14);h3door(c,124,98,10,30);
 h3brick(c,wx0-4,128,wx1-wx0+8,6,5)})
sprite("m_h_dinh",{w:146,h:146},h3sh(8,138,132),stamp("_h3_dinh",0,0))

/* ---- Nhà mái lá chằm + vách lá đan, hiên thấp, nền đất · Ông Cả Nhị Ngưu ---- */
sprite("_h3_la",{w:144,h:144,outline:"1"},(c)=>{
 const G={tl:40,tr:104,yt:14,rl:48,rr:96,yr:26,bl:14,br:130,yb:62};
 h3wallLea(c,20,66,124,124,4,7);
 for(const x of[16,122]){h3post(c,x,66,124,4,H3.bam)}
 c.rect(62,92,20,32,H3.dk);for(let x=62;x<82;x+=2)c.vline(x,92,11,x%4?H3.lea[3]:H3.lea[1]);c.hline(62,103,20,H3.bam[2]);c.rect(60,90,24,3,H3.bam[2]);c.hline(60,90,24,H3.bam[4]);
 c.rect(32,92,14,13,H3.dk);c.rect(29,90,20,3,H3.lea[2]);c.hline(29,90,20,H3.lea[4]);
 c.vline(94,86,14,"#6b3f27");for(let i=0;i<4;i++){c.rect(92,88+i*3,4,2,"#c4574a");c.px(92,88+i*3,"#e0705c")}
 nonTreo(c,110,100);lu(c,102,106,12,16);
 c.rect(54,124,36,4,"#a8835a");c.hline(54,124,36,"#c19b6e");c.rect(60,128,24,3,"#9a7552");
 h3roof(c,G,"tha",9);h3ridgeTha(c,G);h3fringe(c,G.bl+2,G.br-2,G.yb)})
sprite("m_h_la",{w:146,h:146},h3sh(18,128,128),stamp("_h3_la",0,0))

/* ---- Nhà mái lá + vách ván, chái nhỏ bên trái, vá tôn · Ông Năm Giáo ---- */
sprite("_h3_la2",{w:144,h:144,outline:"1"},(c)=>{
 const G={tl:62,tr:126,yt:14,rl:70,rr:118,yr:26,bl:44,br:140,yb:62};
 h3wallPlank(c,48,66,138,122,17,7);
 for(let x=102;x<128;x+=3){c.vline(x,86,28,x%6?"#a7b0b6":"#8a959c");c.vline(x+1,86,28,"#c6ced2")}c.rect(100,86,28,2,"#6a747a");c.rect(100,112,28,2,"#4e585e");
 /* chái trái: mái lá thấp hơn, vách ván */
 h3wallPlank(c,6,96,50,124,19,5);
 const GC={tl:12,tr:44,yt:56,rl:17,rr:39,yr:63,bl:2,br:54,yb:94};h3roof(c,GC,"tha",19);h3ridgeTha(c,GC);h3fringe(c,GC.bl+1,GC.br-1,GC.yb);
 h3post(c,46,66,124,5);h3post(c,134,66,124,5);h3post(c,2,96,124,4);
 c.rect(62,92,18,32,H3.dk);c.rect(60,90,22,3,H3.woo[4]);c.rect(64,94,6,30,H3.woo[2]);c.rect(72,94,6,30,H3.woo[3]);h3sotien(c,86,90,10,10);
 nonTreo(c,18,110);lu(c,90,106,12,16);
 c.rect(52,124,40,4,"#a8835a");c.hline(52,124,40,"#c19b6e");
 h3roof(c,G,"tha",17);h3ridgeTha(c,G);h3fringe(c,G.bl+2,G.br-2,G.yb)})
sprite("m_h_la2",{w:146,h:146},h3sh(10,140,128),stamp("_h3_la2",0,0))

/* ---- Nhà sàn trên cọc (mùa nước nổi): cọc tre, sàn ván, thang, mái lá · Nhà trên cọc 1–2 ---- */
sprite("_h3_coc",{w:192,h:144,outline:"1"},(c)=>{
 const G={tl:46,tr:148,yt:8,rl:58,rr:136,yr:20,bl:22,br:170,yb:46};
 for(const x of[30,62,94,126,150,164]){c.rect(x,100,6,28,H3.lea[3]);c.vline(x,100,28,H3.lea[5]);c.vline(x+5,100,28,H3.lea[1]);for(const y of[108,120])c.hline(x-1,y,8,H3.lea[1]);
  c.rect(x,120,6,8,H3.mos[1]);c.vline(x,120,8,H3.mos[2]);c.vline(x+5,120,8,H3.mos[0]);c.rect(x-1,126,8,6,"#4a3a2a");c.hline(x-1,126,8,"#6a5440");c.hline(x-1,131,8,"#2e2018")}
 c.rect(24,92,146,8,H3.woo[4]);c.hline(24,92,146,H3.woo[6]);c.hline(24,99,146,H3.woo[1]);for(let x=28;x<168;x+=9)c.vline(x,93,6,H3.woo[2]);
 h3wallPlank(c,44,50,150,92,29,7);h3beam(c,40,154,46,3);
 for(const x of[44,148])h3post(c,x,50,92,4);
 h3door(c,88,62,16,30);h3sotien(c,56,64,14,12);h3sotien(c,124,64,14,12);
 for(let x=24;x<=60;x+=12)c.rect(x,76,3,16,H3.woo[3]);c.rect(22,74,42,3,H3.woo[4]);c.hline(22,74,42,H3.woo[6]);
 c.rect(8,90,4,42,H3.lea[3]);c.rect(18,90,4,42,H3.lea[3]);for(let y=98;y<128;y+=8)c.rect(8,y,14,3,H3.woo[4]);c.vline(8,90,42,H3.lea[5]);c.vline(21,90,42,H3.lea[1]);
 lu(c,128,76,12,16);nonTreo(c,108,76);
 h3roof(c,G,"tha",23);h3ridgeTha(c,G);h3fringe(c,G.bl+2,G.br-2,G.yb)})
sprite("m_h_coc",{w:194,h:146},poly([28,128,176,128,186,138,38,138],"#2a1f1459"),stamp("_h3_coc",0,0))

/* ====================== v17 · ĐƯỜNG LÁT GẠCH — bộ ô m_br* (16×16, tileable, dual-grid 15 mảnh) ======================
   Một bộ gạch duy nhất: gạch đỏ cam 8×4 (mạch vữa 1 px ở phải + dưới), xếp so le nửa viên, 3 sắc độ theo bảng tuần hoàn 2×4 viên.
   Mẫu gạch là hàm tuần hoàn 16 px → mọi mảnh dùng chung một pha, ghép liền không thấy mối.
   Dual-grid: mảnh m_br_<mask> đặt tại ĐỈNH lưới (lệch nửa ô); mask = NW·1 + NE·2 + SW·4 + SE·8 (bit = ô quanh đỉnh là gạch).
   m_br_15 = ruột; m_br_15c1/c2 = ruột có viên sứt (chỉ dùng hiếm: h%12==0 / h%12==6). Góc lồi bo 3 px, góc lõm lấp 3 px;
   mép gạch có viền tối 1 px, bóng đổ dưới-phải một lớp alpha 35%. KHÔNG rắc nhiễu: vết sứt chỉ ở góc viên gạch, nơi bốn mạch vữa gặp nhau. */
const BR3={t:["#b9573a","#c4623b","#d4713f"],hi:["#cf7142","#d9794a","#e8904f"],mo:"#6b4742",lip:"#4a2230",sh:"#2a1f1459"}
const BTONE=[[0,2],[1,0],[2,1],[1,2]]
function brBase(x,y){const r=(y>>2)&3,f=y&3,xs=(x+((r&1)?4:0))&15,xo=xs&7,tn=BTONE[r][xs>>3];
 if(f==3||xo==7)return BR3.mo;return f==0?BR3.hi[tn]:BR3.t[tn]}
function brShape(m){const q=(x,y)=>(m>>((y>=8?2:0)+(x>=8?1:0)))&1,S=[];
 for(let y=0;y<16;y++){S[y]=[];for(let x=0;x<16;x++){const qx=x>=8?1:0,qy=y>=8?1:0,u=qx?x-8:7-x,v=qy?y-8:7-y;let on=q(x,y)==1;
  const hn=q(qx?0:8,y),vn=q(x,qy?0:8);
  if(on&&!hn&&!vn&&u+v<=1)on=false;                     /* góc lồi bo 3 px */
  if(!on&&hn&&vn&&u+v<=1)on=true;                       /* góc lõm lấp 3 px */
  S[y][x]=on}}return S}
function brPiece(m,chips){return(c)=>{const S=brShape(m),ins=(x,y)=>x>=0&&y>=0&&x<16&&y<16&&S[y][x];
 for(let y=0;y<16;y++)for(let x=0;x<16;x++){
  if(S[y][x]){const lip=!(x==0||x==15||y==0||y==15)&&([[1,0],[-1,0],[0,1],[0,-1]].some(([a,b])=>{const X=x+a,Y=y+b;return X>=0&&Y>=0&&X<16&&Y<16&&!S[Y][X]}));
   c.px(x,y,lip?BR3.lip:brBase(x,y))}
  else if(ins(x-1,y)||ins(x,y-1)||ins(x-1,y-1))c.px(x,y,BR3.sh)}
 for(const[cx,cy]of chips||[]){c.px(cx,cy,BR3.mo);c.px(cx+1,cy,BR3.mo);c.px(cx,cy+1,BR3.lip)}}}
for(let m=1;m<=15;m++)sprite("m_br_"+(m<10?"0":"")+m,{w:16,h:16},brPiece(m))
sprite("m_br_15c1",{w:16,h:16},brPiece(15,[[3,2]]))
sprite("m_br_15c2",{w:16,h:16},brPiece(15,[[10,10]]))



/* ============ SÂN & VẬT DỤNG NHÀ QUÊ (vật trang trí; vẽ ×2 trong game) ============ */
/* sân đất nện trước nhà: hình bầu dục méo, tâm sáng (đất khô), vành sẫm, mép cỏ lấn; sỏi + vệt gà bới + lối trắng ra cửa; đặt dưới mặt đất (decal) */
const sanDat=(seed,flip)=>(c)=>{const r=c.rng(seed);const W=80,H=56;
 for(let y=0;y<H;y++)for(let x=0;x<W;x++){const nx=(x-40)/38,ny=(y-26)/23,wob=Math.sin(x*.31+seed)*.07+Math.sin(y*.43+seed*2)*.08,d=nx*nx+ny*ny+wob;
  if(d>1.12)continue;const edge=d>.86;
  let col=d<.35?"#c9a074":d<.62?"#b9905f":"#a77f55";
  if((x*7+y*13+seed)%11==0)col=d<.5?"#d4ae84":"#946e48";
  if(d>1.02)col="#7a8f4c88";else if(edge)col=(x+y)%2?"#a77f55":"#8f6c47cc";
  c.px(x,y,col)}
 for(let i=0;i<16;i++){const x=10+rnd(r,60),y=8+rnd(r,40),nx=(x-40)/38,ny=(y-26)/23;if(nx*nx+ny*ny<.85){c.px(x,y,"#e4d2b0");c.px(x+1,y,"#c2a87f");c.px(x,y+1,"#7a5c40")}}
 for(let i=0;i<5;i++){const x=16+rnd(r,40),y=14+rnd(r,26);c.line(x,y,x+3,y+1,"#8f6c47");c.line(x+1,y+2,x+4,y+2,"#8f6c47")}
 for(let y=36;y<54;y++){const w=3+((y-36)>>2);for(let x=40-w;x<40+w;x++)if((x*3+y)%5)c.px(x,y,"#d8b88a")}}
sprite("m_san0",{w:80,h:56},sanDat(7));sprite("m_san1",{w:80,h:56},sanDat(19))
/* hàng rào dâm bụt: bụi xanh thấp, hoa đỏ năm cánh */
sprite("m_dambut",{w:26,h:16,outline:"J"},(c)=>{const r=c.rng(3);
 for(const[x,y,rx,ry]of[[6,10,6,5],[13,8,7,6],[20,10,6,5]]){c.ellipse(x,y,rx,ry,"#2f6a3a");c.ellipse(x-1,y-1,rx-1,ry-1,"#4f8f46");c.ellipse(x-2,y-2,Math.max(1,rx-3),Math.max(1,ry-3),"#78b556")}
 for(let i=0;i<7;i++){const x=4+rnd(r,19),y=4+rnd(r,9);c.px(x,y,"#d9483b");c.px(x+1,y,"#e8705c");c.px(x,y+1,"#a93028");c.px(x-1,y,"#e8705c")}c.rect(3,14,20,1,"#3a2418")})
/* giàn bầu: hai cột tre, xà ngang, dây leo, trái bầu thòng */
sprite("m_gian",{w:42,h:38,outline:"J"},(c)=>{const r=c.rng(5);
 for(const x of[4,34]){c.rect(x,6,3,32,"#8a9a3a");c.vline(x,6,32,"#b5c65a");c.vline(x+2,6,32,"#4f5e22");for(const y of[16,28])c.hline(x-1,y,5,"#4f5e22")}
 c.rect(2,4,38,3,"#9c6340");c.hline(2,4,38,"#dba468");
 for(let i=0;i<26;i++){const x=4+rnd(r,34),y=4+rnd(r,8);c.line(x,y,x+rnd(r,3)-1,y+2+rnd(r,4),"#4f8f46");if(i%4==0){c.ellipse(x,y+1,2,1,"#78b556")}}
 for(const[x,l]of[[11,13],[20,16],[28,12]]){c.vline(x,7,3,"#4f8f46");c.ellipse(x,10+l*.5+3,3,l*.5,"#b9d68a");c.ellipse(x,10+l*.5+1,2,Math.max(2,l*.3),"#d4e8a8");c.px(x-1,10+l*.5,"#eef6cc")}})
/* đống rơm: vòm vàng, sợi rơm chéo, dây buộc, chóp ngọn */
sprite("m_rom",{w:34,h:30,outline:"J"},(c)=>{const r=c.rng(9);
 c.ellipse(17,22,15,7,"#c9a05a");c.poly([17,2,32,22,2,22],"#d9b868");c.poly([17,2,2,22,10,22],"#ecd48a");c.poly([17,2,32,22,24,22],"#b58a42");
 for(let i=0;i<34;i++){const x=4+rnd(r,26),y=8+rnd(r,15);c.line(x,y,x+3,y-2,i%3?"#a98536":"#f0dc9a")}
 c.hline(5,17,24,"#8a6a2a");c.rect(15,0,4,5,"#e6cf82");c.px(16,0,"#f0dc9a")})
/* xuồng ba lá kéo lên bờ: thân gỗ cong hai đầu, mạn sơn xanh, mái chèo */
sprite("m_xuong",{w:46,h:16,outline:"J"},(c)=>{
 c.poly([1,5,44,5,40,11,6,11],"#7a4a31");c.poly([1,5,44,5,43,7,2,7],"#b27a4b");c.rect(2,5,42,2,"#2f6b97");c.hline(2,5,42,"#7bbdd2");c.hline(6,11,34,"#4a2a1c");
 for(let x=10;x<40;x+=6)c.vline(x,7,4,"#573629");c.poly([1,5,0,2,4,5],"#9c6340");c.poly([44,5,45,3,41,5],"#9c6340");
 c.line(14,4,34,0,"#dba468",1);c.poly([33,0,38,-1,38,2],"#9c6340")})


/* ============ CÔNG TRÌNH PHỤ KIỂU QUÊ (thay các khối giữ chỗ xanh/hồng/đen) ============ */
/* chòi nghỉ mát mái lá: sàn ván nâng, cột tre, băng ghế tre, đèn lồng đỏ (72x72) */
sprite("m_h_bl",{w:72,h:72,outline:"J"},(c)=>{
 bong(c,36,68,60,3);
 c.rect(8,56,56,6,WD.d);c.hline(8,56,56,WD.f);c.hline(8,61,56,WD.a);for(let x=12;x<62;x+=8)c.vline(x,57,4,WD.b);
 for(const x of[22,46]){c.rect(x,26,3,30,"#9aa24a");c.vline(x,26,30,"#c4cc6a")}                                  /* cột sau */
 c.rect(18,44,36,3,WD.c);c.hline(18,44,36,WD.e);c.rect(20,47,3,9,WD.b);c.rect(49,47,3,9,WD.b);                    /* băng ghế tre */
 la(c,22,50,6,66,6,30,31);nocLa(c,20,52,3);
 for(const x of[10,58]){c.rect(x,28,4,30,"#8a9a3a");c.vline(x,28,30,"#b5c65a");c.vline(x+3,28,30,"#4f5e22");for(const y of[40,52])c.hline(x-1,y,6,"#4f5e22");c.rect(x-1,54,6,3,"#8a8aa0")}
 c.line(36,30,36,34,"#6b3f27");c.circ(36,38,4,"#c4574a");c.circ(36,38,2,"#f0a05a");c.hline(33,34,7,"#e3b04b");c.hline(33,42,7,"#e3b04b");nonTreo(c,18,34)})
/* quầy lưu niệm: mái chằm nhỏ, quầy tre đan, hàng nón lá + giỏ + gốm bày bán, tấm bảng đỏ (72x72) */
sprite("m_h_pk",{w:72,h:72,outline:"J"},(c)=>{
 bong(c,36,68,62,3);
 la(c,20,52,4,68,8,30,33);nocLa(c,18,54,5);
 for(const x of[8,60]){c.rect(x,28,4,36,"#8a9a3a");c.vline(x,28,36,"#b5c65a");c.vline(x+3,28,36,"#4f5e22")}
 c.rect(8,48,56,18,"#a98c52");for(let x=8;x<64;x+=3)c.vline(x,48,18,(x/3|0)%2?"#bfa266":"#97793f");c.rect(6,44,60,5,WD.d);c.hline(6,44,60,WD.f);c.hline(6,48,60,WD.a);
 for(let i=0;i<5;i++){const x=16+i*8;nonTreo(c,x,34)}                                                              /* nón lá treo hàng */
 for(let i=0;i<3;i++){c.poly([14+i*5,44,26+i*5,44,24+i*5,39],"#e6cf82");c.hline(14+i*5,44,12,"#8a6a2a")}
 c.ellipse(46,42,6,3,"#c9a05a");c.ellipse(46,40,6,3,"#e6cf82");lu(c,54,35,8,10);c.ellipse(36,42,5,2,"#8a4a2a");
 c.rect(22,50,28,8,"#c4574a");c.hline(22,50,28,"#e8705c");for(let x=26;x<48;x+=6)c.rect(x,53,3,2,"#f0c94a")})
/* nhà vệ sinh: khối gạch trát vôi, mái ngói thấp, hai cửa gỗ có ký hiệu nam/nữ (54x54) */
sprite("m_h_bk",{w:54,h:54,outline:"J"},(c)=>{
 bong(c,27,51,46,3);
 voi(c,6,26,42,24,3);c.rect(6,26,42,5,"#1d1b3a40");
 ngoi(c,12,42,2,52,6,28,35);nocNgoi(c,10,44,3);c.rect(1,28,52,3,WD.a);c.hline(1,28,52,WD.b);
 for(const[x,col]of[[11,"#3f6a98"],[32,"#c4574a"]]){c.rect(x-1,33,12,17,WD.d);c.rect(x,34,10,16,"#6c4a34");for(let xx=x;xx<x+10;xx+=3)c.vline(xx,34,16,"#7e5a40");c.circ(x+5,38,2,col);c.px(x+8,43,"#e3b04b")}
 c.rect(44,40,6,10,"#6aa8c8");c.hline(44,40,6,"#a8d4e8");c.rect(44,50,6,2,"#4a7a96")})
/* quán cà phê vườn: nhà gỗ nhỏ mái ngói, mái hiên bạt, hai bộ bàn ghế mây, bảng ly cà phê (54x54) */
sprite("m_h_cf",{w:54,h:54,outline:"J"},(c)=>{
 bong(c,27,51,46,3);
 van(c,8,26,38,22,41);c.rect(8,26,38,5,"#1d1b3a44");ngoi(c,13,41,3,51,6,26,43);nocNgoi(c,11,43,3);
 c.rect(4,26,46,3,WD.a);cot(c,5,28,48,3);cot(c,46,28,48,3);
 cua(c,22,34,10,14);sotien(c,10,35,8,8);sotien(c,36,35,8,8);
 c.poly([6,30,48,30,52,36,2,36],"#c4574a");for(let x=4;x<50;x+=6)c.poly([x,30,x+3,30,x+3,36,x,36],"#f0e8d0");
 c.ellipse(10,46,4,2,"#bf8250");c.rect(9,46,2,4,WD.b);c.ellipse(44,46,4,2,"#bf8250");c.rect(43,46,2,4,WD.b);c.circ(26,30,0,"#fff");
 c.rect(24,20,6,5,"#f0e8d0");c.rect(30,21,2,3,"#f0e8d0");c.hline(25,19,4,"#d9d9e8")})
/* quán ẩm thực mái lá rộng: bàn ghế gỗ, bếp củi bốc khói, kệ giỏ, nồi (144x120) */
sprite("m_h_bg",{w:144,h:120,outline:"J"},(c)=>{
 bong(c,72,114,128,5);
 c.rect(10,56,124,50,"#2a1f1a");c.grad(10,56,124,24,"ab","v",.5);
 la(c,22,122,4,140,8,56,37);nocLa(c,20,124,4);
 for(const x of[6,66,132]){c.rect(x,56,5,50,"#8a9a3a");c.vline(x,56,50,"#b5c65a");c.vline(x+4,56,50,"#4f5e22");for(const y of[70,88])c.hline(x-1,y,7,"#4f5e22");c.rect(x-1,102,7,4,"#8a8aa0")}
 /* bếp củi + nồi + khói */
 c.rect(14,78,32,26,"#8a5836");c.rect(14,78,32,4,"#b27a4b");c.rect(20,90,20,14,"#2a1a16");c.rect(23,96,14,8,"#e0502d");c.rect(26,98,8,6,"#ffd66b");c.ellipse(30,76,11,5,"#58506e");c.ellipse(30,74,9,3,"#8a8dab");c.ellipse(30,73,7,2,"#e8e0c8");
 for(let i=0;i<5;i++){c.circ(28+Math.sin(i)*3,66-i*3,2,"#dfe0ee99")}
 /* kệ giỏ tre + bàn ghế */
 c.rect(52,62,12,3,WD.d);c.rect(52,76,12,3,WD.d);for(let i=0;i<3;i++){c.ellipse(55+i*3,60,4,2,"#c9a05a");c.ellipse(56+i*3,74,4,2,"#e6cf82")}
 for(const[x,y]of[[78,88],[108,88]]){c.rect(x,y,26,4,WD.d);c.hline(x,y,26,WD.f);c.rect(x+2,y+4,3,12,WD.b);c.rect(x+21,y+4,3,12,WD.b);c.ellipse(x+13,y-2,5,2,"#efe3c8");c.ellipse(x+13,y-4,3,2,"#c4574a");
  for(const sx of[x-8,x+30]){c.rect(sx,y+6,8,3,WD.c);c.rect(sx+1,y+9,2,7,WD.b);c.rect(sx+5,y+9,2,7,WD.b)}}
 c.rect(70,56,68,12,"#c4574a");c.hline(70,56,68,"#e8705c");for(let x=74;x<136;x+=8)c.rect(x,59,4,5,"#f0c94a");
 c.circ(18,58,4,"#c4574a");c.circ(18,58,2,"#f0a05a");c.circ(126,58,4,"#c4574a");c.circ(126,58,2,"#f0a05a");nonTreo(c,56,72)})

sprite("_fm",{w:2,h:2},"mN\nNm")
sprite("m_bush",{w:24,h:18},layer("sh",...shd(14,16,10,2)),layer("b",(c)=>{foliage(c,{seed:5,cx:12,cy:9,rx:11,ry:7,flat:.7,rmin:3,rmax:5,tones:LF.bang});
 [[7,10],[14,8],[16,12],[5,8],[10,6]].forEach(([x,y],i)=>{c.px(x,y,i%2?"#e8482e":"#f2693a");c.px(x+1,y,"#ff9a5a")});rough(c,9,.2,.15)}))
/* thảm hoa: cuống xanh, cánh nhiều lớp */
for(const [n,a,b] of [["pink","#f27fb4","#ffd0e4"],["yellow","#f2b52c","#fff1a8"],["white","#f4efe4","#ffffff"]])sprite("m_fl_"+n,{w:14,h:9},(c)=>{[[2,6],[6,4],[10,6],[4,7],[8,7]].forEach(([x,y],i)=>{c.px(x,y+1,"#336c3a");c.px(x-1,y+1,"#4f8f46");c.px(x,y,i%2?b:a);c.px(x-1,y,i%2?a:b);c.px(x+1,y,a);c.px(x,y-1,b);c.px(x+1,y-1,"#4f8f46")})})
/* lau lách: thân mảnh, lá dài xòe quanh gốc, bông trắng bạc phía trên */
sprite("m_lau",{w:18,h:30},(c)=>{const r=c.rng(2);
 [[4,28,6],[8,29,3],[13,28,8],[6,29,11]].forEach(([x,b,t],i)=>{c.vline(x,t,b-t,i%2?"#c9b06c":"#b79a5a");
  for(let k=0;k<5;k++){const y=t-1-k;c.px(x+(k%2?1:0),y,k<2?"#efe6c8":"#d9cfae")}c.px(x+1,t+1,"#f6f0dc");c.px(x-1,t+2,"#e8dcb4")})
 for(let i=0;i<7;i++){const x0=3+rnd(r,12),ang=-1.9+i*.45;for(let k=0;k<12;k++){c.px(Math.round(x0+Math.cos(ang)*k*.8),Math.round(29-k*.9+Math.abs(Math.cos(ang))*k*.4),k>9?"#8fc06a":i%2?"#4f8f46":"#6aa551")}}})
/* sen: lá tròn xẻ khuyết, gân tỏa, mép tối, viền sáng; hoa nhiều lớp cánh hồng nhạt dần ra đầu cánh */
sprite("m_pad0",{w:14,h:8},ellipse(7,4,6,3,"#2f6a3a"),ellipse(7,3,5,2,"#438a4a"),hline(3,3,5,"#6aa551"),px(9,3,"_"),px(10,3,"_"),px(10,4,"_"),hline(2,4,2,"#2f6a3a"),px(5,5,"#1f4a2c"),px(4,3,"#8fc06a"))
sprite("m_pad1",{w:12,h:7},ellipse(6,3,5,3,"#2f6a3a"),ellipse(6,3,4,2,"#438a4a"),px(2,3,"_"),px(2,2,"_"),hline(4,2,4,"#6aa551"),px(8,5,"#1f4a2c"),px(5,2,"#8fc06a"))
sprite("m_lotus",{w:18,h:16},ellipse(9,12,7,3,"#2f6a3a"),ellipse(9,11,6,2,"#438a4a"),hline(5,11,6,"#6aa551"),px(13,12,"_"),px(14,12,"_"),vline(9,8,4,"#336c3a"),
 poly([5,8, 6,4, 8,7, 9,2, 10,7, 12,4, 13,8, 9,10],"#f6bfd0"),poly([7,8, 9,3, 11,8],"#fff0f4"),px(9,2,"#fff0f4"),hline(6,8,6,"#e57fa0"),px(5,8,"#e57fa0"),px(13,8,"#e57fa0"),hline(8,7,3,"#ffcf7a"),px(9,6,"#f6c966"))
sprite("m_lotus2",{base:"m_lotus",swap:{p:"Q",A:"p",P:"q"}})

const shadow=(cx,cy,rx,ry)=>ellipse(cx,cy,rx,ry,"S")
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
