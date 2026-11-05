/* Hằng số, RNG, hình học */

const T=16,Q=.2,W=160,H=120,SS=1.6,$=id=>document.getElementById(id);
let s=11;const R=()=>(s=s*16807%2147483647)/2147483647,pick=a=>a[R()*a.length|0];
const ins=(P,x,y)=>{let c=0;for(let i=0,j=P.length-1;i<P.length;j=i++){const[a,b]=P[i],[p,q]=P[j];if((b>y)!=(q>y)&&x<(p-a)*(y-b)/(q-b)+a)c=!c}return c};
const sq=P=>P.map(([x,y])=>[x*Q,y*Q]);
