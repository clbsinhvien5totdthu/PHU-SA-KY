/* Người đạp xe cảnh đường quê hoàng hôn: nhìn nghiêng, hướng sang phải (về phía mặt trời).
   Tuần hoàn 8 khung: bàn đạp quay đủ 1 vòng, chân co duỗi bằng IK 2 đoạn, bánh xe quay, tóc bay.
   Viền sáng ngược (rim light) được tính tự động ở cuối: mọi điểm ảnh có hàng xóm bên phải/trên là trống. */
pal({K:"#07080f",k:"#090a15",d:"#14172b",D:"#1d2140",a:"#262e5a",e:"#3a2440",j:"#173038",s:"#3a2522",n:"#1b2244",N:"#2c3668",c:"#44508e",
     O:"#f9bc70",y:"#ffd98c",r:"#d97260",w:"#e8d6a6"})

const rider = (kind, S) => (c) => {
  const k = c.phase * Math.PI * 2, X = v => Math.round(v * S), bob = Math.round(Math.sin(2 * k) * .8 * S)
  const L = (x0, y0, x1, y1, col, w = 1) => c.line(X(x0), X(y0), X(x1), X(y1), col, Math.max(1, Math.round(w * S)))
  const wheel = (cx, cy) => {
    c.ring(X(cx), X(cy), X(11), "K"); if (S > 1.2) c.ring(X(cx), X(cy), X(11) - 1, "K"); else c.ring(X(cx), X(cy), X(10), "K")
    const a0 = c.phase * Math.PI / 3 * 2
    for (let i = 0; i < 6; i++) { const a = a0 + i * Math.PI / 3; L(cx, cy, cx + Math.cos(a) * 10, cy + Math.sin(a) * 10, "n") }
    c.circ(X(cx), X(cy), Math.max(1, X(1.3)), "N")
  }
  // --- xe ---
  const BB = [35, 41], RA = [17, 41], FA = [54, 41], SD = [30, 24], HT = [50, 26]
  wheel(RA[0], RA[1]); wheel(FA[0], FA[1])
  L(RA[0], RA[1], BB[0], BB[1], "N", 1.2); L(RA[0], RA[1], SD[0] - 1, SD[1] + 2, "N", 1.2)      // sườn sau
  L(BB[0], BB[1], SD[0], SD[1], "N", 1.4)                                                         // ống yên
  L(SD[0] + 1, 27, HT[0], HT[1] + 1, "N", 1.2); L(BB[0], BB[1], HT[0] - 1, HT[1] + 2, "N", 1.5)   // ống ngang + ống chéo
  L(HT[0], HT[1], FA[0], FA[1], "c", 1.2)                                                         // phuộc
  L(HT[0], HT[1], 51, 21, "c", 1.2); L(51, 21, 55, 21, "k", 1.4)                                  // cổ + ghi-đông
  c.rect(X(26), X(23), X(8), Math.max(2, X(2)), "k")                                              // yên
  if (kind === "an") { L(7, 28, 22, 28, "N", 1); L(10, 28, 13, 38, "N", 1); c.rect(X(8), X(23), X(10), X(5), "D"); c.rect(X(8), X(23), X(10), 1, "a") } // giá chở + túi vải
  // --- chân (IK 2 đoạn: hông -> gối -> bàn đạp) ---
  const H = [31, 22 + bob / S]
  const leg = (a, col, shoe) => {
    const px = BB[0] + Math.cos(a) * 5.5, py = BB[1] + Math.sin(a) * 5.5
    let dx = px - H[0], dy = py - H[1], d = Math.hypot(dx, dy); const l = 13.5, dd = Math.min(d, 2 * l - .5)
    const mx = H[0] + dx / d * dd / 2, my = H[1] + dy / d * dd / 2, h = Math.sqrt(Math.max(0, l * l - dd * dd / 4))
    let nx = -dy / d, ny = dx / d; if (nx < 0) { nx = -nx; ny = -ny }
    const kx = mx + nx * h, ky = my + ny * h
    L(H[0], H[1], kx, ky, col, 3.2); L(kx, ky, px - 1, py - 1, col, 2.6)
    L(px - 2, py, px + 3.5, py + .5, shoe, 1.8)                                                   // bàn chân
    L(BB[0], BB[1], px, py, "K", 1)                                                               // cần đạp
  }
  leg(k + Math.PI, "d", "k")                                                                      // chân xa (tối hơn)
  // --- thân + tay + đầu ---
  const garment = { an: "j", emma: "e", khoa: "a" }[kind]
  const T = (x, y) => [X(x), X(y + bob / S)]
  if (kind === "khoa") c.poly([...T(25, 12), ...T(33, 10), ...T(33, 21), ...T(26, 21)].flat(), "d")   // ba lô
  c.poly([...T(28, 24), ...T(30, 12), ...T(34, 9), ...T(41, 10), ...T(40, 17), ...T(36, 24)].flat(), garment)
  if (kind === "an") L(33, 10 + bob / S, 38, 22 + bob / S, "k", 1)                                  // quai túi chéo vai
  const sh = [38, 11 + bob / S], hand = [52, 21.5], el = [45, 16.5 + Math.sin(k) * .4]
  L(sh[0], sh[1], el[0], el[1], garment, 2.6); L(el[0], el[1], hand[0], hand[1], "s", 2.2)
  const hx = 39.5, hy = 5.2 + bob / S
  if (kind === "emma") {                                                                           // tóc dài bay ra sau
    for (let i = 0; i < 6; i++) { const t = i / 5, wv = Math.sin(k + i * .9) * 1.4 * t; L(hx - 1 - t * 12, hy - 1 + wv, hx - 1 - t * 12 - 2, hy + 2 + t * 4 + wv, "k", 2.2) }
    L(hx - 2, hy - 3, hx - 9, hy + 2 + Math.sin(k) * .6, "k", 3)
  }
  c.circ(X(hx), X(hy), X(4), "s")                                                                   // đầu
  if (kind === "an") { for (const [ox, oy] of [[-3, -3], [-1, -4.4], [1, -4], [3, -2.6], [-4, -1]]) c.circ(X(hx + ox), X(hy + oy), X(1.4), "k"); c.circ(X(hx - 1), X(hy - 2), X(3), "k") }
  if (kind === "khoa") { c.poly([...[[-4,-1],[-3,-6],[-1,-3],[0,-7],[2,-3],[4,-6],[4,-1]].flatMap(([a, b]) => [X(hx + a), X(hy + b)])], "k") }
  if (kind === "emma") { c.circ(X(hx - 1), X(hy - 1.5), X(3.6), "k"); L(hx - 3.5, hy - 2.5, hx + 3, hy - 2, "N", 1); c.circ(X(hx), X(hy), Math.max(1, X(1.3)), "N") }
  leg(k, "a", "k")                                                                                  // chân gần (sáng hơn, vẽ sau)
  // --- viền sáng ngược: mặt hướng mặt trời (phải/trên) ---
  const w = c.w, h = c.h, out = []
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) {
    if (!c.is(x, y, "*") || c.is(x, y, "Kn")) continue
    if (!c.is(x + 1, y, "*")) out.push([x, y, "O"]); else if (!c.is(x, y - 1, "*")) out.push([x, y, "y"])
  }
  out.forEach(([x, y, col]) => c.px(x, y, col))
}

for (const kd of ["an", "emma", "khoa"]) anim("ride_" + kd, { w: 72, h: 54, frames: 8, fps: 10 }, rider(kd, 1))
anim("ride_big_an", { w: 116, h: 87, frames: 8, fps: 10 }, rider("an", 1.6))
