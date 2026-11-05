/* ===== CUTSCENE MỞ ĐẦU – dựng như phim điện ảnh =====
   Thay vì một cảnh phóng to từ từ, đây là một chuỗi CÚ MÁY (shot) có góc máy, chuyển động camera và chuyển cảnh riêng:
   toàn cảnh → trung cảnh → cận cảnh → chi tiết (insert) → góc ngược (reverse), dựng theo nhịp lời thoại.
   Kỹ thuật chính:
   - Camera 3D giả (thế giới 320x180): mỗi lớp có "độ sâu" q → khi camera tiến/lùi/lia, lớp gần dịch nhiều hơn lớp xa (thị sai).
   - Lớp tranh được vẽ sẵn ở độ phóng đại cố định rồi phóng bằng nội suy tuyến tính, vị trí KHÔNG làm tròn -> không rung/bơi.
   - Ánh sáng thật: quầng sáng, tia sáng mềm xuyên cửa sổ, bụi lơ lửng, quạt trần, bloom, anamorphic flare, hạt phim, vignette. */
const CIN=(()=>{
const c=$('cin'),fx=c.getContext('2d'),SB=$('sub'),CE=$('cine');
const mk=()=>{const e=document.createElement('canvas');return[e,e.getContext('2d')]};
const[wk,x]=mk(),[sn,sx]=mk();               // wk: khung "thế giới" chưa hậu kỳ · sn: ảnh chụp khung cuối khi chuyển cảnh
const bl=[2,4,8,16].map(d=>{const[e,g]=mk();return{e,g,d}});   // chuỗi thu nhỏ để làm bloom ổn định (không nhấp nháy)
const gr=document.createElement('canvas');gr.width=gr.height=160;
{const g=gr.getContext('2d'),id=g.createImageData(160,160);for(let i=0;i<id.data.length;i+=4){const v=128+(Math.random()-.5)*150|0;id.data[i]=id.data[i+1]=id.data[i+2]=v;id.data[i+3]=255}g.putImageData(id,0,0)}
const grp=fx.createPattern(gr,'repeat');
const VW=CA.VW,VH=CA.VH;
const cl=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),mix=(a,b,k)=>a+(b-a)*k,ez=v=>v*v*(3-2*v),asym=(u,t)=>1-Math.exp(-u/t),
 hh=n=>{const s=Math.sin(n*127.1+311.7)*43758.5;return s-Math.floor(s)};
let W=0,H=0,S0=1,bar=0,shY=0,t0=0,run=0,A,ls=-1,si=-1,pro=0,pd=0,cur=null,curN='',curT0=0,TT=0,trans=null,errOnce=0,inLib=0;
const rs=()=>{W=c.width=wk.width=sn.width=Math.max(2,innerWidth);H=c.height=wk.height=sn.height=Math.max(2,innerHeight);S0=Math.max(W/VW,H/VH);
 bar=Math.round(cl((H-W/2.39)/2,H*.07,H*.2));CE.style.setProperty('--bar',bar+'px');
 bl.forEach(b=>{b.e.width=Math.max(2,Math.round(W/b.d));b.e.height=Math.max(2,Math.round(H/b.d))});
 for(const g of[fx,x,sx]){g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high'}};
rs();addEventListener('resize',rs);

/* ---------- Phụ đề (giữ nguyên nội dung) ---------- */
const SUB0=[[1,5,'','Tiếng quạt trần quay đều. Ánh nắng cuối ngày nằm nghiêng trên những dãy kệ.'],[5.5,9.5,'AN','“Kỳ lạ thật. Danh mục ghi còn một bản mà tìm ba vòng vẫn không thấy.”'],[9.5,13,'CÔ HẠNH','“Nhẹ tay thôi, gáy sách mục nhiều lắm.”'],[13.3,19,'','Không phải phần nội dung in, mà chính những ghi chú bên lề mới khiến An chú ý.'],[20.5,24.5,'EMMA','“Cậu có nghĩ người ghi những dòng bên lề muốn ai đó đọc được chúng không?”'],[24.5,28.5,'AN','“Có sơ đồ không có nghĩa là có mật mã. Mình đến nơi rồi xem đã.”'],[29.5,33.5,'','Không có ánh sáng kỳ lạ, không có tiếng gọi bí ẩn. Chỉ có hàng cây, mặt nước và một không gian yên tĩnh.'],[33.5,36.5,'','“Hãy bắt đầu bằng sự kính trọng.”']];
const SUB=[[1.2,4.6,'','Có những dòng sông không chỉ chở nước. Chúng chở phù sa, và cả những điều người ta chưa kịp viết thành chữ.'],[5.2,8.4,'','Ở miền Tây, ký ức đi qua nhiều đời: qua mái chèo, qua lời má kể, qua những cái tên rơi rớt giữa dòng.'],[8.8,11.8,'','Và đôi khi, nó nằm lại bên lề một cuốn sách cũ.'],...SUB0.slice(3).map(q=>[q[0]+12,q[1]+12,q[2],q[3]])];

/* ---------- Camera & vẽ lớp ---------- */
const idt=()=>x.setTransform(1,0,0,1,0,0);
/* q = độ sâu của lớp (xa <1 · mặt phẳng nhân vật 1 · gần >1). Trả về tỉ lệ và tâm nhìn của lớp đó. */
const tf=(q,cam)=>{const s=S0*(1+(cam.z-1)*q);return{s,cx:VW/2+(cam.x-VW/2)*q,cy:VH/2+(cam.y-VH/2)*q}};
const place=(q,cam)=>{const t=tf(q,cam);x.setTransform(t.s,0,0,t.s,W/2-t.cx*t.s,H/2+shY-t.cy*t.s);return t};
const blit=(L,q,cam,al=1,dx=0,dy=0)=>{if(!L||al<=0)return;const t=tf(q,cam);x.globalAlpha=al;x.drawImage(L.cv,W/2+(L.ox+dx-t.cx)*t.s,H/2+shY+(L.oy+dy-t.cy)*t.s,L.w*t.s,L.h*t.s);x.globalAlpha=1};
const blitR=(L,q,cam,wx,wy,ww,wh)=>{const t=tf(q,cam);x.drawImage(L.cv,W/2+(wx-t.cx)*t.s,H/2+shY+(wy-t.cy)*t.s,ww*t.s,wh*t.s)};
const wpos=(q,cam,wx,wy)=>{const t=tf(q,cam);return[W/2+(wx-t.cx)*t.s,H/2+shY+(wy-t.cy)*t.s,t.s]};
const glowS=(cx,cy,r,col,a)=>{if(a<=0)return;const g=x.createRadialGradient(cx,cy,0,cx,cy,r);g.addColorStop(0,`rgba(${col},${a})`);g.addColorStop(1,`rgba(${col},0)`);x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='lighter';x.fillStyle=g;x.fillRect(cx-r,cy-r,2*r,2*r);x.restore()};
/* flare ống kính anamorphic: vệt ngang + các vòng sáng "ma" nằm trên trục nguồn sáng–tâm khung hình */
function flareAt(wx,wy,a){if(a<=0)return;x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='lighter';
 x.save();x.translate(wx,wy);x.scale(1,.045);const g=x.createRadialGradient(0,0,0,0,0,W*.55);g.addColorStop(0,`rgba(255,222,165,${.55*a})`);g.addColorStop(.25,`rgba(255,200,130,${.2*a})`);g.addColorStop(1,'rgba(255,200,130,0)');x.fillStyle=g;x.fillRect(-W,-W,2*W,2*W);x.restore();
 [[.5,.06,'255,170,100'],[1.35,.09,'190,215,255'],[1.8,.05,'255,205,140']].forEach(([k,r,col])=>glowS(wx+(W/2-wx)*k,wy+(H/2-wy)*k,H*r*2.4,col,.16*a));x.restore()}

/* ---------- Thế giới: SÔNG ---------- */
function dRiver(sh,cam,u,T){
 x.fillStyle='#0b1022';x.fillRect(0,0,W,H);
 const sky=CA.img('river_sky'),far=CA.img('river_far'),wat=CA.img('river_water'),bts=CA.img('river_boats'),e=sh.sun?sh.sun(u):0;
 blit(sky,.7,cam);{const[sxp,syp,s]=wpos(.7,cam,200,88);glowS(sxp,syp,s*(70+110*e),'255,205,130',.4+.5*e)}
 blit(far,.8,cam);
 /* sương mỏng ở chân trời */
 place(.85,cam);{x.globalCompositeOperation='lighter';const g=x.createLinearGradient(0,92,0,118);g.addColorStop(0,'rgba(255,190,130,0)');g.addColorStop(.45,'rgba(255,190,130,.16)');g.addColorStop(1,'rgba(255,190,130,0)');x.fillStyle=g;x.fillRect(-80,92,480,26);x.globalCompositeOperation='source-over'}idt();
 blit(wat,.9,cam);
 /* ánh nắng lấp lánh trên mặt nước (vị trí liên tục, không làm tròn) */
 place(.9,cam);x.globalCompositeOperation='lighter';
 for(let i=0;i<64;i++){const y=104+hh(i)*74,k=(y-100)/80,xx=200+(hh(i+9)-.5)*(26+k*120)+Math.sin(T*.5+i)*1.6,len=5+hh(i+2)*(10+k*34),a=(.1+.5*hh(i+3))*Math.pow(.5+.5*Math.sin(T*(1.1+hh(i)*1.4)+i*5),2)*(1-k*.4)*(1+e);
  x.fillStyle=`rgba(255,214,150,${a})`;x.fillRect(xx-len/2,y,len,.55+hh(i+8)*.8)}
 x.globalCompositeOperation='source-over';idt();
 blit(bts,1,cam,1,Math.sin(T*.33)*1.8,Math.sin(T*.9)*.12);
 /* chim */
 place(.85,cam);x.strokeStyle='#0a0b16';x.lineWidth=.9;x.lineCap='round';
 for(let i=0;i<8;i++){const bx=(((i*53-T*(4+hh(i)*4))%380)+380)%380-30,by=24+hh(i+3)*40+Math.sin(T*.6+i)*2.5,w=Math.sin(T*7+i*2)*2.2;x.beginPath();x.moveTo(bx-4.5,by+w);x.lineTo(bx,by);x.lineTo(bx+4.5,by+w);x.stroke()}idt();
 /* lau sậy tiền cảnh (rất gần, mờ nhẹ) tạo chiều sâu */
 place(2.1,cam);x.strokeStyle='#04050b';x.lineCap='round';x.shadowColor='#04050b';x.shadowBlur=14;
 for(let i=0;i<20;i++){const bx=i*17+hh(i)*9-8,h=26+hh(i+4)*40,sw=Math.sin(T*.7+i*1.7)*2.4+Math.sin(T*.31+i)*1.2,lean=(hh(i+2)-.5)*14;x.lineWidth=.9+hh(i+7)*.9;x.beginPath();x.moveTo(bx,196);x.quadraticCurveTo(bx+sw*.3+lean*.3,196-h*.6,bx+lean+sw,196-h);x.stroke()}
 x.shadowBlur=0;idt();
 if(sh.flare)flareAt(...wpos(.7,cam,200,88).slice(0,2),sh.flare(u));
}

/* ---------- Thế giới: THƯ VIỆN ---------- */
function shafts(cam,T,I,feather){place(.86,cam);x.globalCompositeOperation='lighter';
 for(let j=0;j<6;j++){const xl=127+j*11.5,xr=xl+9.4,bx=l=>142+(l-160)*2.25,k=[1,.7,1,.62,1,.8][j]*(.92+.08*Math.sin(T*.55+j*1.3));
  const g=x.createLinearGradient(0,104,0,178);g.addColorStop(0,`rgba(255,224,165,${.22*I*k})`);g.addColorStop(.5,`rgba(255,206,132,${.08*I*k})`);g.addColorStop(1,'rgba(255,190,110,0)');x.fillStyle=g;
  for(const e of feather?[6,0]:[0]){x.globalAlpha=e?.38:1;x.beginPath();x.moveTo(xl-e*.45,104);x.lineTo(xr+e*.45,104);x.lineTo(bx(xr)+e,178);x.lineTo(bx(xl)-e,178);x.fill()}}
 x.globalAlpha=1;x.globalCompositeOperation='source-over';idt()}
function fan(cam,T){place(.92,cam);x.fillStyle='#0f0804';x.fillRect(159,-30,2,36);x.beginPath();x.ellipse(160,8,6,2.4,0,0,7);x.fill();const a=T*2.1;
 for(let g=0;g<3;g++){x.globalAlpha=g?.2:1;x.save();x.translate(160,9.5);x.scale(1,.15);for(let k=0;k<4;k++){x.save();x.rotate(a+k*Math.PI/2-g*.1);x.fillRect(4,-3.4,52,6.8);x.restore()}x.restore()}
 x.globalAlpha=1;idt()}
function dust(cam,T,cone){place(.9,cam);x.globalCompositeOperation='lighter';
 for(let i=0;i<64;i++){const y=26+((hh(i+7)*150-T*(.8+hh(i+2)*1.3))%150+150)%150,c0=160-(y-30)*.14,px=c0+(hh(i)-.5)*(cone*1.2+(y-26)*.55)+Math.sin(T*.21+i)*4,m=Math.exp(-Math.pow((px-c0)/(cone*.7+(y-26)*.4),2)),a=(.2+.6*hh(i+11))*m*(.65+.35*Math.sin(T*1.6+i*2.3));
  if(a<.03)continue;x.fillStyle=`rgba(255,236,196,${a})`;x.beginPath();x.arc(px,y,.45+hh(i+5)*.7,0,7);x.fill()}
 idt();place(1.7,cam);for(let i=0;i<12;i++){const px=hh(i+30)*320,y=40+((hh(i+33)*140-T*(1.5+hh(i)*2))%140+140)%140,r=3+hh(i+8)*5;x.fillStyle=`rgba(255,226,170,${.04+.05*hh(i+9)})`;x.beginPath();x.arc(px+Math.sin(T*.3+i)*6,y,r,0,7);x.fill()}
 x.globalCompositeOperation='source-over';idt()}
function dLib(sh,cam,u,T){const A=CA.lib,I=sh.light??1;
 x.fillStyle='#120a05';x.fillRect(0,0,W,H);
 const f=sh.focus??.2;blit(A.wallBlur,.8,cam);blit(A.wall,.8,cam,1-f);
 {const[wx,wy,s]=wpos(.86,cam,160,56);glowS(wx,wy,s*150,'255,205,130',.17*I)}
 shafts(cam,T,I,1);fan(cam,T);
 blit(A.an,1,cam,1,0,Math.sin(T*1.1)*.1);blit(A.hanh,1,cam,1,0,Math.sin(T+1)*.1);
 blit(A.desk,1.08,cam);
 /* ánh sáng rọi lên mặt bàn và trang sách */
 place(1.08,cam);x.globalCompositeOperation='lighter';
 {const g=x.createLinearGradient(0,132,0,192);g.addColorStop(0,`rgba(255,205,130,${.15*I})`);g.addColorStop(1,'rgba(255,190,110,.04)');x.fillStyle=g;x.beginPath();x.moveTo(112,132);x.lineTo(212,132);x.lineTo(300,192);x.lineTo(30,192);x.fill();
  const r=x.createRadialGradient(160,128,2,160,128,46);r.addColorStop(0,`rgba(255,226,170,${.09*I})`);r.addColorStop(1,'rgba(255,226,170,0)');x.fillStyle=r;x.fillRect(100,80,120,80)}
 x.globalCompositeOperation='source-over';idt();
 shafts(cam,T,I*.18,0);dust(cam,T,60);
 if(sh.flare){const[wx,wy]=wpos(.86,cam,160,56);flareAt(wx,wy,sh.flare)}
 if(sh.dim)dim(sh.dim(u))}
const dim=a=>{x.fillStyle=`rgba(8,10,28,${a})`;x.fillRect(0,0,W,H)};

/* ---------- Thế giới: CỬA RA VÀO (góc ngược, Emma & Khoa bước vào) ---------- */
function dDoor(sh,cam,u,T){const A=CA.door;x.fillStyle='#0d0805';x.fillRect(0,0,W,H);
 const f=sh.focus??.3;blit(A.wallBlur,.8,cam);blit(A.wall,.8,cam,1-f);
 {const[wx,wy,s]=wpos(.86,cam,160,76);glowS(wx,wy,s*135,'255,235,190',.26)}
 place(.9,cam);x.globalCompositeOperation='lighter';{const g=x.createLinearGradient(0,124,0,200);g.addColorStop(0,'rgba(255,230,170,.36)');g.addColorStop(1,'rgba(255,210,140,0)');x.fillStyle=g;x.beginPath();x.moveTo(128,124);x.lineTo(192,124);x.lineTo(270,200);x.lineTo(50,200);x.fill()}x.globalCompositeOperation='source-over';idt();
 const k=sh.walk(u);
 [[A.emma,150,134,0],[A.khoa,172,190,.5]].forEach(([L,x0,x1,ph],n)=>{const sc=mix(.8,1.04,k),fy=mix(123,138,k),fxp=mix(x0,x1,k),bob=k<1?Math.abs(Math.sin(u*6+ph*3))*.9:Math.sin(T*1.1+n)*.12;blitR(L,1,cam,fxp-22*sc,fy-86*sc-bob,44*sc,86*sc)});
 dust(cam,T,70);
 const[wx,wy]=wpos(.86,cam,160,76);flareAt(wx,wy,.35);if(sh.dim)dim(sh.dim(u))}

/* ---------- Thế giới: ĐƯỜNG ---------- */
/* Người đạp xe (bóng ngược sáng, bánh xe quay) vẽ bằng vector để quay cận cảnh */
function bike(cx,cy,s,ph){x.save();x.strokeStyle=x.fillStyle='#07080f';x.lineCap='round';x.lineWidth=s*.035;
 [-.5,.5].forEach(o=>{x.beginPath();x.arc(cx+o*s,cy,s*.2,0,7);x.stroke();x.save();x.translate(cx+o*s,cy);x.rotate(ph);x.lineWidth=Math.max(1,s*.008);for(let k=0;k<3;k++){x.rotate(1.05);x.beginPath();x.moveTo(-s*.2,0);x.lineTo(s*.2,0);x.stroke()}x.restore();x.lineWidth=s*.035});
 x.beginPath();x.moveTo(cx-.5*s,cy);x.lineTo(cx-.3*s,cy-.3*s);x.lineTo(cx+.25*s,cy-.3*s);x.lineTo(cx+.4*s,cy-.05*s);x.lineTo(cx+.5*s,cy);x.lineTo(cx+.3*s,cy-.1*s);x.lineTo(cx-.2*s,cy-.05*s);x.fill();
 x.beginPath();x.arc(cx-.02*s,cy-.88*s,s*.11,0,7);x.fill();
 x.beginPath();x.moveTo(cx-.2*s,cy-.3*s);x.quadraticCurveTo(cx-.15*s,cy-.8*s,cx+.05*s,cy-.76*s);x.lineTo(cx+.3*s,cy-.5*s);x.lineTo(cx+.3*s,cy-.42*s);x.lineTo(cx+.1*s,cy-.6*s);x.lineTo(cx,cy-.3*s);x.fill();x.restore();
 glowS(cx+.7*s,cy-.1*s,s*1.1,'255,230,170',.22)}
function dRoad(sh,cam,u,T){x.fillStyle='#10111a';x.fillRect(0,0,W,H);
 const sk=CA.img('road',0,62),rd=CA.img('road',52,90),e=sh.sun?sh.sun(u):0;
 blit(sk,.7,cam);const[sxp,syp,s]=wpos(.7,cam,208,88);glowS(sxp,syp,s*(80+70*e),'255,205,130',.4+.45*e);
 blit(rd,1.05,cam);
 place(1.05,cam);x.globalCompositeOperation='lighter';
 for(let i=0;i<22;i++){const y=120+hh(i)*58,xx=((i*43-T*(160+hh(i)*170))%470+470)%470-70,len=14+hh(i+3)*46;x.fillStyle=`rgba(238,226,196,${.05+.15*hh(i+5)})`;x.fillRect(xx,y,len,.5+hh(i+7)*.8)}
 x.globalCompositeOperation='source-over';idt();
 if(sh.bikes)[[.3,.8,.2,1],[.5,.76,.19,2],[.7,.73,.18,3]].forEach(([a,b,sz,k])=>bike(W*a+Math.sin(T*.6+k)*H*.015,H*b+shY+Math.sin(T*1.7+k*2)*H*.003,H*sz,T*16));
 if(sh.flare)flareAt(sxp,syp,sh.flare(u));
 if(sh.white){const a=sh.white(u);if(a>0){x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,226,180,${a})`;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}}}

/* ---------- Thế giới: CỔNG + TIÊU ĐỀ ---------- */
function title(u){if(u<=6.5)return;x.fillStyle=`rgba(5,5,12,${.62*ez(cl((u-6.5)/2))})`;x.fillRect(0,0,W,H);
 const sz=Math.min(W*.11,130),T1='PHÙ SA KÝ',ty=H*.44+shY;x.font=`700 ${sz}px "Playfair Display",Georgia,serif`;x.textBaseline='middle';x.textAlign='left';
 const sp=sz*.14,ws=[...T1].map(ch=>x.measureText(ch).width),tw=ws.reduce((a,b)=>a+b+sp,0)-sp;let px=(W-tw)/2;
 [...T1].forEach((ch,i)=>{x.globalAlpha=ez(cl((u-7-i*.13)/.9));x.fillStyle='#f3e6bd';x.fillText(ch,px,ty);px+=ws[i]+sp});
 x.globalAlpha=ez(cl((u-8.8)/1.2));x.fillStyle='#e0b25a';x.fillRect(W/2-tw*.25*x.globalAlpha,ty+sz*.62,tw*.5*x.globalAlpha,1.5);
 x.textAlign='center';x.fillStyle='#f3e6bd';x.font=`italic ${sz*.2}px "Playfair Display",serif`;x.fillText('Những điều dòng nước không cuốn đi',W/2,ty+sz*.95);
 x.globalAlpha=ez(cl((u-10.5)/1));x.font=`${Math.max(13,sz*.13)}px "Pixelify Sans",sans-serif`;x.fillStyle='#e0b25a';x.fillText('Chương 1 — Dấu mực bên lề',W/2,ty+sz*1.45);x.globalAlpha=1;x.textAlign='left'}
function dGate(sh,cam,u,T){x.fillStyle='#0b0f22';x.fillRect(0,0,W,H);
 blit(CA.img('gate',0,58),.8,cam);blit(CA.img('gate',50,90),1.05,cam);
 place(1.05,cam);x.globalCompositeOperation='lighter';
 for(let i=0;i<70;i++){const y=122+hh(i)*60,xx=hh(i+4)*360-20+Math.sin(T*.4+i)*3,len=6+hh(i+2)*28,a=(.05+.16*hh(i+6))*(.5+.5*Math.sin(T*(.8+hh(i)*1.2)+i*4));x.fillStyle=`rgba(255,205,150,${a})`;x.fillRect(xx,y,len,.55+hh(i+8)*.8)}
 for(let i=0;i<30;i++){const px=hh(i)*330-5+Math.sin(T*.4+i*2)*9,py=104+hh(i+3)*70+Math.cos(T*.5+i)*5,a=Math.pow(.5+.5*Math.sin(T*(1+hh(i+9))+i*3),3);x.fillStyle=`rgba(255,238,170,${.16*a})`;x.beginPath();x.arc(px,py,2.8,0,7);x.fill();x.fillStyle=`rgba(255,244,190,${.9*a})`;x.beginPath();x.arc(px,py,.75,0,7);x.fill()}
 x.globalCompositeOperation='source-over';idt();
 title(u)}

/* ---------- Thế giới: TRANG SÁCH (cận cảnh ghi chú bên lề) ---------- */
function dBook(sh,cam,u,T){u=Math.min(u,9);
 let g=x.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.7);g.addColorStop(0,'#4a2e16');g.addColorStop(1,'#0d0805');x.fillStyle=g;x.fillRect(0,0,W,H);
 const bw=Math.min(W*.86,1000),bh=Math.min(H*.74,bw*.62),X=(W-bw)/2,Y=(H-bh)/2;
 const P1=[X+bw*.56+bw*.1,Y+bh*.3],P2=[X+bw*.27,Y+bh*.87],P3=[X+bw*.6,Y+bh*.62];
 const k1=ez(cl(u/2.8)),k2=ez(cl((u-3.8)/1.6)),k3=ez(cl((u-5.5)/1.5)),fxp=mix(mix(mix(W/2,P1[0],k1),P2[0],k2),P3[0],k3),fyp=mix(mix(mix(H/2,P1[1],k1),P2[1],k2),P3[1],k3),z=mix(mix(mix(1,1.8,k1),1.55,k2),1.95,k3);
 x.save();x.translate(W/2,H/2+shY);x.scale(z,z);x.rotate(-.012+.01*cl(u/8));x.translate(-fxp,-fyp);
 x.fillStyle='rgba(0,0,0,.5)';x.fillRect(X+10,Y+14,bw,bh);
 for(const s of[0,1]){g=x.createLinearGradient(X+bw/2,0,s?X+bw:X,0);g.addColorStop(0,'#c9b27c');g.addColorStop(.12,'#ecdcae');g.addColorStop(1,'#f3e6bd');x.fillStyle=g;x.fillRect(s?X+bw/2:X,Y,bw/2,bh)}
 x.fillStyle='rgba(60,40,20,.28)';for(let s=0;s<2;s++)for(let i=0;i<13;i++)x.fillRect(X+bw*(s?.55:.06),Y+bh*.1+i*bh*.058,bw*.37*(.7+hh(i+s*20)*.3),3);
 const note=(t,px,py,t1,d,sz,col)=>{const k=ez(cl((u-t1)/d));if(k<=0)return 0;x.font=`500 ${sz}px Caveat,cursive`;const w=x.measureText(t).width;x.save();x.beginPath();x.rect(px-4,py-sz,w*k+8,sz*1.5);x.clip();x.fillStyle=col;x.fillText(t,px,py);x.restore();return w};
 const s1=bh*.075,w1=note('Hòa An – 1927 đến 1929',X+bw*.56,Y+bh*.3,1,1.6,s1,'#6b3a14');
 const k=ez(cl((u-2.8)/1));if(k>0){x.strokeStyle='#8b2a1c';x.lineWidth=2.5;x.beginPath();x.ellipse(X+bw*.56+w1/2,Y+bh*.3-s1*.3,w1/2+16,s1*.8,-.04,0,k*6.28);x.stroke()}
 const s2=bh*.05;note('Bắt đầu từ nơi người dân',X+bw*.07,Y+bh*.84,3.4,1.5,s2,'#3d4f7a');note('Đồng Tháp gửi lòng biết ơn.',X+bw*.07,Y+bh*.9,4.5,1.5,s2,'#3d4f7a');
 const w3=note('Người lái đò',X+bw*.56,Y+bh*.62,5,1,s1,'#4a3020');
 if(u>6){x.strokeStyle='#8b2a1c';x.lineWidth=2;x.beginPath();x.moveTo(X+bw*.56,Y+bh*.6);x.lineTo(X+bw*.56+w3*ez(cl(u-6)),Y+bh*.6);x.stroke();x.font=`${s1*1.4}px Caveat`;x.fillStyle='#8b2a1c';x.globalAlpha=cl(u-6.4);x.fillText('?',X+bw*.56+w3+10,Y+bh*.62);x.globalAlpha=1}
 if(u<5.5){x.save();x.translate(X+bw*.7+Math.sin(u*2)*30,Y-40+u*H*.14);x.rotate(u*2);x.fillStyle='rgba(214,120,150,.9)';x.beginPath();x.ellipse(0,0,18,8,0,0,7);x.fill();x.restore()}
 x.restore();
 x.globalCompositeOperation='multiply';g=x.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,W*.62);g.addColorStop(0,'rgba(255,240,215,1)');g.addColorStop(1,'rgba(110,70,35,1)');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
 glowS(W*.86,H*.1,W*.6,'255,205,140',.07+.02*Math.sin(T*.8));dust({x:160,y:90,z:1},T,60)}

/* ---------- Danh sách cú máy ---------- */
const lin=(a,b,u,D)=>mix(a,b,cl(u/D));
const SH={
 /* Sông */
 riv1:{w:dRiver,act:0,bloom:.55,cam:u=>({x:lin(146,174,u,4.6),y:lin(108,99,u,4.6),z:lin(1.38,1.5,u,4.6)})},
 riv2:{w:dRiver,act:0,bloom:.55,cam:u=>({x:lin(112,208,u,4.2),y:94,z:1.58})},
 riv3:{w:dRiver,act:0,bloom:.8,sun:u=>Math.pow(cl(u/4),2),flare:u=>.25+.75*Math.pow(cl(u/4),2),white:u=>Math.pow(cl((u-3.1)/.9),2),
  cam:u=>{const e=Math.pow(cl(u/4),2);return{x:mix(178,198,e),y:mix(96,88,e),z:mix(1.3,2.6,e)}}},
 /* Thư viện: toàn cảnh mở đầu (kéo lùi từ ô cửa sáng), toàn cảnh thường, nhân vật, chi tiết */
 libA:{w:dLib,act:1,focus:.2,bloom:.8,flare:.7,light:1.15,cam:u=>{const r=1-Math.pow(1-cl(u/4.2),3),d=Math.max(0,u-4.2);return{x:mix(162,166,r)+d*.1,y:mix(60,93,r)+d*.04,z:mix(2.2,1.06,r)+d*.005}}},
 libW:{w:dLib,act:1,focus:.2,bloom:.7,flare:.35,cam:u=>({x:162+u*.12,y:94,z:1.08+u*.006})},
 anA:{w:dLib,act:1,focus:.9,bloom:.75,cam:u=>{const k=asym(u,8);return{x:mix(92,84,k),y:104,z:mix(2.15,2.42,k)}}},
 anB:{w:dLib,act:1,focus:.95,bloom:.75,flare:.2,cam:u=>{const k=asym(u,8);return{x:mix(56,68,k),y:101,z:mix(2.75,3.0,k)}}},
 hanhA:{w:dLib,act:1,focus:.9,bloom:.75,cam:u=>{const k=asym(u,8);return{x:mix(214,228,k),y:102,z:mix(2.1,2.35,k)}}},
 hanhB:{w:dLib,act:1,focus:.95,bloom:.75,cam:u=>{const k=asym(u,8);return{x:mix(254,243,k),y:98,z:mix(2.6,2.85,k)}}},
 book:{w:dLib,act:1,focus:.9,bloom:.8,flare:.35,light:1.2,cam:u=>{const k=asym(u,7);return{x:mix(168,158,k),y:mix(134,129,k),z:mix(2.3,3.1,k)}}},
 box:{w:dLib,act:1,focus:.85,bloom:.7,cam:u=>{const k=asym(u,7);return{x:mix(290,274,k),y:121,z:mix(2.15,2.5,k)}}},
 libEnd:{w:dLib,act:1,focus:.15,bloom:.7,light:.85,dim:u=>.22*ez(cl(u/10)),cam:u=>{const k=asym(u,6);return{x:mix(150,160,k),y:mix(100,92,k),z:mix(1.55,1.03,k)}}},
 notes:{w:dBook,act:2,bloom:.08,cam:()=>({x:160,y:90,z:1})},
 door:{w:dDoor,act:1,focus:.3,bloom:.8,walk:u=>ez(cl(u/3.4)),cam:u=>{const k=asym(u,6);return{x:160,y:mix(80,86,k),z:mix(1.55,1.12,k)}}},
 emma:{w:dDoor,act:1,focus:.85,bloom:.8,walk:()=>1,cam:u=>{const k=asym(u,8);return{x:mix(137,141,k),y:72,z:mix(1.7,1.85,k)}}},
 khoa:{w:dDoor,act:1,focus:.85,bloom:.8,walk:()=>1,cam:u=>{const k=asym(u,8);return{x:mix(188,184,k),y:72,z:mix(1.7,1.85,k)}}},
 /* Sau đoạn chơi được */
 bk:{w:dBook,act:2,bloom:.08,cam:()=>({x:160,y:90,z:1})},
 rd1:{w:dRoad,act:3,bloom:.7,flare:()=>.3,cam:u=>({x:lin(118,200,u,3.4),y:96,z:1.55})},
 rd2:{w:dRoad,act:3,bloom:.7,bikes:1,flare:()=>.25,cam:u=>({x:lin(106,176,u,3.2),y:104,z:1.55})},
 rd3:{w:dRoad,act:3,bloom:.85,sun:u=>Math.pow(cl(u/2.4),2),flare:u=>.3+.7*Math.pow(cl(u/2.4),2),white:u=>Math.pow(cl((u-1.6)/.8),2),cam:u=>{const e=Math.pow(cl(u/2.4),1.6);return{x:mix(190,208,e),y:mix(94,88,e),z:mix(1.35,2.2,e)}}},
 gate:{w:dGate,act:4,bloom:.6,cam:u=>{const k=cl(u/13);return{x:160,y:mix(112,92,ez(cl(u/9))),z:mix(1.3,1.14,k)}}}
};
/* Phần không tương tác: [bắt đầu, kết thúc, cú máy, kiểu chuyển, thời lượng chuyển] */
const AUTO=[[0,4.4,'riv1','cut'],[4.4,8.4,'riv2','dissolve',.7],[8.4,12,'riv3','dissolve',.7],[25,32,'bk','dip',.9],[32,35.4,'rd1','dissolve',.8],[35.4,38.6,'rd2','cut'],[38.6,41,'rd3','dissolve',.6],[41,54,'gate','dip',1.1]];

/* ---------- Dựng theo lời thoại: mỗi câu = một cú máy ---------- */
const cnt={an:0,hanh:0},INS=['book','box','notes','libEnd','door','libA','libW'];
function cut(name,type='cut',d=.5){if(name===curN||!SH[name])return;
 if(type!=='cut'&&cur){sx.setTransform(1,0,0,1,0,0);sx.globalAlpha=1;sx.drawImage(wk,0,0);trans={type,t:TT,d}}else trans=null;
 cur=SH[name];curN=name;curT0=TT}
function onLine(sp,tx){const b=(sp||'').replace(/\s*[–—-].*$/,'').trim(),tl=tx||'';let n;
 if(!b)n=/quạt|chuyển một phần/.test(tl)?(inLib?'libW':'libA'):/bìa cứng|Dưới đáy/.test(tl)?'book':/lô tư liệu|chưa có mã/.test(tl)?'box':/Emma đến/.test(tl)?'door':/Cả ba|bản chụp/.test(tl)?'libEnd':'libW';
 else if(/quan sát/.test(sp))n='notes';
 else if(/xin phép/.test(sp))n='book';
 else if(b=='An')n=(cnt.an++%2)?'anB':'anA';
 else if(/Hạnh/.test(b))n=(cnt.hanh++%2)?'hanhB':'hanhA';
 else if(b=='Emma')n='emma';else if(b=='Khoa')n='khoa';else n='libW';
 if(n===curN)n={anA:'anB',anB:'anA',hanhA:'hanhB',hanhB:'hanhA'}[n]||n;
 const first=!inLib;inLib=1;
 cut(n,first?'flash':(INS.includes(n)||INS.includes(curN))?'dissolve':'cut',first?1:.45)}

/* ---------- Hậu kỳ ---------- */
function post(sh,T){
 /* bloom: chỉ lấy vùng sáng, thu nhỏ từng nửa một (tránh aliasing/nhấp nháy khi camera di chuyển) */
 let src=wk;bl.forEach((b,i)=>{b.g.globalCompositeOperation='copy';if(i==0&&CA.FILT)b.g.filter='brightness(.72) contrast(1.8)';b.g.drawImage(src,0,0,b.e.width,b.e.height);if(i==0&&CA.FILT)b.g.filter='none';src=b.e});
 const ba=sh.bloom??.5;fx.globalCompositeOperation='lighter';fx.globalAlpha=ba*(CA.FILT?.3:.12);fx.drawImage(bl[2].e,0,0,W,H);fx.globalAlpha=ba*(CA.FILT?.42:.16);fx.drawImage(bl[3].e,0,0,W,H);
 /* chỉnh màu: sáng ấm */
 fx.globalAlpha=1;fx.globalCompositeOperation='soft-light';fx.fillStyle='rgba(255,158,78,.17)';fx.fillRect(0,0,W,H);
 /* vignette */
 fx.globalCompositeOperation='source-over';const v=fx.createRadialGradient(W/2,H/2,Math.min(W,H)*.34,W/2,H/2,Math.hypot(W,H)*.56);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.62)');fx.fillStyle=v;fx.fillRect(0,0,W,H);
 /* hạt phim mịn, đổi 12 lần/giây */
 const gi=Math.floor(T*12),ox=hh(gi)*160|0,oy=hh(gi+9)*160|0;fx.save();fx.globalCompositeOperation='overlay';fx.globalAlpha=.07;fx.translate(-ox,-oy);fx.fillStyle=grp;fx.fillRect(ox,oy,W,H);fx.restore()}

function render(T){const sh=cur,u=T-curT0,cam=sh.cam(u);
 x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';
 sh.w(sh,cam,u,T);
 if(sh.white){const a=sh.white(u);if(a>0){x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,226,180,${a})`;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}}
 if(trans){const k=(T-trans.t)/trans.d;
  if(k>=1)trans=null;
  else if(trans.type=='dissolve'){x.globalAlpha=1-ez(k);x.drawImage(sn,0,0);x.globalAlpha=1}
  else if(trans.type=='flash'){x.globalAlpha=1-ez(k);x.drawImage(sn,0,0);x.globalAlpha=1;x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,226,180,${Math.pow(1-k,2)*.5})`;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}
  else if(trans.type=='dip'){if(k<.45){x.drawImage(sn,0,0);x.fillStyle=`rgba(0,0,0,${k/.45})`}else x.fillStyle=`rgba(0,0,0,${1-(k-.45)/.55})`;x.fillRect(0,0,W,H)}}
 fx.setTransform(1,0,0,1,0,0);fx.globalAlpha=1;fx.globalCompositeOperation='source-over';fx.drawImage(wk,0,0);post(sh,T);
 fx.globalCompositeOperation='source-over';fx.globalAlpha=1}

const aud=()=>{try{const a=new(window.AudioContext||window.webkitAudioContext)(),m=a.createGain(),f=a.createBiquadFilter(),n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*2,a.sampleRate),d=b.getChannelData(0),ng=a.createGain();for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;n.loop=true;f.type='lowpass';f.frequency.value=380;ng.gain.value=.22;n.connect(f);f.connect(ng);ng.connect(m);n.start();[55,110,165,220,330].forEach((fr,i)=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=fr*(1+hh(i)*.003);g.gain.value=.06/(i+1);o.connect(g);g.connect(m);o.start()});m.connect(a.destination);m.gain.value=0;m.gain.setTargetAtTime(.5,a.currentTime,1.2);A={a,m,f}}catch(e){}};
function end(){if(!run)return;run=0;window.onSeqLine=null;if(pro){pro=0;busy=false;adv=null;$('dlg').style.display='none';document.body.classList.remove('pro')}A&&A.m.gain.setTargetAtTime(.08,A.a.currentTime,.8);const e=$('cine');e.style.transition='opacity .9s';e.style.opacity=0;setTimeout(()=>{e.remove();document.body.classList.remove('cine');START()},900)}

function frame(now){if(!run)return;requestAnimationFrame(frame);
 try{const T=TT=Math.max(0,(now-t0)/1000);
  if(!pro&&!pd&&T>=12){pd=1;pro=1;document.body.classList.add('pro');window.onSeqLine=onLine;PRO(()=>{pro=0;window.onSeqLine=null;document.body.classList.remove('pro');t0=performance.now()-25000})}
  if(T>=54&&!pro)return end();
  if(!pro){const a=AUTO.find(q=>TT>=q[0]&&TT<q[1]);if(a)cut(a[2],a[3],a[4])}
  shY+=((pro?-H*.03:0)-shY)*.06;
  if(!cur)return;
  render(TT);
  if(cur.act!==si){si=cur.act;try{SFX.scene(si);A&&A.f.frequency.setTargetAtTime([300,380,900,2200,500][si],A.a.currentTime,.8)}catch(e){console.warn('[audio]',e)}}
  /* mở/đóng cảnh bằng đen */
  const fo=Math.min(cl(T/1.4),pro?1:cl((54-T)/1.2));if(fo<1){fx.fillStyle=`rgba(0,0,0,${1-fo})`;fx.fillRect(0,0,W,H)}
  const k=pro?-1:SUB.findIndex(s=>T>=s[0]&&T<s[1]);if(k!=ls){ls=k;if(k<0)SB.className='';else{SB.innerHTML=(SUB[k][2]?'<b>'+SUB[k][2]+'</b>':'')+SUB[k][3];SB.className='in'}}
 }catch(e){if(!errOnce++)console.error('[cine]',e)}}

$('go').onclick=()=>{$('cs').style.display='none';['700 40px "Playfair Display"','500 30px Caveat'].forEach(f=>document.fonts?.load(f));$('cine').classList.add('on');aud();SFX.init();CA.lib;CA.door;run=1;t0=performance.now();requestAnimationFrame(frame)};
$('skp').onclick=end;$('sk2').onclick=()=>{run=1;end()};addEventListener('keydown',e=>{if(e.key=='Escape'&&$('cine')){if(!run)run=1;end()}});
/* Công cụ xem trước từng cú máy (dùng khi chỉnh dựng): CIN.preview('anA',3) */
const preview=(name,u=0,T=u)=>{rs();$('cs').style.display='none';$('lb1').style.transition=$('lb2').style.transition='none';CE.classList.add('on');TT=T;curN='';trans=null;cut(name);curT0=T-u;shY=0;render(T)};
setTimeout(()=>{try{CA.lib;CA.door}catch(e){}},80);
return{preview,names:Object.keys(SH)}
})();
