/* Chương 1 – Làng Hòa An tái hiện: BẢN ĐỒ ÂM THANH + nút động từ + ba trạng thái vật thể (Story Bible v16 §5.5 mục 4, §5.2 bảng điểm chạm, §6 quy tắc phản hồi).
   Chèn thêm MỘT bước vào STEPS ngay trước bước bác Tư (không sửa quests.js). Nghệ thuật: assets/art/hoaan.px.js (pxl) → js/data/hoaanart.js.
   Nguyên tắc: chỉ QUAN SÁT/NGHE mô hình – không vận hành dụng cụ; âm thanh do game tổng hợp nên luôn gắn nhãn ÂM THANH MINH HỌA và không chứng minh sự kiện lịch sử;
   không có phạt, không có giới hạn thời gian; có “Chưa đủ thông tin”; mọi âm thanh có phụ đề + hình nhịp (không chỉ dùng màu). */
(()=>{
const TT=T,IMG=k=>HAART[k],VERBS={'Quan sát':'ic_quan_sat','Nghe':'ic_nghe','Đối chiếu':'ic_doi_chieu','Hỏi':'ic_hoi','Ghi chú':'ic_ghi_chu'};
const ST=['Chưa xem','Đã quan sát','Đã đối chiếu'];
/* ---------- dữ liệu ---------- */
const CL=[
 {id:'xay',n:'Cụm xay lúa – giã gạo',x:306,y:232,spr:'ha_xay_gia',h:122,w:206,snd:['gia','xay']},
 {id:'xat',n:'Cụm xắt thuốc lá',x:316,y:241,spr:'ha_xat_thuoc',h:122,w:170,snd:['xat']},
 {id:'ren',n:'Cụm nghề rèn',x:304,y:256,spr:'ha_ren',h:146,w:178,snd:['ren']},
 {id:'don',n:'Điểm nghe đờn ca tài tử (tùy chọn)',x:293,y:230,spr:'ha_don_ca',h:102,w:154,snd:['don'],opt:1}];
const TB={x:317,y:251,spr:'ha_ban_khoa'},SCL=1;   /* sprite vẽ ở độ phân giải gốc, đặt 1:1 */
const SD={
 gia:{n:'Tiếng chày thụp đều',cap:'[trầm, thụp… thụp…, đều và chậm]',en:'A slow, heavy thump, again and again.',wv:'wv_gia',cl:'xay',dur:3.1},
 xay:{n:'Tiếng cối quay',cap:'[sột soạt kéo dài, quay đều như đá chà lên đá]',en:'A long, rough grinding sound that keeps turning.',wv:'wv_xay',cl:'xay',dur:3.3},
 xat:{n:'Tiếng dao xắt',cap:'[lách tách nhanh, từng nhịp ngắn rồi nghỉ]',en:'Quick, short chops, then a pause.',wv:'wv_xat',cl:'xat',dur:3.4},
 ren:{n:'Tiếng búa gõ kim loại',cap:'[keng vang rồi tắt dần]',en:'A ringing metal strike that fades away.',wv:'wv_ren',cl:'ren',dur:3.3},
 don:{n:'Đờn ca tài tử (đoạn ngắn tổng hợp)',cap:'[tiếng dây gảy, giai điệu nhẹ, chậm]',en:'Plucked strings, a soft and slow tune.',wv:'wv_don',cl:'don',dur:3.4,opt:1}};
const C=()=>(st.c.ha||(st.c.ha={obs:{},heard:{},match:{},wr:{},saved:0,sawMill:0,asked:0}));
const cl=id=>CL.find(c=>c.id==id);
const req=()=>CL.filter(c=>!c.opt);
const done=c=>C().obs[c.id]&&C().heard[c.id];
const ready=()=>req().every(done);
const cst=c=>{const a=C();return c.snd.every(x=>a.match[x]===c.id)&&(a.obs[c.id]||c.opt)?2:(a.obs[c.id]||(c.opt&&a.heard[c.id])?1:0)};
/* ---------- âm thanh tổng hợp (WebAudio) ---------- */
let ac,nb,mg,playing=0;
const AC=()=>{if(!ac){try{ac=new(window.AudioContext||window.webkitAudioContext)();mg=ac.createGain();mg.gain.value=.85;mg.connect(ac.destination);nb=ac.createBuffer(1,ac.sampleRate*2,ac.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){ac=null}}if(ac&&ac.state=='suspended')ac.resume();return ac};
const nz=(t,dur,ty,f,q,g,lfo)=>{const s=ac.createBufferSource(),fl=ac.createBiquadFilter(),G=ac.createGain();s.buffer=nb;s.loop=dur>1.8;fl.type=ty;fl.frequency.value=f;fl.Q.value=q;
 if(lfo){G.gain.setValueAtTime(g,t);const o=ac.createOscillator(),d=ac.createGain();o.frequency.value=lfo;d.gain.value=g*.8;o.connect(d);d.connect(G.gain);o.start(t);o.stop(t+dur+.1);G.gain.setValueAtTime(g,t);G.gain.setTargetAtTime(0,t+dur-.25,.12)}
 else{G.gain.setValueAtTime(.0001,t);G.gain.linearRampToValueAtTime(g,t+.008);G.gain.exponentialRampToValueAtTime(.0005,t+dur)}
 s.connect(fl);fl.connect(G);G.connect(mg);s.start(t,Math.random());s.stop(t+dur+.1)};
const tn=(t,f0,f1,g,dur,ty)=>{const o=ac.createOscillator(),G=ac.createGain();o.type=ty||'sine';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,f1),t+dur);G.gain.setValueAtTime(.0001,t);G.gain.linearRampToValueAtTime(g,t+.006);G.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(G);G.connect(mg);o.start(t);o.stop(t+dur+.05)};
const SYN={
 gia:t=>{for(let i=0;i<4;i++){const u=t+i*.78;tn(u,115,42,.55,.28);nz(u,.14,'lowpass',420,.7,.45);tn(u+.34,230,150,.12,.1,'triangle')}},
 xay:t=>{nz(t,3.2,'bandpass',430,1.1,.22,2.3);for(let i=0;i<3;i++)tn(t+.3+i*1.05,170,190,.04,.5,'sawtooth')},
 xat:t=>{for(let g=0;g<3;g++){const b=t+g*1.15;for(let k=0;k<4;k++){nz(b+k*.11,.055,'highpass',3000,.8,.34);tn(b+k*.11+.01,820,620,.05,.04,'square')}tn(b+.55,150,95,.25,.12)}},
 ren:t=>{for(let i=0;i<4;i++){const u=t+i*.82,f=i%2?1.18:1;[1180,1770,2790].forEach((h,j)=>tn(u,h*f,h*f*.995,[.2,.11,.06][j],.75-j*.15,'triangle'));tn(u,95,60,.3,.1);nz(u+.42,.3,'lowpass',500,.6,.07)}},
 don:t=>{const N=[293.7,392,440,523.3,440,392,349.2,293.7,392,293.7],D=[.32,.32,.32,.5,.32,.32,.32,.5,.4,.8];let u=t;N.forEach((f,i)=>{tn(u,f,f*.999,.2,.9,'triangle');tn(u,f*2,f*2,.06,.5,'sine');u+=D[i]})}};
let capT=null;
function cap(txt,dur){let e=document.getElementById('hacap');if(!e){e=document.createElement('div');e.id='hacap';e.className='box';e.setAttribute('role','status');e.setAttribute('aria-live','polite');document.body.appendChild(e)}
 e.innerHTML='<b class=lb>ÂM THANH MINH HỌA</b> '+txt;e.style.display='block';clearTimeout(capT);capT=setTimeout(()=>{e.style.display='none'},dur*1000+1500)}
function hear(ids,cb){if(!AC()){cap('(Trình duyệt không bật được âm thanh – xem phụ đề: '+ids.map(i=>SD[i].cap).join(' ')+')',3);cb&&setTimeout(cb,600);return}
 let t=ac.currentTime+.08,lag=0;ids.forEach(i=>{const d=SD[i];SYN[i](t);const when=lag;setTimeout(()=>cap('<b>'+d.n+'</b> '+d.cap+' <i>'+d.en+'</i>',d.dur),when*1000);t+=d.dur+.25;lag+=d.dur+.25});
 playing=1;setTimeout(()=>{playing=0;cb&&cb()},lag*1000)}
/* ---------- thế giới: sprite, biểu tượng gần, huy hiệu trạng thái ---------- */
let sc,HS=[],idx=-1,SMS;
const nextVerb=c=>{const a=C();if(c.opt)return a.heard[c.id]?(a.saved?null:'Ghi chú'):'Nghe';if(!a.obs[c.id])return'Quan sát';if(!a.heard[c.id])return'Nghe';return null};
const stepOn=()=>idx>=0&&st.step>=idx&&!ended;
const nearH=()=>{if(!sc||!stepOn())return null;let b=null,bd=110;CL.forEach(c=>{const d=Math.hypot(sc.pl.x-c.x*TT,sc.pl.y-c.y*TT);if(d<bd){bd=d;b=c}});return b};
const nearTB=()=>sc&&Math.hypot(sc.pl.x-TB.x*TT,sc.pl.y-TB.y*TT)<70;
function build(){const keys=Object.keys(HAART),pend=keys.length;let n=0;const go=()=>{if(++n<pend)return;
  keys.forEach(k=>{if(!sc.textures.exists(k)){sc.textures.addImage(k,IM2[k]);sc.textures.get(k).setFilter(Phaser.Textures.FilterMode.NEAREST)}});
  CL.forEach(c=>{c.im=sc.add.image(c.x*TT,c.y*TT,c.spr).setOrigin(.5,1).setScale(SCL).setDepth(c.y*TT);c.ic=sc.add.image(c.x*TT,c.y*TT-c.h*SCL-10,'ic_nghe').setDepth(9998).setVisible(false);c.bd=sc.add.image(c.x*TT+c.w*SCL/2-14,c.y*TT-c.h*SCL+10,'st_0').setDepth(9997).setVisible(false)});
  /* bảng trạm diễn giải trước mỗi cụm + gà mổ thóc (chỉ để khu làng có sự sống) */
  CL.forEach(c=>sc.add.image(c.x*TT-c.w*SCL/2+26,c.y*TT+18,'ha_bang').setOrigin(.5,1).setDepth(c.y*TT+18));
  const hens=[[CL[0].x*TT+78,CL[0].y*TT+14,0],[CL[0].x*TT+104,CL[0].y*TT+6,1],[CL[1].x*TT-66,CL[1].y*TT+14,1]].map(([x,y,f])=>sc.add.image(x,y,'ha_ga0').setOrigin(.5,1).setDepth(y).setFlipX(!!f));
  sc.time.addEvent({delay:700,loop:true,callback:()=>hens.forEach((h,i)=>h.setTexture(((sc.time.now/700|0)+i)%3?'ha_ga0':'ha_ga1'))});
  TB.im=sc.add.image(TB.x*TT,TB.y*TT,TB.spr).setOrigin(.5,1).setScale(SCL).setDepth(TB.y*TT);TB.ic=sc.add.image(TB.x*TT,TB.y*TT-92,'ic_doi_chieu').setDepth(9998).setVisible(false);
  sc.events.on('update',upd)};
 const IM2={};keys.forEach(k=>{const im=new Image();IM2[k]=im;im.onload=go;im.src=IMG(k)})}
let lastLab='',lastO='';
function upd(t){const on=stepOn(),S=STEPS[st.step],tb=ready()&&stepOn()&&S&&S.sm;
 CL.forEach(c=>{const near=on&&!busy&&!smOpen&&Math.hypot(sc.pl.x-c.x*TT,sc.pl.y-c.y*TT)<170,v=nextVerb(c);
  c.bd.setVisible(on).setTexture('st_'+cst(c));
  if(near&&v){c.ic.setTexture(VERBS[v]).setVisible(true).y=c.y*TT-c.h*SCL-10+Math.sin(t/260)*2}else c.ic.setVisible(false)});
 TB.ic.setVisible(!!tb&&!busy&&!smOpen&&Math.hypot(sc.pl.x-TB.x*TT,sc.pl.y-TB.y*TT)<170).y=TB.y*TT-92+Math.sin(t/260)*2;
 if(S&&S.sm){const o=ready()?'Đến bàn bản đồ của Khoa (cạnh làng) để ghép âm thanh với cụm tái hiện.':'Đi một vòng làng Hòa An: quan sát và nghe ba cụm nghề ('+req().filter(done).length+'/3). Khoa đánh dấu điểm kế tiếp.';
  if(o!==lastO){lastO=o;S.o=o;hud()}
  const nx2=ready()?TB:req().find(c=>!done(c));if(nx2)S.p=[nx2.x,nx2.y]}
 /* nhãn nút Tương tác = động từ của điểm chạm hiện tại */
 let vb=S&&S.vb;if(S&&S.sm){const h=nearH();vb=ready()&&nearTB()?'Đối chiếu':h&&nextVerb(h)||(ready()?'Đối chiếu':'Quan sát')}
 const lab=vb||'Tương tác';if(lab!==lastLab){lastLab=lab;const a=$('act');a.innerHTML=(VERBS[lab]?'<img class=vi alt="" src="'+IMG(VERBS[lab])+'"> ':'')+lab+' [E]'}
 panel()}
/* bảng động từ cạnh nút Tương tác: cho phép chọn động từ khác (Quan sát / Nghe / Ghi chú) khi đứng gần cụm */
let pnl,pk='';
function panel(){if(!pnl){pnl=document.createElement('div');pnl.id='vb';document.body.appendChild(pnl)}
 const h=!busy&&!smOpen&&!nbOpen?nearH():null,a=C(),k=h?h.id+JSON.stringify([a.obs[h.id],a.heard[h.id],a.saved,cst(h)]):'';if(k===pk)return;pk=k;
 if(!h){pnl.style.display='none';return}
 const vs=h.opt?['Nghe','Ghi chú']:['Quan sát','Nghe'];pnl.style.display='flex';
 pnl.innerHTML='<small>'+h.n+' · '+ST[cst(h)]+'</small>';
 vs.forEach(v=>{const b=document.createElement('button');b.className='box';const dn=v=='Quan sát'?a.obs[h.id]:v=='Nghe'?a.heard[h.id]:a.saved;
  b.innerHTML='<img class=vi alt="" src="'+IMG(VERBS[v])+'"> '+v+(dn?' ✓':'');b.disabled=v=='Ghi chú'&&!a.heard[h.id];b.onclick=()=>verb(h,v);pnl.appendChild(b)})}
/* ---------- động từ ---------- */
const OBS={
 xay:()=>[['Trạm diễn giải (khu tái hiện)','Cụm xay lúa – giã gạo: mô hình tái hiện hai công việc quen thuộc với lúa gạo. Chủ đề này được cổng du lịch địa phương giới thiệu; từng dụng cụ cụ thể cần đối chiếu với Ban quản lý. Trò chơi chỉ cho nhìn và nghe, không cho vận hành dụng cụ.'],
  EM('These look like tools for rice. Does the sign say so?','Trông giống dụng cụ làm việc với lúa gạo. Bảng có ghi vậy không?',{s:'Tools for rice. Is it on the sign?',c:'Read the sign, not only the picture.',k:'tools = dụng cụ · rice = lúa gạo'}),
  ['An – ghi vào sổ thế nào?','Bảng chỉ nói đây là cụm tái hiện. Ghi ra sao?',[['“Quan sát trực tiếp mô hình: một cối đá và một cối giã; chưa kết luận niên đại.”',()=>{C().sawMill=1;return[['An','Mình ghi đúng điều nhìn thấy, không thêm gì.']]}],['“Ngày xưa nhà nào trong làng cũng giã gạo, xay lúa như vậy.”',()=>{C().sawMill=1;return[EM('The sign doesn’t say “every house”. Where did that come from?','Bảng không ghi “nhà nào cũng vậy”. Cậu lấy điều đó ở đâu?',{c:'Is it on the sign?'}),['An','…Đúng, đó là mình đoán. Mình ghi lại thành câu hỏi để hỏi người kể.']]}]]]],
 xat:()=>[['Trạm diễn giải (khu tái hiện)','Cụm xắt thuốc lá: mô hình/trạm diễn giải một nghề được giới thiệu trong khu tái hiện. Không hướng dẫn thao tác nghề; ở đây chỉ ghép thẻ mô tả với hình.'],
  ['An – ghép thẻ mô tả với hình','Thẻ ghi: “bàn, khung dao nằm ngang, giàn phơi sợi”. Hình nào trên cụm này khớp?',[['Khung dao nằm ngang trên bàn, giàn phơi bên phải.',()=>[EM('Yes. Blade, table, drying rack. We describe only what we see.','Đúng. Dao, bàn, giàn phơi. Mình chỉ mô tả điều nhìn thấy.')]],['Lò lửa dưới mái lá, một cái đe.',()=>[EM('That is a different cluster. Look at the card again.','Đó là cụm khác. Xem lại thẻ nhé.',{c:'Table, blade, rack.'}),['An','Mình nhìn lại thẻ: bàn và khung dao nằm ngang. Chọn cụm có giàn phơi.']]]]]],
 ren:()=>[['Trạm diễn giải (khu tái hiện)','Cụm nghề rèn: mô hình mái lá, lò, đe và búa – chỉ để quan sát. Không có lò thật, búa thật hay thao tác nào trong trò chơi.'],
  ['An – nhận diện công cụ trên bảng','Trên bảng diễn giải, vật nào là cái đe?',[['Khối kim loại đặt trên gốc cây.',()=>[EM('Right. An anvil: the metal block where things are shaped.','Đúng. Đe là khối kim loại để định hình vật.')]],['Ống thổi gió bên cạnh lò.',()=>[EM('That one is for air. Look for the heavy block.','Cái đó để thổi gió. Tìm khối nặng.',{c:'Heavy metal on a stump.',k:'anvil = cái đe'}),['An','Ống đó để thổi gió. Cái đe là khối kim loại trên gốc cây.']]]]]],
 don:()=>[]};
const KNOWN={xay:'Cụm xay lúa – giã gạo (mô hình tái hiện): quan sát trực tiếp; chi tiết dụng cụ cần đối chiếu với Ban quản lý.',xat:'Cụm xắt thuốc lá (mô hình tái hiện): bàn, khung dao ngang, giàn phơi – quan sát trực tiếp.',ren:'Cụm nghề rèn (mô hình tái hiện): mái lá, lò, đe, búa – chỉ quan sát, không thao tác.'};
function verb(c,v){if(busy||smOpen||nbOpen)return;const a=C();
 if(v=='Quan sát'&&!c.opt){const items=OBS[c.id]();const first=!a.obs[c.id];seq(first?items:items.slice(0,1),()=>{if(first){a.obs[c.id]=1;rec('known',KNOWN[c.id],'trạm diễn giải tại khu tái hiện (cổng du lịch địa phương xác nhận chủ đề)','quan sát trực tiếp; đạo cụ chưa được xác minh');vocab(...({xay:['mill|cối xay','rice|lúa, gạo'],xat:['blade|lưỡi dao','drying rack|giàn phơi'],ren:['anvil|cái đe','forge|lò rèn']})[c.id]);check()}pk='';upd(performance.now())})}
 else if(v=='Nghe'){const first=!a.heard[c.id];hear(c.snd,()=>{});if(first){a.heard[c.id]=1;c.snd.forEach(s=>rec('known','Âm thanh minh họa: '+SD[s].n+' '+SD[s].cap,'ÂM THANH MINH HỌA do trò chơi tổng hợp','minh họa – không phải bản ghi thực địa, không chứng minh sự kiện'));toast('Đã nghe: '+c.n.replace(' (tùy chọn)',''));check();pk=''}}
 else if(v=='Ghi chú'&&c.opt&&a.heard[c.id]&&!a.saved){a.saved=1;rec('known','Đờn ca tài tử: đoạn nhạc ngắn tổng hợp, lưu vào bản đồ âm thanh (tùy chọn).','ÂM THANH MINH HỌA do trò chơi tổng hợp','minh họa – tạo không khí');toast('Đã lưu vào bản đồ âm thanh');pk=''}}
function check(){if(ready()&&!C().rdy){C().rdy=1;const S=STEPS[idx];setTimeout(()=>seq([['Khoa','Đủ ba cụm rồi. Tớ dựng bản đồ âm thanh trên máy tính bảng; bàn của tớ ở cạnh làng. Qua đó mình ghép âm với từng cụm.']]),500)}}
/* ---------- bàn ghép âm thanh ---------- */
let smOpen=false,sel=null,fb='';
function board(){if(smOpen)return;smOpen=true;busy=true;let o=document.getElementById('sm');if(!o){o=document.createElement('div');o.id='sm';o.setAttribute('role','dialog');o.setAttribute('aria-modal','true');o.setAttribute('aria-label','Bản đồ âm thanh làng Hòa An');document.body.appendChild(o)}o.style.display='flex';sel=null;fb='Chạm một âm thanh rồi chạm cụm bạn nghĩ nó thuộc về (hoặc kéo-thả). Chưa chắc thì chọn “Chưa đủ thông tin” – không trừ điểm.';draw()}
function close(){smOpen=false;busy=false;const o=document.getElementById('sm');if(o)o.style.display='none';pk=''}
const sounds=()=>Object.keys(SD).filter(s=>{const c=cl(SD[s].cl);return C().heard[c.id]&&(!SD[s].opt||C().saved)});
const resolved=s=>C().match[s]!==undefined;
function draw(){const a=C(),o=document.getElementById('sm'),ss=sounds(),all=ss.every(resolved);
 o.innerHTML='<div class=box id=smc><h3>🗺 Bản đồ âm thanh · làng Hòa An</h3><p class=lb2>ÂM THANH MINH HỌA – do trò chơi tổng hợp; không phải bản ghi thực địa và không chứng minh một sự kiện lịch sử.</p>'+
 '<div class=smg><div><b>Âm thanh đã nghe</b>'+ss.map(s=>{const d=SD[s],m=a.match[s],on=sel==s;return'<div class="sc'+(on?' on':'')+(m?' ok':'')+'" draggable=true data-s='+s+'><img class=wv alt="Hình nhịp" src="'+IMG(d.wv)+'"><div><b>'+(on?'▶ ':'')+d.n+'</b><small>'+d.cap+'</small><small class=en>Emma: '+d.en+'</small><span class=bs><button data-a=play data-s='+s+'><img class=vi alt="" src="'+IMG('ic_nghe')+'"> Nghe lại</button> <button data-a=pick data-s='+s+'>'+(on?'Đã chọn':'Chọn')+'</button> <button data-a=unk data-s='+s+'>Chưa đủ thông tin</button></span><em>'+(m===undefined?'chưa ghép':m=='?'?'Chưa đủ thông tin':'Đã ghép: '+cl(m).n.replace(' (tùy chọn)',''))+'</em></div></div>'}).join('')+'</div>'+
 '<div><b>Cụm tái hiện trên bản đồ của Khoa</b>'+CL.filter(c=>(c.opt?a.saved:a.obs[c.id])).map(c=>{const hl=(a.wr[sel]||0)>=2&&sel&&SD[sel].cl==c.id;return'<div class="tg2'+(hl?' hint':'')+'" data-c='+c.id+'><img class=th alt="" src="'+IMG(c.spr)+'"><div><b>'+(hl?'⬚ ':'')+c.n.replace(' (tùy chọn)','')+'</b><small>'+ST[cst(c)]+' <img class=si alt="" src="'+IMG('st_'+cst(c))+'"></small><small>'+c.snd.filter(s=>a.match[s]===c.id).map(s=>'✓ '+SD[s].n).join(' · ')+'</small></div></div>'}).join('')+'</div></div>'+
 '<p id=smf aria-live=polite>'+fb+'</p><button class=bt data-a=fin '+(all&&ss.length?'':'disabled')+'>'+(all?'Hoàn thành bản đồ âm thanh':'Ghép (hoặc đánh dấu chưa đủ thông tin) cho mọi âm thanh')+'</button> <button class=bt data-a=later>Để sau</button></div>';
 o.querySelectorAll('[data-a]').forEach(b=>b.onclick=e=>{e.stopPropagation();act2(b.dataset.a,b.dataset.s)});
 o.querySelectorAll('.sc').forEach(e=>{e.onclick=()=>{sel=e.dataset.s;fb='Đã chọn: '+SD[sel].n+'. Chạm cụm bên phải.';draw()};e.ondragstart=ev=>{sel=e.dataset.s;ev.dataTransfer.setData('text/plain',sel)}});
 o.querySelectorAll('.tg2').forEach(e=>{e.onclick=()=>drop(e.dataset.c);e.ondragover=ev=>ev.preventDefault();e.ondrop=ev=>{ev.preventDefault();sel=ev.dataTransfer.getData('text/plain')||sel;drop(e.dataset.c)}})}
function act2(k,s){const a=C();if(k=='play')hear([s]);else if(k=='pick'){sel=s;fb='Đã chọn: '+SD[s].n+'. Chạm cụm bên phải.';draw()}
 else if(k=='unk'){a.match[s]='?';sel=null;fb='Ghi nhận: “'+SD[s].n+'” – chưa đủ thông tin để gắn vào cụm nào. Đó cũng là một kết quả.';draw()}
 else if(k=='later')close();else if(k=='fin')finish()}
function drop(cid){const a=C();if(!sel){fb='Chọn một âm thanh trước.';draw();return}const s=sel,ok=SD[s].cl==cid;
 if(ok){a.match[s]=cid;sel=null;fb='✓ Khớp: '+SD[s].n+' ↔ '+cl(cid).n.replace(' (tùy chọn)','')+'. Khoa thêm lớp “âm thanh lao động” – vùng tham chiếu, không phải một điểm chính xác.'}
 else{a.wr[s]=(a.wr[s]||0)+1;fb=a.wr[s]<2?'Khoa: Tớ làm nổi hình nhịp của âm này. Nghe lại rồi so với dụng cụ ở từng cụm.':'Khoa: Tớ khoanh nét đứt quanh cụm có dụng cụ hợp với nhịp này. Vẫn là cậu quyết định.'}
 draw()}
function finish(){const a=C();close();const un=sounds().filter(s=>a.match[s]==='?');
 seq([['Khoa','Xong. Mỗi âm là một lớp trên bản đồ; vùng ghim chỉ là vị trí tham chiếu, tớ không chấm chính xác từng dụng cụ.'],
  EM('Sounds can show us what kind of place this is. They can’t prove what happened here on one particular day.','Âm thanh cho ta biết đây là nơi thế nào. Chúng không chứng minh điều xảy ra vào một ngày cụ thể.',{s:'Sounds show a place. They do not prove a day.',c:'Think: place, or proof?',k:'prove = chứng minh'}),
  ['An','Một ngôi làng có nhiều nhịp việc khác nhau. Mình ghi như vậy – không kết luận gì về năm tháng.']],
 ()=>{CL.forEach(c=>{if(cst(c)==2)toast('Đã đối chiếu: '+c.n.replace(' (tùy chọn)',''))});
  rec('known','Bản đồ âm thanh làng Hòa An: '+sounds().filter(s=>a.match[s]&&a.match[s]!='?').length+' âm đã ghép với cụm tái hiện (vùng tham chiếu).','nhóm biên soạn · ÂM THANH MINH HỌA','minh họa – nhận diện không gian, không chứng minh sự kiện');
  un.forEach(s=>K.open.push('Âm “'+SD[s].n+'”: chưa đủ thông tin để gắn vào cụm nào.'));
  a.sawMill&&K.open.push('Ngày trước nhà nào cũng làm việc xay lúa, giã gạo hay chỉ một số nhà? – hỏi bác Tư (đừng ghi “nhà nào cũng”).');
  vocab('sound map|bản đồ âm thanh','rhythm|nhịp','prove|chứng minh');a.done=1;nx()})}
/* ---------- sổ tay: Điểm chạm và ba trạng thái ---------- */
const OB0=[['Bảng hướng dẫn · Cổng số 1','Quan sát',0],['Ao sen','Nghe',2],['Bảng dòng thời gian · Nhà trưng bày','Đối chiếu',3],['Nhà sàn mô phỏng','Quan sát',4]];
const OB1=[['Bác Tư (nhân vật hư cấu)','Hỏi','bt'],['Hồ sơ nguồn hai trục · Bến sổ','Ghi chú','bs'],['Cổng số 2 · bản ghi mờ','Nghe','c2']];
window.HA={nbHtml(){const row=(n,v,s,x)=>'<li><img class=si alt="" src="'+IMG('st_'+s)+'"> <b>'+n+'</b> <span class=tg>'+v+'</span> <small>'+ST[s]+(x||'')+'</small></li>';
 let h='<b>Điểm chạm</b> <small>(mỗi vật có một động từ; trạng thái dùng cả biểu tượng lẫn chữ)</small><ul class=obj>';
 OB0.forEach(([n,v,i])=>{h+=row(n,v,st.step>i?(v=='Đối chiếu'?2:1):0)});
 CL.forEach(c=>{h+=row(c.n.replace(' (tùy chọn)',' · tùy chọn'),'Quan sát · Nghe',cst(c))});
 const a=C();h+=row('Bàn bản đồ của Khoa · bản đồ âm thanh','Đối chiếu',a.done?2:0);
 OB1.forEach(([n,v],j)=>{const i=idx>=0?idx+1+j:99;h+=row(n,v,st.step>i?(v=='Ghi chú'?2:1):0)});
 return h+'</ul><small>Khu mộ cụ là nơi tưởng niệm: không có điểm chạm nào ở đó.</small>'}};
/* ---------- gắn vào game ---------- */
const i0=STEPS.findIndex(s=>/bác Tư/i.test(s.o));
if(i0>0){[[0,'Quan sát'],[2,'Nghe'],[3,'Đối chiếu'],[4,'Quan sát']].forEach(([i,v])=>STEPS[i].vb=v);
 const S={p:[CL[0].x,CL[0].y],o:'Đi một vòng làng Hòa An: quan sát và nghe ba cụm nghề (0/3).',sm:1,vb:'Quan sát',run:()=>{const h=nearH();if(ready()&&nearTB())return board();if(h){const v=nextVerb(h);if(v)return verb(h,v)}toast(ready()?'Khoa: Bàn bản đồ của tớ ở cạnh làng – lại đó nhé.':'Mỗi cụm có hai việc: Quan sát và Nghe.')}};
 const B=STEPS[i0];B.vb='Hỏi';STEPS.splice(i0,0,S);idx=i0;
 if(STEPS[idx+2])STEPS[idx+2].vb='Ghi chú';if(STEPS[idx+3])STEPS[idx+3].vb='Nghe';
 const orig=B.run;B.run=()=>{const a=C();if(a.sawMill&&!a.asked){a.asked=1;return seq([['An','Bác ơi, ngày trước nhà nào cũng xay lúa, giã gạo như vậy, hay chỉ một số nhà ạ?'],['Bác Tư','Nhà nào có lúa thì làm. Mà nhà nào làm, nhà nào mướn, bác nhớ không hết. Con đừng ghi “nhà nào cũng”.'],['An','Dạ. Con ghi: bác không chắc.']],()=>{K.told.push('Bác Tư (lời kể, hư cấu): chuyện xay lúa, giã gạo – bác không nhớ hết nhà nào làm, nhà nào mướn.');orig()})}return orig()}}
document.addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(smOpen&&k=='escape')return close();
 if((k=='e'||k=='enter'||k==' ')&&!near&&!adv&&!busy&&!nbOpen&&!smOpen&&stepOn()){const S0=STEPS[st.step];if(S0&&S0.sm&&ready()&&nearTB())return board();const h=nearH();if(h){const v=nextVerb(h);if(v)verb(h,v)}}});
PSK.on('ready',s=>{sc=s;if(i0>0)build();[0,1,2,3].forEach(()=>0)});
})();
