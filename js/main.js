/* Khởi động: START() */
const mkGame=()=>new Phaser.Game({type:Phaser.AUTO,parent:'g',backgroundColor:'#14200f',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},scene:G});

const START=()=>{if(!window.Phaser){const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:99;display:flex;align-items:center;justify-content:center;background:#14200f;color:#f3e6bd;font:18px/1.5 sans-serif;text-align:center;padding:24px';d.textContent='Không tải được Phaser (cần mạng hoặc vendor/phaser.min.js). Hãy tải lại trang.';document.body.appendChild(d);return}PSK.game=mkGame();PSK.emit('start',PSK.game)};
if(PSK.cfg.skipIntro)$('sk2').click();
