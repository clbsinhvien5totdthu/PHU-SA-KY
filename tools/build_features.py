#!/usr/bin/env python3
"""Sinh js/data/features.js từ data/ref/03_feature_manifest.csv (51 hạng mục, cẩm nang v2.0). Chạy: python3 tools/build_features.py"""
import csv,json,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
rows=list(csv.DictReader(open(ROOT+'/data/ref/03_feature_manifest.csv',encoding='utf-8-sig')))
FT=[[int(r['num']),r['id'],r['name_vi'],r['zone'],r['feature_type'],int(r['tile_col']),int(r['tile_row']),int(r['x_px'])-40,int(r['y_px'])-40,r['confidence'],r['spatial_status'],r['status'],r['notes']] for r in rows]
assert len(FT)==51
out='/* Sinh tự động bởi tools/build_features.py từ data/ref/03_feature_manifest.csv — không sửa tay. */\n'
out+='/* FT: [số, id, tên, khu, loại, col, row, x, y (px sơ đồ đã cắt khung 1840x1408), tin cậy, spatial_status, status, ghi chú] */\nconst FT=['+',\n'.join(json.dumps(f,ensure_ascii=False,separators=(',',':')) for f in FT)+'];\n'
out+=r'''
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
'''
open(ROOT+'/js/data/features.js','w',encoding='utf8').write(out)
print('features.js',len(out))

# ---- data/feature_manifest.json (schema theo cẩm nang v2.0 §06) ----
NULL_NAME={'GX_CONG_KHONG_NHAN','FX_KHOI_CHUA_NHAN','AX_MANG_CHU_NHAT'}
VERIFY={'A4_NHA_KIENG','A6_CHUA_HOA_LONG','B1_NHA_TRUNG_BAY','B2_DIEU_KHAC_1','B3_DIEU_KHAC_2','F6_NHA_CU_SAC','F10_NHA_TREN_COC_2','F14_NHA_TREN_COC_1','GX_CONG_KHONG_NHAN','FX_KHOI_CHUA_NHAN','AX_MANG_CHU_NHAT'}
js=[]
for r in rows:
    i=r['id']
    e={'id':i,'name_vi':None if i in NULL_NAME else r['name_vi'],'feature_type':r['feature_type'],'zone':r['zone'],
       'geometry_source_id':['MAP_USER_02'],'appearance_source_id':['PANO_GATE2_01'] if i=='G2_CONG_2' else [],
       'confidence':r['confidence'],'position_norm':{'u':float(r['u']),'v':float(r['v'])},
       'tile':{'col':int(r['tile_col']),'row':int(r['tile_row']),'tile_px':8},'geometry':'point','view_type':'plan',
       'spatial_status':r['spatial_status'],'status':r['status'],'needs_verification':i in VERIFY,
       'source_capture_date':'2026-11-05','conflict_note':None,'notes':r['notes']}
    js.append(e)
assert len(js)==51 and len({e['id'] for e in js})==51
open(ROOT+'/data/feature_manifest.json','w',encoding='utf8').write(json.dumps(js,ensure_ascii=False,indent=1)+'\n')
print('feature_manifest.json',len(js),'mục')
