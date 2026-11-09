/* Xuồng ba lá + người chèo đứng: nhìn từ phía sau, camera thấp chếch xuống (cùng phối cảnh với cảnh sông 640x360).
   Mọi điểm 3D (u ngang, v tiến, h cao so với mặt nước, mét) chiếu bằng một camera lỗ kim duy nhất -> thân xuồng, người, mái chèo khớp phối cảnh. */
pal({W:"#ffffff",X:"#e6f0f3",Y:"#fff4c2",y:"#ffe28a",q:"#dca848",
 z:"#2e211c",Z:"#4b3527",B:"#6e4d33",D:"#98703f",t:"#c49a5a",u:"#e6c488",h:"#b8924c",j:"#8c6a34",p:"#b49a5c",w:"#e8d9b0",
 r:"#a63a30",R:"#dd6c4a",s:"#c0825a",E:"#d99a74",v:"#3f76ac",V:"#2b5584",g:"#1c3a63",
 H:"#dfeac4",I:"#bcdac6",J:"#92c2b8",K:"#68a3a1",L:"#4b8685",M:"#386b72",N:"#2b5561",o:"#17271f",k:"#12302a",
 A:"#f1e8d6",G:"#cdbba2",i:"#9c8670",l:"#6b5a4a",c:"#7d5a3a",d:"#59402b"})

pal({F:"#8a4db0",P:"#c99be8","8":"#8cc863","9":"#c2e587","<":"#2f9d7a",m:"#6a5642","5":"#2b6a3b","6":"#3e8a45","7":"#62a854"})
const CX=74,YH=-62,CH=3.6,F=500,Z0=10            // tâm khung, đường chân trời, độ cao máy, tiêu cự, khoảng cách tới mũi gần
const PR=(u,v,h)=>{const s=F/(Z0+v);return[CX+u*s,YH+(CH-h)*s,s]}
const L=5.6,BEAM=.95
const hw=(t)=>.5*BEAM*Math.pow(Math.sin(Math.PI*Math.pow(Math.min(1,Math.max(0,t)),.85)),.45)   // nửa bề ngang theo chiều dài
const sheer=(t)=>.30+.30*Math.pow(Math.abs(2*t-1),2.4)                                           // độ cao mạn so với mặt nước (hai đầu cong vút)
const T=(n)=>Array.from({length:n+1},(_,i)=>i/n)
const R=Math.round
const poly=(c,pts,col)=>c.poly(pts.flatMap(([x,y])=>[R(x),R(y)]),col)
const ln=(c,a,b,col,w=1)=>c.line(R(a[0]),R(a[1]),R(b[0]),R(b[1]),col,w)
const mix=(a,b,t)=>a+(b-a)*t
const ease=(u)=>u*u*(3-2*u)

/* thân xuồng: gunwale (mạn) trái/phải, đường mớn nước, ván đáy */
const gun=(sg,t0,t1,n=22)=>T(n).map(i=>{const t=mix(t0,t1,i);return PR(sg*hw(t)*1.08,t*L,sheer(t))})
const wat=(sg,t0,t1,n=22)=>T(n).map(i=>{const t=mix(t0,t1,i);return PR(sg*hw(t)*.86,t*L,0)})
const flo=(sg,t0,t1,n=22)=>T(n).map(i=>{const t=mix(t0,t1,i);return PR(sg*hw(t)*.50,t*L,.10)})

const hull=(c,o)=>{
 /* bóng và vệt nước dưới thân */
 const sh=[...wat(-1,0,1),...wat(1,0,1).reverse()].map(([x,y])=>[x+0,y+1])
 poly(c,sh.map(([x,y])=>[x,y+2]),"N")
 /* vỏ ngoài phía gần (nhìn thấy từ sau): sơn xanh, mép mạn vàng */
 for(const sg of[-1,1]){const g=gun(sg,0,.46,14),w=wat(sg,0,.46,14);poly(c,[...g,...w.reverse()],o.skin)
  /* ván be / ván đáy: đường nối ngang thân, tối bên khuất sáng */
  const mid=T(14).map(i=>{const t=mix(0,.46,i);const a=PR(sg*hw(t)*1.08,t*L,sheer(t)),b=PR(sg*hw(t)*.86,t*L,0);return[mix(a[0],b[0],.55),mix(a[1],b[1],.55)]})
  for(let i=0;i<mid.length-1;i++)ln(c,mid[i],mid[i+1],o.skinSh)
  for(let i=0;i<g.length-1;i++)ln(c,g[i],g[i+1],o.rim)}
 /* mũi lái nhọn gần camera: hai mạn gặp nhau */
 const tip=PR(0,0,sheer(0)),tw=PR(0,0,0);ln(c,tip,tw,o.skinSh,2)
 /* lòng xuồng: thành trong tối, ván đáy sáng hơn */
 const loop=[...gun(-1,0,1),...gun(1,0,1).reverse()]
 poly(c,loop,"D")
 poly(c,[...flo(-1,.05,.98),...flo(1,.05,.98).reverse()],"t")
 /* thành trong bên mạn: tối hơn phía khuất sáng */
 for(const sg of[-1,1]){const g=gun(sg,.04,.98),f=flo(sg,.04,.98);poly(c,[...g,...f.reverse()],sg>0===(o.light>0)?"B":"D")}
 poly(c,[...flo(-1,.05,.98),...flo(1,.05,.98).reverse()],"t")
 /* ván đáy dọc: ba đường nối */
 for(const k of[-.33,0,.33]){const pts=T(22).map(i=>{const t=mix(.06,.97,i);return PR(k*hw(t)*1.0,t*L,.10)});for(let i=0;i<pts.length-1;i++)ln(c,pts[i],pts[i+1],"h")}
 /* cong (sườn xương cá): cứ 0,5 m một thanh ngang, vắt từ mạn này sang mạn kia */
 for(let v=.55;v<L-.3;v+=.5){const t=v/L,a=PR(-hw(t)*1.04,v,sheer(t)-.04),b=PR(-hw(t)*.5,v,.10),d=PR(hw(t)*.5,v,.10),e=PR(hw(t)*1.04,v,sheer(t)-.04)
  ln(c,a,b,"Z");ln(c,b,d,"j");ln(c,d,e,"Z")}
 /* viền mạn: vàng đồng, lớp sáng phía có nắng */
 for(const sg of[-1,1]){const g=gun(sg,0,1);for(let i=0;i<g.length-1;i++)ln(c,g[i],g[i+1],sg===o.light?"y":o.rim,1)}
 /* mũi xa */
 const bt=PR(0,L,sheer(1));c.px(R(bt[0]),R(bt[1]),"y")
}

/* ----- người chèo: bộ xương 3D -> chiếu -> thân/tay/chân vẽ bằng đoạn thẳng có bề dày (mét * px/mét) ----- */
const limb=(c,a,b,wm,col,sh)=>{const s=(a[2]+b[2])/2;c.line(R(a[0]),R(a[1]),R(b[0]),R(b[1]),col,Math.max(1,R(wm*s)))}

const person=(c,o,p,ph)=>{
 const vr=.92,bob=.035*(1-p),lean=.14*p
 const dip=.07*p,hipH=.93-bob,shH=1.43-bob-dip
 const J={
  fL:PR(-.14,vr-.05,.10),fR:PR(.14,vr+.03,.10),
  hL:PR(-.10,vr+.04*p,hipH),hR:PR(.10,vr+.04*p,hipH),
  kL:PR(-.15,vr+.09+.05*(1-p),.52),kR:PR(.15,vr+.11+.05*(1-p),.52),
  sL:PR(-.185,vr+.05+lean,shH),sR:PR(.185,vr+.05+lean,shH),
  nk:PR(0,vr+.06+lean,shH+.06)}
 /* chân: quần ống rộng tối, bàn chân trần trên ván */
 for(const sd of["L","R"]){const f=J["f"+sd],k=J["k"+sd],h=J["h"+sd]
  limb(c,k,f,.14,"Z");limb(c,h,k,.17,"z")
  c.rect(R(f[0]-3),R(f[1]-1),6,2,"s");c.px(R(f[0]-3),R(f[1]-1),"E")}
 /* thân: áo bà ba (ngược nắng nên nghiêng về tông tối), eo thắt, vạt áo xoè nhẹ */
 const mx=(J.sL[0]+J.sR[0])/2,sy=J.sL[1],hy=J.hL[1]+8
 poly(c,[[J.sL[0]-1,sy],[J.sR[0]+1,sy],[J.hR[0]+3,hy],[J.hL[0]-3,hy]],o.top)
 poly(c,o.light>0?[[mx,sy],[J.sL[0]-1,sy],[J.hL[0]-3,hy],[mx,hy]]:[[mx,sy],[J.sR[0]+1,sy],[J.hR[0]+3,hy],[mx,hy]],o.topShade)
 ln(c,[mx,sy+2],[mx,hy-1],o.topShade);c.hline(R(J.hL[0]-3),hy,R(J.hR[0]-J.hL[0]+7),o.topShade)
 /* gáy + búi tóc dưới vành nón */
 const nk=J.nk
 c.rect(R(nk[0]-2),R(nk[1]-3),5,4,"s");c.hline(R(nk[0]-2),R(nk[1]-3),5,"E")
 c.circ(R(nk[0]),R(nk[1]-6),4,"k");c.px(R(nk[0]+1),R(nk[1]-8),"o");c.px(R(nk[0]-2),R(nk[1]-5),"o")
 /* khăn rằn quanh cổ: ô vuông so le */
 for(let i=-4;i<=4;i++)for(let j=0;j<3;j++)c.px(R(nk[0]+i),R(nk[1]+j),(i+j)&1?"w":"m")
 /* tay: vai -> khuỷu -> cán chèo; mép tay áo tối để tách khỏi thân */
 for(const sg of[-1,1]){const sh=sg<0?J.sL:J.sR,hand=PR(-sg*.10,o.vh,o.hh),el=PR(sg*.28,vr+.15+lean,1.14-bob*.5)
  limb(c,sh,el,.105,o.top);limb(c,el,hand,.085,o.top)
  ln(c,[el[0]-sg*2,el[1]+2],[hand[0],hand[1]+1],o.topShade);c.circ(R(hand[0]),R(hand[1]),1,"s")}
 /* nón lá: vành tròn đáy, chóp nhọn, đường nan toả từ chóp */
 const hv=vr+.08+lean,hc=PR(0,hv,1.66-dip),ap=PR(0,hv,1.98-dip)
 const rx=R(.34*hc[2]),ry=Math.max(2,R(.11*hc[2]))
 c.ellipse(R(hc[0]),R(hc[1]+1),rx,ry,"j")
 poly(c,[[hc[0]-rx,hc[1]],[ap[0],ap[1]],[hc[0]+rx,hc[1]]],"t")
 poly(c,o.light>0?[[hc[0]+1,hc[1]],[ap[0],ap[1]],[hc[0]+rx,hc[1]]]:[[hc[0]-1,hc[1]],[ap[0],ap[1]],[hc[0]-rx,hc[1]]],"u")
 c.ellipse(R(hc[0]),R(hc[1]),rx,ry,"h");poly(c,[[hc[0]-rx+1,hc[1]],[ap[0],ap[1]],[hc[0]+rx-1,hc[1]]],"t")
 poly(c,o.light>0?[[hc[0]+1,hc[1]],[ap[0],ap[1]],[hc[0]+rx-1,hc[1]]]:[[hc[0]-1,hc[1]],[ap[0],ap[1]],[hc[0]-rx+1,hc[1]]],"u")
 for(let k=-3;k<=3;k++)ln(c,[hc[0]+k*(rx/3.4),hc[1]],[ap[0]+k*.15,ap[1]+4],"p")
 c.hline(R(hc[0]-rx+1),R(hc[1]+ry),2*rx-1,"j");c.px(R(ap[0]),R(ap[1]),"q")
 return J}

/* mái chèo: cán xỏ qua cọc chèo trên mạn; tay đẩy ra trước -> lưỡi quét ra sau trong nước, rồi nhấc lưỡi, đưa tay về */
const oars=(c,o,p,drive)=>{
 const vp=1.40,hp=.55
 for(const sg of[-1,1]){
  const t=vp/L,piv=PR(sg*(hw(t)*1.06),vp,hp)
  const hand=PR(-sg*.10,o.vh,o.hh)
  const kk=1.3
  const bu=sg*hw(t)*1.06+(sg*hw(t)*1.06+sg*.10)*kk,bv=vp+(vp-o.vh)*kk,bh=drive?hp+(hp-o.hh)*kk:hp+(hp-o.hh)*kk+.30
  const bl=PR(bu,bv,bh)
  /* cọc chèo */
  ln(c,PR(sg*hw(t)*1.06,vp,sheer(t)-.02),piv,"Z",1);c.px(R(piv[0]),R(piv[1]-1),"B")
  /* cán */
  ln(c,hand,piv,"t",2);ln(c,piv,bl,"h",2)
  c.px(R(hand[0]),R(hand[1]-1),"u")
  /* lưỡi */
  const ax=bl[0]-piv[0],ay=bl[1]-piv[1],m=Math.hypot(ax,ay)||1,ux=ax/m,uy=ay/m,w=Math.max(2,R(.09*bl[2]))
  const e=[bl[0]+ux*R(.5*bl[2]),bl[1]+uy*R(.2*bl[2])]
  poly(c,[[bl[0]-uy*w,bl[1]+ux*w],[bl[0]+uy*w,bl[1]-ux*w],[e[0]+uy*w,e[1]-ux*w],[e[0]-uy*w,e[1]+ux*w]],drive?"j":"t")
  ln(c,bl,e,drive?"B":"u",1)
  /* gợn nước quanh lưỡi chèo đang ăn nước */
  if(drive){const r1=R(3+p*5);c.hline(R(e[0]-r1),R(e[1]+2),r1*2,"K");c.hline(R(e[0]-r1+2),R(e[1]+3),r1*2-4,"I")}
  else c.px(R(e[0]),R(e[1]+4),"W")
 }}

const rim=(c,o)=>{const key="RruwcEshtpujq",lit=[]
 for(let y=1;y<c.h-1;y++)for(let x=1;x<c.w-1;x++){if(!c.is(x,y,key))continue
  if(c.is(x+o.light,y,"."))lit.push([x,y,"Y"]);else if(c.is(x,y-1,"."))lit.push([x,y,"y"])}
 lit.forEach(([x,y,k])=>c.px(x,y,k))}
const rowBody=(o0)=>(c)=>{
 const o=Object.assign({skin:'v',skinSh:'V',rim:'q'},o0)
 const ph=((c.frame-2+8)%8)/8,drive=ph<.5,u=drive?ph*2:(ph-.5)*2,e=ease(u),p=drive?e:1-e
 o.vh=.95+.60*p;o.hh=drive?1.02-.03*p:1.0+.10*Math.sin(Math.PI*u)
 hull(c,o)
 if(o.pre)o.pre(c)
 oars(c,o,p,drive)
 person(c,o,p,ph)
 /* vệt nước rẽ ở mũi gần */
 const tw=PR(0,-.05,0);c.hline(R(tw[0]-9),R(tw[1]+2),18,"K");c.hline(R(tw[0]-6),R(tw[1]+3),12,"I");c.hline(R(tw[0]-13),R(tw[1]+1),5,"L");c.hline(R(tw[0]+9),R(tw[1]+1),5,"L")
 rim(c,o)
}
const XQ={light:-1,top:"v",topShade:"V",skin:"Z",skinSh:"z",rim:"t",pre:(c)=>{
 /* bó tràm trắng nằm dọc ván đáy, buộc dây giữa; nơm đan úp cạnh mạn */
 for(let i=-2;i<=2;i++){const a=PR(i*.07+.10,2.0,.16),b=PR(i*.06+.10,3.5,.16);ln(c,a,b,i%2?"A":"G",2)}
 const m1=PR(.10,2.7,.19),m2=PR(.10,2.76,.19);ln(c,[m1[0]-6,m1[1]],[m1[0]+6,m1[1]],"l",1)
 const n0=PR(-.22,2.0,.12),n1=PR(-.22,2.0,.80);const bw=R(.20*n0[2]);poly(c,[[n0[0]-bw,n0[1]],[n0[0]+bw,n0[1]],[n1[0],n1[1]]],"u");ln(c,[n0[0]+2,n0[1]],n1,"t");ln(c,[n0[0]-bw,n0[1]],n0,"j")}}
anim("row_ben_tre",{w:148,h:122,frames:8,fps:8,outline:"o"},rowBody({light:1,top:"R",topShade:"r"}))
anim("row_xeo_quyt",{w:148,h:122,frames:8,fps:8,outline:"o"},rowBody(XQ))

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
 c.poly([hx-bw,hipY+m(1),hx+bw,hipY+m(1),sx+m(3.4),shY,sx-m(3.4),shY].map(R),o.top)
 c.poly([hx-bw,hipY+m(1),hx-m(1),hipY+m(1),sx-m(1),shY,sx-m(3.4),shY].map(R),o.topShade)
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
 c.poly([bx-m(9),by+m(1.4),bx+m(.8),by-m(6),bx+m(9.5),by+m(1.4)].map(R),"t")
 c.poly([bx+m(.8),by-m(6),bx+m(9.5),by+m(1.4),bx+m(1),by+m(1.4)].map(R),"u")
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
 c.poly([...A,...B.reverse()].flatMap(([a,b])=>[R(a),R(b)]),o.hull)
 for(let i=0;i<=n;i++){const t=i/n,a=top(t),b=bot(t);c.vline(x0+i,R(a),hh>8?2:1,o.rim);if(hh>8){c.vline(x0+i,R(a+2),R((b-a)*.4),o.hull2);c.vline(x0+i,R(b-2),2,o.hull3)}else c.vline(x0+i,R(b-1),1,o.hull3)}
 if(hh>8)for(let i=0;i<=n;i+=7){const t=i/n;c.vline(x0+i,R(top(t)+3),R((bot(t)-top(t))*.6),o.hull3)}
 if(hh>8)c.hline(x0+2,R(yw+2),n-3,"N")
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
 c.poly([bl[0]-3,bl[1]-2,bl[0]+3,bl[1]-2,bl[0]+4,bl[1]+4,bl[0]-4,bl[1]+4].map(R),"t");c.hline(bl[0]-4,bl[1]+5,9,"K");c.hline(bl[0]-6,bl[1]+6,13,"I")
}
anim("row_nga_nam",{w:146,h:96,frames:8,fps:8,outline:"o"},NNFRAME)

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
