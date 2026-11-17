/* Đóng gói sprite cụm Hòa An (assets/art/thuvien.px.js) thành js/data/thuvienart.js (data URI, chạy được qua file://).
   Dùng:  node <pxl>/bin/pxl.js build assets/art/thuvien.px.js --out assets/art/out/tv  &&  node tools/build_thuvien.js */
const fs=require('fs'),path=require('path'),root=path.join(__dirname,'..'),dir=path.join(root,'assets/art/out/tv/sprites');
const fl=fs.readdirSync(dir).filter(f=>/^(lb_).*\.png$/.test(f)).sort();
const js='/* Sprite thư viện mở đầu (pxl: assets/art/thuvien.px.js · sinh bởi tools/build_thuvien.js, đừng sửa tay) */\nconst TVART={'+fl.map(f=>f.slice(0,-4)+":'data:image/png;base64,"+fs.readFileSync(path.join(dir,f)).toString('base64')+"'").join(',')+'};\n';
fs.writeFileSync(path.join(root,'js/data/thuvienart.js'),js);console.log('thuvienart.js',(js.length/1024|0)+'KB',fl.length,'ảnh');
