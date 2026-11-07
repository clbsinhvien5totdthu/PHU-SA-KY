/* Đóng gói tranh pxl (assets/art/out) thành js/img.js để game chạy được cả khi mở thẳng file://.
   Dùng:  python tools/art_boats.py (3 cảnh chèo thuyền)  ·  node <pxl>/bin/pxl.js build assets/art/art.px.js --out assets/art/out (đường quê + cổng)  rồi  node tools/build_img.js */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'assets/art/out');
const BL=['sky','far','water','mid','boats','fore'];
const LAYERS={bt:['sky','far','water','mid','boats','over','fore'],xq:BL,nn:BL,road:['sky','far','mid','ground','fore'],gate:['sky','trees','gate','ground','people','fore']};
const DIRS={bt:'ben_tre',xq:'xeo_quyt',nn:'nga_nam',road:'road',gate:'gate'};
const files={};
for(const [scene,ls] of Object.entries(LAYERS)){const dir=DIRS[scene];for(const l of ls)files[scene+'_'+l]=path.join(out,'scenes',dir,l+'.png')}
files.row_bt=path.join(out,'anims/row_ben_tre.png');files.row_xq=path.join(out,'anims/row_xeo_quyt.png');files.row_nn=path.join(out,'anims/row_nga_nam.png');for(const k of ['an','emma','khoa','big_an'])files['ride_'+k]=path.join(out,'anims/ride_'+k+'.png');   /* người đạp xe: nguồn assets/art/ride.px.js */
files.petal=path.join(out,'sprites/petal.png');
const b64=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
let js='/* Tranh pixel art cho cinematic (vẽ bằng pxl, nguồn: assets/art/art.px.js · sinh bởi tools/build_img.js, đừng sửa tay) */\nconst IMG={'+Object.entries(files).map(([k,f])=>k+":'"+b64(f)+"'").join(',')+'};\n';
js+='const IM={};for(const k in IMG){IM[k]=new Image();IM[k].src=IMG[k]}\n';
fs.writeFileSync(path.join(root,'js/img.js'),js);console.log('img.js',(js.length/1024|0)+'KB',Object.keys(files).length,'ảnh');
