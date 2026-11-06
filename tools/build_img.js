/* Đóng gói tranh pxl (assets/art/out) thành js/img.js để game chạy được cả khi mở thẳng file://.
   Dùng:  node <pxl>/bin/pxl.js build assets/art/art.px.js --out assets/art/out && node tools/build_img.js */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'assets/art/out');
const LAYERS={river:['sky','far','water','boats','fore'],road:['sky','far','mid','ground','fore'],gate:['sky','trees','gate','ground','people','fore']};
const files={};
for(const [scene,ls] of Object.entries(LAYERS)){const dir=scene==='river'?'intro_river':scene;for(const l of ls)files[scene+'_'+l]=path.join(out,'scenes',dir,l+'.png')}
files.rower=path.join(out,'anims/rower.png');files.petal=path.join(out,'sprites/petal.png');
const b64=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
let js='/* Tranh pixel art cho cinematic (vẽ bằng pxl, nguồn: assets/art/art.px.js · sinh bởi tools/build_img.js, đừng sửa tay) */\nconst IMG={'+Object.entries(files).map(([k,f])=>k+":'"+b64(f)+"'").join(',')+'};\n';
js+='const IM={};for(const k in IMG){IM[k]=new Image();IM[k].src=IMG[k]}\n';
fs.writeFileSync(path.join(root,'js/img.js'),js);console.log('img.js',(js.length/1024|0)+'KB',Object.keys(files).length,'ảnh');
