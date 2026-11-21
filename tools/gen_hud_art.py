#!/usr/bin/env python3
"""Sinh bộ HUD pixel art cho Phù Sa Ký -> assets/ui/*.png (+ _preview.png).
Luật (pxl-art-director): MỘT nguồn sáng trên-trái; bậc màu hue-shift (tối ngả đỏ-tím, sáng ngả vàng);
không đen/trắng thuần (mực #2a1f33, sáng nhất #fff6d8); khung = viền + vành sáng 1px + khe tối 1px;
cạnh sạch, không dither, phóng bằng nearest số nguyên (CSS: image-rendering:pixelated, tỷ lệ 2x).
Chạy:  python3 tools/gen_hud_art.py        (cần Pillow)"""
import colorsys, os, sys
from PIL import Image, ImageDraw

OUT = os.path.join(os.path.dirname(__file__), '..', 'assets', 'ui')
os.makedirs(OUT, exist_ok=True)

def hx(c): c = c.lstrip('#'); return tuple(int(c[i:i+2], 16) for i in (0, 2, 4))

def ramp(base, n=6, lo=.30, hi=.30):
    """n bậc tối->sáng quanh màu gốc (gốc ở bậc 2/3). Bóng ngả đỏ-tím (335°), sáng ngả vàng (50°)."""
    r, g, b = [v / 255 for v in hx(base)]
    h, l, s = colorsys.rgb_to_hls(r, g, b)
    h *= 360; mid = int(n * .45); out = []
    for i in range(n):
        if i <= mid: t = (mid - i) / max(mid, 1); L = l - lo * t; tgt = 335; k = .22 * t
        else: t = (i - mid) / max(n - 1 - mid, 1); L = l + hi * t; tgt = 50; k = .20 * t
        d = ((tgt - h + 540) % 360) - 180; hh = (h + d * k) % 360
        ss = min(1, s * (1 + .12 * (1 - abs(2 * (i / (n - 1)) - 1))))
        rr, gg, bb = colorsys.hls_to_rgb(hh / 360, max(.06, min(.97, L)), ss)
        out.append((round(rr * 255), round(gg * 255), round(bb * 255)))
    return out

INK = hx('#2a1f33')          # "đen" duy nhất
OUTL = hx('#3a1f1a')         # viền gỗ: nâu đỏ sẫm
HI = hx('#fff6d8')           # sáng nhất, không trắng thuần
WOOD = ramp('#a2693c', 6)    # gỗ
PAPER = ramp('#f1e1b4', 6, .20, .08)   # giấy dó
GOLD = ramp('#d9a93f', 6)    # đồng/vàng
BLUE = ramp('#6b7fb5', 5)    # áo bà ba chàm
RED = ramp('#c2433f', 5)     # son/triện
GREEN = ramp('#4f9a43', 5)   # lá
TEAL = ramp('#4f9c94', 5)

def new(w, h): return Image.new('RGBA', (w, h), (0, 0, 0, 0))
def save(im, name): im.save(os.path.join(OUT, name))

# ---------- khung 9-slice ----------
def frame(size, corner, body, rim_lit, rim_shade, base_lit, base_shade, groove_lit, groove_shade, inner_lit, inner_shade, stud=False):
    """Khung bo góc kiểu bậc thang. Lớp theo khoảng cách tới mép ngoài: 0 viền, 1 vành, 2 thân, 3 khe, 4 bóng trong/ánh bật."""
    w = h = size; im = new(w, h); px = im.load()
    rad = corner - 2                                   # bán kính góc bậc thang
    def inside(x, y):
        if not (0 <= x < w and 0 <= y < h): return False
        cx = min(x, w - 1 - x); cy = min(y, h - 1 - y)
        if cx < rad and cy < rad: return (cx + cy) >= rad - 1 + (1 if rad > 2 else 0) - (1 if rad <= 1 else 0) or (cx >= 1 and cy >= 1 and cx + cy >= rad)
        return True
    mask = [[inside(x, y) for x in range(w)] for y in range(h)]
    # khoảng cách BFS (4 láng giềng) tới ngoài
    from collections import deque
    dist = [[None] * w for _ in range(h)]; dq = deque()
    for y in range(h):
        for x in range(w):
            if mask[y][x] and any(not (0 <= x + dx < w and 0 <= y + dy < h and mask[y + dy][x + dx]) for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                dist[y][x] = 0; dq.append((x, y))
    while dq:
        x, y = dq.popleft()
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            nx, ny = x + dx, y + dy
            if 0 <= nx < w and 0 <= ny < h and mask[ny][nx] and dist[ny][nx] is None:
                dist[ny][nx] = dist[y][x] + 1; dq.append((nx, ny))
    for y in range(h):
        for x in range(w):
            if not mask[y][x]: continue
            d = dist[y][x]; dt, dl, db, dr_ = y, x, h - 1 - y, w - 1 - x
            lit = min(dt, dl) <= min(db, dr_)          # cạnh gần nhất là trên/trái -> sáng
            if d >= corner: c = body
            elif d == 0: c = OUTL
            elif d == 1: c = rim_lit if lit else rim_shade
            elif d == 2: c = base_lit if lit else base_shade
            elif d == 3: c = groove_lit if lit else groove_shade
            elif d == 4 and corner >= 5: c = inner_lit if lit else inner_shade
            else: c = body
            px[x, y] = c + (255,)
    if stud and corner >= 5:                           # đinh đồng ở bốn góc
        for (sx, sy) in ((2, 2), (w - 4, 2), (2, h - 4), (w - 4, h - 4)):
            for (ox, oy, col) in ((0, 0, GOLD[4]), (1, 0, GOLD[3]), (0, 1, GOLD[3]), (1, 1, GOLD[1])):
                px[sx + ox, sy + oy] = col + (255,)
    return im

W, P, G = WOOD, PAPER, GOLD
panel = frame(16, 5, P[3], W[4], W[2], W[3], W[2], W[1], W[0], P[2], P[5], stud=True)
save(panel, 'panel.png')                                           # slice 5
chip = frame(10, 3, P[3], W[4], W[2], W[3], W[2], W[1], W[0], P[2], P[5]); save(chip, 'chip.png')           # slice 3
dark = frame(10, 3, WOOD[1], W[3], W[0], W[2], W[0], W[1], W[0], W[1], W[0]); save(dark, 'tag.png')          # nhãn gỗ tối
# nút: nổi (3 trạng thái) + đang chọn
def button(body, lit1, lit2, sh1, sh2, name):
    im = frame(12, 4, body, lit1, sh1, lit2, sh2, body, body, body, body); save(im, name)
button(G[3], G[5], G[4], G[1], G[2], 'btn.png')
button(G[4], HI, G[5], G[2], G[3], 'btn_hover.png')
button(G[2], G[1], G[2], G[4], G[5], 'btn_press.png')                # lõm: sáng/tối đảo
button(GREEN[3], GREEN[4], GREEN[4], GREEN[1], GREEN[2], 'btn_on.png')
# ô lựa chọn hội thoại (giấy sáng, vành gỗ mảnh)
choice = frame(10, 3, P[4], W[3], W[1], P[4], P[2], P[4], P[3], P[4], P[3]); save(choice, 'choice.png')
choice_h = frame(10, 3, HI, G[4], G[2], HI, P[3], HI, P[4], HI, P[4]); save(choice_h, 'choice_hover.png')
# pip tiến độ (ngang, co giãn)
def pip(body, hi, lo, name):
    im = new(6, 6); px = im.load()
    for y in range(6):
        for x in range(6):
            if (x in (0, 5) and y in (0, 5)): continue
            c = OUTL if x in (0, 5) or y in (0, 5) else (hi if y == 1 or x == 1 else lo if y == 4 else body)
            px[x, y] = c + (255,)
    save(im, name)
pip(GREEN[3], GREEN[4], GREEN[1], 'pip_on.png'); pip(G[3], G[5], G[1], 'pip_cur.png'); pip(P[2], P[3], P[1], 'pip_off.png')

# ---------- icon 12x12: khối -> tự viền mực + đổ bóng một nguồn sáng (trên-trái) ----------
SKIN = ramp('#e9b389', 5)
def R(rows, ox=0, oy=0): return {(x + ox, y + oy) for y, r in enumerate(rows) for x, ch in enumerate(r) if ch == '#'}
def disc(cx, cy, r): return {(x, y) for x in range(12) for y in range(12) if (x + .5 - cx) ** 2 + (y + .5 - cy) ** 2 <= r * r}
def ring(cx, cy, r1, r2): return disc(cx, cy, r1) - disc(cx, cy, r2)
def rect(x0, y0, x1, y1): return {(x, y) for x in range(x0, x1 + 1) for y in range(y0, y1 + 1)}
def line(x0, y0, x1, y1, t=1):
    out = set(); n = max(abs(x1 - x0), abs(y1 - y0), 1)
    for i in range(n + 1):
        x = round(x0 + (x1 - x0) * i / n); y = round(y0 + (y1 - y0) * i / n)
        for dx in range(t):
            for dy in range(t): out.add((x + dx, y + dy))
    return out
def icon(layers, detail=None, name=''):
    pix = {}; union = set()
    for mask, rp in layers:
        for (x, y) in mask:
            lit = (x, y - 1) not in mask or (x - 1, y) not in mask
            sh = (x, y + 1) not in mask or (x + 1, y) not in mask
            pix[(x, y)] = rp[4] if lit and not sh else rp[1] if sh and not lit else rp[3] if lit and sh else rp[2]
        union |= mask
    for (x, y) in union:
        for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            q = (x + dx, y + dy)
            if q not in union and 0 <= q[0] < 12 and 0 <= q[1] < 12: pix[q] = INK
    for q, c in (detail or {}).items(): pix[q] = c
    im = new(12, 12); px = im.load()
    for (x, y), c in pix.items():
        if 0 <= x < 12 and 0 <= y < 12: px[x, y] = c + (255,)
    save(im, 'icon_' + name + '.png')
D = lambda *pts, c: {q: c for q in pts}
# sổ tay: sách mở, 2 trang giấy + gáy gỗ
icon([(rect(1, 2, 10, 8) - {(5, 2), (6, 2)} | {(5, 3), (6, 3)}, P), (rect(1, 9, 10, 9), WOOD)],
     {**{(x, 4): P[1] for x in (2, 3, 4, 7, 8, 9)}, **{(x, 6): P[1] for x in (2, 3, 4, 7, 8, 9)}, **{(5, y): W[2] for y in range(3, 9)}, **{(6, y): W[3] for y in range(3, 9)}}, 'book')
# nhân vật: đầu da + vai áo chàm
icon([(disc(6, 4, 2.9), SKIN), (R(['..########..', '.##########.', '.##########.', '.##########.'], 0, 7) | R(['...######...'], 0, 6), BLUE)], {(5, 4): INK, (7, 4): INK}, 'people')
# hành trình: bản đồ gấp 3, sông xanh, ghim đỏ
icon([(rect(1, 2, 10, 9), P)], {**{(x, y): P[1] for x in (4, 7) for y in range(2, 10)}, **{(x, 5): TEAL[3] for x in (2, 3)}, **{(x, 6): TEAL[3] for x in (5, 6)}, **{(x, 4): TEAL[3] for x in (8, 9)}, (8, 7): RED[2], (9, 7): RED[2], (8, 8): RED[1], (9, 8): RED[1]}, 'map')
# nhạc: nốt đen-vàng có cờ
icon([(R(['.######', '.######', '.##.###', '.##..##', '.##....', '.##....'], 5, 1) | disc(4.5, 9, 2.3) | rect(6, 5, 7, 9), G)], {}, 'note')
# giao diện: ba thanh trượt
icon([(rect(1, 2, 10, 2) | rect(1, 6, 10, 6) | rect(1, 10, 10, 10), WOOD), (rect(3, 1, 4, 3) | rect(7, 5, 8, 7) | rect(4, 9, 5, 11), G)], {}, 'sliders')
# dấu vết: kính lúp (vòng đồng, mặt kính xanh lục nhạt)
icon([(ring(4.6, 4.6, 3.9, 2.3), G), (disc(4.6, 4.6, 2.3), TEAL), (line(7, 7, 10, 10, 2), WOOD)], {(3, 3): HI, (4, 3): TEAL[4]}, 'search')
# lời kể: bong bóng thoại
icon([(rect(1, 2, 10, 7) - {(1, 2), (10, 2), (1, 7), (10, 7)} | {(3, 8), (4, 8), (3, 9)}, P)], {(3, 5): INK, (5, 5): INK, (7, 5): INK}, 'bubble')
# An nghĩ: bóng đèn
icon([(disc(5.5, 4.4, 3.6), G), (rect(4, 8, 7, 9), WOOD)], {(3, 3): HI, (4, 2): HI, (5, 5): G[1], (6, 5): G[1]}, 'bulb')
# giả thuyết: la bàn (vòng đồng, kim đỏ-chàm)
icon([(ring(5.5, 5.5, 4.8, 3.4), G), (disc(5.5, 5.5, 3.4), P)], {**{(5, y): RED[2] for y in (3, 4)}, **{(6, y): RED[1] for y in (3, 4)}, **{(5, y): BLUE[2] for y in (7, 8)}, **{(6, y): BLUE[1] for y in (7, 8)}, (5, 5): INK, (6, 5): INK, (5, 6): INK, (6, 6): INK}, 'compass')
# dấu mực: giọt mực chàm
icon([(disc(5.5, 7, 3.6) | R(['#', '#', '##', '###'], 5, 0) | R(['####'], 4, 4), BLUE)], {(4, 7): BLUE[4], (4, 8): HI}, 'ink')
# loa bật / tắt
SP = rect(1, 4, 3, 7) | {(4, 3), (4, 4), (4, 5), (4, 6), (4, 7), (4, 8), (5, 2), (5, 3), (5, 4), (5, 5), (5, 6), (5, 7), (5, 8), (5, 9)}
icon([(SP, WOOD)], {**{(7, y): INK for y in (4, 5, 6, 7)}, **{(9, y): INK for y in (3, 4, 5, 6, 7, 8)}, (8, 3): INK, (8, 8): INK}, 'speaker')
icon([(SP, WOOD)], {**{(x, y): RED[2] for x, y in ((7, 4), (8, 5), (9, 6), (10, 7), (10, 4), (9, 5), (8, 6), (7, 7))}}, 'mute')
# trạng thái: đồng hồ cát (chờ), nửa tròn (đúng một phần), bút chì (đã sửa), dấu tích
icon([(R(['########', '.######.', '..####..', '...##...', '...##...', '..####..', '.######.', '########'], 2, 2), P), (rect(2, 1, 9, 1) | rect(2, 10, 9, 10), WOOD)], {**{(x, 8): G[3] for x in (5, 6)}, **{(x, 9): G[3] for x in (4, 5, 6, 7)}}, 'hourglass')
icon([(disc(5.5, 5.5, 4.4), P)], {(x, y): G[3] for x in range(2, 6) for y in range(2, 10) if (x + .5 - 5.5) ** 2 + (y + .5 - 5.5) ** 2 <= 4.4 ** 2 - 1}, 'half')
icon([(line(2, 9, 8, 3, 2), WOOD), (R(['##', '##'], 8, 2) , RED), (R(['#'], 1, 10), P)], {}, 'pencil')
icon([(line(2, 6, 4, 8, 2) | line(4, 8, 9, 2, 2), GREEN)], {}, 'check')
# đồng hồ: viền đồng, mặt giấy, kim mực
icon([(ring(5.5, 5.5, 4.8, 3.4), G), (disc(5.5, 5.5, 3.4), P)], {**{(5, y): INK for y in (2, 3, 4, 5)}, **{(x, 5): INK for x in (6, 7)}, (5, 5): INK}, 'clock')
# bản cao tương phản (viền mực dày, giấy sáng, không đinh)
save(frame(16, 5, HI, INK, INK, W[0], W[0], INK, INK, HI, HI), 'panel_hc.png')
save(frame(10, 3, HI, INK, INK, W[0], W[0], INK, INK, HI, HI), 'chip_hc.png')
# ghim vị trí: đầu tròn + đuôi nhọn, lỗ sáng ở giữa
icon([(disc(5.5, 4.2, 3.9) | R(['####', '.##.', '.#..'], 4, 8), RED)], {(5, 3): P[4], (6, 3): P[4], (5, 4): P[3], (6, 4): P[3]}, 'pin')
# nhãn CÂU HỎI: dấu ?
q = R(['.###.', '#...#', '....#', '...#.', '..#..', '..#..', '.....', '..#..'], 3, 2)
im = new(12, 12); px = im.load()
for (x, y) in q:
    for dx in (-1, 0, 1):
        for dy in (-1, 0, 1):
            if 0 <= x + dx < 12 and 0 <= y + dy < 12 and (x + dx, y + dy) not in q: px[x + dx, y + dy] = INK + (255,)
for (x, y) in q: px[x, y] = HI + (255,)
save(im, 'icon_question.png')

# ---------- mũi tên la bàn 8 hướng (15x15) ----------
import math
def arrow(angle_deg):
    S = 17; m = new(S, S); d = ImageDraw.Draw(m); a = math.radians(angle_deg)
    pts = [(-7, -1.6), (0.5, -1.6), (0.5, -5), (7.5, 0), (0.5, 5), (0.5, 1.6), (-7, 1.6)]
    rot = [((x * math.cos(a) - y * math.sin(a)) + 8, (x * math.sin(a) + y * math.cos(a)) + 8) for x, y in pts]
    d.polygon(rot, fill=(255, 255, 255, 255))
    mk = [[m.getpixel((x, y))[3] > 0 for x in range(S)] for y in range(S)]
    out = new(S, S); px = out.load(); at = lambda x, y: 0 <= x < S and 0 <= y < S and mk[y][x]
    for y in range(S):
        for x in range(S):
            if mk[y][x]:
                edge = not (at(x + 1, y) and at(x - 1, y) and at(x, y + 1) and at(x, y - 1))
                if edge: c = INK
                elif not at(x, y - 1) or not at(x - 1, y): c = G[5]
                elif not at(x, y + 1) or not at(x + 1, y): c = G[2]
                else: c = G[4]
                px[x, y] = c + (255,)
    # viền ngoài 1px cho dễ đọc trên mọi nền: vòng sáng
    glow = new(S, S); gp = glow.load()
    for y in range(S):
        for x in range(S):
            if not mk[y][x] and any(at(x + dx, y + dy) for dx in (-1, 0, 1) for dy in (-1, 0, 1)): gp[x, y] = HI + (255,)
    glow.alpha_composite(out); return glow
for name, ang in (('e', 0), ('se', 45), ('s', 90), ('sw', 135), ('w', 180), ('nw', 225), ('n', 270), ('ne', 315)):
    save(arrow(ang), 'arrow_' + name + '.png')

# ---------- xem trước ----------
files = sorted(f for f in os.listdir(OUT) if f.endswith('.png') and not f.startswith('_'))
Z = 4; sheet = Image.new('RGBA', (900, 640), hx('#3b4a2a') + (255,)); x = y = 8; rowh = 0
for f in files:
    im = Image.open(os.path.join(OUT, f)).convert('RGBA'); im = im.resize((im.width * Z, im.height * Z), Image.NEAREST)
    if x + im.width + 8 > sheet.width: x = 8; y += rowh + 8; rowh = 0
    sheet.alpha_composite(im, (x, y)); x += im.width + 8; rowh = max(rowh, im.height)
sheet.crop((0, 0, 900, y + rowh + 8)).save(os.path.join(OUT, '_preview.png'))
print('ok', len(files), 'file ->', os.path.abspath(OUT))
