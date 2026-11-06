/* Phaser Scene: sprite, đối tượng, camera, vòng lặp */
class G extends Phaser.Scene{create(){const sc=this;
const mk=(k,w,h,f)=>{const g=sc.make.graphics({add:false});f((c,x,y,a,b,al=1)=>{g.fillStyle(c,al);g.fillRect(x,y,a,b)},w,h);g.generateTexture(k,w,h);g.destroy()};
const disc=(P,cx,cy,r,c)=>{for(let y=-r;y<=r;y++){const d=Math.floor(Math.sqrt(r*r-y*y));P(c,cx-d,cy+y,d*2+1,1)}};
const BS={0:[0x78b347,0x72ac43,0x80ba4e],4:[0x5f9d3c,0x66a640,0x5a9638],1:[0xc7a26a,0xbf9a62,0xcfab74],2:[0x4fa8cb,0x4aa0c4,0x56b0d2],3:[0xd8743a],5:[0xd0c9b6],6:[0x9fae7e,0x97a876],7:[0x9b6a3a],8:[0xc4c6c1,0xbdbfba],9:[0x8a8c8b,0x848684],10:[0xdcdcd4]};
{const VW=MAPDATA.VW,VH=MAPDATA.VH,CS=W*T/VW,off=document.createElement('canvas');off.width=VW;off.height=VH;const q=off.getContext('2d'),id=q.createImageData(VW,VH),hx=c=>[c>>16&255,c>>8&255,c&255];
const PL={0:[0xdad7c8,0xd6d3c4,0xdedbcc],1:[0xf4f1e6,0xefece0],2:[0x3f3f46],3:[0x4ea9d6,0x49a2cf,0x57b3dc],4:[0x2f7f55,0x2b7850,0x34875b],5:[0xe2b246,0xd9a73c],6:[0xbfc2c4,0xbabdbf,0xc3c6c8],7:[0x70727a],8:[0xcdaa60],9:[0xb05c3a,0xa65234],10:[0xf3f1ea,0xe9e6dc],11:[0x9a6b3f,0x8f6238],12:[0x1f6a5c,0x226f60,0x1b5f53],13:[0x9aab6c,0x93a465,0xa2b274],14:[0x4a9a5f,0x5aa86b]};
const at=(x,y)=>VG[y]?.[x];
for(let y=0;y<VH;y++)for(let x=0;x<VW;x++){const k=VG[y][x];let c=pick(PL[k]);
 const up=at(x,y-1),lf=at(x-1,y);
 if(k==3&&(up!=3||lf!=3))c=0x8fd2ea;                       /* mép nước sáng */
 if(k!=3&&(up==3||at(x,y+1)==3||lf==3||at(x+1,y)==3))c=k==5||k==8?0xb98a2e:0x9aa7a8; /* bờ */
 if(k==5&&(at(x,y+1)==0||at(x,y+1)==6||at(x,y-1)==0||at(x,y-1)==6))c=0xb98a2e; /* viền lề vàng */
 if(k==4&&((x+y)&3)==0)c=0x34875b;
 if(k==9&&(y&3)==0)c=0x8f4426;
 if(k==12&&((x*7+y*13)%11)<2)c=0x3f9a7a;                 /* lá sen */
 if(k==14&&at(x-1,y)!=14&&at(x,y-1)!=14)c=0x2f7a4a;
 if(k==11&&(y%3)==0)c=0x7a5230;
 const[r,g,b]=hx(c),i=(y*VW+x)*4;id.data[i]=r;id.data[i+1]=g;id.data[i+2]=b;id.data[i+3]=255}
q.putImageData(id,0,0);const cv=sc.textures.createCanvas('map',W*T,H*T),cx=cv.getContext();cx.imageSmoothingEnabled=false;cx.drawImage(off,0,0,W*T,H*T);cv.refresh()}
sc.add.image(0,0,'map').setOrigin(0).setDepth(0);
const house=(k,w,h,r1,r2,wl)=>mk(k,w*T,h*T,(P,Wd,Hd)=>{const rh=Hd*.6|0;P(0,2,Hd-3,Wd-2,3,.2);P(wl,0,rh-6,Wd,Hd-rh+6);P(0,0,Hd-4,Wd,4,.15);
 for(let r=0;r<rh;r+=4){P(r%8?r1:r2,0,r,Wd,3);P(0,0,r+3,Wd,1,.25)}P(0xffffff,0,0,Wd,2,.25);P(0,0,rh-2,Wd,3,.3);
 P(0x6b4423,Wd/2-3|0,Hd-9,6,9);P(0xf2d27a,Wd/2+1|0,Hd-5,1,1);P(0x7fc4e0,4,rh+1,5,5);P(0x7fc4e0,Wd-9,rh+1,5,5);P(0x4a3018,4,rh+3,5,1);P(0x4a3018,Wd-9,rh+3,5,1)});
house('exh',5,4,0xc4552b,0xb34a24,0xefe3c0);house('th',4,3,0xc8a050,0xb58d3c,0xa8783f);house('th2',3,3,0xb58d3c,0xc8a050,0x9a6c38);house('cafe',3,3,0x3b83a8,0x336f90,0xf4f1e6);house('bql',4,2,0xb34a24,0xc4552b,0xf3e6a8);house('dt',3,3,0xc4552b,0xb34a24,0xefe3c0);house('nd',2,3,0xc8a050,0xb58d3c,0xa8783f);house('chua',3,3,0xd9a441,0xc98f2e,0xefe3c0);
const kio=(k,c,w,h)=>mk(k,w,h,P=>{P(0,1,h-2,w-2,2,.25);P(c,0,0,w,h-2);P(0xffffff,0,0,w,2,.3);P(0,0,h-5,w,3,.25);P(0xffffff,3,3,w-6,1,.2)});
kio('pk',0xe0408a,24,24);kio('bl',0x2a2f9e,24,24);kio('mr',0x7a1633,22,22);kio('bk',0x1b1b1b,18,18);kio('bg',0x2a3aa8,48,40);
mk('stat',10,18,P=>{P(0xbdb8aa,0,12,10,6);P(0xe9e4d6,3,3,4,10);P(0xd0a870,3,0,4,4)});mk('rg',24,8,P=>{P(0xc8282a,0,0,24,8);P(0xff6a5a,0,0,24,2,.5);P(0,0,6,24,2,.3)});
mk('san',4*T,3*T,(P,Wd)=>{for(let r=0;r<26;r+=2){const i=Math.floor((26-r)/4);P(r%4?0xc9a24f:0xb58d3c,2+i,r,Wd-4-2*i,2)}P(0xa8783f,8,26,Wd-16,8);P(0x6b4423,6,34,3,14);P(0x6b4423,Wd-9,34,3,14);P(0x8b5a2b,4,32,Wd-8,3);P(0x4a3018,Wd/2-3,27,6,7)});
mk('tomb',6*T,5*T,(P)=>{P(0,6,68,84,8,.2);P(0xcfc8b5,8,36,80,36);P(0xe2dccb,8,36,80,3);P(0xa39c88,8,69,80,3);P(0xb8b19c,34,72,28,5);disc(P,48,42,22,0x9d988a);disc(P,47,40,20,0xb9b4a6);disc(P,43,34,12,0xd6d2c6);disc(P,40,30,6,0xeeebe2);P(0x7a4b24,38,62,20,6);P(0xd9b26b,44,58,8,4);P(0xc33,47,50,1,8)});
mk('pil',8,28,P=>{P(0xc23a2a,1,6,6,22);P(0xf2c14e,0,3,8,4);P(0x8a2418,5,6,2,22);P(0,0,26,8,2,.25)});
mk('stall',3*T,2*T,P=>{for(let i=0;i<6;i++)P(i%2?0xc23a2a:0xf6e7bd,i*8,0,8,10);P(0,0,10,48,2,.25);P(0x8b5a2b,2,14,44,16);P(0xe0c28e,2,14,44,3);P(0xf08fb0,8,10+3,4,4);P(0x6bbf59,20,13,4,4);P(0xf7d84a,32,13,4,4)});
mk('tree',48,48,P=>{P(0,10,40,28,6,.2);P(0x6b4423,21,28,6,18);disc(P,24,22,18,0x3f7d2c);disc(P,22,20,15,0x4f9a38);disc(P,19,15,9,0x69b84a);for(let i=0;i<22;i++)P(R()<.5?0x35692a:0x7ccf5a,8+R()*30|0,6+R()*28|0,2,2)});
mk('palm',48,64,P=>{P(0,12,56,24,6,.2);for(let i=0;i<34;i++)P(i%4<2?0x8b6a3a:0x6f522b,22+Math.sin(i/9)*3|0,58-i,4,1);const cx=25,cy=26;[[-1,-.2],[1,-.2],[-.7,.5],[.7,.5],[0,-1],[-.4,-.7],[.4,-.7]].forEach(([a,b])=>{for(let k=0;k<16;k++)P(k%3?0x3f9a3a:0x2f7d30,cx+a*k*1.4+0|0,cy+b*k*.9+k*k*.03|0,3,2)});disc(P,cx,cy,2,0x6b4423)});
mk('pad',10,6,P=>{P(0x3f8f3a,1,1,8,4);P(0x58b04a,2,1,5,2);P(0x2e6e2e,4,2,2,1)});mk('flw',4,4,P=>{P(0xf6a1c4,0,1,4,2);P(0xf6a1c4,1,0,2,4);P(0xf7d84a,1,1,2,2)});
mk('boat',32,12,P=>{P(0,2,10,30,2,.2);P(0x6b4423,2,6,28,4);P(0x8b5a2b,0,4,32,3);P(0xc9a85a,6,5,18,1)});mk('lf',2,2,P=>P(0xd9a441,0,0,2,2));mk('sp',3,1,P=>P(0xffffff,0,0,3,1));
mk('arr',9,8,P=>{P(0xf5c542,3,0,3,4);P(0xf5c542,1,4,7,1);P(0xf5c542,2,5,5,1);P(0xf5c542,3,6,3,1);P(0x7a4b24,4,7,1,1)});
const chr=(k,o,d=0,f=0)=>mk(k,12,16,P=>{P(0,2,15,8,1,.3);P(o.pa,3,11,3,4-f);P(o.pa,6,11,3,4-(1-f));P(o.sh,2,6,8,6);P(o.sh,1,7,1,3);P(o.sh,10,7,1,3);P(o.sk,1,10,1,1);P(o.sk,10,10,1,1);P(o.sk,3,1,6,6);
if(d==1)P(o.ha,3,0,6,6);else{P(o.ha,3,0,6,2);P(o.ha,3,2,1,2);P(o.ha,8,2,1,2);if(d!=3)P(0x222,d==0?4:3,4,1,1);if(d!=2)P(0x222,d==0?7:8,4,1,1)}
if(o.long){P(o.ha,2,1,1,8);P(o.ha,9,1,1,8)}if(o.bag&&d!=0){P(o.bag,2,6,8,5);if(o.pk)P(o.pk,4,8,4,2)}
if(o.strap){[3,4,5,6].forEach((i)=>P(0x2b2b2b,i,i+3,1,1));if(d!=1)P(0x2b2b2b,7,10,3,3)}
if(o.hp&&d!=1){P(0x2a2a2a,2,3,1,3);P(0x2a2a2a,9,3,1,3);P(0x2a2a2a,3,0,6,1)}
if(o.scarf)for(let i=0;i<6;i++)P(i%2?0xc23a2a:0xf0f0f0,3+i,7,1,2);
if(o.nb&&d!=1){P(0xf6e7bd,9,9,3,4);P(0x7a4b24,9,9,1,4)}if(o.pc)P(0xf5c542,8,3,1,3);
if(o.ph&&d!=1){P(0x111,9,9,2,3);P(0x7fc4e0,9,9,2,1)}if(o.rec&&d!=1){P(0x888,9,10,2,3);P(0xc33,9,10,1,1)}if(o.wr&&d!=1){P(0xaaa,10,8,1,5);P(0xaaa,9,8,3,1)}});
const AN={ha:0x1b1b1b,sk:0xf0c8a0,sh:0xdfe6ee,pa:0x2c3e6b,bag:0xa0622d,pk:0xc48a50,nb:1,pc:1};
for(let d=0;d<4;d++)for(let f=0;f<2;f++)chr('a'+d+f,AN,d,f);
chr('emma',{ha:0x6b4423,sk:0xf3d0b0,sh:0xf2d27a,pa:0x3a5a8c,hp:1,rec:1,long:1});chr('khoa',{ha:0x222222,sk:0xe8bd90,sh:0x2a6f6a,pa:0x444444,strap:1,ph:1});chr('tu',{ha:0xcfcfcf,sk:0xc99b70,sh:0x6f7d5a,pa:0x3a3a2a,scarf:1,wr:1});
mk('eng',14,10,P=>{P(0,1,9,12,1,.3);P(0x4a5a4a,1,3,10,6);P(0x6a7a6a,1,3,10,2);P(0xb33,3,1,3,2);P(0x222,10,5,3,3)});
const ob=(k,cx,cy,m=1)=>{const f=sc.textures.get(k).getSourceImage(),w=f.width/T*SS*m,h=f.height/T*SS*m,x0=cx*Q-w/2,y0=cy*Q-h/2;sc.add.image(x0*T,(y0+h)*T,k).setOrigin(0,1).setScale(SS*m).setDepth((y0+h)*T);for(let i=0;i<Math.ceil(w);i++)for(let j=0;j<Math.ceil(h);j++){const X=Math.floor(x0)+i,Y=Math.floor(y0)+j;if(B[Y]?.[X]===0)B[Y][X]=1}};
const lab=(x,y,t,c='#fff')=>sc.add.text(x*Q*T,y*Q*T,t,{fontFamily:"'VT323','Be Vietnam Pro',monospace",fontSize:'8px',color:c,stroke:'#3b2412',strokeThickness:2,align:'center'}).setOrigin(.5).setResolution(4).setDepth(9998);
/* Công trình: đặt theo 51 hạng mục của sơ đồ chuẩn (features.js), toạ độ px sơ đồ đã cắt khung — chỉ vẽ hình dáng, không thêm công trình ngoài sơ đồ */
FT.forEach(f=>{const id=f[1],x=f[7],y=f[8],S=SPR[id],MU=MULTI[id];if(S&&!['exh','dt','san','bql','th','th2','stat'].includes(S[0]))ob(S[0],x,y,S[1]);if(MU)MU[1].forEach(([dx,dy])=>ob(MU[0],x+dx,y+dy));
 if(['A4_NHA_KIENG','B2_DIEU_KHAC_1','B3_DIEU_KHAC_2'].includes(id))sc.add.star(x*Q*T,y*Q*T,4,2.2,5.5,0xffd27a).setStrokeStyle(1,0x3b2412).setDepth(5)});
/* Mộ cụ, Chùa Hòa Long, Đền thờ, nhà trưng bày, nhà trong làng: lấy đúng footprint nét đen + mái tô từ sơ đồ (lưới V) — không thêm sprite mô tả kiến trúc */
LBL.filter(l=>!HIDE.has(l[7])||PSK.cfg.debug).forEach(([x,y,t,c,,,,id])=>lab(x,y,t,PSK.cfg.debug&&VERIFY.has(id)?'#ffb4a8':c||'#fff'));
GATES.forEach(([gx,gy,n,a,b,x,y])=>{sc.add.image(x*Q*T,y*Q*T,'rg').setDepth(y*Q*T-1);if(n)lab(x,y-14,n,'#ffd27a')});
const tree=(x,y,k)=>{if(B[y]?.[x]!==0)return;B[y][x]=1;sc.add.image((x+.5)*T,(y+1)*T,k).setOrigin(.5,1).setDepth((y+1)*T)};
MAPDATA.TREES.forEach(([x,y])=>tree(x,y,'tree'));
for(let i=0;i<260;i++){const hs=R()<.6,x=hs?88+R()*24|0:50+R()*28|0,y=hs?109+R()*22|0:70+R()*34|0;if(M[y][x]==2){const p=sc.add.image(x*T+R()*8,y*T+R()*8,R()<.3?'flw':'pad').setDepth(2);sc.tweens.add({targets:p,y:p.y+1.5,yoyo:true,repeat:-1,duration:1500+R()*1500})}}
for(let i=0;i<700;i++){const x=R()*W|0,y=R()*H|0;if(M[y][x]==2){const p=sc.add.image(x*T+R()*12,y*T+R()*14,'sp').setDepth(2).setAlpha(0);sc.tweens.add({targets:p,alpha:.8,yoyo:true,repeat:-1,duration:700+R()*1200,delay:R()*2000})}}
for(let i=0;i<60;i++){const p=sc.add.image(R()*W*T,R()*H*T,'lf').setDepth(9000).setAlpha(0);sc.tweens.add({targets:p,x:'+=40',y:'+=55',alpha:{from:0,to:1},duration:6000+R()*4000,delay:R()*5000,repeat:-1})}
const npc=(k,x,y)=>sc.add.image(x*Q*T,y*Q*T,k).setOrigin(.5,1).setDepth(y*Q*T);
npc('emma',620,1160);npc('khoa',676,1160);npc('tu',1108,952);
sc.add.image(1136*T/8,952*T/8,'eng').setOrigin(.5,1).setDepth(952*T/8-1).setScale(1.2);
const pl=sc.add.image(81.5*T,145*T,'a00').setOrigin(.5,1),arr=sc.add.image(0,0,'arr').setDepth(9999);

const cam=sc.cameras.main;cam.setBounds(0,0,W*T,H*T);cam.startFollow(pl,true,.12,.12);
const zoom=()=>cam.setZoom(Math.max(2,Math.round(Math.min(innerWidth/330,innerHeight/210))));zoom();sc.scale.on('resize',zoom);
Object.assign(sc,{pl,arr,cam,d:0,wt:0});PSK.scene=sc;hudInit(sc);hud();PSK.emit('ready',sc);
seq([['Học sinh (hồi tưởng)','Chuyện ngày xưa có liên quan gì tới tụi em bây giờ không thầy?'],['An','Mình đã trả lời bằng thêm một mốc thời gian. Câu trả lời đúng, nhưng không chạm được điều em ấy muốn biết.'],['Gợi ý','Đi: phím mũi tên / WASD, hoặc chạm giữ trên màn hình. Nói chuyện: E hoặc nút Tương tác. Mở sổ: N.']])}
update(t,dt){const sc=this,pl=this.pl,S=STEPS[st.step];if(ended)return;
 let vx=0,vy=0;if(!busy&&!nbOpen){if(kd.arrowleft||kd.a)vx--;if(kd.arrowright||kd.d)vx++;if(kd.arrowup||kd.w)vy--;if(kd.arrowdown||kd.s)vy++;
  const p=this.input.activePointer;if(!vx&&!vy&&p.isDown){const w=this.cam.getWorldPoint(p.x,p.y),dx=w.x-pl.x,dy=w.y-pl.y+6,h=Math.hypot(dx,dy);if(h>5){vx=dx/h;vy=dy/h}}}
 if(vx||vy){const l=Math.hypot(vx,vy),sp=84*dt/1000;vx=vx/l*sp;vy=vy/l*sp;const bk=(x,y)=>[[-4,0],[4,0],[-4,-3],[4,-3]].some(([a,b])=>B[Math.floor((y+b)/T)]?.[Math.floor((x+a)/T)]!==0);
  if(!bk(pl.x+vx,pl.y))pl.x+=vx;if(!bk(pl.x,pl.y+vy))pl.y+=vy;this.d=Math.abs(vx)>Math.abs(vy)?(vx<0?2:3):(vy<0?1:0);this.wt+=dt;const sk=this.wt/300|0;if(sk!==this.sk){this.sk=sk;window.SFX&&SFX.step(M[Math.floor((pl.y-1)/T)]?.[Math.floor(pl.x/T)])}}
 pl.setTexture('a'+this.d+((this.wt/150|0)%2)).setDepth(pl.y);hudTick(this,dt);
 if(S){this.arr.setVisible(!S.zone||qt<20).setX(S.p[0]*T).setDepth(9999);if(!this.arr.tw)this.arr.tw=1;this.arr.y=S.p[1]*T-30+Math.sin(t/220)*3;
  near=!busy&&Math.hypot(pl.x-S.p[0]*T,pl.y-S.p[1]*T)<26&&!S.zone;$('act').style.display=near&&!nbOpen?'block':'none';
  if(S.zone){const[a,b,c,d]=S.zone,tx=pl.x/T,ty=pl.y/T,inz=tx>=a&&tx<=c&&ty>=b&&ty<=d;if(inz&&!busy){qt+=dt/1000;if(qt<20){$('ui').style.opacity=0;$('vig').className='q'}}
   if(qt>=20&&!busy&&!S.done){S.done=1;$('vig').className='';$('ui').style.opacity=1;
    seq([['Sổ nghe','Bạn vừa quan sát điều gì mà lúc nãy mình đã đi quá nhanh?',[['Tiếng gió và tiếng lá xa xa.',()=>{K.known.push('Khu mộ yên tĩnh: gió, lá, bước chân xa.')}],['Bậc thềm, mái vòm và làn khói hương.',()=>{K.known.push('Mái vòm, bậc thềm và làn khói hương ở khu mộ.')}],['Mình vừa đi quá nhanh, chưa nhìn gì.',()=>{K.open.push('Mình chưa nhìn kỹ khu mộ – quay lại sau?')}]]],
    ['Sổ nghe','Một nơi tưởng niệm cần người đến xem, hay cần người đến hiểu?',[['Cần người đến hiểu.',()=>{st.tr++}],['Cần người đến xem, để nhớ.',()=>{}],['Mình chưa biết – cần hỏi thêm.',()=>{K.open.push('Nơi tưởng niệm cần người đến xem hay đến hiểu?')}]]],
    ['Khoa','…Im lặng lâu vậy mà tớ không thấy sốt ruột. Lạ thật.']],()=>nx())}}}}}
