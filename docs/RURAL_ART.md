# Vẽ lại nhà quê, tileset và cây (theo `pxl-art-director`, Nam Bộ – Đồng Tháp)

**Nhà (assets/art/map.px.js → m_h_*; gán trong tools/build_features.py)**
| Sprite | Dùng cho | Đặc điểm |
|---|---|---|
| `m_h_noc` | Nhà Nọc Ngựa 1–2, Nhà Cụ Sắc | ngói âm dương hai tông xen kẽ có rêu, vách ván, hiên rộng 4 cột kê chân đá, bao lam, song tiện |
| `m_h_bat` | Nhà Bát Dần 1–2 | mái bốn phía thoải, vách vôi, cửa chớp xanh, hiên cột tròn |
| `m_h_dinh` | Nhà Chữ Đinh 1–2 | nhà chính + nhà ngang, đầu hồi lát ván đứng, bờ ngói |
| `m_h_la`, `m_h_la2` | Nhà Ông Cả Nhị Ngưu, Ông Năm Giáo | mái lá chằm tua chân, vách lá đan / vách ván vá tôn, chái nhỏ |
| `m_h_coc` | Nhà trên cọc 1–2 | cọc tre rêu bùn, sàn ván, thang, mái lá |
Cùng cỡ chân (144×144 / 192×144) nên bản đồ, va chạm, `FOOT` không đổi. Sáng từ trên-trái; mái trái sáng hơn mái phải; viền nâu đỏ sẫm (`J`).

**Công trình phụ (thay các khối giữ chỗ xanh/hồng/đen):** `m_h_bl` chòi nghỉ mát mái lá (Điểm dừng chân), `m_h_pk` quầy lưu niệm tre mái chằm, `m_h_bk` nhà vệ sinh gạch vôi mái ngói, `m_h_cf` quán cà phê vườn (Cà phê Hòa An), `m_h_bg` quán ẩm thực mái lá rộng.

**Vật dụng quanh nhà (decor, vẽ ×2):** sân đất nện (`san0/1`, decal sát mặt đất), hàng rào dâm bụt, giàn bầu, đống rơm (nhà mái lá), xuồng ba lá kéo lên bờ kênh, bụi tre làng sau nhà.

**Tileset**
- Lối đất làng (`m_e0..3` + mép cỏ lấn `m_eedge_*`) thay gạch lát ở các lối trong làng; đường chính, sân, trục trang nghiêm vẫn lát gạch.
- Nước kênh phù sa (`m_wp0..3`, `m_wedgep_*`): ngả ô-liu đục hơn hồ; hồ giữ nước xanh trong.
- Ô cỏ có mảng đất trơ (`m_gs0/1`) rải thưa.
- Cách nối: `MAPDATA.X` (mới) bit0 = nước kênh, bit1 = lối làng. `scene.js: keyOf` đổi tile ảo `t=12/13`; `M` vẫn là 2/8 nên va chạm, đường đi, cầu không đổi.

**Cây:** tổng ~330 (trước ~190). Vườn nhà 9 cây/nhà (xoài, mít, bưởi, cau, chuối, dừa), vườn ăn trái dọc lối, tre làng, tràm ven kênh, bụi hoa giấy. Loài chọn theo nước ngọt Đồng Tháp; không dùng dừa nước/bần/đước.

**Lưu ý kỹ thuật:** bản `pxl` cài sẵn là bản cũ (chưa có `ramp/cel/planks/shingles/cast` như skill mô tả), nên ngói/ván/mái lá/cột được dựng bằng hàm vẽ tay trong `map.px.js` (`ngoi`, `la`, `van`, `cot`, `cua`…). Chưa vẽ lại các công trình trang nghiêm/hành chính (Đền thờ, Nhà trưng bày, Ban quản lý, Nhà sàn mô phỏng, tượng Cụ) — giữ nguyên để bạn quyết định kiến trúc.
Dựng lại: `node <pxl>/bin/pxl.js build assets/art/map.px.js --only <sprite…> --out assets/art/out && node tools/build_mapart.js && python3 tools/build_features.py && python3 tools/build_map.py && node tools/check_map.js`.


---
## v17 — nhà làng 3/4 top-down + đường lát gạch dual-grid (pxl-art-director)
**Nhà** (`assets/art/map.px.js`, hàm `h3*`, sprite thân `_h3_*` có viền + `m_h_*` thêm bóng đổ alpha 35% dưới-phải): mái hông 4 mặt (hông trái sáng, hông phải tối), tường nam ~40–45% chiều cao, cửa chính ở tường nam. Kích thước sprite, FOOT, ID giữ nguyên. Vật nhỏ trên nhà (lu, nón treo, chùm ớt, tấm tôn, thang, lan can) giữ đúng bộ v16.
**Đường gạch:** `m_br_01..15` (mask NW·1+NE·2+SW·4+SE·8) + `m_br_15c1/c2` (viên sứt, `h%12==0/6`). Gạch 8×4 so le, 3 sắc độ, mạch 1 px; góc lồi bo 3 px, góc lõm lấp 3 px; viền tối 1 px; bóng dưới-phải. `scene.js`: `gBr()` vẽ mảnh tại ĐỈNH lưới trong `gRows`; ô M==8 nền là cỏ (không còn `m_p*`, `m_pedge_*` cho gạch, không còn lối đất `m_e*` — các tile này không còn được dùng).
**Dữ liệu:** `tools/v17_paths.py` (gọi từ `build_map.py` ngay trước khi xuất MAPDATA): lối làng = khung xương 4-liên-thông, trục nối các neo (sân/cầu/đường lát) rộng 2 ô, nhánh 1 ô, ô thừa trả cỏ; lối cửa ngắn chỉ khi sơ đồ đã có đường trong 6 ô. TREES/DECOR/B/BRIDGES/PH giữ nguyên bit-by-bit; chỉ `M` và `X` bit1 đổi.
**Kiểm tra:** `node tools/check_map.js` · `node tools/check_paths.js` (flood-fill) · `python3 tools/preview_v17.py` (ảnh trong `assets/art/preview_v17/`).
Dựng lại: `node <pxl>/bin/pxl.js build assets/art/map.px.js --only <m_h_*,m_br_*> --out assets/art/out && node tools/build_mapart.js && python3 tools/build_map.py && node tools/check_map.js`.
