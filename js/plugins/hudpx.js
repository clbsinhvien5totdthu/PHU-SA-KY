/* HUD pixel art + tiếp cận (v18b). Không sửa lõi: đổi emoji -> icon pixel, thêm bảng "Giao diện & tiếp cận" (cỡ chữ, tương phản cao,
   giảm chuyển động, chữ hội thoại hiện ngay, âm thanh vòng làng), vùng đọc cho trình đọc màn hình, bẫy phím khi mở bảng. Lưu cài đặt ở localStorage (có try/catch). */
(()=>{
const LS='psk_hp',mq=q=>{try{return matchMedia(q).matches}catch(e){return false}};
let S={size:0,hc:mq('(prefers-contrast: more)')?1:0,rm:mq('(prefers-reduced-motion: reduce)')?1:0,instant:0};
try{const j=JSON.parse(localStorage.getItem(LS)||'null');if(j&&typeof j=='object')S=Object.assign(S,j)}catch(e){}
const persist=()=>{try{localStorage.setItem(LS,JSON.stringify(S))}catch(e){}};
const ic=n=>'<i class="ic ic-'+n+'" aria-hidden="true"></i>';
function apply(){const b=document.body.classList;b.toggle('hp-l',S.size==1);b.toggle('hp-xl',S.size==2);b.toggle('hp-hc',!!S.hc);b.toggle('hp-rm',!!S.rm);}
apply();

/* ---- emoji -> icon pixel; [X] trong nút -> phím kbd ---- */
const MAP={'📖':'book','👥':'people','🗺':'map','🎵':'note','🔇':'mute','🔊':'speaker','🧭':'compass','⏳':'hourglass','◐':'half','✎':'pencil','🗂':'book','🖼':'map','📍':'pin'};
const RX=/(📖|👥|🗺\uFE0F?|🎵|🔇|🔊|🧭|⏳|◐|✎|🗂\uFE0F?|🖼\uFE0F?|📍|[\u{1F550}-\u{1F567}]|\[\w\])/gu;
const ROOTS=['ui','nb','cp','end','stp','xc','toast','act','hpp'];
function conv(tn){const t=tn.nodeValue;if(!t||!RX.test(t)){RX.lastIndex=0;return}RX.lastIndex=0;
 const inBtn=tn.parentNode&&tn.parentNode.closest&&tn.parentNode.closest('#side button,#act');
 const f=document.createDocumentFragment();let last=0,m,did=0;
 while((m=RX.exec(t))){const s=m[0];let el;
  if(s[0]=='['){if(!inBtn)continue;el=document.createElement('kbd');el.textContent=s[1]}
  else{const k=MAP[s.replace('\uFE0F','')]||(/[\u{1F550}-\u{1F567}]/u.test(s)?'clock':null);if(!k)continue;el=document.createElement('i');el.className='ic ic-'+k;el.setAttribute('aria-hidden','true')}
  if(m.index>last)f.append(t.slice(last,m.index));f.append(el);last=m.index+s.length;did=1}
 RX.lastIndex=0;if(!did)return;if(last<t.length)f.append(t.slice(last));tn.replaceWith(f)}
function walk(root){const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>n.parentNode&&n.parentNode.closest&&n.parentNode.closest('#txt,script,style,canvas')?NodeFilter.FILTER_REJECT:NodeFilter.FILTER_ACCEPT}),L=[];let n;while((n=w.nextNode()))L.push(n);L.forEach(conv)}
function mtr(){const m=document.getElementById('mtr');if(!m||typeof K=='undefined')return;const v=K.known.length+'|'+K.told.length+'|'+K.open.length;
 if(m.dataset.v===v&&m.querySelector('.ic'))return;m.dataset.v=v;
 m.innerHTML='<span>'+ic('search')+'Dấu vết <b>'+K.known.length+'</b></span><span>'+ic('bubble')+'Lời kể <b>'+K.told.length+'</b></span><span>'+ic('bulb')+'An nghĩ <b>'+K.open.length+'</b></span>'}
function labels(){document.querySelectorAll('#side button,#act').forEach(b=>{const t=b.textContent.replace(/\s+/g,' ').trim().replace(/\s*(\w)$/,(s,k)=>b.querySelector('kbd')?', phím '+k:s);if(t&&b.getAttribute('aria-label')!==t)b.setAttribute('aria-label',t)})}
let pend=0;const pass=()=>{pend=0;ROOTS.forEach(id=>{const r=document.getElementById(id);if(r)walk(r)});mtr();labels()};
const sched=()=>{if(!pend){pend=1;requestAnimationFrame(pass)}};
new MutationObserver(ms=>{for(const m of ms){const p=m.target.nodeType==3?m.target.parentNode:m.target;if(p&&p.closest&&p.closest('#txt,#g'))continue;return sched()}}).observe(document.body,{childList:true,subtree:true,characterData:true});
sched();

/* ---- vùng đọc cho trình đọc màn hình ---- */
const sr=document.createElement('div');sr.className='sr';sr.setAttribute('aria-live','polite');sr.setAttribute('role','status');document.body.appendChild(sr);
const aset=(id,k,v)=>{const e=document.getElementById(id);e&&e.setAttribute(k,v)};
aset('hud','role','region');aset('hud','aria-label','Mục tiêu và câu hỏi dẫn dắt');aset('toast','role','status');aset('toast','aria-live','polite');aset('txt','aria-live','off');aset('dlg','role','dialog');aset('dlg','aria-label','Hội thoại');
const t0=window.typeLine;
if(typeof t0=='function')window.typeLine=function(el,text,onEnd,sp){try{const w=document.getElementById('who');sr.textContent=(w&&w.textContent?w.textContent+': ':'')+text}catch(e){}
 if(S.instant&&el&&el.id=='txt'){try{clearTimeout(typeT);typeT=null;typeEnd=null}catch(e){}el.textContent=text;onEnd&&onEnd();return}
 return t0.apply(this,arguments)};

/* ---- bảng Giao diện & tiếp cận ---- */
const side=document.getElementById('side'),hpb=document.createElement('button');hpb.id='hpb';hpb.type='button';hpb.innerHTML=ic('sliders')+'<span class="bl">Giao diện</span>';hpb.setAttribute('aria-label','Giao diện và tiếp cận');hpb.setAttribute('aria-haspopup','dialog');side&&side.appendChild(hpb);
const pn=document.createElement('div');pn.id='hpp';pn.setAttribute('role','dialog');pn.setAttribute('aria-modal','true');pn.setAttribute('aria-labelledby','hpt');document.body.appendChild(pn);
let lastFocus=null,open=false;
const tog=(k,lab)=>'<div class=hp-row><b>'+lab+'</b><button type=button class=hp-t data-k='+k+' aria-pressed='+(!!S[k])+'>'+(S[k]?'Đang bật':'Đang tắt')+'</button></div>';
function draw(){let amb=true;try{amb=st.c.amb!==0}catch(e){}
 pn.innerHTML='<div id=hpc class=box><h3 id=hpt>'+ic('sliders')+' Giao diện &amp; tiếp cận</h3>'+
 '<div class=hp-row><b>Cỡ chữ và HUD</b><div class=hp-g role=group aria-label="Cỡ chữ">'+['Vừa','Lớn','Rất lớn'].map((l,i)=>'<button type=button class=hp-t data-s='+i+' aria-pressed='+(S.size==i)+'>'+l+'</button>').join('')+'</div></div>'+
 tog('hc','Tương phản cao')+tog('rm','Giảm chuyển động')+tog('instant','Chữ hội thoại hiện ngay')+
 '<div class=hp-row><b>Âm thanh vòng làng</b><button type=button class=hp-t data-k=amb aria-pressed='+amb+'>'+(amb?'Đang bật':'Đang tắt')+'</button></div>'+
 '<p class=hp-note>Cài đặt được lưu trên máy này. Esc để đóng. Màu không bao giờ là tín hiệu duy nhất: luôn có chữ hoặc biểu tượng đi kèm.</p>'+
 '<div class=hp-row><button type=button class=hp-x data-k=reset>Đặt lại</button><button type=button class=hp-x data-k=close>Xong</button></div></div>';
 pn.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{S.size=+b.dataset.s;persist();apply();draw();focusKey('[data-s="'+S.size+'"]')});
 pn.querySelectorAll('[data-k]').forEach(b=>b.onclick=()=>{const k=b.dataset.k;
  if(k=='close')return close();
  if(k=='reset'){S={size:0,hc:0,rm:0,instant:0};try{st.c.amb=1}catch(e){}}
  else if(k=='amb'){try{st.c.amb=st.c.amb===0?1:0}catch(e){}}
  else S[k]=S[k]?0:1;
  persist();apply();draw();focusKey('[data-k="'+k+'"]')})}
const focusKey=sel=>{const e=pn.querySelector(sel);e&&e.focus()};
function openP(){if(open)return;open=true;lastFocus=document.activeElement;draw();pn.style.display='flex';if(window.CH1)CH1.open=1;(pn.querySelector('.hp-t[aria-pressed=true]')||pn.querySelector('button')).focus()}
function close(){if(!open)return;open=false;pn.style.display='none';if(window.CH1)CH1.open=0;lastFocus&&lastFocus.focus&&lastFocus.focus()}
hpb.onclick=openP;pn.addEventListener('click',e=>{if(e.target===pn)close()});
addEventListener('keydown',e=>{if(!open)return;
 if(e.key=='Escape'){e.preventDefault();e.stopImmediatePropagation();return close()}
 if(e.key=='Tab'){const f=[...pn.querySelectorAll('button')],i=f.indexOf(document.activeElement);e.preventDefault();f[(i+(e.shiftKey?-1:1)+f.length)%f.length].focus();e.stopImmediatePropagation();return}
 if(e.key!='Enter'&&e.key!=' ')e.stopImmediatePropagation()},true);
window.HPX={get:()=>S,open:openP,close,apply};
})();
