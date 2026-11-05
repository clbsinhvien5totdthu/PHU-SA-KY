# Đối chiếu Chương 1 với tài liệu thiết kế
| Bước | Địa điểm | Mục trong tài liệu |
|---|---|---|
| Cutscene | Thư viện → đường → cổng | §4 Cảnh 01–04 |
| 1 | Cổng số 1: bảng hướng dẫn | §5.2 Cổng và lối vào |
| 2 | Khu mộ (đứng yên quan sát, không giải đố) | §5.1, §5.2 |
| 3 | Ao sen xoắn | §5.2 Nhà sàn và ao sen |
| 4 | Nhà trưng bày: dòng thời gian, đối chiếu ghi chú | Nhiệm vụ chính 01 |
| 5 | Nhà sàn mô phỏng | §5.2 |
| 6 | Bác Tư, làng Hòa An | Nhiệm vụ chính 02, §8.2 |
| 7 | Bến sổ (chỗ đứng cạnh bờ Hồ Sen, không dựng bến thật): ba cột, giữ dấu hỏi hay điền tên | Nhiệm vụ chính 03 |
| 8 | Cổng số 2: ký hiệu, bản ghi âm | §5.4 |
Không có thanh điểm đúng/sai (§6.4): lựa chọn chỉ đổi thái độ NPC và chú giải cuối chương.

## Bản viết lại (Story Bible – mở đầu thư viện)
| Thành phần | Nơi cài | Mục tài liệu |
|---|---|---|
| Mở đầu chơi được: thư viện, quan sát ghi chú, xin phép chụp, phiếu tiếp nhận (thầy Lâm), rủ Emma–Khoa | `js/data/prologue.js` (chạy trước cutscene đường đi) | §4 Cảnh 01–03 |
| Sổ tay 3 lớp Dấu vết / Lời kể / An suy nghĩ; nhãn đã đối chiếu · lời kể · giả thuyết · hư cấu tái dựng; nguồn + độ chắc chắn | `js/ui.js` (`nbook`), `rec()` trong `js/state.js` | §6.2 |
| Ghi nhận lời bác Tư: ghi tay / ghi âm có đồng ý / không lưu / bật vội; câu hỏi mở theo mốc đã có trong sổ | `js/data/quests.js` (bước 6) | §5.3 NV02, §6.2, §8.1 |
| Khung 8 chương + đường dây An–Emma–Khoa, phím J | `js/data/chapters.js` | §7, §7.2 |
Cờ ảnh hưởng chú giải cuối chương: `st.c.hurry` (chụp/nhờ vội ở thư viện), `st.c.rush`, `st.c.name`, `st.c.mode`.
