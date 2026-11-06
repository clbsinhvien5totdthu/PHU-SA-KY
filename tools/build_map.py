#!/usr/bin/env python3
"""Dựng bản đồ Map 01 v3 — TRÍCH TRỰC TIẾP từ sơ đồ chuẩn bằng phân loại màu (không còn đa giác vẽ tay).
Đầu vào : data/ref/01_master_plan_reference.png (1840x1408, sơ đồ đã nắn, còn khung chú thích A–F và vòng số)
Đầu ra  : data/ref/01b_master_clean.png  sơ đồ sau khi xoá khung/vòng số/chữ nâu (inpaint)
          js/data/mapdata.js             V = lưới hình ảnh 920x704 (1 ô = 2 px sơ đồ, nén RLE) ; M = lưới 230x176 (1 ô = 8 px sơ đồ) ; B = va chạm ; TREES
          data/ref/classes_preview.png, data/ref/overlay_check.png
Lớp V : 0 nền trong khu · 1 lối trắng · 2 nét đen (viền công trình) · 3 nước · 4 xanh lục (khu mộ) · 5 lề vàng (ranh khu)
        6 nền ngoài khu · 7 nét đường ngoài khu · 8 lề vàng ngoài khu
Lớp M : 0 nền · 2 nước · 3 lề vàng · 4 xanh lục · 5 lối/sân · 6 ngoài ranh · 8 nét đen trong khu
Chạy   : python3 tools/build_map.py   (cần numpy, scipy, Pillow, opencv-python)
"""
import numpy as np, cv2, os
from PIL import Image, ImageDraw
from scipy import ndimage as ndi
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC=ROOT+'/data/ref/01_master_plan_reference.png'
C,R=230,176; PW,PH=1840,1408; VS=2; VW,VH=PW//VS,PH//VS
im=cv2.imread(SRC); rgb=cv2.cvtColor(im,cv2.COLOR_BGR2RGB).astype(int)
def hsv_of(img):
    x=cv2.cvtColor(img,cv2.COLOR_BGR2HSV_FULL).astype(float); return x[...,0]*360/256,x[...,1]/255,x[...,2]/255
# ---------- 1. xoá khung chú thích A–F, vòng số, chữ nâu đỏ (inpaint)
h,s,v=hsv_of(im)
ann_cols=[(33,139,75),(30,142,66),(32,109,201),(150,58,169),(0,151,160),(175,61,61),(212,86,28),(207,83,26)]
d=np.min([np.sqrt(((rgb-np.array(c))**2).sum(-1)) for c in ann_cols],axis=0); ann=d<45
annd=cv2.dilate((ann*255).astype(np.uint8),np.ones((5,5),np.uint8))>0
lab_,_=ndi.label(annd,structure=np.ones((3,3))); fixed=annd.copy()
for i,sl in enumerate(ndi.find_objects(lab_),1):
    if sl[0].stop-sl[0].start<90 and sl[1].stop-sl[1].start<90: fixed[sl]|=ndi.binary_fill_holes(ndi.binary_closing(lab_[sl]==i,np.ones((9,9))))
annd=cv2.dilate(fixed.astype(np.uint8),np.ones((5,5),np.uint8))>0
text=cv2.dilate((((h<28)|(h>335))&(s>.22)&(v>.28)).astype(np.uint8),np.ones((3,3),np.uint8))>0
clean=cv2.inpaint(im,(annd|text).astype(np.uint8)*255,5,cv2.INPAINT_TELEA)
cv2.imwrite(ROOT+'/data/ref/01b_master_clean.png',clean)
h,s,v=hsv_of(clean); lum=cv2.cvtColor(clean,cv2.COLOR_BGR2GRAY)/255.0
# ---------- 2. phân loại điểm ảnh
cls=np.zeros((PH,PW),np.uint8)
cls[(h>35)&(h<65)&(s>.28)&(v>.55)]=5
cls[(h>190)&(h<235)&(s>.11)&(v>.5)]=3
cls[(h>85)&(h<170)&(s>.14)]=4
cls[v<.40]=2
bg=cv2.medianBlur((lum*255).astype(np.uint8),51)/255.0
cls[(cls==0)&(lum>bg+.045)&(s<.10)]=1
cls[(((h<35)|(h>335))&(s>.18)&(v>.3)&(cls==0))]=9           # chữ nâu còn sót → điền theo lân cận
cls[:150,:]=9; cls[100:135,40:130]=9                         # tiêu đề + chữ "Cầu Cái Tôm" ngoài khu
def drop_small(k,pred,to=0):
    m=cls==k; lab,n=ndi.label(m,structure=np.ones((3,3)))
    for i,(sl,c) in enumerate(zip(ndi.find_objects(lab),ndi.sum(m,lab,range(1,n+1))),1):
        hh=sl[0].stop-sl[0].start; ww=sl[1].stop-sl[1].start
        if pred(hh,ww,c): cls[sl][lab[sl]==i]=to
drop_small(2,lambda hh,ww,c:(max(hh,ww)<30 and c<260) or (hh<34 and ww<34 and c/(hh*ww)>.55))   # chữ nhỏ, ô đen đặc (icon WC)
drop_small(1,lambda hh,ww,c:max(hh,ww)<26 and c<220)                                              # quầng chữ trắng
drop_small(3,lambda hh,ww,c:c<2500 and max(hh,ww)<70 and c/(hh*ww)>.45)                           # ô xanh dương = icon dịch vụ
idx=ndi.distance_transform_edt(cls==9,return_distances=False,return_indices=True); cls=cls[idx[0],idx[1]]
# ---------- 3. ranh khu: bao đóng lề vàng quanh khu rồi điền (loại phần lề vàng ngoài khu)
band=cls==5
lab,n=ndi.label(band,structure=np.ones((3,3))); sizes=ndi.sum(band,lab,range(1,n+1))
big=np.isin(lab,[i+1 for i,z in enumerate(sizes) if z>1500])
# ranh khu: đa giác dò theo tâm lề vàng trên ảnh lưới (tọa độ ảnh cắt, gốc 200,200, tỉ lệ 1/0.807) — chỉ để phân biệt TRONG/NGOÀI;
# hình dạng thật của lề, đường, nước đều lấy từ điểm ảnh sơ đồ
SITE_D=[(468,95),(645,130),(722,165),(752,215),(745,300),(725,345),(745,385),(860,440),(1000,520),(1190,575),(1200,595),(1190,640),(1100,790),(1000,900),(965,922),(900,915),(780,880),(600,840),(400,800),(330,775),(150,750),(105,738),(130,570),(150,450),(165,330),(180,298),(240,293),(410,330),(425,300),(445,235),(440,95)]
SITE0=[(200+x*1.239,200+y*1.239) for x,y in SITE_D]
pm=Image.new('L',(PW,PH),0); ImageDraw.Draw(pm).polygon(SITE0,fill=1)
site=ndi.binary_dilation(np.asarray(pm).astype(bool),iterations=7)
np.save('/tmp/site.npy',site)
# ---------- 4. lưới V (2 px sơ đồ/ô): đa số, nét đen ưu tiên
def block(a,f): return a.reshape(PH//f,f,PW//f,f)
cnt=np.stack([block((cls==k),VS).mean((1,3)) for k in range(6)],-1)         # tỉ lệ từng lớp trong ô
V=cnt.argmax(-1).astype(np.uint8)
V[cnt[...,2]>=.34]=2; V[(cnt[...,3]>=.5)]=3
V[(cnt[...,5]>=.5)&(V!=2)]=5
vsite=block(site,VS).mean((1,3))>.5
out=~vsite
V[out&(V==0)]=6; V[out&(V==1)]=6; V[out&(V==2)]=7; V[out&(V==5)]=8; V[out&(V==3)]=6
# dọn: vệt trắng tròn do xoá huy hiệu, chữ sót ngoài khu
for k,to_,pred in ((1,0,lambda hh,ww,c:max(hh,ww)<=64 and c/(hh*ww)>.45 and min(hh,ww)>=14),(7,6,lambda hh,ww,c:max(hh,ww)<22)):
    m=V==k; lab,n=ndi.label(m,structure=np.ones((3,3)))
    for i,(sl,c) in enumerate(zip(ndi.find_objects(lab),ndi.sum(m,lab,range(1,n+1))),1):
        if pred(sl[0].stop-sl[0].start,sl[1].stop-sl[1].start,c): V[sl][lab[sl]==i]=to_
# ---------- 4b. Hồ Sao: ngôi sao 5 cánh (sơ đồ tô xanh lục; cẩm nang xếp là hồ nước → vẽ nước, đúng hình sao)
import re,math
from PIL import ImageDraw
FT=[(m.group(2),m.group(4),int(m.group(5)),int(m.group(6)),m.group(3)) for m in re.finditer(r'\[(\d+),"(\w+)","[^"]*","(\w)","(\w+)",\d+,\d+,(\d+),(\d+)',open(ROOT+'/js/data/features.js',encoding='utf-8').read())]
sx,sy=438,331                                  # tâm sao trên lưới V (≈ 876,662 px sơ đồ)
star=Image.new('L',(VW,VH),0); pts=[(sx+(27 if k%2==0 else 11)*math.sin(k*math.pi/5),sy-(27 if k%2==0 else 11)*math.cos(k*math.pi/5)) for k in range(10)]
ImageDraw.Draw(star).polygon(pts,fill=1); starm=np.asarray(star).astype(bool)
yy,xx=np.mgrid[0:VH,0:VW]; ringm=((xx-sx)**2+(yy-sy)**2<28**2)&~starm
V[ringm&np.isin(V,[0,1])]=4           # ảnh bay: 4 mảng cỏ giữa các cánh sao trong vòng tròn
V[starm]=12                            # hồ sen hình sao phủ lá sen xanh đậm (ảnh bay: mặt hồ xanh thẫm; sơ đồ tô xanh lục)
# ---------- 4c. mái nhà: tô đặc khung nét đen gần nhất của mỗi nhà/đền/trưng bày (lớp 9) — đúng footprint trên sơ đồ
lm=ndi.binary_dilation(V==2,iterations=2); lab,n=ndi.label(lm,structure=np.ones((3,3))); objs=ndi.find_objects(lab)
for fid,ty,fx,fy,zn in FT:
    if ty not in ('house','building','temple'): continue
    best=None
    for i,sl in enumerate(objs,1):
        hh=sl[0].stop-sl[0].start; ww=sl[1].stop-sl[1].start
        if not(10<=hh<=70 and 10<=ww<=70): continue
        d=math.hypot((sl[1].start+ww/2)-fx/2,(sl[0].start+hh/2)-fy/2)
        if d<34 and (best is None or d<best[0]): best=(d,i,sl)
    if best:
        _,i,sl=best; sub=V[sl]; m=ndi.binary_fill_holes(lab[sl]==i)
        wood=(ty=='house' and zn in 'EF')      # nhà gỗ Nam Bộ trong Làng Hòa An → lớp 11 ; đền, nhà sàn (ảnh bay: mái ngói cam), BQL → mái ngói lớp 9
        sub[m&(sub!=2)]=11 if wood else 9
# ---------- 4d. Vòm mộ trắng cánh sen (nguồn: Nhân Dân, MIA, Vietnam Airlines) và đài sen trắng giữa Hồ Sao (cao 6,5 m)
def disc(cx,cy,r,k,n=64):
    im_=Image.new('L',(VW,VH),0); ImageDraw.Draw(im_).polygon([(cx+r*math.cos(2*math.pi*(i+.5)/n),cy+r*math.sin(2*math.pi*(i+.5)/n)) for i in range(n)],fill=1)
    m=np.asarray(im_).astype(bool); V[m&(V!=2)]=k
disc(434,272,19,10,n=8)            # vòm mộ: bát giác trắng (tâm = điểm đo Mộ cụ trên sơ đồ)
disc(sx,sy,5,10)                   # đài sen trắng giữa sao
# ---------- 4e. đối chiếu ảnh bay (virtual tour): mái ngói cam cho Nhà trưng bày, Nhà kiểng (mái ngói đỏ sẫm), cụm Chùa Hòa Long
def fillrect(x0,y0,x1,y1,k): 
    sub=V[y0:y1,x0:x1]; sub[sub!=2]=k
fillrect(316,354,358,402,9)       # Nhà trưng bày (khung lưới trong vòng bo) — mái cam, có mảng bê tông phẳng/giếng trời theo ảnh
fillrect(399,370,412,399,9)       # Nhà kiểng — nhà chữ nhật mái ngói đỏ
reg=(slice(196,330),slice(493,545)); lm=V[reg]==2; filled=ndi.binary_fill_holes(lm)&~lm
lab_,n_=ndi.label(filled)
for i in range(1,n_+1):
    m=lab_==i
    if 12<=m.sum()<=700: V[reg][m]=9           # chỉ các ô kín nhỏ (mái từng gian), không tô cả sân
# bụi cắt tỉa tròn thành hàng ở bãi cỏ trái trục mộ (ảnh bay hướng nhìn thẳng)
for yy_ in range(262,350,6):
    for xx_ in range(394,416,6):
        if (V[yy_-2:yy_+3,xx_-2:xx_+3]==4).all(): V[yy_-1:yy_+2,xx_-1:xx_+2]=14
# đất trống ngoài khu (ảnh bay: bãi đất cỏ phía sau): các lô viền đen ở góc trên trái, ngoài ranh
reg=(slice(160,300),slice(80,300)); lm=np.isin(V[reg],[7]); fl=ndi.binary_fill_holes(lm)&~lm
lab_,n_=ndi.label(fl)
for i in range(1,n_+1):
    m=lab_==i
    if m.sum()>1500: V[reg][m&np.isin(V[reg],[6])]=13
# ---------- 5. cổng: đục ranh (lối đi), ô cổng là lối trắng
GATES={'G1_CONG_1':(81,147,2,1),'G2_CONG_2':(151,160,2,1),'G3_CONG_3':(92,60,1,1),'G4_CONG_4':(53,105,1,2),'A5_CONG_MO':(109,104,2,1),'GX_CONG_KHONG_NHAN':(128,105,1,2),'GA_CONG_AM_THUC':(188,151,2,1)}
def tile_slice(gc,gr,a,b,pad=0): return (slice((gr-b)*4-pad,(gr+b+1)*4+pad),slice((gc-a)*4-pad,(gc+a+1)*4+pad))
for gc,gr,a,b in GATES.values():
    sl=tile_slice(gc,gr,a,b); sub=V[sl]; sub[np.isin(sub,[5,8,6,7,2])]=1; sub[sub==3]=3
# ---------- 6. lưới M (8 px sơ đồ/ô) và va chạm B
def tmaj(k): return (V.reshape(R,4,C,4)==k).mean((1,3))
M=np.zeros((R,C),np.uint8)
tw=tmaj(3)+tmaj(12); tb=(tmaj(5)+tmaj(8)); tg=tmaj(4); tp=tmaj(1); to=tmaj(6)+tmaj(7)+tmaj(8)
M[tp>=.30]=5; M[tg>=.45]=4; M[tmaj(2)>=.35]=8
M[tb>=.30]=3; M[tw>=.35]=2; M[to>=.5]=6
Z=np.zeros((R,C),bool)
for gc,gr,a,b in GATES.values(): Z[gr-b:gr+b+1,gc-a:gc+a+1]=True
M[(tmaj(9)+tmaj(11))>=.3]=7
lab7,n7=ndi.label(M==7)          # mái rất lớn (Nhà trưng bày): để đi được vào trong (tham quan trong nhà), chỉ chặn nhà nhỏ
for i in range(1,n7+1):
    if (lab7==i).sum()>60: M[lab7==i]=5
M[Z]=5
BLK=np.isin(M,[2,3,6,7])&~Z
# ---------- 7. cây: chấm xanh nhỏ trong khu (quanh Hồ Sen, vài cây khu B) — đúng nơi sơ đồ có
g=(cls==4)&site; lab,n=ndi.label(g,structure=np.ones((3,3))); TREES=[]
for i,(sl,c) in enumerate(zip(ndi.find_objects(lab),ndi.sum(g,lab,range(1,n+1))),1):
    if 12<=c<=420:
        cy,cx=ndi.center_of_mass(lab==i); col,row=int(cx//8),int(cy//8)
        if (86<=col<=122 and 106<=row<=136) or (55<=col<=95 and 66<=row<=106): TREES.append((col,row))
# ---------- 8. ghi mapdata.js (V nén RLE: chuỗi "<lớp><độ dài>," theo hàng)
CH36='0123456789abcdefghijklmnopqrstuvwxyz'
def rle(row):
    o=[];st=0
    for i in range(1,len(row)+1):
        if i==len(row) or row[i]!=row[st]: o.append('%s%d'%(CH36[row[st]],i-st)); st=i
    return ','.join(o)
CH='0123456789a'
js='/* Sinh tự động bởi tools/build_map.py v3 từ sơ đồ chuẩn. Không sửa tay. V: RLE "lớp+độ dài" mỗi hàng, %dx%d ô 2px sơ đồ. */\n'%(VW,VH)
js+='const MAPDATA={W:%d,H:%d,VW:%d,VH:%d,TREES:%s,M:[\n%s],B:[\n%s],V:[\n%s]};\n'%(C,R,VW,VH,str([list(t) for t in TREES]).replace(' ',''),
 ',\n'.join('"%s"'%''.join(CH[x] for x in r) for r in M),',\n'.join('"%s"'%''.join('1' if x else '0' for x in r) for r in BLK),',\n'.join('"%s"'%rle(r) for r in V))
open(ROOT+'/js/data/mapdata.js','w').write(js)
# ---------- 9. ảnh kiểm tra
pal={0:(222,219,206),1:(250,248,240),2:(60,60,64),3:(78,170,214),4:(52,128,84),5:(226,178,70),6:(190,193,196),7:(110,112,120),8:(206,170,96),9:(176,92,58),10:(243,241,234),11:(154,107,63),12:(30,100,90),13:(150,165,110),14:(70,150,95)}
rg=np.zeros((VH,VW,3),np.uint8)
for k,c in pal.items(): rg[V==k]=c
Image.fromarray(rg).resize((PW//2,PH//2),Image.NEAREST).save(ROOT+'/data/ref/classes_preview.png')
Image.blend(Image.open(ROOT+'/data/ref/01b_master_clean.png').convert('RGB').resize((VW,VH)),Image.fromarray(rg),.5).save(ROOT+'/data/ref/overlay_check.png')
print('ok V',V.shape,'trees',len(TREES),'water tiles',int((M==2).sum()),'blocked',int(BLK.sum()))
