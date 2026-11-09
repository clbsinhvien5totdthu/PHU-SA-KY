# Nguồn và quy tắc bản đồ Map 01 (theo cẩm nang bản đồ pixel v2.0, 05/11/2026)

## Dữ liệu dùng để dựng
| Tệp | Vai trò |
|---|---|
| `data/ref/01_master_plan_reference.png` | Sơ đồ chuẩn đã cắt khung 1840×1408 (tách từ PDF v2.0). Nguồn duy nhất cho hình học. |
| `data/ref/03_feature_manifest.csv` | 51 hạng mục: ID, tên, ô (col,row), mức tin cậy, trạng thái. |
| `tools/build_map.py` | Dựng lưới 230×176 ô (1 ô = 8 px sơ đồ) → `js/data/mapdata.js`; xuất `data/ref/overlay_check.png` (chồng bản đồ lên sơ đồ để nghiệm thu). |
| `tools/build_features.py` | Sinh `js/data/features.js` từ CSV (nhãn, cổng, sprite theo ID). |
| `tools/check_map.js` | `node tools/check_map.js`: mọi bước nhiệm vụ, 7 cổng đều đi tới được từ Cổng số 1; mỗi hạng mục có lối đi trong ≤ 4 ô. |

**Bản v3 (tỉ lệ gấp đôi):** lưới 460×352 ô, 1 ô = 4 px sơ đồ (`col = x÷4`, `row = y÷4` trên ảnh đã cắt khung), `Q = 1/4`, `SS = 3` (sprite công trình), `SC = 2` (hệ số nhân so với bản v2; toạ độ `p`/`zone` trong `quests.js` đã nhân đôi). Nền vẽ bằng Tilemap Phaser.

Công thức ô bản v2 (cũ): `col = (x−40)÷8`, `row = (y−40)÷8` trên ảnh gốc 1920×1489, tức `x÷8`, `y÷8` trên ảnh đã cắt. Trong game `Q = 1/8`, `T = 16` px/ô.

## Quy tắc đã áp dụng
- Giữ hướng nhìn của sơ đồ; không xoay, không mũi tên Bắc, không thước tỷ lệ, không toạ độ địa lý.
- Ranh khu, khu mộ (cỏ đậm), Hồ Sen, kênh quanh làng lấy từ màu trên sơ đồ; mặt nước khu B và vòng kênh khu F đo tay trên ảnh phóng (không gộp thành một hồ).
- 7 cổng đúng số và vị trí (1, 2, 3, 4, Cổng vào mộ cụ, Cổng/cầu không nhãn, Cổng khu ẩm thực). Cổng 48 không có tên.
- Mỗi hạng mục đặt đúng ô trong CSV. Nhà trong làng không xếp lưới. Không thêm nhà, tượng, bến, cầu, ao ngoài sơ đồ. Cây chỉ ở nơi sơ đồ có chấm xanh (quanh Hồ Sen, vài cây khu B).
- Hạng mục chưa chắc (`VERIFY` trong `features.js`): Nhà kiểng, Chùa Hòa Long, Nhà trưng bày, hai điêu khắc, Nhà Cụ Sắc, hai Nhà trên cọc, Cổng 48, khối viền trắng (50), mảng chữ nhật dài (51). Chỉ vẽ footprint/điểm, không gán kiến trúc. Nhãn "Nhà trên cọc" khó đọc nên chỉ hiện khi `?debug`.
- Chữ là lớp riêng (nhãn Phaser), không nằm trong ảnh.

## Còn là giả định (provisional, cần Ban quản lý hoặc vector hóa để khóa)
1. Lối đi: trục ngang, trục dọc, lối Cổng 1, lối trong làng được vẽ theo vị trí tương đối; đường cong chi tiết chưa trace theo vector.
2. Chỗ lối đi cắt kênh nhánh (khu D–E gần bãi xe và trong làng) là đường liền trên sơ đồ, game cho đi được; sơ đồ không vẽ ký hiệu cầu.
3. Hồ Sao: cẩm nang ghi là hồ; trên ảnh sơ đồ ngôi sao tô xanh lục nhạt. Game vẽ là mặt nước, cần xác nhận.
4. Footprint từng nhà: dùng sprite cỡ ~38 px sơ đồ (cẩm nang: 36–50 px), chưa trace đa giác thật.
5. Sai số vị trí ±20 px (2–3 ô) theo cẩm nang; nghiệm thu mục tiêu ≤ 2 ô.
6. Hai mũi tên vàng "hướng xe khách" và đường ngoài khu chưa vẽ chi tiết.
- Chưa khóa: diện tích toàn khu (gần 9 ha / khoảng 10 ha), diện tích Nhà trưng bày HCM, số khu chức năng (3 hay 4). Không dùng để suy ra footprint.
- Phân biệt: Đền thờ (nhà bát giác cũ), Nhà sàn (mô hình 1:1 so với nguyên mẫu), nhà trưng bày về cụ Nguyễn Sinh Sắc và Nhà trưng bày Chủ tịch Hồ Chí Minh (khánh thành 19/5/2022) là các công trình khác nhau; nhãn `NHÀ TRƯNG BÀY` trên sơ đồ chưa xác định thuộc nhà nào.
- Nguồn S1–S6, W1, U1 xem cẩm nang gốc (Cổng Du lịch Đồng Tháp, Sở VHTTDL Đồng Tháp). Sơ đồ: MAP_USER_02.

## Bản v3: sông, cầu, viền trắng
- Mạng nước (`MAIN`, `LOOP`, `POND` trong `tools/build_map.py`) đo tay theo đường tim + bề rộng trên sơ đồ, chạy liền một khối: kênh chính từ phía trên (cạnh Chùa Hòa Long) xuống dọc phía tây làng tới gần bãi xe; vòng kênh quanh cụm nhà tách ra phía trên, khép lại vào kênh chính phía dưới; ao nhỏ cạnh Nhà bát dần 1 nối vào kênh chính.
- Cầu (`BR`): Cổng/cầu 48 (có trên sơ đồ); các cầu còn lại đặt ở chỗ lối đi trên sơ đồ cắt qua kênh (lối D–E, lối Cổng 2 lên làng, bốn lối sang rìa phải). Cầu ngoài Cổng/cầu 48 là suy ra từ lối đi, chưa có ký hiệu riêng trên sơ đồ → `provisional`.
- Viền trắng (`PH` trong `mapdata.js`): Nhà kiểng, Chùa Hòa Long (4 khối), mảng chữ nhật số 51, khối số 50, bãi xe, hai điêu khắc, lô trống tây bắc. Thêm chỗ cần vẽ: thêm dòng vào `PH` của `build_map.py` rồi chạy lại. Mở game với `?debug` để hiện ID cạnh từng viền.
- Kiểm tra: `node tools/check_map.js` (mọi bước nhiệm vụ và 7 cổng tới được từ Cổng số 1).

## Bản v4: vẽ lại bằng pxl cho thơ mộng
- **Nguồn tranh:** `assets/art/map.px.js` (pxl). Dựng: `node <pxl>/bin/pxl.js build assets/art/map.px.js --out assets/art/out && node tools/build_mapart.js` → `js/mapart.js` (data URI, mở file:// vẫn chạy).
- **Ô nền 16×16** (`m_g*` cỏ, `m_gf*` cỏ hoa, `m_d*` cỏ cắt sọc khu mộ, `m_w*` nước, `m_p*` gạch lát, `m_plz` sân lát, `m_bd*` lề vàng, `m_rd*` đường nhựa, `m_pk_*` ván cầu) + **lớp phủ viền** (`m_bank_*` bờ nước, `m_wedge_*` mép nước, `m_pedge_*` viền lối đi, `m_rail_*` lan can cầu). `scene.js` ghép tileset theo tổ hợp loại ô + hướng viền.
- **Công trình** `m_h_*` (exh, th, th2, dt, bql, san) vẽ đúng độ phân giải hiển thị, game đặt scale 1 (không còn "mixel" phóng 3×). Muốn thay bằng sprite tự vẽ: sửa/ghi đè `m_h_<mã>` hoặc bỏ nó đi để quay lại sprite cũ.
- **Trang trí (`MAPDATA.DECOR`)** sinh bởi `build_map.py` mục 10, seed cố định, **chỉ là lớp thẩm mỹ, không phải dữ liệu từ sơ đồ**: cây (bàng, phượng, dừa, tre, liễu), bụi hoa giấy, thảm hoa, lau lách, sen, đèn lồng, ghế đá, đá cuội. Luật: không đè lối đi, cầu, công trình, cổng, viền trắng (PH); không đặt trong khu mộ cỏ đậm; thân cây chặn 1 ô nhưng `check_map.js` vẫn phải đạt. Muốn tắt: đặt `MAPDATA.DECOR=[]`.
- **Khí quyển:** lớp nhân màu nắng chiều đổi theo đồng hồ trong game (17:30 ấm vàng → 18:40 tím hồng), ánh đèn lồng nhấp nháy mạnh dần, đom đóm quanh nước, cánh hoa rơi quanh phượng/liễu, vignette nhẹ.

## Tối ưu hiệu năng (v4.1)
- **Draw call:** gộp ảnh trang trí/công trình vào một atlas lúc chạy (`mpk`): draw call/khung 12 → 6, bindTexture 145 → 69 (đo trên cùng cảnh làng Hòa An).
- **Hậu kỳ:** bỏ vignette/bloom của camera và lớp nhân màu cỡ cả map; thay bằng lớp phủ DOM alpha thường (`#tint`, `#vig`), rẻ hơn nhiều trên GPU yếu/điện thoại.
- **Khởi động:** dựng tileset bằng khoá số, ít tổ hợp hơn và canvas tạm (trước đó ~2,7 s CPU ở bước này, nay không đáng kể). Canvas đọc ngược pixel trong cutscene dùng `willReadFrequently` để tránh "GPU stall due to ReadPixels".
- **Mỗi khung:** minimap chỉ vẽ ~9 lần/giây; âm lượng nhạc chỉ ghi khi đổi đáng kể.
- **Chế độ nhẹ:** tắt đom đóm, cánh hoa, lấp lánh nước, ánh đèn. Tự bật khi FPS < 38 trong 6 giây liên tiếp; hoặc mở thẳng với `?lite`. Console có dòng "[psk] chế độ nhẹ".
