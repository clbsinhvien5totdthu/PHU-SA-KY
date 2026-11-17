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

/* ---- Nhà nọc ngựa (ngói âm dương, vách ván, hiên rộng, 3 gian) ---- */
sprite("m_h_noc",{w:144,h:144,outline:"J"},(c)=>{
 bong(c,72,134,126,5);
 van(c,14,74,116,44,11);c.rect(14,74,116,8,"#1d1b3a44");c.rect(14,82,116,3,"#1d1b3a22");
 ngoi(c,28,116,8,136,22,68,5);nocNgoi(c,26,118,18);
 c.rect(6,68,132,4,WD.a);c.hline(6,68,132,WD.b);for(let x=9;x<136;x+=6)c.rect(x,72,3,2,WD.b);
 c.rect(8,72,128,5,WD.d);c.hline(8,72,128,WD.f);c.hline(8,76,128,WD.b);for(let x=10;x<134;x+=6)c.poly([x,77,x+5,77,x+2,82],WD.c);       /* bao lam: diềm gỗ xẻ răng dưới xà */
 for(const x of[10,42,96,126])cot(c,x,77,118,4);
 cua(c,64,88,16,30);sotien(c,24,90,16,14);sotien(c,104,90,16,14);
 lu(c,46,102,12,16);nonTreo(c,96,96);c.line(96,88,96,92,"#6b3f27");
 them(c,10,118,124,6,3);them(c,54,124,36,5,4);c.hline(54,129,36,"#6e3a26")})
/* ---- Nhà bát dần (mái bốn phía thoải, vách vôi, cửa chớp xanh) ---- */
sprite("m_h_bat",{w:144,h:144,outline:"J"},(c)=>{
 bong(c,72,134,124,5);
 voi(c,16,78,112,40,3);c.rect(16,78,112,8,"#1d1b3a40");c.rect(16,86,112,3,"#1d1b3a20");
 ngoi(c,42,102,6,138,16,72,15);nocNgoi(c,40,104,12);
 c.poly([6,72,16,60,16,72],"#7f3e26");c.poly([138,72,128,60,128,72],"#7f3e26");
 c.rect(4,72,136,4,WD.a);c.hline(4,72,136,WD.b);for(let x=8;x<138;x+=6)c.rect(x,76,3,2,WD.b);
 cot(c,12,78,118,4);cot(c,128,78,118,4);cot(c,52,78,118,4);cot(c,88,78,118,4);
 chop(c,24,94,20,16);chop(c,100,94,20,16);cua(c,62,90,20,28);
 c.rect(60,84,24,4,WD.d);c.hline(60,84,24,WD.f);lu(c,112,104,12,14);nonTreo(c,48,100);
 them(c,8,118,128,6,7);them(c,56,124,32,5,8)})
/* ---- Nhà chữ đinh (nhà chính + nhà ngang: đầu hồi ngay trước mặt) ---- */
sprite("m_h_dinh",{w:144,h:144,outline:"J"},(c)=>{
 bong(c,70,134,128,5);
 van(c,6,78,84,40,21);c.rect(6,78,84,8,"#1d1b3a44");
 ngoi(c,20,78,4,94,30,70,21);nocNgoi(c,18,80,26);c.rect(2,70,94,4,WD.a);c.hline(2,70,94,WD.b);for(let x=5;x<94;x+=6)c.rect(x,74,3,2,WD.b);
 for(const x of[4,34,60,88])cot(c,x,78,118,4);cua(c,38,92,16,26);sotien(c,14,94,14,12);sotien(c,64,94,14,12);
 /* nhà ngang: tam giác đầu hồi lát ván đứng, bờ ngói hai bên, mái nghiêng phía phải */
 c.poly([94,70,138,70,116,34],"#7a5a40");for(let x=96;x<138;x+=4)c.vline(x,50+Math.abs(116-x)*0+(Math.abs(x-116)*.8|0),70-(50+(Math.abs(x-116)*.8|0)),(x/4|0)%2?"#8c6a4c":"#6f5039");
 c.poly([116,36,138,70,134,72,114,40],"#b05830");c.poly([116,36,94,70,98,72,118,40],"#cf7646");
 c.poly([116,36,134,30,144,62,138,70],"#8f4a2e");for(let y=40;y<66;y+=5)c.line(118+(y-40)*.6,y,140+(y-40)*.1,y+3,"#5a2a1e");
 c.circ(116,56,4,"#2a1f1a");c.circ(116,56,2,"#4a3a30");
 van(c,96,70,42,48,23);c.rect(96,70,42,8,"#1d1b3a44");cot(c,94,70,118,4);cot(c,136,70,118,4);sotien(c,104,86,16,16);cua(c,124,92,10,26);
 lu(c,66,102,12,16);nonTreo(c,28,100);
 them(c,4,118,134,6,5);them(c,36,124,22,5,6)})
/* ---- Nhà mái lá vách lá (chằm, lá dừa), hiên thấp, nền đất ---- */
sprite("m_h_la",{w:144,h:144,outline:"J"},(c)=>{
 bong(c,72,134,118,5);
 vachLa(c,22,80,100,38,4);c.rect(22,80,100,8,"#1d1b3a44");
 la(c,38,106,12,132,22,76,9);nocLa(c,36,108,17);
 for(const x of[18,122]){c.rect(x,78,5,40,"#8a9a3a");c.vline(x,78,40,"#b5c65a");c.vline(x+4,78,40,"#4f5e22");for(const y of[92,106])c.hline(x-1,y,7,"#4f5e22");c.rect(x-1,114,7,4,"#8a8aa0")}
 c.rect(62,90,20,28,"#241912");for(let x=62;x<82;x+=2)c.vline(x,90,12,x%4?"#bfa266":"#97793f");c.hline(62,102,20,"#6f8a3a");c.rect(60,88,24,3,"#6f8a3a");
 c.rect(32,92,14,12,"#241912");c.line(30,92,34,86,"#8a9a3a",2);c.rect(28,90,18,3,"#97793f");
 c.line(94,86,94,100,"#6b3f27");for(let i=0;i<4;i++){c.rect(92,88+i*3,4,2,"#c4574a");c.px(92,88+i*3,"#e0705c")}                                /* chùm ớt/bắp phơi */
 nonTreo(c,108,98);lu(c,104,104,12,16);c.rect(54,118,36,4,"#a8835a");c.hline(54,118,36,"#c19b6e");c.rect(60,122,24,3,"#9a7552")})
/* ---- Nhà mái lá + vách ván, chái nhỏ bên trái, vá tôn ---- */
sprite("m_h_la2",{w:144,h:144,outline:"J"},(c)=>{
 bong(c,76,134,124,5);
 van(c,34,78,98,40,17,["#8c7050","#7f6446","#967a5a","#86694c"]);c.rect(34,78,98,8,"#1d1b3a44");
 for(let x=102;x<128;x+=3){c.vline(x,92,22,x%6?"#a7b0b6":"#8a959c");c.vline(x+1,92,22,"#c6ced2")}c.rect(100,92,28,2,"#6a747a");c.rect(100,112,28,2,"#4e585e");     /* tấm tôn lượn sóng */
 van(c,6,92,38,26,19);c.rect(6,92,38,6,"#1d1b3a40");
 la(c,44,124,30,140,26,76,17);nocLa(c,42,126,21);
 la(c,6,40,2,52,58,94,19);c.rect(0,94,54,3,"#6e5222");
 cot(c,30,78,118,5);cot(c,132,78,118,5);cot(c,2,94,118,4);
 c.rect(62,92,18,26,"#2a1f1a");c.rect(60,90,22,3,WD.d);c.rect(64,94,6,24,"#7a5238");c.rect(72,94,6,24,"#8e6446");sotien(c,42,96,12,12);
 lu(c,84,102,12,16);nonTreo(c,16,108);c.rect(52,118,40,4,"#a8835a");c.hline(52,118,40,"#c19b6e")})
/* ---- Nhà sàn trên cọc (mùa nước nổi): cọc tre, sàn ván, thang, mái lá ---- */
sprite("m_h_coc",{w:192,h:144,outline:"J"},(c)=>{
 bong(c,100,136,150,5);
 c.rect(26,96,142,30,"#1d1b3a58");c.rect(26,96,142,6,"#1d1b3a40");
 for(const x of[30,60,90,120,150,164]){c.rect(x,92,6,40,"#8a6a3a");c.vline(x,92,40,"#c9a05a");c.vline(x+5,92,40,"#4a3418");for(const y of[104,118])c.hline(x-1,y,8,"#4a3418");c.rect(x-1,126,8,6,"#4a5a34");c.rect(x-1,128,8,4,"#3a2a1e")}
 c.rect(24,86,146,8,WD.d);c.hline(24,86,146,WD.f);c.hline(24,93,146,WD.a);for(let x=28;x<168;x+=9)c.vline(x,87,6,WD.b)
 van(c,40,48,114,38,29);c.rect(40,48,114,8,"#1d1b3a44");
 la(c,54,142,26,168,12,50,23);nocLa(c,52,144,7);
 cot(c,38,48,86,4);cot(c,152,48,86,4);cua(c,88,56,16,30);sotien(c,52,58,14,12);sotien(c,124,58,14,12);
 for(let x=24;x<=60;x+=12){c.rect(x,70,3,16,WD.c)}c.rect(22,68,42,3,WD.d);c.hline(22,68,42,WD.f);
 c.rect(8,84,4,48,"#8a6a3a");c.rect(18,84,4,48,"#8a6a3a");for(let y=92;y<128;y+=8)c.rect(8,y,14,3,"#a07c46");c.vline(8,84,48,"#c9a05a");c.vline(21,84,48,"#4a3418");
 lu(c,128,70,12,16);nonTreo(c,108,70)})


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
