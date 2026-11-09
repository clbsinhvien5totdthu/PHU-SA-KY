/* Phù Sa Ký – CỔNG KHU DI TÍCH NGUYỄN SINH SẮC (vẽ lại theo ảnh thực, nắng chiều muộn). 640x360, xuất theo lớp:
   sky · trees (hậu cảnh: sân, nhà mái cam, cột đèn, hàng cây hai bên) · gate (cổng, hàng rào, bồn cây, bậc thềm) · ground · people · fore.
   Toạ độ & vị trí bảng đỏ giữ nguyên để cutscene vẽ chữ lên đúng chỗ (R/Y đổi từ toạ độ ảnh gốc 600x419).
   Dựng: node <pxl>/bin/pxl.js build assets/art/gate.px.js --out assets/art/out && node tools/build_img.js */
pal({
 /* trời: xanh nhạt -> ráng vàng đào */
 n:"#5f9bd6",m:"#86b6e2",l:"#b5d3ec",k:"#e8e6d6",p:"#ffe3b0",r:"#ffc48a",W:"#fffbe8",u:"#ffe4cc",y:"#f4c4a0",w:"#cfd9e8",
 /* mái ngói, tường kem, bảng */
 z:"#e0642e",Z:"#a8421f",H:"#ff9a56",q:"#efdcae",Q:"#bda57c",X:"#8a7556",x:"#fff3d0",j:"#8a1f24",J:"#f0c44e",
 /* sắt, đá */
 i:"#b9c4d0",I:"#68768a",e:"#8d8f95",E:"#55586a",F:"#2f323f",
 /* cây xanh */
 T:"#1c3a22",t:"#2c6a38",G:"#4f9a46",g:"#8cc25a",h:"#d4e88a",o:"#f4d878",v:"#3f9a4a",V:"#236b34",
 /* thân cây, hậu cảnh mờ */
 d:"#4a3020",D:"#7a5a3a",s:"#5a4028",U:"#4e7a68",S:"#6f9a86",R:"#9cc0a6",
 /* sân lát, nhựa đường, đèn */
 P:"#b3a58e",N:"#8e8270",a:"#6e6760",b:"#57524d",c:"#827a70",O:"#ffd98c",
 /* hậu cảnh: tường đào, bóng tường, ô cửa tối, nhà xa mờ, cửa sổ xa, gạch lề, nhựa đường, bó vỉa, ghế đỏ */
 f:"#e9c8a0","1":"#c9a07c","2":"#2a2a30","3":"#d86a3a","4":"#d9d2c0","5":"#7d8aa0","6":"#a0604a","7":"#5b5f66","8":"#8a8e96",
 /* người */
 B:"#3b6ab0",C:"#1f2a48",A:"#3a2418",L:"#a8743c",M:"#e8d9c0",K:"#4a5a7a",Y:"#8a6a3a"
})
ramps("nmlkpr","XQqx","ZzH","FEei","TtGgh","VvG","bac")
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
const trunk=(c,r,x,yb,yt,w,lean,d)=>{const xt=x+lean;for(let y=yb;y>yt;y-=2){const k=(yb-y)/(yb-yt),xx=Math.round(x+(xt-x)*k),ww=Math.max(2,Math.round(w*(1-k*.55)));c.rect(xx-(ww>>1),y-2,ww,3,"d");c.px(xx+d*(ww>>1),y-1,"D")}
 for(let i=0;i<24;i++){const y=yt+Math.floor(r()*(yb-yt)),k=(yb-y)/(yb-yt),xx=Math.round(x+(xt-x)*k);c.px(xx+Math.floor(r()*3)-1,y,r()<.5?"D":"s")}}
const blob=(c,x,y,r,d)=>{c.circ(x,y+1,r,"V");c.circ(x,y,r,"v");c.circ(x+d*Math.round(r*.3),y-Math.round(r*.25),Math.max(2,Math.round(r*.62)),"G");if(r>5)c.circ(x+d*Math.round(r*.4),y-Math.round(r*.4),Math.round(r*.28),"g")}

/* người nhìn từ phía sau, ngược sáng: đầu, thân, ba lô, chân; viền sáng ở đỉnh và mép trái */
const back=(c,x,fy,h,o)=>{const u=h/26;
 c.rect(x-4*u,fy-8*u,3*u,8*u,o.pants);c.rect(x+1*u,fy-8*u,3*u,8*u,o.pants);c.rect(x-5*u,fy-1.5*u,4*u,1.5*u,"F");c.rect(x,fy-1.5*u,4*u,1.5*u,"F");
 if(o.skirt)c.poly([x-5*u,fy-14*u,x+5*u,fy-14*u,x+7*u,fy-4*u,x-7*u,fy-4*u],o.skirt);
 c.poly([x-4.6*u,fy-20*u,x+4.6*u,fy-20*u,x+5*u,fy-8*u,x-5*u,fy-8*u],o.top);
 c.rect(x-7*u,fy-19*u,2.4*u,9*u,o.top);c.rect(x+4.6*u,fy-19*u,2.4*u,9*u,o.top);
 if(o.bag)c.rect(x-4*u,fy-19*u,8*u,9*u,o.bag);if(o.sling)c.line(x-4*u,fy-20*u,x+4*u,fy-10*u,o.sling,Math.max(1,u*.8));
 c.rect(x-1.2*u,fy-22*u,2.4*u,2.4*u,o.skin);
 c.circ(x,fy-24.5*u,3.3*u,o.hair);if(o.long)c.rect(x-3.3*u,fy-24*u,6.6*u,8*u,o.hair);if(o.spike)for(let i=-2;i<=2;i++)c.px(x+i*u*1.2,fy-28.2*u,o.hair)}

/* ===== CÂY: vẽ theo cấu trúc thật =====
   gốc loe + rễ nổi  ->  thân thon dần, vân vỏ chạy dọc theo chiều mọc  ->  chạc chính  ->  cành chẻ đôi/ba, mỗi cấp mảnh và ngắn đi
   ->  tán KHÔNG rải đều mà gom thành từng CỤM ở đầu cành; mỗi cụm có 3 tông: tối (đáy/bóng), giữa, sáng (mặt hướng nắng, nửa trên),
   vài mảng sáng nhất ở mép trên phía nắng, đáy cụm đổ bóng, mép lởm chởm bằng các chùm lá nhỏ. d = hướng nắng (+1 nắng từ bên phải). */
const limb=(c,r,x,y,ang,len,w,depth,d,tips)=>{
 const x2=x+Math.cos(ang)*len,y2=y+Math.sin(ang)*len,wi=Math.max(1,Math.round(w));
 c.line(Math.round(x),Math.round(y),Math.round(x2),Math.round(y2),"d",wi);
 if(wi>=3)c.line(Math.round(x+d),Math.round(y),Math.round(x2+d),Math.round(y2),"D",1);
 if(depth<=1)tips.push([(x+x2)/2,(y+y2)/2,len*.8]);
 if(depth<=0){tips.push([x2,y2,len]);return}
 const cl=(a)=>Math.max(-3.0,Math.min(-.14,a)),n=depth>1?3:2;
 limb(c,r,x2,y2,cl(ang+(r()-.5)*.5),len*.78,w*.78,depth-1,d,tips);              /* ngọn tiếp tục mọc */
 for(let i=0;i<n-1;i++)limb(c,r,x2-(x2-x)*.25,y2-(y2-y)*.25,cl(ang+(i?1:-1)*(.55+r()*.5)),len*(.55+r()*.2),w*.62,depth-1,d,tips)}  /* cành bên rẽ ra từ giữa đốt */
const clump=(c,r,cx,cy,R,d,cols)=>{
 const bl=[];const n=7+Math.floor(R/4);
 for(let i=0;i<n;i++){const a=r()*6.283,m=Math.sqrt(r())*.62;bl.push([Math.round(cx+Math.cos(a)*m*R*1.15),Math.round(cy+Math.sin(a)*m*R*.8),Math.max(3,Math.round(R*(.34+r()*.2)))])}
 bl.push([cx,cy,Math.round(R*.55)]);
 bl.forEach(([x,y,q])=>c.circ(x,y+1,q+1,cols[0]));                                           /* khối tối: hình bóng cả cụm */
 bl.forEach(([x,y,q])=>c.circ(x,y,q,cols[1]));                                               /* tông giữa */
 bl.forEach(([x,y,q])=>{if(y<=cy+R*.1)c.circ(x+d*Math.ceil(q*.3),y-Math.ceil(q*.3),Math.max(2,Math.round(q*.66)),cols[2])});  /* mặt sáng hướng nắng, chỉ nửa trên */
 bl.forEach(([x,y,q])=>{if(y>cy+R*.15)c.circ(x-d,y+Math.ceil(q*.45),Math.max(2,Math.round(q*.5)),cols[0])});                 /* đáy cụm đổ bóng */
 bl.forEach(([x,y,q])=>{if(y<=cy&&r()<.55){c.circ(x+d*Math.ceil(q*.5),y-Math.ceil(q*.5),Math.max(1,Math.round(q*.3)),"h");if(r()<.5)c.px(x+d*Math.ceil(q*.7),y-Math.ceil(q*.7),"o")}});  /* mảng nắng gắt */
 for(let i=0;i<8;i++){const a=-3.1+r()*3.1,dd=R*(.95+r()*.2),x=Math.round(cx+Math.cos(a)*dd*1.1),y=Math.round(cy+Math.sin(a)*dd*.8);c.circ(x,y,2,cols[1]);c.px(x+d,y-1,cols[2]);if(r()<.3)c.px(x,y+2,cols[1])}}   /* chùm lá lởm chởm ở mép */
const tree=(c,r,x,yb,h,lean,d,cols,k=1)=>{
 const w0=Math.max(6,Math.round(h*.034)),yf=Math.round(yb-h*.42),xf=Math.round(x+lean);
 /* thân: thon dần, hơi uốn, vân vỏ dọc */
 for(let y=yb;y>yf;y--){const t=(yb-y)/(yb-yf),xx=Math.round(x+(xf-x)*t+Math.sin(t*3.1)*1.6),ww=Math.max(3,Math.round(w0*(1-t*.5)+(t<.1?(1-t*10)*w0*.45:0)));
  c.hline(xx-(ww>>1),y,ww,"d");c.px(xx-(ww>>1),y,d>0?"s":"D");c.px(xx+(ww>>1)-(ww%2?0:1),y,d>0?"D":"s")}
 for(let i=0;i<Math.round(h*.16);i++){const t=r()*.85,y=Math.round(yb-t*(yb-yf)),xx=Math.round(x+(xf-x)*t),len=3+Math.floor(r()*6);c.vline(xx+Math.floor((r()-.5)*w0*.8),y-len,len,"s")}
 c.line(x-w0,yb,x-(w0>>1),yb-9,"d",2);c.line(x+w0,yb,x+(w0>>1),yb-9,"d",2);c.px(x+d*(w0>>1),yb-6,"D");  /* rễ nổi */
 /* chạc chính + cành */
 const tips=[],nm=4+Math.floor(r()*2),L=h*.19*k;
 for(let i=0;i<nm;i++)limb(c,r,xf,yf,-1.57+(i-(nm-1)/2)*.5+(r()-.5)*.2,L*(.8+r()*.4),w0*.8,2,d,tips);
 /* tán: một khối lớn lấp chỗ trống giữa các cành + cụm ở đầu từng cành, vẽ từ sau ra trước (cụm thấp trước) */
 const top=Math.min(...tips.map(t=>t[1])),mid=(tips.reduce((a,t)=>a+t[0],0))/tips.length;
 const my=tips.reduce((a,t)=>a+t[1],0)/tips.length;
 clump(c,r,Math.round(mid),Math.round(my+h*.03),Math.round(h*.17*k),d,cols);
 clump(c,r,Math.round(mid-d*h*.08),Math.round(my+h*.1),Math.round(h*.11*k),d,cols);
 tips.sort((a,b)=>b[1]-a[1]).forEach(([tx,ty,ln])=>clump(c,r,Math.round(tx),Math.round(ty),Math.round(h*(.065+r()*.035)*k+8),d,cols))}

scene("gate",{w:640,h:360,layers:true},
 layer("sky",grad(0,0,640,250,"nnnmmmmllllkkkpppprr","v",.8),
  (c)=>{const r=c.rng(41);for(let i=0;i<13;i++){const cy=18+Math.floor(r()*120),k=cy/140,cx=Math.floor(r()*700)-30,rx=30+Math.floor(r()*100),ry=4+Math.floor(r()*6);
    c.ellipse(cx,cy+2,rx,ry,k>.6?"y":"w");c.ellipse(cx+Math.floor(rx*.1),cy,Math.floor(rx*.85),Math.max(2,ry-1),k>.6?"u":"W");
    c.ellipse(cx-Math.floor(rx*.3),cy-ry+1,Math.floor(rx*.45),Math.max(2,ry-2),"W");c.hline(cx-Math.floor(rx*.5),cy+ry-1,Math.floor(rx),k>.5?"y":"w")}},
  light([300,222,90],1,.55),light([300,222,48],1,.7)),
 layer("trees",
  /* ===== HẬU CẢNH SAU CỔNG – theo ảnh thực: đường nhựa vòng quanh đảo cây, hội trường một tầng mái cam, nhà trắng xa, nhà mái cam bên trái, cột đèn ===== */
  (c)=>{const r=c.rng(23);for(let i=0;i<40;i++)leafy(c,r,196+Math.floor(r()*290),232+Math.floor(r()*14),14+Math.floor(r()*10),7+Math.floor(r()*5),14,r()<.5?1:-1,["U","S","R"])},   /* dải cây xa mờ sau các toà nhà */
  rect(0,252,640,44,"7"),grad(0,252,640,12,"k877","v",.7),
  (c)=>{/* lề gạch đỏ (mạch so le) + bó vỉa sáng, hai bên đảo cây */
    [[232,290],[344,408]].forEach(([x0,x1])=>{c.rect(x0,260,x1-x0,8,"6");c.hline(x0,260,x1-x0,"8");c.hline(x0,264,x1-x0,"1");for(let y=261;y<268;y+=4)for(let x=x0+((y/4|0)%2)*3;x<x1;x+=6)c.vline(x,y,4,"1")});},
  /* nhà trắng nhiều tầng ở xa bên trái (mờ trong khói chiều) + nhà nhỏ mái cam */
  rect(236,222,62,28,"4"),hline(236,222,62,"W"),hline(236,223,62,"k"),
  (c)=>{for(let y=227;y<248;y+=7)for(let x=240;x<294;x+=7){c.rect(x,y,4,3,"5");c.hline(x,y+3,4,"k")}},
  dither(236,222,62,28,".","k",.3),
  rect(284,246,20,6,"f"),poly([281,246,288,239,300,239,307,246],"z"),hline(288,239,12,"H"),hline(282,245,24,"Z"),rect(290,247,3,5,"2"),
  /* cây mảnh, tán thưa, giữa nhà xa và hội trường */
  (c)=>{const r=c.rng(19);[[262,252,200],[292,252,206]].forEach(([x,yb,yt])=>{c.line(x,yb,x+2,yt,"d",2);c.line(x+1,yt+14,x-8,yt+4,"d",1);c.line(x+1,yt+20,x+10,yt+10,"d",1);
     [[x-8,yt+2,9],[x+10,yt+8,8],[x+2,yt-2,10]].forEach(([cx,cy,R])=>clump(c,r,cx,cy,R,1,["U","S","R"]))})},
  /* HỘI TRƯỜNG: mái chóp cam thấp, diềm kem, tường đào có trụ bám, cửa chính có mái đua, hàng cửa sổ tối, ghế đỏ phía trước */
  (c)=>{const hx=304,hw=68;
    c.poly([hx-3,241,hx+12,231,hx+hw-12,231,hx+hw+3,241],"z");
    for(let y=232;y<241;y+=2){const xl=Math.round(hx+12-(y-231)*1.5),xr=Math.round(hx+hw-12+(y-231)*1.5);c.hline(xl,y,xr-xl,"Z");for(let x=xl+((y/2|0)%2)*3;x<xr;x+=6)c.px(x,y-1,"H")}
    c.hline(hx+12,231,hw-24,"H");c.line(hx+12,231,hx-3,241,"H");c.line(hx+hw-12,231,hx+hw+3,241,"Z");
    c.poly([hx+40,232,hx+46,228,hx+52,232],"q");c.hline(hx+41,231,10,"Q");           /* ô thoáng mái */
    c.rect(hx-3,241,hw+6,2,"q");c.hline(hx-3,243,hw+6,"X");
    c.rect(hx,243,hw,12,"f");c.rect(hx,244,hw,2,"1");
    [2,17,33,48,64].forEach(x=>{c.rect(hx+x,243,2,12,"q");c.vline(hx+x+1,243,12,"Q")});
    c.rect(hx+4,247,11,6,"1");c.rect(hx+19,247,12,6,"1");c.rect(hx+50,247,12,6,"f");          /* ô tường lõm */
    c.rect(hx+27,246,6,9,"2");c.poly([hx+25,246,hx+30,242,hx+35,246],"q");c.hline(hx+26,246,8,"Q");c.vline(hx+26,246,9,"q");c.vline(hx+33,246,9,"q");   /* cửa chính + mái đua */
    for(let i=0;i<6;i++){c.rect(hx+37+i*4,247,2,4,"2");c.px(hx+37+i*4,247,"5")}               /* hàng cửa sổ */
    c.rect(hx,254,hw,2,"N");c.hline(hx,254,hw,"c");
    for(let i=0;i<6;i++){c.rect(hx+hw-19+i*3,252,2,3,"3");c.px(hx+hw-19+i*3,252,"H")}         /* ghế đỏ */
    c.rect(hx+20,253,48,3,"V");c.hline(hx+20,253,48,"v")},
  /* cụm thân cau/cây cao mảnh bên phải hội trường */
  (c)=>{const r=c.rng(44);[350,353,357,361].forEach((x,i)=>{c.vline(x,198+i*3,56-i*3,"d");c.vline(x+1,198+i*3,56-i*3,"s")});clump(c,r,355,198,9,-1,["T","t","G"]);clump(c,r,346,206,6,-1,["U","S","R"])},
  /* cột đèn ba chao chính (cột đen, chao cầu trắng ngà) + cột đèn thấp phía sau + cột đèn đơn bên trái cổng */
  (c)=>{const globe=(x,y,r)=>{c.circ(x,y,r,"O");c.circ(x,y,r-1,"q");c.circ(x,y-1,Math.max(1,r-2),"W")};
    c.vline(311,226,30,"F");globe(311,226,2);globe(306,229,2);
    c.vline(317,216,40,"F");c.vline(318,216,40,"I");c.line(317,222,309,220,"F");c.line(318,222,326,220,"F");globe(317,213,3);globe(309,219,2);globe(326,219,2);globe(317,223,2)},
  vline(186,224,24,"F"),circ(186,221,3,"O"),circ(186,221,2,"q"),px(185,220,"W"),px(186,219,"W"),
  /* ĐẢO CÂY: bó vỉa đá, bụi cây cắt tỉa nhiều tầng, chân cột đèn */
  rect(288,263,58,5,"e"),hline(288,263,58,"i"),hline(288,267,58,"E"),
  (c)=>{const r=c.rng(5);for(let i=0;i<22;i++)blob(c,291+Math.floor(r()*52),260+Math.floor(r()*4),3+Math.floor(r()*3),i%2?1:-1);c.rect(313,258,7,6,"F");c.rect(315,260,3,2,"5")},
  /* nhà mái cam bên trái cổng, thấy qua hàng rào: mái dốc, mép ngói cuốn, tường đào, cửa chớp xanh */
  poly([108,236,124,214,160,214,174,236],"z"),(c)=>{for(let y=216;y<236;y+=3){const t=(y-214)/22,xl=Math.round(124-t*16),xr=Math.round(160+t*14);c.hline(xl,y,xr-xl,"Z");for(let x=xl+((y/3|0)%2)*3;x<xr;x+=6)c.px(x,y-1,"H")}
    c.line(124,214,108,236,"H");for(let x=108;x<176;x+=4)c.px(x,236,"Z");},
  rect(114,237,52,18,"f"),rect(114,237,52,3,"1"),(c)=>{for(let x=118;x<164;x+=11){c.rect(x,242,7,10,"5");c.vline(x+3,242,10,"4")}},
  /* hàng cây cao hai bên: lớp sau nhỏ và tối (sau mái cổng), lớp trước lớn và sáng; chừa khoảng trời trên mái cổng */
  (c)=>{const r=c.rng(31);
    const DK=["T","t","G"],LT=["t","G","g"];
    [[150,268,210,-6,1,DK],[490,268,210,6,-1,DK]].forEach(([x,yb,h,l,d,cl])=>tree(c,r,x,yb,h,l,d,cl,.9));
    [[24,276,320,-14,1,LT],[596,276,320,14,-1,LT],[108,276,280,10,1,LT],[522,276,280,-10,-1,LT]].forEach(([x,yb,h,l,d,cl])=>tree(c,r,x,yb,h,l,d,cl,1))},
  vline(492,176,80,"I"),vline(493,176,80,"i"),line(493,176,486,170,"i",1),line(486,170,478,171,"i",1),rect(474,171,6,3,"i"),
  /* nắng chiều ngả vàng lên mép tán cây phía cổng */
  light([200,150,90],1,.35),light([440,150,90],1,.35)),
 layer("gate",(c)=>{
  const R=GX,Y=GY;
  /* --- bồn cây đá: khối đá lớn mạch so le, bụi cây xanh cắt tỉa --- */
  [[0,R(58)],[R(540),640]].forEach(([x0,x1])=>{c.rect(x0,Y(298),x1-x0,Y(350)-Y(298),"e");c.hline(x0,Y(298),x1-x0,"i");c.hline(x0,Y(298)+1,x1-x0,"i");
   for(let y=Y(298)+7;y<Y(350);y+=9){c.hline(x0,y,x1-x0,"E");for(let x=x0+((y/9|0)%2)*10;x<x1;x+=20)c.vline(x,y-9,9,"E")}
   const rr=c.rng(x0+3);for(let i=0;i<30;i++)blob(c,x0+Math.floor(rr()*(x1-x0)),Y(292)+Math.floor(rr()*6)-3,4+Math.floor(rr()*4),(i%2)?1:-1);
   c.noise(x0,Y(274),x1-x0,Y(298)-Y(274),"v",.12,3,"V")});
  /* --- hàng rào: trụ kem, song sắt đầu mũi vàng --- */
  [[0,R(106)],[R(494),640]].forEach(([x0,x1])=>{const yT=Y(274),yB=Y(298);c.hline(x0,yT+4,x1-x0,"I");c.hline(x0,yB-5,x1-x0,"I");c.hline(x0,yT+5,x1-x0,"i");
   for(let x=x0;x<x1;x+=5){c.vline(x,yT+2,yB-yT-2,"i");c.px(x,yT,"J");c.px(x,yT+1,"J");c.px(x-1,yT+2,"J");c.px(x+1,yT+2,"J")}
   for(let x=x0+2;x<x1;x+=40){c.rect(x-2,yT,5,yB-yT+1,"q");c.vline(x+2,yT,yB-yT+1,"Q");c.rect(x-3,yT-2,7,3,"Q")}});
  /* --- hai cánh cổng sắt xanh xám, viền và hoa văn vàng, huy hiệu vàng giữa cánh dưới --- */
  [[125,182],[418,478]].forEach(([a,b])=>{const x0=R(a),x1=R(b),yT=Y(262),yB=Y(330),w=x1-x0,mx=(x0+x1)>>1;
   c.rect(x0,yT,w,yB-yT,"I");c.box(x0,yT,w,yB-yT,"E");c.vline(mx,yT,yB-yT,"E");
   for(let x=x0+3;x<x1-2;x+=3)c.vline(x,yT+10,Y(296)-yT-10,"i");
   for(let x=x0+2;x<x1-1;x+=4){c.px(x,yT+7,"J");c.px(x,yT+8,"J");c.px(x-1,yT+9,"J");c.px(x+1,yT+9,"J")}
   c.hline(x0,yT+10,w,"J");c.rect(x0,Y(296),w,3,"J");c.rect(x0+2,Y(298)+4,w-4,yB-Y(298)-8,"i");
   [x0+(w>>2),x1-(w>>2)].forEach(cx=>{c.ring(cx,Y(312),4,"J");c.px(cx,Y(312),"J");c.circ(cx,Y(312),1,"J")});c.line(x0+2,yB-5,x1-2,yB-5,"J");c.vline(x0+1,yT,yB-yT,"x")});
  c.poly([R(205),Y(262),R(222),Y(256),R(222),Y(330),R(205),Y(330)],"I");c.poly([R(205),Y(262),R(210),Y(260),R(210),Y(330),R(205),Y(330)],"E");
  c.poly([R(374),Y(256),R(390),Y(262),R(390),Y(330),R(374),Y(330)],"I");c.poly([R(385),Y(260),R(390),Y(262),R(390),Y(330),R(385),Y(330)],"E");
  /* --- trụ sau --- */
  [[130,10],[385,9],[464,10]].forEach(([cx,w])=>{const x0=R(cx-w/2),ww=Math.max(4,Math.round(w*.68));c.rect(x0,Y(206),ww,Y(330)-Y(206),"Q");c.vline(x0+ww-1,Y(206),Y(330)-Y(206),"X");c.vline(x0+1,Y(206),Y(330)-Y(206),"q")});
  /* --- tầng mái trên: tường kem, dải ô hoa, ngói, bờ nóc, đầu đao --- */
  c.rect(R(178),Y(82),R(422)-R(178),Y(114)-Y(82),"q");c.hline(R(178),Y(82),R(422)-R(178),"Q");c.hline(R(178),Y(82)+1,R(422)-R(178),"X");
  for(let i=0;i<11;i++)lattice(c,R(206)+Math.round(i*(R(378)-R(206))/10),Y(90));
  c.rect(R(178),Y(86),R(422)-R(178),2,"Q");c.rect(R(178),Y(104),R(422)-R(178),2,"Q");
  tiled(c,[R(190),Y(60),R(410),Y(60),R(421),Y(71),R(432),Y(82),R(168),Y(82),R(179),Y(71)],Y(60),Y(82));
  c.line(R(190),Y(60),R(168),Y(82),"x");c.line(R(410),Y(60),R(432),Y(82),"x");
  c.rect(R(184),Y(54),R(416)-R(184),4,"q");c.hline(R(184),Y(54),R(416)-R(184),"W");c.hline(R(184),Y(58),R(416)-R(184),"Q");
  for(let x=R(192);x<R(410);x+=9)c.rect(x,Y(54)-2,5,3,"x");
  curl(c,R(190),Y(54),-1);curl(c,R(410),Y(54),1);curl(c,R(214),Y(54),-1);curl(c,R(386),Y(54),1);
  /* --- tầng mái dưới: ngói, bờ nóc, mái cong hai đầu, đầu đao lớn --- */
  tiled(c,[R(130),Y(112),R(470),Y(112),R(546),Y(130),R(540),Y(148),R(60),Y(148),R(54),Y(130)],Y(112),Y(148));
  c.line(R(130),Y(112),R(54),Y(130),"x");c.line(R(470),Y(112),R(546),Y(130),"x");
  c.rect(R(124),Y(106),R(476)-R(124),5,"q");c.hline(R(124),Y(106),R(476)-R(124),"W");c.hline(R(124),Y(106)+4,R(476)-R(124),"Q");
  for(let x=R(132);x<R(470);x+=9)c.rect(x,Y(106)-2,5,3,"x");
  curl(c,R(56),Y(112),-1);curl(c,R(124),Y(106),-1);curl(c,R(476),Y(106),1);curl(c,R(544),Y(112),1);
  /* --- xà ngang, đấu củng, xà dưới, dải hoa văn --- */
  c.rect(R(78),Y(148)+3,R(522)-R(78),Y(154)-Y(148),"q");c.hline(R(78),Y(148)+3,R(522)-R(78),"X");
  c.rect(R(92),Y(154)+3,R(508)-R(92),Y(170)-Y(154)-3,"X");
  for(let x=R(100);x<R(500);x+=9){c.rect(x,Y(154)+4,5,5,"q");c.px(x+2,Y(154)+6,"Q")}
  [112,195,400,486].forEach(cx=>dou(c,R(cx),Y(154)+2,Y(172)));
  c.rect(R(88),Y(168)+4,R(512)-R(88),Y(178)-Y(168),"q");c.hline(R(88),Y(168)+4,R(512)-R(88),"x");c.hline(R(88),Y(178)+3,R(512)-R(88),"X");
  /* --- bảng đỏ viền vàng kép (chữ vẽ trong cutscene) --- */
  c.rect(R(210),Y(171),R(390)-R(210),Y(212)-Y(171),"j");c.box(R(210),Y(171),R(390)-R(210),Y(212)-Y(171),"J");c.box(R(210)+3,Y(171)+3,R(390)-R(210)-6,Y(212)-Y(171)-6,"J");
  /* --- bốn trụ tròn kem, chân đá --- */
  [[112,16],[195,20],[400,18],[486,16]].forEach(([cx,w])=>{const x0=R(cx-w/2),ww=Math.max(7,Math.round(w*.68)),yT=Y(182),yB=Y(324);
   c.rect(x0,yT,ww,yB-yT,"q");c.vline(x0+1,yT,yB-yT,"x");c.vline(x0+2,yT,yB-yT,"x");c.vline(x0+ww-1,yT,yB-yT,"X");c.vline(x0+ww-2,yT,yB-yT,"Q");c.vline(x0+ww-3,yT,yB-yT,"Q");
   c.rect(x0-2,Y(178),ww+4,3,"x");c.rect(x0-1,Y(178)+3,ww+2,2,"Q");c.rect(x0-2,yB-5,ww+4,2,"Q");c.rect(x0-3,yB-3,ww+6,3,"q");
   c.rect(x0-4,Y(322),ww+8,Y(336)-Y(322),"e");c.hline(x0-4,Y(322),ww+8,"i");c.hline(x0-4,Y(322)+1,ww+8,"i");c.vline(x0+ww+3,Y(322),Y(336)-Y(322),"E")});
  /* --- bậc thềm --- */
  c.rect(R(82),Y(318),R(106)-R(82),Y(336)-Y(318),"e");c.rect(R(494),Y(318),R(518)-R(494),Y(336)-Y(318),"e");
  c.hline(R(82),Y(318),R(106)-R(82),"i");c.hline(R(494),Y(318),R(518)-R(494),"i");c.vline(R(106)-1,Y(318),Y(336)-Y(318),"E");c.vline(R(494),Y(318),Y(336)-Y(318),"E");
  c.rect(R(85),Y(336),R(515)-R(85),Y(350)-Y(336),"E");for(let y=Y(336);y<Y(350);y+=3){c.hline(R(85),y,R(515)-R(85),"e");c.hline(R(85),y+1,R(515)-R(85),"F")}
  /* --- bóng mái đổ xuống xà và đầu cột (nắng chiều), mặt trụ phía mặt trời được sáng --- */
  c.shade([R(60),Y(148)+3,R(540)-R(60),7],1,.9);c.shade([R(92),Y(170),R(508)-R(92),6],1,.6);c.shade([R(178),Y(114),R(422)-R(178),5],1,.7)}),
 layer("ground",rect(0,294,640,66,"a"),grad(0,294,640,66,"aacaaabbb","v",.6),
  /* nhựa đường sần: chấm thưa vì vật liệu có hạt; vạch bó vỉa mờ */
  noise(0,296,640,64,"bc",.05,23),hline(0,296,640,"c"),hline(0,297,640,"N"),
  /* bóng bốn trụ và mái đổ dài về phía người xem */
  shade([196,294,222,294,232,356,206,356],1,1),shade([240,294,262,294,272,356,250,356],1,1),shade([376,294,398,294,408,356,386,356],1,1),shade([420,294,442,294,452,356,430,356],1,1),
  light([210,296,430,296,540,360,100,360],1,.3)),
 layer("people",(c)=>{
  back(c,204,298,52,{hair:"A",skin:"O",top:"B",pants:"C",bag:"Y"});
  back(c,226,296,54,{hair:"L",skin:"O",top:"M",pants:"K",skirt:"K",long:1});
  back(c,430,300,52,{hair:"d",skin:"O",top:"t",pants:"C",sling:"Y",spike:1});
  /* viền sáng ngược sáng: đỉnh đầu và mép trái, màu nắng chiều */
  for(let y=1;y<c.h;y++)for(let x=1;x<c.w;x++){if(!c.is(x,y,"*"))continue;if(!c.is(x,y-1,"*"))c.px(x,y,"p");else if(!c.is(x-1,y,"*"))c.px(x,y,"r")}}),
 layer("fore",(c)=>{const r=c.rng(12);for(let i=0;i<60;i++){const x=Math.floor(r()*660)-10,h=20+Math.floor(r()*52),l=(r()-.5)*16;c.line(x,368,x+Math.round(l),368-h,"T",2)}
  [[-8,356,24],[18,364,18],[648,356,24],[622,364,18]].forEach(([x,y,rr])=>{c.circ(x,y,rr,"T");c.circ(x,y-3,rr-4,"t")})}),
 glow("O",{where:[290,200,50,30],r:8,strength:.3,bands:3}))
