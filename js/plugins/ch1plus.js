/* Chương 1 – nâng cấp HUD/UX + gameplay (v18). Không sửa lõi: móc vào PSK.on('step'), bọc STEPS[i].run, bọc HA.nbHtml và fin().
   Vòng chơi mới: ĐẶT GIẢ THUYẾT SỚM → bị kiểm chứng ở Nhà trưng bày → lớp dấu mực đảo chiều giữa chương → bác Tư (hỏi có hạn, phải bỏ bớt câu) →
   bàn đóng dấu hồ sơ nguồn (một màn hình, hai trục) → thẻ triển lãm có CÁI GIÁ nhìn thấy được.
   Giữ nguyên nguyên tắc: không giới hạn thời gian, không trừ điểm, khu mộ không có điểm chạm, nội dung hư cấu luôn gắn nhãn.
   Chi tiết hư cấu thêm mới (dấu mực trên bản đồ số, “ông Bảy”) chỉ nằm trong sách/bản đồ số/lời kể hư cấu – không đặt lên hiện vật hay khu tưởng niệm thật. */
(()=>{
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const el=(tag,id,cls,html)=>{const e=document.createElement(tag);if(id)e.id=id;if(cls)e.className=cls;if(html!=null)e.innerHTML=html;return e};
const CH={};window.CH1=CH;
const A=()=>st.c;
const whenFree=(fn,n=0)=>{if(!busy&&!nbOpen)return fn();if(n<80)setTimeout(()=>whenFree(fn,n+1),150)};

/* ---------- dữ liệu ---------- */
const HY={
 site:{s:'Mốc xây dựng khu di tích',t:'Thời gian xây dựng và hình thành khu di tích.'},
 person:{s:'Thời cụ Sắc ở Hòa An',t:'Thời gian cụ Nguyễn Sinh Sắc sinh sống, hoạt động ở Hòa An.'},
 own:{s:'Mốc người viết tự đặt',t:'Một mốc do chính người viết ghi chú tự đặt, không dựa vào tư liệu nào.'},
 none:{s:'Chưa đoán – đi tìm dữ kiện',t:'Chưa đủ cơ sở để đoán; đi tìm dữ kiện trước.'}};
const HS={open:['⏳','chờ kiểm chứng'],partial:['◐','đúng một phần'],revised:['✎','đã tự sửa']};
const QS=[
 [/Cổng số 1/,'Dòng ghi chú “Hòa An – 1927–1929” đang nói về thời kỳ nào?'],
 [/khu mộ/i,'Một nơi tưởng niệm cần mình hành xử thế nào?'],
 [/mặt nước|ao sen/i,'Mình ghi lại điều gì – và nó thuộc loại nào: nghe, thấy hay cảm nhận?'],
 [/Nhà trưng bày/,'Thẻ nào kiểm tra trực tiếp giả thuyết của bạn?'],
 [/nhà sàn/i,'Đây là hiện vật gốc hay bản tái dựng?'],
 [/ba cụm nghề/,'Ba cụm nghề này khác nhau ở âm thanh nào?'],
 [/bác Tư/i,'Điều nào bác tự thấy, điều nào bác nghe kể lại?'],
 [/Bến sổ|hồ sơ nguồn/i,'Điều gì đủ căn cứ để viết lên thẻ triển lãm?'],
 [/Cổng số 2/,'Ai đang kể câu chuyện phía sau tiếng mái chèo?']];
const FR={
 source:{k:'told',t:'Bác Tư (lời kể, hư cấu): chuyện má kể mang theo giọng má, chuyện trong sách mang theo trang giấy; bác không trộn hai thứ.',s:'chuyện nghe và chuyện đọc không trộn một dòng',q:'Bác phân biệt chuyện nghe từ gia đình với chuyện đọc trong sách thế nào'},
 lead:{k:'open',t:'Đầu mối cho chặng sau: “ông Bảy” (nhân vật hư cấu) có thể nhớ thêm – chưa gặp, chưa xin phép, chưa có lời kể nào.',s:'có thể còn một người nhớ thêm – chưa gặp, chưa xin phép',q:'Có ai khác còn nhớ chuyện này để hỏi thêm'},
 place:{k:'told',t:'Bác Tư (lời kể, hư cấu): bến đổi theo con nước, không nên ghim một điểm cố định.',s:'bến đổi theo con nước – chỉ vẽ vùng ước chừng',q:'Bến này ngày xưa khác bây giờ thế nào'},
 rush:{k:null,s:'hỏi dồn thì bác khó nói',q:''},none:{k:null,s:'chưa hỏi thêm bác Tư',q:''}};

/* ---------- HUD: câu hỏi dẫn dắt, giả thuyết, bộ đếm, la bàn ---------- */
const hud0=$('hud'),oq=el('div','oq',null,'');hud0.insertBefore(oq,hud0.firstChild);
const hy=el('button','hy','box','');hy.type='button';hy.onclick=()=>nbook();$('ui').appendChild(hy);
const qturn=el('div','qturn','box','');$('ui').appendChild(qturn);
const pops=el('div','pops');$('ui').appendChild(pops);
const cmp=el('div','cmp',null,'<img alt="" src="assets/ui/arrow_e.png"><span></span>');$('ui').appendChild(cmp);
const ARW=['e','se','s','sw','w','nw','n','ne'];
const mmi=el('canvas','mmi');mmi.width=460;mmi.height=352;$('side').appendChild(mmi);

function refresh(){
 const S=STEPS[st.step];let t=ended||!S?'Mình đã trả lời được gì – và còn bỏ ngỏ điều gì?':'';
 if(S){const m=QS.find(([r])=>r.test(S.o));t=m?m[1]:''}
 oq.innerHTML=t?'<b><i class="ic ic-question" aria-hidden="true"></i>CÂU HỎI</b>'+esc(t):'';oq.setAttribute('aria-live','polite');oq.style.display=t?'block':'none';
 const a=A();
 if(a.hyp){const h=HY[a.hyp],s=HS[a.hs||'open'];hy.innerHTML='🧭 <b>Giả thuyết #1</b> · '+esc(h.s)+' <span class=bd>'+s[0]+' '+s[1]+'</span>';hy.style.display='block';hy.title='Mở Sổ tay'}else hy.style.display='none';
 hy.style.top=(hud0.offsetTop+hud0.offsetHeight+8)+'px';
 const n=a.turn||0;qturn.innerHTML='<b>Sức bác Tư</b> '+[0,1,2,3].map(i=>'<i class="'+(i<4-n?'u':'')+'"></i>').join('')+'<small>'+(n>=4?'bác nghỉ':'còn '+(4-n)+' lượt')+'</small>';
 hy.style.top=(hud0.offsetTop+hud0.offsetHeight+8)+'px';qturn.style.top=(hud0.offsetTop+hud0.offsetHeight+8+(a.hyp?hy.offsetHeight+6:0))+'px'}
CH.refresh=refresh;
CH.turn=()=>{A().turn=Math.min(4,(A().turn||0)+1);refresh()};

/* nhắm vào cụm nghề chưa xong gần nhất trong bước vòng làng (kéo theo mũi tên, minimap, la bàn) */
const CLS=[['xay',306,232],['xat',316,241],['ren',304,256]];
function retarget(){const S=STEPS[st.step];if(!S||!S.sm||!PSK.scene)return;const h=A().ha||{},fin=id=>h.obs&&h.obs[id]&&h.heard&&h.heard[id];
 const left=CLS.filter(c=>!fin(c[0]));if(!left.length)return;const pl=PSK.scene.pl;
 const cur=left.find(c=>c[0]==A().tgt)||left.sort((a,b)=>Math.hypot(pl.x-a[1]*T,pl.y-a[2]*T)-Math.hypot(pl.x-b[1]*T,pl.y-b[2]*T))[0];A().tgt=cur[0];S.p=[cur[1],cur[2]]}

let lk=[0,0,0],tk=0;
function frame(now){
 requestAnimationFrame(frame);
 if(now-tk<90)return;tk=now;
 /* bộ đếm “＋1” khi sổ có thêm mục */
 const L=[K.known.length,K.told.length,K.open.length],nm=['Dấu vết','Lời kể','An nghĩ'];
 L.forEach((v,i)=>{if(v>lk[i]&&lk[i]+v>0&&frame.ok){const p=el('div',null,'pop box','＋'+(v-lk[i])+' '+nm[i]);pops.appendChild(p);setTimeout(()=>p.remove(),2600)}});lk=L;frame.ok=1;
 retarget();ambTick();
 /* la bàn mép màn hình */
 const S=STEPS[st.step],sc=PSK.scene;let show=false;
 if(S&&sc&&sc.cam&&sc.pl&&!busy&&!nbOpen&&!ended&&!document.body.classList.contains('cine')){
  const wv=sc.cam.worldView,z=sc.cam.zoom,w=innerWidth,h=innerHeight,tx=S.p[0]*T,ty=S.p[1]*T,sx=(tx-wv.x)*z,sy=(ty-wv.y)*z;
  if(!(sx>60&&sx<w-60&&sy>110&&sy<h-80)){show=true;const ang=Math.atan2(sy-h/2,sx-w/2),sr=$('side').getBoundingClientRect(),hd=$('hud').getBoundingClientRect();let x,y=Math.min(h-150,Math.max(175,sy)),y2;if(sx>sr.left-70){x=Math.min(w-50,sx);y2=Math.max(y,sr.bottom+40)}else{x=Math.max(60,sx);y2=(x<hd.right+20&&y<hd.bottom+80)?hd.bottom+90:y}const d=Math.hypot(tx-sc.pl.x,ty-sc.pl.y);
   const uz=+getComputedStyle($('ui')).zoom||1,dn=ARW[Math.round(((ang*180/Math.PI)+360)%360/45)%8],im=cmp.firstChild,u='assets/ui/arrow_'+dn+'.png';cmp.style.transform='translate('+((x-23)/uz)+'px,'+((y2-23)/uz)+'px)';if(im.dataset.d!==dn){im.dataset.d=dn;im.src=u}cmp.lastChild.textContent=Math.max(1,Math.round(d/120))+' giây'}}
 cmp.style.display=show?'block':'none';
 /* lớp dấu mực trên minimap */
 const q=mmi.getContext('2d');q.clearRect(0,0,460,352);
 if(A().ink){const w2=$('mm').offsetWidth,h2=$('mm').offsetHeight;mmi.style.width=w2+'px';mmi.style.height=h2+'px';const pz=3+2*Math.sin(now/260);
  q.lineWidth=3;CLS.forEach(c=>{q.fillStyle='#2b3a8f';q.strokeStyle='#f6e7bd';q.beginPath();q.ellipse(c[1],c[2],10,7,-.5,0,7);q.fill();q.stroke();q.strokeStyle='rgba(43,58,143,.7)';q.beginPath();q.arc(c[1],c[2],15+pz*1.5,0,7);q.stroke()});
  q.font='700 30px sans-serif';q.fillStyle='#f6e7bd';q.strokeStyle='#2b3a8f';q.lineWidth=5;q.strokeText('✎ lớp mực (hư cấu)',12,340);q.fillText('✎ lớp mực (hư cấu)',12,340)}}
requestAnimationFrame(frame);


/* ---------- G7: âm thanh định hướng ở vòng làng (WebAudio riêng, nhỏ dần theo khoảng cách, pan trái/phải, luôn có phụ đề chữ) ---------- */
const snd=el('button','snd','box','');snd.type='button';snd.onclick=()=>{A().amb=A().amb===0?1:0;ambTick()};$('ui').appendChild(snd);
const amb={ac:null,m:null,nb:null,v:{}};CH.amb=amb;
const ensure=()=>{if(amb.ac){amb.ac.state=='suspended'&&amb.ac.resume();return amb.ac}
 try{const ac=new(window.AudioContext||window.webkitAudioContext)();amb.ac=ac;amb.m=ac.createGain();amb.m.gain.value=1;amb.m.connect(ac.destination);
  const nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate),d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;amb.nb=nb}catch(e){amb.ac=null}
 return amb.ac};
['pointerdown','keydown'].forEach(ev=>addEventListener(ev,()=>{const S=STEPS[st.step];if(S&&S.sm)ensure()},{passive:true}));
function mkVoice(id){const ac=amb.ac,g=ac.createGain(),pn=ac.createStereoPanner?ac.createStereoPanner():null;g.gain.value=0;if(pn){g.connect(pn);pn.connect(amb.m)}else g.connect(amb.m);
 const src=()=>{const x=ac.createBufferSource();x.buffer=amb.nb;x.loop=true;return x},v={g,pn,stop:[],ping:null};
 const gate=(type,hz)=>{const l=ac.createOscillator(),ld=ac.createGain(),lg=ac.createGain();l.type=type;l.frequency.value=hz;lg.gain.value=.5;ld.gain.value=.5;l.connect(ld);ld.connect(lg.gain);l.start();v.stop.push(l);return lg};
 if(id=='xay'){const x=src(),f=ac.createBiquadFilter();f.type='bandpass';f.frequency.value=240;f.Q.value=1.6;const lg=gate('sine',1.1);x.connect(f);f.connect(lg);lg.connect(g);x.start();v.stop.push(x)}
 else if(id=='xat'){const x=src(),f=ac.createBiquadFilter();f.type='highpass';f.frequency.value=2400;const lg=gate('square',3.2);x.connect(f);f.connect(lg);lg.connect(g);x.start();v.stop.push(x)}
 else{const o=ac.createOscillator(),og=ac.createGain();o.type='triangle';o.frequency.value=1250;og.gain.value=0;o.connect(og);og.connect(g);o.start();v.stop.push(o);v.ping=og}
 return v}
const DIRS=['◀ bên trái','▶ bên phải','▲ phía trên','▼ phía dưới'];
function ambTick(){const S=STEPS[st.step],sc=PSK.scene,ac=amb.ac,on=S&&S.sm&&!ended&&sc&&sc.pl;
 if(!on&&!Object.keys(amb.v).length){snd.style.display='none';return}
 const h=A().ha||{},fin=id=>h.obs&&h.obs[id]&&h.heard&&h.heard[id],off=A().amb===0,
  mute=busy||nbOpen||CH.open||document.body.classList.contains('cine')||($('sm')&&$('sm').style.display=='flex');
 let best=null;
 if(ac&&sc&&sc.pl)CLS.forEach(([id,cx,cy])=>{let v=amb.v[id];const want=on&&!off&&!fin(id);
  if(want&&!v&&ac.state=='running')v=amb.v[id]=mkVoice(id);if(!v)return;
  const dx=cx*T-sc.pl.x,dy=cy*T-sc.pl.y,d=Math.hypot(dx,dy),vol=want&&!mute?Math.pow(Math.max(0,1-d/(24*T)),1.6)*.32:0,t=ac.currentTime;
  v.g.gain.setTargetAtTime(vol,t,.12);if(v.pn)v.pn.pan.setTargetAtTime(Math.max(-1,Math.min(1,dx/(8*T))),t,.1);
  if(v.ping&&vol>0&&t>(v.nx||0)){v.ping.gain.cancelScheduledValues(t);v.ping.gain.setValueAtTime(.0001,t);v.ping.gain.linearRampToValueAtTime(1,t+.005);v.ping.gain.exponentialRampToValueAtTime(.0005,t+1.1);v.nx=t+2.4}
  if(!want&&v.g.gain.value<.003){v.stop.forEach(n=>{try{n.stop()}catch(e){}});v.g.disconnect();delete amb.v[id]}
  if(want&&vol>.03&&(!best||vol>best.vol))best={vol,dx,dy}});
 if(!on){snd.style.display='none';return}
 snd.style.display='block';
 if(off)snd.innerHTML='🔇 <b>Âm thanh vòng làng đang tắt</b> · bấm để bật lại';
 else if(best){const dir=Math.abs(best.dx)>=Math.abs(best.dy)?(best.dx<0?0:1):(best.dy<0?2:3);snd.innerHTML='🔊 <b>Có tiếng động</b> '+DIRS[dir]+' · '+(best.vol>.14?'gần':'xa')+' <small>(bấm để tắt)</small>'}
 else snd.innerHTML='🔊 <b>Đi quanh làng và lắng nghe</b> <small>(bấm để tắt âm thanh)</small>'}

/* ---------- Sổ tay: thêm “Bảng giả thuyết” ---------- */
if(window.HA){const o=HA.nbHtml;HA.nbHtml=()=>{const a=A();let h='<b>Bảng giả thuyết</b> <small>(đặt sớm, bị kiểm chứng, tự sửa – không có đáp án “đúng sai” để chấm điểm)</small><ul class=obj>';
 if(a.hyp){const s=HS[a.hs||'open'];h+='<li><b>#1</b> '+esc(HY[a.hyp].t)+' <span class=tg>'+s[0]+' '+s[1]+'</span>'+(a.hnote?'<small>'+esc(a.hnote)+'</small>':'')+'</li>'}else h+='<li><i>(chưa đặt – sẽ đặt ở Cổng số 1)</i></li>';
 if(a.ink)h+='<li><b>#2</b> Lớp dấu mực trên bản đồ số trùng ba cụm nghề – ai đánh dấu, khi nào? <span class=tg>chưa rõ</span></li>';
 if(a.frag&&FR[a.frag]&&a.frag!='none')h+='<li><b>Câu bạn đã hỏi bác Tư:</b> '+esc(FR[a.frag].s)+'</li>';
 return h+'</ul>'+o()}}

/* ---------- G1: đặt giả thuyết sớm ở Cổng số 1 ---------- */
const S0=STEPS[0];
if(S0&&/Cổng số 1/.test(S0.o)){const o=S0.run;S0.run=()=>{if(A().hyp)return o();
 const pick=(k,lines)=>()=>{const a=A();a.hyp=k;a.hs='open';K.open.push(k=='none'?'Giả thuyết #1 (chưa đặt): giữ “chưa biết”, đi tìm dữ kiện trước.':'Giả thuyết #1 (chưa kiểm chứng): dòng “Hòa An – 1927–1929” là '+HY[k].t.charAt(0).toLowerCase()+HY[k].t.slice(1));refresh();toast('Đã ghi Giả thuyết #1 vào Sổ tay');return lines};
 return seq([
  ['Khoa','Khoan vào đã. Trên bản đồ số có dòng ghi chú bên lề “Hòa An – 1927 đến 1929”. Trước khi đọc bất cứ thứ gì, mỗi người đặt một giả thuyết đi: dòng này đang nói về thời kỳ nào?'],
  ['An – giả thuyết #1','Theo mình, dòng ghi chú này nhiều khả năng nói về…',[
   ['Thời gian xây dựng và hình thành khu di tích.',pick('site',[['Khoa','Tớ cũng nghiêng về hướng đó – mốc di tích dễ ghim lên bản đồ.'],EM('Maybe. But a monument has its own dates. Let’s check the board before we decide.','Có thể. Nhưng một công trình có những mốc riêng của nó. Mình xem bảng trước khi kết luận.',{c:'A building has its own dates.'})])],
   ['Thời gian cụ Nguyễn Sinh Sắc sinh sống, hoạt động ở Hòa An.',pick('person',[EM('I think so too: a person’s years in a place. But we need a source for that.','Tớ cũng nghĩ vậy: những năm một người ở một nơi. Nhưng mình cần một nguồn.',{c:'We need a source.'}),['Khoa','Nghe có lý, nhưng “nghe có lý” chưa phải “đã kiểm chứng”. Tớ chờ nguồn.']])],
   ['Một mốc do chính người viết ghi chú tự đặt.',pick('own',[['Khoa','Hmm, người viết tự đặt mốc năm? Nghe lạ, nhưng thử kiểm tra cũng không mất gì.'],EM('Possible. Writers make mistakes. Let’s look for the same date somewhere else.','Cũng có thể. Người viết cũng nhầm. Mình tìm xem mốc này có ở chỗ nào khác không.',{c:'Look for the same date elsewhere.'})])],
   ['Mình chưa đủ cơ sở để đoán – đi tìm dữ kiện trước.',pick('none',[['An','Mình chưa muốn đoán. Ghi “chưa biết”, đi tìm dữ kiện.'],['Khoa','Ổn. Nhưng tớ cá là tới nhà trưng bày cậu sẽ có giả thuyết rồi.']])]]]
 ],()=>o())}}

/* ---------- G2: kiểm chứng giả thuyết ở Nhà trưng bày ---------- */
function resolveHyp(){const a=A();if(a.hres)return;a.hres=1;const k=a.hyp||'none';
 const R={
  site:{hs:'revised',n:'Mốc khởi công và khánh thành khu di tích là 1975–1977; ghi chú nói 1927–1929 – hai mốc khác nhau. Đã sửa: ghi chú khớp phần giới thiệu về thời cụ Sắc ở Hòa An.',
   L:[['An','Giả thuyết của mình lệch rồi: mốc khởi công và khánh thành khu di tích là 1975–1977, còn ghi chú nói 1927–1929.'],['Khoa','Tự sửa trước khi ai bắt lỗi – đó mới là việc của người làm tư liệu. Tớ gắn nhãn “đã sửa” cho giả thuyết #1.']]},
  person:{hs:'partial',n:'Khớp về mốc năm với thẻ 1927–1929 (theo nguồn địa phương). Mới một nguồn; chưa trả lời “vì sao Hòa An lặp lại” và “người lái đò là ai”.',
   L:[['An','Giả thuyết khớp về mốc năm: thẻ 1927–1929 nói đúng về thời cụ Sắc ở Hòa An.'],['Khoa','Khớp một nguồn thôi. Nó chưa nói vì sao Hòa An cứ lặp lại, cũng chưa nói người lái đò là ai. Tớ ghi “đúng một phần”.']]},
  own:{hs:'revised',n:'Cùng mốc 1927–1929 xuất hiện trong phần giới thiệu của nhà trưng bày, nên không phải mốc người viết tự đặt. “Hòa An lặp lại” vẫn chưa có lời giải.',
   L:[['An','Không phải mốc người viết tự đặt: cùng mốc 1927–1929 có trong phần giới thiệu của nhà trưng bày.'],EM('So the date is not the mystery. The repeating place is.','Vậy mốc năm không phải điều bí ẩn. Cái lặp lại mới là điều bí ẩn.',{c:'What keeps repeating?'})]},
  none:{hs:'partial',n:'Giữ “chưa biết” rồi tìm dữ kiện: ghi chú khớp thẻ 1927–1929 – giờ đã có một giả thuyết có căn cứ.',
   L:[['An','Mình giữ “chưa biết” và giờ có dữ kiện: ghi chú khớp thẻ 1927–1929.'],['Khoa','Giả thuyết có căn cứ còn tốt hơn giả thuyết đoán trước. Tớ ghi vào bảng.']]}}[k];
 a.hs=R.hs;a.hnote=R.n;K.open.push('Giả thuyết #1 – kết quả: '+R.n);refresh();
 seq([['Sổ nghe – Giả thuyết #1','Đối chiếu với nhà trưng bày: '+HS[R.hs][1]+'.'],...R.L,['An','Câu hỏi mới: vì sao Hòa An cứ xuất hiện lại trong ghi chú? Ra làng Hòa An xem.']])}

/* ---------- G3: lớp dấu mực (đảo chiều giữa chương) ---------- */
function revealInk(){const a=A();if(a.ink)return;a.ink=1;a.hs=a.hs||'open';
 seq([['Khoa','Khoan. Tớ bật lớp “dấu mực” trên bản đồ số: mấy nét chì mờ ở mép trang trùng đúng ba cụm nghề mình vừa nghe.'],['An','Có ai đó từng đi đúng đường này và đánh dấu lại.'],['Khoa','Hoặc có người vẽ lên sau khi đọc về Hòa An. Tớ chưa biết, nên chưa ghim.'],EM('Someone was here before us. Or someone wants us to think so.','Có người đã ở đây trước tụi mình. Hoặc có người muốn mình nghĩ vậy.',{s:'Someone was here before us. Maybe.',c:'Look at the small marks on the map.',k:'mark = nét đánh dấu'}),['Ghi chú','Lớp dấu mực là chi tiết hư cấu, chỉ nằm trên bản đồ số của Khoa – không đặt lên hiện vật hay khu tưởng niệm thật.']],
  ()=>{K.open.push('Lớp dấu mực trên bản đồ số trùng ba cụm nghề: ai đánh dấu, và khi nào? (chưa rõ)');refresh()})}

PSK.on('step',i=>{refresh();const prev=STEPS[i-1];if(!prev)return;
 if(/Nhà trưng bày/.test(prev.o))whenFree(resolveHyp);
 if(prev.sm)whenFree(revealInk)});
PSK.on('ready',refresh);refresh();

/* ---------- G4: bác Tư – lượt hỏi có hạn; “để dành” các câu không hỏi ---------- */
CH.saved=k=>{if(A().fragDone)return;A().fragDone=1;A().frag=k;const f=FR[k];if(f&&f.k)K[f.k].push(f.t);
 ['source','lead','place'].filter(x=>x!=k).forEach(x=>K.open.push('Để dành cho lần sau (chưa kịp hỏi bác Tư): '+FR[x].q+'?'));CH.turn()};

/* ---------- G5: bàn đóng dấu hồ sơ nguồn (một màn hình, hai trục) ---------- */
CH.stamp=next=>{
 const IDX=[0,2,4],AUTO=[1,3];let sel={},ok={},hint={},tries=0,phase='pick',closed=0,msg='Chọn (A) loại nguồn và (B) trạng thái kiểm chứng cho ba thẻ. Hai thẻ còn lại Khoa đã đóng dấu sẵn. Không có thời gian, không trừ điểm.';
 IDX.forEach(i=>{sel[i]={a:null,b:null};ok[i]={a:0,b:0};hint[i]={a:0,b:0}});
 let o=$('stp');if(!o){o=el('div','stp');o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Bàn đóng dấu hồ sơ nguồn');document.body.appendChild(o)}o.style.display='flex';CH.open=1;
 const rightA=i=>DC[i][1],rightB=i=>DC[i][2];
 const chip=(i,ax,k,l)=>{const on=sel[i][ax]===k,lock=ok[i][ax];return '<button type=button class="chip'+(on?' on':'')+(lock?' lock':'')+'" data-i='+i+' data-ax='+ax+' data-k='+k+' aria-pressed='+on+(lock||phase=='done'?' disabled':'')+'>'+esc(l)+'</button>'};
 const card=i=>{const done=ok[i].a&&ok[i].b;return '<section class="stc'+(done?' ok':'')+'"><h4>Thẻ '+(i+1)+'/5</h4><p>'+esc(DC[i][0])+'</p><div class=row><b>A · Loại nguồn / xuất xứ</b><div class=chips>'+TYPES.map(([k,l])=>chip(i,'a',k,l)).join('')+'</div>'+(hint[i].a?'<p class=hint>An: “Nguồn này nói chính xác điều gì? Xuất xứ thẻ ghi: '+esc(DC[i][3])+'.”</p>':'')+'</div><div class=row><b>B · Trạng thái kiểm chứng</b><div class=chips>'+STAT.map(([k,l])=>chip(i,'b',k,l)).join('')+'</div>'+(hint[i].b?'<p class=hint>An: “Mình đã kiểm tra nguồn này đến mức nào? Mình còn thiếu nguồn nào?”</p>':'')+'</div>'+(phase=='done'?'<p class=why><b>Vì sao:</b> '+esc(DC[i][4])+' '+esc(DC[i][5])+'</p>':'')+(done?'<div class=stamp>'+esc(lab(STAT,rightB(i)))+'</div>':'')+'</section>'};
 const auto=i=>'<section class="stc auto"><h4>Thẻ '+(i+1)+'/5 · Khoa đã đóng dấu sẵn</h4><p>'+esc(DC[i][0])+'</p><p class=why>A: '+esc(lab(TYPES,DC[i][1]))+' · B: '+esc(lab(STAT,DC[i][2]))+'</p></section>';
 const can=()=>phase=='done'||IDX.every(i=>(ok[i].a||sel[i].a)&&(ok[i].b||sel[i].b));
 function draw(){o.innerHTML='<div class="box" id=stpc><h3>🗂 Bàn đóng dấu hồ sơ nguồn</h3><p id=stf>'+esc(msg)+'</p><div class=stg>'+IDX.map(card).join('')+AUTO.map(auto).join('')+'</div><div class=sta><button class=bt id=stgo'+(can()?'':' disabled')+'>'+(phase=='done'?'Hoàn tất ▸':'Đóng dấu ▸')+'</button></div></div>';
  o.querySelectorAll('.chip').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;sel[i][b.dataset.ax]=b.dataset.k;hint[i][b.dataset.ax]=0;draw()});
  o.querySelector('#stgo').onclick=go}
 function go(){if(!can())return;
  if(phase=='done'){if(closed)return;closed=1;o.style.display='none';CH.open=0;DC.forEach(([t,ty,sk,src])=>sk=='ident'?rec('known',t,src,'đã nhận diện nguồn (chưa có nguồn độc lập thứ hai)'):rec('open',t+' [loại: '+lab(TYPES,ty)+' · '+lab(STAT,sk)+']',src,lab(STAT,sk)));return next()}
  let bad=0;IDX.forEach(i=>['a','b'].forEach(ax=>{if(ok[i][ax])return;const r=ax=='a'?rightA(i):rightB(i);if(sel[i][ax]===r)ok[i][ax]=1;else if(tries>=1){sel[i][ax]=r;ok[i][ax]=1}else{bad++;hint[i][ax]=1;sel[i][ax]=null}}));
  tries++;if(bad){msg='Khoa: Có chỗ chưa khớp – đọc dòng gợi ý của An dưới thẻ rồi chọn lại. Không mất gì cả.'}else{phase='done';msg=tries>1?'Khoa: Lần này tớ điền nốt giúp chỗ còn lại, và ghi lý do dưới mỗi thẻ. Đọc rồi bấm Hoàn tất.':'Khớp cả. Dưới mỗi thẻ có lý do – đọc nhanh rồi bấm Hoàn tất.'}draw()}
 draw()};

/* ---------- G6: thẻ triển lãm – cái giá nhìn thấy được ---------- */
CH.card=next=>{
 const a=A(),fr=FR[a.frag||'none'],frT=a.frag&&a.frag!='none'&&a.frag!='rush'?'<p><b>Lời kể (hư cấu):</b> '+esc(fr.s)+'.</p>':'';
 const boat='<svg class=boat viewBox="0 0 64 28" aria-hidden="true"><path d="M2 18h60l-8 8H12z" fill="#7a4b24"/><path d="M30 17V3l14 14z" fill="#f6e7bd" stroke="#3b2412" stroke-width="2"/><path d="M0 26q8-4 16 0t16 0 16 0 16 0" fill="none" stroke="#4a92b8" stroke-width="3"/></svg>';
 const src='<p>Theo Cổng Du lịch Đồng Tháp: cụ Nguyễn Sinh Sắc sinh sống và hoạt động tại Hòa An.</p>';
 const A1='<article class="xcard h"><small>BẢN A</small><h4>Hòa An · 1927–1929</h4>'+src+'<p class=tag>đã nhận diện nguồn · chưa có nguồn độc lập thứ hai</p>'+frT+'<div class=gap>？ Người lái đò: một người hay nhiều người – chưa xác định</div><div class=gap>？ Vị trí bến: chỉ vùng ước chừng</div></article>';
 const B1='<article class="xcard v"><small>BẢN B</small>'+boat+'<h4>NGƯỜI LÁI ĐÒ CỦA HÒA AN</h4><p class=big>Một người lái đò đã đưa người qua sông, năm này qua năm khác.</p><p class="tag hyp">giả thuyết</p>'+src+frT+'<div class=gap>？ Vị trí bến: chỉ vùng ước chừng</div></article>';
 let o=$('xc');if(!o){o=el('div','xc');o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Chọn thẻ triển lãm');document.body.appendChild(o)}o.style.display='flex';CH.open=1;
 o.innerHTML='<div class=box id=xcc><h3>🖼 Thẻ triển lãm – chọn bản treo lên tường</h3><p>Chỉ treo được một bản. Cả hai đều không “sai điểm”; chúng chỉ kể khác nhau, và có cái giá khác nhau.</p><div class=xg><div>'+A1+'<button class=bt data-v=0>Treo bản A – giữ dấu hỏi</button></div><div>'+B1+'<button class=bt data-v=1>Treo bản B – điền tạm, gắn nhãn “giả thuyết”</button></div></div></div>';
 let chosen=0;o.querySelectorAll('button[data-v]').forEach(b=>b.onclick=()=>{if(chosen)return;chosen=1;const v=+b.dataset.v;o.style.display='none';CH.open=0;a.card=v?'vivid':'honest';a.name=v;
  const L=v?(K.open.push('[giả thuyết – điền tạm] “Người lái đò” là một cá nhân → cần gỡ khi có nguồn.'),[['Khoa','Chuẩn. Giờ thẻ có tiêu đề để người ta dừng lại xem.'],EM('I disagree. If we keep it, label it “hypothesis” — don’t let it repeat until it sounds like a fact.','Tớ không đồng ý. Nếu giữ thì dán nhãn “giả thuyết”, đừng để nó lặp lại cho đến khi nghe như sự thật.',{c:'Hypothesis: not yet a fact.'}),['An','Mình gắn nhãn giả thuyết và sẽ quay lại gỡ khi có nguồn.']]):(K.open.push('“Người lái đò”: một người hay nhiều người? – giữ nguyên dấu hỏi.'),[['Khoa','Được. Thẻ nhìn trống hơn thật. Tớ thêm lớp “chưa xác minh” thay vì ghim cứng.'],EM('Thank you. Where we’re not sure, we leave the space.','Cảm ơn. Chỗ nào chưa chắc, mình để chỗ trống.'),['An','Dấu hỏi cũng là một phần của kết quả.']]);
  seq(L,()=>{busy=true;next()})})};

/* ---------- Màn kết: nhắc lại hành trình của riêng người chơi ---------- */
if(typeof window.fin=='function'){const f0=window.fin;window.fin=function(){f0.apply(this,arguments);try{const a=A(),h=a.hyp?HY[a.hyp].s+' → '+HS[a.hs||'open'][1]:'(chưa đặt)',fg=a.frag&&FR[a.frag]&&a.frag!='none'?FR[a.frag].s:'(không hỏi thêm)',cd=a.card=='vivid'?'Bản B – tiêu đề hấp dẫn, có nhãn “giả thuyết”':a.card=='honest'?'Bản A – giữ dấu hỏi':'(chưa chọn)',nx2=a.card=='vivid'?'Chương 2 sẽ hỏi lại: nhãn “giả thuyết” trên thẻ của bạn dựa vào đâu?':'Chương 2 sẽ hỏi lại: vì sao thẻ của bạn còn chỗ trống – và bạn trả lời bằng nguồn nào?';
 $('endc').querySelector('h3').insertAdjacentHTML('afterend','<div class=mine><b>Hành trình của riêng bạn</b><ul><li>Giả thuyết #1: '+esc(h)+'</li><li>Câu bạn chọn hỏi bác Tư: '+esc(fg)+'</li><li>Thẻ bạn treo: '+esc(cd)+'</li>'+(a.ink?'<li>Còn bỏ ngỏ: ai đã đánh dấu mực trên bản đồ số?</li>':'')+'</ul><small>'+esc(nx2)+'</small></div>')}catch(e){console.error('[ch1plus]',e)}}}

/* ---------- chặn phím tắt khi đang mở bàn đóng dấu / thẻ triển lãm ---------- */
addEventListener('keydown',e=>{if(CH.open&&'nmcj e'.includes(e.key.toLowerCase())&&e.key.length==1&&e.key!=' ')e.stopImmediatePropagation()},true);
})();
