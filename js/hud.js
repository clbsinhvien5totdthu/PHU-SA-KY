/* Minimap, tên khu vực, đồng hồ, chỉ số */
/* ===== HUD ===== */
let mm0,zn='',clk=17*60+30,mc='';
function hudInit(sc){mm0=document.createElement('canvas');mm0.width=W;mm0.height=H;const q=mm0.getContext('2d');q.drawImage(sc.textures.get('map').getSourceImage(),0,0,W,H)}
addEventListener('keydown',e=>{if(e.key.toLowerCase()=='m')$('side').classList.toggle('big')});
function hudTick(sc,dt){const pl=sc.pl,px=pl.x/T/Q,py=pl.y/T/Q,z=ZN.find(a=>px>=a[1]&&px<=a[3]&&py>=a[2]&&py<=a[4]),n=z?z[0]:'Đường nội khu';
if(n!==zn){zn=n;PSK.emit('zone',n);const l=$('loc');l.textContent='📍 '+n;l.classList.remove('f');void l.offsetWidth;l.classList.add('f')}
clk=Math.min(clk+dt/1000*.5,18*60+40);const m=clk|0,c='🕔 '+Math.floor(m/60)+':'+String(m%60).padStart(2,'0')+' · '+(m<18*60+10?'Chiều muộn':'Hoàng hôn')+'|Dấu vết '+K.known.length+' · Lời kể '+K.told.length+' · Bỏ ngỏ '+K.open.length;
if(c!==mc){mc=c;const[a,b]=c.split('|');$('clk').textContent=a;$('mtr').textContent=b}
const q=$('mm').getContext('2d'),S=STEPS[st.step];q.drawImage(mm0,0,0);if(S){q.fillStyle='#ffd24a';q.strokeStyle='#3b2412';q.lineWidth=1;q.beginPath();q.arc(S.p[0],S.p[1],3+Math.sin(performance.now()/200),0,7);q.fill();q.stroke()}
q.fillStyle='#fff';q.strokeStyle='#d0342c';q.lineWidth=1.5;q.beginPath();q.arc(pl.x/T,pl.y/T,2.4,0,7);q.fill();q.stroke();$('stat').style.opacity=busy?0:1}

