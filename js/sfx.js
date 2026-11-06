/* Âm thanh tổng hợp bằng WebAudio (không cần file): môi trường theo cảnh + hiệu ứng nhỏ. SFX.scene(0..5) */
var SFX=(()=>{let a,m,sm,nb,L=[],iv=[],buf={},ld=0,lastG=0,cur;
const init=()=>{if(a){a.resume&&a.resume();return a}try{a=new(window.AudioContext||window.webkitAudioContext)();m=a.createGain();m.gain.value=.7;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;lp.Q.value=.5;m.connect(lp);lp.connect(a.destination);nb=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;sm=a.createGain();sm.gain.value=1;sm.connect(a.destination);load()}catch(e){a=null}return a};
/* Mẫu âm thanh thật (window.SFXD, js/data/sfxdata.js): giải mã 1 lần, phát qua nhánh riêng không qua bộ lọc thấp */
const load=()=>{if(ld)return;ld=1;const ALL=Object.assign({},window.SFXD||{},window.SFXC||{});for(const k in ALL){try{const b=atob(ALL[k].split(',')[1]),u=new Uint8Array(b.length);for(let i=0;i<b.length;i++)u[i]=b.charCodeAt(i);a.decodeAudioData(u.buffer,x=>{buf[k]=x},()=>{})}catch(e){}}};
const play=(k,g=.5,r=1,j=0)=>{if(!a||!buf[k])return null;if(a.state=='suspended')a.resume&&a.resume();const s=a.createBufferSource(),G=a.createGain();s.buffer=buf[k];s.playbackRate.value=r*(1+(Math.random()-.5)*j);G.gain.value=g;s.connect(G);G.connect(sm);s.start();return s};
/* Tiếng bước chân theo loại ô: cỏ (0,4,6) hoặc sỏi/đường (còn lại); sàn gỗ (7) trầm hơn */
const step=t=>{if(t==2)return;if(t==0||t==4||t==6)return play('step_grass',.5,1,.14);const k=Math.random()<.55?'step_gravel1':'step_gravel2';play(k,k=='step_gravel1'?.3:.26,t==7?.82:1,.12)};
const N=(ty,f,q,g,dur,dl=0,loop=0)=>{if(!a)return;const s=a.createBufferSource(),fl=a.createBiquadFilter(),G=a.createGain(),t=a.currentTime+dl;s.buffer=nb;s.loop=!!loop;fl.type=ty;fl.frequency.value=f;fl.Q.value=q;s.connect(fl);fl.connect(G);G.connect(m);G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+Math.min(.05,dur/3));if(!loop){G.gain.exponentialRampToValueAtTime(.0005,t+dur)}else L.push([s,G]);s.start(t);if(!loop)s.stop(t+dur+.1);return G};
const T=(f0,f1,g,dur,dl=0,ty='sine')=>{if(!a)return;const o=a.createOscillator(),G=a.createGain(),t=a.currentTime+dl;o.type=ty;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+.01);G.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(G);G.connect(m);o.start(t);o.stop(t+dur+.05)};
const hum=(f,g,ty,lr,ld)=>{const o=a.createOscillator(),G=a.createGain();o.type=ty;o.frequency.value=f;G.gain.value=g;o.connect(G);G.connect(m);o.start();L.push([o,G]);if(lr){const l=a.createOscillator(),d=a.createGain();l.frequency.value=lr;d.gain.value=ld;l.connect(d);d.connect(G.gain);l.start();L.push([l,null])}};
const stop=()=>{iv.forEach(clearInterval);iv=[];L.forEach(([s,G])=>{try{G&&G.gain.setTargetAtTime(0,a.currentTime,.4);s.stop(a.currentTime+1.5)}catch(e){}});L=[]};
const every=(ms,f)=>{f();iv.push(setInterval(f,ms))};
const bird=()=>{const f=1000+Math.random()*700,n=2+(Math.random()*2|0);for(let k=0;k<n;k++)T(f*(1+k*.08),f*(1.12+k*.08),.018,.22,k*.3)},page=()=>N('highpass',2500,.7,.12,.25),splash=()=>N('lowpass',700,.5,.1,.6);
/* ---- Hiệu ứng điện ảnh (tổng hợp bằng WebAudio, không dùng file nên không vướng bản quyền) ----
   Có file mẫu tên cue_<tên> trong assets/audio/sfx/cue/ (chạy tools/build_sfx_cues.py) thì ưu tiên file thật. */
let cT=[];const later=(ms,f)=>cT.push(setTimeout(()=>{try{f()}catch(e){}},ms)),clearCues=()=>{cT.forEach(clearTimeout);cT=[]};
/* NS: nhiễu lọc (quét tần số được); PT: âm thuần. rise>0: tăng dần tới đỉnh rồi tắt (dùng cho swell, chuông) */
const NS=(ty,f,q,g,dur,dl=0,f1=0,rise=0)=>{if(!a)return;const s=a.createBufferSource(),fl=a.createBiquadFilter(),G=a.createGain(),t=a.currentTime+dl;s.buffer=nb;s.loop=true;fl.type=ty;fl.frequency.setValueAtTime(f,t);if(f1)fl.frequency.exponentialRampToValueAtTime(f1,t+dur);fl.Q.value=q;s.connect(fl);fl.connect(G);G.connect(sm);
 if(rise){G.gain.setValueAtTime(.0005,t);G.gain.exponentialRampToValueAtTime(g,t+dur*rise);G.gain.exponentialRampToValueAtTime(.0005,t+dur)}else{G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+Math.min(.04,dur/3));G.gain.exponentialRampToValueAtTime(.0005,t+dur)}s.start(t);s.stop(t+dur+.1)};
const PT=(f0,f1,g,dur,dl=0,ty='sine',rise=0)=>{if(!a)return;const o=a.createOscillator(),G=a.createGain(),t=a.currentTime+dl;o.type=ty;o.frequency.setValueAtTime(f0,t);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);
 if(rise){G.gain.setValueAtTime(.0005,t);G.gain.exponentialRampToValueAtTime(g,t+dur*rise)}else{G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+.012)}G.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(G);G.connect(sm);o.start(t);o.stop(t+dur+.05)};
const C={
 whoosh:(d=.9,g=.05)=>NS('bandpass',350,1.1,g,d,0,2600,.45),                                                   /* chuyển cảnh */
 swell:(d=6)=>{NS('bandpass',180,.8,.08,d,0,3200,.93);[220,330,440,660].forEach((f,i)=>PT(f,f*1.006,.01+i*.002,d,0,'sine',.93))},  /* dâng lên trước khi trắng xoá */
 impact:(g=1)=>{PT(70,34,.2*g,1.1);NS('lowpass',420,.7,.11*g,.9,0,90);NS('highpass',2500,.6,.025*g,1.2,.02)},     /* cú "bụp" khi vào thư viện */
 bell:()=>[0,.17].forEach(d=>{PT(2700,2700,.03,.9,d);PT(3400,3400,.02,.7,d);PT(5400,5400,.008,.5,d)}),          /* chuông xe đạp */
 oar:()=>{NS('lowpass',650,.6,.035,.55);NS('bandpass',2100,3,.006,.2,.05)},                                       /* mái chèo khua nước */
 step:()=>{NS('lowpass',300,.7,.07,.16);PT(95,52,.07,.14)},                                                       /* bước chân sàn gỗ */
 creak:()=>{PT(150,260,.012,.8,0,'sawtooth');NS('bandpass',900,7,.012,.8,0,1500)},                                /* cửa kẽo kẹt */
 pen:()=>{for(let i=0;i<7;i++)NS('highpass',3800,.6,.02,.08,i*.16+Math.random()*.05)},                            /* bút sột soạt trên giấy */
 petal:()=>{PT(2000,2600,.018,.45);PT(3000,3000,.008,.4,.05);NS('highpass',4200,.5,.012,.22,.02)},                /* cánh sen chạm bàn */
 gong:()=>{[[98,.08,5.5],[147,.045,4.5],[196,.04,4],[294,.025,3.2],[587,.012,2.4]].forEach(([f,g,d])=>PT(f,f*.998,g,d,0,'sine',.02));NS('highpass',5200,.8,.01,3.5,0,0,.2)},   /* hồi chuông khi hiện tên game */
 cricket:()=>{const f=4200+Math.random()*500;for(let i=0;i<4;i++)PT(f,f,.0045,.045,i*.075)},
 frog:()=>{const f=210+Math.random()*60;for(let i=0;i<3;i++)PT(f,f*1.25,.02,.11,i*.16,'sawtooth')},
 chain:()=>NS('highpass',3200,1,.012,.02)};
Object.keys(C).forEach(k=>{const f=C[k];C[k]=(...x)=>buf['cue_'+k]?play('cue_'+k,.5):f(...x)});
/* Điều phối theo cú máy: cutscene.js gọi SFX.cue(tên cú máy, thời lượng, kiểu chuyển) mỗi lần cắt cảnh */
const cue=(n,D=8,type='cut')=>{if(!init())return;clearCues();
 if(type==='flash')later(0,()=>C.impact(1));else if(type==='dissolve')C.whoosh(.9,.03);else if(type==='dip')C.whoosh(1.2,.025);
 const R={riv3:()=>C.swell(D),rd3:()=>C.swell(D),book:()=>later(3000,C.petal),notes:()=>{C.pen();later(2600,C.pen)},bk:()=>{later(600,C.pen);later(3200,C.pen)},
  door:()=>{later(100,C.creak);[500,1100,1700,2300,2900].forEach(t=>later(t,C.step))},rdB:()=>C.bell(),gate:()=>later(7000,C.gong)};
 R[n]&&R[n]()};
const TF={'':330,'An':470,'Cô Hạnh':360,'Emma':520,'Khoa':420},typeTick=sp=>{if(!a)return;const k=(sp||'').replace(/\s*[–—-].*$/,'').trim();T(TF[k]||400,(TF[k]||400)*.92,.011,.035,0,'triangle')};
const lfo=(G,rate,depth)=>{const l=a.createOscillator(),d=a.createGain();l.frequency.value=rate;d.gain.value=depth;l.connect(d);d.connect(G.gain);l.start();L.push([l,null])};
const A=[()=>{N('bandpass',500,.6,.07,1,0,1);hum(46,.01,'square',8.5,.008);every(2600,splash);every(1700,()=>N('lowpass',900,.8,.04,1.5));every(1333,()=>setTimeout(C.oar,420));every(6500,()=>{Math.random()<.45&&bird()})},
()=>{N('bandpass',180,1,.06,1,0,1);hum(55,.03,'sine',6,.02);lfo(N('bandpass',300,.8,.03,1,0,1),1.7,.02);every(1000,()=>PT(1300,950,.004,.03,0,'square'));every(4300,page)},
()=>{every(1800,page);every(4200,()=>[0,.2,.45].forEach(d=>N('bandpass',1500,1.2,.02,.12,d)))},
()=>{hum(68,.03,'sawtooth',13,.015);N('bandpass',400,.5,.05,1,0,1);every(95,()=>{Math.random()<.5&&C.chain()});every(1100,()=>{Math.random()<.5&&C.cricket()});every(8000,()=>{Math.random()<.4&&bird()})},
()=>{N('lowpass',500,.5,.05,1,0,1);N('bandpass',900,.4,.012,1,0,1);every(7000,()=>{Math.random()<.5&&bird()})}];A[5]=A[4];A[4]=()=>{N('lowpass',500,.5,.05,1,0,1);hum(120,.004,'sawtooth');every(450,()=>{Math.random()<.7&&C.cricket()});every(2600,()=>{Math.random()<.5&&C.frog()});every(7000,()=>{Math.random()<.5&&bird()})};
return{init,play,step,cue,type:typeTick,C,scene(i){if(!init())return;stop();clearCues();A[i]&&A[i]()},blip(){a&&T(520,600,.022,.06,0,'triangle')},chime(){if(!a)return;if(buf.info){try{cur&&cur.stop()}catch(e){}cur=play('info',.32);return}[660,990].forEach((f,k)=>T(f,f,.035,.5,k*.09))},tap(){play('tap',.4)||this.blip()},save(){play('save',.45)}}})();
PSK.on('start',()=>SFX.scene(5));
