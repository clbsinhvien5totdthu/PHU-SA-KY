# Nguồn và quy tắc bản đồ Map 01 (theo cẩm nang bản đồ pixel v2.0, 05/11/2026)

## Dữ liệu dùng để dựng
| Tệp | Vai trò |
|---|---|
| `data/ref/01_master_plan_reference.png` | Sơ đồ chuẩn đã cắt khung 1840×1408 (tách từ PDF v2.0). Nguồn duy nhất cho hình học. |
| `data/ref/03_feature_manifest.csv` | 51 hạng mục: ID, tên, ô (col,row), mức tin cậy, trạng thái. |
| `tools/build_map.py` | Dựng lưới 230×176 ô (1 ô = 8 px sơ đồ) → `js/data/mapdata.js`; xuất `data/ref/overlay_check.png` (chồng bản đồ lên sơ đồ để nghiệm thu). |
| `tools/build_features.py` | Sinh `js/data/features.js` từ CSV (nhãn, cổng, sprite theo ID). |
| `tools/check_map.js` | `node tools/check_map.js`: mọi bước nhiệm vụ, 7 cổng đều đi tới được từ Cổng số 1; mỗi hạng mục có lối đi trong ≤ 4 ô. |

Công thức ô: `col = (x−40)÷8`, `row = (y−40)÷8` trên ảnh gốc 1920×1489, tức `x÷8`, `y÷8` trên ảnh đã cắt. Trong game `Q = 1/8`, `T = 16` px/ô.

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
