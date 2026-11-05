/* PSK – không gian tên tích hợp: cấu hình + bus sự kiện (xem docs/INTEGRATION.md) */
const PSK={cfg:{lang:'vi',skipIntro:/[?&]skip/.test(location.search),debug:/[?&]debug/.test(location.search)},_h:{},game:null,scene:null,
on(n,f){(this._h[n]??=[]).push(f);return this},emit(n,...a){(this._h[n]||[]).forEach(f=>{try{f(...a)}catch(e){console.error('[PSK]',n,e)}})}};
/* Sự kiện: ready(scene) · start(game) · step(index) · zone(tên) · end(state) */
