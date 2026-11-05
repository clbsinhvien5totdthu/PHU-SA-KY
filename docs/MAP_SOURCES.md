# Nguồn và quy tắc bản đồ Map 01 (theo cẩm nang bản đồ pixel, 05/11/2026)
- **Khóa mặt bằng:** giữ hướng nhìn của sơ đồ gốc; không xoay, không thêm mũi tên Bắc, thước tỷ lệ hay toạ độ địa lý.
- **Toạ độ trong game** (`js/map.js`, `js/data/features.js`) đo trên ảnh chụp nghiêng, chưa nắn phối cảnh → mọi đối tượng ở trạng thái `provisional`. Cần nắn theo 4 góc tờ bản đồ rồi đo lại (sai lệch mục tiêu ≤ 1 tile).
- **Mức tin cậy:** A nguồn chính thức · B đọc được trên sơ đồ · C ảnh hiện trạng · D chưa xác nhận. Nhãn D (`CHÙA HÒA LONG`, `NHÀ ĐIỀU`) bị ẩn khỏi bản chơi, chỉ hiện khi `?debug`.
- **Manifest:** `data/feature_manifest.json` (hoặc `PSK.manifest()` trong console). Không ghi tên khi chưa chắc (`name_vi: null`).
- **Chưa khóa:** diện tích toàn khu (gần 9 ha / khoảng 10 ha tùy nguồn), diện tích Nhà trưng bày HCM, số khu chức năng (3 hay 4); không dùng để suy ra footprint.
- **Phân biệt:** Đền thờ (nhà bát giác cũ), Nhà sàn (mô hình 1:1 so với nguyên mẫu), nhà trưng bày về cụ Nguyễn Sinh Sắc và Nhà trưng bày Chủ tịch Hồ Chí Minh (khánh thành 19/5/2022) là các công trình khác nhau; nhãn `NHÀ TRƯNG BÀY` trên sơ đồ chưa xác định thuộc nhà nào.
- Nguồn S1–S6 xem cẩm nang gốc (Cổng Du lịch Đồng Tháp, Sở VHTTDL Đồng Tháp). Ảnh sơ đồ: MAP_USER_01.
