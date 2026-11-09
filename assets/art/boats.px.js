/* Phù Sa Ký – cảnh chèo xuồng Bến Tre (vẽ lại bằng pxl). 640x360, 7 lớp: sky far water mid boats over fore.
   Ánh sáng: nắng sớm từ góc trên-phải, đường chân trời y=150, sông thu hẹp về phía cầu khỉ. */
pal({a:"#4d98cf",b:"#6cb2dc",c:"#8ecae3",d:"#b3dce4",e:"#d8ebd6",f:"#f2eec5",g:"#fbe7b0",
 W:"#ffffff",X:"#e6f0f3",C:"#bcd3e2",S:"#ecd0bb",Y:"#fff4c2",y:"#ffe28a",O:"#ffcf68",
 1:"#9ab8a6",2:"#82a893",3:"#6c9484",4:"#58806f",
 k:"#12302a",0:"#1b4733",5:"#2b6a3b",6:"#3e8a45",7:"#62a854",8:"#8cc863",9:"#c2e587",
 z:"#2e211c",Z:"#4b3527",B:"#6e4d33",D:"#98703f",t:"#c49a5a",u:"#e6c488",
 H:"#dfeac4",I:"#bcdac6",J:"#92c2b8",K:"#68a3a1",L:"#4b8685",M:"#386b72",N:"#2b5561",
 m:"#6a5642",n:"#8d7656",p:"#b49a5c",
 r:"#a63a30",R:"#dd6c4a",h:"#b8924c",j:"#8c6a34",w:"#e8d9b0",v:"#3f76ac",V:"#2b5584",q:"#dca848",
 E:"#c98a72",s:"#c0825a",F:"#8a4db0",P:"#c99be8",o:"#17271f"})
ramps("4321ef","k05678 9".replace(" ",""),"zZBDtu","NMLKJIH")

const BAY=[[0,8,2,10],[12,4,14,6],[3,11,1,9],[15,7,13,5]]
const bay=(x,y)=>BAY[y&3][x&3]/16
/* quầng sáng mặt trời: chuyển màu theo khoảng cách, rung điểm ảnh kiểu Bayer */
const halo=(c,cx,cy,R,cols)=>{for(let y=cy-R;y<=cy+R;y++)for(let x=cx-R;x<=cx+R;x++){const d=Math.hypot(x-cx,(y-cy)*1.1)/R;if(d>=1||x<0||y<0||x>=c.w||y>=c.h)continue
 const v=Math.pow(1-d,1.7)*cols.length+bay(x,y)-.5,i=Math.floor(v);if(i>=0)c.px(x,y,cols[Math.min(i,cols.length-1)])}}
/* mây ti tích: khối tròn + đáy phẳng, viền sáng trên, bóng ấm dưới */
const cloud=(seed,w,h)=>(c)=>{const r=c.rng(seed),n=Math.floor(w/13)
 for(let i=0;i<n;i++){const t=i/(n-1),rad=Math.round(h*(.22+.3*Math.sin(Math.PI*t))+r()*3);c.circ(Math.round(w*(.08+.84*t)),Math.round(h*.7-rad*.5),rad,"W")}
 c.rect(3,Math.round(h*.66),w-6,Math.round(h*.3),"W")
 const o=[];for(let y=0;y<c.h-1;y++)for(let x=0;x<c.w;x++){if(!c.is(x,y,"W"))continue
  if(!c.is(x,y+1,"W"))o.push([x,y,"S"]);else if(y>h*.5&&bay(x,y)<(y-h*.5)/(h*.5))o.push([x,y,"X"]);else if(y>h*.62&&!c.is(x,y+2,"W"))o.push([x,y,"C"])}
 o.forEach(([x,y,k])=>c.px(x,y,k))}
sprite("_cl1",{w:150,h:44},cloud(4,150,44)); sprite("_cl2",{w:96,h:30},cloud(9,96,30)); sprite("_cl3",{w:200,h:36},cloud(2,200,36)); sprite("_cl4",{w:60,h:20},cloud(7,60,20))

/* lá dừa nước / dừa: gân + lá chét rủ, mặt hướng nắng (phải-trên) sáng hơn */
const frond=(c,x0,y0,a,L,d,cl,r)=>{const n=Math.max(7,Math.round(L/3.2));let px=x0,py=y0
 for(let i=1;i<=n;i++){const t=i/n,x=x0+Math.cos(a)*L*t,y=y0+Math.sin(a)*L*t+d*L*t*t;c.line(Math.round(px),Math.round(py),Math.round(x),Math.round(y),cl[0],L>70&&t<.3?2:1)
  const ll=L*.2*(1-t*.72)+2.5,dx=x-px,dy=y-py,m=Math.hypot(dx,dy)||1,ux=-dy/m,uy=dx/m
  for(const s of[1,-1]){const sx=x+ux*s*ll+dx*.7,sy=y+uy*s*ll+ll*.5,lit=(ux*s-uy*s)>0
   c.line(Math.round(x),Math.round(y),Math.round(sx),Math.round(sy),lit?(r()<.4?cl[3]:cl[2]):(r()<.55?cl[1]:cl[2]))}
  px=x;py=y}}
/* bụi dừa nước mọc từ gốc: các tàu lá dựng đứng rồi uốn cong */
const nipa=(c,x,y,s,cl,seed,n=9)=>{const r=c.rng(seed);for(let i=0;i<n;i++){const a=-Math.PI/2+(r()-.5)*2.1,L=s*(46+r()*40);frond(c,x,y,a,L,(a>-Math.PI/2?1:-1)*.16+.14,cl,r)}
 c.ellipse(x,y+1,Math.round(7*s)+2,Math.round(2*s)+1,cl[0])}
const palm=(c,x,b,h,lean,s,cl,tr,seed)=>{const r=c.rng(seed);let px=x,py=b,tx=x,ty=b
 for(let i=1;i<=22;i++){const t=i/22;tx=x+lean*t*t+lean*.25*t;ty=b-h*t;const w=Math.max(1,Math.round(s*3.6*(1-t*.45)))
  c.line(Math.round(px),Math.round(py),Math.round(tx),Math.round(ty),tr[0],w);if(w>1)c.line(Math.round(px+w*.3),Math.round(py),Math.round(tx+w*.3),Math.round(ty),tr[1]);if(i%2==0&&s>.7)c.px(Math.round(tx-w*.4),Math.round(ty),tr[2]);px=tx;py=ty}
 ;[-2.95,-2.5,-2.05,-1.65,-1.25,-.85,-.4,.05,-1.9,-1.0].forEach((a,i)=>frond(c,tx,ty,a,s*(40+r()*14),.55,cl,r))
 if(s>.6){c.circ(Math.round(tx-1),Math.round(ty+3),Math.max(1,Math.round(s*2.2)),"B");c.circ(Math.round(tx+3),Math.round(ty+4),Math.max(1,Math.round(s*2)),"D")}}

sprite("_nha",{w:64,h:54},
 vline(8,30,24,"Z"),vline(22,30,24,"Z"),vline(42,30,24,"Z"),vline(56,30,24,"Z"),line(8,40,22,44,"B"),line(42,44,56,40,"B"),
 rect(4,28,56,3,"B"),hline(4,28,56,"t"),
 rect(9,14,46,14,"D"),(c)=>{for(let x=11;x<54;x+=4)c.vline(x,15,13,"B");c.hline(9,14,46,"t");c.rect(27,17,10,11,"z");c.rect(12,18,9,7,"z");c.hline(12,18,9,"r");c.rect(42,18,9,7,"z");c.vline(46,18,7,"Z")},
 poly([0,17,32,0,64,17,58,17,32,5,6,17],"h"),poly([5,17,32,4,59,17],"j"),(c)=>{for(let x=4;x<60;x+=3)c.line(x,16,32+(x-32)*.25,5,"h")},line(2,17,32,1,"u"),hline(2,17,60,"j"))
sprite("_chua",{w:44,h:34},
 rect(8,18,28,14,"w"),rect(8,18,28,2,"R"),(c)=>{for(const x of[10,16,22,28,34])c.vline(x,20,12,"r")},rect(19,22,6,10,"Z"),
 poly([0,19,22,8,44,19,40,20,22,12,4,20],"R"),poly([4,20,22,12,40,20],"r"),
 poly([8,10,22,0,36,10,32,11,22,4,12,11],"R"),poly([12,11,22,4,32,11],"r"),px(22,0,"q"),px(22,1,"q"),line(0,19,-2,16,"R"),line(44,19,46,16,"R"))
sprite("_nhaS",{w:30,h:26},vline(4,15,11,"Z"),vline(14,15,11,"Z"),vline(25,15,11,"Z"),rect(2,13,26,2,"B"),rect(4,7,22,6,"D"),rect(12,8,6,5,"z"),poly([0,8,15,0,30,8],"h"),poly([3,8,15,3,27,8],"j"))
sprite("_chuaS",{w:30,h:24},rect(5,12,20,10,"w"),rect(5,12,20,2,"R"),rect(13,15,4,7,"Z"),poly([0,13,15,5,30,13,27,14,15,8,3,14],"R"),poly([6,7,15,0,24,7,21,8,15,3,9,8],"R"),px(15,0,"q"))
/* ===== NGƯỜI & XUỒNG vẽ lại: một camera lỗ kim cho xuồng chèo (nhìn sau chếch xuống) + người nhìn nghiêng cho xuồng chợ ===== */
const RW_CX=74,RW_YH=-62,RW_CH=3.6,RW_F=500,RW_Z0=10            // tâm khung, đường chân trời, độ cao máy, tiêu cự, khoảng cách tới mũi gần
const rwP=(u,v,h)=>{const s=RW_F/(RW_Z0+v);return[RW_CX+u*s,RW_YH+(RW_CH-h)*s,s]}
const RW_L=5.6,RW_BEAM=.95
const rwHw=(t)=>.5*RW_BEAM*Math.pow(Math.sin(Math.PI*Math.pow(Math.min(1,Math.max(0,t)),.85)),.45)   // nửa bề ngang theo chiều dài
const rwSheer=(t)=>.30+.30*Math.pow(Math.abs(2*t-1),2.4)                                           // độ cao mạn so với mặt nước (hai đầu cong vút)
const rwT=(n)=>Array.from({length:n+1},(_,i)=>i/n)
const rwR=Math.round
const rwPoly=(c,pts,col)=>c.poly(pts.flatMap(([x,y])=>[rwR(x),rwR(y)]),col)
const rwLn=(c,a,b,col,w=1)=>c.line(rwR(a[0]),rwR(a[1]),rwR(b[0]),rwR(b[1]),col,w)
const rwMix=(a,b,t)=>a+(b-a)*t
const rwEase=(u)=>u*u*(3-2*u)

/* thân xuồng: gunwale (mạn) trái/phải, đường mớn nước, ván đáy */
const rwGun=(sg,t0,t1,n=22)=>rwT(n).map(i=>{const t=rwMix(t0,t1,i);return rwP(sg*rwHw(t)*1.08,t*RW_L,rwSheer(t))})
const rwWat=(sg,t0,t1,n=22)=>rwT(n).map(i=>{const t=rwMix(t0,t1,i);return rwP(sg*rwHw(t)*.86,t*RW_L,0)})
const rwFlo=(sg,t0,t1,n=22)=>rwT(n).map(i=>{const t=rwMix(t0,t1,i);return rwP(sg*rwHw(t)*.50,t*RW_L,.10)})

const rwHull=(c,o)=>{
 /* bóng và vệt nước dưới thân */
 const sh=[...rwWat(-1,0,1),...rwWat(1,0,1).reverse()].map(([x,y])=>[x+0,y+1])
 rwPoly(c,sh.map(([x,y])=>[x,y+2]),"N")
 /* vỏ ngoài phía gần (nhìn thấy từ sau): sơn xanh, mép mạn vàng */
 for(const sg of[-1,1]){const g=rwGun(sg,0,.46,14),w=rwWat(sg,0,.46,14);rwPoly(c,[...g,...w.reverse()],o.skin)
  /* ván be / ván đáy: đường nối ngang thân, tối bên khuất sáng */
  const mid=rwT(14).map(i=>{const t=rwMix(0,.46,i);const a=rwP(sg*rwHw(t)*1.08,t*RW_L,rwSheer(t)),b=rwP(sg*rwHw(t)*.86,t*RW_L,0);return[rwMix(a[0],b[0],.55),rwMix(a[1],b[1],.55)]})
  for(let i=0;i<mid.length-1;i++)rwLn(c,mid[i],mid[i+1],o.skinSh)
  for(let i=0;i<g.length-1;i++)rwLn(c,g[i],g[i+1],o.rim)}
 /* mũi lái nhọn gần camera: hai mạn gặp nhau */
 const tip=rwP(0,0,rwSheer(0)),tw=rwP(0,0,0);rwLn(c,tip,tw,o.skinSh,2)
 /* lòng xuồng: thành trong tối, ván đáy sáng hơn */
 const loop=[...rwGun(-1,0,1),...rwGun(1,0,1).reverse()]
 rwPoly(c,loop,"D")
 rwPoly(c,[...rwFlo(-1,.05,.98),...rwFlo(1,.05,.98).reverse()],"t")
 /* thành trong bên mạn: tối hơn phía khuất sáng */
 for(const sg of[-1,1]){const g=rwGun(sg,.04,.98),f=rwFlo(sg,.04,.98);rwPoly(c,[...g,...f.reverse()],sg>0===(o.light>0)?"B":"D")}
 rwPoly(c,[...rwFlo(-1,.05,.98),...rwFlo(1,.05,.98).reverse()],"t")
 /* ván đáy dọc: ba đường nối */
 for(const k of[-.33,0,.33]){const pts=rwT(22).map(i=>{const t=rwMix(.06,.97,i);return rwP(k*rwHw(t)*1.0,t*RW_L,.10)});for(let i=0;i<pts.length-1;i++)rwLn(c,pts[i],pts[i+1],"h")}
 /* cong (sườn xương cá): cứ 0,5 m một thanh ngang, vắt từ mạn này sang mạn kia */
 for(let v=.55;v<RW_L-.3;v+=.5){const t=v/RW_L,a=rwP(-rwHw(t)*1.04,v,rwSheer(t)-.04),b=rwP(-rwHw(t)*.5,v,.10),d=rwP(rwHw(t)*.5,v,.10),e=rwP(rwHw(t)*1.04,v,rwSheer(t)-.04)
  rwLn(c,a,b,"Z");rwLn(c,b,d,"j");rwLn(c,d,e,"Z")}
 /* viền mạn: vàng đồng, lớp sáng phía có nắng */
 for(const sg of[-1,1]){const g=rwGun(sg,0,1);for(let i=0;i<g.length-1;i++)rwLn(c,g[i],g[i+1],sg===o.light?"y":o.rim,1)}
 /* mũi xa */
 const bt=rwP(0,RW_L,rwSheer(1));c.px(rwR(bt[0]),rwR(bt[1]),"y")
}

/* ----- người chèo: bộ xương 3D -> chiếu -> thân/tay/chân vẽ bằng đoạn thẳng có bề dày (mét * px/mét) ----- */
const rwLimb=(c,a,b,wm,col,sh)=>{const s=(a[2]+b[2])/2;c.line(rwR(a[0]),rwR(a[1]),rwR(b[0]),rwR(b[1]),col,Math.max(1,rwR(wm*s)))}

const rwPerson=(c,o,p,ph)=>{
 const vr=.92,bob=.035*(1-p),lean=.14*p
 const dip=.07*p,hipH=.93-bob,shH=1.43-bob-dip
 const J={
  fL:rwP(-.14,vr-.05,.10),fR:rwP(.14,vr+.03,.10),
  hL:rwP(-.10,vr+.04*p,hipH),hR:rwP(.10,vr+.04*p,hipH),
  kL:rwP(-.15,vr+.09+.05*(1-p),.52),kR:rwP(.15,vr+.11+.05*(1-p),.52),
  sL:rwP(-.185,vr+.05+lean,shH),sR:rwP(.185,vr+.05+lean,shH),
  nk:rwP(0,vr+.06+lean,shH+.06)}
 /* chân: quần ống rộng tối, bàn chân trần trên ván */
 for(const sd of["L","R"]){const f=J["f"+sd],k=J["k"+sd],h=J["h"+sd]
  rwLimb(c,k,f,.14,"Z");rwLimb(c,h,k,.17,"z")
  c.rect(rwR(f[0]-3),rwR(f[1]-1),6,2,"s");c.px(rwR(f[0]-3),rwR(f[1]-1),"E")}
 /* thân: áo bà ba (ngược nắng nên nghiêng về tông tối), eo thắt, vạt áo xoè nhẹ */
 const mx=(J.sL[0]+J.sR[0])/2,sy=J.sL[1],hy=J.hL[1]+8
 rwPoly(c,[[J.sL[0]-1,sy],[J.sR[0]+1,sy],[J.hR[0]+3,hy],[J.hL[0]-3,hy]],o.top)
 rwPoly(c,o.light>0?[[mx,sy],[J.sL[0]-1,sy],[J.hL[0]-3,hy],[mx,hy]]:[[mx,sy],[J.sR[0]+1,sy],[J.hR[0]+3,hy],[mx,hy]],o.topShade)
 rwLn(c,[mx,sy+2],[mx,hy-1],o.topShade);c.hline(rwR(J.hL[0]-3),hy,rwR(J.hR[0]-J.hL[0]+7),o.topShade)
 /* gáy + búi tóc dưới vành nón */
 const nk=J.nk
 c.rect(rwR(nk[0]-2),rwR(nk[1]-3),5,4,"s");c.hline(rwR(nk[0]-2),rwR(nk[1]-3),5,"E")
 c.circ(rwR(nk[0]),rwR(nk[1]-6),4,"k");c.px(rwR(nk[0]+1),rwR(nk[1]-8),"o");c.px(rwR(nk[0]-2),rwR(nk[1]-5),"o")
 /* khăn rằn quanh cổ: ô vuông so le */
 for(let i=-4;i<=4;i++)for(let j=0;j<3;j++)c.px(rwR(nk[0]+i),rwR(nk[1]+j),(i+j)&1?"w":"m")
 /* tay: vai -> khuỷu -> cán chèo; mép tay áo tối để tách khỏi thân */
 for(const sg of[-1,1]){const sh=sg<0?J.sL:J.sR,hand=rwP(-sg*.10,o.vh,o.hh),el=rwP(sg*.28,vr+.15+lean,1.14-bob*.5)
  rwLimb(c,sh,el,.105,o.top);rwLimb(c,el,hand,.085,o.top)
  rwLn(c,[el[0]-sg*2,el[1]+2],[hand[0],hand[1]+1],o.topShade);c.circ(rwR(hand[0]),rwR(hand[1]),1,"s")}
 /* nón lá: vành tròn đáy, chóp nhọn, đường nan toả từ chóp */
 const hv=vr+.08+lean,hc=rwP(0,hv,1.66-dip),ap=rwP(0,hv,1.98-dip)
 const rx=rwR(.34*hc[2]),ry=Math.max(2,rwR(.11*hc[2]))
 c.ellipse(rwR(hc[0]),rwR(hc[1]+1),rx,ry,"j")
 rwPoly(c,[[hc[0]-rx,hc[1]],[ap[0],ap[1]],[hc[0]+rx,hc[1]]],"t")
 rwPoly(c,o.light>0?[[hc[0]+1,hc[1]],[ap[0],ap[1]],[hc[0]+rx,hc[1]]]:[[hc[0]-1,hc[1]],[ap[0],ap[1]],[hc[0]-rx,hc[1]]],"u")
 c.ellipse(rwR(hc[0]),rwR(hc[1]),rx,ry,"h");rwPoly(c,[[hc[0]-rx+1,hc[1]],[ap[0],ap[1]],[hc[0]+rx-1,hc[1]]],"t")
 rwPoly(c,o.light>0?[[hc[0]+1,hc[1]],[ap[0],ap[1]],[hc[0]+rx-1,hc[1]]]:[[hc[0]-1,hc[1]],[ap[0],ap[1]],[hc[0]-rx+1,hc[1]]],"u")
 for(let k=-3;k<=3;k++)rwLn(c,[hc[0]+k*(rx/3.4),hc[1]],[ap[0]+k*.15,ap[1]+4],"p")
 c.hline(rwR(hc[0]-rx+1),rwR(hc[1]+ry),2*rx-1,"j");c.px(rwR(ap[0]),rwR(ap[1]),"q")
 return J}

/* mái chèo: cán xỏ qua cọc chèo trên mạn; tay đẩy ra trước -> lưỡi quét ra sau trong nước, rồi nhấc lưỡi, đưa tay về */
const rwOars=(c,o,p,drive)=>{
 const vp=1.40,hp=.55
 for(const sg of[-1,1]){
  const t=vp/RW_L,piv=rwP(sg*(rwHw(t)*1.06),vp,hp)
  const hand=rwP(-sg*.10,o.vh,o.hh)
  const kk=1.3
  const bu=sg*rwHw(t)*1.06+(sg*rwHw(t)*1.06+sg*.10)*kk,bv=vp+(vp-o.vh)*kk,bh=drive?hp+(hp-o.hh)*kk:hp+(hp-o.hh)*kk+.30
  const bl=rwP(bu,bv,bh)
  /* cọc chèo */
  rwLn(c,rwP(sg*rwHw(t)*1.06,vp,rwSheer(t)-.02),piv,"Z",1);c.px(rwR(piv[0]),rwR(piv[1]-1),"B")
  /* cán */
  rwLn(c,hand,piv,"t",2);rwLn(c,piv,bl,"h",2)
  c.px(rwR(hand[0]),rwR(hand[1]-1),"u")
  /* lưỡi */
  const ax=bl[0]-piv[0],ay=bl[1]-piv[1],m=Math.hypot(ax,ay)||1,ux=ax/m,uy=ay/m,w=Math.max(2,rwR(.09*bl[2]))
  const e=[bl[0]+ux*rwR(.5*bl[2]),bl[1]+uy*rwR(.2*bl[2])]
  rwPoly(c,[[bl[0]-uy*w,bl[1]+ux*w],[bl[0]+uy*w,bl[1]-ux*w],[e[0]+uy*w,e[1]-ux*w],[e[0]-uy*w,e[1]+ux*w]],drive?"j":"t")
  rwLn(c,bl,e,drive?"B":"u",1)
  /* gợn nước quanh lưỡi chèo đang ăn nước */
  if(drive){const r1=rwR(3+p*5);c.hline(rwR(e[0]-r1),rwR(e[1]+2),r1*2,"K");c.hline(rwR(e[0]-r1+2),rwR(e[1]+3),r1*2-4,"I")}
  else c.px(rwR(e[0]),rwR(e[1]+4),"W")
 }}

const rwRim=(c,o)=>{const key="RruwcEshtpujq",lit=[]
 for(let y=1;y<c.h-1;y++)for(let x=1;x<c.w-1;x++){if(!c.is(x,y,key))continue
  if(c.is(x+o.light,y,"."))lit.push([x,y,"Y"]);else if(c.is(x,y-1,"."))lit.push([x,y,"y"])}
 lit.forEach(([x,y,k])=>c.px(x,y,k))}
const rwRowBody=(o0)=>(c)=>{
 const o=Object.assign({skin:'v',skinSh:'V',rim:'q'},o0)
 const ph=((c.frame-2+8)%8)/8,drive=ph<.5,u=drive?ph*2:(ph-.5)*2,e=rwEase(u),p=drive?e:1-e
 o.vh=.95+.60*p;o.hh=drive?1.02-.03*p:1.0+.10*Math.sin(Math.PI*u)
 rwHull(c,o)
 if(o.pre)o.pre(c)
 rwOars(c,o,p,drive)
 rwPerson(c,o,p,ph)
 /* vệt nước rẽ ở mũi gần */
 const tw=rwP(0,-.05,0);c.hline(rwR(tw[0]-9),rwR(tw[1]+2),18,"K");c.hline(rwR(tw[0]-6),rwR(tw[1]+3),12,"I");c.hline(rwR(tw[0]-13),rwR(tw[1]+1),5,"L");c.hline(rwR(tw[0]+9),rwR(tw[1]+1),5,"L")
 rwRim(c,o)
}
/* ===================== NGƯỜI NHÌN NGHIÊNG (Chợ nổi Ngã Năm) =====================
   sideFig: người quay mặt sang phải, chân đặt tại (x,y), f = hệ số tỉ lệ (1 ≈ 25 px cao gồm nón).
   Tỉ lệ: nón lá = 1/4 chiều cao (rất rộng), đầu ~ 1/6, thân áo bà ba dài tới đùi, quần ống rộng.
   Ánh sáng từ phải-sau (mặt trời thấp bên phải): mặt phải hơi sáng, mép vàng ở vai/nón. */
const sideFig=(c,x,y,f,o)=>{
 const m=(v)=>Math.round(v*f),W=(v)=>Math.max(1,Math.round(v*f))
 const lean=(o.lean||0),sit=o.sit?1:0
 const hipY=y-m(11-sit*5),shY=y-m(23-sit*4),hx=x+m(lean*.3),sx=x+m(lean)
 /* chân */
 if(!sit){c.line(hx-m(1),hipY,x-m(3),y,"z",W(3));c.line(hx+m(1),hipY,x+m(3),y,"Z",W(3));c.rect(x-m(4),y-1,W(3),Math.max(1,m(1.5)),"s");c.rect(x+m(2),y-1,W(3),Math.max(1,m(1.5)),"E")}
 else{c.line(hx,hipY,x+m(6),hipY+m(1),"Z",W(3.4));c.line(x+m(6),hipY+m(1),x+m(5),y,"z",W(3));c.rect(x+m(4),y-1,W(3),Math.max(1,m(1.4)),"s")}
 /* thân + vạt áo */
 const bw=m(4.6)
 c.poly([hx-bw,hipY+m(1),hx+bw,hipY+m(1),sx+m(3.4),shY,sx-m(3.4),shY].map(rwR),o.top)
 c.poly([hx-bw,hipY+m(1),hx-m(1),hipY+m(1),sx-m(1),shY,sx-m(3.4),shY].map(rwR),o.topShade)
 if(f>.8)c.hline(hx-bw,hipY+m(1),bw*2,o.topShade)
 /* cổ + khăn rằn + đầu nhìn nghiêng */
 const hdX=sx+m(1.2),hdY=shY-m(4.6)
 c.rect(sx-m(.8),shY-m(2.4),W(2.4),m(2.6),"s")
 if(f>.7)for(let i=0;i<3;i++)for(let j=0;j<2;j++)c.px(sx-m(2)+i,shY-m(1.4)+j,(i+j)&1?"w":"m")
 else c.hline(sx-m(2),shY-m(1),W(4),"w")
 c.circ(hdX,hdY,Math.max(1,m(2.8)),"s");c.px(hdX+m(2),hdY,"E");if(f>.9){c.px(hdX+m(1.2),hdY-m(.4),"z")}
 c.circ(hdX-m(1.6),hdY-m(.4),Math.max(1,m(2.3)),"k")                      /* tóc búi sau gáy */
 /* nón lá: chóp ở giữa, vành rộng, nghiêng nhẹ theo chiều đi */
 const bx=hdX-m(.5),by=hdY-m(1.8)
 c.poly([bx-m(9),by+m(1.4),bx+m(.8),by-m(6),bx+m(9.5),by+m(1.4)].map(rwR),"t")
 c.poly([bx+m(.8),by-m(6),bx+m(9.5),by+m(1.4),bx+m(1),by+m(1.4)].map(rwR),"u")
 c.hline(bx-m(9),by+m(1.4),m(19),"j")
 if(f>.9){c.line(hdX+m(1.2),by+m(2),hdX+m(1.5),hdY+m(1.8),"j")}
 /* tay + cán chèo / mái dầm */
 if(o.hand){const hx2=x+m(o.hand[0]),hy2=y-m(o.hand[1]);c.line(sx,shY+m(1.4),hx2,hy2,o.top,W(2.2));c.circ(hx2,hy2,Math.max(1,m(1.1)),"s")}
 /* viền sáng ngược nắng bên phải */
 for(let yy=shY-m(8);yy<y;yy++)for(let xx=x-m(12);xx<x+m(14);xx++){if(c.is(xx,yy,"RrvVbtu")&&c.is(xx+1,yy,"."))c.px(xx,yy,"Y")}
}

/* xuồng chợ nhìn nghiêng, mũi hướng phải: hai đầu cong vút, mạn viền vàng, ván ghép ngang; cọc bẹo + hàng hoá đặt ở đầu mũi */
const sideHull=(c,x0,x1,yw,o)=>{const n=x1-x0,hh=o.h||12,sh=o.sh||7,top=(t)=>yw-hh-sh*Math.pow(Math.abs(2*t-1),2.0),bot=(t)=>yw+1-Math.max(2,hh*.4)*Math.pow(Math.abs(2*t-1),3.2)
 const A=[],B=[];for(let i=0;i<=n;i++){const t=i/n;A.push([x0+i,top(t)]);B.push([x0+i,bot(t)])}
 c.poly([...A,...B.reverse()].flatMap(([a,b])=>[rwR(a),rwR(b)]),o.hull)
 for(let i=0;i<=n;i++){const t=i/n,a=top(t),b=bot(t);c.vline(x0+i,rwR(a),hh>8?2:1,o.rim);if(hh>8){c.vline(x0+i,rwR(a+2),rwR((b-a)*.4),o.hull2);c.vline(x0+i,rwR(b-2),2,o.hull3)}else c.vline(x0+i,rwR(b-1),1,o.hull3)}
 if(hh>8)for(let i=0;i<=n;i+=7){const t=i/n;c.vline(x0+i,rwR(top(t)+3),rwR((bot(t)-top(t))*.6),o.hull3)}
 if(hh>8)c.hline(x0+2,rwR(yw+2),n-3,"N")
}

/* cảnh người chèo xuồng bán hàng: đứng ở lái (trái), một mái dầm dài khua ra sau */
const NNFRAME=(c)=>{
 const k=c.phase*Math.PI*2,sw=Math.sin(k),x0=10,x1=138,yw=70
 /* bóng nước + sóng tách đầu mũi */
 c.hline(x0+8,yw+4,x1-x0-14,"M");c.hline(x0+16,yw+5,x1-x0-30,"N")
 c.hline(x1-6,yw+1,12,"K");c.hline(x1-2,yw+2,8,"I")

 /* hàng hoá: giỏ + trái cây chất ở giữa-mũi */
 const r=c.rng(4),FR=[["R","y","8"],["q","y","9"],["F","P","8"],["8","9","<"]]
 c.rect(60,yw-16,52,5,"D");c.hline(60,yw-16,52,"t")
 for(let i=0;i<24;i++){const fx=62+Math.floor(r()*48),fy=yw-17-Math.floor(r()*9),F=FR[(i>>2)%4];c.circ(fx,fy,2,F[i%3])}
 /* trái treo cây bẹo */
 c.vline(112,yw-48,36,"Z");c.vline(113,yw-48,36,"m");const G=["R","y","8"];for(let i=0;i<3;i++){c.line(112,yw-44+i*9,108-i%2*3,yw-40+i*9,"Z");c.circ(108-i%2*3,yw-38+i*9,2,G[i])}
 /* người chèo */
 const lean=2+Math.round(sw*2),hand=[7+Math.round(sw*3),19]
 /* mái dầm: từ tay xuống nước phía sau lái, góc đổi theo nhịp */
 const hxw=x0+22+Math.round(sw*3),hyw=yw-19,bl=[x0-4+Math.round(sw*7),yw+8]
 sideFig(c,x0+24,yw-6,1.15,{top:"R",topShade:"r",lean,hand:[3,20]})
 /* thân xuồng vẽ SAU để mạn gần che nửa dưới người và hàng */
 sideHull(c,x0,x1,yw,{hull:"Z",hull2:"B",hull3:"z",rim:"q"})
 /* mái dầm khua ra ngoài lái, nằm ngoài thân xuồng */
 c.line(hxw+6,hyw-8,bl[0],bl[1],"j",2);c.line(hxw+6,hyw-8,hxw+8,hyw-12,"u",2)
 c.poly([bl[0]-3,bl[1]-2,bl[0]+3,bl[1]-2,bl[0]+4,bl[1]+4,bl[0]-4,bl[1]+4].map(rwR),"t");c.hline(bl[0]-4,bl[1]+5,9,"K");c.hline(bl[0]-6,bl[1]+6,13,"I")
}
/* xuồng nhỏ nhìn nghiêng (cảnh xa): hai đầu cong, một người ngồi đội nón lá */
sprite("_sampan",{w:46,h:22},(c)=>{
 c.rect(34,9,6,6,"D");c.hline(34,9,6,"t");c.circ(36,8,1,"R");c.circ(38,8,1,"y")
 sideFig(c,17,18,.56,{top:"R",topShade:"r",sit:true,hand:[9,9]})
 sideHull(c,2,44,19,{h:6,sh:3,hull:"V",hull2:"v",hull3:"V",rim:"q"})
 c.hline(5,20,34,"N")})
sprite("_sampanS",{w:30,h:14},(c)=>{
 sideFig(c,11,11,.36,{top:"v",topShade:"V",sit:true})
 sideHull(c,1,29,12,{h:4,sh:2,hull:"Z",hull2:"B",hull3:"z",rim:"t"})
 c.hline(3,13,24,"N")})

sprite("_ghe",{w:84,h:40},poly([0,22,84,18,76,38,10,38],"V"),hline(2,22,80,"q"),poly([3,24,82,20,75,34,11,34],"v"),
 poly([14,22,22,8,64,6,74,20],"h"),poly([18,20,26,11,62,9,70,19],"j"),(c)=>{for(let x=16;x<72;x+=4)c.line(x,20,x+2,9,"h")},
 rect(26,20,30,10,"Z"),rect(30,21,8,9,"R"),circ(10,18,4,"D"),circ(17,19,4,"B"),circ(14,14,4,"D"),circ(23,17,3,"u"),px(14,13,"u"))
sprite("_luc",{w:34,h:22},ellipse(8,16,8,4,"6"),ellipse(22,17,10,4,"6"),ellipse(15,15,7,4,"7"),ellipse(7,15,5,2,"8"),ellipse(21,16,6,2,"8"),
 ellipse(15,12,3,3,"7"),vline(16,2,10,"6"),(c)=>{for(const[x,y]of[[16,1],[14,3],[18,4],[15,6],[17,7]])c.rect(x-1,y,3,2,(x+y)%2?"P":"F")},hline(3,19,28,"5"))
sprite("_egret",{w:18,h:22},ellipse(8,12,5,3,"W"),poly([11,10,17,4,15,3,10,8],"W"),px(17,4,"q"),line(18,3,21,4,"q"),vline(7,15,6,"z"),vline(10,15,6,"z"),line(3,12,0,15,"X"),hline(3,13,8,"X"))

/* bờ trái / phải: đường mép nước (toạ độ cố định, dùng cho đất, bùn, bóng phản chiếu) */
const LB=[[0,262],[60,248],[120,232],[180,214],[230,194],[268,174],[292,160],[302,153]]
const RB=[[640,236],[590,224],[540,209],[500,193],[470,176],[452,164],[446,154]]
const flat=(a)=>a.flat()

scene("ben_tre",{w:640,h:360,layers:true},
 layer("sky",
  grad(0,0,640,172,"aaabbbcccdddeeefffggg","v",.8),rect(0,172,640,188,"g"),
  (c)=>halo(c,430,72,170,["d","e","f","g","Y"]),
  circ(430,72,14,"y"),circ(430,72,11,"Y"),circ(430,72,7,"W"),
  stamp("_cl3",-30,26),stamp("_cl1",70,64),stamp("_cl2",250,34),stamp("_cl4",330,22),stamp("_cl1",486,18),stamp("_cl2",560,66),stamp("_cl3",120,112,{flip:"x"}),stamp("_cl4",470,104),
  (c)=>{const r=c.rng(6);for(let i=0;i<26;i++){const y=104+Math.floor(r()*40),w=24+Math.floor(r()*70);c.hline(Math.floor(r()*660)-20,y,w,y<125?"X":"f")}}),
 layer("far",
  (c)=>{const r=c.rng(3);for(let x=-6;x<650;x+=5){const rr=5+Math.floor(r()*5),y=146-Math.floor(r()*5);c.circ(x,y,rr,"3");c.circ(x+2,y-2,Math.max(2,rr-3),"2")}
   c.rect(0,147,640,8,"3");for(let x=0;x<640;x+=2)c.px(x,147+(x*7%3),"2")
   ;[[14,150,36,-4],[46,150,26,3],[96,150,30,-3],[196,150,24,3],[262,150,28,-2],[332,150,20,2],[388,150,26,-3],[430,150,22,3],[580,150,30,-3],[620,150,36,4]].forEach(([x,b,h,l],i)=>palm(c,x,b,h,l,.5,["3","2","1","1"],["3","2","1"],20+i))},
  stamp("_nhaS",92,125,{swap:{h:"2",j:"3",D:"2",B:"3",Z:"4",z:"4"}}),stamp("_nhaS",214,128,{swap:{h:"2",j:"3",D:"2",B:"3",Z:"4",z:"4"}}),stamp("_nhaS",396,129,{swap:{h:"2",j:"3",D:"2",B:"3",Z:"4",z:"4"}}),stamp("_nhaS",566,124,{swap:{h:"2",j:"3",D:"2",B:"3",Z:"4",z:"4"}}),
  stamp("_chuaS",508,121,{swap:{R:"E",w:"e",Z:"4",q:"y"}}),
  light([0,136,640,22],1,.6),light([0,142,640,12],1,.5)),
 layer("water",
  grad(0,150,640,210,"HHIIIJJJKKKLLLMMMNNN","v",.8),
  (c)=>{const r=c.rng(5)
   /* vệt nắng: rộng dần về phía gần, lấp lánh kem */
   for(let i=0;i<260;i++){const y=152+Math.floor(r()*206),k=(y-150)/210,w=Math.round(4+r()*(10+k*60)),cx=420+Math.round((r()-.5)*(20+k*150)-k*30);c.hline(cx-(w>>1),y,w,k<.3?"W":k<.6?"Y":"y")}
   /* gợn sóng ngang: ngắn mịn ở xa, dài thô ở gần */
   for(let i=0;i<420;i++){const y=154+Math.floor(r()*204),k=(y-150)/210,w=Math.round(5+r()*(10+k*58));c.hline(Math.floor(r()*680)-20,y,w,k<.25?"I":k<.55?"K":k<.8?"L":"M")}
   for(let i=0;i<110;i++){const y=170+Math.floor(r()*188),w=Math.round(8+r()*30);c.hline(Math.floor(r()*660),y,w,"N")}
   /* phản chiếu bờ: vệt cây tối dưới mép nước, đứt quãng cho gợn */
   const refl=(B,sx)=>{const top=B.map(([x,y])=>[x,y+1]),bot=B.map(([x,y])=>[x,y+Math.round(6+Math.min(30,(y-150)*.3))]).reverse();c.poly(flat([...top,...bot]),"N")
    for(let y=152;y<340;y+=2)for(let x=0;x<640;x++)if(c.is(x,y,"N")&&((x*13+y*7)%11<3||bay(x,y)<.18))c.px(x,y,y%4?"M":"L")}
   refl(LB);refl(RB)}),
 layer("mid",
  /* đất bờ + bùn */
  clip(flat([...LB,[302,146],[0,146]]),grad(0,146,310,130,"6665550","v",.8)),
  clip(flat([...RB,[446,146],[640,146]]),grad(440,146,200,100,"6665550","v",.8)),
  (c)=>{const r=c.rng(55),G=["0","5","6","7"],F=["k","0","5","6"]
   const ey=(B,x)=>{for(let i=0;i<B.length-1;i++){const a=B[i],b=B[i+1],lo=Math.min(a[0],b[0]),hi=Math.max(a[0],b[0]);if(x>=lo&&x<=hi)return a[1]+(b[1]-a[1])*(x-a[0])/((b[0]-a[0])||1)}return null}
   const pts=[];for(let i=0;i<170;i++){const left=i%2==0,B=left?LB:RB,x=left?Math.floor(r()*300):446+Math.floor(r()*194),e=ey(B,x);if(e==null||e<152)continue;const y=147+Math.floor(Math.pow(r(),.8)*(e-8-147));if(y>e-5)continue;pts.push([x,y])}
   pts.sort((p,q)=>p[1]-q[1])
   pts.forEach(([x,y],i)=>{const s=Math.min(1.2,.26+(y-146)/100),k=i%6,P=s>.85?F:G
    if(k<3)nipa(c,x,y,s*.75,P,100+i,8);else if(k<5)palm(c,x,y,Math.round(34+s*84),Math.round((r()-.5)*14*s),s*.75,P,["Z","B","D"],200+i)
    else{const q=Math.round(4+s*6);c.circ(x,y-q+2,q,P[1]);c.circ(x-1,y-q-1,Math.round(q*.7),P[2]);c.circ(x+Math.round(q*.4),y-q-2,Math.max(1,Math.round(q*.4)),P[3])}})},
  light([0,138,640,40],1,.55),
  (c)=>{for(const B of[LB,RB])for(let i=0;i<B.length-1;i++){const[x0,y0]=B[i],[x1,y1]=B[i+1];c.line(x0,y0,x1,y1,"n",3);c.line(x0,y0+3,x1,y1+3,"m",2);c.line(x0,y0-2,x1,y1-2,"p")}},
  /* cây phía xa → gần: dừa nước + dừa */
  (c)=>{const G=["0","5","6","7"],F=["k","0","5","6"]
   ;[[286,166,.42,5],[262,177,.55,6],[232,194,.7,7],[196,208,.85,8],[150,222,1,9],[98,236,1.15,10],[40,250,1.3,11],[0,262,1.4,12]].forEach(([x,y,s,sd])=>nipa(c,x,y,s,s>1?F:G,sd,s>1?11:9))
   ;[[448,160,.45,25],[470,172,.55,26],[502,190,.7,27],[544,205,.9,28],[592,221,1.1,29],[636,234,1.3,30]].forEach(([x,y,s,sd])=>nipa(c,x,y,s,s>1?F:G,sd,s>1?11:9))
   palm(c,268,170,86,-8,.7,G,["Z","B","D"],41);palm(c,212,198,118,8,.85,G,["Z","B","D"],42);palm(c,70,246,170,-14,1.15,F,["z","Z","B"],43)
   palm(c,462,172,78,6,.65,G,["Z","B","D"],44);palm(c,520,194,112,-6,.85,G,["Z","B","D"],45);palm(c,604,226,176,10,1.15,F,["z","Z","B"],46)},
  stamp("_nha",536,148,{}),rect(530,201,50,2,"B"),
  /* cầu khỉ bắc ngang kênh xa */
  (c)=>{const x0=300,x1=446,N=24;let pr=null;for(let i=0;i<=N;i++){const t=i/N,x=x0+(x1-x0)*t,y=158-Math.sin(Math.PI*t)*7;if(i%3==0)c.line(Math.round(x),Math.round(y),Math.round(x+(t<.5?-1:1)),166,"Z");
    if(pr){c.line(pr[0],pr[1],Math.round(x),Math.round(y),"t",2);c.line(pr[0],pr[1]-7,Math.round(x),Math.round(y)-7,"B")}pr=[Math.round(x),Math.round(y)]}
   for(let i=0;i<=N;i+=4){const t=i/N,x=Math.round(x0+(x1-x0)*t),y=Math.round(158-Math.sin(Math.PI*t)*7);c.vline(x,y-7,7,"Z")}
   c.rect(372,141,3,8,"R");c.circ(373,139,2,"s");c.poly([370,139,373,134,376,139],"u")},
  stamp("_egret",96,196),stamp("_egret",612,200,{flip:"x"})),
 layer("boats",stamp("_sampan",338,171),stamp("_sampan",452,189,{flip:"x"}),stamp("_ghe",470,214),stamp("_sampan",236,196),stamp("_luc",300,262),stamp("_luc",176,302),stamp("_luc",440,306,{flip:"x"}),stamp("_luc",348,226)),
 layer("over",(c)=>{
   frond(c,-12,-6,.35,210,.5,["k","0","5","6"],c.rng(71));frond(c,-14,18,.1,170,.55,["k","0","5","6"],c.rng(72));frond(c,10,-12,.62,150,.4,["k","0","5","6"],c.rng(73));frond(c,-10,40,-.12,140,.5,["k","0","5","6"],c.rng(77))
   frond(c,652,-8,2.8,230,.5,["k","0","5","6"],c.rng(74));frond(c,654,22,3.05,180,.55,["k","0","5","6"],c.rng(75));frond(c,630,-12,2.45,160,.4,["k","0","5","6"],c.rng(76));frond(c,650,46,3.3,140,.5,["k","0","5","6"],c.rng(78))}),
 layer("fore",(c)=>{const F=["k","0","5","6"]
   nipa(c,-6,372,1.7,F,81,12);nipa(c,40,380,1.4,F,82,10);nipa(c,650,376,1.8,F,83,12);nipa(c,606,384,1.4,F,84,10)
   const r=c.rng(90);for(let i=0;i<14;i++){const x=Math.round(r()*640),b=368,h=30+r()*60;if(x>150&&x<500)continue;c.line(x,b,x+Math.round((r()-.5)*14),Math.round(b-h),r()<.5?"6":"5")}},
  stamp("_luc",14,326),stamp("_luc",60,344,{flip:"x"}),stamp("_luc",578,334),stamp("_luc",532,350,{flip:"x"}),stamp("_luc",250,352),stamp("_luc",400,346,{flip:"x"})))



/* ====================================================================================
   XẺO QUÝT – rừng tràm ngập nước (vẽ lại bằng pxl). 640x360, 6 lớp: sky far water mid boats fore.
   Nắng sớm từ góc trên-trái xuyên tán lá; đường chân trời y=200; lạch nước mở ra phía phải-trước,
   thảm bèo tấm phủ bên trái; thân tràm trắng bong vỏ đứng thẳng trong nước.
   ==================================================================================== */
pal({A:"#f1e8d6",G:"#cdbba2",i:"#9c8670",l:"#6b5a4a",T:"#b9dcb0",U:"#8fc3a0",Q:"#2f5f4c",x:"#7fbf6a"})

const lerp=(a,b,t)=>a+(b-a)*t
const polyY=(B,x)=>{for(let i=0;i<B.length-1;i++){const a=B[i],b=B[i+1];if(x>=a[0]&&x<=b[0])return lerp(a[1],b[1],(x-a[0])/((b[0]-a[0])||1))}return null}
const polyX=(B,y)=>{for(let i=0;i<B.length-1;i++){const a=B[i],b=B[i+1];if(y>=a[1]&&y<=b[1])return lerp(a[0],b[0],(y-a[1])/((b[1]-a[1])||1))}return y<B[0][1]?B[0][0]:B[B.length-1][0]}

/* mép thảm bèo (trái) và mép phải lạch. Mép trái lượn nhẹ như đám bèo tự trôi, không thẳng tắp. */
const XL0=[[430,200],[392,206],[330,218],[262,236],[186,262],[96,300],[-10,340]]
const XR=[[430,200],[470,205],[540,210],[640,216]]
const XLP=(()=>{const o=[];for(let y=200;y<=362;y+=3){const k=(y-198)/162,w=Math.sin(y*.37)*1.5+Math.sin(y*.11+1)*3.5+Math.sin(y*.83)*1.2;o.push([Math.round(polyX(XL0,y)+w*(.4+k*1.6)),y])}return o})()
const xl=(y)=>polyX(XLP,y)

/* một thân tràm: gốc loe, thân thon, vỏ trắng bong từng mảng; mặt trái hứng nắng sớm */
const tram=(c,x,yb,yt,w,lean,seed)=>{const r=c.rng(seed),H=yb-yt
 for(let y=yb;y>=yt;y--){const t=(yb-y)/H,cx=x+Math.round(lean*t*t),fl=y>yb-w*.8?Math.round((y-(yb-w*.8))*.5):0,ww=Math.max(2,Math.round(w*(1-t*.35)))+fl,x0=cx-(ww>>1)
  c.hline(x0,y,ww,"G");c.px(x0,y,"W");if(ww>3)c.px(x0+1,y,"A");c.px(x0+ww-1,y,"i");if(ww>4)c.px(x0+ww-2,y,"i");if(ww>7)c.px(x0+ww-3,y,"G")}
 const n=Math.round(H/9);for(let k=0;k<n;k++){const y=yt+Math.floor(r()*H),t=(yb-y)/H,cx=x+Math.round(lean*t*t),ww=Math.max(2,Math.round(w*(1-t*.35))),len=2+Math.floor(r()*Math.max(2,ww*.5)),s=Math.floor(r()*(ww-len+1)),h=1+Math.floor(r()*3)
  c.rect(cx-(ww>>1)+s,y,len,h,r()<.5?"i":"l");if(r()<.6)c.hline(cx-(ww>>1)+s,y-1,len,"A")}
 c.line(x-Math.round(w*.5),yb,x-Math.round(w*.9),yb+2,"l");c.line(x+Math.round(w*.5),yb,x+Math.round(w*.9),yb+2,"l")}
/* tán tràm: khối lá sẫm gồm nhiều cụm tròn, mặt trên-trái sáng, mép dưới tua rủ những cành kim */
const crown=(c,x,y,s,seed,cl)=>{const r=c.rng(seed),n=Math.round(5+s*4),B=[]
 for(let i=0;i<n;i++){const ox=Math.round((r()-.5)*s*30),oy=Math.round((r()-.45)*s*13),rad=Math.max(2,Math.round(s*(3.5+r()*4.5)));B.push([x+ox,y+oy,rad]);c.circ(x+ox,y+oy,rad,cl[0])}
 for(const[bx,by,rad]of B){const hr=Math.max(1,Math.round(rad*.62));c.circ(bx-Math.round(rad*.22),by-Math.round(rad*.28),hr,cl[1])
  for(let j=0;j<rad*2;j++){const a=r()*6.28,d=Math.sqrt(r())*hr,px=bx-Math.round(rad*.22)+Math.round(Math.cos(a)*d),py=by-Math.round(rad*.28)+Math.round(Math.sin(a)*d);if(c.is(px,py,cl[1]))c.px(px,py,r()<.6?cl[0]:cl[2])}
  if(rad>4)for(let j=0;j<rad;j++){const px=bx-Math.round(rad*.5)+Math.floor(r()*rad*.6),py=by-Math.round(rad*.6)+Math.floor(r()*rad*.4);if(c.is(px,py,cl[1]))c.px(px,py,cl[2])}}
 for(const[bx,by,rad]of B){const m=1+Math.round(s*.9);for(let j=0;j<m;j++){const sx=bx+Math.round((r()-.5)*rad*1.4),sy=by+Math.round(rad*.7),L=Math.round(3+r()*(4+s*3))
  c.vline(sx,sy,L,cl[0]);if(r()<.6)c.vline(sx+(r()<.5?-1:1),sy+1,Math.max(1,L-2),cl[1]);c.px(sx,sy+L,cl[2])}}}
/* cành rủ giữa tầng: vài sợi kim mảnh có lá nhỏ, tạo độ sâu giữa các thân */
const lamtram=(c,x,y,s,seed,cl)=>{const r=c.rng(seed),n=Math.max(3,Math.round(3+s*3))
 for(let i=0;i<n;i++){const d=r()<.5?-1:1,L=s*(8+r()*12),ex=x+d*L*(.4+r()*.5),ey=y+L*(.5+r()*.5)
  c.line(Math.round(x),Math.round(y),Math.round(ex),Math.round(ey),cl[0]);const m=Math.max(3,Math.round(L/2.6))
  for(let j=1;j<=m;j++){const t=j/m,px=lerp(x,ex,t),py=lerp(y,ey,t);c.px(Math.round(px),Math.round(py+1),(d<0&&r()<.6)?cl[3]:cl[2]);if(r()<.5)c.px(Math.round(px+d),Math.round(py+2),cl[1])}}}

/* thân tràm: lấy mẫu trên thảm bèo / bờ xa, nhỏ dần về phía chân trời (hạt giống cố định) */
const TRAMS=(()=>{const f=(n,seed,test)=>{const o=[];let g=seed;const r=()=>{g=(g*1664525+1013904223)>>>0;return g/4294967296}
 for(let i=0;i<n;i++){for(let k=0;k<40;k++){const y=206+Math.pow(r(),1.5)*130,x=Math.round(r()*660-10);if(test(x,y)){o.push([x,Math.round(y)]);break}}}return o}
 const left=f(64,11,(x,y)=>x<xl(Math.round(y))-16),right=f(24,23,(x,y)=>y<214&&x>500)
 return[...left,...right].sort((a,b)=>a[1]-b[1])})()
const trk=([x,y])=>{const k=(y-198)/150;return{k,w:Math.max(2,Math.round(2+k*13)),top:Math.round(y-(150+k*330))}}

scene("xeo_quyt",{w:640,h:360,layers:true},
 layer("sky",
  grad(0,0,640,205,"bbbcccdddeeefffTTT","v",.8),rect(0,205,640,155,"T"),
  (c)=>halo(c,70,-6,300,["d","e","f","g","Y"]),
  stamp("_cl4",470,30),stamp("_cl2",300,14,{flip:"x"})),
 layer("far",
  /* rừng tràm xa chìm trong sương: thân mảnh nhạt, tán lấm tấm nhiều cụm nhỏ, đáy tan vào sương */
  (c)=>{const r=c.rng(7)
   for(let x=-4;x<646;x+=3+Math.floor(r()*4)){const h=70+Math.floor(r()*90),top=200-h;c.vline(x,top,h,r()<.3?"J":"U");if(r()<.5)c.vline(x+1,top+10,h-10,"T")}
   for(let i=0;i<1500;i++){const x=Math.floor(r()*660)-10,y=58+Math.floor(Math.pow(r(),.8)*96),rad=2+Math.floor(r()*4),lit=(x<330&&r()<.6)||r()<.25
    c.circ(x,y,rad,y<110?(lit?"T":"U"):(lit?"U":"J"))}
   for(let i=0;i<500;i++){const x=Math.floor(r()*660)-10,y=60+Math.floor(r()*90),rad=1+Math.floor(r()*2);c.circ(x-1,y-1,rad,r()<.5?"T":"H")}},
  grad(0,176,640,34,"TTUUTTHH","v",.8),
  light([0,150,640,56],1,.5)),
 layer("water",
  rect(0,198,640,162,"U"),
  /* lạch mở: phản chiếu bầu trời sáng ở xa, ngả xanh trà ở gần */
  clip(flat([...XLP,[-10,362],[650,362],[650,216],...[...XR].reverse()]),grad(0,198,640,164,"HHIIIJJJKKKLLLMMMNN","v",.8)),
  /* thảm bèo tấm bên trái: xanh nhạt ở xa, đậm ở gần */
  clip(flat([...XLP,[-10,362],[-10,200]]),grad(0,198,430,164,"TTxx8877766","v",.7)),
  (c)=>{const r=c.rng(31)
   /* lá bèo li ti: dày và nhỏ, hơi to dần về phía gần; bên trái (hứng nắng) sáng hơn */
   for(let i=0;i<5200;i++){const y=200+Math.floor(Math.pow(r(),.9)*160),e=xl(y);const x=Math.floor(r()*(e+4));if(x<0||x>e-1)continue
    const k=(y-198)/162,rx=1+Math.round(k*2.2),ry=1+Math.round(k*.8),lit=(x/Math.max(60,e))<.6&&r()<.55
    c.ellipse(x,y,rx,ry,lit?(r()<.5?"9":"8"):(r()<.6?"7":"6"))}
   /* ô nước hở lấm tấm trong thảm */
   for(let i=0;i<40;i++){const y=214+Math.floor(r()*120),e=xl(y),x=Math.floor(r()*(e-14));if(x<8)continue;const k=(y-198)/162;c.ellipse(x,y,Math.round(3+k*8),Math.round(1+k*2),"M");c.hline(x-2,y,Math.round(3+k*5),"L")}
   /* mảng bèo trôi rời ra ngoài mép */
   for(let i=0;i<9;i++){const y=222+Math.floor(r()*110),k=(y-198)/162,x=Math.round(xl(y)+14+r()*(40+k*60));const rx=Math.round(5+k*14+r()*6)
    for(let j=0;j<Math.round(rx*1.6);j++){const a=r()*6.28,d=Math.sqrt(r())*rx;c.ellipse(Math.round(x+Math.cos(a)*d),Math.round(y+Math.sin(a)*d*.3),1+Math.round(k*2),1,r()<.4?"8":r()<.6?"7":"6")}}
   /* bóng thân tràm: dưới nước thành vệt tối đứt quãng; trên thảm bèo chỉ là bóng đổ ngắn */
   for(const[x,y]of TRAMS){const t=trk([x,y]),ww=Math.max(2,t.w),onC=x<xl(y)-2,len=onC?Math.round(3+t.w*.7):Math.round(14+t.w*3.4)
    for(let yy=y+2;yy<y+len&&yy<360;yy++){const a=(yy-y)/len;if((yy*3+x)%5<2+Math.round(3*(1-a)))c.hline(x-(ww>>1),yy,ww,onC?"5":"N")}}
   /* sóng ngang trên lạch */
   for(let i=0;i<420;i++){const y=202+Math.floor(r()*156),k=(y-198)/162,e=xl(y),w=Math.round(5+r()*(8+k*52)),x=Math.floor(e+r()*(660-e))
    if(c.is(x,y,"HIJKLMN"))c.hline(x,y,w,k<.3?"I":k<.6?"K":k<.85?"L":"M")}
   /* vệt nắng kem trên lạch, rộng dần về phía gần */
   for(let i=0;i<150;i++){const y=204+Math.floor(r()*150),k=(y-198)/162,w=Math.round(3+r()*(8+k*40)),x=Math.round(lerp(430,540,k)+(r()-.5)*(30+k*150))
    if(c.is(x,y,"HIJKLMN"))c.hline(x-(w>>1),y,w,k<.3?"W":k<.6?"Y":"y")}}),
 layer("mid",
  /* thân tràm: xa → gần; thân cao tới tán, tán nằm trên cùng thân */
  (c)=>{for(const[i,[x,y]]of TRAMS.entries()){const t=trk([x,y]),lean=Math.round(Math.sin(i*2.1)*6*t.k)
    tram(c,x,y,t.top,t.w,lean,100+i)
    if(t.top>-4)crown(c,x+lean,t.top+2,.6+t.k*1.1,500+i,i%2?["Q","0","5","6"]:["0","5","6","8"])}},
  /* cành rủ giữa thân cho có chiều sâu */
  (c)=>{const r=c.rng(77),cl=["0","5","6","8"]
   for(const[i,[x,y]]of TRAMS.entries()){if(i%3!=0)continue;const t=trk([x,y]),hy=Math.round(lerp(y-26,Math.max(10,t.top+40),.55+r()*.3))
    if(hy>0&&hy<260)lamtram(c,x+Math.round((r()-.5)*6),hy,.5+t.k*1.1,300+i,i%2?cl:["Q","0","5","6"])}},
  /* bèo ôm quanh gốc: chấm nhỏ chứ không phải lá sen */
  (c)=>{const r=c.rng(88);for(const[x,y]of TRAMS){const t=trk([x,y]);for(let j=0;j<Math.round(6+t.w*1.6);j++){const dx=Math.round((r()-.5)*(t.w*2.2+6)),dy=Math.round((r()-.4)*Math.max(2,t.w*.35)+1);c.px(x+dx,y+dy,r()<.5?"7":r()<.5?"6":"9")}}},
  light([0,196,640,90],1,.4),
  stamp("_egret",96,284),stamp("_egret",204,252,{flip:"x"})),
 layer("boats",
  stamp("_sampanS",384,208),stamp("_sampanS",556,214,{flip:"x"}),
  stamp("_luc",236,306),stamp("_luc",560,326,{flip:"x"}),stamp("_luc",300,268)),
 layer("fore",
  /* hai thân tràm to chắn hai mép khung, vỏ bong rõ */
  (c)=>{tram(c,34,372,-10,30,-6,801);tram(c,92,368,-10,12,4,802);tram(c,618,372,-10,26,5,803);tram(c,574,366,-10,10,-3,804)},
  /* tán lá trên đỉnh khung: khối tối gồm nhiều cụm, tua lá rủ; chừa khe trời cho nắng lọt */
  (c)=>{const r=c.rng(55),cl=["Q","0","5","6"]
   for(let x=-10;x<650;x+=Math.round(14+r()*14)){const gap=(x>170&&x<320)||(x>430&&x<510);if(gap&&r()<.8)continue;crown(c,x,Math.round(r()*10)-6,1.7+r()*1.1,900+x,cl)}
   crown(c,70,34,1.5,1001,cl);crown(c,596,30,1.6,1002,cl);lamtram(c,300,14,1.2,1003,cl)},
  /* bèo & lục bình trước mặt */
  (c)=>{const r=c.rng(66),blob=(cx,cy,rx,ry,n)=>{for(let i=0;i<n;i++){const a=r()*6.28,d=Math.pow(r(),.6),x=Math.round(cx+Math.cos(a)*d*rx*(1+.12*Math.sin(a*5+cx))),y=Math.round(cy+Math.sin(a)*d*ry*(1+.15*Math.sin(a*7))),k=(y-300)/60
    if(y<326||y>361)continue;c.ellipse(x,y,1+Math.round(k*2.5),1+Math.round(k*.9),(x<cx&&r()<.5)||r()<.2?(r()<.5?"9":"8"):(r()<.6?"7":"6"))}}
   blob(10,366,150,38,1500);blob(646,368,128,34,1300);blob(300,372,60,12,200)},
  stamp("_luc",6,332),stamp("_luc",590,336,{flip:"x"})))


/* ====================================================================================
   CHỢ NỔI NGÃ NĂM – bình minh (vẽ lại bằng pxl). 640x360, 6 lớp: sky far water mid boats fore.
   Mặt trời mọc thấp ở khoảng hở giữa hai bờ (x≈476, y≈140); dãy phố ven sông bên trái, nhà chợ bên phải;
   xuồng hàng neo thưa ở xa, dày dần về phía gần; luồng nước phía phải-trước để trống cho xuồng chèo.
   ==================================================================================== */
pal({"!":"#f6d3c0","@":"#f4a78e","$":"#f2cf9c","%":"#ff9a66","&":"#c46a5a","*":"#efb1ae","+":"#c9767f","=":"#3563a8","?":"#7fb8a8","~":"#5a4a54","<":"#2f9d7a",">":"#1d6e56",";":"#6cc9a0",":":"#e8a23a",",":"#f7d34a","-":"#b04d3a"})

/* quầng sáng bình minh nằm ngang: dẹt theo đường chân trời */
const dawnHalo=(c,cx,cy,Rx,Ry,cols)=>{for(let y=cy-Ry;y<=cy+Ry;y++)for(let x=cx-Rx;x<=cx+Rx;x++){const d=Math.hypot((x-cx)/Rx,(y-cy)/Ry);if(d>=1||x<0||y<0||x>=c.w||y>=c.h)continue
 const v=Math.pow(1-d,1.5)*cols.length+bay(x,y)-.5,i=Math.floor(v);if(i>=0)c.px(x,y,cols[Math.min(i,cols.length-1)])}}

/* nhà phố ven sông: tường, mái tôn/ngói, mái hiên màu, cửa tối, biển hiệu; mặt trái hứng nắng */
const WALLS=["w","C","?","q","*","u"],ROOFS=["R","~","V","-","D"],AWN=["v","R","<","q","r","="]
const shop=(c,x,yb,w,h,k,lit=0)=>{const wl=WALLS[k%6],rf=ROOFS[(k*3+1)%5],aw=AWN[(k*5+2)%6],y0=yb-h
 c.rect(x,y0,w,h,wl);c.vline(x+w-1,y0,h,"m");c.vline(x+w-2,y0+2,h-2,"m");c.vline(x,y0,h,"W")
 c.rect(x-2,y0-3,w+4,3,rf);c.hline(x-2,y0-4,w+4,"t");c.hline(x-2,y0,w+4,"Z")
 const dw=Math.max(5,Math.round(w*.38)),dx=x+Math.round((w-dw)/2)
 c.rect(dx,yb-Math.round(h*.62),dw,Math.round(h*.62),"z");c.rect(dx,yb-Math.round(h*.62),dw,2,aw);c.hline(dx-1,yb-Math.round(h*.62)+2,dw+2,"Z")
 if(w>16){c.rect(x+2,y0+5,5,6,"z");c.hline(x+2,y0+5,5,"C");if(w>26)c.rect(x+w-8,y0+5,5,6,"z")}
 c.hline(x-2,yb-1,w+4,"Z");c.hline(x-2,yb,w+4,"m")}
/* cột điện, dây kéo ngang */
const pole=(c,x,yb,h)=>{c.vline(x,yb-h,h,"Z");c.hline(x-4,yb-h+3,9,"Z");c.hline(x-3,yb-h+8,7,"Z");c.px(x-4,yb-h+2,"W");c.px(x+4,yb-h+2,"W")}
/* xuồng chợ: thân gỗ nâu, mái bạt vòm, đống trái cây, người bán nón lá, cây bẹo treo hàng */
const FRUIT=[[",",":","8"],["R","y","9"],["F","P","8"],["W","y","O"],["8","9","<"]]
const mboat=(c,x,y,s,o)=>{const L=Math.round(58*s),h=Math.max(3,Math.round(8*s)),x0=x-(L>>1),r=c.rng(o.seed||1),b=Math.round(4*s),u=Math.round(2*s)
 c.hline(x0+2,y+1,L-3,"N");if(s>.6)c.hline(x0+5,y+2,L-10,"M");if(s>1.1)c.hline(x0+9,y+3,L-18,"L")
 c.poly([x0,y-h,x0+L+b,y-h-u,x0+L-Math.round(3*s),y,x0+Math.round(4*s),y],"Z")
 c.poly([x0+1,y-h+1,x0+L+b-1,y-h-u+1,x0+L-Math.round(4*s),y-Math.round(h*.45),x0+Math.round(5*s),y-Math.round(h*.45)],"B")
 c.hline(x0,y-h,L+b,"D");if(s>.7)c.hline(x0+2,y-h+Math.round(h*.5),L-6,"m")
 const deck=y-h
 if(o.tarp){const[m,li,sh]=o.tarp,cx=x0+Math.round(L*.5),tw=Math.round(L*.3),th=Math.round(h*1.6+3*s)
  for(let i=-tw;i<=tw;i++){const g=Math.round(th*Math.sqrt(1-(i/tw)*(i/tw)));if(g<1)continue;const col=i<-tw*.35?li:i>tw*.4?sh:m;c.vline(cx+i,deck-g,g,col)}
  if(s>.55)for(let i=-tw+2;i<tw;i+=Math.max(3,Math.round(4*s))){const g=Math.round(th*Math.sqrt(1-(i/tw)*(i/tw)));if(g>1)c.vline(cx+i,deck-g+1,g-1,sh)}
  c.hline(cx-tw,deck-1,tw*2+1,"Z")}
 if(o.fruit){const F=FRUIT[o.fruit%5],px=o.tarp?x0+Math.round(L*.08):x0+Math.round(L*.2),n=Math.max(4,Math.round(9*s)),rad=Math.max(1,Math.round(1.7*s))
  for(let i=0;i<n;i++){const fx=px+Math.round(r()*L*(o.tarp?.22:.45)),fy=deck-Math.round(r()*h*.9)-1;c.circ(fx,fy,rad,F[Math.floor(r()*3)])}}
 if(o.vendor){const vx=x0+Math.round(L*(o.tarp?.84:.72)),col=o.vendor,vf=.78*s
  if(vf>=.5)sideFig(c,vx,deck,vf,{top:col,topShade:({R:"r",v:"V","<":">",q:"j"})[col]||"r",sit:vf<.7})
  else{const vh=Math.max(5,Math.round(11*s));c.rect(vx-Math.round(2*s),deck-vh,Math.max(3,Math.round(5*s)),vh,col);c.circ(vx,deck-vh-Math.round(2*s),Math.max(1,Math.round(1.8*s)),"s")
   const hw=Math.max(3,Math.round(6*s));c.poly([vx-hw,deck-vh-Math.round(1.4*s),vx,deck-vh-Math.round(6*s),vx+hw,deck-vh-Math.round(1.4*s)],"u");c.hline(vx-hw,deck-vh-Math.round(1.4*s),hw*2,"t")}}
 if(o.pole){const px=x0+Math.round(L*.1),pl=Math.round(50*s);c.vline(px,deck-pl,pl,"Z");if(s>.6)c.vline(px+1,deck-pl,pl,"m")
  const G=[[",",":"],["8","9"],["R","y"],["W","y"],["F","P"]];for(let i=0;i<4;i++){const hy=deck-pl+Math.round((3+i*7.5)*s),side=i%2?1:-1,hr=Math.max(1,Math.round(1.9*s)),hx=px+side*Math.round(4*s);c.line(px,hy,hx,hy+Math.round(2*s),"D");c.circ(hx,hy+Math.round(3.5*s),hr,G[(i+o.pole)%5][0]);if(hr>1)c.px(hx-1,hy+Math.round(3*s),G[(i+o.pole)%5][1])}
  c.poly([px+1,deck-pl,px+Math.round(8*s)+1,deck-pl+Math.round(2*s),px+1,deck-pl+Math.round(4*s)],"R")}}
const msc=(y)=>Math.max(.34,.34+(y-186)*.0083)

scene("nga_nam",{w:640,h:360,layers:true},
 layer("sky",
  grad(0,0,640,175,"aaabbbcccdddd!!!!@@@@%gggg","v",.8),rect(0,175,640,185,"g"),
  (c)=>dawnHalo(c,476,146,290,150,["c","d","!","$","g","Y"]),
  stamp("_cl3",-50,40,{swap:{W:"!",X:"@",C:"%",S:"%"}}),stamp("_cl1",90,78,{swap:{W:"!",X:"@",C:"%",S:"%"}}),stamp("_cl2",310,44,{swap:{W:"!",X:"@",C:"%",S:"%"}}),
  stamp("_cl4",560,30,{swap:{W:"!",X:"$",C:"@",S:"@"}}),stamp("_cl1",420,104,{flip:"x",swap:{W:"Y",X:"g",C:"$",S:"$"}}),stamp("_cl2",100,124,{swap:{W:"@",X:"%",C:"&",S:"&"}}),
  (c)=>{const r=c.rng(12);for(let i=0;i<22;i++){const y=96+Math.floor(r()*56),w=24+Math.floor(r()*80);c.hline(Math.floor(r()*660)-20,y,w,y<120?"!":"$")}},
  circ(476,146,16,"y"),circ(476,146,13,"Y"),circ(476,146,8,"W")),
 layer("far",
  /* bờ xa bên kia sông: dải rừng dừa nước nhìn ngược sáng, xanh lam sẫm, ánh vàng ở mép */
  (c)=>{const r=c.rng(3);for(let x=-6;x<650;x+=4){const rr=4+Math.floor(r()*5),y=162-Math.floor(r()*6);c.circ(x,y,rr,"3");c.circ(x+2,y-2,Math.max(2,rr-3),"2")}
   c.rect(0,163,640,6,"3");for(let x=0;x<640;x+=2)c.px(x,163+(x*7%3),"2")
   /* nhà nhỏ xa ở khoảng hở giữa */
   for(const[x,y,w]of[[392,162,9],[410,164,7],[452,163,8],[520,163,10],[542,164,7]]){c.rect(x,y-6,w,6,"4");c.poly([x-1,y-6,x+(w>>1),y-10,x+w+1,y-6],"3")}
   ;[[18,168,30,-3],[96,168,24,3],[168,168,28,-2],[352,168,20,2],[610,168,32,-3]].forEach(([x,b,h,l],i)=>palm(c,x,b,h,l,.5,["3","2","1","1"],["3","2","1"],40+i))},
  light([0,150,640,22],1,.6)),
 layer("water",
  grad(0,168,640,192,"$$ggHHIIIJJJKKKLLLMMMNNN","v",.8),
  (c)=>{const r=c.rng(5)
   /* luồng nắng vàng từ mặt trời, rộng dần về phía gần */
   for(let i=0;i<340;i++){const y=170+Math.floor(r()*188),k=(y-168)/192,w=Math.round(4+r()*(10+k*72)),cx=476+Math.round((r()-.5)*(24+k*190)-k*10);c.hline(cx-(w>>1),y,w,k<.18?"W":k<.5?"Y":"y")}
   /* sóng ngang: ngắn mịn ở xa, dài thô ở gần */
   for(let i=0;i<460;i++){const y=172+Math.floor(r()*186),k=(y-168)/192,w=Math.round(5+r()*(8+k*54));c.hline(Math.floor(r()*680)-20,y,w,k<.2?"I":k<.5?"K":k<.8?"L":"M")}
   for(let i=0;i<120;i++){const y=190+Math.floor(r()*168),w=Math.round(8+r()*30);c.hline(Math.floor(r()*660),y,w,"N")}
   /* bóng phố đổ xuống: các vệt tối đứt quãng, điểm màu mái */
   for(let x=0;x<372;x++){if((x*13)%7<4)for(let y=212;y<244;y++){const a=(y-212)/32;if(((x*5+y*3)%9)<4*(1-a)+1)c.px(x,y,((x/7|0)%5==0&&y<222)?"L":y<232?"M":"N")}}
   for(let x=530;x<648;x++){if((x*11)%6<4)for(let y=212;y<250;y++){const a=(y-212)/38;if(((x*7+y*3)%9)<4*(1-a)+1)c.px(x,y,y<220?"L":y<232?"M":"N")}}}),
 layer("mid",
  /* dãy phố ven sông bên trái: nhà cao thấp xen nhau, cột điện, dừa phía sau */
  (c)=>{const r=c.rng(21)
   ;[[24,196,38,9],[100,200,40,9],[170,198,36,9],[244,200,34,9],[300,198,40,9],[8,200,38,9],[60,200,40,9],[214,200,36,9]].forEach(([x,b,h,s],i)=>palm(c,x,b,h*2+10,i%2?4:-4,.85,["k","0","5","6"],["Z","B","D"],60+i))
   const row=[[0,206,40,52],[42,206,34,40],[78,206,44,56],[124,206,32,44],[158,206,40,58],[200,206,34,42],[236,206,46,54],[284,206,36,46],[322,206,42,56]]
   row.forEach(([x,b,w,h],i)=>shop(c,x,b,w,h,i))
   pole(c,40,208,66);pole(c,200,208,62);pole(c,282,208,60);pole(c,356,208,56)
   c.line(40,148,200,152,"Z");c.line(200,152,282,150,"Z");c.line(282,150,356,153,"Z");c.line(44,150,196,154,"Z")
   c.rect(0,207,372,3,"m");c.hline(0,207,372,"p");c.rect(0,210,372,2,"Z")},
  /* nhà chợ bên phải: hai tầng hồng, mái hiên xanh, biển đỏ, cột kè */
  (c)=>{const x=540,w=104
   c.rect(x,96,w,110,"*");c.rect(x,96,w,6,"+");c.vline(x,96,110,"W");c.rect(x+w-6,96,6,110,"+");c.hline(x-2,95,w+4,"t")
   c.rect(x+6,106,w-14,26,"+");for(let i=0;i<7;i++){c.rect(x+10+i*13,112,9,13,"z");c.hline(x+10+i*13,112,9,"C")}
   c.rect(x-6,134,w+8,12,"=");c.rect(x-6,134,w+8,2,"v");c.rect(x-6,146,w+8,3,"V")
   c.rect(x+10,138,w-22,6,"r");for(let i=0;i<9;i++)c.rect(x+14+i*8,140,4,2,"W")
   c.rect(x,150,w,56,"w");c.rect(x+w-6,150,6,56,"m")
   for(let i=0;i<6;i++){c.rect(x+8+i*16,162,10,44,"v");c.rect(x+8+i*16,162,10,2,"=");c.rect(x+10+i*16,166,6,40,"z")}
   c.rect(x-8,205,w+14,3,"p");c.rect(x-8,208,w+14,3,"Z")
   palm(c,528,206,110,-6,.9,["k","0","5","6"],["Z","B","D"],91);palm(c,636,206,130,4,1,["k","0","5","6"],["Z","B","D"],92)},
  /* khoảng hở sông giữa: bờ cỏ thấp xa, vài bụi dừa nước nhỏ */
  (c)=>{const r=c.rng(33);for(let i=0;i<10;i++){const x=380+Math.floor(r()*150),y=174+Math.floor(r()*10);nipa(c,x,y,.32,["k","0","5","6"],200+i,6)}},
  stamp("_egret",14,226),stamp("_egret",366,230,{flip:"x"})),
 layer("boats",
  /* tầng xa → gần; để trống luồng x 440–690, y 240–340 cho xuồng chèo */
  (c)=>{const B=[
   [118,214,{tarp:["<",";",">"],fruit:1,vendor:"R",seed:1}],[196,216,{fruit:0,vendor:"v",seed:2,pole:1}],[262,215,{tarp:["v","C","V"],fruit:3,seed:3}],[330,217,{fruit:4,vendor:"q",seed:4}],
   [400,190,{fruit:2,vendor:"R",seed:5}],[512,192,{tarp:["R","q","r"],fruit:0,seed:6,pole:2}],
   [64,232,{fruit:0,vendor:"<",seed:7,pole:3}],[168,236,{tarp:["v","C","V"],fruit:1,vendor:"q",seed:8}],[272,240,{fruit:3,vendor:"R",seed:9}],[360,246,{tarp:["<",";",">"],fruit:2,seed:10,pole:4}],
   [90,274,{tarp:["R","q","r"],fruit:4,vendor:"v",seed:11,pole:1}],[246,288,{fruit:1,vendor:"<",seed:12}],[360,300,{tarp:["v","C","V"],fruit:0,vendor:"R",seed:13,pole:2}],
   [60,332,{fruit:3,vendor:"R",seed:14}],[250,340,{tarp:["<",";",">"],fruit:1,vendor:"q",seed:15,pole:3}]]
   B.forEach(([x,y,o])=>mboat(c,x,y,msc(y),o))}),
 layer("fore",
  /* lục bình trôi ở các góc dưới */
  stamp("_luc",570,330),stamp("_luc",610,344,{flip:"x"}),stamp("_luc",404,350),stamp("_luc",8,300)))



const RW_XQ={light:-1,top:"v",topShade:"V",skin:"Z",skinSh:"z",rim:"t",pre:(c)=>{
 /* bó tràm trắng nằm dọc ván đáy, buộc dây giữa; nơm đan úp cạnh mạn */
 for(let i=-2;i<=2;i++){const a=rwP(i*.07+.10,2.0,.16),b=rwP(i*.06+.10,3.5,.16);rwLn(c,a,b,i%2?"A":"G",2)}
 const m1=rwP(.10,2.7,.19),m2=rwP(.10,2.76,.19);rwLn(c,[m1[0]-6,m1[1]],[m1[0]+6,m1[1]],"l",1)
 const n0=rwP(-.22,2.0,.12),n1=rwP(-.22,2.0,.80);const bw=rwR(.20*n0[2]);rwPoly(c,[[n0[0]-bw,n0[1]],[n0[0]+bw,n0[1]],[n1[0],n1[1]]],"u");rwLn(c,[n0[0]+2,n0[1]],n1,"t");rwLn(c,[n0[0]-bw,n0[1]],n0,"j")}}
anim("row_ben_tre",{w:148,h:122,frames:8,fps:8,outline:"o"},rwRowBody({light:1,top:"R",topShade:"r"}))
anim("row_xeo_quyt",{w:148,h:122,frames:8,fps:8,outline:"o"},rwRowBody(RW_XQ))

anim("row_nga_nam",{w:146,h:96,frames:8,fps:8,outline:"o"},NNFRAME)

