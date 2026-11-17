#!/usr/bin/env python3
"""Dựng lưới bản đồ Map 01 (v3, tỉ lệ gấp đôi) từ sơ đồ chuẩn (cẩm nang bản đồ pixel v2.0, 05/11/2026).
Đầu vào : data/ref/01_master_plan_reference.png (1840x1408, đã cắt khung)
Đầu ra  : js/data/mapdata.js (lưới 460x352 ô, 1 ô = 4 px sơ đồ) + data/ref/overlay_check.png
Chạy    : python3 tools/build_map.py      (cần numpy, scipy, Pillow)
Ô: col = x_sơ_đồ/4, row = y_sơ_đồ/4  (x,y theo ảnh đã cắt khung). Gấp đôi bản v2 (8 px/ô) để map rộng, dễ khám phá.
Loại ô: 0 cỏ · 1 viền đất · 2 nước · 3 lề vàng · 4 cỏ đậm (khu mộ) · 5 sân lát · 6 ngoài ranh · 7 cầu (nhịp ngang)
        8 lối đi · 9 đường nhựa · a(10) lô trống ngoài ranh · b(11) cầu (nhịp dọc)
Sông/kênh: định nghĩa bằng đường tim (px sơ đồ) + bề rộng, trải liền một mạng duy nhất; chỗ lối đi cắt nước đặt CẦU (BRIDGES)."""
import numpy as np, os, math, json
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
S=2; C,R=230*S,176*S; PX=4          # PX: px sơ đồ / ô
plan=Image.open(ROOT+'/data/ref/01_master_plan_reference.png').convert('RGB')
A=np.asarray(plan).astype(int); r_,g_,b_=A[...,0],A[...,1],A[...,2]; lum=(r_+g_+b_)/3
cls=np.zeros(r_.shape,np.uint8)
cls[(g_>r_+12)&(g_>b_+4)&(lum<170)]=1
cls[(b_>r_+22)&(b_>g_+4)&(lum>110)]=2
cell=lambda k:(cls==k).reshape(R,PX,C,PX).mean((1,3))
GREEN,WATER=cell(1),cell(2)
M=np.full((R,C),6,np.uint8); FREE=np.zeros((R,C),bool)
yy,xx=np.mgrid[0:R,0:C]
o2=lambda P:[(a*S,b*S) for a,b in P]            # toạ độ ô của bản v2 -> ô mới
pp=lambda P:[(x/PX,y/PX) for x,y in P]          # px sơ đồ -> ô
def poly_mask(P,sc=4):
    im=Image.new('L',(C*sc,R*sc),0);ImageDraw.Draw(im).polygon([(a*sc,b*sc) for a,b in P],fill=1)
    return np.asarray(im)[sc//2::sc,sc//2::sc].astype(bool)
RIVER=np.zeros((R,C),bool); CROSS=[]; DANG_IN=[]; DANG_OUT=[]; STUBS=[]   # RIVER: chỉ kênh/sông (không gồm hồ); CROSS: chỗ lối đi cắt kênh -> cầu
def crossings(P,w):
    """Chỗ một lối đi (đường tim P, bề rộng w ô) đi qua kênh.
    - cắt trọn trong một nét: cầu ngay.
    - nét kết thúc trong nước (DANG_IN) hoặc bắt đầu từ trong nước (DANG_OUT): chờ ghép với nét đối diện ở bờ bên kia cùng hướng (ghép ở cuối).
    Nét chết hẳn trong nước, không có nét tiếp bên kia, thì KHÔNG có cầu."""
    for (p0,p1,q) in ((P[1],P[0],P[0]),(P[-2],P[-1],P[-1])) if len(P)>1 else ():
        L=math.hypot(q[0]-p0[0],q[1]-p0[1]) or 1; STUBS.append((q[0],q[1],(q[0]-p0[0])/L,(q[1]-p0[1])/L,w))   # đầu mút lối đi + hướng đi ra
    for (a,b),(c,e) in zip(P,P[1:]):
        n=max(2,int(math.hypot(c-a,e-b)*4)); run=None; runs=[]
        for k in range(n+1):
            t=k/n; xi,yi=int(a+(c-a)*t),int(b+(e-b)*t)
            wet=0<=yi<R and 0<=xi<C and RIVER[yi,xi]
            if wet and run is None: run=[t,t]
            elif wet: run[1]=t
            elif run is not None: runs.append(run); run=None
        if run is not None: runs.append(run)
        L=math.hypot(c-a,e-b) or 1; ux,uy=(c-a)/L,(e-b)/L
        for r0,r1 in runs:
            p0=(a+(c-a)*r0,b+(e-b)*r0); p1=(a+(c-a)*r1,b+(e-b)*r1)
            if r0>0 and r1<1: CROSS.append((*p0,*p1,w))
            elif r0>0 and r1>=1: DANG_IN.append((*p0,ux,uy,w))     # đi vào nước rồi hết nét
            elif r0<=0 and r1<1: DANG_OUT.append((*p1,ux,uy,w))    # nét bắt đầu giữa nước, đi lên bờ
def thick(P,w,t,only=None,free=False):
    if t in (5,8): crossings(P,w)
    im=Image.new('L',(C*4,R*4),0);d=ImageDraw.Draw(im)
    for (a,b),(c,e) in zip(P,P[1:]): d.line([(a*4+2,b*4+2),(c*4+2,e*4+2)],fill=1,width=max(1,int(w*4)))
    for (a,b) in P: d.ellipse([a*4+2-w*2,b*4+2-w*2,a*4+2+w*2,b*4+2+w*2],fill=1)
    m=np.asarray(im).reshape(R,4,C,4).max((1,3)).astype(bool)
    if only is not None: m&=np.isin(M,only)
    M[m]=t
    if free: FREE[m]=True
    return m
def disc(cx,cy,rx,ry,t,only=None):
    m=((xx+.5-cx)/rx)**2+((yy+.5-cy)/ry)**2<=1
    if only is not None: m&=np.isin(M,only)
    M[m]=t; return m
# ---- 1. ranh khu (đa giác đo trên viền vàng; đơn vị cũ ô*4 -> ô mới /2)
SITE=[(a/2,b/2) for a,b in [(360,148),(545,148),(575,215),(575,240),(548,320),(600,350),(843,460),(770,595),(750,620),(700,665),(620,655),(575,640),(340,600),(310,598),(185,575),(165,545),(190,415),(205,325),(225,240),(355,285)]]
inside=poly_mask(SITE); M[inside]=0
edge=inside&~ndi.binary_erosion(inside,np.ones((3,3)),iterations=2)
# ---- 2. ngoài ranh: đường nhựa quanh khu, đường Phạm Hữu Lầu, đường xe khách, vòng xoay, lô trống
dist=ndi.distance_transform_edt(~inside)
ring=(~inside)&(dist>=4)&(dist<=11)&~((xx>276)&(yy<104))
M[ring]=9
thick(pp([(280,243),(450,285),(620,325),(705,350)]),7,9)                       # đường Phạm Hữu Lầu
thick(pp([(705,350),(738,400),(745,500)]),7,9)                                  # nhánh xe khách vào Cổng số 3
disc(72,294,7.5,7.5,9,[6,9]); disc(72,294,3.2,3.2,0,[9])                        # vòng xoay góc dưới trái (trên sơ đồ)
lot=poly_mask([(a*2,b*2) for a,b in [(137,176),(285,170),(288,228),(165,205)]]); M[lot&~inside]=10
M[edge]=3
# ---- 3. khu mộ (cỏ đậm) lấy từ màu trên sơ đồ
g=GREEN>.35; g[:, :192]=False; g[:, 258:]=False; g[:82,:]=False; g[214:,:]=False; g[:92,:200]=False
g=ndi.binary_closing(g,np.ones((3,3)),iterations=6); g=ndi.binary_fill_holes(g); g=ndi.binary_opening(g,np.ones((3,3)),iterations=2)
lab,n=ndi.label(g)
if n: g=lab==(1+np.argmax(ndi.sum(g,lab,range(1,n+1))))
M[g&(M==0)]=4
# ---- 4. nước: Hồ Sen (màu), mặt nước khu B (đa giác đo tay), Hồ Sao, mạng kênh liền
wm=WATER>.3; lab,n=ndi.label(wm,structure=np.ones((3,3)))
def comp_in(c0,c1,r0,r1,minsize):
    out=np.zeros_like(wm)
    for i in range(1,n+1):
        ys,xs=np.where(lab==i)
        if len(ys)>=minsize and xs.min()>=c0 and xs.max()<=c1 and ys.min()>=r0 and ys.max()<=r1: out|=lab==i
    return out
OUT=[(58.3,91.2),(59.7,87),(63.8,84.5),(69.7,83.3),(74.7,84.5),(77.2,87),(77.7,92.8),(76.3,97.8),(73,101.2),(68,102.8),(63.8,101.2),(60.5,97.8),(58.3,94.5)]
ISL=[(66.3,92),(70.5,89.5),(73.8,90.7),(74.3,94.5),(72.2,97.3),(68.8,97.8),(66.3,96.2)]
waterB=poly_mask(o2(OUT))&~poly_mask(o2(ISL))
hosen=ndi.binary_fill_holes(ndi.binary_closing(comp_in(172,228,212,266,800),np.ones((3,3)),iterations=4))
hosen=ndi.gaussian_filter(hosen.astype(float),2.2)>.5
for m in (waterB,hosen): M[m&inside&np.isin(M,[0,3,4])]=2
def chaikin(P,n=2):
    for _ in range(n):
        Q=[P[0]]
        for a,b in zip(P,P[1:]): Q+= [tuple(.75*u+.25*v for u,v in zip(a,b)),tuple(.25*u+.75*v for u,v in zip(a,b))]
        Q.append(P[-1]); P=Q
    return P
import csv as _csv
# công trình có chân trên mặt đất (w,h theo ô, đúng kích thước sprite trong game) — kênh KHÔNG được đi xuyên qua
FOOT={'A3_DEN_THO':(12,12),'B1_NHA_TRUNG_BAY':(22.5,18),'D2_NHA_SAN':(12,9),'D4_BAN_QUAN_LY':(14,7),'F1_NHA_NOC_NGUA_1':(9,9),'F4_NHA_BAT_DAN_1':(9,9),'F5_NHA_ONG_NAM_GIAO':(9,9),'F6_NHA_CU_SAC':(9,9),'F7_NHA_CHU_DINH_2':(9,9),'F8_NHA_BAT_DAN_2':(9,9),'F9_NHA_ONG_CA_NHI_NGUU':(9,9),'F16_NHA_NOC_NGUA_2':(9,9),'E4_NHA_CHU_DINH_1':(9,9),'F10_NHA_TREN_COC_2':(12,9),'F14_NHA_TREN_COC_1':(12,9),
      'A7_WC_DEN':(3.4,3.4),'B4_WC':(3.4,3.4),'C2_WC':(3.4,3.4),'E5_WC':(3.4,3.4),'F12_WC':(3.4,3.4),'F15_CAFE_HOA_AN':(3.5,3.5),'C3_DIEM_DUNG_CHAN':(4.5,4.5),'E2_DIEM_DUNG_CHAN':(4.5,4.5),'F11_DIEM_DUNG_CHAN':(4.5,4.5),'F13_KHU_AM_THUC':(9,7.5),'C4_QUAY_LUU_NIEM':(4.5,4.5),'D3_QUAY_LUU_NIEM':(4.5,4.5),'E3_QUAY_LUU_NIEM':(4.5,4.5)}
FOOT_MULTI={'C1_DIEM_DUNG_CHAN':((4.5,4.5),[(-44,-28),(0,-28),(0,10)]),'F3_DIEM_DUNG_CHAN':((4.5,4.5),[(0,-22),(2,22)])}
BUILD=[]   # (x0,y0,x1,y1) theo ô
for _r in _csv.DictReader(open(ROOT+'/data/ref/03_feature_manifest.csv',encoding='utf-8-sig')):
    _x,_y=(float(_r['x_px'])-40)/PX,(float(_r['y_px'])-40)/PX
    if _r['id'] in FOOT: _w,_h=FOOT[_r['id']]; BUILD.append((_x-_w/2,_y-_h/2,_x+_w/2,_y+_h/2))
    if _r['id'] in FOOT_MULTI:
        (_w,_h),_o=FOOT_MULTI[_r['id']]
        for _dx,_dy in _o: BUILD.append((_x+_dx/PX-_w/2,_y+_dy/PX-_h/2,_x+_dx/PX+_w/2,_y+_dy/PX+_h/2))
def avoid(P,margin=2.0):
    """Đẩy đường tim kênh ra khỏi mọi công trình (chừa margin ô + nửa bề rộng kênh), rồi làm mượt để kênh uốn tự nhiên quanh nhà."""
    P=[list(p) for p in P]
    def push():
        n=0
        for q in P[1:-1]:
            for x0,y0,x1,y1 in BUILD:
                m=margin+q[2]/2
                if x0-m<q[0]<x1+m and y0-m<q[1]<y1+m:
                    d=[q[0]-(x0-m),(x1+m)-q[0],q[1]-(y0-m),(y1+m)-q[1]]; k=d.index(min(d))
                    if k==0: q[0]=x0-m-.3
                    elif k==1: q[0]=x1+m+.3
                    elif k==2: q[1]=y0-m-.3
                    else: q[1]=y1+m+.3
                    n+=1
        return n
    for _ in range(14):
        push()
        for i in range(1,len(P)-1):
            for j in (0,1): P[i][j]=.25*P[i-1][j]+.5*P[i][j]+.25*P[i+1][j]
    for _ in range(6): push()
    return [tuple(p) for p in P]
def river(P,only=(0,3,4,5,8,1)):
    P=avoid(chaikin([(x/PX,y/PX,w/PX) for x,y,w in P],3)); m=np.zeros((R,C),bool)
    for (a,b,wa),(c,d,wb) in zip(P,P[1:]):
        L=max(1,int(math.hypot(c-a,d-b)*2))
        for k in range(L+1):
            t=k/L; cx,cy,rad=a+(c-a)*t,b+(d-b)*t,(wa+(wb-wa)*t)/2
            x0,x1,y0,y1=int(cx-rad-1),int(cx+rad+2),int(cy-rad-1),int(cy+rad+2)
            sl=(slice(max(0,y0),y1),slice(max(0,x0),x1))
            m[sl]|=((xx[sl]+.5-cx)**2+(yy[sl]+.5-cy)**2)<=rad*rad
    m&=np.isin(M,only)&inside; M[m]=2; RIVER[:]|=m; return m
# kênh chính: từ phía trên (cạnh Chùa Hòa Long) chảy xuống dọc phía tây làng, qua Cổng/cầu 48, kéo tới bãi xe
MAIN=[(1110,402,26),(1100,470,30),(1088,560,30),(1078,640,30),(1060,700,28),(1035,750,22),(1025,800,20),(1018,850,20),(1008,900,18),(1008,1000,18),(1010,1100,18),(1008,1160,16),(1000,1220,14),(998,1262,12)]
# nhánh vòng quanh cụm nhà (tách từ kênh chính phía trên, khép lại vào kênh chính phía dưới)
LOOP=[(1060,705,20),(1125,732,20),(1200,752,20),(1260,760,20),(1310,767,20),(1345,790,20),(1355,830,20),(1362,870,20),(1388,915,20),(1415,945,20),(1432,975,20),(1428,1015,20),(1405,1045,20),(1375,1078,20),(1340,1108,20),(1310,1132,20),(1270,1142,20),(1240,1132,20),(1220,1108,20),(1195,1082,20),(1170,1058,20),(1140,1032,20),(1110,1012,20),(1070,996,20),(1030,988,20),(1008,986,20)]
POND=[(1005,862),(1098,858),(1106,888),(1005,906)]                               # ao nhỏ cạnh Nhà bát dần 1
river(MAIN); river(LOOP); _pm=poly_mask(pp(POND))&inside&np.isin(M,[0,3,4,5,8,1]); M[_pm]=2; RIVER[:]|=_pm
_rl,_rn=ndi.label(RIVER)   # 4-liên thông: mọi kênh/ao phải LIỀN thành một mạng (không hở dù chỉ một dải cỏ)
assert _rn==1,('kênh/ao bị tách thành %d khối'%_rn,[int((_rl==i).sum()) for i in range(1,_rn+1)])
_rd=ndi.distance_transform_edt(~RIVER)
# Hồ Sao: sân tròn có bậc, hồ ngôi sao 5 cánh ở giữa
HS=(218,166)
disc(*HS,16.4,16.4,5,[0,4]); disc(*HS,14,14,4,[5]); disc(*HS,11.6,11.6,5,[4])
star=Image.new('L',(C*8,R*8),0);cx,cy=HS[0]*8+4,HS[1]*8+4
pts=[(cx+(10.0*8 if k%2==0 else 4.2*8)*math.sin(k*math.pi/5),cy-(10.0*8 if k%2==0 else 4.2*8)*math.cos(k*math.pi/5)) for k in range(10)]
ImageDraw.Draw(star).polygon(pts,fill=1); sm=np.asarray(star).reshape(R,8,C,8).mean((1,3))>.5; M[sm]=2
# ---- 5. sân lát, lối đi (theo trục và vị trí tương đối trên sơ đồ)
Wd=lambda w:max(2,round(w*1.5))
WATERISH=[2]
def P5(P,w=2,**k): return thick(o2(P),Wd(w),5,only=[0,4,5,3,1],**k)
def _smooth(P,n=3):
    P=[(float(x),float(y)) for x,y in P]
    for _ in range(n):
        Q=[P[0]]
        for a,b in zip(P,P[1:]): Q+=[(.75*a[0]+.25*b[0],.75*a[1]+.25*b[1]),(.25*a[0]+.75*b[0],.25*a[1]+.75*b[1])]
        P=Q+[P[-1]]
    return P
LANEM=np.zeros((R,C),bool)   # các ô lối đất trong làng (vẽ bằng tile đất nện thay vì gạch lát)
WOB=.9
def lane(P,w,only=(0,4,5,3,1,8),seed=0):
    """Lối đi làng kiểu thật: góc được bo tròn, đường uốn nhẹ theo sóng chậm (biên độ ~1 ô), bề rộng lúc thon lúc phình;
    đầu mút, ngã ba và chỗ gần kênh được ghìm thẳng để nối khít và để cầu vẫn thẳng. Cầu/đầu mút tính theo đường tim gốc P."""
    crossings(P,w)
    Q=_smooth(P,3); Ls=[0.]
    for a,b in zip(Q,Q[1:]): Ls.append(Ls[-1]+math.hypot(b[0]-a[0],b[1]-a[1]))
    tot=Ls[-1] or 1.; rr=np.random.default_rng(seed+int(P[0][0]*7+P[0][1]*13)); ph=rr.random(4)*6.283
    pts=[];ws=[]
    for i,(x,y) in enumerate(Q):
        a=Q[max(0,i-1)]; b=Q[min(len(Q)-1,i+1)]; tx,ty=b[0]-a[0],b[1]-a[1]; tl=math.hypot(tx,ty) or 1.; nx,ny=-ty/tl,tx/tl
        s_=Ls[i]; xi,yi=min(C-1,max(0,int(x))),min(R-1,max(0,int(y)))
        tp=min(1.,s_/7,(tot-s_)/7,_rd[yi,xi]/8)
        tp=tp*tp*(3-2*tp)
        off=tp*WOB*(.62*math.sin(6.283*s_/19+ph[0])+.38*math.sin(6.283*s_/8.5+ph[1]))
        pts.append((x+nx*off,y+ny*off)); ws.append(w*(1+.1*tp*math.sin(6.283*s_/13+ph[2])))
    im=Image.new('L',(C*4,R*4),0); d=ImageDraw.Draw(im)
    for (a,b),(c,e),w1 in zip(pts,pts[1:],ws): d.line([(a*4+2,b*4+2),(c*4+2,e*4+2)],fill=1,width=max(1,int(w1*4)))
    for (a,b),w1 in zip(pts,ws): d.ellipse([a*4+2-w1*2,b*4+2-w1*2,a*4+2+w1*2,b*4+2+w1*2],fill=1)
    m=np.asarray(im).reshape(R,4,C,4).max((1,3)).astype(bool)&np.isin(M,only)
    for x0,y0,x1,y1 in BUILD:
        if x1-x0>=8: m[int(y0):int(y1)+1,int(x0):int(x1)+1]=False                  # lối đi không đè lên nhà/công trình lớn (chòi, bốt nhỏ nằm ngay trên lối nên không cắt)
    M[m]=8; LANEM[:]|=m; return m
def P8(P,w=2):
    Pc=o2(P)
    if w<=2 and min(p[0] for p in Pc)>=276: return lane(Pc,Wd(w))                 # lối trong làng: hữu cơ
    return thick(Pc,Wd(w),8,only=[0,4,5,3,1,8])                                  # trục/lối của khu trang nghiêm: giữ thẳng
P8([(53,105),(127,105)],3)                                      # trục ngang Cổng 4 → Cổng vào mộ → Cổng/cầu 48
P8([(93,58),(93,105)],3)                                        # trục dọc Cổng 3 xuống
P8([(81,146),(81,106)],2)                                       # lối bộ Cổng 1 đi lên
P5([(109,103),(109,60)],2)                                      # trục Cổng vào mộ → Đền thờ → Hồ Sao → Mộ cụ
P5([(109,97),(118,97)],2); disc(118*S,97*S,3.6*S,3.6*S,5,[0,4,5])
disc(109*S,70*S,7.5*S,3.4*S,5,[0,4,5])
P8([(109,106),(111,114)],2); P8([(109,134),(109,146)],2); P8([(81,142),(150,142)],2)
for (cx_,cy_,rx,ry) in ((114,124,9,9),):                         # vành lối tròn bên phải Hồ Sen (Nhà sàn)
    m=((xx+.5-cx_*S)/(rx*S))**2+((yy+.5-cy_*S)/(ry*S))**2; M[(m<=1)&(m>=.6)&np.isin(M,[0,4])]=8
for (cx_,cy_,rx,ry) in ((70,122,10,12),(60,131,6,6)):           # khu C: lối cong nhiều thùy
    m=((xx+.5-cx_*S)/(rx*S))**2+((yy+.5-cy_*S)/(ry*S))**2; M[(m<=1)&(m>=.84)&np.isin(M,[0,4])]=8
P8([(60,124),(81,124)],1.5)
for (cx_,cy_,rx,ry) in ((78,80,14,9),):                          # khu B: lối vòng
    m=((xx+.5-cx_*S)/(rx*S))**2+((yy+.5-cy_*S)/(ry*S))**2; M[(m<=1)&(m>=.8)&np.isin(M,[0,4])]=8
P8([(60,92),(78,98),(93,98)],1.5); P8([(60,80),(66,80)],1.5)
# làng Hòa An
disc(140*S,103*S,6*S,6*S,5,[0,3,5,8,1]); disc(140*S,103*S,3.2*S,3.2*S,8,[5])
P8([(127,105),(139,105)],3)
P8([(139,108),(139,113),(135,114)],2); P8([(139,113),(142,125),(146,129)],2); P8([(146,129),(156,131)],2)
P8([(156,131),(160,134),(166,134),(168,124)],2); P8([(183,123),(183,131),(179,132)],2)   # lối vào Nhà Bát Dần 2 từ đường phía đông (không còn lối chéo cắt kênh)
P8([(166,134),(166,139)],2); P8([(168,118),(166,111),(166,105)],2)
P8([(151,142),(151,159)],2); P8([(151,146),(183,146)],2); P8([(183,146),(188,150)],2)
# bên phải kênh vòng: lối nối qua cầu tới các công trình rìa phải
P8([(178,113),(187,113)],2); P8([(186,126),(188,113)],2)
lane(pp([(1425,905),(1496,904)]),Wd(2),only=(0,3,8)); lane(pp([(1466,984),(1568,984),(1616,936)]),Wd(2),only=(0,3,8))
lane(pp([(1410,1072),(1536,1072),(1530,1140),(1504,1208)]),Wd(2),only=(0,3,8)); lane(pp([(1395,832),(1416,832)]),Wd(2),only=(0,3,8))
lane(pp([(1530,1140),(1496,1184)]),Wd(2),only=(0,3,8))
# ---- 6. cầu: TỰ DỰNG ở mọi chỗ một lối đi cắt qua kênh (CROSS, ghi nhận trong thick()) và CHỈ ở đó.
#      Không còn danh sách cầu đặt tay: lối đi chết bên bờ không có cầu; cầu luôn nối hai đoạn đường cùng một lối.
# lối mòn trên bãi cỏ giữa làng, đi vòng qua từng điểm Hòa An (đường đất hẹp, uốn) và nối với đường làng ở phía tây
lane([(279,243),(285,239),(291,236),(297,235.5),(303,236),(309,237)],2.2,only=(0,4,1,3),seed=5)
lane([(309,237),(313,243),(316,248),(317,254)],2.2,only=(0,4,1,3),seed=6)
lane([(317,254),(311,258.5),(304,259)],2.2,only=(0,4,1,3),seed=7)
# ---- 5b. lối đi nào kết thúc sát bờ kênh thì phải đi tiếp sang bờ bên kia tới đường có sẵn (rồi mới có cầu); không có đường bên kia thì lối đi dừng ở bờ như một bến, KHÔNG có cầu cụt
_rd=ndi.distance_transform_edt(~RIVER)
_PATHS=lambda: np.isin(M,[5,8])
# lối đi phía đông kênh vòng vốn dẫn về cụm nhà ở trong vòng: điểm dừng chân góc trên, nhà mái lá, khu ẩm thực, nhà mái lá phía dưới, lối cổng 2 lên cụm nhà
LINK_OK=[(348.8,208.0),(356.2,226.2),(366.5,246.0),(352.5,268.0),(302.0,284.0)]
LINKS=[]
for (sx,sy,ux,uy,w) in list(STUBS):
    xi,yi=int(sx),int(sy)
    if not(0<=yi<R and 0<=xi<C) or RIVER[yi,xi] or _rd[yi,xi]>9 or sx<300 or not _PATHS()[yi,xi]: continue
    if not any(math.hypot(sx-ax,sy-ay)<.8 for ax,ay in LINK_OK): continue                            # chỉ nối các lối đi vốn dẫn sang bờ bên kia (không đoán, không bịa đường mới)
    st=0; hit=None; wet=False; run_in=False; t=1.0
    while t<34:
        x,y=sx+ux*t,sy+uy*t; xj,yj=int(x),int(y)
        if not(0<=yj<R and 0<=xj<C): break
        if RIVER[yj,xj]:
            if not wet and t>16: break                         # nước phải ở ngay trước mặt (<=10 ô), không nối xa
            wet=True; run_in=True
        elif wet:
            for dd in (0,-1,1,-2,2):                               # dung sai ngang 2 ô: lối đi bên kia có thể lệch hàng một chút
                x2,y2=x-uy*dd,y+ux*dd; xk,yk=int(x2),int(y2)
                if 0<=yk<R and 0<=xk<C and _PATHS()[yk,xk]: hit=(x2,y2); break
            if hit: break
        elif not wet and _PATHS()[yj,xj] and t>3: break           # gặp đường trước khi tới nước: đã nối rồi
        if wet and not RIVER[yj,xj] and M[yj,xj] in (6,9,10): break
        t+=.5
    if hit and wet: LINKS.append((sx,sy,hit[0],hit[1]) if abs(hit[1]-sy)<.6 or abs(hit[0]-sx)<.6 else (sx,sy,hit[0]*abs(uy)+sx*abs(ux),hit[1]*abs(ux)+sy*abs(uy),hit))
for l in LINKS:
    if len(l)==4: thick([(l[0],l[1]),(l[2],l[3])],3,8,only=[0,3,5,8,1,4])
    else: sx,sy,mx,my,h=l; thick([(sx,sy),(mx,my),(h[0],h[1])],3,8,only=[0,3,5,8,1,4])   # đi thẳng qua kênh rồi nhích ngang vào đường bên kia
print('nối lối đi qua kênh:',len(LINKS),[[round(v,1) for v in l[:4]] for l in LINKS])
for (xa,ya,ux,uy,w) in DANG_IN:                       # ghép nét vào-nước với nét ra-nước cùng hướng ở bờ bên kia (cách tối đa 14 ô)
    best=None
    for (xb,yb,vx,vy,w2) in DANG_OUT:
        dx,dy=xb-xa,yb-ya; dist=math.hypot(dx,dy)
        if 1<dist<=14 and ux*vx+uy*vy>.8 and (dx*ux+dy*uy)/dist>.8 and (best is None or dist<best[0]): best=(dist,xb,yb,w2)
    if best: CROSS.append((xa,ya,best[1],best[2],max(w,best[3])))
BRIDGES=[]; _seen=[]
for x1,y1,x2,y2,w in CROSS:
    mx,my=(x1+x2)/2,(y1+y2)/2
    if any(math.hypot(mx-a,my-b)<3 for a,b in _seen): continue
    _seen.append((mx,my)); vert=abs(y2-y1)>abs(x2-x1); wd=max(5.0,w+2)
    if vert: a,b,c,d=mx,min(y1,y2)-1.5,mx,max(y1,y2)+1.5
    else:    a,b,c,d=min(x1,x2)-1.5,my,max(x1,x2)+1.5,my
    thick([(a,b),(c,d)],wd,11 if vert else 7,only=[2,0,3,4,5,8,1],free=True)
    BRIDGES.append([a,b,c,d,wd,1 if vert else 0])
print('cầu tự dựng:',len(BRIDGES),[[round(t,1) for t in b[:4]] for b in BRIDGES])
# ---- kiểm tra ràng buộc thực tế: (1) không công trình nào đứng trên nước, (2) mỗi cầu có đường ở CẢ HAI đầu
_bad=[(round(x0),round(y0)) for x0,y0,x1,y1 in BUILD if (M[int(y0):int(y1)+1,int(x0):int(x1)+1]==2).any()]
assert not _bad,('công trình đè lên nước',_bad)
_pm=np.isin(M,[5,8,9])
for a_,b_,c_,d_,w_,v_ in BRIDGES:
    L_=math.hypot(c_-a_,d_-b_); ux_,uy_=(c_-a_)/L_,(d_-b_)/L_
    for sg in (-1,1):
        ex,ey=(a_ if sg<0 else c_)+ux_*sg*3,(b_ if sg<0 else d_)+uy_*sg*3
        assert _pm[max(0,int(ey)-3):int(ey)+4,max(0,int(ex)-3):int(ex)+4].any(),('cầu cụt (không có đường ở một đầu)',(round(a_,1),round(b_,1),round(c_,1),round(d_,1)))
print('kiểm tra: không nhà nào trên nước; mọi cầu có đường hai đầu')
# ---- 7. cổng
GATES={'G1_CONG_1':(81,147,2,1),'G2_CONG_2':(151,160,2,1),'G3_CONG_3':(92,60,1,1),'G4_CONG_4':(53,105,1,2),'A5_CONG_MO':(109,104,2,1),'GX_CONG_KHONG_NHAN':(128,105,1,2),'GA_CONG_AM_THUC':(188,151,2,1)}
for k,(gc,gr,a,b) in GATES.items():
    if k=='GX_CONG_KHONG_NHAN': continue
    gc,gr,a,b=gc*S,gr*S,a*S,b*S
    sl=(slice(gr-b,gr+b+1),slice(gc-a,gc+a+1)); M[sl]=np.where(np.isin(M[sl],[2,7,11]),M[sl],5); FREE[sl]=True
BLK=np.isin(M,[2,3,6,9,10])&~FREE
# ---- 8. cây: chỉ ở nơi sơ đồ có chấm xanh (quanh Hồ Sen, cạnh nước khu B)
gd=(GREEN>.18)&(M!=4)&~np.isin(M,[2,6,9,10])
lab2,n2=ndi.label(gd,structure=np.ones((3,3))); TREES=[]
for i in range(1,n2+1):
    ys,xs=np.where(lab2==i)
    if 2<=len(ys)<=28 and ((172<=xs.mean()<=244 and 212<=ys.mean()<=272) or (110<=xs.mean()<=190 and 132<=ys.mean()<=212)):
        TREES.append((int(round(xs.mean())),int(round(ys.mean()))))
# ---- 9. chỗ chưa có dữ liệu → viền trắng trong game (để tự vẽ sau). [id, loại, điểm theo ô, ghi chú]
PH=[['A4_NHA_KIENG','rect',[200,184,8,14],'Nhà kiểng: chỉ có nhãn, chưa rõ footprint'],
    ['A6_CHUA_HOA_LONG_1','rect',[250,100,12,18],'Chùa Hòa Long: dãy khối chữ nhật, chưa có kiến trúc'],
    ['A6_CHUA_HOA_LONG_2','rect',[250,118,10,44],'Chùa Hòa Long'],
    ['A6_CHUA_HOA_LONG_3','rect',[262,102,6,32],'Chùa Hòa Long'],
    ['A6_CHUA_HOA_LONG_4','rect',[262,140,6,10],'Chùa Hòa Long'],
    ['AX_MANG_CHU_NHAT','rect2',[230,120,16,30],'Mảng chữ nhật dài viền kép (số 51), chưa rõ hồ/sân/vườn'],
    ['FX_KHOI_CHUA_NHAN','poly',[[325,242],[330,232],[334,236],[330,248]],'Khối viền trắng giữa làng (số 50), chưa có nhãn'],
    ['E1_BAI_XE','rect',[282,296,18,16],'Bãi xe: chỉ có vùng, chưa có footprint rõ'],
    ['B2_DIEU_KHAC_1','circle',[160,154,6],'Điêu khắc Trống đồng & 9 đầu rồng: chỉ có nhãn'],
    ['B3_DIEU_KHAC_2','circle',[130,168,6],'Điêu khắc Hoa sen & 12 con giáp: chỉ có nhãn'],
    ['LOT_NW_1','poly',[[274,352],[570,340],[576,456],[330,410]],'Lô trống lớn ngoài ranh (tây bắc), chưa rõ chức năng']]
PH[-1][2]=[[a/PX for a in p] for p in PH[-1][2]]

# ---- 10. TRANG TRÍ (lớp thẩm mỹ, KHÔNG phải dữ liệu từ sơ đồ): cây, hoa, lau, sen, đèn lồng, ghế. Sinh theo seed cố định.
#      Quy tắc: không đè lối đi/cầu/công trình/viền trắng (PH); không đặt trong khu mộ cỏ đậm; thân cây chặn 1 ô nhưng không bao giờ cắt đường (kiểm bằng check_map.js).
import csv
rng=np.random.default_rng(20261108)
feats=[]
for row in csv.DictReader(open(ROOT+'/data/ref/03_feature_manifest.csv',encoding='utf-8-sig')):
    t=row['feature_type']; rad={'tomb':20,'temple':11,'building':10,'house':10,'service':5,'gate':6,'sculpture':6,'statue':9}.get(t,4)
    if t in('water','road','path'): continue
    feats.append(((float(row['x_px'])-40)/PX,(float(row['y_px'])-40)/PX,rad))
fm=np.zeros((R,C),bool); dfe=np.full((R,C),99.)
for fx,fy,rad in feats: dfe=np.minimum(dfe,np.maximum(0,np.hypot(xx+.5-fx,yy+.5-fy)-rad))
phm=np.zeros((R,C),bool)
for _id,ty,p,_n in PH:
    if ty in('rect','rect2'): phm|=(xx>=p[0])&(xx<p[0]+p[2])&(yy>=p[1])&(yy<p[1]+p[3])
    elif ty=='poly': phm|=poly_mask([tuple(q) for q in p])
    elif ty=='circle': phm|=((xx+.5-p[0])**2+(yy+.5-p[1])**2)<=p[2]**2
dpath=ndi.distance_transform_edt(~np.isin(M,[8,5,7,11,9]))
dwat=ndi.distance_transform_edt(M!=2)
dgate=np.full((R,C),99.)
for k,(gc,gr,a,b) in GATES.items(): dgate=np.minimum(dgate,np.hypot(xx-gc*S,yy-gr*S))
dph=ndi.distance_transform_edt(~phm); dmo=ndi.distance_transform_edt(M!=4); dedge=ndi.distance_transform_edt(inside)
dbr=np.full((R,C),99.)
for a,b,c_,d_,w,v in BRIDGES: dbr=np.minimum(dbr,np.hypot(xx+.5-(a+c_)/2,yy+.5-(b+d_)/2)-max(abs(c_-a),abs(d_-b))/2)
DECOR=[]; placed=[]
LAY={**{k:'tree' for k in ('bang','phuong','dua','tre','lieu','giay','bush','xoai','mit','buoi','cau','chuoi','tram')},**{k:'fl' for k in ('fl_pink','fl_yellow','fl_white')},**{k:'lotus' for k in ('pad0','pad1','lotus','lotus2')},'lau':'lau','lantern':'lantern','bench':'bench','stone0':'stone','stone1':'stone'}
def far(x,y,r,kinds=None,kind=None):
    L=LAY.get(kind)
    return all((x-a)**2+(y-b)**2>=((r+rr)/2)**2 for a,b,rr,_k in placed if (LAY.get(_k)==L if kinds is None else _k in kinds))
def put(kind,x,y,r,block=False):
    DECOR.append([kind,round(float(x),2),round(float(y),2)]); placed.append((x,y,r,kind))
    if block: BLK[int(y)-0,int(x)]=True
ok_grass=(M==0)&~BLK&(dpath>=1)&(dfe>=2)&(dph>=2)&(dgate>=6)&(dbr>=3)
def pts(mask,n_try,rr,kinds_pick,block,r_of=None,count=None,k_far=None):
    ys,xs=np.where(mask); idx=rng.permutation(len(ys)); n=0
    for i in idx[:n_try]:
        x,y=xs[i]+rng.random()*.6+.2,ys[i]+.9
        kd=kinds_pick(rng); rr2=(r_of or (lambda k:rr))(kd)
        if far(x,y,rr2,k_far,kd):
            put(kd,x,y,rr2,block and kd in('bang','phuong','dua','tre','lieu','xoai','mit','buoi','cau','chuoi','tram')); n+=1
            if count and n>=count: break
pick=lambda ws:(lambda g:g.choice([k for k,_ in ws],p=np.array([w for _,w in ws])/sum(w for _,w in ws)))
TREEK=('bang','phuong','dua','tre','lieu')
# (1) hàng cây viền ranh, cách mép 4–9 ô (như công viên thật)
band=ok_grass&(dedge>=5)&(dedge<=11)&(dwat>=4)&(dmo>=8)&(dpath>=5)
pts(band,9000,15,pick([('dua',.3),('bang',.2),('phuong',.14),('tre',.12),('xoai',.14),('mit',.07),('cau',.02),('chuoi',.01)]),True,lambda k:{'tre':12,'dua':16,'cau':11,'chuoi':11,'xoai':21,'mit':20}.get(k,22))
# (2) cây rải bên trong bãi cỏ
inner=ok_grass&(dedge>=11)&(dwat>=4)&(dmo>=10)&(dpath>=4)&(dfe>=3)
pts(inner,9000,24,pick([('bang',.2),('phuong',.14),('dua',.1),('tre',.08),('giay',.08),('xoai',.2),('mit',.1),('buoi',.06),('cau',.02),('chuoi',.02)]),True,lambda k:{'giay':12,'tre':14,'dua':18,'cau':11,'chuoi':11,'xoai':22,'mit':20,'buoi':18}.get(k,24))
# (2b) vườn nhà: mỗi nhà có 3–6 cây ăn trái/cau/chuối quanh chân nhà (cách 2.5–9 ô), không che cửa phía trước (nửa dưới trước cửa để trống)
bm=np.zeros((R,C),bool)
for x0,y0,x1,y1 in BUILD: bm[max(0,int(y0)-0):int(y1)+1,max(0,int(x0)):int(x1)+1]=True
HOAAN_ZONES=[(298,222,314,236),(309,231,324,245),(296,244,312,261),(286,221,300,235),(311,244,323,256)]   # các điểm Hòa An + bàn Khoa + trạm diễn giải: chừa trống
for x0,y0,x1,y1 in HOAAN_ZONES: bm[y0:y1+1,x0:x1+1]=True
dbm=ndi.distance_transform_edt(~bm)
gok=(M==0)&~BLK&(dpath>=1.6)&(dph>=2)&(dgate>=6)&(dbr>=3)&(dwat>=3)&(dmo>=6)&(dbm>=2.5)
for _r in csv.DictReader(open(ROOT+'/data/ref/03_feature_manifest.csv',encoding='utf-8-sig')):
    if _r['id'] in FOOT and FOOT[_r['id']][0]>=9 and ('NHA' in _r['id']):
        hx,hy=(float(_r['x_px'])-40)/PX,(float(_r['y_px'])-40)/PX; hw,hh=FOOT[_r['id']][0]/2,FOOT[_r['id']][1]/2
        dxr=np.maximum(np.abs(xx+.5-hx)-hw,0); dyr=np.maximum(np.abs(yy+.5-hy)-hh,0); dr=np.hypot(dxr,dyr)
        front=(yy+.5>hy+hh-1)&(np.abs(xx+.5-hx)<hw+2)                   # dải trước cửa nhà để thoáng
        pts(gok&(dr>=2.5)&(dr<=9)&~front,600,13,pick([('xoai',.28),('mit',.2),('cau',.12),('chuoi',.12),('buoi',.14),('dua',.14)]),True,lambda k:{'cau':5,'chuoi':6,'dua':9,'buoi':8,'mit':9,'xoai':10}.get(k,9),count=9)
# (2f) sân đất + hàng rào dâm bụt + giàn bầu + rơm + tre sau nhà (đồ trang trí rời, không chặn đường đi) — mỗi nhà một "khuôn viên" làng quê
HOUSES=[]
for _r in csv.DictReader(open(ROOT+'/data/ref/03_feature_manifest.csv',encoding='utf-8-sig')):
    if _r['id'] in FOOT and FOOT[_r['id']][0]>=9 and ('NHA' in _r['id']):
        HOUSES.append((_r['id'],(float(_r['x_px'])-40)/PX,(float(_r['y_px'])-40)/PX,FOOT[_r['id']][0]/2,FOOT[_r['id']][1]/2))
def _okd(x,y,wm=1.6,pm=1.2):
    xi,yi=int(x),int(y)
    return 0<=yi<R and 0<=xi<C and M[yi,xi]==0 and not BLK[yi,xi] and dpath[yi,xi]>=pm and dwat[yi,xi]>=wm and dmo[yi,xi]>=4
for k_,(iid,hx,hy,hw,hh) in enumerate(HOUSES):
    y0,y1,x0,x1=int(hy+hh-3),int(hy+hh+4),int(hx-5),int(hx+5)
    if not (M[y0:y1+1,x0:x1+1]==2).any(): DECOR.append(['san%d'%(k_%2),round(hx,2),round(hy+hh+3.8,2)])      # sân đất nện trước nhà
    for sx in (-1,1):                                                                                           # rào dâm bụt hai bên sân
        for j in range(2):
            bx,by=hx+sx*(hw+.6+j*1.7),hy+hh+3.3
            if _okd(bx,by): put('dambut',bx,by,2.4)
    gx=hx-(hw+3.6) if k_%2==0 else hx+(hw+3.6)
    if _okd(gx,hy+hh-.5,wm=2.2): put('gian',gx,hy+hh-.5,3.4)                                                    # giàn bầu bên hông
    if iid in('F5_NHA_ONG_NAM_GIAO','F9_NHA_ONG_CA_NHI_NGUU') and _okd(hx+hw+1.8,hy+hh-1):                     # nhà mái lá: đống rơm
        put('rom',hx+hw+1.8,hy+hh-1,3)
    for _ in range(2):                                                                                          # tre làng sau nhà
        bx,by=hx+rng.uniform(-hw-3,hw+3),hy-hh-rng.uniform(.8,3.5)
        if _okd(bx,by,wm=2.5) and far(bx,by,12,None,'tre'): put('tre',bx,by,12,True)
# xuồng ba lá kéo lên bờ kênh ở khu làng
_xm=(M==0)&~BLK&(dwat>=1.2)&(dwat<=2.4)&(dpath>=2.5)&(dgate>=6)&(dbr>=5)&(dmo>=8)&(dbm>=3)&(xx>=262)
pts(_xm,3000,40,lambda g:'xuong',False,count=3,k_far=('xuong',))
# (2c) tràm dọc bờ kênh nước ngọt (cây bản địa vùng ngập), thưa và xen kẽ
tram_m=(M==0)&~BLK&(dwat>=2.4)&(dwat<=5.5)&(dpath>=2)&(dph>=2)&(dgate>=6)&(dbr>=4)&(dmo>=6)&(dbm>=3)&(xx>=240)
pts(tram_m,5000,11,lambda g:'tram',True,count=48,k_far=('tram',))
# (2d) vài hàng cau dọc lối đi làng
cau_m=(M==0)&~BLK&(dpath>=2)&(dpath<=3.6)&(dph>=2)&(dgate>=6)&(dbr>=4)&(dmo>=6)&(dbm>=3)&(xx>=240)&(dwat>=3)
pts(cau_m,3000,14,lambda g:'cau',True,count=12,k_far=('cau',))
# (2e) bổ sung bãi giữa: cây ăn quả mọc tự nhiên, thưa
inner2=ok_grass&(dedge>=9)&(dwat>=3)&(dmo>=8)&(dpath>=2.5)&(dfe>=3)&(dbm>=3)
pts(inner2,12000,16,pick([('xoai',.26),('mit',.16),('buoi',.1),('cau',.03),('chuoi',.05),('dua',.12),('tre',.06),('bang',.12),('phuong',.1)]),True,lambda k:{'tre':8,'dua':10,'cau':5,'chuoi':6,'xoai':11,'mit':10,'buoi':9}.get(k,12),count=240)
# (2g0) vườn cây ăn trái dọc hai bên lối làng (cách mép lối 2–7 ô): xoài, mít, bưởi, chuối, cau, dừa
_ls=(M==0)&~BLK&(dpath>=2.0)&(dpath<=7)&(dph>=2)&(dgate>=6)&(dbr>=4)&(dwat>=3)&(dmo>=8)&(dbm>=2.5)&(dedge>=3)&(xx>=250)
pts(_ls,12000,9,pick([('xoai',.3),('mit',.18),('buoi',.14),('chuoi',.1),('cau',.1),('dua',.18)]),True,lambda k:{'cau':5,'chuoi':6,'dua':9,'buoi':8,'mit':9,'xoai':10}.get(k,9),count=110)
# (2g) bụi tre làng dọc bờ kênh và ven ranh phía đông, thưa đều
_trem=(M==0)&~BLK&(((dwat>=2.5)&(dwat<=7))|(dedge<=11))&(dpath>=2)&(dph>=2)&(dgate>=6)&(dbr>=4)&(dmo>=8)&(dbm>=3)&(xx>=250)
pts(_trem,4000,10,lambda g:'tre',True,count=34,k_far=('tre',))
# (2h) bụi cây thấp (hoa giấy, bụi) rải quanh nhà cho đỡ trống
pts(gok,3000,7,pick([('giay',.5),('bush',.5)]),False,lambda k:7,count=40)
# (3) liễu rủ ven kênh / hồ
shore=ok_grass&(dwat>=4)&(dwat<=8)&(dmo>=8)&(dpath>=3)&(dfe>=6)
pts(shore,4000,34,lambda g:'lieu',True,count=22,k_far=('lieu',))
# (4) bụi hoa giấy / bụi xanh quanh nhà và dọc lối đi
rim=(M==0)&~BLK&(dpath>=3)&(dpath<=6)&(dfe>=3)&(dfe<=9)&(dph>=2)&(dmo>=6)&(dbr>=4)&(dgate>=6)
pts(rim,2500,10,pick([('giay',.5),('bush',.5)]),False,count=90)
# (5) thảm hoa cỏ
pts(ok_grass&(dmo>=2),9000,6,pick([('fl_pink',.4),('fl_yellow',.3),('fl_white',.3)]),False,count=360)
# (6) lau lách bên bờ nước (đất liền kề nước)
shoreland=np.isin(M,[0,1,3])&(dwat<=1.6)&~BLK&(dbr>=5)&(dph>=2)&(dfe>=2)&(dgate>=6)&(dmo>=3)
pts(shoreland,3000,6,lambda g:'lau',False,count=70)
# (7) sen trên Hồ Sen, mặt nước khu B, Hồ Sao (ít) và vài đám trên kênh
dland=ndi.distance_transform_edt(M==2)
def lotus(c0,c1,r0,r1,minland,rr,cnt):
    m=(M==2)&(dland>=minland)&(xx>=c0)&(xx<=c1)&(yy>=r0)&(yy<=r1)&(dbr>=5)
    pts(m,4000,rr,pick([('pad0',.3),('pad1',.25),('lotus',.28),('lotus2',.17)]),False,count=cnt)
lotus(172,230,212,268,2.2,5.5,70); lotus(110,160,160,212,2.0,6,22); lotus(205,232,150,182,3,9,3)
canal=(M==2)&(dland>=2.5)&(xx>=250)&(dbr>=7)
pts(canal,3000,16,pick([('pad0',.5),('lotus',.3),('lotus2',.2)]),False,count=14)
# (8) đèn lồng dọc lối đi chính, hai đầu mỗi cầu, quanh cổng và trục khu mộ
lant=[]
def lantern(x,y,r=15):
    if 0<=int(y)<R and 0<=int(x)<C and M[int(y),int(x)] in(0,4) and not BLK[int(y),int(x)] and dph[int(y),int(x)]>=2 and dfe[int(y),int(x)]>=2 and far(x,y,r,('lantern',),'lantern'): put('lantern',x+.5,y+.95,r,True)
for a,b,c_,d_,w,v in BRIDGES:
    for (ex,ey) in ((a,b),(c_,d_)):
        for off in (-w/2-1.2,w/2+1.2):
            lantern((ex+(off if not v else 0)),(ey+(off if v else 0)),2)
for gname,(gc,gr,ga,gb) in GATES.items():
    for dx in (-ga*S-2,ga*S+2): lantern(gc*S+dx,gr*S-2,2)
ys,xs=np.where(np.isin(M,[8,5])&((np.roll(M,1,0)==0)|(np.roll(M,-1,0)==0)|(np.roll(M,1,1)==0)|(np.roll(M,-1,1)==0)|(np.roll(M,1,0)==4)|(np.roll(M,-1,0)==4)|(np.roll(M,1,1)==4)|(np.roll(M,-1,1)==4)))
for i in rng.permutation(len(ys))[:4000]:
    for dy,dx in ((0,1),(0,-1),(1,0),(-1,0)):
        yy_,xx_=ys[i]+dy,xs[i]+dx
        if 0<=yy_<R and 0<=xx_<C and M[yy_,xx_] in(0,4): lantern(xx_,yy_,17); break
# (9) ghế đá nhìn ra nước, đá cuội ven bờ
bench=(M==0)&~BLK&(dpath<=2.2)&(dwat>=2.5)&(dwat<=7)&(dph>=2)&(dfe>=4)&(dbr>=5)&(dmo>=4)
pts(bench,3000,30,lambda g:'bench',False,count=9,k_far=('bench',))
pts(shoreland,3000,8,pick([('stone0',.5),('stone1',.5)]),False,count=46)
print('trang trí:',{k:sum(1 for d in DECOR if d[0]==k) for k in sorted(set(d[0] for d in DECOR))})
# ---- v17: chuẩn hoá lối làng (trục 2 ô, nhánh 1 ô, lối cửa) — xem tools/v17_paths.py ----
import sys as _sys; _sys.path.insert(0,ROOT+'/tools')
from v17_paths import regularize as _reg17
V17=_reg17(M,LANEM,BLK,HOUSES,BRIDGES)
CH='0123456789ab'
js='/* Sinh tự động bởi tools/build_map.py (v3, 1 ô = 4 px sơ đồ). Không sửa tay: sửa build_map.py rồi chạy lại. */\n'
XR=(RIVER.astype(np.uint8)*1+(LANEM&(M==8)).astype(np.uint8)*2)
js+='const MAPDATA={W:%d,H:%d,TREES:%s,BRIDGES:%s,PH:%s,DECOR:%s,M:[\n%s],B:[\n%s],X:[\n%s]};\n'%(C,R,json.dumps(TREES,separators=(',',':')),json.dumps(BRIDGES,separators=(',',':')),json.dumps(PH,ensure_ascii=False,separators=(',',':')),json.dumps(DECOR,separators=(',',':')),',\n'.join('"%s"'%''.join(CH[v] for v in row) for row in M),',\n'.join('"%s"'%''.join('1' if v else '0' for v in row) for row in BLK),',\n'.join('"%s"'%''.join(str(int(v)) for v in row) for row in XR))
open(ROOT+'/js/data/mapdata.js','w').write(js)
pal={0:(120,179,71),1:(199,162,106),2:(79,168,203),3:(217,184,74),4:(47,125,86),5:(208,201,182),6:(159,174,126),7:(155,106,58),8:(196,198,193),9:(138,140,139),10:(220,220,212),11:(155,106,58)}
rgb=np.zeros((R,C,3),np.uint8)
for k,v in pal.items(): rgb[M==k]=v
for x,y in TREES: rgb[y,x]=(20,90,20)
prev=Image.fromarray(rgb).resize((C*PX,R*PX),Image.NEAREST)
Image.blend(plan,prev,.55).resize((C*2,R*2)).save(ROOT+'/data/ref/overlay_check.png')
Image.fromarray(rgb).resize((C*2,R*2),Image.NEAREST).save('/home/claude/tilemap_prev.png')
# kiểm tra liên thông của nước (mạng kênh phải liền một khối)
wl,wn=ndi.label((M==2)|(M==7)|(M==11),structure=np.ones((3,3))); print('ok',C,R,'khối nước:',[int((wl==i).sum()) for i in range(1,wn+1) if (wl==i).sum()>30])
