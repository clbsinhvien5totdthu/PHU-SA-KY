"""Bộ công cụ vẽ pixel-art bằng code (Pillow + numpy) cho các cảnh chèo thuyền ở cutscene mở đầu.
Không dùng khử răng cưa: mọi nét đều là điểm ảnh cứng; chuyển sắc bằng ordered-dither (Bayer 4x4) cho đúng chất pixel."""
import math, os, random
import numpy as np
from PIL import Image, ImageDraw

W, H = 640, 360          # mỗi lớp vẽ ở 640x360 (= 2x toạ độ thế giới 320x180)


def rgb(h):
    if isinstance(h, tuple):
        return h
    h = h.lstrip('#')
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 255)


BAY = np.array([[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]], float) / 16.0


def bay(x, y):
    return BAY[int(y) & 3][int(x) & 3]


class Cv:
    def __init__(s, w=W, h=H):
        s.w, s.h = w, h
        s.im = Image.new('RGBA', (w, h), (0, 0, 0, 0))
        s.d = ImageDraw.Draw(s.im)

    # ---- nguyên thủy ----
    def px(s, x, y, c):
        x = int(round(x)); y = int(round(y))
        if 0 <= x < s.w and 0 <= y < s.h:
            s.im.putpixel((x, y), rgb(c))

    def rect(s, x, y, w, h, c):
        w = max(1, round(w)); h = max(1, round(h))
        s.d.rectangle([round(x), round(y), round(x) + w - 1, round(y) + h - 1], fill=rgb(c))

    def poly(s, pts, c):
        s.d.polygon([(round(a), round(b)) for a, b in pts], fill=rgb(c))

    def line(s, x0, y0, x1, y1, c, w=1):
        s.d.line([(round(x0), round(y0)), (round(x1), round(y1))], fill=rgb(c), width=w)

    def hline(s, x, y, n, c):
        s.d.line([(round(x), round(y)), (round(x) + round(n) - 1, round(y))], fill=rgb(c))

    def ell(s, cx, cy, rx, ry, c):
        s.d.ellipse([round(cx - rx), round(cy - ry), round(cx + rx), round(cy + ry)], fill=rgb(c))

    def circ(s, cx, cy, r, c):
        s.ell(cx, cy, r, r, c)

    def get(s, x, y):
        x = int(x); y = int(y)
        if 0 <= x < s.w and 0 <= y < s.h:
            return s.im.getpixel((x, y))
        return (0, 0, 0, 0)

    # ---- mặt nạ + chuyển sắc ----
    def mask(s, pts=None, fn=None):
        m = Image.new('L', (s.w, s.h), 0)
        if pts is not None:
            ImageDraw.Draw(m).polygon([(round(a), round(b)) for a, b in pts], fill=255)
        if fn is not None:
            fn(ImageDraw.Draw(m))
        return np.array(m) > 0

    def paste_arr(s, arr, m):
        a = np.array(s.im)
        a[m] = arr[m]
        s.im = Image.fromarray(a, 'RGBA'); s.d = ImageDraw.Draw(s.im)

    def grad(s, m, p0, p1, cols, spread=1.0, jitter=0.0, rng=None):
        """Tô chuyển sắc từ p0 -> p1 qua danh sách màu, có dither Bayer. m: mảng bool mặt nạ."""
        n = len(cols)
        cc = np.array([rgb(c) for c in cols], np.uint8)
        yy, xx = np.mgrid[0:s.h, 0:s.w]
        dx, dy = p1[0] - p0[0], p1[1] - p0[1]
        L2 = dx * dx + dy * dy or 1
        t = ((xx - p0[0]) * dx + (yy - p0[1]) * dy) / L2
        b = np.tile(BAY, (s.h // 4 + 1, s.w // 4 + 1))[:s.h, :s.w] - .5
        v = t * (n - 1) + b * spread
        if jitter and rng is not None:
            v = v + (np.random.RandomState(rng.randint(0, 99999)).rand(s.h, s.w) - .5) * jitter
        idx = np.clip(np.floor(v + .5), 0, n - 1).astype(int)
        s.paste_arr(cc[idx], m)

    def dpoly(s, pts, col, pfun, clip=None):
        """Rải điểm màu col trong đa giác với xác suất pfun(x,y) (0..1) theo Bayer -> viền mờ kiểu pixel."""
        m = s.mask(pts)
        if clip is not None:
            m &= clip
        ys, xs = np.nonzero(m)
        c = rgb(col)
        for y, x in zip(ys, xs):
            if BAY[y & 3][x & 3] < pfun(x, y):
                s.im.putpixel((int(x), int(y)), c)

    def scatter(s, rng, n, col_fn, box, clip=None, w=(1, 1), h=1):
        x0, y0, x1, y1 = box
        for _ in range(n):
            x = rng.randint(x0, x1); y = rng.randint(y0, y1)
            if clip is not None and not clip[min(max(y, 0), s.h - 1)][min(max(x, 0), s.w - 1)]:
                continue
            c = col_fn(x, y)
            if c is None:
                continue
            ww = rng.randint(*w) if w[1] > w[0] else w[0]
            s.rect(x, y, ww, h, c)

    def save(s, path):
        os.makedirs(os.path.dirname(path), exist_ok=True)
        s.im.save(path, optimize=True)
        return path


def bez(p0, p1, p2, t):
    u = 1 - t
    return (u * u * p0[0] + 2 * u * t * p1[0] + t * t * p2[0], u * u * p0[1] + 2 * u * t * p1[1] + t * t * p2[1])


def frond(cv, rng, p0, p1, p2, n, lmax, cols, L=(.35, -.93), grav=.55, spread=58, tip=.2, sw=1,
          rach=None, prof_pow=.6, base_skip=.06, both=True, bias=0.0, skip=1):
    """Tàu lá lông chim (dừa nước/cọ): trục cong Bézier + lá chét hai bên, rủ theo trọng lực, màu theo hướng sáng.
    cols: từ tối -> sáng."""
    rc = rach or cols[1]
    prev = p0
    for i in range(1, 25):
        q = bez(p0, p1, p2, i / 24)
        cv.line(prev[0], prev[1], q[0], q[1], rc, 2 if i < 8 and lmax > 22 else 1)
        prev = q
    nc = len(cols)
    for i in range(0, n, skip):
        t = base_skip + (1 - base_skip) * i / max(1, n - 1)
        p = bez(p0, p1, p2, t)
        q = bez(p0, p1, p2, min(1, t + .02))
        tg = math.atan2(q[1] - p[1], q[0] - p[0])
        prof = max(.08, math.sin(math.pi * min(1, t * 1.02)) ** prof_pow)
        for side in ((-1, 1) if both else (1,)):
            a = tg + side * math.radians(spread + rng.uniform(-12, 12))
            dx, dy = math.cos(a), math.sin(a) + grav
            m = math.hypot(dx, dy) or 1
            dx, dy = dx / m, dy / m
            ln = lmax * prof * rng.uniform(.72, 1.05)
            ex, ey = p[0] + dx * ln, p[1] + dy * ln
            lit = dx * L[0] + dy * L[1]
            k = (lit + 1) / 2 + rng.uniform(-.14, .14) + (.14 if t > 1 - tip else 0) + bias
            cv.line(p[0], p[1], ex, ey, cols[min(nc - 1, max(0, int(k * nc)))], sw)


def blob_leaf(cv, rng, cx, cy, r, cols, L=(.4, -.9)):
    """Cụm lá tròn (tán cây xa): 3 tông, mặt sáng hướng nguồn sáng."""
    cv.circ(cx, cy + 1, r, cols[0])
    cv.circ(cx, cy, r, cols[1])
    cv.circ(cx + L[0] * r * .3, cy + L[1] * r * .3, max(1, r * .62), cols[2])
    if len(cols) > 3 and r > 3:
        cv.circ(cx + L[0] * r * .45, cy + L[1] * r * .45, max(1, r * .3), cols[3])


def person(cv, x, y, s, shirt, hat=True, skin='#c98f5e', hat_c='#d8c393', hat_d='#a98f58', hair='#1a1410', arm=True,
           stand=False, face=True, long_hair=False, dark='#181510'):
    """Người ngồi/đứng nhìn từ trước hơi chếch trên cao. (x,y) = điểm giữa thân, chân ghế. s = hệ số tỉ lệ."""
    sh = shirt
    H_ = 20 * s if stand else 13 * s
    # thân
    cv.poly([(x - 6 * s, y - H_), (x + 6 * s, y - H_), (x + 7 * s, y), (x - 7 * s, y)], sh)
    cv.line(x - 6 * s, y - H_, x - 7 * s, y, shade(sh, -.28))
    cv.line(x + 6 * s, y - H_ + 1, x + 7 * s, y, shade(sh, -.28))
    cv.hline(x - 5 * s, y - H_ + 1, 10 * s, shade(sh, .22))
    if arm:
        cv.line(x - 6 * s, y - H_ + 2 * s, x - 9 * s, y - H_ * .35, shade(sh, -.1), max(1, int(2 * s)))
        cv.line(x + 6 * s, y - H_ + 2 * s, x + 9 * s, y - H_ * .35, shade(sh, -.1), max(1, int(2 * s)))
    # cổ + đầu
    hy = y - H_ - 4 * s
    cv.rect(x - 1.5 * s, y - H_ - 2 * s, 3 * s, 2.5 * s, shade(skin, -.2))
    cv.circ(x, hy, 4 * s, skin)
    if long_hair:
        cv.poly([(x - 4.5 * s, hy - 2 * s), (x + 4.5 * s, hy - 2 * s), (x + 5 * s, hy + 7 * s), (x - 5 * s, hy + 7 * s)], hair)
        cv.circ(x, hy + .5 * s, 3.4 * s, skin)
    if hat:
        # nón lá: chóp nhọn + vành rộng, nửa tối bên trái, vành dưới đổ bóng lên mặt
        cv.ell(x, hy + .5 * s, 4.4 * s, 2 * s, shade(skin, -.45))
        cv.poly([(x, hy - 9.5 * s), (x - 10 * s, hy - .5 * s), (x + 10 * s, hy - .5 * s)], hat_c)
        cv.poly([(x, hy - 9.5 * s), (x - 10 * s, hy - .5 * s), (x - 1 * s, hy - .5 * s)], hat_d)
        cv.hline(x - 10 * s, hy - .5 * s, 20 * s, shade(hat_c, -.35))
        cv.hline(x - 8 * s, hy - 3 * s, 12 * s, shade(hat_c, .18))
        cv.px(x, hy - 9.5 * s, shade(hat_c, .3))
    else:
        cv.poly([(x - 4.2 * s, hy - 1 * s), (x, hy - 4.8 * s), (x + 4.2 * s, hy - 1 * s)], hair)
        if face:
            cv.px(x - 1.5 * s, hy + .5 * s, '#2a1c14'); cv.px(x + 1.5 * s, hy + .5 * s, '#2a1c14')


def shade(c, k):
    """Làm sáng (k>0) / tối (k<0) một màu hex hoặc tuple."""
    r, g, b, a = rgb(c)
    if k >= 0:
        r, g, b = [int(v + (255 - v) * k) for v in (r, g, b)]
    else:
        r, g, b = [int(v * (1 + k)) for v in (r, g, b)]
    return (r, g, b, 255)


def rngf(seed):
    return random.Random(seed)


def cloud(cv, rng, cx, cy, rx, ry, body, lit, edge=None, shadow=None):
    """Mây kiểu pixel: elip dẹt nhiều tầng + đáy tối + mép sáng."""
    cv.ell(cx, cy, rx, ry, body)
    for k in range(3):
        cv.ell(cx + rng.randint(-rx // 2, rx // 2), cy - ry * .35 + rng.randint(-1, 1), rx * rng.uniform(.3, .55), ry * rng.uniform(.6, .9), lit)
    if shadow:
        cv.hline(cx - rx * .7, cy + ry - 1, rx * 1.4, shadow)
    if edge:
        cv.hline(cx - rx * .5, cy - ry + 1, rx * .9, edge)
