/* HUD mục tiêu, Sổ nghe, màn kết, phím tắt */
const hud=()=>{const S=STEPS[st.step];$('obt').textContent=S?S.o:'Hoàn tất bản đồ!';$('oh').textContent='MỤC TIÊU '+Math.min(st.step+1,STEPS.length)+'/'+STEPS.length;$('pips').innerHTML=STEPS.map((_,i)=>'<i class="'+(i<st.step?'on':i==st.step?'cur':'')+'"></i>').join('')};
const li=a=>'<ul>'+(a.length?a.map(x=>'<li>'+x+'</li>').join(''):'<li><i>(chưa có)</i></li>')+'</ul>';
function nbook(){const o=$('nb');nbOpen=!nbOpen;o.style.display=nbOpen?'flex':'none';if(!nbOpen)return;
$('nbc').innerHTML='<h3>📖 Sổ nghe</h3><p><i>Bìa trong: Ai đang kể? · Ai cho phép kể? · Ai sẽ kể tiếp?</i></p><div class=cols><div><b>Điều đã biết</b>'+li(K.known)+'</div><div><b>Điều được kể</b>'+li(K.told)+'</div><div><b>Điều còn bỏ ngỏ</b>'+li(K.open)+'</div></div>'+(st.boat?'<p>✏️ Nét chì ở lề: chiếc xuồng ba lá.</p>':'')+'<b>Từ vựng</b>'+li(V.map(w=>w.replace('|',' – ')))+'<button class=bt onclick="nbook()">Đóng</button>'}
$('nbb').onclick=nbook;
function fin(){PSK.emit('end',st);ended=true;$('act').style.display='none';const n=st.c.name?'Một cái tên được điền tạm vào chỗ trống, gắn nhãn “giả thuyết”; cần gỡ lại khi có nguồn.':'Chỗ trống bên cạnh “Người lái đò” được giữ nguyên dấu hỏi.',r=st.c.rush?' Có lúc nhóm hỏi vội; bác Tư dè dặt hơn.':' Nhóm hỏi nguồn mà không làm người kể thấy bị chất vấn.';
$('end').style.display='flex';$('endc').innerHTML='<h3>Hết Chương 1 – Dấu mực bên lề</h3><p><b>Chú giải của nhóm:</b> '+n+r+'</p><p>Sổ nghe: '+K.known.length+' dấu vết đã đối chiếu · '+K.told.length+' lời kể · '+K.open.length+' điều còn bỏ ngỏ.</p><p>Mở khóa: tuyến tư liệu về làng Hòa An xưa.</p><p><i>Chương 2: Làng có tiếng nói (sắp tới)</i></p><button class=bt onclick="nbook()">Xem Sổ nghe</button> <button class=bt onclick="location.reload()">Chơi lại</button>'}

const kd={};addEventListener('keydown',e=>{const k=e.key.toLowerCase();kd[k]=1;if(k.startsWith('arrow')||k==' ')e.preventDefault();
 if('e enter'.split(' ').includes(k)||k==' ')act();if(k=='n')nbook();if(k=='c')cbook()});addEventListener('keyup',e=>delete kd[e.key.toLowerCase()]);
const act=()=>{if(adv)return adv();if(near&&!busy&&!nbOpen&&!ended&&!STEPS[st.step].zone)STEPS[st.step].run()};$('act').onclick=act;

