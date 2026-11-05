/* Trạng thái, toast, hộp thoại seq() */
const V=[],K={known:[],told:[],open:[]},st={step:0,tr:0,tp:0,boat:0,c:{}};
const KM={},rec=(k,t,s,c)=>{K[k].push(t);KM[t]={src:s,cf:c}};
let busy=false,adv=null,ended=false,near=false,qt=0,nbOpen=false;
const toast=m=>{window.SFX&&SFX.chime();const t=$('toast');t.textContent=m;t.style.opacity=1;clearTimeout(t.h);t.h=setTimeout(()=>t.style.opacity=0,3200)};
const vocab=(...a)=>a.forEach(w=>{if(!V.includes(w)){V.push(w);toast('Từ mới: '+w.replace('|',' = '))}});
function seq(items,done){busy=true;$('dlg').style.display='block';let i=0;const step=()=>{window.SFX&&SFX.blip();if(i>=items.length){$('dlg').style.display='none';busy=false;adv=null;done&&done();return}
 const[sp,tx,ch]=items[i++];$('who').textContent=sp;portrait(sp);$('txt').textContent=tx;const c=$('ch');c.innerHTML='';$('more').style.display=ch?'none':'block';
 if(ch){adv=null;ch.forEach(o=>{const b=document.createElement('button');b.textContent=o[0];b.onclick=()=>{const r=o[1]&&o[1]();if(r)items.splice(i,0,...r);step()};c.appendChild(b)})}else adv=step};step()}
document.addEventListener('pointerdown',()=>{if(adv)adv()});
