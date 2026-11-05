/* Chân dung thoại + hồ sơ nhân vật [C] */
function drawP(c,n){const o=PC[n],g=c.getContext('2d');g.clearRect(0,0,16,16);const P=(col,x,y,w,h)=>{g.fillStyle=col;g.fillRect(x,y,w,h)};
P(o.sh,2,11,12,5);P(o.sk,6,10,4,2);P(o.sk,4,3,8,8);P(o.ha,4,2,8,2);P(o.ha,4,3,1,3);P(o.ha,11,3,1,3);P('#222',6,6,1,1);P('#222',9,6,1,1);P('#a0563c',7,9,2,1);
const K=o.k;if(K=='an'){P('#222',5,5,2,1);P('#222',9,5,2,1);P('#f5c542',12,4,1,4);P('#a0622d',3,12,1,4);P('#a0622d',12,12,1,4)}
if(K=='em'){P(o.ha,3,3,1,9);P(o.ha,12,3,1,9);P('#2a2a2a',3,5,1,3);P('#2a2a2a',12,5,1,3);P('#2a2a2a',4,11,8,1);P('#2a2a2a',3,11,1,3);P('#2a2a2a',12,11,1,3)}
if(K=='kh'){[4,5,6].forEach((x,i)=>P('#2b2b2b',x,11+i,1,1));P('#2b2b2b',7,14,2,2)}
if(K=='tu'){P('#b8b0a0',5,7,1,1);P('#b8b0a0',10,7,1,1);for(let i=0;i<6;i++)P(i%2?'#c23a2a':'#f0f0f0',5+i,10,1,2)}
if(K=='ha'){P('#3a2a22',6,1,4,2);P('#555',5,5,3,1);P('#555',8,5,3,1);P('#555',5,7,3,1);P('#555',8,7,3,1)}
if(K=='lam'){P('#555',5,5,3,1);P('#555',8,5,3,1);P('#b8b0a0',5,8,1,1);P('#b8b0a0',10,8,1,1)}}
function portrait(sp){const n=Object.keys(PC).find(k=>sp.startsWith(k)),c=$('pp');if(!n){c.style.display='none';return}drawP(c,n);c.style.display='block'}
function cbook(){const o=$('cp');if(busy&&o.style.display!='flex')return;const on=o.style.display!='flex';o.style.display=on?'flex':'none';nbOpen=on;if(!on)return;
$('cpc').innerHTML='<h3>👥 Hồ sơ nhân vật</h3><div class=cg>'+CH.map((c,i)=>`<div class=cd><canvas id=cv${i} width=16 height=16></canvas><div><b>${c[0]}</b> · ${c[1]}<small><b>Muốn:</b> ${c[2]}</small><small><b>Cần:</b> ${c[3]}</small><small><b>Điểm mù:</b> ${c[4]}</small><small><b>Gắn với:</b> ${c[5]}</small></div></div>`).join('')+'</div><button class=bt onclick="cbook()">Đóng</button>';CH.forEach((c,i)=>drawP($('cv'+i),c[0]))}
$('cbb').onclick=cbook;
