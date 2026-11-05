/* Nhạc nền khu di tích: "Sáng Mekong Delta". Phát lặp khi vào bản đồ, nhỏ lại khi có hội thoại.
   Nút 🎵 trong thanh bên hoặc phím U để bật/tắt. Đổi bài: thay file trong assets/audio/ hoặc đặt PSK.cfg.music. */
(()=>{const SRC=PSK.cfg.music||'assets/audio/sang_mekong_delta.mp3',VOL=.38,DUCK=.16;
let au,muted=false,cur=0,want=false,btn;
try{muted=localStorage.getItem('psk_music')=='off'}catch(e){}
const mk=()=>{if(au)return au;au=new Audio(SRC);au.loop=true;au.preload='auto';au.volume=0;au.addEventListener('error',()=>console.warn('[music] không tải được',SRC));return au};
const lab=()=>{if(btn){btn.textContent=muted?'🔇 Nhạc [U]':'🎵 Nhạc [U]';btn.title=muted?'Bật nhạc nền':'Tắt nhạc nền'}};
const play=()=>{if(muted||!want)return;const a=mk();const p=a.play();if(p&&p.catch)p.catch(()=>{/* trình duyệt chặn tự phát: chờ lần chạm/phím đầu tiên */const r=()=>{removeEventListener('pointerdown',r);removeEventListener('keydown',r);play()};addEventListener('pointerdown',r,{once:true});addEventListener('keydown',r,{once:true})})};
const toggle=()=>{muted=!muted;try{localStorage.setItem('psk_music',muted?'off':'on')}catch(e){}lab();if(muted){au&&au.pause()}else play()};
PSK.on('start',()=>{want=true;play()});
PSK.on('ready',sc=>{
 btn=document.createElement('button');btn.id='mbb';btn.className='box';btn.onclick=toggle;const side=$('side');side&&side.appendChild(btn);lab();
 addEventListener('keydown',e=>{if(e.key.toLowerCase()=='u'&&!e.ctrlKey&&!e.metaKey&&!e.altKey)toggle()});
 sc.events.on('update',(_,dt)=>{if(!au||au.paused)return;const tgt=(typeof busy!=='undefined'&&busy)?DUCK:VOL;cur+=(tgt-cur)*Math.min(1,(dt||16)/900);au.volume=Math.max(0,Math.min(1,cur))})});
PSK.on('end',()=>{if(au)au.volume=Math.min(au.volume,.12);cur=.12});
document.addEventListener('visibilitychange',()=>{if(!au)return;if(document.hidden)au.pause();else play()});
})();
