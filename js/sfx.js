/* Âm thanh tổng hợp bằng WebAudio (không cần file): môi trường theo cảnh + hiệu ứng nhỏ. SFX.scene(0..5) */
var SFX=(()=>{let a,m,nb,L=[],iv=[];
const init=()=>{if(a){a.resume&&a.resume();return a}try{a=new(window.AudioContext||window.webkitAudioContext)();m=a.createGain();m.gain.value=.8;m.connect(a.destination);nb=a.createBuffer(1,a.sampleRate*2,a.sampleRate);const d=nb.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){a=null}return a};
const N=(ty,f,q,g,dur,dl=0,loop=0)=>{if(!a)return;const s=a.createBufferSource(),fl=a.createBiquadFilter(),G=a.createGain(),t=a.currentTime+dl;s.buffer=nb;s.loop=!!loop;fl.type=ty;fl.frequency.value=f;fl.Q.value=q;s.connect(fl);fl.connect(G);G.connect(m);G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+Math.min(.05,dur/3));if(!loop){G.gain.exponentialRampToValueAtTime(.0005,t+dur);s.stop(t+dur+.1)}else L.push([s,G]);s.start(t);return G};
const T=(f0,f1,g,dur,dl=0,ty='sine')=>{if(!a)return;const o=a.createOscillator(),G=a.createGain(),t=a.currentTime+dl;o.type=ty;o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f1,t+dur);G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g,t+.01);G.gain.exponentialRampToValueAtTime(.0005,t+dur);o.connect(G);G.connect(m);o.start(t);o.stop(t+dur+.05)};
const hum=(f,g,ty,lr,ld)=>{const o=a.createOscillator(),G=a.createGain();o.type=ty;o.frequency.value=f;G.gain.value=g;o.connect(G);G.connect(m);o.start();L.push([o,G]);if(lr){const l=a.createOscillator(),d=a.createGain();l.frequency.value=lr;d.gain.value=ld;l.connect(d);d.connect(G.gain);l.start();L.push([l,null])}};
const stop=()=>{iv.forEach(clearInterval);iv=[];L.forEach(([s,G])=>{try{G&&G.gain.setTargetAtTime(0,a.currentTime,.4);s.stop(a.currentTime+1.5)}catch(e){}});L=[]};
const every=(ms,f)=>{f();iv.push(setInterval(f,ms))};
const bird=()=>{const f=2400+Math.random()*1800;[0,.12,.25].forEach(d=>T(f,f*1.25,.04,.09,d))},page=()=>N('highpass',2500,.7,.12,.25),splash=()=>N('lowpass',700,.5,.1,.6);
const A=[()=>{N('bandpass',500,.6,.07,1,0,1);every(2600,splash);every(2200,()=>{Math.random()<.7&&bird()})},
()=>{N('bandpass',180,1,.06,1,0,1);hum(55,.03,'sine',6,.02);every(4300,page)},
()=>{every(1800,page);every(2500,()=>[0,.12,.24,.4].forEach(d=>N('bandpass',3200,2,.05,.07,d)))},
()=>{hum(68,.03,'sawtooth',13,.015);N('bandpass',400,.5,.05,1,0,1);every(3500,()=>{Math.random()<.5&&bird()})},
()=>{hum(4300,.008,'square',30,.008);N('lowpass',500,.5,.05,1,0,1);every(3000,()=>{Math.random()<.6&&bird()})}];A[5]=A[4];
return{init,scene(i){if(!init())return;stop();A[i]&&A[i]()},blip(){a&&T(660,880,.04,.07,0,'square')},chime(){a&&[880,1320].forEach((f,k)=>T(f,f,.05,.5,k*.09))}}})();
PSK.on('start',()=>SFX.scene(5));
