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

**Vật dụng quanh nhà (decor, vẽ ×2):** sân đất nện (`san0/1`, decal sát mặt đất), hàng rào dâm bụt, giàn bầu, đống rơm (nhà mái lá), xuồng ba lá kéo lên bờ kênh, bụi tre làng sau nhà.

**Tileset**
- Lối đất làng (`m_e0..3` + mép cỏ lấn `m_eedge_*`) thay gạch lát ở các lối trong làng; đường chính, sân, trục trang nghiêm vẫn lát gạch.
- Nước kênh phù sa (`m_wp0..3`, `m_wedgep_*`): ngả ô-liu đục hơn hồ; hồ giữ nước xanh trong.
- Ô cỏ có mảng đất trơ (`m_gs0/1`) rải thưa.
- Cách nối: `MAPDATA.X` (mới) bit0 = nước kênh, bit1 = lối làng. `scene.js: keyOf` đổi tile ảo `t=12/13`; `M` vẫn là 2/8 nên va chạm, đường đi, cầu không đổi.

**Cây:** tổng ~330 (trước ~190). Vườn nhà 9 cây/nhà (xoài, mít, bưởi, cau, chuối, dừa), vườn ăn trái dọc lối, tre làng, tràm ven kênh, bụi hoa giấy. Loài chọn theo nước ngọt Đồng Tháp; không dùng dừa nước/bần/đước.

**Lưu ý kỹ thuật:** bản `pxl` cài sẵn là bản cũ (chưa có `ramp/cel/planks/shingles/cast` như skill mô tả), nên ngói/ván/mái lá/cột được dựng bằng hàm vẽ tay trong `map.px.js` (`ngoi`, `la`, `van`, `cot`, `cua`…). Chưa vẽ lại các công trình công cộng (Ban quản lý, Nhà trưng bày, Đền thờ, Nhà sàn mô phỏng).
Dựng lại: `node <pxl>/bin/pxl.js build assets/art/map.px.js --only <sprite…> --out assets/art/out && node tools/build_mapart.js && python3 tools/build_features.py && python3 tools/build_map.py && node tools/check_map.js`.
