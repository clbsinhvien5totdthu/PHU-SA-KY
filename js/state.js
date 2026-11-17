/* Trạng thái, toast, hộp thoại seq() */
const V=[],K={known:[],told:[],open:[]},st={step:0,tr:0,tp:0,boat:0,c:{sup:1}};
/* Emma nói tiếng Anh (Story Bible v16 §6.7). Ba chế độ hỗ trợ (st.c.sup): 0 Nhiều (câu ngắn hơn + phụ đề song ngữ) · 1 Vừa (mặc định) · 2 Ít.
   en = câu đầy đủ · vi = nghĩa (chỉ hiện ở chế độ Nhiều) · lad = {s: diễn đạt đơn giản, c: gợi ngữ cảnh, k: gloss từ khóa}. Nút “Emma, nói lại?” luôn có, không bao giờ trừ điểm:
   bậc 1 nói lại chậm · 2 diễn đạt đơn giản · 3 gợi ngữ cảnh (chỉ hướng, không nói đáp án) · 4 giao việc + gloss từ khóa. Mọi chế độ đều giữ nguyên thông tin cốt truyện và bằng chứng. */
const EM=(en,vi,lad={},ch)=>{const m=st.c.sup;return['Emma',(m===0&&lad.s?lad.s:en)+(m===0?' ['+vi+']':''),ch||null,lad.h||null,{en,...lad}]};
const KM={},rec=(k,t,s,c)=>{K[k].push(t);KM[t]={src:s,cf:c}};
let busy=false,adv=null,ended=false,near=false,qt=0,nbOpen=false;
const toast=m=>{window.SFX&&SFX.chime();const t=$('toast');t.textContent=m;t.style.opacity=1;clearTimeout(t.h);t.h=setTimeout(()=>t.style.opacity=0,3200)};
const vocab=(...a)=>a.forEach(w=>{if(!V.includes(w)){V.push(w);toast('Từ mới: '+w.replace('|',' = '))}});
/* Hộp thoại: chữ hiện dần theo nhịp đọc (~24 ký tự/giây, nghỉ nhẹ ở dấu câu); bấm/E/Enter một lần để hiện hết dòng, lần nữa để sang dòng sau.
   Phần chữ chưa hiện vẫn chiếm chỗ (ẩn) nên hộp thoại không nhảy dòng khi gõ. */
const TYPE={cps:24,gap:{'.':280,'?':320,'!':320,'…':360,',':150,';':180,':':180,'—':180,'”':200}};
let typeT=null,typeEnd=null;
function typeLine(el,text,onEnd,sp){clearTimeout(typeT);const ch=[...text],a=document.createElement('span'),b=document.createElement('span');b.style.visibility='hidden';el.textContent='';el.append(a,b);let n=0;
 const fin=()=>{clearTimeout(typeT);typeT=null;typeEnd=null;a.textContent=text;b.textContent='';onEnd&&onEnd()};typeEnd=fin;
 const tick=()=>{if(n>=ch.length)return fin();const c=ch[n++];a.textContent=ch.slice(0,n).join('');if(c.trim()&&n%2===0&&window.SFX&&SFX.type)SFX.type(sp);b.textContent=ch.slice(n).join('');
  const nx=ch[n];typeT=setTimeout(tick,1000/TYPE.cps+((!nx||nx===' ')&&TYPE.gap[c]||0))};tick()}
function seq(items,done){busy=true;$('dlg').style.display='block';let i=0;const step=()=>{window.SFX&&SFX.blip();if(i>=items.length){clearTimeout(typeT);typeEnd=null;$('dlg').style.display='none';busy=false;adv=null;done&&done();return}
 const it0=items[i++];if(typeof it0=='function'){clearTimeout(typeT);$('dlg').style.display='none';adv=null;it0(()=>{$('dlg').style.display='block';step()});return}
 const[sp,tx,ch,hint,lad]=it0;window.onSeqLine&&onSeqLine(sp,tx,hint);$('who').textContent=sp;portrait(sp);const c=$('ch');c.innerHTML='';$('more').style.display='none';adv=()=>typeEnd&&typeEnd();
 const help=()=>{if(!lad)return;const b=document.createElement('button');b.className='emh';let lv=0;b.textContent='💬 Emma, nói lại?';b.onpointerdown=e=>e.stopPropagation();
  b.onclick=e=>{e.stopPropagation();lv=Math.min(4,lv+1);const L=[null,lad.en,lad.s||lad.en,lad.c||'Look at the card.','Tell me what you think it means.'+(lad.k?'  ['+lad.k+']':'')];const T=$('txt'),old=TYPE.cps;if(lv==1)TYPE.cps=11;typeLine(T,L[lv],null,'Emma');TYPE.cps=old;b.textContent=lv<4?'💬 Emma, nói lại? ('+lv+'/4)':'💬 (đã gợi ý hết bậc; không trừ điểm)'};c.appendChild(b)};
 typeLine($('txt'),tx,()=>{if(ch){adv=null;ch.forEach(o=>{const b=document.createElement('button');b.textContent=o[0];b.onclick=()=>{const r=o[1]&&o[1]();if(r)items.splice(i,0,...r);step()};c.appendChild(b)});help()}else{help();$('more').style.display='block';adv=step}},sp)};step()}
document.addEventListener('pointerdown',()=>{if(adv)adv()});
