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
let W=0,H=0,PT=0,bookOn=0,Q=1,S0=1,bar=0,shY=0,t0=0,run=0,A,ls=-1,si=-1,pro=0,pd=0,cur=null,curN='',curT0=0,curD=8,TT=0,trans=null,errOnce=0,inLib=0;
const rs=()=>{W=c.width=wk.width=sn.width=Math.max(2,Math.round(innerWidth*Q));H=c.height=wk.height=sn.height=Math.max(2,Math.round(innerHeight*Q));   /* Q<1: tự giảm độ phân giải dựng hình khi máy không theo kịp ~25 khung/giây */
 PT=W/H<.75;S0=PT?Math.max(W/VW,H/VH*.32):Math.max(W/VW,H/VH);   /* màn hình dọc: giữ trọn khung phim ở giữa, chữ nằm trên nền đen, không bị cắt */
 bar=PT?Math.round((H-VH*S0)/2):Math.round(cl((H-W/2.39)/2,H*.07,H*.2));CE.style.setProperty('--bar',(bar/Q)+'px');
 bl.forEach(b=>{b.e.width=Math.max(2,Math.round(W/b.d));b.e.height=Math.max(2,Math.round(H/b.d))});
 for(const g of[fx,x,sx]){g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high'}};
rs();addEventListener('resize',rs);

/* ---------- Nhịp đọc & dựng phim ----------
   Phụ đề ở lại trên màn hình đủ lâu để đọc thong thả: ~13,5 ký tự/giây + 0,8 s cho mắt bắt kịp (tối thiểu 2,8 s); từng chữ hiện dần theo đúng nhịp đó.
   Mỗi "beat": s = cú máy bắt đầu · tr/td = kiểu/thời lượng chuyển cảnh · t = [người nói, câu] · lead = độ trễ trước khi chữ hiện · m = thời lượng tối thiểu · d = thời lượng khi không có chữ.
   Thời gian các cú máy được tính từ độ dài câu thoại nên sửa lời thoại không làm lệch nhịp dựng. */
const CPS=13.5,rt=t=>Math.max(2.8,.8+[...t].length/CPS);
function build(beats,t0){const sh=[],sb=[];let t=t0;
 for(const b of beats){const lead=b.lead??.5,d=Math.max(b.m||0,b.t?lead+rt(b.t[1])+.5:(b.d||3));
  if(b.s)sh.push([t,0,b.s,b.tr||'cut',b.td||.7]);
  if(b.t)sb.push([t+lead,t+lead+rt(b.t[1]),b.t[0],b.t[1]]);
  t+=d}
 sh.forEach((q,i)=>q[1]=i+1<sh.length?sh[i+1][0]:t);return{sh,sb,end:t}}
/* Phần 1 – dòng sông (lời dẫn) */
const RIV=build([
 {s:'riv0',d:3.4},
 {t:['','Có những dòng sông không chỉ chở nước.']},
 {s:'riv1',tr:'dissolve',td:.9,t:['','Nó còn chở phù sa, và cả những chuyện người ta chưa kịp viết thành chữ.']},
 {s:'riv2',tr:'dissolve',td:.9,t:['','Ở miền Tây, ký ức đi qua nhiều đời: qua mái chèo, qua lời má kể.']},
 {s:'riv3',tr:'dissolve',td:.9,t:['','Và đôi khi, nó nằm lại bên lề một cuốn sách cũ.'],m:6.5}],0);
/* Phần 2 – chơi được trong thư viện (hội thoại, tự dựng theo từng câu: onLine) rồi tới đây */
const PA=Math.ceil(RIV.end)+2;
const POST=build([
 {s:'bk',tr:'dip',td:.9,t:['','Thứ làm An để ý không phải chữ in, mà là những dòng ghi chú ở bên lề.'],m:9.5},
 {s:'rd1',tr:'dissolve',td:.9,t:['EMMA','“Cậu nghĩ người viết mấy dòng đó có muốn ai đọc được không?”']},
 {s:'rd2',tr:'cut',t:['AN','“Tớ cũng chưa biết. Nhưng đã viết ra giấy thì chắc cũng mong có người đọc. Mình tới nơi rồi tính.”']},
 {s:'rdB',tr:'cut',d:2.6},
 {s:'rd3',tr:'dissolve',td:.7,t:['','Không có ánh sáng kỳ lạ, cũng chẳng có tiếng gọi bí ẩn nào. Chỉ có hàng cây, con đường quê và một khoảng lặng.'],m:9},
 {s:'gate',tr:'dip',td:1.2,lead:1.3,t:['','“Hãy bắt đầu bằng sự kính trọng.”'],m:14.5}],PA);
const AUTO=[...RIV.sh,...POST.sh],SUB=[...RIV.sb,...POST.sb],PRO_AT=RIV.end,END_AT=POST.end;
/* Phụ đề hiện từng chữ theo nhịp đọc */
function showSub(q){const w=q[3].split(' '),tot=q[3].length,rev=(q[1]-q[0])*.72;let acc=0;SB.className='';
 SB.innerHTML=(q[2]?'<b>'+q[2]+'</b>':'')+w.map(t=>{const d=(acc/tot*rev).toFixed(2);acc+=t.length+1;return'<span style="transition-delay:'+d+'s">'+t+'</span>'}).join(' ');void SB.offsetWidth;SB.className='in'}

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
/* Nước chuyển động: vẽ lớp nước theo từng dải ngang 1,5 px thế giới, mỗi dải lệch ngang theo sóng (càng gần càng lắc mạnh);
   phản chiếu (bờ xa, thuyền, người chèo) cũng được lật + làm gợn theo cùng kiểu → mặt sông "thở" thay vì là một tấm ảnh. */
function waveBlit(L,q,cam,y0,y1,T,amp=1,al=1){if(!L)return;const t=tf(q,cam),K=CA.K,st=1.5;x.globalAlpha=al;
 for(let wy=y0;wy<y1;wy+=st){const k=(wy-y0)/(y1-y0),a=(.1+1.3*k)*amp,dx=Math.sin(T*1.1+wy*.55)*a+Math.sin(T*.55+wy*.21)*a*.7;
  x.drawImage(L.cv,0,(wy-L.oy)*K,L.cv.width,st*K,W/2+(L.ox+dx-t.cx)*t.s,H/2+shY+(wy-t.cy)*t.s,L.w*t.s,st*t.s+.6)}x.globalAlpha=1}
function reflectL(L,q,cam,axis,depth,T,al,xa,xb,dxs=0){if(!L)return;const t=tf(q,cam),K=CA.K,st=1.5;
 for(let wy=axis;wy<axis+depth;wy+=st){const k=(wy-axis)/depth,sy=2*axis-wy-st,dx=Math.sin(T*1.5+wy*.9)*(.25+1.5*k)+dxs;x.globalAlpha=al*(1-k)*(1-k*.4);
  x.drawImage(L.cv,xa*K,(sy-L.oy)*K,(xb-xa)*K,st*K,W/2+(L.ox+xa+dx-t.cx)*t.s,H/2+shY+(wy-t.cy)*t.s,(xb-xa)*t.s,st*t.s+.6)}x.globalAlpha=1}
/* tia nắng xuyên khói: các nan quạt mảnh toả từ mặt trời, thở chậm */
function rays(wx,wy,e,T){x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='lighter';x.translate(wx,wy);
 for(let i=0;i<11;i++){const ang=-Math.PI/2+(i-5)*.2+Math.sin(T*.12+i*1.7)*.03,w=.018+.02*hh(i+3),a=(.035+.05*hh(i+7))*(.6+.4*Math.sin(T*.4+i*2.1))*(1+e*1.3),L=Math.hypot(W,H)*1.1;
  const g=x.createLinearGradient(0,0,Math.cos(ang)*L,Math.sin(ang)*L);g.addColorStop(0,`rgba(255,214,150,${a})`);g.addColorStop(1,'rgba(255,214,150,0)');x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(ang-w)*L,Math.sin(ang-w)*L);x.lineTo(Math.cos(ang+w)*L,Math.sin(ang+w)*L);x.closePath();x.fill()}x.restore()}

/* ---------- NƯỚC PIXEL ĐỘNG ----------
   Mọi chuyển động nước bám lưới điểm ảnh của tranh (1 điểm ảnh = 0.5 đơn vị thế giới) và nhảy theo nhịp 6 khung/giây,
   nên nước "nhấp nháy từng pixel" như tranh pixel hoạt hoạ chứ không toả vòng mượt. */
const PQ=.5,pq=v=>Math.round(v/PQ)*PQ;
function pixWave(L,q,cam,y0,y1,T,amp=1){if(!L)return;const t=tf(q,cam),K=CA.K,st=1,Tq=Math.floor(T*6)/6;
 for(let wy=y0;wy<y1;wy+=st){const k=(wy-y0)/(y1-y0),a=(.15+1.5*k)*amp,dx=pq(Math.sin(Tq*1.3+wy*.62)*a+Math.sin(Tq*.7+wy*.23)*a*.8);
  x.drawImage(L.cv,0,(wy-L.oy)*K,L.cv.width,st*K,W/2+(L.ox+dx-t.cx)*t.s,H/2+shY+(wy-t.cy)*t.s,L.w*t.s,st*t.s+.6)}}
function pixWater(Z,cam,T,e){const[cx,sp,ya,yb,col]=Z.sh,f=Math.floor(T*6),px=(a,b,w,h)=>x.fillRect(a,b,w,h);
 place(.9,cam);
 /* vệt tối: sóng nhỏ nằm ngang, mỗi khung trôi 1 điểm ảnh, gần máy trôi nhanh hơn */
 x.fillStyle='rgba(8,18,26,.2)';
 for(let i=0;i<70;i++){const k=Math.pow(hh(i+60),.85),y=pq(ya+k*(yb-ya)),len=(2+Math.floor(k*9+hh(i+61)*3))*PQ,d=hh(i+62)>.5?1:-1,v=1+Math.floor(k*2),xx=pq((((hh(i+63)*380+f*d*v*PQ)%400)+400)%400-40);if((f+i*5)%8<6)px(xx,y,len,PQ)}
 /* vệt sáng: cùng cơ chế, cộng sáng */
 x.globalCompositeOperation='lighter';
 for(let i=0;i<60;i++){const k=Math.pow(hh(i+30),.8),y=pq(ya+k*(yb-ya)),len=(2+Math.floor(k*10+hh(i+4)*4))*PQ,d=hh(i)>.5?1:-1,v=1+Math.floor(k*2),xx=pq((((hh(i+9)*380+f*d*v*PQ)%400)+400)%400-40),a=(.1+.16*hh(i+5))*(1+e);
  if((f+i*3)%6<4){x.fillStyle=`rgba(${col},${a})`;px(xx,y,len,PQ)}}
 /* lấp lánh: từng điểm ảnh bật tắt lệch pha, tập trung quanh vùng nắng */
 for(let i=0;i<90;i++){const k=hh(i),y=pq(ya+k*(yb-ya)),xx=pq(cx+(hh(i+9)-.5)*sp*(.6+k*1.1)),ph=(f+Math.floor(hh(i+3)*8))%8;
  if(ph<2){x.fillStyle=`rgba(255,250,228,${.55+.3*hh(i+2)})`;px(xx,y,ph?PQ:PQ*2,PQ)}}
 x.globalCompositeOperation='source-over';idt()}
/* ---------- Thế giới: BA CẢNH CHÈO THUYỀN ----------
   bt = Bến Tre (rạch dừa nước, phù sa) · xq = Xẻo Quýt (rừng tràm, thảm lá) · nn = Chợ nổi Ngã Năm (bình minh).
   Tranh vẽ pixel ở 640x360 theo 6 lớp (sky · far · water · mid · boats · fore) bằng tools/art_boats.py; mỗi cảnh có một xuồng hoạt hoạ 8 khung (row_*).
   sun = vị trí nguồn sáng (toạ độ thế giới) · wy = dải nước nhún sóng · sh = vùng nắng lấp lánh trên nước · row = xuồng hoạt hoạ (x,y góc trên-trái khung; ring = chỗ mái chèo chạm nước). */
const BO={
 bt:{bg:'#9cc5dc',qf:1.45,sun:[215,38],sc:'255,236,176',sr:70,sa:.16,wy:[71,180],amp:1,
  beams:{a0:Math.PI*.5-.62,a1:Math.PI*.5+.5,n:9,col:'255,236,170',a:.05},mist:[66,100,'255,238,190',.07],
  sh:[205,80,76,178,'255,226,160'],row:{k:'row_bt',x:121,y:100,sx:2,ring:[14.7,44.5],go:[12,-9,.84]},over:1,birds:3,dust:'255,236,170',
  dark:.0},
 xq:{bg:'#7fc4e4',qf:1.4,sun:[36,-4],sc:'255,248,190',sr:90,sa:.2,wy:[100,180],amp:.7,
  beams:{a0:Math.PI*.5-.95,a1:Math.PI*.5-.05,n:8,col:'255,250,190',a:.06},mist:[96,126,'230,255,200',.06],
  sh:[250,120,104,178,'255,244,170'],row:{k:'row_xq',x:180,y:100,sx:2,ring:[14.7,44.5],go:[12,-9,.84]},birds:0,dust:'230,255,190'},
 nn:{bg:'#62b6dc',qf:1.3,sun:[238,73],sc:'255,226,160',sr:80,sa:.32,wy:[84,180],amp:1.1,
  beams:null,mist:[60,112,'255,226,170',.12],
  sh:[240,110,86,178,'255,236,190'],row:{k:'row_nn',x:226,y:119,sx:3,ring:[56.5,45.5],go:[44,-3,.9]},birds:9,dust:'255,236,190'}};
/* tia nắng mềm xuyên tán lá / mây: các nan quạt toả từ nguồn sáng, thở chậm */
function beams(wx,wy,T,o,k){x.save();x.setTransform(1,0,0,1,0,0);x.globalCompositeOperation='lighter';x.translate(wx,wy);
 for(let i=0;i<o.n;i++){const ang=mix(o.a0,o.a1,(i+.5)/o.n)+Math.sin(T*.12+i*1.7)*.025,w=.014+.02*hh(i+3),a=o.a*(.5+.5*hh(i+7))*(.55+.45*Math.sin(T*.4+i*2.1))*(1+k),L=Math.hypot(W,H)*1.1;
  const g=x.createLinearGradient(0,0,Math.cos(ang)*L,Math.sin(ang)*L);g.addColorStop(0,`rgba(${o.col},${a})`);g.addColorStop(1,`rgba(${o.col},0)`);x.fillStyle=g;x.beginPath();x.moveTo(0,0);x.lineTo(Math.cos(ang-w)*L,Math.sin(ang-w)*L);x.lineTo(Math.cos(ang+w)*L,Math.sin(ang+w)*L);x.closePath();x.fill()}x.restore()}
function dBoat(sh,cam,u,T){
 const Z=BO[sh.sc],S=sh.sc,g=n=>CA.img(S+'_'+n),e=sh.sun?sh.sun(u):0;
 x.fillStyle='#0b1022';x.fillRect(0,0,W,H);
 blit(g('sky'),.7,cam);
 {const[a,b,s]=wpos(.7,cam,Z.sun[0],Z.sun[1]);glowS(a,b,s*(Z.sr+110*e),Z.sc,Z.sa+.5*e);if(Z.beams)beams(a,b,T,Z.beams,e);else rays(a,b,e,T)}
 blit(g('far'),.8,cam);
 /* sương mỏng, trôi chậm theo gió */
 {const[y0,y1,col,al]=Z.mist;place(.85,cam);x.globalCompositeOperation='lighter';const gd=x.createLinearGradient(0,y0,0,y1);gd.addColorStop(0,`rgba(${col},0)`);gd.addColorStop(.5,`rgba(${col},${al})`);gd.addColorStop(1,`rgba(${col},0)`);x.fillStyle=gd;x.fillRect(-80,y0,480,y1-y0);
  for(let i=0;i<4;i++){const mx=((i*110+T*(2.2+i*.7))%520)-100,my=(y0+y1)/2+i*3,g2=x.createRadialGradient(mx,my,0,mx,my,70);g2.addColorStop(0,`rgba(${col},${al*.7})`);g2.addColorStop(1,`rgba(${col},0)`);x.fillStyle=g2;x.fillRect(mx-70,my-30,140,60)}x.globalCompositeOperation='source-over'}idt();
 /* nước: dải sóng nhún ngang (càng gần càng mạnh) */
 pixWave(g('water'),.9,cam,Z.wy[0],Z.wy[1],T,Z.amp);
 pixWater(Z,cam,T,e);
 /* bờ cây / nhà ven sông: lắc rất nhẹ theo gió */
 blit(g('mid'),.95,cam,1,Math.sin(T*.45)*.25,Math.sin(T*.31)*.08);
 /* thuyền tĩnh: nhấp nhô lệch pha */
 blit(g('boats'),1,cam,1,pq(Math.sin(T*.33)*1.1+(S==='nn'?Math.sin(T*.11)*3:0)),pq(Math.sin(Math.floor(T*3)/3*.9*3)*.4));
 /* xuồng hoạt hoạ: người chèo 8 khung, sóng tròn lan ra sau mỗi nhát chèo */
 const R=Z.row,rw=CA.strip(R.k,8);
 if(rw){const gk=ez(cl(u/curD)),G=R.go||[0,0,1],sc=1+(G[2]-1)*gk,rx=R.x+G[0]*gk+pq(Math.sin(T*.3)*R.sx),ry=R.y+G[1]*gk+pq(Math.sin(Math.floor(T*6)/6*.9*1.5)*.5),[wx,wy,s]=wpos(1,cam,rx,ry),fr=Math.floor(T*6)%rw.n,K=CA.K,fw=rw.fw,hs=.5*sc;
  x.drawImage(rw.cv,fr*fw*K,0,fw*K,rw.fh*K,wx,wy,fw*s*hs,rw.fh*s*hs);
  /* bọt nước pixel ở lưỡi chèo: các vạch sáng nở rộng từng điểm ảnh rồi tan, theo đúng nhịp chèo */
  {const a=(Math.floor(T*6)-2)%8;if(a>=0&&a<6){place(1,cam);x.fillStyle=`rgba(${Z.sh[4]},${.8-a*.12})`;const bx=rx+R.ring[0]*sc,by=ry+R.ring[1]*sc;
   for(let n=0;n<3;n++){const o=(a+n*1.5)*PQ;if(o>2.6)continue;x.fillRect(pq(bx-o-1),pq(by+n*PQ),pq(o*.8+PQ),PQ);x.fillRect(pq(bx+o),pq(by+n*PQ),pq(o*.8+PQ),PQ)}idt()}}
  }
 if(Z.over)blit(g('over'),1,cam,1,Math.sin(T*.5)*.5,Math.sin(T*.37)*.2);
 /* chim: cò bay / vài đàn nhỏ, vỗ cánh lệch pha */
 if(Z.birds){place(.85,cam);x.strokeStyle=S==='nn'?'#27323a':'#f4f1e2';x.lineWidth=.9;x.lineCap='round';
  for(let i=0;i<Z.birds;i++){const bx=(((i*53-T*(4+hh(i)*4))%380)+380)%380-30,by=(S==='nn'?14:10)+hh(i+3)*(S==='nn'?44:24)+Math.sin(T*.6+i)*2.5,w=Math.sin(T*7+i*2)*2.2;x.beginPath();x.moveTo(bx-4.5,by+w);x.lineTo(bx,by);x.lineTo(bx+4.5,by+w);x.stroke()}idt()}
 /* hạt bụi / phấn hoa bay trong nắng (gần máy hơn) */
 place(1.25,cam);x.globalCompositeOperation='lighter';for(let i=0;i<46;i++){const px=((hh(i)*360-T*(2+hh(i+2)*3)+Math.sin(T*.4+i)*8)%360+360)%360-20,py=((hh(i+5)*200-T*(1.5+hh(i+8)*2))%200+200)%200-10,a=.5*Math.pow(.5+.5*Math.sin(T*(.8+hh(i+9))+i*4),2);x.fillStyle=`rgba(${Z.dust},${.5*a})`;x.fillRect(px,py,.8+hh(i+1)*.9,.8+hh(i+1)*.9)}x.globalCompositeOperation='source-over';idt();
 /* tiền cảnh: tàu lá / thảm lá / lục bình, đưa theo gió và sóng */
 blit(g('fore'),Z.qf,cam,1,Math.sin(T*.5)*.7,Math.sin(T*.37)*.3);
 if(sh.flare)flareAt(...wpos(.7,cam,Z.sun[0],Z.sun[1]).slice(0,2),sh.flare(u));
 /* chú thích địa danh kiểu phim (góc trên-trái), hiện – giữ – tan theo thời lượng cú máy */
 if(sh===SH.riv0)estab(u);else if(sh.cap)place_(u,sh.cap)
}
const fitFs=(txt,fs,lsK,maxW)=>{try{x.letterSpacing=(fs*lsK)+'px'}catch(e){}x.font=`400 ${fs}px "VT323","Be Vietnam Pro",monospace`;const w=x.measureText(txt).width;return w>maxW?Math.max(12,fs*maxW/w):fs};
function place_(u,c){const aa=ez(cl((u-.7)/1.1))*(1-ez(cl((u-(curD-1.1))/.9)));if(aa<=0)return;
 x.save();x.setTransform(1,0,0,1,0,0);{const gx=PT?W*.4:W*.2,gy=PT?bar+(H-2*bar)*.2:H*.22,gr=PT?W*.62:W*.32,g=x.createRadialGradient(gx,gy,0,gx,gy,gr);g.addColorStop(0,`rgba(6,10,16,${.55*aa})`);g.addColorStop(1,'rgba(6,10,16,0)');x.fillStyle=g;x.fillRect(gx-gr,gy-gr,2*gr,2*gr)}x.globalAlpha=aa;x.fillStyle='#f3e6bd';x.textBaseline='middle';x.textAlign='left';const fs=fitFs(c[0],Math.max(22,H*.052),.3,W*.84),X=W*.075,Y=PT?bar+(H-2*bar)*.17:H*.2;
 try{x.letterSpacing=(fs*.3)+'px'}catch(e){}x.font=`400 ${fs}px "VT323","Be Vietnam Pro",monospace`;x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=8;x.fillText(c[0],X,Y);x.shadowBlur=0;
 x.globalAlpha=aa*.7;x.fillStyle='#e0b25a';x.fillRect(X,Y+fs*.8,Math.min(W*.3,x.measureText(c[0]).width)*(.4+.6*ez(cl((u-.9)/1.3))),Math.max(1,H*.002));
 const fs2=fitFs(c[1],fs*.62,.2,W*.84);x.globalAlpha=aa*.9;x.font=`400 ${fs2}px "VT323","Be Vietnam Pro",monospace`;x.fillStyle='#e8d8a8';x.fillText(c[1],X,Y+fs*1.55);x.restore()}
function estab(u){const aa=ez(cl((u-1.1)/1.3))*(1-ez(cl((u-5.6)/1.1)));if(aa<=0)return;
 x.save();x.setTransform(1,0,0,1,0,0);x.globalAlpha=aa;x.fillStyle='#f3e6bd';x.textBaseline='middle';x.textAlign='left';const fs=fitFs('ĐỒNG BẰNG SÔNG CỬU LONG',Math.max(22,H*.052),.32,W*.84),X=W*.075,Y=PT?bar+(H-2*bar)*.78:H*.74;
 try{x.letterSpacing=(fs*.32)+'px'}catch(e){}x.font=`400 ${fs}px "VT323","Be Vietnam Pro",monospace`;x.shadowColor='rgba(0,0,0,.6)';x.shadowBlur=8;
 x.fillText('ĐỒNG BẰNG SÔNG CỬU LONG',X,Y);x.shadowBlur=0;x.globalAlpha=aa*.7;x.fillStyle='#e0b25a';x.fillRect(X,Y+fs*.8,Math.min(W*.3,x.measureText('ĐỒNG BẰNG SÔNG CỬU LONG').width)*(.4+.6*ez(cl((u-1.3)/1.6))),Math.max(1,H*.002));
 const fs2=fitFs('BẾN TRE · RẠCH DỪA NƯỚC',fs*.62,.2,W*.84);x.font=`400 ${fs2}px "VT323","Be Vietnam Pro",monospace`;x.fillStyle='#e8d8a8';x.fillText('BẾN TRE · RẠCH DỪA NƯỚC',X,Y+fs*1.55);x.restore()}

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
 const f=typeof sh.focus=='function'?sh.focus(u):(sh.focus??.2);blit(A.wallBlur,.8,cam);blit(A.wall,.8,cam,1-f);
 {const[wx,wy,s]=wpos(.86,cam,160,56);glowS(wx,wy,s*150,'255,205,130',.17*I)}
 shafts(cam,T,I,1);fan(cam,T);
 blit(A.an,1,cam,1,0,Math.sin(T*1.1)*.1);blit(A.hanh,1,cam,1,0,Math.sin(T+1)*.1);
 blit(A.desk,1.08,cam);if(bookOn)blit(A.bookL,1.08,cam);
 /* cánh sen ép khô rơi ra khỏi trang sách (cú máy 'book') */
 if(bookOn&&!(sh.petal&&u<3.6)){place(1.08,cam);x.fillStyle='#d6789a';x.fillRect(180,133,3,3);x.fillRect(179,134,5,1);x.fillStyle='#f2a6c0';x.fillRect(179,134,3,1);idt()}
 if(sh.petal&&u<3.6){const k=cl(u/3.4),e2=k*k*(3-2*k),[wx,wy,s]=wpos(1.08,cam,176+Math.sin(u*2.4)*8*(1-k)+5*k,98+36*e2);x.save();x.translate(wx,wy);x.rotate(Math.sin(u*2.4)*.7*(1-k)+.4*k);x.imageSmoothingEnabled=false;x.drawImage(IM.petal,-5.5*s,-3.5*s,11*s,7*s);x.restore();x.imageSmoothingEnabled=true}
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
/* Người đạp xe pixel-art (assets/art/ride.px.js): khung 8 hình, vẽ nguyên điểm ảnh nên giữ nét. s = chiều cao mong muốn (px màn hình); gy = mặt đường dưới bánh xe; sy = hàng điểm ảnh của mặt đường trong khung. */
function rideP(key,cx,gy,s,T,o,sy){const rw=CA.strip(key,8);if(!rw)return false;const ps=Math.max(1,Math.round(s/rw.fh)),fr=(Math.floor(T*10)+o)%8,K=CA.K,fw=rw.fw,dw=fw*ps,dh=rw.fh*ps,gx=Math.round(cx-dw/2),top=Math.round(gy-sy*ps);
 glowS(cx+dw*.55,gy-dh*.35,dh*1.1,'255,230,170',.2);   /* ánh nắng phía trước vẽ SAU lưng người để bánh xe không bị loá mờ */
 x.save();x.fillStyle='rgba(0,0,0,.32)';x.beginPath();x.ellipse(cx,gy,dw*.42,Math.max(2,ps*1.4),0,0,7);x.fill();x.imageSmoothingEnabled=false;x.drawImage(rw.cv,fr*fw*K,0,fw*K,rw.fh*K,gx,top,dw,dh);x.restore();return true}
function bike(cx,cy,s,ph){x.save();x.strokeStyle=x.fillStyle='#07080f';x.lineCap='round';x.lineWidth=s*.035;
 [-.5,.5].forEach(o=>{x.beginPath();x.arc(cx+o*s,cy,s*.2,0,7);x.stroke();x.save();x.translate(cx+o*s,cy);x.rotate(ph);x.lineWidth=Math.max(1,s*.008);for(let k=0;k<3;k++){x.rotate(1.05);x.beginPath();x.moveTo(-s*.2,0);x.lineTo(s*.2,0);x.stroke()}x.restore();x.lineWidth=s*.035});
 x.beginPath();x.moveTo(cx-.5*s,cy);x.lineTo(cx-.3*s,cy-.3*s);x.lineTo(cx+.25*s,cy-.3*s);x.lineTo(cx+.4*s,cy-.05*s);x.lineTo(cx+.5*s,cy);x.lineTo(cx+.3*s,cy-.1*s);x.lineTo(cx-.2*s,cy-.05*s);x.fill();
 x.beginPath();x.arc(cx-.02*s,cy-.88*s,s*.11,0,7);x.fill();
 x.beginPath();x.moveTo(cx-.2*s,cy-.3*s);x.quadraticCurveTo(cx-.15*s,cy-.8*s,cx+.05*s,cy-.76*s);x.lineTo(cx+.3*s,cy-.5*s);x.lineTo(cx+.3*s,cy-.42*s);x.lineTo(cx+.1*s,cy-.6*s);x.lineTo(cx,cy-.3*s);x.fill();x.restore();
 glowS(cx+.7*s,cy-.1*s,s*1.1,'255,230,170',.22)}
function dRoad(sh,cam,u,T){x.fillStyle='#10111a';x.fillRect(0,0,W,H);
 const e=sh.sun?sh.sun(u):0;
 blit(CA.img('road_sky'),.7,cam);const[sxp,syp,s]=wpos(.7,cam,208,96);glowS(sxp,syp,s*(80+70*e),'255,205,130',.38+.45*e);
 blit(CA.img('road_far'),.82,cam);blit(CA.img('road_mid'),.92,cam);blit(CA.img('road_ground'),1.05,cam);
 place(1.05,cam);x.globalCompositeOperation='lighter';
 for(let i=0;i<22;i++){const y=132+hh(i)*24,xx=((i*43-T*(160+hh(i)*170))%470+470)%470-70,len=14+hh(i+3)*46;x.fillStyle=`rgba(238,226,196,${.05+.15*hh(i+5)})`;x.fillRect(xx,y,len,.5+hh(i+7)*.8)}
 x.globalCompositeOperation='source-over';idt();
 const BH=PT?H-2*bar:H,BY=v=>PT?bar+BH*v:H*v;
 if(sh.bikes)[[.3,.8,.2,1,'ride_an',0],[.5,.76,.19,2,'ride_emma',3],[.7,.73,.18,3,'ride_khoa',5]].forEach(([a,b,sz,k,key,o])=>{const cx=W*a+Math.sin(T*.6+k)*BH*.015,cy=BY(b)+shY+Math.sin(T*1.7+k*2)*BH*.003;if(!rideP(key,cx,cy+BH*sz*.2,BH*sz*1.05,T,o,52))bike(cx,cy,BH*sz,T*16)});
 if(sh.bclose){const cx=W*.52+Math.sin(T*.8)*BH*.012,cy=BY(.94)+shY+Math.sin(T*1.7)*BH*.004;if(!rideP('ride_big_an',cx,cy-BH*.12,BH*.62,T,0,83))bike(cx,cy,BH*.6,T*15)}       /* cận cảnh một người đạp xe, bánh xe quay */
 blit(CA.img('road_fore'),1.5,cam,1,Math.sin(T*.8)*.5,0);
 if(sh.flare)flareAt(sxp,syp,sh.flare(u));
 if(sh.white){const a=sh.white(u);if(a>0){x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,226,180,${a})`;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}}}

/* ---------- Thế giới: CỔNG + TIÊU ĐỀ ---------- */
function title(u,cam){if(u<=6.5)return;const k=ez(cl((u-6.5)/2)),[,wy,sc]=wpos(1,cam,160,55),[,yA]=wpos(1,cam,160,80),[,yB]=wpos(1,cam,160,104),[,yC]=wpos(1,cam,160,168);
 /* lớp tối đậm ở vùng chữ phía trên, nhạt quanh bảng tên (để còn đọc được), đậm lại ở dưới cho dòng chương */
 {const f=v=>cl(v/H),g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,`rgba(5,5,12,${.74*k})`);g.addColorStop(f(yA),`rgba(5,5,12,${.5*k})`);g.addColorStop(Math.max(f(yA)+.01,f((yA+yB)/2)),`rgba(5,5,12,${.1*k})`);g.addColorStop(Math.max(f(yB)+.02,f(yB+12)),`rgba(5,5,12,${.1*k})`);g.addColorStop(1,`rgba(5,5,12,${.62*k})`);x.fillStyle=g;x.fillRect(0,0,W,H)}
 const sz=Math.min(W*.1,sc*23),T1='PHÙ SA KÝ',ty=wy;x.font=`700 ${sz}px "Playfair Display","Noto Serif",Georgia,serif`;x.textBaseline='middle';x.textAlign='left';
 const sp=sz*.14,ws=[...T1].map(ch=>x.measureText(ch).width),tw=ws.reduce((a,b)=>a+b+sp,0)-sp;let px=(W-tw)/2;
 [...T1].forEach((ch,i)=>{x.globalAlpha=ez(cl((u-7-i*.2)/1.1));x.fillStyle='#f3e6bd';x.fillText(ch,px,ty);px+=ws[i]+sp});
 x.globalAlpha=ez(cl((u-9.2)/1.4));x.fillStyle='#e0b25a';x.fillRect(W/2-tw*.25*x.globalAlpha,ty+sz*.58,tw*.5*x.globalAlpha,1.5);
 x.textAlign='center';x.globalAlpha=ez(cl((u-9.6)/1.6));x.fillStyle='#f3e6bd';x.font=`italic 400 ${Math.max(15,sz*.2)}px "Playfair Display","Noto Serif",Georgia,serif`;x.fillText('Những điều dòng nước không cuốn đi',W/2,ty+sz*.8);
 x.globalAlpha=ez(cl((u-11.6)/1.4));x.font=`${Math.max(20,sz*.2)}px "VT323","Be Vietnam Pro",monospace`;x.fillStyle='#e0b25a';x.fillText('Chương 1 — Dấu mực bên lề',W/2,yC);x.globalAlpha=1;x.textAlign='left'}
function dGate(sh,cam,u,T){x.fillStyle='#0b0f22';x.fillRect(0,0,W,H);
 blit(CA.img('gate_sky'),.7,cam);{const[a,b,s]=wpos(.7,cam,160,104);glowS(a,b,s*90,'255,205,130',.3)}
 blit(CA.img('gate_trees'),.82,cam);
 {const[a,b,s]=wpos(.82,cam,150,106);glowS(a,b,s*14,'255,214,150',.3);const[a2,b2,s2]=wpos(.82,cam,172,108);glowS(a2,b2,s2*12,'255,214,150',.28)}   /* đèn sân phát sáng lúc chạng vạng */
 blit(CA.img('gate_gate'),1,cam);
 /* bảng tên: chữ vẽ bằng canvas để đủ dấu tiếng Việt (ễ, ắ, Ỉ…), vàng trên nền đỏ */
 {const[px,py,s]=wpos(1,cam,160,91.6);x.save();x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ecc65c';x.shadowColor='rgba(0,0,0,.5)';x.shadowBlur=s*.5;try{x.letterSpacing=(s*.12)+'px'}catch(e){}
  x.font=`500 ${s*1.9}px "Be Vietnam Pro","Segoe UI",Arial,sans-serif`;x.fillText('KHU DI TÍCH CỤ PHÓ BẢNG',px,py-s*3.3);
  x.font=`700 ${s*3.9}px "Be Vietnam Pro","Segoe UI",Arial,sans-serif`;x.fillText('NGUYỄN SINH SẮC',px,py+s*1.8);x.restore()}
 blit(CA.img('gate_ground'),1,cam);blit(CA.img('gate_people'),1,cam,1,Math.sin(T*.7)*.12,0);
 /* ánh sáng ấm hắt lên sân + vài hạt bụi bay chậm trong nắng chiều */
 place(1.04,cam);x.globalCompositeOperation='lighter';
 for(let i=0;i<14;i++){const px=hh(i)*330-5+Math.sin(T*.3+i*2)*7,py=96+hh(i+3)*70+Math.cos(T*.35+i)*4,a=.5+.5*Math.sin(T*(.5+hh(i+9)*.5)+i*3);x.fillStyle=`rgba(255,232,180,${.35*a})`;x.fillRect(px,py,.9,.9)}
 x.globalCompositeOperation='source-over';idt();
 blit(CA.img('gate_fore'),1.6,cam,1,Math.sin(T*.6)*.8,0);
 title(u,cam)}

/* ---------- Thế giới: TRANG SÁCH (cận cảnh ghi chú bên lề) ---------- */
function dBook(sh,cam,u,T){u=Math.min(u,9);
 let g=x.createRadialGradient(W/2,H/2,0,W/2,H/2,W*.7);g.addColorStop(0,'#4a2e16');g.addColorStop(1,'#0d0805');x.fillStyle=g;x.fillRect(0,0,W,H);
 const bw=Math.min(W*(PT?.96:.86),1000),bh=Math.min(H*.74,bw*.62),X=(W-bw)/2,Y=(H-bh)/2;
 const mw=(t,sz)=>{x.font=`400 ${sz}px ${'\"Patrick Hand\",\"Segoe Print\",\"Bradley Hand\",\"Comic Sans MS\",\"Chalkboard SE\",cursive'}`;return x.measureText(t).width};let s1=bh*.075;const N1='Hòa An – 1927 đến 1929',W1=mw(N1,s1);if(W1>bw*.4)s1*=bw*.4/W1;const w1m=mw(N1,s1);
 const P1=[X+bw*.56+w1m/2,Y+bh*.3],P2=[X+bw*.27,Y+bh*.87],P3=[X+bw*.58,Y+bh*.46];
 const k1=ez(cl(u/2.8)),k2=ez(cl((u-3.8)/1.6)),k3=ez(cl((u-5.5)/1.5)),fxp=mix(mix(mix(W/2,P1[0],k1),P2[0],k2),P3[0],k3),fyp=mix(mix(mix(H/2,P1[1],k1),P2[1],k2),P3[1],k3),zk=PT?.68:1,z=mix(mix(mix(1,1.8*zk,k1),1.55*zk,k2),1.5*zk,k3);
 x.save();x.translate(W/2,H/2+shY);x.scale(z,z);x.rotate(-.012+.01*cl(u/8));x.translate(-fxp,-fyp);
 x.fillStyle='rgba(0,0,0,.5)';x.fillRect(X+10,Y+14,bw,bh);
 for(const s of[0,1]){g=x.createLinearGradient(X+bw/2,0,s?X+bw:X,0);g.addColorStop(0,'#c9b27c');g.addColorStop(.12,'#ecdcae');g.addColorStop(1,'#f3e6bd');x.fillStyle=g;x.fillRect(s?X+bw/2:X,Y,bw/2,bh)}
 x.fillStyle='rgba(60,40,20,.28)';for(let s=0;s<2;s++)for(let i=0;i<13;i++)x.fillRect(X+bw*(s?.55:.06),Y+bh*.1+i*bh*.058,bw*.37*(.7+hh(i+s*20)*.3),3);
 const note=(t,px,py,t1,d,sz,col,al=1)=>{const k=ez(cl((u-t1)/d));if(k<=0)return 0;x.font=`400 ${sz}px "Patrick Hand","Segoe Print","Bradley Hand","Comic Sans MS","Chalkboard SE",cursive`;const w=x.measureText(t).width;x.save();x.beginPath();x.rect(px-4,py-sz,w*k+8,sz*1.5);x.clip();x.fillStyle=col;x.globalAlpha=al;x.fillText(t,px,py);x.restore();return w};
 const w1=note('Hòa An – 1927 đến 1929',X+bw*.56,Y+bh*.3,1,1.6,s1,'#6b3a14');
 const k=ez(cl((u-2.8)/1));if(k>0){x.strokeStyle='#8b2a1c';x.lineWidth=2.5;x.beginPath();x.ellipse(X+bw*.56+w1/2,Y+bh*.3-s1*.3,w1/2+16,s1*.8,-.04,0,k*6.28);x.stroke()}
 const s2=bh*.05;const fd=1-ez(cl((u-5.3)/.7));note('Bắt đầu từ nơi người dân',X+bw*.07,Y+bh*.84,3.4,1.5,s2,'#3d4f7a',fd);note('Đồng Tháp gửi lòng biết ơn.',X+bw*.07,Y+bh*.9,4.5,1.5,s2,'#3d4f7a',fd);
 const w3=note('Người lái đò',X+bw*.56,Y+bh*.62,5,1,s1,'#4a3020');
 if(u>6){x.strokeStyle='#8b2a1c';x.lineWidth=2;x.beginPath();x.moveTo(X+bw*.56,Y+bh*.6);x.lineTo(X+bw*.56+w3*ez(cl(u-6)),Y+bh*.6);x.stroke();x.font=`400 ${s1*1.4}px "Patrick Hand","Segoe Print","Bradley Hand","Comic Sans MS","Chalkboard SE",cursive`;x.fillStyle='#8b2a1c';x.globalAlpha=cl(u-6.4);x.fillText('?',X+bw*.56+w3+10,Y+bh*.62);x.globalAlpha=1}
 if(u<5.5){x.save();x.translate(X+bw*.7+Math.sin(u*2)*30,Y-40+u*H*.14);x.rotate(u*2);x.fillStyle='rgba(214,120,150,.9)';x.beginPath();x.ellipse(0,0,18,8,0,0,7);x.fill();x.restore()}
 x.restore();
 x.globalCompositeOperation='multiply';g=x.createRadialGradient(W/2,H/2,H*.25,W/2,H/2,W*.62);g.addColorStop(0,'rgba(255,240,215,1)');g.addColorStop(1,'rgba(110,70,35,1)');x.fillStyle=g;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over';
 glowS(W*.86,H*.1,W*.6,'255,205,140',.07+.02*Math.sin(T*.8));dust({x:160,y:90,z:1},T,60)}

/* ---------- Danh sách cú máy ----------
   Ngôn ngữ điện ảnh: toàn cảnh (riv0, libA, libW, gate) → trung cảnh (riv2, libM, libOTS, rd2) → cận cảnh (anA/B, hanhA/B, emma, khoa) → đặc tả (book, notes, rdB, box).
   Chuyển động máy: tilt xuống (riv0) · lia ngang có thị sai (riv1, rd1) · dolly tiến (riv2, anA…) · crane lùi (libA) · tilt lên từ thấp (libLow) · nét sắc dần (rack focus) khi vào cận cảnh.
   curD = thời lượng của cú máy đang chạy (tính từ độ dài câu thoại) để chuyển động luôn vừa khít. */
const lin=(a,b,u,D)=>mix(a,b,cl(u/D)),rack=u=>.35+.6*ez(cl(u/1.4));
const SH={
 /* Sông: 3 cảnh chèo thuyền – Bến Tre (riv0, riv1) → Xẻo Quýt (riv2) → chợ nổi Ngã Năm (riv3, dâng nắng trắng xoá rồi vào thư viện) */
 riv0:{w:dBoat,sc:'bt',act:0,bloom:.4,cam:u=>{const k=ez(cl(u/curD));return{x:mix(180,190,k),y:mix(86,106,k),z:mix(1.12,1.34,k)}}},
 riv1:{w:dBoat,sc:'bt',act:0,bloom:.4,cam:u=>{const k=cl(u/curD);return{x:mix(126,212,k),y:mix(104,122,k),z:1.5}}},
 riv2:{w:dBoat,sc:'xq',act:0,bloom:.45,cap:['XẺO QUÝT','RỪNG TRÀM · ĐỒNG THÁP'],cam:u=>{const k=ez(cl(u/curD));return{x:mix(190,236,k),y:mix(108,128,k),z:mix(1.4,1.85,k)}}},
 riv3:{w:dBoat,sc:'nn',act:0,bloom:.8,cap:['CHỢ NỔI NGÃ NĂM','BÌNH MINH TRÊN SÔNG'],sun:u=>Math.pow(cl(u/curD),2),flare:u=>.25+.75*Math.pow(cl(u/curD),2),white:u=>Math.pow(cl((u-(curD-1.4))/1.1),2),
  cam:u=>{const e=Math.pow(cl(u/curD),2);return{x:mix(190,238,e),y:mix(116,88,e),z:mix(1.25,2.7,e)}}},
 /* Thư viện */
 libA:{w:dLib,act:1,focus:.2,bloom:.8,flare:.7,light:1.15,cam:u=>{const r=1-Math.pow(1-cl(u/4.2),3),d=Math.max(0,u-4.2);return{x:mix(162,166,r)+d*.1,y:mix(60,93,r)+d*.04,z:mix(2.2,1.06,r)+d*.005}}},
 libW:{w:dLib,act:1,focus:.2,bloom:.7,flare:.35,cam:u=>({x:162+u*.12,y:94,z:1.08+u*.006})},
 libM:{w:dLib,act:1,focus:.3,bloom:.7,flare:.2,cam:u=>{const k=asym(u,10);return{x:mix(160,168,k),y:mix(101,97,k),z:mix(1.34,1.52,k)}}},
 libOTS:{w:dLib,act:1,focus:u=>.5+.45*ez(cl(u/1.6)),bloom:.75,cam:u=>{const k=asym(u,9);return{x:mix(122,134,k),y:101,z:mix(1.75,1.95,k)}}},
 libLow:{w:dLib,act:1,focus:.35,bloom:.85,flare:.5,light:1.25,cam:u=>{const k=ez(cl(u/9));return{x:mix(150,164,k),y:mix(150,50,k),z:mix(1.5,1.28,k)}}},
 anA:{w:dLib,act:1,focus:rack,bloom:.75,cam:u=>{const k=asym(u,8);return{x:mix(92,84,k),y:104,z:mix(2.15,2.42,k)}}},
 anB:{w:dLib,act:1,focus:rack,bloom:.75,flare:.2,cam:u=>{const k=asym(u,8);return{x:mix(56,68,k),y:101,z:mix(2.75,3.0,k)}}},
 hanhA:{w:dLib,act:1,focus:rack,bloom:.75,cam:u=>{const k=asym(u,8);return{x:mix(214,228,k),y:102,z:mix(2.1,2.35,k)}}},
 hanhB:{w:dLib,act:1,focus:rack,bloom:.75,cam:u=>{const k=asym(u,8);return{x:mix(254,243,k),y:98,z:mix(2.6,2.85,k)}}},
 book:{w:dLib,act:1,focus:rack,petal:1,bloom:.8,flare:.35,light:1.2,cam:u=>{const k=asym(u,7);return{x:mix(172,160,k),y:mix(120,129,k),z:mix(2.0,3.1,k)}}},
 box:{w:dLib,act:1,focus:.85,bloom:.7,cam:u=>{const k=asym(u,7);return{x:mix(290,274,k),y:121,z:mix(2.15,2.5,k)}}},
 libEnd:{w:dLib,act:1,focus:.15,bloom:.7,light:.85,dim:u=>.22*ez(cl(u/10)),cam:u=>{const k=asym(u,6);return{x:mix(150,160,k),y:mix(100,92,k),z:mix(1.55,1.03,k)}}},
 notes:{w:dBook,act:2,bloom:.08,cam:()=>({x:160,y:90,z:1})},
 door:{w:dDoor,act:1,focus:.3,bloom:.8,walk:u=>ez(cl(u/3.4)),cam:u=>{const k=asym(u,6);return{x:160,y:mix(80,86,k),z:mix(1.55,1.12,k)}}},
 emma:{w:dDoor,act:1,focus:.85,bloom:.8,walk:()=>1,cam:u=>{const k=asym(u,8);return{x:mix(137,141,k),y:72,z:mix(1.7,1.85,k)}}},
 khoa:{w:dDoor,act:1,focus:.85,bloom:.8,walk:()=>1,cam:u=>{const k=asym(u,8);return{x:mix(188,184,k),y:72,z:mix(1.7,1.85,k)}}},
 /* Sau đoạn chơi được */
 bk:{w:dBook,act:2,bloom:.08,cam:()=>({x:160,y:90,z:1})},
 rd1:{w:dRoad,act:3,bloom:.7,flare:()=>.3,cam:u=>({x:lin(118,200,u,curD),y:100,z:1.5})},
 rd2:{w:dRoad,act:3,bloom:.7,bikes:1,flare:()=>.25,cam:u=>({x:lin(100,184,u,curD),y:110,z:1.55})},
 rdB:{w:dRoad,act:3,bloom:.7,bclose:1,flare:()=>.3,cam:u=>({x:lin(140,190,u,curD),y:118,z:1.8})},
 rd3:{w:dRoad,act:3,bloom:.6,sun:u=>.5*Math.pow(cl(u/curD),2),flare:u=>.2+.18*Math.pow(cl(u/curD),2),
  cam:u=>{const e=Math.pow(cl(u/curD),1.6);return{x:mix(190,208,e),y:mix(102,92,e),z:mix(1.35,2.3,e)}}},
 gate:{w:dGate,act:4,bloom:.55,cam:u=>{const k=cl(u/curD);return{x:160,y:mix(108,100,ez(cl(u/9))),z:mix(1.12,1.0,k)}}}
};

/* ---------- Dựng theo lời thoại: mỗi câu = một cú máy ---------- */
const cnt={an:0,hanh:0},INS=['book','box','notes','libEnd','door','libA','libW','libLow','libM','libOTS'];
const LAY={bt:['sky','far','water','mid','boats','over','fore'],xq:['sky','far','water','mid','boats','fore'],nn:['sky','far','water','mid','boats','fore'],road:['sky','far','mid','ground','fore'],gate:['sky','trees','gate','ground','people','fore']},
 SCN={riv0:'bt',riv1:'bt',riv2:'xq',riv3:'nn',rd1:'road',rd2:'road',rdB:'road',rd3:'road',gate:'gate'},NXT={riv0:'nn',libA:'road',rd1:'gate'},SK={bt:['row_bt'],xq:['row_xq'],nn:['row_nn'],road:['ride_an','ride_emma','ride_khoa','ride_big_an']},WQ=[];let curScn='';
const warm=sc=>{(LAY[sc]||[]).forEach(l=>{const k=sc+'_'+l;if(!WQ.includes(k))WQ.push(k)});(SK[sc]||[]).forEach(k=>WQ.push('S:'+k))};
const warmOne=k=>k.startsWith('S:')?CA.strip(k.slice(2),8):CA.img(k);
function cut(name,type='cut',d=.5,D=8){if(name===curN||!SH[name])return;
 {const sc=SCN[name];if(sc&&sc!==curScn){if(curScn){CA.drop(curScn+'_');(SK[curScn]||[]).forEach(CA.dropStrip)}curScn=sc}if(NXT[name])warm(NXT[name])}if(name==='book')bookOn=1;
 if(type!=='cut'&&cur){sx.setTransform(1,0,0,1,0,0);sx.globalAlpha=1;sx.drawImage(wk,0,0);trans={type,t:TT,d,b0:cur.bloom??.5}}else trans=null;
 cur=SH[name];curN=name;curT0=TT;curD=D;try{window.SFX&&SFX.cue&&SFX.cue(name,D,trans?type:'cut')}catch(e){console.warn('[sfx]',e)}}
/* Mỗi câu thoại = một cú máy. Câu có gợi ý (mục thứ 4 trong prologue.js) dùng đúng cú máy đó; còn lại chọn theo người nói, xen kẽ hai góc để không lặp. */
function onLine(sp,tx,hint){const b=(sp||'').replace(/\s*[–—-].*$/,'').trim();let n=hint&&SH[hint]?hint:null;
 if(!n){if(!b)n='libW';
  else if(/quan sát/.test(sp))n='notes';
  else if(/xin phép/.test(sp))n='libOTS';
  else if(/chọn/.test(sp))n='libM';
  else if(b=='An')n=(cnt.an++%2)?'anB':'anA';
  else if(/Hạnh/.test(b))n=(cnt.hanh++%2)?'hanhB':'hanhA';
  else if(b=='Emma')n='emma';else if(b=='Khoa')n='khoa';else n='libW'}
 if(n===curN)n={anA:'anB',anB:'anA',hanhA:'hanhB',hanhB:'hanhA',libW:'libM',libM:'libW'}[n]||n;
 const first=!inLib;inLib=1;
 cut(n,first?'flash':(INS.includes(n)||INS.includes(curN))?'dissolve':'cut',first?1:.6)}

/* ---------- Hậu kỳ ---------- */
function post(sh,T,ba){
 /* bloom: chỉ lấy vùng sáng, thu nhỏ từng nửa một (tránh aliasing/nhấp nháy khi camera di chuyển) */
 let src=wk;bl.forEach((b,i)=>{b.g.globalCompositeOperation='copy';if(i==0&&CA.FILT)b.g.filter='brightness(.72) contrast(1.8)';b.g.drawImage(src,0,0,b.e.width,b.e.height);if(i==0&&CA.FILT)b.g.filter='none';src=b.e});
 fx.globalCompositeOperation='lighter';fx.globalAlpha=ba*(CA.FILT?.3:.12);fx.drawImage(bl[2].e,0,0,W,H);fx.globalAlpha=ba*(CA.FILT?.42:.16);fx.drawImage(bl[3].e,0,0,W,H);
 /* chỉnh màu: sáng ấm */
 fx.globalAlpha=1;fx.globalCompositeOperation='soft-light';fx.fillStyle='rgba(255,158,78,.17)';fx.fillRect(0,0,W,H);
 /* phân sắc: ánh sáng ấm ở vùng sáng, bóng đổ ngả xanh lạnh ở nửa dưới khung */
 {const g=fx.createLinearGradient(0,H*.45,0,H);g.addColorStop(0,'rgba(40,70,130,0)');g.addColorStop(1,'rgba(40,70,130,.2)');fx.globalCompositeOperation='soft-light';fx.fillStyle=g;fx.fillRect(0,0,W,H)}
 /* vignette */
 fx.globalCompositeOperation='source-over';const v=fx.createRadialGradient(W/2,H/2,Math.min(W,H)*.34,W/2,H/2,Math.hypot(W,H)*.56);v.addColorStop(0,'rgba(0,0,0,0)');v.addColorStop(1,'rgba(0,0,0,.62)');fx.fillStyle=v;fx.fillRect(0,0,W,H);
 /* hạt phim mịn, đổi 12 lần/giây */
 const gi=Math.floor(T*12),ox=hh(gi)*160|0,oy=hh(gi+9)*160|0;fx.save();fx.globalCompositeOperation='overlay';fx.globalAlpha=.07;fx.translate(-ox,-oy);fx.fillStyle=grp;fx.fillRect(ox,oy,W,H);fx.restore()}

function render(T){const sh=cur,u=T-curT0,cam=sh.cam(u);let ba=sh.bloom??.5;if(trans&&trans.type!='dip')ba+=(trans.b0-ba)*(1-ez(cl((T-trans.t)/trans.d)));   /* bloom chuyển dần giữa hai cú máy, không bật/tắt đột ngột */
 const hd=(sh.w===dLib||sh.w===dDoor)?1:.5;
 /* rung tay rất nhẹ: máy quay như có người cầm */
 cam.x+=Math.sin(T*.7)*.22*hd;cam.y+=Math.sin(T*1.05+2)*.15*hd;cam.z*=1+Math.sin(T*.45)*.004*hd;
 x.setTransform(1,0,0,1,0,0);x.globalAlpha=1;x.globalCompositeOperation='source-over';
 sh.w(sh,cam,u,T);
 if(sh.white){const a=sh.white(u);if(a>0){x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,226,180,${a})`;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}}
 if(trans){const k=(T-trans.t)/trans.d;
  if(k>=1)trans=null;
  else if(trans.type=='dissolve'){x.globalAlpha=1-ez(k);x.drawImage(sn,0,0);x.globalAlpha=1}
  else if(trans.type=='flash'){x.globalAlpha=1-ez(k);x.drawImage(sn,0,0);x.globalAlpha=1;x.globalCompositeOperation='lighter';x.fillStyle=`rgba(255,226,180,${Math.pow(1-k,2)*.5})`;x.fillRect(0,0,W,H);x.globalCompositeOperation='source-over'}
  else if(trans.type=='dip'){if(k<.45){x.drawImage(sn,0,0);x.fillStyle=`rgba(0,0,0,${k/.45})`}else x.fillStyle=`rgba(0,0,0,${1-(k-.45)/.55})`;x.fillRect(0,0,W,H)}}
 fx.setTransform(1,0,0,1,0,0);fx.globalAlpha=1;fx.globalCompositeOperation='source-over';fx.drawImage(wk,0,0);post(sh,T,ba);
 fx.globalCompositeOperation='source-over';fx.globalAlpha=1}

const aud=()=>{try{const a=new(window.AudioContext||window.webkitAudioContext)(),m=a.createGain(),f=a.createBiquadFilter(),n=a.createBufferSource(),b=a.createBuffer(1,a.sampleRate*2,a.sampleRate),d=b.getChannelData(0),ng=a.createGain();for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;n.buffer=b;n.loop=true;f.type='lowpass';f.frequency.value=380;ng.gain.value=.22;n.connect(f);f.connect(ng);ng.connect(m);n.start();[55,110,165,220,330].forEach((fr,i)=>{const o=a.createOscillator(),g=a.createGain();o.frequency.value=fr*(1+hh(i)*.003);g.gain.value=.06/(i+1);o.connect(g);g.connect(m);o.start()});m.connect(a.destination);m.gain.value=0;m.gain.setTargetAtTime(.5,a.currentTime,1.2);A={a,m,f}}catch(e){}};
function end(){if(!run)return;run=0;window.onSeqLine=null;if(pro){pro=0;busy=false;adv=null;$('dlg').style.display='none';document.body.classList.remove('pro')}A&&A.m.gain.setTargetAtTime(.08,A.a.currentTime,.8);const e=$('cine');e.style.transition='opacity .9s';e.style.opacity=0;setTimeout(()=>{e.remove();document.body.classList.remove('cine');START()},900)}

let lastNow=0,dtSum=0,dtN=0;
function frame(now){if(!run)return;requestAnimationFrame(frame);
 {const dt=now-lastNow;lastNow=now;if(dt>0&&dt<400){dtSum+=dt;if(++dtN>=45){if(dtSum/dtN>40&&Q>.6){Q=Q>.8?.75:.6;rs()}dtSum=dtN=0}}else if(dt>=400){dtSum=dtN=0}}   /* bỏ qua khung treo do đổi tab */
 try{const T=TT=Math.max(0,(now-t0)/1000);
  if(!pro&&!pd&&T>=PRO_AT){pd=1;pro=1;document.body.classList.add('pro');window.onSeqLine=onLine;PRO(()=>{pro=0;window.onSeqLine=null;document.body.classList.remove('pro');t0=performance.now()-PA*1000})}
  if(T>=END_AT&&!pro)return end();
  if(!pro){const a=AUTO.find(q=>TT>=q[0]&&TT<q[1]);if(a)cut(a[2],a[3],a[4],a[1]-a[0])}
  if(WQ.length)warmOne(WQ.shift());   /* dựng sẵn bộ nhớ đệm của cảnh sau, mỗi khung một lớp -> không giật khi chuyển cảnh */
  shY+=((pro?-H*.03:0)-shY)*.06;
  if(!cur)return;
  render(TT);
  if(cur.act!==si){si=cur.act;try{SFX.scene(si);A&&A.f.frequency.setTargetAtTime([300,380,900,2200,500][si],A.a.currentTime,.8)}catch(e){console.warn('[audio]',e)}}
  /* mở/đóng cảnh bằng đen */
  const fo=Math.min(cl(T/1.4),pro?1:cl((END_AT-T)/1.2));if(fo<1){fx.fillStyle=`rgba(0,0,0,${1-fo})`;fx.fillRect(0,0,W,H)}
  const k=pro?-1:SUB.findIndex(s=>T>=s[0]&&T<s[1]);if(k!=ls){ls=k;if(k<0)SB.className='';else showSub(SUB[k])}
 }catch(e){if(!errOnce++)console.error('[cine]',e)}}

/* Phông: chữ tiếng Việt có dấu chồng (ế, ợ, ữ…) nằm trong các tệp unicode-range "vietnamese". document.fonts.load() mà không đưa chữ mẫu chỉ nạp phần latin,
   nên trước đây canvas vẽ "Dấu mực bên lề"/phụ đề bằng phông dự phòng -> lẫn phông, vỡ dấu. Nay nạp kèm chữ mẫu có dấu và chờ xong (tối đa 3,5 s) rồi mới chiếu. */
const VN='ÀÁẢÃẠĂẰẮẲẴẶÂẦẤẨẪẬĐÈÉẺẼẸÊỀẾỂỄỆÌÍỈĨỊÒÓỎÕỌÔỒỐỔỖỘƠỜỚỞỠỢÙÚỦŨỤƯỪỨỬỮỰỲÝỶỸỴàáảãạăằắẳẵặâầấẩẫậđèéẻẽẹêềếểễệìíỉĩịòóỏõọôồốổỗộơờớởỡợùúủũụưừứửữựỳýỷỹỵ';
const FONTS=['400 24px "Playfair Display"','italic 400 24px "Playfair Display"','700 60px "Playfair Display"','400 28px "Patrick Hand"','400 22px "VT323"','400 16px "Be Vietnam Pro"','500 16px "Be Vietnam Pro"','700 16px "Be Vietnam Pro"'];
const loadFonts=()=>document.fonts?Promise.race([Promise.all(FONTS.map(f=>document.fonts.load(f,VN).catch(()=>0))),new Promise(r=>setTimeout(r,3500))]):Promise.resolve();
loadFonts();
$('go').onclick=()=>{const b=$('go');b.disabled=true;b.textContent='Đang chuẩn bị…';aud();SFX.init();CA.lib;CA.door;
 loadFonts().then(()=>{warm('bt');warm('xq');SK.nn.forEach(k=>WQ.push('S:'+k));WQ.splice(0).forEach(warmOne);$('cs').style.display='none';$('cine').classList.add('on');run=1;t0=performance.now();requestAnimationFrame(frame)})};
$('skp').onclick=end;$('sk2').onclick=()=>{run=1;end()};addEventListener('keydown',e=>{if(e.key=='Escape'&&$('cine')){if(!run)run=1;end()}});
/* Công cụ xem trước từng cú máy (dùng khi chỉnh dựng): CIN.preview('anA',3) */
const preview=(name,u=0,T=u,D=8)=>{rs();curD=D;$('cs').style.display='none';$('lb1').style.transition=$('lb2').style.transition='none';CE.classList.add('on');TT=T;curN='';trans=null;cut(name);curT0=T-u;shY=0;render(T)};
setTimeout(()=>{try{CA.lib;CA.door}catch(e){}},80);
return{preview,names:Object.keys(SH),RIV,POST,PA,get state(){return{n:curN,tr:trans?trans.type:'',T:TT,run,Q,W:c.width}}}
})();
