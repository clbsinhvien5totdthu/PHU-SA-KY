/* Đóng gói bộ ô nền + trang trí vẽ bằng pxl (assets/art/map.px.js → assets/art/out/sprites/m_*.png) thành js/mapart.js (data URI), chạy được cả khi mở file://.
   Dùng:  node <pxl>/bin/pxl.js build assets/art/map.px.js --out assets/art/out  &&  node tools/build_mapart.js */
const fs=require('fs'),path=require('path');const root=path.join(__dirname,'..'),dir=path.join(root,'assets/art/out/sprites');
const fl=fs.readdirSync(dir).filter(f=>/^m_.*\.png$/.test(f)).sort();
let js='/* Tranh nền & trang trí Map 01 (pxl: assets/art/map.px.js · sinh bởi tools/build_mapart.js, đừng sửa tay) */\nconst MAPART={'+fl.map(f=>f.slice(0,-4)+":'data:image/png;base64,"+fs.readFileSync(path.join(dir,f)).toString('base64')+"'").join(',')+'};\n';
fs.writeFileSync(path.join(root,'js/mapart.js'),js);console.log('mapart.js',(js.length/1024|0)+'KB',fl.length,'ảnh');
