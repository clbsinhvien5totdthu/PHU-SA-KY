"""v17 · chuẩn hoá lối lát gạch trong làng Hòa An (được build_map.py gọi ngay trước khi xuất MAPDATA).
Quy tắc đã được duyệt: trục chính rộng 2 ô, nhánh rộng 1 ô; lối đất làng đổi hết sang gạch; mỗi nhà có một đoạn lối ngắn
nối cửa chính vào đường gần nhất CHỈ KHI sơ đồ đã có đường quanh đó (không nối thêm, không đổi hướng, không đặt cầu).
Chỉ chạm các ô lối làng (LANEM) + các ô cỏ trống để làm đoạn lối cửa; không đổi footprint/FOOT, B, cầu, nước, ID, trang trí.
  1) lấy khung xương 4-liên-thông của từng cụm lối làng (skeletonize + vá bước chéo bằng ô nằm trong cụm)
  2) neo: ô lối chạm sân/cầu/đường lát khác được nối lại vào khung bằng đường ngắn nhất trong cụm (giữ liền mạch tới cầu, sân, cổng)
  3) trục = các đường ngắn nhất nối các neo với nhau (cây khung); phần còn lại = nhánh
  4) trục nở thành 2 ô (chỉ trong phạm vi cụm cũ); nhánh 1 ô; ô cũ thừa trả về cỏ
  5) đoạn lối cửa: từ ô ngay dưới cửa chính, tới ô gạch gần nhất trong bán kính R_DOOR ô, qua cỏ trống (L-path hoặc BFS ≤ 12 ô)"""
import numpy as np
from collections import deque
from scipy import ndimage as ndi
from skimage.morphology import skeletonize
N4=((1,0),(-1,0),(0,1),(0,-1)); N8=N4+((1,1),(1,-1),(-1,1),(-1,-1))
R_DOOR=6
# cửa chính (px trong sprite, trục x) và kích thước sprite (rộng px) theo kiểu nhà — khớp tools/build_features.py SPR + assets/art/map.px.js
KIND={'F1_NHA_NOC_NGUA_1':'noc','F6_NHA_CU_SAC':'noc','F16_NHA_NOC_NGUA_2':'noc','F4_NHA_BAT_DAN_1':'bat','F8_NHA_BAT_DAN_2':'bat','F7_NHA_CHU_DINH_2':'dinh','E4_NHA_CHU_DINH_1':'dinh','F9_NHA_ONG_CA_NHI_NGUU':'la','F5_NHA_ONG_NAM_GIAO':'la2','F10_NHA_TREN_COC_2':'coc','F14_NHA_TREN_COC_1':'coc'}
DOOR={'noc':(72+1,146),'bat':(72+1,146),'dinh':(46+1,146),'la':(72+1,146),'la2':(70+1,146),'coc':(96+1,194)}
def _bfs(src,ok,goal=None,maxd=10**9):
    """BFS 4 hướng trên ô thoả ok(x,y); goal(x,y) → dừng. Trả đường (list) từ src tới ô đích"""
    q=deque([src]);prev={src:None}
    while q:
        c=q.popleft()
        if goal and goal(*c) and c!=src:
            p=[];
            while c is not None: p.append(c);c=prev[c]
            return p[::-1]
        d=0;t=c
        # độ sâu
        while prev[t] is not None: d+=1;t=prev[t]
        if d>=maxd: continue
        for dx,dy in N4:
            n=(c[0]+dx,c[1]+dy)
            if n not in prev and ok(*n): prev[n]=c;q.append(n)
    return None
def regularize(M,LANEM,BLK,HOUSES,BRIDGES,log=print):
    R,C=M.shape; lane0=LANEM&(M==8); M0=M.copy()
    lab,n=ndi.label(lane0,structure=np.ones((3,3))); newlane=np.zeros_like(lane0); trunk_all=np.zeros_like(lane0); stats=[]
    for k in range(1,n+1):
        reg=lab==k; cells=set(zip(*np.where(reg)[::-1]))      # (x,y)
        if len(cells)<2: newlane|=reg; continue
        sk=skeletonize(reg); S=set(zip(*np.where(sk)[::-1]))
        if not S: S={next(iter(cells))}
        for (x,y) in list(S):                                  # vá bước chéo để 4-liên-thông
            for dx,dy in ((1,1),(1,-1),(-1,1),(-1,-1)):
                if (x+dx,y+dy) in S and (x+dx,y) not in S and (x,y+dy) not in S:
                    for c in ((x+dx,y),(x,y+dy)):
                        if c in cells: S.add(c);break
        # neo: ô lối chạm sân/cầu/đường lát không phải lối làng
        anc=[]
        for (x,y) in cells:
            for dx,dy in N4:
                xx,yy=x+dx,y+dy
                if 0<=xx<C and 0<=yy<R and (M0[yy,xx] in (5,7,11) or (M0[yy,xx]==8 and not lane0[yy,xx])): anc.append((x,y));break
        keep=set(S); attach=[]
        for a in anc:                                          # nối neo vào khung bằng đường ngắn nhất trong cụm
            if a in keep: attach.append(a);continue
            p=_bfs(a,lambda x,y:(x,y) in cells,goal=lambda x,y:(x,y) in S)
            if p: keep.update(p);attach.append(p[-1])
        # trục = cây khung nối các neo (đường ngắn nhất trong khung ∪ phần nối)
        trunk=set()
        nodes=list(dict.fromkeys(attach))
        if len(nodes)>=2:
            trunk={nodes[0]}
            for _ in range(len(nodes)-1):
                rest=[c for c in nodes if c not in trunk]
                if not rest: break
                goalset=trunk
                best=None
                for c in rest:
                    p=_bfs(c,lambda x,y:(x,y) in keep,goal=lambda x,y:(x,y) in goalset)
                    if p and (best is None or len(p)<len(best)): best=p
                if not best: break
                trunk.update(best)
        keep|=trunk
        wide=set(trunk)
        for (x,y) in trunk:                                   # nở trục thành 2 ô
            v=((x,y-1) in trunk or (x,y+1) in trunk); h=((x-1,y) in trunk or (x+1,y) in trunk)
            add=[]
            if v and not h: add=[(x+1,y),(x-1,y)]
            elif h and not v: add=[(x,y+1),(x,y-1)]
            else: add=[(x+1,y),(x,y+1),(x+1,y+1)]
            for c in add:
                if c in cells:
                    wide.add(c)
                    if v!=h: break
        keep|=wide
        for (x,y) in keep: newlane[y,x]=True
        for (x,y) in trunk: trunk_all[y,x]=True
        stats.append((k,len(cells),len(keep),len(trunk),len(anc)))
    removed=lane0&~newlane
    M[removed]=8*0                                             # ô lối cũ thừa → cỏ
    M[newlane]=8
    log('v17 lối làng: cụm',n,'· ô lối cũ',int(lane0.sum()),'→ ô mới',int(newlane.sum()),'(trả cỏ',int(removed.sum()),')')
    # ---- đoạn lối cửa ----
    doors=[]
    for (iid,hx,hy,hw,hh) in HOUSES:
        kd=KIND.get(iid)
        if not kd: continue
        dpx,wpx=DOOR[kd]; x0=hx-wpx/32.; bottom=hy+146/32.
        sx=int(x0+dpx/16.); sy=int(np.floor(bottom))+1
        ok=lambda x,y:0<=x<C and 0<=y<R and M[y,x] in (0,4) and not BLK[y,x]
        target=None
        best=1e9
        for yy in range(max(0,sy-R_DOOR),min(R,sy+R_DOOR+1)):
            for xx in range(max(0,sx-R_DOOR),min(C,sx+R_DOOR+1)):
                if M[yy,xx]==8:
                    d=np.hypot(xx-sx,yy-sy)
                    if d<best: best=d;target=(xx,yy)
        if target is None: doors.append((iid,'KHÔNG có đường trong %d ô — không thêm'%R_DOOR,(sx,sy)));continue
        if M[sy,sx]==8: doors.append((iid,'cửa đã sát đường',(sx,sy)));continue
        p=_bfs((sx,sy),lambda x,y:ok(x,y) or M[y,x]==8 and (x,y)!=(sx,sy),goal=lambda x,y:M[y,x]==8,maxd=12) if ok(sx,sy) else None
        if not p: doors.append((iid,'có đường cách %.1f ô nhưng đường tới bị chặn (nước/nhà/cây) — không thêm'%best,(sx,sy)));continue
        for (x,y) in p:
            if M[y,x]!=8: M[y,x]=8;newlane[y,x]=True
        doors.append((iid,'lối cửa %d ô'%(len(p)-1),(sx,sy)))
    for d in doors: log('  cửa',d[0],'→',d[1])
    LANEM[:]=False                                             # không còn "lối đất làng": mọi ô đường là gạch
    return {'stats':stats,'doors':doors,'removed':int(removed.sum()),'newlane':int(newlane.sum())}
