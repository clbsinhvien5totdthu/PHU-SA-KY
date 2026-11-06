#!/usr/bin/env python3
"""Dựng lưới bản đồ Map 01 từ sơ đồ chuẩn (cẩm nang bản đồ pixel v2.0, 05/11/2026).
Đầu vào : data/ref/01_master_plan_reference.png (1840x1408, đã cắt khung) + data/ref/03_feature_manifest.csv
Đầu ra  : js/data/mapdata.js (lưới 230x176 ô, 1 ô = 8 px sơ đồ) + data/ref/overlay_check.png (kiểm tra chồng ảnh)
Chạy    : python3 tools/build_map.py      (cần numpy, scipy, Pillow)
Quy ước ô: col=(x-40)/8, row=(y-40)/8 trên ảnh gốc 1920x1489 == x/8, y/8 trên ảnh đã cắt khung.
Loại ô  : 0 cỏ · 1 viền đất · 2 nước · 3 lề vàng (ranh khu) · 4 cỏ đậm (khu mộ) · 5 sân lát · 6 ngoài ranh · 7 cầu/cổng-cầu
          8 lối đi · 9 đường nhựa ngoài khu · a(10) lô đất trống ngoài ranh
"""
import numpy as np, os, math
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
C,R=230,176
plan=Image.open(ROOT+'/data/ref/01_master_plan_reference.png').convert('RGB')
A=np.asarray(plan).astype(int); r_,g_,b_=A[...,0],A[...,1],A[...,2]; lum=(r_+g_+b_)/3
cls=np.zeros(r_.shape,np.uint8)
cls[(g_>r_+12)&(g_>b_+4)&(lum<170)]=1            # xanh lục
cls[(b_>r_+22)&(b_>g_+4)&(lum>110)]=2            # xanh lam (nước)
cell=lambda k:(cls==k).reshape(R,8,C,8).mean((1,3))
GREEN,WATER=cell(1),cell(2)

M=np.full((R,C),6,np.uint8); FREE=np.zeros((R,C),bool)   # FREE: ô đi được dù là nước/lề (cổng, lối băng kênh)
yy,xx=np.mgrid[0:R,0:C]
def poly_mask(P,sc=4):               # P theo đơn vị ô*4 (ảnh xem trước)
    im=Image.new('L',(C*sc,R*sc),0);ImageDraw.Draw(im).polygon([tuple(p) for p in P],fill=1)
    return np.asarray(im)[sc//2::sc,sc//2::sc].astype(bool)
# ---- 1. ranh khu: đa giác đo trên viền vàng của sơ đồ (đơn vị: ô x4)
SITE=[(360,148),(545,148),(575,215),(575,240),(548,320),(600,350),(843,460),(770,595),(750,620),(700,665),(620,655),(575,640),(340,600),(310,598),(185,575),(165,545),(190,415),(205,325),(225,240),(355,285)]
inside=poly_mask(SITE); M[inside]=0
edge=inside&~ndi.binary_erosion(inside,np.ones((3,3)),iterations=1)
# ---- 2. ngoài ranh: đường nhựa quanh khu (lề đường vàng trên sơ đồ) + lô đất trống tây bắc
dist=ndi.distance_transform_edt(~inside)
ring=(~inside)&(dist>=2)&(dist<=5.5)&~((xx>138)&(yy<52))
M[ring]=9
def thick(P,w,t,only=None,free=False):
    """vẽ đường gấp khúc P=[(col,row)...] dày w ô, loại ô t; only: tập loại ô được ghi đè"""
    im=Image.new('L',(C*4,R*4),0);d=ImageDraw.Draw(im)
    for (a,b),(c,e) in zip(P,P[1:]): d.line([(a*4+2,b*4+2),(c*4+2,e*4+2)],fill=1,width=int(w*4))
    for (a,b) in P: d.ellipse([a*4+2-w*2,b*4+2-w*2,a*4+2+w*2,b*4+2+w*2],fill=1)
    m=np.asarray(im).reshape(R,4,C,4).max((1,3)).astype(bool)
    if only is not None: m&=np.isin(M,only)
    M[m]=t
    if free: FREE[m]=True
    return m
thick([(35,32),(62,35),(90,39)],3,9)                 # đường Phạm Hữu Lầu (lề vàng trên cùng)
lot=poly_mask([(137,176),(285,170),(288,228),(165,205)]); M[lot&~inside]=10
M[edge]=3
# ---- 3. khu mộ (cỏ xanh đậm) — lấy từ màu xanh lục trên sơ đồ
g=GREEN>.35; g[:, :96]=False; g[:, 129:]=False; g[:41,:]=False; g[107:,:]=False; g[:46,:100]&=False
g=ndi.binary_closing(g,np.ones((3,3)),iterations=3); g=ndi.binary_fill_holes(g); g=ndi.binary_opening(g,np.ones((3,3)),iterations=1)
lab,n=ndi.label(g);
if n: g=lab==(1+np.argmax(ndi.sum(g,lab,range(1,n+1))))
M[g&(M==0)]=4
# ---- 4. nước: Hồ Sen, mặt nước khu B, kênh quanh làng (kênh + nhánh)
wm=WATER>.3; lab,n=ndi.label(wm,structure=np.ones((3,3)))
def comp_in(c0,c1,r0,r1,minsize):
    out=np.zeros_like(wm)
    for i in range(1,n+1):
        ys,xs=np.where(lab==i)
        if len(ys)>=minsize and xs.min()>=c0 and xs.max()<=c1 and ys.min()>=r0 and ys.max()<=r1: out|=lab==i
    return out
waterB=comp_in(48,80,66,108,60); waterB[69:77,50:60]=False                      # bỏ ô chữ B
# mặt nước khu B: màu nước xám-lam trên sơ đồ quá nhạt để tách tự động → đo tay trên ảnh phóng 6x (ô = x/6+48, y/6+62): vành nước bao đảo cỏ
OUT=[(58.3,91.2),(59.7,87),(63.8,84.5),(69.7,83.3),(74.7,84.5),(77.2,87),(77.7,92.8),(76.3,97.8),(73,101.2),(68,102.8),(63.8,101.2),(60.5,97.8),(58.3,94.5)]
ISL=[(66.3,92),(70.5,89.5),(73.8,90.7),(74.3,94.5),(72.2,97.3),(68.8,97.8),(66.3,96.2)]
waterB=poly_mask([(x*4,y*4) for x,y in OUT])&~poly_mask([(x*4,y*4) for x,y in ISL])
hosen=ndi.binary_fill_holes(ndi.binary_closing(comp_in(86,114,106,133,200),np.ones((3,3)),iterations=2))
canal=comp_in(124,190,50,142,100)|comp_in(124,130,94,106,10)
canal=ndi.binary_dilation(canal,np.ones((3,3)),iterations=1)
for m in (waterB,hosen,canal): M[m&inside&np.isin(M,[0,3,4])]=2
# vòng kênh khép kín quanh cụm nhà (vẽ theo hình trên sơ đồ, khu F) + nhánh mảnh nối kênh tây
LOOP=[(137,86),(150,91),(160,95),(167.5,97.5),(171.5,103),(175,110),(181.5,113.5),(186,120.6),(187.9,129.4),(184.8,137.3),(176.9,142.3),(168.1,145.3),(161,144.4),(154.8,140.3),(150,136.3)]
BRANCH=[(126,127.5),(131,131.9),(138.8,135),(144.4,136.5),(150,137.5)]
thick(LOOP,3,2,only=[0,3]); thick(BRANCH,2,2,only=[0,3])
# ---- 5. Hồ Sao: sân tròn có bậc, hồ hình ngôi sao 5 cánh ở giữa
def disc(cx,cy,rx,ry,t,only=None):
    m=((xx+.5-cx)/rx)**2+((yy+.5-cy)/ry)**2<=1
    if only is not None: m&=np.isin(M,only)
    M[m]=t; return m
HS=(109,83)
disc(*HS,8.2,8.2,5,[0,4]); disc(*HS,7.0,7.0,4,[5]) ; disc(*HS,5.8,5.8,5,[4])
star=Image.new('L',(C*8,R*8),0);cx,cy=HS[0]*8+4,HS[1]*8+4
pts=[(cx+(5.0*8 if k%2==0 else 2.1*8)*math.sin(k*math.pi/5),cy-(5.0*8 if k%2==0 else 2.1*8)*math.cos(k*math.pi/5)) for k in range(10)]
ImageDraw.Draw(star).polygon(pts,fill=1); sm=np.asarray(star).reshape(R,8,C,8).mean((1,3))>.5; M[sm]=2
# ---- 6. sân lát, lối đi (theo trục và vị trí tương đối trên sơ đồ; cần vector hóa để khóa lối cong)
P5=lambda P,w=2:thick(P,w,5,only=[0,4,5,3])
P8=lambda P,w=2:thick(P,w,8,only=[0,4,5,3])
FORD=lambda P,w=2:thick(P,w,8,only=[2,0,3,4,5,8],free=True)     # sơ đồ vẽ đường liền qua kênh → đi được
P8([(53,105),(127,105)],3)                                      # trục ngang: Cổng 4 → Cổng vào mộ → Cổng/cầu 48
P8([(93,58),(93,105)],3)                                        # trục dọc phía trái khu mộ (Cổng 3 xuống)
P8([(81,146),(81,106)],2)                                       # lối bộ xanh Cổng 1 đi lên
P5([(109,103),(109,60)],2)                                      # trục Cổng vào mộ → Đền thờ → Hồ Sao → Mộ cụ
P5([(109,97),(118,97)],2); disc(118,97,3.6,3.6,5,[0,4,5])      # Đền thờ bát giác
disc(109,70,7.5,3.4,5,[0,4,5])                                  # sân bậc dưới Mộ cụ
P8([(109,106),(111,114)],2); P8([(109,134),(109,146)],2); P8([(81,142),(150,142)],2)   # khu D, trục D–E
thick([(125,142),(129,142)],2,8,only=[2,0,3,4,5,8],free=True)  # đường qua kênh nhánh (sơ đồ vẽ liền)
# Hồ Sen + Nhà sàn: vành lối tròn bên phải hồ
for (cx_,cy_,rx,ry) in ((114,124,9,9),):
    m=((xx+.5-cx_)/rx)**2+((yy+.5-cy_)/ry)**2; M[(m<=1)&(m>=.55)&np.isin(M,[0,4])]=8
# khu C: lối đi cong nhiều thùy quanh vùng cỏ
for (cx_,cy_,rx,ry) in ((70,122,10,12),(60,131,6,6)):
    m=((xx+.5-cx_)/rx)**2+((yy+.5-cy_)/ry)**2; M[(m<=1)&(m>=.78)&np.isin(M,[0,4])]=8
P8([(60,124),(81,124)],1.5)
# khu B: lối vòng quanh nhà trưng bày và hai điêu khắc
for (cx_,cy_,rx,ry) in ((78,80,14,9),):
    m=((xx+.5-cx_)/rx)**2+((yy+.5-cy_)/ry)**2; M[(m<=1)&(m>=.7)&np.isin(M,[0,4])]=8
P8([(60,92),(78,98),(93,98)],1.5); P8([(60,80),(66,80)],1.5)
# làng Hòa An: trục từ Cổng/cầu 48, Tượng cụ (sân đồng tâm), lối giữa các nhà
thick([(127,105),(139,105)],3,7,only=[2,0,3,4,5,8],free=True) # Cổng/cầu 48 trên kênh (cam, không nhãn)
disc(140,103,6,6,5,[0,3,5,8]); disc(140,103,3.2,3.2,8,[5])
P8([(139,108),(139,113),(135,114)],2); P8([(139,113),(142,125),(146,129)],2); P8([(146,129),(156,131)],2)
FORD([(147,128),(151,131)],2)
P8([(156,131),(160,134),(166,134),(168,124)],2); P8([(168,124),(179,129)],2); P8([(179,129),(188,126),(196,124)],2)
P8([(166,134),(166,139)],2); P8([(168,118),(166,111),(166,105)],2); P8([(186,126),(188,113)],2); P8([(192,134),(188,128)],2)
P8([(151,142),(151,159)],2); P8([(151,146),(183,146)],2); P8([(183,146),(188,150)],2); P8([(146,129),(146,140)],2)
FORD([(150,138),(151,142)],2)
P5([(126,50),(134,50)],1); 
# ---- 7. cổng: bệ cổng + đường ra mép
GATES={'G1_CONG_1':(81,147,2,1),'G2_CONG_2':(151,160,2,1),'G3_CONG_3':(92,60,1,1),'G4_CONG_4':(53,105,1,2),'A5_CONG_MO':(109,104,2,1),'GX_CONG_KHONG_NHAN':(128,105,1,2),'GA_CONG_AM_THUC':(188,151,2,1)}
for k,(gc,gr,a,b) in GATES.items():
    sl=(slice(gr-b,gr+b+1),slice(gc-a,gc+a+1)); M[sl]=np.where(np.isin(M[sl],[6,9]),5,M[sl]) if False else 5; FREE[sl]=True
# ---- 8. bảo toàn lề vàng & ranh: ô ngoài ranh, lề, nước không đi được; còn lại đi được
BLK=np.isin(M,[2,3,6,9,10])&~FREE
for y in range(R):
    for x in range(C):
        if M[y,x]==3 and any(GATES[k][0]-GATES[k][2]<=x<=GATES[k][0]+GATES[k][2] and GATES[k][1]-GATES[k][3]<=y<=GATES[k][1]+GATES[k][3] for k in GATES): BLK[y,x]=False

# ---- 9. cây: chỉ đặt ở nơi sơ đồ có thể hiện (chấm xanh quanh Hồ Sen, vài cây cạnh nước khu B)
gd=(GREEN>.18)&(M!=4)&~np.isin(M,[2,6,9,10])
lab2,n2=ndi.label(gd,structure=np.ones((3,3))); TREES=[]
for i in range(1,n2+1):
    ys,xs=np.where(lab2==i)
    if 1<=len(ys)<=7 and ((86<=xs.mean()<=122 and 106<=ys.mean()<=136) or (55<=xs.mean()<=95 and 66<=ys.mean()<=106)):
        TREES.append((int(round(xs.mean())),int(round(ys.mean()))))
CH='0123456789a'
js='/* Sinh tự động bởi tools/build_map.py từ sơ đồ chuẩn (cẩm nang v2.0). Không sửa tay: sửa build_map.py rồi chạy lại. */\n'
js+='const MAPDATA={W:%d,H:%d,TREES:%s,M:[\n%s],B:[\n%s]};\n'%(C,R,str([list(t) for t in TREES]).replace(' ',''),',\n'.join('"%s"'%''.join(CH[v] for v in row) for row in M),',\n'.join('"%s"'%''.join('1' if v else '0' for v in row) for row in BLK))
open(ROOT+'/js/data/mapdata.js','w').write(js)
# ---- kiểm tra chồng ảnh
pal={0:(120,179,71),1:(199,162,106),2:(79,168,203),3:(217,184,74),4:(47,125,86),5:(208,201,182),6:(159,174,126),7:(155,106,58),8:(196,198,193),9:(138,140,139),10:(220,220,212)}
rgb=np.zeros((R,C,3),np.uint8)
for k,v in pal.items(): rgb[M==k]=v
rgb[BLK&(M==0)]=(255,0,0)
ov=Image.fromarray(rgb).resize((C*8,R*8),Image.NEAREST)
Image.blend(plan,ov,.55).resize((C*4,R*4)).save(ROOT+'/data/ref/overlay_check.png')
Image.fromarray(rgb).resize((C*4,R*4),Image.NEAREST).save('/home/claude/tilemap_prev.png')
print('ok',C,R, 'water cells',int((M==2).sum()))
