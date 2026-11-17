/* Đóng gói sprite cụm Hòa An (assets/art/hoaan.px.js) thành js/data/hoaanart.js (data URI, chạy được qua file://).
   Dùng:  node <pxl>/bin/pxl.js build assets/art/hoaan.px.js --out assets/art/out/ha  &&  node tools/build_hoaan.js */
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),dir=path.join(root,'assets/art/out/ha/sprites');
const fl=fs.readdirSync(dir).filter(f=>/^(ha_|ic_|st_|wv_).*\.png$/.test(f)).sort();
const js='/* Sprite cụm Hòa An, biểu tượng động từ/trạng thái (pxl: assets/art/hoaan.px.js · sinh bởi tools/build_hoaan.js, đừng sửa tay) */\nconst HAART={'+fl.map(f=>f.slice(0,-4)+":'data:image/png;base64,"+fs.readFileSync(path.join(dir,f)).toString('base64')+"'").join(',')+'};\n';
fs.writeFileSync(path.join(root,'js/data/hoaanart.js'),js);console.log('hoaanart.js',(js.length/1024|0)+'KB',fl.length,'ảnh');
