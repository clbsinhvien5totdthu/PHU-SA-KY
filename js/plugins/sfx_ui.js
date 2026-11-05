/* Hiệu ứng giao diện: bấm nút/chọn đáp án = confirm tap; hoàn thành mục tiêu và hết chương = save game.
   (Bước chân: scene.js → SFX.step; thông báo/từ mới: toast → SFX.chime = info; mẫu âm thanh: js/data/sfxdata.js) */
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('button'))SFX.tap()},true);
PSK.on('step',()=>SFX.save());
PSK.on('end',()=>setTimeout(()=>SFX.save(),250));
