/* Mở đầu chơi được – THƯ VIỆN (Story Bible v16 §4 Cảnh 01–02): (1) đi dọc ba dãy kệ theo danh mục, mỗi dãy có một ô trống;
   (2) bê từng chồng sách từ thùng sang phòng đọc mới — nhấc, mang (đi chậm hơn), đặt xuống nhẹ tay — đến chồng thứ ba thì quyển bìa xanh sẫm trượt ra.
   Gọi từ prologue.js bằng mục-hàm trong seq(): LIB.shelves(next) · LIB.carry(next). Không có thua/phạt/giờ; luôn có nút “Bỏ qua phần này”.
   Nghệ thuật: assets/art/thuvien.px.js (pxl) → js/data/thuvienart.js. Không phải pixel-hunt: kệ và chồng sách luôn sáng rõ, chỉ việc đi tới. */
(()=>{
const LW=320,LH=180,N=3,TI={},ANWt=[80,100,100,80,100,100],ANCt=ANWt.reduce((a,b)=>a+b,0);   /* logic 320x180 · vẽ 960x540 · sprite vẽ ở độ phân giải gốc, An dùng khung đi có sẵn (IM.an_*, 48x64) 1:1 */
Object.keys(TVART).forEach(k=>{const i=new Image();i.src=TVART[k];TI[k]=i});
const BAYS=[43,79,115];
const SH=[{x:96,y:18,k:'lb_shelf1',gx:84,gw:15,gt:1,n:'A',t:'Kệ A, mã DM-01: khớp danh mục. Ở đây có một ô trống, đúng chỗ cuốn sách lẽ ra phải nằm.'},
          {x:96,y:74,k:'lb_shelf2',gx:260,gw:14,gt:2,n:'B',t:'Kệ B, mã DM-02: cũng một ô trống. Không có cuốn nào xếp lầm chỗ bên cạnh.'},
          {x:96,y:130,k:'lb_shelf3',gx:170,gw:15,gt:0,n:'C',t:'Kệ C, mã DM-03: lại một ô trống. Ba lượt rồi.'}];
let ov,cv,g,hud,cap,btn,raf,mode,cb,cancelled,P,keys={},T0,lastT,seen,stacks,placed,carry,blue,done,doneT,capT;
const E=(t,c,h)=>{const e=document.createElement(t);if(c)e.className=c;if(h)e.innerHTML=h;return e};
const rect=(x,y,w,h)=>({x,y,w,h});
const hit=(a,b)=>a.x<b.x+b.w&&a.x+a.w>b.x&&a.y<b.y+b.h&&a.y+a.h>b.y;
function setCap(t,ms){cap.textContent=t;cap.style.display=t?'block':'none';clearTimeout(capT);if(ms)capT=setTimeout(()=>{if(!done)cap.style.display='none'},ms)}
function open(m,onDone){cancelled=false;done=0;mode=m;cb=onDone;seen=[0,0,0];placed=0;carry=null;blue=null;keys={};
 ov=E('div');ov.id='tv';ov.setAttribute('role','dialog');ov.setAttribute('aria-label',m=='shelves'?'Thư viện: đi dọc ba dãy kệ':'Thư viện: bê ba chồng sách');
 cv=E('canvas');cv.width=LW*N;cv.height=LH*N;g=cv.getContext('2d');g.imageSmoothingEnabled=false;
 hud=E('div','box tvh');cap=E('div','box tvcap');cap.setAttribute('role','status');cap.setAttribute('aria-live','polite');
 btn=E('button','box tvA');btn.onclick=act;
 const skip=E('button','box tvskip','Bỏ qua phần này');skip.onclick=()=>finish(true);
 const pad=E('div','tvpad');[['↑','up',1,0],['←','left',0,1],['↓','down',1,1],['→','right',2,1]].forEach(([t,k,c,r])=>{const b=E('button','box',t);b.style.gridColumn=c+1;b.style.gridRow=r+1;b.setAttribute('aria-label',k);
  b.onpointerdown=e=>{e.preventDefault();keys[k]=1};['pointerup','pointerleave','pointercancel'].forEach(ev=>b['on'+ev]=()=>keys[k]=0);pad.appendChild(b)});
 ov.append(cv,hud,cap,btn,skip,pad);document.body.appendChild(ov);
 if(m=='shelves'){P={x:46,y:112,dir:'d',wt:0,mv:0};hud.innerHTML='<b>Thư viện · Danh mục</b><br>Danh mục ghi còn một bản. Đi dọc ba dãy kệ theo mã <b>DM-01 → DM-03</b> và <b>Quan sát</b> từng dãy (<span id=tvn>0</span>/3).';setCap('Di chuyển: WASD / phím mũi tên (hoặc nút ← ↑ ↓ → trên màn hình). Lại gần một dãy kệ rồi nhấn E.')}
 else{P={x:96,y:104,dir:'d',wt:0,mv:0};stacks=CRATE.map(by=>({x:62,y:by-2,p:0}));hud.innerHTML='<b>Thư viện · Chồng sách chưa phân loại</b><br>Bê từng chồng sang bàn phòng đọc mới (<span id=tvn>0</span>/3). Nhẹ tay: khi bê, An đi chậm hơn.';setCap('Nhấc: đứng sát chồng sách rồi nhấn E. Bê sang bàn bên phải, đặt xuống ô sáng.')}
 T0=lastT=performance.now();raf=requestAnimationFrame(loop);window.addEventListener('keydown',kd);window.addEventListener('keyup',ku)}
function close(){cancelAnimationFrame(raf);window.removeEventListener('keydown',kd);window.removeEventListener('keyup',ku);ov&&ov.remove();ov=null;mode=null}
function finish(skipped){if(!ov||done===2)return;done=2;const f=cb;if(mode=='shelves'){seen=[1,1,1];if(!K.known.some(t=>/Danh mục ghi còn một bản/.test(t)))rec('known','Danh mục ghi còn một bản; kiểm ba dãy kệ (DM-01 đến DM-03) đều thấy ô trống.','danh mục + quan sát tại thư viện','chưa biết vì sao thiếu; cô Hạnh: có thể sách còn trong thùng')}
 ov.style.transition='opacity .5s';ov.style.opacity=0;setTimeout(()=>{close();f&&f()},500)}
const kmap={ArrowUp:'up',w:'up',W:'up',ArrowDown:'down',s:'down',S:'down',ArrowLeft:'left',a:'left',A:'left',ArrowRight:'right',d:'right',D:'right'};
function kd(e){if(e.key=='Escape'){cancelled=true;close();return}const m=kmap[e.key];if(m){keys[m]=1;e.preventDefault();e.stopPropagation()}else if(e.key=='e'||e.key=='E'||e.key==' '||e.key=='Enter'){e.preventDefault();e.stopPropagation();if(!e.repeat)act()}}
function ku(e){const m=kmap[e.key];if(m)keys[m]=0}
/* ---------- vật cản / điểm chạm ---------- */
const TB1={x:275,y:136},HANH_S={x:312,y:134},PL1={x:20,y:176},CAT={x:294,y:58},FAN_S={x:24,y:68};
const OBS_S=()=>SH.map(s=>rect(s.x,s.y+12,131,26)).concat([rect(244,122,64,14),rect(10,166,20,10),rect(276,44,38,14),rect(16,62,14,6)]);
const TBL=[{x:143,y:70},{x:143,y:154}],CART={x:165,y:108},RT={x:262,y:88},CRATE=[62,106,150];
const SLOTS=[{x:242,y:66},{x:262,y:66},{x:282,y:66}];
const OBS_C=()=>[rect(111,52,64,14),rect(111,136,64,14),rect(150,96,30,10),rect(230,64,64,22),...CRATE.map(by=>rect(8,by-26,42,26)),rect(10,166,20,10)];
const NSTACK=i=>({x:stacks[i].x,y:stacks[i].y-8});
function nearShelf(){for(let i=0;i<3;i++){const s=SH[i];if(P.y>=s.y+36&&P.y<=s.y+60&&P.x>s.x-8&&P.x<s.x+138)return i}return -1}
function nearStack(){let b=-1,bd=30;stacks.forEach((s,i)=>{if(s.p)return;const c=NSTACK(i),d=Math.hypot(P.x-c.x,P.y-c.y);if(d<bd){bd=d;b=i}});return b}
const nearTable=()=>P.x>222&&P.x<304&&P.y>86&&P.y<116;
function label(){if(done)return'';if(mode=='shelves'){const i=nearShelf();return i>=0&&!seen[i]?'Quan sát kệ '+SH[i].n+' [E]':''}
 if(carry!==null)return nearTable()?'Đặt xuống nhẹ tay [E]':'';const i=nearStack();return i>=0?'Nhấc chồng sách [E]':''}
function act(){if(done||!ov)return;window.SFX&&SFX.blip&&SFX.blip();
 if(mode=='shelves'){const i=nearShelf();if(i>=0&&!seen[i]){seen[i]=1;setCap(SH[i].t);const n=seen.filter(Boolean).length;document.getElementById('tvn').textContent=n;
   if(n==3){done=1;setTimeout(()=>{setCap('Ba dãy, ba khoảng trống. Danh mục vẫn ghi còn một bản…');},2600);setTimeout(()=>finish(),5600)}}}
 else if(carry===null){const i=nearStack();if(i>=0){carry=i;stacks[i].p=1;const left=stacks.filter(s=>!s.p).length;
   if(left==0){done=1;blue={x:P.x,y:P.y-14,t:0};setCap('Đến chồng thứ ba, một quyển bìa cứng màu xanh sẫm trượt ra từ giữa các cuốn khác.');setTimeout(()=>finish(),3400)}else setCap('Bê sang bàn bên phải (đi chậm hơn khi mang sách). Đặt xuống ô sáng.')}}
 else if(nearTable()){carry=null;SLOTS[placed].f=1;placed++;document.getElementById('tvn').textContent=placed;setCap(placed==1?'Đặt xuống thật nhẹ tay. Còn hai chồng nữa.':'Chồng thứ hai đã sang phòng đọc. Chồng cuối cùng.',2600)}}
/* ---------- vòng lặp ---------- */
function loop(now){if(!ov)return;const dt=Math.min(.05,(now-lastT)/1000);lastT=now;update(dt,now);draw(now);raf=requestAnimationFrame(loop)}
function update(dt,now){if(done){if(btn.style.display!='none'){btn.style.display='none';btn.dataset.l=''}return}let dx=(keys.right?1:0)-(keys.left?1:0),dy=(keys.down?1:0)-(keys.up?1:0);const sp=(carry!==null?44:64);
 if(dx||dy){const l=Math.hypot(dx,dy);dx/=l;dy/=l;P.dir=Math.abs(dx)>Math.abs(dy)*1.25?(dx<0?'l':'r'):(Math.abs(dy)>Math.abs(dx)*1.25?(dy<0?'u':'d'):P.dir);P.mv=1;P.wt+=dt*1000;
  const ob=mode=='shelves'?OBS_S():OBS_C();const mv=(ax,ay)=>{const nx=P.x+ax,ny=P.y+ay;const b=rect(nx-4,ny-3,8,4);if(nx<8||nx>LW-8||ny<30||ny>LH-2)return;if(ob.some(o=>hit(b,o)))return;P.x=nx;P.y=ny};mv(dx*sp*dt,0);mv(0,dy*sp*dt)}
 else{P.mv=0}
 const L=label();if(btn.dataset.l!==L){btn.dataset.l=L;btn.textContent=L;btn.style.display=L?'block':'none'}}
/* sprite vẽ ở độ phân giải gốc, neo giữa-đáy theo toạ độ logic */
function spr(k,cx,by,al){const i=TI[k];if(!i||!i.complete)return;if(al!=null)g.globalAlpha=al;g.drawImage(i,Math.round(cx*N-i.width/2),Math.round(by*N-i.height));if(al!=null)g.globalAlpha=1}
function shadow(cx,by,w){g.fillStyle='rgba(60,35,20,.22)';g.beginPath();g.ellipse(cx*N,by*N-2,w/2,w/9,0,0,7);g.fill()}
/* khung hình của An: y hệt cách scene.js chọn (xuống: an_w0..5 theo ANW + an_idle · lên/trái/phải: an_u/an_l/an_s 0..8, 0 = đứng yên, 1..8 = vòng đi 70 ms/khung) */
function anKey(){if(P.dir=='d'){let fi=0;if(P.mv){let t=P.wt%ANCt;while(t>=ANWt[fi]){t-=ANWt[fi];fi++}}return fi?'an_w'+fi:'an_idle'}return(P.dir=='u'?'an_u':P.dir=='l'?'an_l':'an_s')+(P.mv?1+((P.wt/70|0)%8):0)}
/* ---------- nền: tường ốp gỗ, cửa sổ, sàn gỗ, thảm (vẽ một lần, 960x540) ---------- */
let BG,BGm;
const hh=n=>{const v=Math.sin(n*127.1+311.7)*43758.5;return v-Math.floor(v)};
function makeBG(m){const c=document.createElement('canvas');c.width=LW*N;c.height=LH*N;const x=c.getContext('2d');x.imageSmoothingEnabled=false;const W=c.width,H=c.height,WALL=150;
 const R=(col,a,b,w,h)=>{x.fillStyle=col;x.fillRect(a,b,w,h)};
 /* tường vàng kiểu Pháp thuộc, phào chỉ trắng, chân tường ốp gỗ */
 R('#efd388',0,0,W,WALL);for(let i=0;i<W;i+=16){R(i%32?'#ebcd7e':'#f2d994',i,0,16,WALL-64)}
 for(let k=0;k<320;k++){R('rgba(190,150,70,.10)',(hh(k)*W)|0,(hh(k+9)*(WALL-70))|0,2+((hh(k+3)*6)|0),1)}
 R('#fff7e0',0,0,W,5);R('#d9bd78',0,5,W,3);R('#fff7e0',0,WALL-66,W,4);R('#cfae5a',0,WALL-62,W,2);
 R('#c9a050',0,WALL-60,W,50);for(let i=0;i<W;i+=96){R('#d9b25a',i+6,WALL-52,84,38);R('#a98536',i+6,WALL-52,84,2);R('#a98536',i+6,WALL-52,2,38);R('#f0d58a',i+8,WALL-14,82,2)}
 R('#5a3829',0,WALL-10,W,10);R('#7a4a31',0,WALL-10,W,3);R('#2b1b1a',0,WALL,W,3);
 /* cửa chớp xanh lá */
 for(const wx of[96,396,696]){const ww=168,wh=96,wy=26;R('#fff7e0',wx-12,wy-14,ww+24,wh+30);R('#d9c9a0',wx-12,wy-14,ww+24,3);
  const gr=x.createLinearGradient(0,wy,0,wy+wh);gr.addColorStop(0,'#9fd2e6');gr.addColorStop(1,'#e6f3e0');x.fillStyle=gr;x.fillRect(wx,wy,ww,wh);
  R('rgba(255,255,255,.7)',wx+54,wy+22,34,6);R('rgba(255,255,255,.7)',wx+62,wy+16,22,6);R('#6fae5e',wx,wy+wh-14,ww,14);x.fillStyle='#4e8a4a';for(let k=0;k<ww;k+=14)x.fillRect(wx+k,wy+wh-14-(hh(k+wx)*8|0),10,8);
  R('#8f5c38',wx+ww/2-3,wy,6,wh);
  for(const sx of[wx-2,wx+ww-40]){R('#2a5a3c',sx,wy-2,42,wh+4);for(let k=0;k<wh+4;k+=5){R('#56a874',sx+2,wy-2+k,38,2);R('#3f8a5a',sx+2,wy-2+k+2,38,2);R('#1f4a30',sx+2,wy-2+k+4,38,1)}R('#2a5a3c',sx+19,wy-2,4,wh+4)}
  R('#fff7e0',wx-16,wy+wh+4,ww+32,8);R('#d9c9a0',wx-16,wy+wh+10,ww+32,2);R('#c9a050',wx-8,wy-18,ww+16,4)}
 /* tranh, lịch, đồng hồ treo tường */
 const frame=(fx,fy,fw,fh,draw)=>{R('#573629',fx-4,fy-4,fw+8,fh+8);R('#bf8250',fx-3,fy-3,fw+6,fh+6);R('#efe3c8',fx,fy,fw,fh);draw(fx,fy,fw,fh)};
 frame(300,50,52,70,(fx,fy,fw,fh)=>{R('#c4574a',fx,fy,fw,16);R('#f6d77a',fx+16,fy+3,20,10);R('#fff',fx+3,fy+20,fw-6,fh-24);x.fillStyle='#6a5a4a';for(let r=0;r<5;r++)for(let q=0;q<7;q++)x.fillRect(fx+6+q*6,fy+24+r*8,3,4);R('#c4574a',fx+6+6*6,fy+24+3*8,3,4)});   /* tờ lịch */
 R('#573629',612,44,46,46);x.fillStyle='#efe3c8';x.beginPath();x.arc(635,67,20,0,7);x.fill();x.strokeStyle='#2b1b1a';x.lineWidth=2;x.beginPath();x.moveTo(635,67);x.lineTo(635,53);x.moveTo(635,67);x.lineTo(645,72);x.stroke();for(let k=0;k<12;k++){const t=k*Math.PI/6;R('#2b1b1a',635+Math.cos(t)*16-1,67+Math.sin(t)*16-1,2,2)}   /* đồng hồ */
 frame(22,52,44,34,(fx,fy,fw,fh)=>{x.fillStyle='#bfe3f0';x.fillRect(fx,fy,fw,fh);R('#6fae5e',fx,fy+22,fw,12);R('#4aa5c8',fx,fy+26,fw,8);R('#7a4a31',fx+12,fy+22,16,4);R('#efe3c8',fx+18,fy+14,2,8);R('#c4574a',fx+20,fy+14,8,4)});   /* tranh sông nước */
 frame(888,52,44,34,(fx,fy,fw,fh)=>{x.fillStyle='#f6e7b0';x.fillRect(fx,fy,fw,fh);R('#4e7f4b',fx+6,fy+6,4,24);R('#4e7f4b',fx+14,fy+10,4,20);R('#4e7f4b',fx+22,fy+4,4,26);R('#e57fa0',fx+34,fy+8,6,6);R('#78ad62',fx+30,fy+20,12,4)});
 /* sàn gạch bông 24px: ô hoa + ô thoi, xen kẽ */
 const T=24,tc=document.createElement('canvas');tc.width=T*2;tc.height=T*2;const t=tc.getContext('2d');t.imageSmoothingEnabled=false;
 const px=(col,a,b,w=1,h=1)=>{t.fillStyle=col;t.fillRect(a,b,w,h)};
 const tileA=(ox,oy)=>{px('#eadbba',ox,oy,T,T);px('#c9b88f',ox,oy,T,1);px('#c9b88f',ox,oy,1,T);px('#f6ecd0',ox+1,oy+1,T-2,1);
  px('#b8453a',ox+2,oy+2,T-4,1);px('#b8453a',ox+2,oy+T-3,T-4,1);px('#b8453a',ox+2,oy+2,1,T-4);px('#b8453a',ox+T-3,oy+2,1,T-4);
  for(const[cx,cy]of[[3,3],[T-4,3],[3,T-4],[T-4,T-4]]){px('#2f7a6a',ox+cx-1,oy+cy-1,3,3);px('#7ad0b8',ox+cx,oy+cy,1,1)}
  const c0=T/2;px('#2f7a6a',ox+c0-1,oy+c0-1,2,2);for(const[dx,dy]of[[0,-4],[0,3],[-4,0],[3,0]]){px('#b8453a',ox+c0+dx-1,oy+c0+dy-1,2,2);px('#e07a5f',ox+c0+dx-1,oy+c0+dy-1,1,1)}
  for(const[dx,dy]of[[-3,-3],[2,-3],[-3,2],[2,2]])px('#2f7a6a',ox+c0+dx,oy+c0+dy,1,1)};
 const tileB=(ox,oy)=>{px('#d6e6d8',ox,oy,T,T);px('#a9c0aa',ox,oy,T,1);px('#a9c0aa',ox,oy,1,T);px('#eaf5ea',ox+1,oy+1,T-2,1);const c0=T/2;
  for(let d=0;d<10;d++){px('#2f7a6a',ox+c0-d,oy+c0-10+d,1,1);px('#2f7a6a',ox+c0+d,oy+c0-10+d,1,1);px('#2f7a6a',ox+c0-d,oy+c0+10-d,1,1);px('#2f7a6a',ox+c0+d,oy+c0+10-d,1,1)}
  px('#b8453a',ox+c0-2,oy+c0-2,4,4);px('#e07a5f',ox+c0-2,oy+c0-2,2,2);for(const[cx,cy]of[[3,3],[T-5,3],[3,T-5],[T-5,T-5]])px('#2f7a6a',ox+cx,oy+cy,2,2)};
 tileA(0,0);tileB(T,0);tileB(0,T);tileA(T,T);
 for(let k=0;k<90;k++){px('rgba(150,120,70,.16)',(hh(k)*T*2)|0,(hh(k+5)*T*2)|0,1,1)}
 x.save();x.beginPath();x.rect(0,WALL+3,W,H-WALL-3);x.clip();x.translate(0,WALL+3);x.fillStyle=x.createPattern(tc,'repeat');x.fillRect(0,0,W,H);x.fillStyle='rgba(244,232,200,.42)';x.fillRect(0,0,W,H);x.restore();
 R('rgba(60,35,20,.16)',0,WALL+3,W,10);R('rgba(60,35,20,.08)',0,WALL+13,W,12);
 /* thảm đỏ vùng phòng đọc / thảm dài lối đi */
 const rug=(rx,ry,rw,rh,c1,c2)=>{R('rgba(60,35,20,.25)',rx+4,ry+6,rw,rh);R(c1,rx,ry,rw,rh);R(c2,rx+8,ry+8,rw-16,rh-16);R(c1,rx+14,ry+14,rw-28,rh-28);
  for(let i=rx+22;i<rx+rw-22;i+=14){R('#e9d9a8',i,ry+20,6,6);R('#e9d9a8',i,ry+rh-26,6,6)}for(let j=ry+30;j<ry+rh-30;j+=14){R('#e9d9a8',rx+20,j,6,6);R('#e9d9a8',rx+rw-26,j,6,6)}
  R('#e9d9a8',rx+rw/2-3,ry+rh/2-12,6,24);R('#e9d9a8',rx+rw/2-12,ry+rh/2-3,24,6)};
 if(m=='carry')rug(640,200,300,236,'#8f3a36','#d9b66a');
 return c}
function room(now){if(BGm!=mode){BG=makeBG(mode);BGm=mode}g.drawImage(BG,0,0);
 for(const wx of[96,396,696]){g.fillStyle='rgba(255,238,170,.10)';g.beginPath();g.moveTo(wx,150);g.lineTo(wx+168,150);g.lineTo(wx+300,540);g.lineTo(wx+90,540);g.fill();g.fillStyle='rgba(255,244,190,.07)';g.beginPath();g.moveTo(wx+30,150);g.lineTo(wx+138,150);g.lineTo(wx+220,540);g.lineTo(wx+110,540);g.fill()}
 for(let i=0;i<22;i++){const t=now/5000+i*.37,x=(i*97+Math.sin(t*3+i)*20+now*.004*(1+i%3))%960,y=170+((t*40+i*53)%330);g.fillStyle='rgba(255,246,200,.55)';g.fillRect(Math.round(x),Math.round(y),2,2)}}
function draw(now){room(now);const D=[];
 if(mode=='shelves'){SH.forEach((s,i)=>D.push({y:s.y+40,f:()=>{shadow(s.x+65,s.y+40,400);spr(s.k,s.x+65,s.y+40);
   if(seen[i]){const left=(s.x+65)*N-197,gx=left+1+s.gx,gy=(s.y+40)*N-134+1+BAYS[s.gt]-31,a=.55+.45*Math.sin(now/220);g.strokeStyle='rgba(246,215,122,'+a+')';g.lineWidth=3;g.setLineDash([6,4]);g.strokeRect(gx-4,gy-3,s.gw+8,36);g.setLineDash([]);g.fillStyle='rgba(246,215,122,'+(a*.18)+')';g.fillRect(gx-4,gy-3,s.gw+8,36)}}}));
  D.push({y:TB1.y,f:()=>{shadow(TB1.x,TB1.y,190);spr('lb_table',TB1.x,TB1.y)}});D.push({y:HANH_S.y,f:()=>{shadow(HANH_S.x,HANH_S.y,44);spr((now%3600)<150?'lb_hanh_b':'lb_hanh',HANH_S.x,HANH_S.y)}});D.push({y:CAT.y,f:()=>{shadow(CAT.x,CAT.y,120);spr('lb_catalog',CAT.x,CAT.y)}});D.push({y:FAN_S.y,f:()=>{shadow(FAN_S.x,FAN_S.y,40);spr('lb_quat',FAN_S.x,FAN_S.y)}});D.push({y:172,f:()=>{shadow(308,172,36);spr('lb_lan',308,172)}});
  D.push({y:152,f:()=>{shadow(244,152,40);spr('lb_chair',244,152)}});D.push({y:PL1.y,f:()=>{shadow(PL1.x,PL1.y,44);spr('lb_plant',PL1.x,PL1.y)}})}
 else{TBL.forEach(t=>D.push({y:t.y,f:()=>{shadow(t.x,t.y,190);spr('lb_table',t.x,t.y)}}));D.push({y:CART.y,f:()=>{shadow(CART.x,CART.y,88);spr('lb_cart',CART.x,CART.y)}});
  D.push({y:RT.y,f:()=>{shadow(RT.x,RT.y,190);spr('lb_table',RT.x,RT.y);SLOTS.forEach(sl=>{if(sl.f)spr('lb_stack',sl.x,sl.y+2);else if(carry!==null)spr('lb_slot',sl.x,sl.y+5,.55+.45*Math.sin(now/200))})}});
  D.push({y:HANH_S.y+2,f:()=>{shadow(300,128,44);spr((now%3600)<150?'lb_hanh_b':'lb_hanh',300,128)}});D.push({y:170,f:()=>{shadow(304,170,40);spr('lb_quat',304,170)}});D.push({y:176,f:()=>{shadow(206,176,36);spr('lb_lan',206,176)}});D.push({y:PL1.y,f:()=>{shadow(PL1.x,PL1.y,44);spr('lb_plant',PL1.x,PL1.y)}});
  CRATE.forEach(by=>D.push({y:by,f:()=>{shadow(29,by,108);spr('lb_crate',29,by)}}));
  stacks.forEach(s=>{if(!s.p)D.push({y:s.y,f:()=>{const left=stacks.filter(q=>!q.p).length;shadow(s.x,s.y,70);spr(left==1?'lb_stack3':'lb_stack',s.x,s.y)}})})}
 D.push({y:P.y,f:()=>{g.fillStyle='rgba(60,35,20,.28)';g.beginPath();g.ellipse(P.x*N,P.y*N-2,17,6,0,0,7);g.fill();const im=IM[anKey()];if(im&&im.complete)g.drawImage(im,Math.round(P.x*N-24),Math.round(P.y*N-62));
  if(carry!==null)spr(blue?'lb_stack3':'lb_stack',P.x,P.y-19+Math.sin(now/180)*.4);
  if(blue){blue.t+=.016;const k=Math.min(1,blue.t/.9);spr('lb_blue',P.x+8+k*16,P.y-24+k*24)}}});
 D.sort((a,b)=>a.y-b.y).forEach(d=>d.f());
 const grd=g.createRadialGradient(LW*N/2,LH*N/2,180,LW*N/2,LH*N/2,620);grd.addColorStop(0,'rgba(0,0,0,0)');grd.addColorStop(1,'rgba(40,20,5,.34)');g.fillStyle=grd;g.fillRect(0,0,LW*N,LH*N)}
window.LIB={shelves:n=>open('shelves',n),carry:n=>open('carry',n),
 get debug(){return{mode,P,seen,placed,carry,done,cancelled}},set debugP(v){Object.assign(P,v)},act,keys:()=>keys};
})();
