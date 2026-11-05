/* Hằng số, RNG, hình học */
/* Lưới theo sơ đồ chuẩn (cẩm nang bản đồ pixel v2.0): 1 ô = 8 px sơ đồ đã cắt khung 1840x1408 → 230x176 ô. Q = ô/px sơ đồ. */
const T=16,Q=1/8,W=230,H=176,SS=1.6,$=id=>document.getElementById(id);
let s=11;const R=()=>(s=s*16807%2147483647)/2147483647,pick=a=>a[R()*a.length|0];
const ins=(P,x,y)=>{let c=0;for(let i=0,j=P.length-1;i<P.length;j=i++){const[a,b]=P[i],[p,q]=P[j];if((b>y)!=(q>y)&&x<(p-a)*(y-b)/(q-b)+a)c=!c}return c};
