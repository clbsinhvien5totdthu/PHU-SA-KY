/* Trạng thái, toast, hộp thoại seq() */
const V=[],K={known:[],told:[],open:[]},st={step:0,tr:0,tp:0,boat:0,c:{}};
const KM={},rec=(k,t,s,c)=>{K[k].push(t);KM[t]={src:s,cf:c}};
let busy=false,adv=null,ended=false,near=false,qt=0,nbOpen=false;
const toast=m=>{window.SFX&&SFX.chime();const t=$('toast');t.textContent=m;t.style.opacity=1;clearTimeout(t.h);t.h=setTimeout(()=>t.style.opacity=0,3200)};
const vocab=(...a)=>a.forEach(w=>{if(!V.includes(w)){V.push(w);toast('Từ mới: '+w.replace('|',' = '))}});
/* Hộp thoại: chữ hiện dần theo nhịp đọc (~24 ký tự/giây, nghỉ nhẹ ở dấu câu); bấm/E/Enter một lần để hiện hết dòng, lần nữa để sang dòng sau.
   Phần chữ chưa hiện vẫn chiếm chỗ (ẩn) nên hộp thoại không nhảy dòng khi gõ. */
const TYPE={cps:24,gap:{'.':280,'?':320,'!':320,'…':360,',':150,';':180,':':180,'—':180,'”':200}};
let typeT=null,typeEnd=null;
function typeLine(el,text,onEnd){clearTimeout(typeT);const ch=[...text],a=document.createElement('span'),b=document.createElement('span');b.style.visibility='hidden';el.textContent='';el.append(a,b);let n=0;
 const fin=()=>{clearTimeout(typeT);typeT=null;typeEnd=null;a.textContent=text;b.textContent='';onEnd&&onEnd()};typeEnd=fin;
 const tick=()=>{if(n>=ch.length)return fin();const c=ch[n++];a.textContent=ch.slice(0,n).join('');b.textContent=ch.slice(n).join('');
  const nx=ch[n];typeT=setTimeout(tick,1000/TYPE.cps+((!nx||nx===' ')&&TYPE.gap[c]||0))};tick()}
function seq(items,done){busy=true;$('dlg').style.display='block';let i=0;const step=()=>{window.SFX&&SFX.blip();if(i>=items.length){clearTimeout(typeT);typeEnd=null;$('dlg').style.display='none';busy=false;adv=null;done&&done();return}
 const[sp,tx,ch,hint]=items[i++];window.onSeqLine&&onSeqLine(sp,tx,hint);$('who').textContent=sp;portrait(sp);const c=$('ch');c.innerHTML='';$('more').style.display='none';adv=()=>typeEnd&&typeEnd();
 typeLine($('txt'),tx,()=>{if(ch){adv=null;ch.forEach(o=>{const b=document.createElement('button');b.textContent=o[0];b.onclick=()=>{const r=o[1]&&o[1]();if(r)items.splice(i,0,...r);step()};c.appendChild(b)})}else{$('more').style.display='block';adv=step}})};step()}
document.addEventListener('pointerdown',()=>{if(adv)adv()});
