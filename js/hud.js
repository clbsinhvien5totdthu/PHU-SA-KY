/* Minimap, tên khu vực, đồng hồ, chỉ số */
/* ===== HUD ===== */
let mm0,zn='',clk=17*60+30,mc='';
function hudInit(sc){mm0=document.createElement('canvas');mm0.width=W;mm0.height=H;const q=mm0.getContext('2d'),im=q.createImageData(W,H),PL=[[111,174,94],[203,163,116],[74,146,184],[224,154,66],[47,106,74],[234,223,195],[169,192,143],[156,95,55],[214,198,166],[119,122,152],[234,223,195],[156,95,55]];for(let y=0;y<H;y++)for(let x=0;x<W;x++){const c=PL[M[y][x]],i=(y*W+x)*4;im.data[i]=c[0];im.data[i+1]=c[1];im.data[i+2]=c[2];im.data[i+3]=255}q.putImageData(im,0,0)}
addEventListener('keydown',e=>{if(e.key.toLowerCase()=='m')$('side').classList.toggle('big')});
function hudTick(sc,dt){const pl=sc.pl,px=pl.x/T/Q,py=pl.y/T/Q,z=ZN.find(a=>px>=a[1]&&px<=a[3]&&py>=a[2]&&py<=a[4]),n=z?z[0]:'Đường nội khu';
if(n!==zn){zn=n;PSK.emit('zone',n);const l=$('loc');l.textContent='📍 '+n;l.classList.remove('f');void l.offsetWidth;l.classList.add('f')}
clk=Math.min(clk+dt/1000*.5,18*60+40);const m=clk|0,c='🕔 '+Math.floor(m/60)+':'+String(m%60).padStart(2,'0')+' · '+(m<18*60+10?'Chiều muộn':'Hoàng hôn')+'|Dấu vết '+K.known.length+' · Lời kể '+K.told.length+' · An nghĩ '+K.open.length;
if(c!==mc){mc=c;const[a,b]=c.split('|');$('clk').textContent=a;$('mtr').textContent=b}
const S=STEPS[st.step],now=performance.now();if(now-(hudTick.mt||0)>110){hudTick.mt=now;const q=$('mm').getContext('2d');q.drawImage(mm0,0,0);if(S){q.fillStyle='#ffd24a';q.strokeStyle='#3b2412';q.lineWidth=2;q.beginPath();q.arc(S.p[0],S.p[1],6+2*Math.sin(performance.now()/200),0,7);q.fill();q.stroke()}
q.fillStyle='#fff';q.strokeStyle='#d0342c';q.lineWidth=3;q.beginPath();q.arc(pl.x/T,pl.y/T,4.8,0,7);q.fill();q.stroke()}$('stat').style.opacity=busy?0:1}

