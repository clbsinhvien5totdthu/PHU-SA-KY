pal({k:"#0b0f22",n:"#1b2347",p:"#3b3558",m:"#8a4b66",r:"#c9605f",o:"#f3a867",y:"#ffd98a",S:"#fff1cf",b:"#c98a5a",B:"#8a5a3e",d:"#4a3328",D:"#1d1a22",g:"#5f8f4a",G:"#2f5a3a",t:"#16302a",W:"#7a4a24",V:"#3a2210",u:"#1d3558",l:"#e8d6a6",R:"#8b2a1c",c:"#c3a06a"})
ramps("kpmroyS","DdBb","tGg","VWc")
const SKY=(h)=>grad(0,0,160,h,"knpmroy","v")
const clouds=(c)=>{const r=c.rng(3);for(let i=0;i<9;i++){const x=Math.floor(r()*160),y=6+Math.floor(r()*24),w=18+Math.floor(r()*30);c.hline(x,y,w,"m");c.hline(x+3,y+1,w-8,"p")}}
const palms=(xs,base,col)=>(c)=>{xs.forEach((x,i)=>{const h=18+(i%2)*6;c.line(x,base,x+1,base-h,col,1);for(let a=0;a<6;a++){const ang=-2.6+a*.55;c.line(x+1,base-h,x+1+Math.round(Math.cos(ang)*9),base-h+Math.round(Math.sin(ang)*5)+3,col)}})}
sprite("_boat",{w:30,h:14},poly([0,9,30,7,27,13,4,13],"k"),rect(14,4,2,5,"k"),circ(15,3,2,"k"),line(16,6,25,12,"k"))
sprite("_boat_s",{w:16,h:8},poly([0,5,16,4,14,7,2,7],"k"),rect(7,1,1,4,"k"),px(7,0,"k"))
scene("intro_river",{w:160,h:90,layers:true},
 layer("sky",SKY(52),clouds,circ(100,44,7,"S")),
 layer("far",(c)=>{for(let x=0;x<160;x++){const h=5+Math.round(3*Math.sin(x*.11)+2*Math.sin(x*.37+1));c.vline(x,50-h,h,"p")}},(c)=>{for(let x=0;x<160;x++){const h=3+Math.round(2*Math.sin(x*.21+2));c.vline(x,49-h,h+1,"n")}},palms([14,40,126,148],50,"k")),
 layer("water",grad(0,50,160,40,"bBdD","v"),(c)=>{const r=c.rng(7);for(let i=0;i<70;i++){const y=51+Math.floor(r()*38),k=(y-50)/40,w=Math.round(4+r()*20*(1-k*.5));c.hline(Math.round(100-w/2+(r()-.5)*(10+k*40)),y,w,k<.5?"y":"o")}},hline(0,50,160,"o")),
 layer("boats",stamp("_boat_s",118,48),stamp("_boat_s",30,50,{flip:"x"}),stamp("_boat",70,60),stamp("_boat",6,74)),
 glow("S",{r:14,strength:.5}))
const shelf=(c)=>{const r=c.rng(5),cols=["R","u","W","c","G","m","d","l"];for(let s=0;s<4;s++){const y=10+s*17;for(const [x0,x1] of [[4,58],[102,156]]){let x=x0;while(x<x1){const w=2+Math.floor(r()*3),h=9+Math.floor(r()*6);c.rect(x,y+14-h,w,h,cols[Math.floor(r()*cols.length)]);x+=w+(r()<.15?2:0)}}c.rect(2,y+14,156,2,"W")}}
scene("library",{w:160,h:90,bg:"V",layers:true},
 layer("wall",shelf,rect(62,8,36,46,"W"),grad(64,10,32,42,"yoyo","v"),vline(80,10,42,"W"),hline(64,30,32,"W")),
 layer("shafts",{light:2,density:.45},poly([64,10,96,10,142,72,36,72],"y")),
 layer("room",vline(80,0,6,"k"),line(50,6,110,8,"k",2),circ(30,55,5,"k"),poly([20,72,24,61,36,61,40,72],"k"),circ(130,51,5,"k"),poly([118,72,122,58,138,58,142,72],"k")),
 layer("desk",rect(0,70,160,20,"W"),hline(0,70,160,"c"),grad(0,72,160,18,"WWV","v"),rect(62,62,36,8,"u"),rect(64,59,32,4,"l"),vline(80,59,11,"R"),px(90,66,"r")),
 glow("y",{r:5,strength:.25}))
sprite("_bike",{w:22,h:17},ring(4,13,3,"k"),ring(18,13,3,"k"),line(4,13,9,7,"k"),line(9,7,16,7,"k"),line(16,7,18,13,"k"),line(9,7,11,13,"k"),circ(11,2,2,"k"),line(11,4,12,8,"k",2),line(12,6,17,7,"k"))
scene("road",{w:160,h:90,layers:true},
 layer("sky",SKY(50),clouds,circ(104,44,8,"S")),
 layer("far",(c)=>{for(let x=0;x<160;x++){const h=5+Math.round(3*Math.sin(x*.13)+2*Math.sin(x*.4));c.vline(x,52-h,h,"p")}},palms([10,52,96,140],54,"k"),vline(30,20,34,"k"),hline(24,24,12,"k"),vline(118,22,32,"k"),hline(112,26,12,"k"),wire(30,24,118,26,5,"k")),
 layer("road",rect(0,54,160,36,"D"),rect(0,54,160,3,"d"),grad(0,57,160,33,"nkkD","v"),(c)=>{for(let x=-4;x<160;x+=22)c.hline(x,76,11,"c")},hline(0,57,160,"o")),
 layer("bikes",stamp("_bike",24,60),stamp("_bike",64,55),stamp("_bike",100,58)),
 glow("S",{r:14,strength:.5}))
sprite("_gate",{w:72,h:36},rect(6,10,6,26,"k"),rect(60,10,6,26,"k"),rect(2,8,68,3,"k"),poly([0,8,10,0,62,0,72,8],"k"),rect(24,12,24,3,"k"),rect(8,16,2,20,"p"),rect(62,16,2,20,"p"))
scene("gate",{w:160,h:90,layers:true},
 layer("sky",SKY(50),clouds,circ(80,46,8,"S")),
 layer("trees",(c)=>{const r=c.rng(9);for(let x=0;x<166;x+=5){const rr=6+Math.floor(r()*5);c.circ(x,42-Math.floor(r()*5),rr,"t");c.circ(x-1,40-Math.floor(r()*4),rr-3,"G")}},rect(0,46,160,10,"t")),
 layer("gate",stamp("_gate",44,20),rect(0,56,160,3,"d")),
 layer("water",grad(0,59,160,31,"nnkk","v"),stamp("_gate",44,59,{flip:"y"}),(c)=>{for(let y=60;y<90;y+=2)c.hline(0,y,160,"n")},ellipse(30,72,6,2,"G"),ellipse(120,80,8,2,"G"),px(30,70,"r"),px(120,78,"r"),ellipse(70,84,5,1,"G")),
 layer("people",circ(18,50,2,"k"),rect(16,52,5,8,"k"),circ(28,50,2,"k"),rect(26,52,5,8,"k"),circ(132,50,2,"k"),rect(130,52,5,8,"k")),
 glow("S",{r:14,strength:.5}))
