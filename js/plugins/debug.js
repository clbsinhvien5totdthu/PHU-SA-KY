/* ?debug – phím 1..6 dịch chuyển đến bước, hiện toạ độ ô */
PSK.on('ready',sc=>{if(!PSK.cfg.debug)return;const d=document.createElement('div');d.style.cssText='position:fixed;left:6px;top:50%;z-index:9;background:#000a;color:#0f0;font:11px monospace;padding:4px';document.body.appendChild(d);
addEventListener('keydown',e=>{const n=+e.key;if(n>=1&&n<=STEPS.length){st.step=n-1;hud();sc.pl.x=STEPS[n-1].p[0]*T;sc.pl.y=STEPS[n-1].p[1]*T}});
sc.events.on('update',()=>{d.textContent=`ô ${sc.pl.x/T|0},${sc.pl.y/T|0} · bước ${st.step+1} · phím 1-${STEPS.length}`})});
