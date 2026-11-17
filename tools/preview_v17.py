#!/usr/bin/env python3
"""v17: xuất ảnh preview nhà + ô gạch dual-grid, kiểm tra tileable, overlay lên 01_master_plan_reference.png.
Dùng: node <pxl>/bin/pxl.js build assets/art/map.px.js --out assets/art/out ... && python3 tools/preview_v17.py
Chỉ ĐỌC dữ liệu bản đồ (js/data/mapdata.js đã xuất ra JSON trung gian) — không sửa MAPDATA, không sửa scene.js."""
import json,os,sys,subprocess
from PIL import Image
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SP=ROOT+'/assets/art/out/sprites/'; OUT=ROOT+'/assets/art/preview_v17/'; os.makedirs(OUT,exist_ok=True)
T=16
def md():
    p='/tmp/mapdata_v17.json'
    js=("const fs=require('fs'),vm=require('vm');const x={};vm.createContext(x);vm.runInContext(fs.readFileSync('%s/js/data/mapdata.js','utf8').replace(/^const /gm,'var '),x);"
        "const D=x.MAPDATA;fs.writeFileSync('%s',JSON.stringify({W:D.W,H:D.H,M:D.M,B:D.B,X:D.X}))")%(ROOT,p)
    subprocess.check_call(['node','-e',js]); return json.load(open(p))
D=md(); W,H=D['W'],D['H']; M=[[ '0123456789ab'.index(c) for c in r] for r in D['M']]; X=D['X']
def img(n): return Image.open(SP+n+'.png').convert('RGBA')
PIECE={m:img('m_br_%02d'%m) for m in range(1,16)}; PIECE_C=[img('m_br_15c1'),img('m_br_15c2')]
def isbrick(x,y): return 0<=x<W and 0<=y<H and M[y][x]==8
def dualgrid(cellfn,x0,y0,x1,y1,variants=True):
    """vẽ lớp gạch dual-grid cho ô [x0,x1)×[y0,y1); trả (ảnh RGBA, số mảnh theo mask)"""
    L=Image.new('RGBA',((x1-x0)*T,(y1-y0)*T),(0,0,0,0)); cnt={}
    for j in range(y0,y1+1):
        for i in range(x0,x1+1):
            m=(1 if cellfn(i-1,j-1) else 0)|(2 if cellfn(i,j-1) else 0)|(4 if cellfn(i-1,j) else 0)|(8 if cellfn(i,j) else 0)
            if not m: continue
            cnt[m]=cnt.get(m,0)+1; t=PIECE[m]
            if m==15 and variants:
                h=((i*73856093)^(j*19349663))&0xffffffff
                if h%12==0: t=PIECE_C[0]
                elif h%12==6: t=PIECE_C[1]
            L.alpha_composite(t,((i-x0)*T-8,(j-y0)*T-8)) if (i-x0)*T-8>=0 and (j-y0)*T-8>=0 else L.alpha_composite(t.crop((max(0,8-(i-x0)*T),max(0,8-(j-y0)*T),16,16)),(max(0,(i-x0)*T-8),max(0,(j-y0)*T-8)))
    return L,cnt

def village(out_name='lang_hoa_an_x1.png',box=(250,185,420,320)):
    """vẽ làng Hòa An: nền cỏ/nước + gạch dual-grid + 11 nhà (không vẽ cây/trang trí để nhìn rõ đường–nhà)"""
    F=json.load(open(ROOT+'/data/feature_manifest.json'))
    SPRN={'F1_NHA_NOC_NGUA_1':'noc','F6_NHA_CU_SAC':'noc','F16_NHA_NOC_NGUA_2':'noc','F4_NHA_BAT_DAN_1':'bat','F8_NHA_BAT_DAN_2':'bat','F7_NHA_CHU_DINH_2':'dinh','E4_NHA_CHU_DINH_1':'dinh','F9_NHA_ONG_CA_NHI_NGUU':'la','F5_NHA_ONG_NAM_GIAO':'la2','F10_NHA_TREN_COC_2':'coc','F14_NHA_TREN_COC_1':'coc'}
    x0,y0,x1,y1=box; base=Image.new('RGBA',((x1-x0)*T,(y1-y0)*T)); g=img('m_g0'); w=img('m_wp0')
    for y in range(y0,y1):
        for x in range(x0,x1): base.paste(w if M[y][x]==2 else g,((x-x0)*T,(y-y0)*T))
    L,_=dualgrid(isbrick,x0,y0,x1,y1); base.alpha_composite(L); hs=[]
    for f in F:
        if f['id'] in SPRN:
            sp=img('m_h_'+SPRN[f['id']]); cx=f['position_norm']['u']*1840/4; cy=f['position_norm']['v']*1408/4
            hs.append((cy,sp,int((cx-sp.width/T/2)*T)-x0*T,int((cy-sp.height/T/2)*T)-y0*T))
    for cy,sp,px,py in sorted(hs,key=lambda a:a[0]): base.alpha_composite(sp,(px,py))
    base.save(OUT+out_name); return base

if __name__=='__main__':
    village()
    rep={}
    # 1) 15 mảnh ×8
    s=Image.new('RGBA',(16*8*8+90,16*8*2+30),(122,160,86,255))
    for m in range(1,16):
        t=PIECE[m].resize((128,128),Image.NEAREST); s.alpha_composite(t,(((m-1)%8)*138+5,((m-1)//8)*138+5))
    s.save(OUT+'br_pieces_x8.png')
    # 2) tileable: ruột 15 — so viền trái/phải, trên/dưới
    t=PIECE[15]; px=t.load(); MO=(0x6b,0x47,0x42,255)
    def seam(a,b,rows_ok=()):
        """đếm lỗi ở mối ghép: (1) hai viên khác sắc độ dính nhau không qua mạch vữa; (2) mạch vữa dày 2 px (trừ mạch ngang liền: rows_ok)"""
        bad=0
        for k in range(16):
            pa,pb=a[k],b[k]
            if pa==MO and pb==MO and k not in rows_ok: bad+=1
            elif pa!=MO and pb!=MO and pa!=pb: bad+=1
        return bad
    HJ={y for y in range(16) if y%4==3}
    lr=seam([px[15,y] for y in range(16)],[px[0,y] for y in range(16)],HJ)
    tb=seam([px[x,15] for x in range(16)],[px[x,0] for x in range(16)],set(range(16)))
    for n,tt in (('c1',PIECE_C[0]),('c2',PIECE_C[1])):
        q=tt.load(); lr+=seam([q[15,y] for y in range(16)],[px[0,y] for y in range(16)],HJ); tb+=seam([q[x,15] for x in range(16)],[px[x,0] for x in range(16)],set(range(16)))
    rep['tileable_loi_trai_phai']=lr; rep['tileable_loi_tren_duoi']=tb
    # 3) trường ngẫu nhiên: kiểm ruột phủ kín, mép nhất quán
    import random; random.seed(7); N=14; F=[[random.random()<.55 for _ in range(N)] for _ in range(N)]
    cf=lambda x,y:0<=x<N and 0<=y<N and F[y][x]
    L,cnt=dualgrid(cf,0,0,N,N,False); L.save(OUT+'br_random_test_x1.png')
    holes=0; ghost=0
    for y in range(N):
        for x in range(N):
            a=L.getpixel((x*T+8,y*T+8))[3] if x*T+8<L.width and y*T+8<L.height else 0
            if F[y][x] and a!=255: holes+=1
            if not F[y][x] and a==255: ghost+=1
    rep['random_test']={'o_gach_ho':holes,'o_trong_bi_phu':ghost,'so_manh_theo_mask':dict(sorted(cnt.items()))}
    # 4) toàn bản đồ: lớp gạch dual-grid ở 16 px/ô, thu 1/4 để overlay lên sơ đồ chuẩn
    L,cnt=dualgrid(isbrick,0,0,W,H); rep['ban_do']={'o_gach(M==8)':sum(isbrick(x,y) for x in range(W) for y in range(H)),'manh':sum(cnt.values())}
    L.save('/tmp/br_full.png')
    ref=Image.open(ROOT+'/data/ref/01_master_plan_reference.png').convert('RGBA').crop((40,40,1880,1448))
    lay=L.resize((W*4,H*4),Image.BOX); ov=ref.copy(); ov.alpha_composite(lay)
    json.dump(rep,open('/tmp/preview_report.json','w'),ensure_ascii=False,indent=1); print(json.dumps(rep,ensure_ascii=False,indent=1))
    ov.save(OUT+'overlay_gach_tren_so_do.png'); print('ok',ov.size)
