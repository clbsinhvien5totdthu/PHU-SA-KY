/* Âm thanh tổng hợp bằng WebAudio (không cần file): môi trường theo cảnh + hiệu ứng nhỏ. SFX.scene(0..5) */
var SFX=(()=>{let a,m,nb,L=[],iv=[];
const init=()=>{if(a){a.resume&&a.resume();return a}try{a=new(window.AudioContext||window.webkitAudioContext)();m=a.createGain();m.gain.value=.7;const lp=a.createBiquadFilter();lp.type='lowpass';lp.frequency.value=3000;lp.Q.value=.5;m.connect(lp);lp.connect(a.destination);nb=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){a=null}return a};
const N=(ty,f,q,g,dur,dl=0,loop=0)=>{if(!a)return;const s=a.createBufferSource(),fl=a.createBiquadFilter(),G=a.createGain(),t=a.currentTime+dl;s.buffer=nb;s.loop=!!loop;fl.type=ty;fl.frequency.value=f;fl.Q.value=q;s.connect(fl);fl.connect(G);G.connect(m);G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+Math.min(.05,dur/3));if(!loop){G.gain.exponentialRampToValueAtTime(.0005,t+dur)}else L.push([s,G]);s.start(t);if(!loop)s.stop(t+dur+.1);return G};
const T=(f0,f1,g,dur,dl=0,ty='sine')=>{if(!a)return;const o=a.createOscillator(),G=a.createGain(),t=a.currentTime+dl;o.type=ty;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+.01);G.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(G);G.connect(m);o.start(t);o.stop(t+dur+.05)};
const hum=(f,g,ty,lr,ld)=>{const o=a.createOscillator(),G=a.createGain();o.type=ty;o.frequency.value=f;G.gain.value=g;o.connect(G);G.connect(m);o.start();L.push([o,G]);if(lr){const l=a.createOscillator(),d=a.createGain();l.frequency.value=lr;d.gain.value=ld;l.connect(d);d.connect(G.gain);l.start();L.push([l,null])}};
const stop=()=>{iv.forEach(clearInterval);iv=[];L.forEach(([s,G])=>{try{G&&G.gain.setTargetAtTime(0,a.currentTime,.4);s.stop(a.currentTime+1.5)}catch(e){}});L=[]};
const every=(ms,f)=>{f();iv.push(setInterval(f,ms))};
const bird=()=>{const f=1000+Math.random()*700,n=2+(Math.random()*2|0);for(let k=0;k<n;k++)T(f*(1+k*.08),f*(1.12+k*.08),.018,.22,k*.3)},page=()=>N('highpass',2500,.7,.12,.25),splash=()=>N('lowpass',700,.5,.1,.6);
const A=[()=>{N('bandpass',500,.6,.07,1,0,1);every(2600,splash);every(6500,()=>{Math.random()<.45&&bird()})},
()=>{N('bandpass',180,1,.06,1,0,1);hum(55,.03,'sine',6,.02);every(4300,page)},
()=>{every(1800,page);every(4200,()=>[0,.2,.45].forEach(d=>N('bandpass',1500,1.2,.02,.12,d)))},
()=>{hum(68,.03,'sawtooth',13,.015);N('bandpass',400,.5,.05,1,0,1);every(8000,()=>{Math.random()<.4&&bird()})},
()=>{N('lowpass',500,.5,.05,1,0,1);N('bandpass',900,.4,.012,1,0,1);every(7000,()=>{Math.random()<.5&&bird()})}];A[5]=A[4];
return{init,scene(i){if(!init())return;stop();A[i]&&A[i]()},blip(){a&&T(520,600,.022,.06,0,'triangle')},chime(){a&&[660,990].forEach((f,k)=>T(f,f,.035,.5,k*.09))}}})();
PSK.on('start',()=>SFX.scene(5));
