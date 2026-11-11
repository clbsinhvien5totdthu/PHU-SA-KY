/* Đóng gói tranh pxl (assets/art/out) thành js/img.js để game chạy được cả khi mở thẳng file://.
   Dùng:  python tools/art_boats.py (3 cảnh chèo thuyền)  ·  node <pxl>/bin/pxl.js build assets/art/art.px.js --out assets/art/out (đường quê + cổng)  rồi  node tools/build_img.js */
const fs=require('fs'),path=require('path');
const root=path.join(__dirname,'..'),out=path.join(root,'assets/art/out');
const BL=['sky','far','water','mid','boats','fore'];
const LAYERS={bt:['sky','far','water','mid','boats','over','fore'],xq:BL,nn:BL,road:['sky','far','mid','ground','fore'],gate:['sky','trees','gate','ground','people','fore'],lib:['wall','desk','book']};
const DIRS={bt:'ben_tre',xq:'xeo_quyt',nn:'nga_nam',road:'road',gate:'gate',lib:'library'};
const files={};
for(const [scene,ls] of Object.entries(LAYERS)){const dir=DIRS[scene];for(const l of ls)files[scene+'_'+l]=path.join(out,'scenes',dir,l+'.png')}
files.row_bt=path.join(out,'anims/row_ben_tre.png');files.row_xq=path.join(out,'anims/row_xeo_quyt.png');files.row_nn=path.join(out,'anims/row_nga_nam.png');for(const k of ['an','emma','khoa','big_an'])files['ride_'+k]=path.join(out,'anims/ride_'+k+'.png');   /* người đạp xe: nguồn assets/art/ride.px.js */
files.hanh=path.join(out,'sprites/hanh.png');files.petal=path.join(out,'sprites/petal.png');files.an_front=path.join(out,'sprites/an_front.png');files.an_idle=path.join(out,'sprites/an_idle.png');for(let i=0;i<6;i++)files['an_w'+i]=path.join(out,'sprites/an_w'+i+'.png');
/* An đi lên (an_u0..8 ← back.gif) và đi ngang nhìn phải (an_s0..8 ← left-right-an.gif); Emma (Emma.aseprite); 9 khung thư viện điện ảnh (assets/art/library_cinematic.px.js) */
for(let i=0;i<9;i++){files['an_u'+i]=path.join(out,'sprites/an_u'+i+'.png');files['an_s'+i]=path.join(out,'sprites/an_s'+i+'.png');files['an_l'+i]=path.join(out,'sprites/an_l'+i+'.png')}
files.emma_idle=path.join(out,'sprites/emma_idle.png');
for(const k of ['lf01','lf02','lf03','lf04','lf05','lf06','lf07a','lf07b','lf07c'])files[k]=path.join(out,'scenes/libfx/'+k+'.png');
const b64=f=>'data:image/png;base64,'+fs.readFileSync(f).toString('base64');
let js='/* Tranh pixel art cho cinematic (vẽ bằng pxl, nguồn: assets/art/art.px.js · sinh bởi tools/build_img.js, đừng sửa tay) */\nconst IMG={'+Object.entries(files).map(([k,f])=>k+":'"+b64(f)+"'").join(',')+'};\n';
js+='const IM={};for(const k in IMG){IM[k]=new Image();IM[k].src=IMG[k]}\n';
fs.writeFileSync(path.join(root,'js/img.js'),js);console.log('img.js',(js.length/1024|0)+'KB',Object.keys(files).length,'ảnh');
