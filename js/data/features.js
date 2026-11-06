/* Sinh tự động bởi tools/build_features.py từ data/ref/03_feature_manifest.csv — không sửa tay. */
/* FT: [số, id, tên, khu, loại, col, row, x, y (px sơ đồ đã cắt khung 1840x1408), tin cậy, spatial_status, status, ghi chú] */
const FT=[[1,"A1_MO_CU","Mộ cụ","A","tomb",108,68,868,545,"B","approximate","provisional","Nguồn báo chí/du lịch: vòm mộ trắng, cách điệu cánh sen (dáng bàn tay úp); vẽ vòm trắng bát giác theo biểu tượng trên sơ đồ — kích thước chưa xác định [R2][R3]"],
[2,"A2_HO_SAO","Hồ Sao","A","water",109,81,876,648,"B","approximate","provisional","Nguồn xác nhận là hồ sen hình ngôi sao 5 cánh, giữa có đài sen trắng cao 6,5 m (sơ đồ tô xanh lục) → vẽ nước + đài sen [R3][R4]"],
[3,"A3_DEN_THO","Đền thờ cụ","A","temple",118,97,946,780,"B","approximate","provisional","Mặt bằng bát giác; chỉ dựng đúng hình dạng này"],
[4,"A4_NHA_KIENG","Nhà kiểng","A","building",101,95,811,765,"B","approximate","provisional","Chưa có footprint rõ; chỉ ghi nhãn, chờ xác minh"],
[5,"A5_CONG_MO","Cổng vào mộ cụ","A","gate",109,104,875,832,"B","approximate","provisional","Cửa vào từ trục ngang phía dưới"],
[6,"A6_CHUA_HOA_LONG","Chùa Hòa Long","A","building",127,65,1020,520,"B","approximate","provisional","Có trên sơ đồ nhưng chưa có trong cẩm nang v1.1; cần xác minh chức năng"],
[7,"A7_WC_DEN","WC (cạnh Đền thờ)","A","service",122,94,977,758,"B","approximate","provisional","Dịch vụ; kiểm tra tình trạng hiện nay"],
[8,"B1_NHA_TRUNG_BAY","Nhà trưng bày","B","building",83,95,669,760,"B","approximate","provisional","Chưa rõ là Nhà trưng bày nào; không gộp với nhà trưng bày HCM"],
[9,"B2_DIEU_KHAC_1","Điêu khắc Trống đồng & 9 đầu rồng","B","sculpture",80,77,640,620,"B","approximate","provisional","Chưa có footprint; đánh dấu điểm"],
[10,"B3_DIEU_KHAC_2","Điêu khắc Hoa sen & 12 con giáp","B","sculpture",65,84,520,676,"B","approximate","provisional","Chưa có footprint; đánh dấu điểm"],
[11,"B4_WC","WC (góc trên trái)","B","service",61,75,495,600,"B","approximate","provisional","Dịch vụ"],
[12,"B5_NUOC_TRAI","Mặt nước (nhiều nhánh)","B","water",67,91,540,730,"B","approximate","provisional","Không gộp thành một hồ; trace từng dải"],
[13,"G4_CONG_4","Cổng số 4","B","gate",53,105,427,845,"B","approximate","provisional","Giữ số 4 ở cạnh trái, gần mép Via hè"],
[14,"C1_DIEM_DUNG_CHAN","Điểm dừng chân (cụm 3 ô)","C","service",74,114,599,917,"B","approximate","provisional","Chưa rõ chức năng chi tiết; giữ đúng 3 ô"],
[15,"C2_WC","WC (trái dưới)","C","service",71,130,569,1043,"B","approximate","provisional","Dịch vụ"],
[16,"C3_DIEM_DUNG_CHAN","Điểm dừng chân (ô xanh)","C","service",74,137,597,1096,"B","approximate","provisional","Dịch vụ"],
[17,"C4_QUAY_LUU_NIEM","Quầy lưu niệm (trái)","C","service",74,141,597,1130,"B","approximate","provisional","Dịch vụ"],
[18,"G1_CONG_1","Cổng số 1","C","gate",81,147,648,1182,"B","approximate","provisional","Giữ đúng số 1; lối bộ có mũi tên đi lên"],
[19,"D1_HO_SEN","Hồ Sen","D","water",96,121,775,970,"B","approximate","provisional","Tương ứng \"Ao sen Đồng Tháp\" cạnh Nhà sàn (khởi công 19/5/1990) [R5][R6]"],
[20,"D2_NHA_SAN","Nhà sàn","D","building",112,120,903,962,"B","approximate","provisional","Mô hình Nhà sàn Bác Hồ gỗ, bên ao sen; footprint theo sơ đồ, vẽ màu gỗ [R5][R6]"],
[21,"D3_QUAY_LUU_NIEM","Quầy lưu niệm (cạnh Nhà sàn)","D","service",123,111,987,895,"B","approximate","provisional","Dịch vụ"],
[22,"D4_BAN_QUAN_LY","Ban quản lý khu di tích","D","building",109,148,876,1188,"B","approximate","provisional","Footprint rõ trên sơ đồ"],
[23,"D5_LOI_BO","Lối bộ xanh (mũi tên đi lên)","D","path",80,121,646,973,"B","approximate","provisional","Trục từ Cổng số 1 đi lên"],
[24,"G2_CONG_2","Cổng số 2","E","gate",151,160,1215,1287,"B","approximate","provisional","Đã có ảnh thực địa"],
[25,"E1_BAI_XE","Bãi xe","E","service",141,152,1133,1222,"B","approximate","provisional","Chưa có footprint rõ"],
[26,"E2_DIEM_DUNG_CHAN","Điểm dừng chân (cạnh bãi xe)","E","service",133,146,1065,1173,"B","approximate","provisional","Dịch vụ"],
[27,"E3_QUAY_LUU_NIEM","Quầy lưu niệm (gần Cổng 2)","E","service",158,149,1270,1195,"B","approximate","provisional","Khớp với dãy ki-ốt trong ảnh thực địa (cần xác minh)"],
[28,"E4_NHA_CHU_DINH_1","Nhà chữ đinh 1","E","house",172,152,1381,1219,"B","approximate","provisional","Nhà truyền thống gần Cổng số 2 · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[29,"E5_WC","WC (gần Cổng 2)","E","service",162,158,1297,1270,"B","approximate","provisional","Dịch vụ"],
[30,"F1_NHA_NOC_NGUA_1","Nhà nọc ngựa 1","F","house",135,97,1086,777,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[31,"F2_TUONG_CU","Tượng cụ","F","statue",140,103,1126,826,"B","approximate","provisional","Điểm nhấn trục; giữ nguyên dạng tròn"],
[32,"F3_DIEM_DUNG_CHAN","Điểm dừng chân (2 ô xanh)","F","service",166,110,1331,882,"B","approximate","provisional","Dịch vụ"],
[33,"F4_NHA_BAT_DAN_1","Nhà bát dần 1","F","house",133,115,1070,923,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[34,"F5_NHA_ONG_NAM_GIAO","Nhà ông Năm Giáo","F","house",144,128,1154,1029,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[35,"F6_NHA_CU_SAC","Nhà Cụ Sắc","F","house",157,131,1260,1052,"B","approximate","provisional","Nhà trong làng; chưa xác minh có phải nhà trưng bày · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[36,"F7_NHA_CHU_DINH_2","Nhà chữ đinh 2","F","house",168,123,1347,990,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[37,"F8_NHA_BAT_DAN_2","Nhà bát dần 2","F","house",179,128,1433,1027,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[38,"F9_NHA_ONG_CA_NHI_NGUU","Nhà ông Cả Nhị Ngưu","F","house",166,136,1333,1093,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[39,"F10_NHA_TREN_COC_2","Nhà trên cọc 2","F","house",187,113,1498,909,"B","approximate","provisional","Nhà trên cọc (nhãn nhỏ, đọc lại khi có ảnh nét hơn) · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[40,"F11_DIEM_DUNG_CHAN","Điểm dừng chân (góc trên phải)","F","service",177,104,1420,836,"B","approximate","provisional","Dịch vụ"],
[41,"F12_WC","WC (phải)","F","service",202,117,1623,937,"B","approximate","provisional","Dịch vụ"],
[42,"F13_KHU_AM_THUC","Khu ẩm thực","F","service",196,123,1573,988,"B","approximate","provisional","Dịch vụ"],
[43,"F14_NHA_TREN_COC_1","Nhà trên cọc 1","F","house",192,134,1539,1072,"B","approximate","provisional","Nhà trên cọc · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[44,"F15_CAFE_HOA_AN","Cafe Hòa An","F","service",187,148,1503,1186,"B","approximate","provisional","Dịch vụ"],
[45,"F16_NHA_NOC_NGUA_2","Nhà nọc ngựa 2","F","house",183,152,1464,1216,"B","approximate","provisional","Nhà truyền thống · Làng Hòa An xưa: nhà gỗ Nam Bộ (chữ đinh, bát dần, nọc ngựa, nhà sàn) — vẽ màu gỗ, chưa rõ mái lá/ngói [R7]"],
[46,"F17_KENH","Kênh nước uốn quanh làng","F","water",133,77,1071,620,"B","approximate","provisional","Trace liên tục; không làm thẳng"],
[47,"G3_CONG_3","Cổng số 3","A","gate",92,60,737,481,"B","approximate","provisional","Có mũi tên vàng hướng xe khách vào"],
[48,"GX_CONG_KHONG_NHAN","Cổng/cầu chưa có nhãn","F","gate",128,105,1029,843,"B","approximate","provisional","Không có nhãn trên sơ đồ; không tự đặt tên"],
[49,"GA_CONG_AM_THUC","Cổng khu ẩm thực","F","gate",188,151,1507,1210,"B","approximate","provisional","Nhãn xoay chéo; giữ vị trí tương đối"],
[50,"FX_KHOI_CHUA_NHAN","Khối viền trắng chưa có nhãn","F","building",164,119,1319,959,"B","approximate","provisional","Không có nhãn; không tự đặt tên, đánh dấu cần xác minh"],
[51,"AX_MANG_CHU_NHAT","Mảng chữ nhật dài có đường bao (chưa có nhãn)","A","garden",118,67,950,540,"B","approximate","provisional","Không có nhãn; chưa rõ là hồ, sân hay vườn, không tự đặt tên"]];

/* Hạng mục cần xác minh (cẩm nang §8): giữ vị trí, không tự đặt tên/kiến trúc */
const VERIFY=new Set(['A4_NHA_KIENG','A6_CHUA_HOA_LONG','B1_NHA_TRUNG_BAY','B2_DIEU_KHAC_1','B3_DIEU_KHAC_2','F6_NHA_CU_SAC','F10_NHA_TREN_COC_2','F14_NHA_TREN_COC_1','GX_CONG_KHONG_NHAN','FX_KHOI_CHUA_NHAN','AX_MANG_CHU_NHAT']);
/* Nhãn khó đọc trên sơ đồ (cẩm nang §8 mục 9): chỉ hiện khi ?debug */
const HIDE=new Set(['F10_NHA_TREN_COC_2','F14_NHA_TREN_COC_1']);
/* Hạng mục KHÔNG có nhãn trên sơ đồ → không đặt tên, không vẽ nhãn */
const NOLBL=new Set(['GX_CONG_KHONG_NHAN','FX_KHOI_CHUA_NHAN','AX_MANG_CHU_NHAT','F17_KENH','B5_NUOC_TRAI','D5_LOI_BO','A2_HO_SAO_X']);
/* Sprite theo ID: [kết cấu, hệ số phóng thêm, lệch y (px sơ đồ) của nhãn] — chưa có entry = chỉ nhãn/đánh dấu điểm */
const SPR={A3_DEN_THO:['dt',1.35,34],B1_NHA_TRUNG_BAY:['exh',1.5,50],D2_NHA_SAN:['san',1,30],D4_BAN_QUAN_LY:['bql',1.15,26],F2_TUONG_CU:['stat',1,22],
 F1_NHA_NOC_NGUA_1:['th2',1,24],F4_NHA_BAT_DAN_1:['th2',1,24],F5_NHA_ONG_NAM_GIAO:['th2',1,24],F6_NHA_CU_SAC:['th2',1,24],F7_NHA_CHU_DINH_2:['th2',1,24],F8_NHA_BAT_DAN_2:['th2',1,24],F9_NHA_ONG_CA_NHI_NGUU:['th2',1,24],F16_NHA_NOC_NGUA_2:['th2',1,24],E4_NHA_CHU_DINH_1:['th2',1,24],
 F10_NHA_TREN_COC_2:['th',1,22],F14_NHA_TREN_COC_1:['th',1,22],
 A7_WC_DEN:['bk',1,12],B4_WC:['bk',1,12],C2_WC:['bk',1,12],E5_WC:['bk',1,12],F12_WC:['bk',1,12],F15_CAFE_HOA_AN:['bk',1,12],
 C3_DIEM_DUNG_CHAN:['bl',1,14],E2_DIEM_DUNG_CHAN:['bl',1,14],F11_DIEM_DUNG_CHAN:['bl',1,14],F13_KHU_AM_THUC:['bg',1,28],
 C4_QUAY_LUU_NIEM:['pk',1,14],D3_QUAY_LUU_NIEM:['pk',1,14],E3_QUAY_LUU_NIEM:['pk',1,14]};
/* Hạng mục gồm nhiều ô: [kết cấu, [[dx,dy],...]] theo px sơ đồ quanh điểm đo */
const MULTI={C1_DIEM_DUNG_CHAN:['bk',[[-44,-28],[0,-28],[0,10]]],F3_DIEM_DUNG_CHAN:['bl',[[0,-22],[2,22]]]};
/* Chùa Hòa Long: chỉ footprint (col,row,rộng,cao theo ô) — chưa gán kiến trúc */
const CHUA=[[125,50,6,9],[125,59,5,22],[131,51,3,16],[131,70,3,5]];
const short=n=>n.replace(/^Điểm dừng chân.*$/,'ĐIỂM DỪNG CHÂN').replace(/^Quầy lưu niệm.*$/,'QUẦY LƯU NIỆM').replace(/^WC.*$/,'WC').replace(/^Mặt nước.*$/,'').toUpperCase();
/* Nhãn hiển thị: [x,y,chữ,màu,loại,tin cậy,trạng thái,id] — x,y theo px sơ đồ */
const LBL=FT.filter(f=>!NOLBL.has(f[1])&&f[4]!='path'&&f[4]!='gate').map(f=>{const[,id,n,,ty,,,x,y,cf]=f,dy=(SPR[id]||[,,0])[2]||({tomb:0,water:0,sculpture:10,temple:30,building:26,statue:22})[ty]||0;
 return[x,y+dy+(ty=='tomb'?30:0),short(n),(ty=='water'?'#d6f0ff':null),ty,cf,VERIFY.has(id)?'needs_verification':f[11],id]});
LBL.push([480,262,'PHẠM HỮU LẦU','#e8e8e0','road','B','provisional','ROAD_PHL']);
const GATES=FT.filter(f=>f[4]=='gate').map(f=>{const g={G1_CONG_1:[2,1],G2_CONG_2:[2,1],G3_CONG_3:[1,1],G4_CONG_4:[1,2],A5_CONG_MO:[2,1],GX_CONG_KHONG_NHAN:[1,2],GA_CONG_AM_THUC:[2,1]}[f[1]];
 return[f[5],f[6],NOLBL.has(f[1])?'':f[2].toUpperCase(),g[0],g[1],f[7],f[8],f[1]]});
/* Bảng tra nhanh */
const FID={};FT.forEach(f=>FID[f[1]]=f);
PSK.manifest=()=>JSON.stringify(FT.map(f=>({id:f[1],name_vi:(f[1]=='GX_CONG_KHONG_NHAN'||f[1]=='FX_KHOI_CHUA_NHAN'||f[1]=='AX_MANG_CHU_NHAT')?null:f[2],feature_type:f[4],zone:f[3],tile:{col:f[5],row:f[6],tile_px:8},position_norm:{u:+(f[7]/1840).toFixed(3),v:+(f[8]/1408).toFixed(3)},source_id:['MAP_USER_02'],confidence:f[9],spatial_status:f[10],status:VERIFY.has(f[1])?'needs_verification':f[11],notes:f[12]})),null,1);
