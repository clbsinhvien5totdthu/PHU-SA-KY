/* Dựng bản đồ Map 01 từ lưới sinh bởi tools/build_map.py (js/data/mapdata.js) — sơ đồ chuẩn 230x176 ô */
const CHR='0123456789ab';
const M=MAPDATA.M.map(r=>[...r].map(c=>CHR.indexOf(c)));
const B=MAPDATA.B.map(r=>[...r].map(c=>+c));
