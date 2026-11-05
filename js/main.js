/* Khởi động: START() */
const mkGame=()=>new Phaser.Game({type:Phaser.AUTO,parent:'g',backgroundColor:'#14200f',pixelArt:true,roundPixels:true,scale:{mode:Phaser.Scale.RESIZE,width:'100%',height:'100%'},scene:G});

const START=()=>{PSK.game=mkGame();PSK.emit('start',PSK.game)};
if(PSK.cfg.skipIntro)$('sk2').click();
