"""Sinh tranh pixel-art cho 3 cảnh chèo thuyền ở đầu cutscene (thay cho cảnh sông hoàng hôn cũ):
   ben_tre  – rạch dừa nước, xuồng chở khách (Bến Tre)
   xeo_quyt – rừng tràm, xuồng len qua thảm bèo (Xẻo Quýt, Đồng Tháp)
   nga_nam  – chợ nổi buổi sớm (Ngã Năm)
Chạy:  python tools/art_boats.py [ben_tre|xeo_quyt|nga_nam]   rồi   node tools/build_img.js
Mỗi cảnh xuất theo LỚP (sky/far/water/mid/boats/fore) ở 640x360 cho camera thị sai của js/cutscene.js, cộng dải hoạt hoạ người chèo."""
import math, os, sys, json
import numpy as np
from PIL import Image
from pxkit import *

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'assets/art/out/scenes')
ANI = os.path.join(ROOT, 'assets/art/out/anims')


def mixc(a, b, k):
    a = rgb(a); b = rgb(b)
    return '#%02x%02x%02x' % tuple(int(a[i] + (b[i] - a[i]) * k) for i in range(3))


def tint(cols, c, k):
    return [mixc(x, c, k) for x in cols]


# =====================================================================================
#  CẢNH 1 – BẾN TRE: rạch nước phù sa vàng nâu, hai bên dừa nước, xuồng chở khách
# =====================================================================================
GA = ['#0e140a', '#1b2610', '#2c3f18', '#3f5826', '#52702f', '#62813a', '#7f9f4b', '#a3b56d', '#cddb93']   # xanh dừa nước (tối -> sáng)
STALK = ['#2c2412', '#473923', '#6a5c37', '#8a6c3a', '#a07e47']
VPA = (352, 150)
WATER_A = [(346, 143), (322, 152), (288, 168), (246, 190), (196, 218), (140, 248), (80, 276), (0, 304), (0, 360), (512, 360),
           (500, 322), (480, 282), (458, 244), (432, 208), (404, 176), (380, 154), (364, 143)]


def nipa(cv, rng, x, yb, s, cols, nf=9, stalks=7, spread=1.15, hmul=1.0):
    """Một bụi dừa nước: cụm cuống nâu ở chân + các tàu lá dài cong rủ."""
    for _ in range(int(stalks * max(.6, s)) + 3):
        sx = x + rng.uniform(-15, 15) * s
        hh = rng.uniform(16, 46) * s * hmul
        lean = rng.uniform(-.28, .28) * hh
        c = rng.choice(STALK)
        w = max(1, int(2.4 * s))
        cv.line(sx, yb, sx + lean, yb - hh, c, w)
        if s > .5:
            cv.line(sx + 1, yb - 2, sx + lean + 1, yb - hh, '#a07e47', 1)
    for i in range(nf):
        a = -math.pi / 2 + rng.uniform(-spread, spread)
        L = rng.uniform(62, 118) * s
        bx = x + rng.uniform(-9, 9) * s
        by = yb - rng.uniform(20, 36) * s * hmul
        tip = (bx + math.cos(a) * L * .92, by + math.sin(a) * L * .6 + L * .32 * abs(math.cos(a)))
        ctl = (bx + math.cos(a) * L * .5, by + math.sin(a) * L * .95 - L * .12)
        frond(cv, rng, (bx, by), ctl, tip, int(12 + 11 * s), max(5, L * .19), cols, grav=.42, spread=50, rach=cols[2], bias=.2)


def layer_sky_A():
    cv = Cv()
    m = np.ones((H, W), bool)
    cv.grad(m, (0, 0), (0, 165), ['#7fb4d2', '#9cc5dc', '#bcd8e2', '#dbe9e8', '#f1efd2', '#f6e8bd'], spread=.9)
    r = rngf(5)
    for cx, cy, rx, ry in [(120, 40, 62, 8), (470, 56, 80, 9), (330, 22, 46, 6), (560, 105, 54, 7)]:
        cloud(cv, r, cx, cy, rx, ry, '#e8f1f0', '#ffffff', None, '#c9dce2')
    return cv


def clump(cv, r, cx, cy, rx, ry, n, cols, L=(.4, -.9), rr_=(2, 4)):
    """Cụm lá lởm chởm: nhiều chấm lá nhỏ 3 tông thay cho khối tròn."""
    pts = []
    for _ in range(n):
        a = r.random() * 6.283; m = math.sqrt(r.random())
        pts.append((cx + math.cos(a) * m * rx, cy + math.sin(a) * m * ry, r.randint(*rr_)))
    pts.sort(key=lambda p: p[1])
    for x, y, rr in pts:
        cv.circ(x, y + 1, rr, cols[0]); cv.circ(x, y, rr, cols[1])
    for x, y, rr in pts:
        if r.random() < .6:
            cv.circ(x + 1, y - 1, max(1, rr - 1), cols[2])
    for x, y, rr in pts:
        if r.random() < .25 and len(cols) > 3:
            cv.px(x + 1, y - rr + 1, cols[3]); cv.px(x, y - rr, cols[3])


def layer_far_A():
    cv = Cv(); r = rngf(11)
    haze = '#cddb93'
    for side in (-1, 1):
        items = []
        for i in range(120):
            t = r.random()
            x = 352 + side * (10 + t * 330) + r.uniform(-12, 12)
            ytop = 150 - (t ** .55) * 74
            y = r.uniform(ytop, 152)
            items.append((y, x, t))
        for y, x, t in sorted(items):
            cols = tint(GA[1:6], haze, .62 - .42 * t)
            clump(cv, r, x, y, 7 + 12 * t, 4 + 7 * t, 7 + int(8 * t), cols)
    for side in (-1, 1):
        for i in range(16):
            bx = 352 + side * r.uniform(24, 260); by = 152 + r.uniform(-4, 4)
            a = -math.pi / 2 + r.uniform(-.8, .8)
            L = r.uniform(34, 70)
            tip = (bx + math.cos(a) * L, by + math.sin(a) * L * .7 + 10)
            frond(cv, r, (bx, by), (bx + math.cos(a) * L * .5, by + math.sin(a) * L), tip, 12, 8, tint(GA, haze, .4), grav=.45, bias=.2)
    cv.dpoly([(326, 96), (378, 96), (396, 158), (310, 158)], '#f6ecc8', lambda x, y: .5 * max(0, 1 - abs(x - 352) / 44) * max(0, 1 - abs(y - 132) / 44))
    return cv


def blobd(cv, cx, cy, rx, ry, col, p, clip):
    m = cv.mask(fn=lambda d: d.ellipse([cx - rx, cy - ry, cx + rx, cy + ry], fill=255)) & clip
    ys, xs = np.nonzero(m); c = rgb(col)
    for y, x in zip(ys, xs):
        d = ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2
        if BAY[y & 3][x & 3] < p * (1 - d) * 1.6:
            cv.im.putpixel((int(x), int(y)), c)


def layer_water_A():
    cv = Cv(); r = rngf(23)
    EXT = [(x - 14, y) if x < 352 else (x + 14, y) for x, y in WATER_A]
    m0 = cv.mask(WATER_A)
    m = cv.mask(EXT)
    cv.grad(m, (0, 143), (0, 360), ['#ecdcae', '#e0c88c', '#cfae68', '#b8914c', '#a07e47', '#8a6a37', '#7a5c2f'], spread=1.15)
    ys = np.arange(H)
    xl = np.array([np.nonzero(m[y])[0].min() if m[y].any() else 0 for y in ys])
    xr = np.array([np.nonzero(m[y])[0].max() if m[y].any() else 0 for y in ys])
    # bóng bờ phản chiếu xuống nước: dải tối mờ dần vào giữa rạch
    for y in range(143, H):
        if not m[y].any():
            continue
        bw = 16 + (y - 143) * .42
        for x in range(int(xl[y]), int(min(xl[y] + bw, W))):
            k = 1 - (x - xl[y]) / bw
            if BAY[y & 3][x & 3] < max(k, 0) ** 1.1 * .95:
                cv.px(x, y, '#473923' if k > .45 else '#6a5c37')
        bw2 = 14 + (y - 143) * .33
        for x in range(int(max(xr[y] - bw2, 0)), int(xr[y]) + 1):
            k = 1 - (xr[y] - x) / bw2
            if BAY[y & 3][x & 3] < max(k, 0) ** 1.1 * .95:
                cv.px(x, y, '#473923' if k > .45 else '#6a5c37')
    # bóng tàu lá đổ chéo trên mặt nước (mảng nâu sẫm, đứt quãng)
    for (cx, cy, rx, ry) in [(120, 322, 96, 16), (230, 262, 62, 9), (290, 214, 40, 6), (410, 318, 44, 14), (330, 340, 70, 10)]:
        blobd(cv, cx, cy, rx, ry, '#5a4a2a', .8, m)
    # mảng nắng lọt tán lá: vàng sáng, méo theo phối cảnh (dẹt dần về xa)
    for i in range(34):
        y = r.uniform(158, 352); k = (y - 143) / 217
        cx = r.uniform(60, 470) if y > 220 else r.uniform(300, 400)
        rx = 12 + 60 * k * r.uniform(.5, 1.2); ry = 1.5 + 6 * k * r.uniform(.6, 1.1)
        blobd(cv, cx, y, rx, ry, '#f3ca80', .85, m)
        blobd(cv, cx + 3, y - 1, rx * .55, ry * .6, '#f9e4b0', .85, m)
    # gợn nước ngang: xa thì ngắn mịn, gần thì dài và tương phản
    for i in range(3200):
        y = int(145 + (r.random() ** .75) * 213); k = (y - 143) / 217
        x = r.randint(0, 520)
        if not m[min(y, H - 1)][min(x, W - 1)]:
            continue
        ln = int(2 + k * 30 * r.random() + 1)
        c = r.choice(['#f9e4b0', '#f3ca80', '#f3ca80', '#6a5c37', '#473923', '#8a6c3a', '#c0994f'])
        cv.rect(x, y, ln, 1, c)
    for i in range(300):
        y = r.randint(150, 358); x = r.randint(0, 520)
        if m[y][x]:
            cv.px(x, y, '#fff6dc'); cv.px(x + 1, y, '#fff6dc')
    # lục bình trôi sát bờ
    for (x, y) in [(60, 330), (82, 338), (452, 262), (468, 296), (290, 190), (150, 262)]:
        if not m[min(y, H - 1)][min(x, W - 1)]:
            continue
        for j in range(6):
            blob_leaf(cv, r, x + r.randint(-9, 9), y + r.randint(-3, 3), r.randint(3, 5), ['#2c3f18', '#52702f', '#7f9f4b', '#a3b56d'])
    return cv


def layer_mid_A():
    cv = Cv(); r = rngf(31)
    # bờ trái: bùn + gốc cuống, bụi dừa nước từ xa tới gần
    # nền tối dưới các bụi (chỉ quanh chân bờ để không lộ khối phẳng)
    cv.poly([(0, 304), (80, 276), (140, 248), (196, 218), (246, 190), (288, 168), (322, 152), (346, 143), (340, 132), (260, 160), (180, 200), (100, 240), (0, 262)], '#2c2412')
    cv.poly([(364, 143), (380, 154), (404, 176), (432, 208), (458, 244), (480, 282), (500, 322), (512, 360), (560, 360), (545, 310), (520, 250), (470, 190), (420, 150), (372, 134)], '#2c2412')
    left = []
    for i in range(16):
        t = (i / 15) ** 1.35
        x = 338 - 350 * t; y = 152 + 146 * t
        left.append((x, y, .2 + 1.35 * t))
    right = []
    for i in range(13):
        t = (i / 12) ** 1.4
        x = 372 + 150 * t; y = 152 + 190 * t
        right.append((x, y, .2 + 1.4 * t))
    # lớp phía sau (cao hơn, tối hơn) cho kín khối
    back = []
    for i in range(34):
        y = r.uniform(110, 285); x = r.uniform(-20, 330 - (y - 110) * 1.55)
        back.append((x, y, .35 + (y - 100) / 190 * 1.0))
    for i in range(30):
        y = r.uniform(110, 300); x = r.uniform(380 + (y - 110) * .35, 660)
        back.append((x, y, .4 + (y - 100) / 190 * 1.1))
    for (x, y, s) in sorted(back, key=lambda a: a[1]):
        nipa(cv, r, x, y, s, tint(GA, '#8aa660', .2 - .1 * min(1, s / 1.4)), nf=7, stalks=3)
    items = sorted([(x, y, s, 'L') for x, y, s in left] + [(x, y, s, 'R') for x, y, s in right], key=lambda a: a[1])
    for x, y, s, sd in items:
        k = min(1, max(0, (s - .2) / 1.4))
        cols = tint(GA, '#9db36a', .32 * (1 - k))
        nipa(cv, r, x, y, s, cols, nf=int(7 + 4 * k), stalks=7, spread=1.2 if sd == 'L' else 1.1)
    cv.poly([(512, 360), (500, 322), (520, 292), (640, 250), (640, 360)], '#2c2412')
    for (x, y, sc) in [(540, 330, 1.3), (600, 300, 1.2), (630, 350, 1.6), (565, 262, 1.0), (600, 230, .9), (20, 345, 1.2), (60, 330, 1.0)]:
        nipa(cv, r, x, y, sc, tint(GA, '#0e140a', .12), nf=9, stalks=6)
    # khúc gỗ nghiêng ở bờ phải + gốc mục
    cv.line(560, 262, 600, 210, '#473923', 7); cv.line(563, 260, 602, 209, '#8a6c3a', 2)
    cv.line(520, 300, 548, 250, '#2c2412', 5)
    return cv


# ---------- thuyền ----------
def hull_front(cv, cx, cy, s, outer, rim='#e9e3cf', inner='#a07e47', tilt=-.22, L=100, Wd=34):
    """Xuồng nhìn từ phía sau-trên: đuôi bằng, thân phình giữa, mũi nhọn chúc về người xem; lòng thuyền gỗ, mạn màu."""
    def P(x, y):
        return (cx + x * s + y * s * tilt, cy + y * s)
    top, bot = -L * .45, L * .55
    N = 14

    def hw(t, k):   # nửa bề rộng theo chiều dài (t: 0 đuôi -> 1 mũi)
        return Wd * k * (.82 + .18 * math.sin(math.pi * min(1, t * 1.1))) * (1 - t ** 2.2 * .96)
    def outline(k):
        left = [P(-hw(i / N, k), top + (bot - top) * i / N) for i in range(N + 1)]
        right = [P(hw(i / N, k), top + (bot - top) * i / N) for i in range(N + 1)]
        return left + right[::-1]
    cv.poly(outline(.64), shade(outer, -.4))
    cv.poly(outline(.6), outer)
    ins = [P(-hw(i / N, .46), top + 2 + (bot - top - 4) * i / N) for i in range(N - 3)]
    ins += [P(hw(i / N, .46), top + 2 + (bot - top - 4) * i / N) for i in range(N - 4, -1, -1)]
    cv.poly(ins, inner)
    cv.poly(ins[N - 6:N - 2] + [P(0, bot - 10)], shade(inner, -.3))
    # mép mạn (đường viền sáng) + lườn tối bên dưới
    for i in range(N):
        a = P(-hw(i / N, .6), top + (bot - top) * i / N); b = P(-hw((i + 1) / N, .6), top + (bot - top) * (i + 1) / N)
        cv.line(*a, *b, rim, 1)
        a = P(hw(i / N, .6), top + (bot - top) * i / N); b = P(hw((i + 1) / N, .6), top + (bot - top) * (i + 1) / N)
        cv.line(*a, *b, rim, 1)
    cv.line(*P(-hw(0, .6), top), *P(hw(0, .6), top), rim, 2)
    for yy in (top + 20, top + 50):
        a = P(-hw(.3, .42), yy); b = P(hw(.3, .42), yy)
        cv.line(*a, *b, shade(inner, .28), 2)
        cv.line(a[0], a[1] + 2, b[0], b[1] + 2, shade(inner, -.4), 1)
    return P


def layer_boats_A():
    """Các xuồng chở khách phía xa (tĩnh); xuồng chính (thân xanh) ở dải hoạt hoạ 'row_ben_tre'."""
    cv = Cv(); r = rngf(41)
    HAT = '#d8c393'
    specs = [  # (x, y, scale, thân, [áo...])
        (357, 160, .22, '#8a6a3c', ['#c9433a', '#2a4e7a']),
        (349, 176, .29, '#3b6aa3', ['#e8e0c8', '#4d8a5a']),
        (342, 198, .39, '#8a6a3c', ['#5a7ab8', '#c9433a', '#e8e0c8']),
        (358, 230, .53, '#a08050', ['#d4a843', '#e8e0c8', '#8a4a6a']),
        (330, 262, .68, '#3a73b8', ['#e8e0c8', '#2a4e7a', '#c9433a']),
    ]
    for (x, y, s, hc, shirts) in specs:
        cv.dpoly([(x - 26 * s, y + 46 * s), (x + 26 * s, y + 46 * s), (x + 20 * s, y + 62 * s), (x - 20 * s, y + 62 * s)], '#313118', lambda a, b: .7)
        P = hull_front(cv, x, y, s, hc, inner='#a98343', Wd=34, L=98)
        for j, sh in enumerate(shirts):
            px_, py_ = P(0, -24 + j * 26)
            person(cv, px_, py_ + 4 * s, s * .95, sh, hat=True, hat_c=HAT, hat_d='#a98f58')
    return cv


def anim_row_A(frames=8):
    """Xuồng chính (thân xanh) – người đứng chèo ở đuôi; mái chèo đưa nhịp 8 khung. Mỗi khung 150x140."""
    fw, fh = 150, 150
    strip = Image.new('RGBA', (fw * frames, fh), (0, 0, 0, 0))
    for f in range(frames):
        cv = Cv(fw, fh); ph = f / frames * 2 * math.pi
        sw = math.sin(ph); bob = round(math.sin(ph * 2) * .6)
        P = hull_front(cv, 74, 70 + bob, 1.0, '#2f69b0', inner='#a98343', Wd=44, L=104)
        HAT = '#d8c393'
        # hành khách ngồi (sau -> trước)
        person(cv, *P(-6, 8), 1.08, '#8a4a8a', hat=True, hat_c=HAT)
        person(cv, *P(6, 30), 1.12, '#e8e0c8', hat=True, hat_c=HAT)
        person(cv, *P(0, 52), 1.0, '#c9433a', hat=True, hat_c=HAT, arm=False)
        # người chèo đứng ở đuôi: áo xanh, tay vung theo nhịp
        px_, py_ = P(2, -30)
        person(cv, px_, py_ + 6, 1.15, '#3d5f9a', hat=False, stand=True, hair='#121018')
        hx, hy = px_ + 8 + sw * 4, py_ - 12 + sw * 2
        cv.line(px_ + 6, py_ - 18, hx, hy, '#c98f5e', 2)
        # mái chèo: cán dài từ tay xuống nước phía trái, góc đổi theo nhịp
        ang = math.radians(150 - sw * 26)
        L = 74
        ex, ey = hx + math.cos(ang) * L, hy + math.sin(ang) * L * .55 + 22
        cv.line(hx, hy, ex, ey, '#8a6c3a', 2)
        cv.line(hx + 1, hy, ex + 1, ey, '#c0994f', 1)
        cv.ell(ex, ey + 1, 6, 2, '#6a5c37')
        strip.paste(cv.im, (f * fw, 0))
    strip.save(os.path.join(ANI, 'row_ben_tre.png'), optimize=True)


def layer_fore_A():
    cv = Cv(); r = rngf(53)
    # tàu lá lớn vắt ngang đỉnh khung (lá chét rủ, thấu sáng ngược nắng)
    frond(cv, r, (-30, 30), (180, -80), (470, 74), 42, 46, GA, grav=.5, spread=56, rach=GA[2], prof_pow=.5, bias=.28)
    frond(cv, r, (-20, 4), (120, -60), (300, 40), 30, 36, tint(GA, '#0e140a', .1), grav=.5, spread=58, prof_pow=.5, bias=.22)
    frond(cv, r, (690, 36), (560, -50), (380, 46), 30, 40, GA, grav=.5, spread=56, prof_pow=.5, bias=.25)
    frond(cv, r, (640, -10), (520, 20), (430, 110), 20, 34, tint(GA, '#0e140a', .2), grav=.5, spread=56, bias=.2)
    # mảng lá tối rủ ở mép phải + bụi gần ở hai góc dưới
    for i in range(5):
        x = 566 + i * 24 + r.uniform(-8, 8)
        frond(cv, r, (x, -8), (x + 26, 70), (x + r.uniform(-26, 26), 180 + r.uniform(0, 80)), 26, 34, tint(GA, '#0a0f07', .38), grav=.45, spread=54, bias=.1)
    nipa(cv, r, 608, 380, 1.55, tint(GA, '#0a0f07', .34), nf=8, stalks=8, hmul=1.2)
    nipa(cv, r, 14, 366, 1.2, tint(GA, '#0a0f07', .4), nf=5, stalks=6, hmul=.8)
    return cv


# =====================================================================================
#  CẢNH 2 – XẺO QUÝT: rừng tràm, thảm bèo/lá xanh, xuồng gỗ dài chở khách
# =====================================================================================
GB = ['#0c2a10', '#123a14', '#1d5a22', '#288b31', '#4ebe5b', '#8cc188', '#b0c789', '#d3e0a0']   # xanh rừng tràm (tối -> sáng)
BARK = ['#4a4630', '#6f6a52', '#9a9578', '#c6c09a', '#e6e0bc', '#f4efd2']


def tram(cv, r, x, yt, yb, w, lean=0, tone=0):
    """Thân cây tràm: thon dần, vỏ bong trắng ngà, sáng trái – tối phải, vệt sẫm ngang."""
    n = max(2, int(yb - yt))
    for i in range(n):
        y = yt + i; k = i / n
        xc = x + lean * (1 - k)
        ww = max(2, w * (.55 + .45 * k))
        x0 = int(xc - ww / 2); x1 = int(xc + ww / 2)
        cv.hline(x0, y, x1 - x0 + 1, BARK[2 + tone] if tone < 3 else BARK[2])
        cv.hline(x0, y, max(1, int(ww * .35)), BARK[4])
        cv.hline(x0 + max(1, int(ww * .35)), y, max(1, int(ww * .3)), BARK[3])
        cv.px(x1, y, BARK[0]); cv.px(x1 - 1, y, BARK[1])
        if r.random() < .06:
            cv.hline(x0 + 1, y, max(1, int(ww * .6)), BARK[1])
        if r.random() < .03:
            cv.hline(x0, y, max(1, int(ww * .5)), BARK[5])


def leaf_oval(cv, r, x, y, rx, ry, cols, rot=0.0):
    """Lá nằm trên mặt nước: hình tim dẹt, mặt sáng phía trên-trái, gân giữa, mép tối phía dưới."""
    def heart(sx, sy, ox=0, oy=0):
        pts = []
        for i in range(22):
            a = i / 22 * 2 * math.pi
            hx = math.cos(a); hy = math.sin(a)
            notch = .34 * math.exp(-((a - 1.5 * math.pi) ** 2) / .12) if True else 0
            hy2 = hy * (1 - notch) if hy < 0 else hy
            if abs(a - 1.5 * math.pi) < .42:
                hy2 = hy * (1 - .45 * (1 - abs(a - 1.5 * math.pi) / .42))
            px_ = hx * sx; py_ = hy2 * sy
            pts.append((x + ox + px_ * math.cos(rot) - py_ * math.sin(rot), y + oy + px_ * math.sin(rot) + py_ * math.cos(rot)))
        return pts
    cv.poly(heart(rx, ry, 0, 1.5), cols[0])
    cv.poly(heart(rx * .96, ry * .92, -rx * .02, -ry * .08), cols[1])
    cv.poly(heart(rx * .66, ry * .6, -rx * .12, -ry * .22), cols[2])
    if rx > 8:
        cv.poly(heart(rx * .26, ry * .24, -rx * .26, -ry * .4), cols[3])
        cv.line(x - rx * .75, y - ry * .05, x + rx * .75, y + ry * .02, cols[1])


def vine(cv, r, x, y0, ln, cols):
    """Dây leo rủ: sợi mảnh + lá nhỏ hai bên."""
    px_ = x
    for i in range(int(ln)):
        y = y0 + i
        px_ += r.choice([0, 0, 0, -1, 1]) * (1 if r.random() < .3 else 0)
        cv.px(px_, y, cols[1])
        if r.random() < .55:
            side = r.choice([-2, -1, 1, 2])
            cv.px(px_ + side, y, cols[r.randint(2, 4)])
            if r.random() < .4:
                cv.px(px_ + side * 2, y + 1, cols[r.randint(3, 5)])


WATER_B = [(318, 262), (350, 250), (420, 246), (500, 252), (580, 262), (640, 270), (640, 360), (230, 360), (250, 330), (290, 292)]


def layer_sky_B():
    cv = Cv(); m = np.ones((H, W), bool)
    cv.grad(m, (0, 0), (0, 200), ['#5fb0de', '#7fc4e4', '#a9d8ea', '#d3ecee', '#eef4d0'], spread=.9)
    r = rngf(7)
    for cx, cy, rx, ry in [(150, 24, 70, 8), (330, 60, 50, 6), (60, 90, 40, 5)]:
        cloud(cv, r, cx, cy, rx, ry, '#eaf6f6', '#ffffff', None, '#cfe6ea')
    return cv


def layer_far_B():
    """Rừng nền phía sau: nhiều tầng xanh vàng, sương nắng."""
    cv = Cv(); r = rngf(17)
    for i in range(210):
        x = r.uniform(-10, 650); y = r.uniform(30, 252)
        k = (y - 30) / 222
        cols = [GB[2], GB[3], GB[4], GB[6]] if r.random() < .6 else [GB[3], GB[4], GB[6], GB[7]]
        cols = tint(cols, '#d3e0a0', .35 - .18 * k)
        clump(cv, r, x, y, 12 + 14 * r.random(), 7 + 8 * r.random(), 10, cols)
    # thảm cây bụi dưới gốc (che phần trời thấp, tối dần xuống nước)
    cv2 = Cv(); m = np.ones((H, W), bool)
    for i in range(240):
        x = r.uniform(-10, 650); y = r.uniform(196, 262)
        clump(cv, r, x, y, 16, 8, 22, [GB[0], GB[1], GB[2], GB[3]] if r.random() < .6 else [GB[1], GB[2], GB[3], GB[4]], rr_=(2, 3))
    # khoảng sáng lọt tán (hồ nắng phía xa)
    return cv


def layer_water_B():
    cv = Cv(); r = rngf(29)
    m = cv.mask(WATER_B)
    cv.grad(m, (0, 246), (0, 360), ['#8a8a3c', '#a58a3a', '#8a7a34', '#6b6a2c', '#3f4a1c'], spread=1.2)
    ml = cv.mask([(0, 206), (330, 258), (250, 360), (0, 360)])
    cv.grad(ml, (0, 206), (0, 360), ['#1d5a22', '#143f18', '#0c2a10'], spread=1.0)
    # phản chiếu thân tràm & trời: sọc dọc sáng/tối
    for i in range(70):
        x = r.randint(300, 640); y = r.randint(250, 340); ln = r.randint(4, 18)
        c = r.choice(['#d3e0a0', '#b0c789', '#e6e0bc', '#1d5a22', '#123a14', '#6b6a2c'])
        for yy in range(y, y + ln):
            if m[min(yy, H - 1)][x]:
                cv.px(x, yy, c); cv.px(x + 1, yy, c) if r.random() < .5 else None
    for i in range(1400):
        y = r.randint(246, 359); x = r.randint(240, 639)
        if not m[y][x]:
            continue
        k = (y - 246) / 114
        cv.rect(x, y, int(2 + k * 16 * r.random()), 1, r.choice(['#e6c466', '#f3dc8a', '#d3b04a', '#5a5a24', '#3f4a1c', '#b0c789']))
    for i in range(120):
        y = r.randint(250, 356); x = r.randint(250, 639)
        if m[y][x]:
            cv.px(x, y, '#fff3b8')
    return cv


def layer_mid_B():
    """Tràm: thân trắng ngà, tán lá xanh, dây leo phủ, thân đổ chéo."""
    cv = Cv(); r = rngf(37)
    # hàng thân phía xa (mảnh, mờ sương)
    for i in range(34):
        x = r.uniform(120, 640); yb = r.uniform(215, 255); yt = r.uniform(-10, 70)
        tram(cv, r, x, yt, yb, r.uniform(3, 5), r.uniform(-12, 12), tone=1)
        for j in range(3):
            clump(cv, r, x + r.uniform(-14, 14), yt + r.uniform(0, 40), 14, 9, 22, tint([GB[2], GB[3], GB[4], GB[6]], '#d3e0a0', .2), rr_=(1, 3))
    # tán lá dày ở phía trên
    for i in range(70):
        x = r.uniform(-10, 650); y = r.uniform(-6, 70)
        clump(cv, r, x, y, 22 + 16 * r.random(), 11 + 9 * r.random(), 40, [GB[1], GB[2], GB[3], GB[5]] if r.random() < .55 else [GB[2], GB[3], GB[4], GB[6]], rr_=(1, 3))
    # cụm cây bờ phải (tối hơn, có dây leo)
    for i in range(40):
        x = r.uniform(420, 660); y = r.uniform(70, 250)
        clump(cv, r, x, y, 14 + 12 * r.random(), 9 + 9 * r.random(), 30, [GB[1], GB[2], GB[3], GB[4]], rr_=(1, 3))
    # thân chính cỡ lớn
    for (x, yt, yb, w, lean) in [(520, -10, 290, 9, 14), (570, -10, 280, 8, -8), (610, 10, 270, 7, 6), (455, -10, 270, 6, -18), (150, -10, 262, 7, 22), (205, -10, 258, 5, 14), (90, 20, 262, 6, 12), (40, -10, 266, 6, 4)]:
        tram(cv, r, x, yt, yb, w, lean)
    # thân đổ chéo từ góc trên trái xuống giữa (rất đặc trưng)
    for i in range(300):
        k = i / 300
        x = 238 + (470 - 238) * k; y = -4 + (252 + 4) * k
        w = 13 - 7 * k
        cv.line(x - w / 2, y, x + w / 2, y, BARK[3], 1)
        cv.line(x - w / 2, y, x - w / 2 + max(1, w * .35), y, BARK[5], 1)
        cv.px(x + w / 2, y, BARK[0]); cv.px(x + w / 2 - 1, y, BARK[1])
        if r.random() < .12:
            cv.hline(x - w / 2 + 1, y, w * .6, BARK[1])
    # dây leo xanh phủ hai thân phải: rèm lá
    for i in range(60):
        x = r.uniform(440, 650); y0 = r.uniform(-4, 150); ln = r.uniform(40, 150)
        vine(cv, r, x, y0, ln, GB[1:7])
    for i in range(40):
        x = r.uniform(30, 260); y0 = r.uniform(0, 120); ln = r.uniform(30, 110)
        vine(cv, r, x, y0, ln, GB[1:7])
    # bụi cây cặp bờ
    for i in range(26):
        x = r.uniform(290, 650); y = r.uniform(236, 262)
        clump(cv, r, x, y, 12, 6, 10, [GB[0], GB[2], GB[3], GB[4]])
    return cv


def hull_side(cv, x0, y0, x1, y1, w0, w1, col, rim='#8a7a50', inner='#5a4a2a'):
    """Thân xuồng dài nhìn nghiêng: x0,y0 (mũi, xa) -> x1,y1 (đuôi, gần), bề rộng tăng dần theo phối cảnh."""
    N = 24
    top = []; bot = []
    for i in range(N + 1):
        t = i / N
        x = x0 + (x1 - x0) * t; y = y0 + (y1 - y0) * t
        w = w0 + (w1 - w0) * t
        sheer = math.sin(t * math.pi * .5) ** 4 * 3          # mũi vút lên
        top.append((x, y - w * .35 - (3 - sheer) * .0))
        bot.append((x, y + w * .65 * (1 - .55 * (1 - t) ** 6)))
    cv.poly(top + bot[::-1], shade(col, -.3))
    cv.poly([(a, b + 1) for a, b in top] + [(a, b - 2) for a, b in bot[::-1]], col)
    cv.poly([(a, b + 2) for a, b in top] + [(a, b + 5 + (a - x0) * .02) for a, b in top[::-1]], inner)
    for i in range(N):
        cv.line(*top[i], *top[i + 1], rim, 1)
    for i in range(N):
        cv.line(bot[i][0], bot[i][1] - 3, bot[i + 1][0], bot[i + 1][1] - 3, shade(col, .15), 1)
    return top, bot


def anim_row_B(frames=8):
    """Xuồng gỗ dài (khung 340x124): người nón lá chống/chèo ở mũi, ba khách ngồi hướng ra máy; mái chèo đưa nhịp."""
    fw, fh = 340, 124
    strip = Image.new('RGBA', (fw * frames, fh), (0, 0, 0, 0))
    for f in range(frames):
        cv = Cv(fw, fh); ph = f / frames * 2 * math.pi
        sw = math.sin(ph)
        bob = round(math.sin(ph * 2) * .6)
        y0, y1 = 42 + bob, 78 + bob
        # bóng thuyền
        cv.dpoly([(12, 62), (330, 100), (330, 112), (12, 76)], '#1d3a14', lambda x, y: .55)
        top, bot = hull_side(cv, 8, y0, 332, y1, 13, 30, '#3a2f1c')
        def at(t):
            return top[int(t * 24)]
        # khách (từ xa -> gần): ngồi trên ván, hướng ra máy
        for t, sh, hat, lh, sc in [(.08, '#c9433a', False, False, 1.0), (.17, '#f1ede0', False, False, 1.02), (.52, '#c9433a', False, True, 1.3),
                                   (.7, '#58b8c8', False, True, 1.36), (.9, '#c0509a', False, True, 1.42)]:
            x, y = at(t)
            person(cv, x, y + 12 * sc, sc, sh, hat=hat, hair='#e0c070' if t > .85 else '#1a1410', long_hair=lh, arm=(t > .4))
        # người đứng ở mũi: áo đen, nón lá, nghiêng người theo nhịp chèo
        x, y = at(.31)
        lean = sw * 2.2
        person(cv, x + lean, y + 14, 1.3, '#1c1c24', hat=True, stand=True, hat_c='#e0cf9e', hat_d='#b09c66')
        hx, hy = x + 12 + sw * 5, y - 6
        ang = math.radians(60 + sw * 22)
        ex, ey = hx + math.cos(ang) * 64, hy + math.sin(ang) * 40 + 22
        cv.line(hx, hy, ex, ey, '#6b4a24', 2); cv.line(hx + 1, hy, ex + 1, ey, '#a07a42', 1)
        cv.ell(ex, ey + 1, 5, 2, '#3a2f1c')
        strip.paste(cv.im, (f * fw, 0))
    strip.save(os.path.join(ANI, 'row_xeo_quyt.png'), optimize=True)


def layer_boats_B():
    return Cv()


def layer_fore_B():
    """Thảm lá xanh gần máy (nửa dưới bên trái), lá rủ ở mép trên, cành thò vào khung."""
    cv = Cv(); r = rngf(59)
    LC = [['#0c2a10', '#1d6a2a', '#4ebe5b', '#b8e8a0'], ['#123a14', '#2b9a3a', '#6ad46a', '#d3f0b0'], ['#1d5a22', '#3aa646', '#8cd890', '#e6f6c8'], ['#0c2a10', '#2b8f3c', '#58c868', '#c4eeb0']]
    pts = []
    for i in range(520):
        x = r.uniform(-20, 420); y = r.uniform(196, 372)
        edge = max(0, (x - 250) / 170)                   # mật độ giảm dần sang phải (chừa nước cho xuồng)
        if y < 200 + edge * 120 and r.random() < .5:
            continue
        if x > 270 and y < 272 and r.random() < .75:
            continue
        k = (y - 196) / 176
        pts.append((y, x, 7 + 20 * k * r.uniform(.7, 1.25)))
    for y, x, rx in sorted(pts):
        leaf_oval(cv, r, x, y, rx, rx * .62, r.choice(LC), rot=r.uniform(-.5, .5))
    # lá rủ phía trên
    for i in range(36):
        x = r.choice([r.uniform(-10, 120), r.uniform(560, 650)]); y = r.uniform(-6, 30)
        frond(cv, r, (x, y), (x + r.uniform(-14, 14), y + 30), (x + r.uniform(-20, 20), y + r.uniform(60, 120)), 14, 11, GB[1:7], grav=.55, spread=62, bias=.15)
    return cv


# =====================================================================================
#  CẢNH 3 – CHỢ NỔI NGÃ NĂM: bình minh trên sông, nhà ven bờ, ghe mái bạt xanh, cây bẹo
# =====================================================================================
GC = ['#10201c', '#1f3a2c', '#2f5a40', '#3d6a4a', '#58885a', '#7fa878', '#a9bfa0']
WATER_C = [(0, 216), (150, 210), (300, 203), (402, 198), (438, 178), (448, 152), (488, 152), (500, 178), (524, 202), (566, 212), (640, 216), (640, 360), (0, 360)]


def layer_sky_C():
    cv = Cv(); m = np.ones((H, W), bool)
    cv.grad(m, (0, 0), (0, 200), ['#4aa8d8', '#62b6dc', '#83c1d8', '#b4d2d8', '#d9dfc9', '#efdfb0', '#f6d9a0'], spread=.9)
    r = rngf(9)
    for cx, cy, rx, ry in [(90, 40, 120, 3), (300, 62, 150, 3), (520, 34, 110, 3), (210, 100, 90, 2), (470, 92, 120, 3), (40, 120, 70, 2), (600, 130, 80, 2)]:
        cloud(cv, r, cx, cy, rx, ry, '#c9dfe6', '#eef2e4', None, '#9cc0d0')
    cv.dpoly([(300, 90), (640, 90), (640, 200), (300, 200)], '#f6d9a0', lambda x, y: .55 * max(0, 1 - abs(x - 470) / 190) * max(0, (y - 90) / 110))
    return cv


def palm_tree(cv, r, x, yb, h, cols=None):
    cols = cols or GC
    for i in range(int(h)):
        y = yb - i; xx = x + math.sin(i / h * 2.4) * 2.5
        cv.rect(xx - 1, y, 2, 1, '#4a4a38' if i % 3 else '#6a6a50')
    tx = x + 2; ty = yb - h
    for a in (-2.9, -2.4, -1.9, -1.35, -.9, -.4, .05, .35):
        L = h * .5
        frond(cv, r, (tx, ty), (tx + math.cos(a) * L * .6, ty + math.sin(a) * L * .6 - 3), (tx + math.cos(a) * L, ty + math.sin(a) * L + L * .4), 10, L * .3, cols, grav=.5, spread=50, bias=.1)


def layer_far_C():
    cv = Cv(); r = rngf(13)
    for i in range(150):
        x = r.uniform(-10, 560); y = r.uniform(112, 152)
        cols = tint(GC[1:6], '#a9bfa0', .2 + .3 * max(0, (x - 250) / 350))
        clump(cv, r, x, y, 18, 8, 16, cols, rr_=(2, 4))
    for x in (120, 188, 232, 276, 326, 372):
        palm_tree(cv, r, x + r.uniform(-6, 6), 152, r.uniform(34, 52), tint(GC, '#a9bfa0', .15))
    # khúc sông xa: nhà thấp mờ sương hai bên cửa sông
    for (x, w, h, c) in [(404, 30, 14, '#b8c4b0'), (440, 24, 12, '#c7cfbc'), (500, 26, 13, '#c0c8b4'), (524, 34, 18, '#a8b8a8')]:
        cv.rect(x, 150 - h, w, h, c); cv.poly([(x - 2, 150 - h), (x + w // 2, 150 - h - 6), (x + w + 2, 150 - h)], '#9a8a76')
    return cv


def layer_water_C():
    cv = Cv(); r = rngf(43)
    m = cv.mask(WATER_C)
    cv.grad(m, (0, 150), (0, 360), ['#e4d9ae', '#a9c6c4', '#6fa3b8', '#5a8fa8', '#406985', '#33576f', '#274560'], spread=1.15)
    # vệt vàng phản chiếu bình minh ở cửa sông và giữa dòng
    for (x0, x1) in [(440, 500)]:
        cv.dpoly([(x0, 150), (x1, 150), (x1 + 90, 360), (x0 - 70, 360)], '#f1dca0', lambda x, y: .8 * max(0, 1 - (y - 150) / 160) ** 1.1, clip=m)
    cv.dpoly([(330, 210), (480, 210), (520, 360), (260, 360)], '#d9c88c', lambda x, y: .3 * max(0, 1 - (y - 210) / 150), clip=m)
    # bóng bờ phản chiếu: dải tối + màu mái nhà
    for y in range(204, 262):
        for x in range(0, 640):
            if not m[y][x]:
                continue
            k = 1 - (y - 204) / 58
            if x < 410 and BAY[y & 3][x & 3] < k * .8:
                cv.px(x, y, '#1f2f2c' if (x // 7 + y // 3) % 3 else '#324a46')
            elif x > 520 and BAY[y & 3][x & 3] < k * .7:
                cv.px(x, y, '#3a4a58' if (x // 6) % 2 else '#7a5a5a')
    # gợn sóng
    for i in range(2600):
        y = int(152 + (r.random() ** .8) * 207); k = (y - 150) / 210; x = r.randint(0, 639)
        if not m[min(y, H - 1)][x]:
            continue
        cv.rect(x, y, int(2 + k * 24 * r.random()), 1, r.choice(['#b4d2d8', '#83c1d8', '#83c1d8', '#1c2e31', '#2d4f66', '#f3dcae', '#588fa7']))
    for i in range(200):
        y = r.randint(210, 358); x = r.randint(300, 560)
        if m[y][x]:
            cv.px(x, y, '#fff3d0'); cv.px(x + 1, y, '#fff3d0')
    return cv


def house(cv, r, x, yb, w, h, wall, roof, kind=0):
    cv.rect(x, yb - h, w, h, wall)
    cv.rect(x + w - 3, yb - h, 3, h, shade(wall, -.22))
    cv.hline(x, yb - h, w, shade(wall, .2))
    cv.poly([(x - 2, yb - h), (x + 3, yb - h - 7), (x + w - 3, yb - h - 7), (x + w + 2, yb - h)], roof)
    cv.hline(x - 2, yb - h, w + 4, shade(roof, -.35))
    cv.hline(x + 3, yb - h - 7, w - 6, shade(roof, .25))
    for i in range(3, w - 3, 5):
        cv.px(x + i, yb - h - 3, shade(roof, -.2))
    if kind == 0:                                  # cửa + cửa sổ
        cv.rect(x + 4, yb - h * .58, 6, h * .58, '#2a2a30'); cv.rect(x + w * .55, yb - h * .66, 6, 7, '#3a4a58')
    elif kind == 1:                                # mái hiên bạt
        cv.poly([(x - 1, yb - h * .62), (x + w + 1, yb - h * .62), (x + w + 5, yb - h * .38), (x - 5, yb - h * .38)], r.choice(['#2f9f8f', '#3a74c4', '#d8602a']))
        cv.rect(x + 3, yb - h * .38, w - 6, h * .38, '#4a3a2c')
    else:
        cv.rect(x + 3, yb - h * .5, w - 6, 5, '#7a9aa8'); cv.rect(x + 3, yb - h * .3, w - 6, 3, '#3a2a20')


def lamp(cv, x, yb, h, side=1):
    cv.line(x, yb, x, yb - h, '#4a5058', 2)
    cv.line(x, yb - h, x + 9 * side, yb - h - 3, '#4a5058', 1)
    cv.rect(x + 8 * side, yb - h - 4, 6, 3, '#d8d2b0'); cv.hline(x + 8 * side, yb - h - 4, 6, '#fff3d0')


def layer_mid_C():
    cv = Cv(); r = rngf(47)
    # --- bờ trái ---
    cv.rect(0, 202, 402, 14, '#6a6658')                      # kè bờ
    cv.rect(0, 202, 402, 2, '#a8a490'); cv.rect(0, 213, 402, 3, '#3a3a34')
    for x in range(0, 402, 14):
        cv.vline = None
        cv.line(x, 204, x, 213, '#55524a', 1)
    wall = ['#e8e0c8', '#c9d6d8', '#d98a6a', '#e9c27a', '#b9d0c8', '#efe9d6']
    roof = ['#7a8a8e', '#a85a3a', '#5a7f9a', '#8a6a5a', '#9a9a9a']
    x = -6
    while x < 400:
        w = r.randint(24, 44); h = r.randint(20, 36)
        house(cv, r, x, 204, w, h, r.choice(wall), r.choice(roof), r.choice([0, 1, 1, 2]))
        x += w + r.randint(0, 5)
    for x in (24, 68, 176, 330):
        lamp(cv, x, 204, r.randint(46, 66), 1)
    for x in (116, 244, 360):
        palm_tree(cv, r, x, 190, r.randint(54, 72), GC)
    # cột điện + dây
    for x in (50, 210, 390):
        cv.line(x, 204, x, 128, '#2f2f34', 2); cv.hline(x - 8, 132, 17, '#2f2f34'); cv.hline(x - 6, 138, 13, '#2f2f34')
    # --- bờ phải: nhà hồng + nhà xanh có biển đỏ + cây ---
    cv.rect(504, 204, 136, 12, '#6a6658'); cv.rect(504, 204, 136, 2, '#a8a490')
    for i in range(10):
        clump(cv, r, 540 + i * 12, 150 + r.uniform(-12, 8), 16, 10, 14, [GC[1], GC[2], GC[3], GC[5]], rr_=(2, 4))
    cv.rect(556, 118, 84, 34, '#e8a5a0'); cv.rect(556, 118, 84, 3, '#f8d0c8'); cv.rect(556, 118, 4, 34, '#b87a78')
    for i in range(6):
        cv.rect(562 + i * 13, 128, 7, 9, '#7a5a5a')
    cv.poly([(552, 118), (560, 108), (640, 108), (640, 118)], '#d9d4c4')
    cv.rect(536, 152, 104, 52, '#4a76b8'); cv.rect(536, 152, 104, 3, '#8ab0e0')
    cv.poly([(530, 152), (540, 144), (640, 144), (640, 152)], '#2f55a0')
    cv.rect(560, 160, 80, 12, '#d8403a')
    for i in range(7):
        cv.rect(566 + i * 10, 163, 6, 5, '#f4efe0')
    cv.rect(540, 176, 100, 28, '#d9d4c4'); cv.rect(540, 176, 100, 2, '#8a8678')
    for i in range(6):
        cv.rect(546 + i * 16, 182, 10, 22, '#2a5aa0'); cv.rect(546 + i * 16, 182, 10, 3, '#8ab0e0')
    cv.rect(572, 186, 10, 18, '#3a3a40'); cv.rect(600, 186, 10, 18, '#3a3a40')
    # --- mép sông giữa (bờ cây ở cửa sông) ---
    for i in range(14):
        clump(cv, r, 404 + i * 6, 176 + r.uniform(-6, 12), 12, 7, 10, [GC[1], GC[2], GC[3], GC[4]], rr_=(2, 3))
    for i in range(14):
        clump(cv, r, 492 + i * 5, 176 + r.uniform(-6, 12), 12, 7, 10, [GC[1], GC[2], GC[3], GC[4]], rr_=(2, 3))
    return cv


BOATC = {
    'blue':  dict(hull='#2a2018', trim='#d79a3a', roof='#2f6fd0', hi='#5a9af0', cargo=['#4ebe5b', '#c9433a', '#f0c840']),
    'teal':  dict(hull='#3a2a1c', trim='#e0b050', roof='#2fa6a0', hi='#5ad0c8', cargo=['#d8602a', '#f0c840', '#4ebe5b']),
    'open':  dict(hull='#2a2018', trim='#c0603a', roof=None, hi=None, cargo=['#2f8a3c', '#f0c840', '#d8602a', '#8cc060']),
    'green': dict(hull='#2e2418', trim='#d79a3a', roof='#3a9a50', hi='#70d080', cargo=['#2c6ac4', '#2c6ac4', '#f0c840']),
}


def market_boat(cv, r, cx, cy, s, kind='blue', flip=False, pole=False, rower=True):
    c = BOATC[kind]; f = -1 if flip else 1
    def X(x): return cx + x * s * f
    def Y(y): return cy + y * s
    def poly(pts, col): cv.poly([(X(a), Y(b)) for a, b in pts], col)
    # bóng nước
    cv.dpoly([(X(-52), Y(8)), (X(52), Y(8)), (X(44), Y(15)), (X(-46), Y(15))], '#10202a', lambda a, b: .75)
    # thân ghe (mũi vút cao)
    poly([(-58, -4), (-54, 9), (42, 9), (62, -10), (54, -4)], c['hull'])
    poly([(-56, -2), (-52, 7), (40, 7), (56, -7), (50, -2)], shade(c['hull'], .18))
    cv.line(X(-58), Y(-4), X(54), Y(-4), c['trim'], max(1, int(s * 1.4)))
    cv.line(X(54), Y(-4), X(62), Y(-10), c['trim'], max(1, int(s * 1.4)))
    cv.line(X(-54), Y(1), X(48), Y(1), shade(c['trim'], -.35), 1)
    # hàng hoá
    if c['roof'] is None:
        for i in range(int(14 * 1)):
            x = r.uniform(-46, 40); y = r.uniform(-12, -3)
            col = r.choice(c['cargo'])
            cv.circ(X(x), Y(y), max(1, 3.4 * s), col); cv.px(X(x) - s, Y(y) - s, shade(col, .4))
        for i in range(2):
            x = r.uniform(-30, 20)
            cv.circ(X(x), Y(-14), max(1, 4 * s), '#f0b030')
            cv.line(X(x), Y(-18), X(x), Y(-22), '#2f8a3c', max(1, int(s)))
    else:
        poly([(-44, -4), (-42, -20), (-24, -29), (24, -29), (42, -20), (44, -4)], c['roof'])
        poly([(-40, -22), (-22, -28), (22, -28), (38, -22), (36, -24), (-38, -24)], c['hi'])
        cv.line(X(-44), Y(-4), X(44), Y(-4), shade(c['roof'], -.4), 1)
        for xx in (-30, -14, 4, 22, 36):
            cv.line(X(xx), Y(-27), X(xx + 1), Y(-5), shade(c['roof'], -.25), 1)
        cv.ell(X(-30 if flip else 38), Y(-12), max(2, 5 * s), max(2, 7 * s), '#1a1612')    # miệng mái
        for i in range(6):
            x = r.uniform(30, 52); col = r.choice(c['cargo'])
            cv.circ(X(x), Y(-5), max(1, 3 * s), col)
    if pole:
        cv.line(X(52), Y(-6), X(56), Y(-58), '#6a5030', max(1, int(s)))
        for i in range(7):
            col = r.choice(['#f0c840', '#2f8a3c', '#d8602a', '#e8e0c8'])
            cv.rect(X(55) - 1 * s, Y(-52 + i * 7), max(2, 4 * s), max(2, 5 * s), col)
    if rower:
        person(cv, X(-36), Y(0), s * .78, r.choice(['#e8e0c8', '#c9433a', '#3a74c4', '#d8a03a']), hat=True, stand=True, hat_c='#e0cf9e', hat_d='#b09c66')


def layer_boats_C():
    cv = Cv(); r = rngf(53)
    far = [(470, 170, .24, 'blue', False), (486, 178, .26, 'teal', True), (456, 186, .3, 'open', False), (478, 192, .3, 'blue', False)]
    mid = [(300, 238, .50, 'teal', False, False), (352, 236, .48, 'blue', True, False), (398, 240, .52, 'open', True, True), (262, 242, .55, 'blue', False, False),
           (330, 252, .66, 'open', False, True), (406, 260, .70, 'blue', True, False), (284, 264, .78, 'teal', False, False), (358, 274, .86, 'blue', False, True),
           (226, 248, .50, 'open', False, False), (524, 242, .55, 'blue', True, False), (592, 254, .56, 'teal', False, False), (80, 246, .50, 'open', False, False)]
    for (x, y, s, k, fl) in far:
        market_boat(cv, r, x, y, s, k, fl, rower=False)
    for (x, y, s, k, fl, pole) in sorted(mid, key=lambda a: a[1]):
        market_boat(cv, r, x, y, s, k, fl, pole)
    market_boat(cv, r, 440, 302, 1.05, 'green', False, False, rower=True)
    return cv


def anim_row_C(frames=8):
    """Ghe nhỏ có người đứng chèo (khung 150x100): hàng hoá xanh, mái chèo đưa nhịp."""
    fw, fh = 150, 100
    strip = Image.new('RGBA', (fw * frames, fh), (0, 0, 0, 0))
    for f in range(frames):
        cv = Cv(fw, fh); ph = f / frames * 2 * math.pi
        sw = math.sin(ph); r = rngf(77)
        market_boat(cv, r, 75, 62 + round(math.sin(ph * 2) * .6), 1.0, 'open', False, False, rower=False)
        x = 112; y = 60
        person(cv, x + sw * 1.5, y + 3, .95, '#c9433a', hat=True, stand=True, hat_c='#e0cf9e', hat_d='#b09c66')
        hx, hy = x + 8, y - 16 + sw * 2
        ang = math.radians(100 - sw * 24)
        ex, ey = hx + math.cos(ang) * 40, hy + math.sin(ang) * 34 + 14
        cv.line(hx, hy, ex, ey, '#6b4a24', 2); cv.line(hx + 1, hy, ex + 1, ey, '#a07a42', 1)
        cv.ell(ex, ey + 1, 4, 2, '#3a2f1c')
        strip.paste(cv.im, (f * fw, 0))
    strip.save(os.path.join(ANI, 'row_nga_nam.png'), optimize=True)


def layer_fore_C():
    cv = Cv(); r = rngf(61)
    for (x, y, n) in [(40, 330, 16), (96, 346, 12), (570, 336, 14), (620, 318, 10), (330, 352, 8)]:
        for j in range(n):
            blob_leaf(cv, r, x + r.randint(-22, 22), y + r.randint(-6, 6), r.randint(4, 7), ['#1f3a2c', '#3d6a4a', '#7fa878', '#b4d89a'])
        for j in range(n // 3):
            cv.px(x + r.randint(-18, 18), y + r.randint(-9, 0) - 4, '#c9a0d8')
    market_boat(cv, r, 28, 290, 1.1, 'open', False, False, rower=False)
    person(cv, 40, 288, .9, '#58a8d8', hat=True, stand=True, hat_c='#e0cf9e', hat_d='#b09c66')
    return cv



# =====================================================================================
#  ĐỢT SỬA 2: xuồng Bến Tre đúng phối cảnh · rừng tràm dựng thẳng + thảm bèo · chợ nổi xếp lại
# =====================================================================================
def xuong(cv, cx, cy, s, col, shirts, tilt=-.10, Wd=42, L=80, bob=0, stand0=False):
    """Xuồng nhìn từ phía trên-sau, mũi chúc về người xem (rút ngắn theo phối cảnh).
    Người ngồi TRONG lòng thuyền: xa vẽ trước, gần vẽ sau; mũi thuyền (boong) che phần thân dưới của người gần nhất."""
    top, bot = -L * .5, L * .5
    N = 14

    def P(x, y):
        return (cx + x * s + y * s * tilt, cy + y * s + bob)

    def hw(t, k):
        return Wd * k * (.80 + .20 * math.sin(math.pi * min(1, t * 1.05))) * (1 - t ** 2.4 * .97)

    def ring(k, t0=0., t1=1.):
        ts = [t0 + (t1 - t0) * i / N for i in range(N + 1)]
        return [P(-hw(t, k), top + (bot - top) * t) for t in ts] + [P(hw(t, k), top + (bot - top) * t) for t in ts[::-1]]
    # bóng + vệt nước quanh thân
    sx, sy = P(0, L * .08)
    cv.dpoly([(sx + math.cos(a / 12 * 6.283) * Wd * .70 * s, sy + 4 * s + math.sin(a / 12 * 6.283) * L * .46 * s) for a in range(12)], '#473923', lambda a, b: .45)
    cv.poly(ring(.66), shade(col, -.45))
    cv.poly(ring(.6), col)
    # lòng thuyền
    cv.poly(ring(.46, 0, .74), '#a98343')
    cv.poly(ring(.46, .5, .74), '#8a6a37')
    n = len(shirts)
    ys = [top + 11 + j * (L * .5 - 4) / max(1, n - 1) for j in range(n)] if n > 1 else [top + 14]
    pos = []
    for j, sh in enumerate(shirts):
        px_, py_ = P(0, ys[j])
        sc = (1.12 + .16 * j / max(1, n - 1)) * s
        base = py_ + 8 * sc
        if j == 0 and stand0:
            person(cv, px_, base, sc * 1.1, sh, hat=False, stand=True, hair='#121018')
        else:
            person(cv, px_, base, sc, sh, hat=True, hat_c='#d8c393', hat_d='#a98f58', arm=(j > 0))
        pos.append((px_, base, sc))
    # thành thuyền hai bên phủ lên cánh tay + boong mũi che thân dưới người gần nhất
    deck = ring(.6, .56, 1.0)
    cv.poly(deck, col)
    cv.poly(ring(.6, .56, .62), shade(col, .12))
    for i in range(N):
        t0, t1 = i / N, (i + 1) / N
        for sg in (-1, 1):
            a = P(sg * hw(t0, .6), top + (bot - top) * t0); b = P(sg * hw(t1, .6), top + (bot - top) * t1)
            cv.line(*a, *b, '#e9e3cf', 1)
    cv.line(*P(-hw(0, .6), top), *P(hw(0, .6), top), '#e9e3cf', 2)
    # mũi + gợn nước đầu mũi
    bx, by = P(0, bot)
    cv.line(bx, by, bx, by - 6 * s, shade(col, -.35), 1)
    for k in range(5):
        cv.hline(bx - (6 + k * 3) * s, by + 1 + k, (12 + k * 6) * s, '#f3e6c4' if k < 2 else '#c9b98a') if k % 2 == 0 else None
    return P, pos, top


def layer_boats_A():
    cv = Cv()
    specs = [(357, 160, .20, '#8a6a3c', ['#c9433a', '#2a4e7a']), (350, 175, .27, '#3b6aa3', ['#e8e0c8', '#4d8a5a']),
             (343, 196, .36, '#8a6a3c', ['#5a7ab8', '#c9433a']), (357, 224, .50, '#a08050', ['#d4a843', '#e8e0c8', '#8a4a6a']),
             (331, 258, .64, '#3a73b8', ['#e8e0c8', '#2a4e7a', '#c9433a']), (262, 322, .82, '#8c6a3a', ['#e8e0c8', '#4d8a5a', '#d4a843'])]
    for (x, y, sc, hc, sh) in specs:
        xuong(cv, x, y, sc, hc, sh)
    return cv


def anim_row_A(frames=8):
    """Xuồng xanh gần máy: người đứng chèo ở đuôi, hai khách ngồi; 8 khung 150x140."""
    fw, fh = 150, 140
    strip = Image.new('RGBA', (fw * frames, fh), (0, 0, 0, 0))
    for f in range(frames):
        cv = Cv(fw, fh); ph = f / frames * 2 * math.pi
        sw = math.sin(ph); bob = round(math.sin(ph * 2) * .6)
        P, pos, top = xuong(cv, 75, 84, 1.0, '#2f69b0', ['#3d5f9a', '#8a4a8a', '#e8e0c8'], Wd=44, L=84, bob=bob, stand0=True)
        px_, py_, sc = pos[0]
        hx, hy = px_ + 12 + sw * 5, py_ - 16 + sw * 2
        cv.line(px_ + 7, py_ - 22, hx, hy, '#c98f5e', 2)
        ang = math.radians(150 - sw * 26)
        ex, ey = hx + math.cos(ang) * 70, hy + math.sin(ang) * 36 + 26
        cv.line(hx, hy, ex, ey, '#8a6c3a', 2); cv.line(hx + 1, hy, ex + 1, ey, '#c0994f', 1)
        cv.ell(ex, ey + 1, 6, 2, '#6a5c37')
        strip.paste(cv.im, (f * fw, 0))
    strip.save(os.path.join(ANI, 'row_ben_tre.png'), optimize=True)


def layer_over_A():
    """Tàu lá dừa nước rủ ra mặt rạch: vẽ SAU thuyền nên che bớt thân thuyền sát bờ, đúng thực tế."""
    cv = Cv(); r = rngf(71)
    cols = tint(GA, '#0e140a', .08)
    for (bx, by, d) in [(500, 332, -1), (482, 288, -1), (459, 248, -1), (434, 212, -1), (406, 180, -1), (384, 158, -1),
                        (14, 308, 1), (104, 268, 1), (166, 236, 1), (222, 206, 1), (266, 182, 1), (306, 162, 1)]:
        k = .35 + (by - 140) / 220
        for j in range(2):
            L = (50 + 24 * j) * k
            tip = (bx + d * L * .95, by + 4 * k + j * 5 * k)
            ctl = (bx + d * L * .4, by - L * .75)
            frond(cv, r, (bx, by - 4 * k), ctl, tip, int(12 + 8 * k), max(4, 15 * k), cols, grav=.45, spread=52, bias=.18)
    return cv


# ---------- Xẻo Quýt: bèo ----------
def beo(cv, r, x, y, rx):
    """Bèo nằm phẳng trên mặt nước: cụm lá tròn dẹt, mép tối, giữa sáng."""
    ry = max(1.2, rx * .46)
    c = r.choice([('#1d5a22', '#2f9a3a', '#6ad060', '#b8ec98'), ('#1d5a22', '#3aa646', '#7ed870', '#c8f2a8'), ('#123a14', '#288b31', '#58c860', '#a9e4a0')])
    cv.ell(x, y + 1, rx, ry, c[0])
    cv.ell(x, y, rx * .94, ry * .88, c[1])
    cv.ell(x - rx * .1, y - ry * .18, rx * .62, ry * .6, c[2])
    if rx > 5:
        cv.ell(x - rx * .2, y - ry * .3, rx * .26, ry * .26, c[3])
        for a in (0, 2.1, 4.2):
            cv.line(x, y, x + math.cos(a) * rx * .7, y + math.sin(a) * ry * .7, c[1])


def beo_edge(y):
    return 292 + (y - 214) * .55


def beo_carpet(cv, r, y0=214, y1=362, ymin=0, ymax=999):
    y = y0
    while y < y1:
        k = (y - y0) / (y1 - y0)
        rx = 3 + 15 * k
        x = -8 + r.uniform(0, rx)
        while x < beo_edge(y) + r.uniform(-14, 14) + 8 * math.sin(y * .09):
            if ymin <= y < ymax and r.random() < .9:
                beo(cv, r, x + r.uniform(-2, 2), y + r.uniform(-1, 1), rx * r.uniform(.8, 1.15))
            x += rx * 1.45
        y += rx * .62


def layer_water_B():
    cv = Cv(); r = rngf(29)
    m = cv.mask(WATER_B)
    cv.grad(m, (0, 246), (0, 360), ['#8a8a3c', '#a58a3a', '#8a7a34', '#6b6a2c', '#3f4a1c'], spread=1.2)
    ml = cv.mask([(0, 206), (330, 258), (250, 360), (0, 360)])
    cv.grad(ml, (0, 206), (0, 360), ['#1d4a1c', '#143418', '#0c2a10'], spread=1.0)
    for i in range(60):                                         # phản chiếu thân tràm + trời
        x = r.randint(310, 639); y = r.randint(252, 340); ln = r.randint(4, 14)
        c = r.choice(['#d3e0a0', '#b0c789', '#e6e0bc', '#1d5a22', '#6b6a2c'])
        for yy in range(y, y + ln):
            if m[min(yy, H - 1)][x]:
                cv.px(x, yy, c)
    for i in range(1000):
        y = r.randint(250, 359); x = r.randint(300, 639)
        if m[y][x]:
            k = (y - 246) / 114
            cv.rect(x, y, int(2 + k * 14 * r.random()), 1, r.choice(['#e6c466', '#f3dc8a', '#d3b04a', '#5a5a24', '#3f4a1c', '#b0c789']))
    # thảm bèo (phía xa -> gần, cỡ lá lớn dần), vài mảng trôi lẻ trên vùng nước xuồng chạy
    beo_carpet(cv, r, 214, 300)
    for (x, y) in [(352, 264), (372, 300), (402, 330), (338, 292)]:
        for j in range(5):
            beo(cv, r, x + r.randint(-14, 14), y + r.randint(-4, 4), r.randint(5, 9))
    return cv


def layer_far_B():
    cv = Cv(); r = rngf(17)
    for row, (y, cnt, rr) in enumerate([(60, 34, 30), (112, 40, 28), (164, 46, 26), (214, 52, 22)]):
        for i in range(cnt):
            x = -10 + i * (660 / cnt) + r.uniform(-6, 6); yy = y + r.uniform(-16, 16)
            cols = tint([GB[2], GB[3], GB[4], GB[6]], '#d3e0a0', .5 - .07 * row)
            clump(cv, r, x, yy, rr, rr * .6, 22, cols, rr_=(2, 3))
    return cv


def layer_mid_B():
    cv = Cv(); r = rngf(37)
    # lớp thân: dựng thẳng đứng theo ba tầng phối cảnh (xa mảnh/nhạt, gần to/rõ)
    for x in range(86, 650, 21):
        tram(cv, r, x + r.randint(-4, 4), -4, 232, 3, r.choice([0, 0, 1, -1]), tone=1)
    for x in range(40, 650, 53):
        tram(cv, r, x + r.randint(-8, 8), -4, 248, 5, r.choice([0, 0, 1]), tone=2)
    for x in (24, 118, 188, 506, 566, 622):
        tram(cv, r, x, -4, 266, 9 if x in (506, 566) else 7, 0, tone=0)
    # tán lá: dải cao trên đỉnh, chừa các ô trời phía trái-giữa
    for i in range(30):
        x = -10 + i * 22 + r.uniform(-4, 4)
        if not (30 < x < 300):
            clump(cv, r, x, 6 + r.uniform(-4, 6), 26, 11, 36, [GB[1], GB[2], GB[3], GB[5]], rr_=(1, 3))
        clump(cv, r, x + 8, 36 + r.uniform(-6, 8), 28, 12, 36, [GB[2], GB[3], GB[4], GB[6]], rr_=(1, 3))
    # khối cây bờ phải (gọn): ba hàng bụi + dây leo rủ thẳng
    for yy in (100, 150, 200):
        for i in range(10):
            clump(cv, r, 440 + i * 22 + r.uniform(-4, 4), yy + r.uniform(-8, 8), 24, 14, 34, [GB[1], GB[2], GB[3], GB[4]], rr_=(1, 3))
    # thân đổ chéo (giữ nguyên nét đặc trưng)
    for i in range(300):
        k = i / 300
        x = 238 + (470 - 238) * k; y = -4 + (252 + 4) * k
        w = 13 - 7 * k
        cv.line(x - w / 2, y, x + w / 2, y, BARK[3], 1)
        cv.line(x - w / 2, y, x - w / 2 + max(1, w * .35), y, BARK[5], 1)
        cv.px(x + w / 2, y, BARK[0]); cv.px(x + w / 2 - 1, y, BARK[1])
        if r.random() < .12:
            cv.hline(x - w / 2 + 1, y, w * .6, BARK[1])
    for i in range(16):
        vine(cv, r, 470 + i * 11 + r.randint(-3, 3), 20 + r.randint(0, 40), r.uniform(70, 150), GB[1:7])
    # hàng bụi thấp sát nước (gọn, đều)
    for i in range(34):
        clump(cv, r, 300 + i * 11, 246 + r.uniform(-3, 5), 12, 6, 14, [GB[0], GB[2], GB[3], GB[4]], rr_=(2, 3))
    return cv


def layer_fore_B():
    """Bèo gần máy: lá to hơn, nằm phẳng trên mặt nước (nửa dưới bên trái)."""
    cv = Cv(); r = rngf(59)
    y = 296
    while y < 372:
        k = (y - 296) / 76
        rx = 14 + 14 * k
        x = -10 + r.uniform(0, rx)
        while x < beo_edge(y) + 6 + 14 * k + 6 * math.sin(y * .1):
            beo(cv, r, x + r.uniform(-3, 3), y + r.uniform(-2, 2), rx * r.uniform(.85, 1.15))
            x += rx * 1.4
        y += rx * .6
    return cv



# ---------- Xẻo Quýt (bản chỉnh theo thực tế): rừng tràm gọn, thân thẳng, tán liền khối, bèo mịn ----------
def layer_far_B():
    """Vách rừng xa: các hàng bụi tán dày, mờ sương dần về xa – liền khối, không còn chấm lá rải rác trên trời."""
    cv = Cv(); r = rngf(17)
    for row, (y, cnt, rr, hz) in enumerate([(92, 30, 26, .62), (128, 34, 24, .55), (166, 38, 22, .48), (204, 44, 20, .40), (236, 50, 16, .34)]):
        for i in range(cnt + 1):
            x = -10 + i * (660 / cnt) + r.uniform(-4, 4)
            cols = tint([GB[2], GB[3], GB[4], GB[6]], '#d3e0a0', hz)
            clump(cv, r, x, y + r.uniform(-6, 6), rr * 1.1, rr * .7, 26, cols, rr_=(2, 3))
    return cv


def layer_mid_B():
    """Rừng tràm gần: thân thẳng đứng thưa hơn, tán che trên đỉnh thành mảng liền, bờ phải là khối cây gọn; không còn thân đổ chéo."""
    cv = Cv(); r = rngf(37)
    for x in range(60, 650, 46):
        tram(cv, r, x + r.randint(-4, 4), 30, 236, 3, 0, tone=1)
    for x in (30, 112, 196, 286, 470, 540, 612):
        tram(cv, r, x + r.randint(-6, 6), 0, 252, 5, r.choice([0, 0, 1]), tone=2)
    for x in (14, 150, 520, 600):
        tram(cv, r, x, -4, 268, 9, 0, tone=0)
    for i in range(37):                                           # tán trên: liền khối, chừa một ô trời bên trái-giữa
        x = -10 + i * 18 + r.uniform(-3, 3)
        if not (150 < x < 300):
            clump(cv, r, x, 6 + r.uniform(-3, 4), 24, 11, 34, [GB[1], GB[2], GB[3], GB[5]], rr_=(1, 3))
        clump(cv, r, x + 6, 36 + r.uniform(-4, 5), 26, 12, 34, [GB[2], GB[3], GB[4], GB[6]], rr_=(1, 3))
        if x > 330:
            clump(cv, r, x, 66 + r.uniform(-4, 4), 24, 12, 32, [GB[1], GB[2], GB[3], GB[4]], rr_=(1, 3))
    for yy in range(96, 236, 20):                                 # bờ phải: một khối cây tối, sáng dần về xa
        for i in range(10):
            clump(cv, r, 460 + i * 20 + r.uniform(-3, 3), yy + r.uniform(-4, 4), 22, 13, 30, [GB[1], GB[2], GB[3], GB[4]], rr_=(1, 3))
    for i in range(8):
        vine(cv, r, 480 + i * 22 + r.randint(-3, 3), 40 + r.randint(0, 20), r.uniform(40, 80), GB[1:7])
    for i in range(34):                                           # hàng bụi sát nước
        clump(cv, r, 300 + i * 11, 246 + r.uniform(-3, 5), 12, 6, 14, [GB[0], GB[2], GB[3], GB[4]], rr_=(2, 3))
    return cv


def layer_fore_B():
    """Bèo gần máy: lá nhỏ hơn, dày mịn như thảm bèo tấm thật, nằm phẳng trên mặt nước."""
    cv = Cv(); r = rngf(59)
    y = 296
    while y < 372:
        k = (y - 296) / 76
        rx = 8 + 8 * k
        x = -10 + r.uniform(0, rx)
        while x < beo_edge(y) + 6 + 14 * k + 6 * math.sin(y * .1):
            beo(cv, r, x + r.uniform(-2, 2), y + r.uniform(-1, 1), rx * r.uniform(.9, 1.1))
            x += rx * 1.3
        y += rx * .55
    return cv


def layer_boats_C():
    """Ghe chợ nổi: ghe xa nằm trên mặt nước thoáng ngay dưới bờ (không còn nằm trong vịnh sau nhà/cây)."""
    cv = Cv(); r = rngf(53)
    far = [(140, 226, .28, 'blue', False), (188, 228, .30, 'teal', True), (452, 226, .30, 'open', False), (478, 230, .32, 'blue', True)]
    mid = [(300, 238, .50, 'teal', False, False), (352, 236, .48, 'blue', True, False), (398, 240, .52, 'open', True, True), (262, 242, .55, 'blue', False, False),
           (330, 252, .66, 'open', False, True), (406, 260, .70, 'blue', True, False), (284, 264, .78, 'teal', False, False), (358, 274, .86, 'blue', False, True),
           (226, 248, .50, 'open', False, False), (524, 242, .55, 'blue', True, False), (592, 254, .56, 'teal', False, False), (80, 246, .50, 'open', False, False)]
    for (x, y, s, k, fl) in far:
        market_boat(cv, r, x, y, s, k, fl, rower=False)
    for (x, y, s, k, fl, pole) in sorted(mid, key=lambda a: a[1]):
        market_boat(cv, r, x, y, s, k, fl, pole)
    market_boat(cv, r, 440, 302, 1.05, 'green', False, False, rower=True)
    return cv


# ---------- xuất + xem thử ----------
def build_ben_tre():
    d = os.path.join(OUT, 'ben_tre')
    for n, f in [('sky', layer_sky_A), ('far', layer_far_A), ('water', layer_water_A), ('mid', layer_mid_A), ('boats', layer_boats_A), ('over', layer_over_A), ('fore', layer_fore_A)]:
        f().save(os.path.join(d, n + '.png'))
    anim_row_A()


def preview(scene, layers, extra=None, scale=1):
    base = Image.new('RGBA', (W, H), (20, 20, 30, 255))
    for n in layers:
        base.alpha_composite(Image.open(os.path.join(OUT, scene, n + '.png')))
    for n, pos in (extra or []):
        a = Image.open(n); base.alpha_composite(a, pos)
    if scale != 1:
        base = base.resize((W * scale, H * scale), Image.NEAREST)
    p = os.path.join('/home/claude', 'prev_' + scene + '.png')
    base.convert('RGB').save(p)
    return p


def build_xeo_quyt():
    d = os.path.join(OUT, 'xeo_quyt')
    for n, f in [('sky', layer_sky_B), ('far', layer_far_B), ('water', layer_water_B), ('mid', layer_mid_B), ('boats', layer_boats_B), ('fore', layer_fore_B)]:
        f().save(os.path.join(d, n + '.png'))
    anim_row_B()


def build_nga_nam():
    d = os.path.join(OUT, 'nga_nam')
    for n, f in [('sky', layer_sky_C), ('far', layer_far_C), ('water', layer_water_C), ('mid', layer_mid_C), ('boats', layer_boats_C), ('fore', layer_fore_C)]:
        f().save(os.path.join(d, n + '.png'))
    anim_row_C()


if __name__ == '__main__':
    which = sys.argv[1:] or ['ben_tre', 'xeo_quyt', 'nga_nam']
    if 'ben_tre' in which:
        build_ben_tre()
        a = Image.open(os.path.join(ANI, 'row_ben_tre.png')).crop((0, 0, 150, 140))
        a.save('/home/claude/_f0.png')
        preview('ben_tre', ['sky', 'far', 'water', 'mid', 'boats'], [(os.path.join('/home/claude', '_f0.png'), (318, 206))], 1)
        b0 = Image.open('/home/claude/prev_ben_tre.png').convert('RGBA'); b0.alpha_composite(Image.open(os.path.join(OUT, 'ben_tre', 'over.png'))); b0.alpha_composite(Image.open(os.path.join(OUT, 'ben_tre', 'fore.png')))
        b0.resize((W * 2, H * 2), Image.NEAREST).convert('RGB').save('/home/claude/prev_ben_tre.png')
        print('ok ben_tre')
    if 'xeo_quyt' in which:
        build_xeo_quyt()
        Image.open(os.path.join(ANI, 'row_xeo_quyt.png')).crop((0, 0, 340, 124)).save('/home/claude/_f1.png')
        preview('xeo_quyt', ['sky', 'far', 'water', 'mid', 'boats'], [('/home/claude/_f1.png', (318, 205))])
        base = Image.open('/home/claude/prev_xeo_quyt.png').convert('RGBA'); base.alpha_composite(Image.open(os.path.join(OUT, 'xeo_quyt', 'fore.png')))
        base.resize((W * 2, H * 2), Image.NEAREST).convert('RGB').save('/home/claude/prev_xeo_quyt.png')
        print('ok xeo_quyt')
    if 'nga_nam' in which:
        build_nga_nam()
        Image.open(os.path.join(ANI, 'row_nga_nam.png')).crop((0, 0, 150, 100)).save('/home/claude/_f2.png')
        preview('nga_nam', ['sky', 'far', 'water', 'mid', 'boats'], [('/home/claude/_f2.png', (452, 238))])
        base = Image.open('/home/claude/prev_nga_nam.png').convert('RGBA'); base.alpha_composite(Image.open(os.path.join(OUT, 'nga_nam', 'fore.png')))
        base.resize((W * 2, H * 2), Image.NEAREST).convert('RGB').save('/home/claude/prev_nga_nam.png')
        print('ok nga_nam')
