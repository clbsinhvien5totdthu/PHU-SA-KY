# Chương 1 – v18: nâng cấp HUD/UX và gameplay

Mã nguồn: `js/plugins/ch1plus.js`, `css/ch1plus.css` (plugin mới, nạp cuối `index.html`) + vài điểm vá nhỏ trong `js/data/quests.js`.

## Vòng chơi mới
Đặt giả thuyết sớm → bị kiểm chứng → đảo chiều giữa chương → hỏi có hạn → bàn đóng dấu → thẻ triển lãm có cái giá.

| Nhịp | Thay đổi |
|---|---|
| Cổng số 1 | Người chơi **đặt Giả thuyết #1** (4 lựa chọn, kể cả “chưa đoán”) trước khi đọc bảng. Khoa và Emma phản ứng khác nhau theo lựa chọn. |
| Nhà trưng bày | Giả thuyết được **đối chiếu**: tự sửa / đúng một phần. Không điểm, không phạt. Mở câu hỏi mới “vì sao Hòa An lặp lại?”. |
| Làng Hòa An | Mũi tên, minimap và la bàn tự nhắm cụm nghề **chưa xong gần nhất**. Xong bản đồ âm thanh → **lớp dấu mực** (hư cấu) hiện trên minimap. |
| Bác Tư | Thanh **“Sức bác Tư”** (4 lượt). Câu cuối **chỉ hỏi được một trong ba**; hai câu còn lại thành mục “để dành” trong Sổ tay. |
| Hồ sơ nguồn | 10 hộp thoại → **một bàn đóng dấu**: 3 thẻ tranh cãi (hai trục A/B cùng một màn hình, gợi ý rồi mới tự điền), 2 thẻ Khoa đóng sẵn. Đủ 5 mục ghi sổ như cũ. |
| Thẻ triển lãm | Thay lựa chọn “giữ dấu hỏi / điền tên” bằng **hai bản thẻ nhìn thấy được**: A trung thực nhưng trống hơn, B hấp dẫn hơn nhưng bắt buộc nhãn “giả thuyết”. |
| Màn kết | Khối **“Hành trình của riêng bạn”** + lời nhắc Chương 2 sẽ gọi lại lựa chọn thẻ. |

## HUD/UX
- Thẻ mục tiêu có **CÂU HỎI** dẫn dắt theo từng bước (mục tiêu cũ giữ bên dưới).
- Chip **Giả thuyết #1** + trạng thái (⏳ chờ / ◐ đúng một phần / ✎ đã tự sửa); bấm để mở Sổ tay.
- **La bàn mép màn hình** khi mục tiêu ngoài tầm nhìn (kèm số giây đi bộ).
- Bộ đếm “＋1 Dấu vết / Lời kể / An nghĩ” khi Sổ có mục mới.
- Sổ tay có mục **Bảng giả thuyết**.
- Bàn đóng dấu/thẻ triển lãm chặn phím tắt N/C/J/M/E khi đang mở; có `role=dialog`, nút bấm thật, nhãn chữ đi kèm màu.

## Giữ nguyên
Không giới hạn thời gian, không trừ điểm, khu mộ không có điểm chạm, nội dung hư cấu luôn gắn nhãn.

## Chi tiết hư cấu mới cần duyệt (Trụ cột 2)
Lớp dấu mực trên bản đồ số của Khoa; nhân vật “ông Bảy” do bác Tư nhắc. Cả hai chỉ nằm trong bản đồ số/lời kể hư cấu, không đặt lên hiện vật hay khu tưởng niệm thật.

## Âm thanh định hướng (đã làm)
Ở bước vòng làng, mỗi cụm nghề chưa xong có một nguồn âm riêng (WebAudio): nhỏ dần theo khoảng cách (bán kính 24 ô), pan trái/phải theo vị trí, tự tắt khi hội thoại/Sổ tay/bàn bản đồ đang mở, tự dừng khi cụm đã quan sát và nghe xong. Luôn có phụ đề chữ (“Có tiếng động ◀ bên trái · gần”) và nút tắt/bật; không dùng âm thanh làm kênh thông tin duy nhất. Phụ đề không nói tên cụm, để không lộ đáp án ghép âm thanh.

## Chưa làm / cần người thật
Đối chiếu với Ban quản lý: xem `docs/CHAPTER1_REVIEW_CHECKLIST.md` (đã gom sẵn mốc cần xác nhận và các chi tiết hư cấu cần duyệt).

## HUD pixel art + tiếp cận (v18b)
Mã: `tools/gen_hud_art.py` (sinh `assets/ui/*.png`, chạy lại bằng `python3 tools/gen_hud_art.py`), `css/hudpx.css`, `js/plugins/hudpx.js`.

**Nghệ thuật** (theo pxl-art-director): một nguồn sáng trên-trái; bậc màu hue-shift (bóng ngả đỏ-tím, sáng ngả vàng); không đen/trắng thuần (mực `#2a1f33`, sáng nhất `#fff6d8`); khung = viền + vành sáng 1px + khe tối 1px; đinh đồng ở góc; phóng 2x số nguyên, `image-rendering:pixelated`.
- Khung giấy dó + gỗ (9-slice), khung chip, nhãn gỗ tối, nút đồng 3 trạng thái + nút “đang chọn”, ô lựa chọn hội thoại, pip tiến độ.
- 17 icon 12x12 thay emoji (sổ tay, nhân vật, bản đồ, nhạc, giao diện, kính lúp, bong bóng, bóng đèn, la bàn, giọt mực, loa bật/tắt, đồng hồ cát, nửa tròn, bút chì, dấu tích, dấu hỏi, ghim, đồng hồ) + mũi tên la bàn 8 hướng vẽ pixel (không xoay mờ).
- QA bằng `pxl_qa.py`: không cảnh báo.

**Tiếp cận**
- Bảng **Giao diện** (nút trong cột phải): cỡ chữ Vừa/Lớn/Rất lớn, **tương phản cao** (khung + chữ mực đậm, 17:1), **giảm chuyển động** (cũng theo `prefers-reduced-motion`), **chữ hội thoại hiện ngay**, bật/tắt âm thanh vòng làng. Lưu trên máy; Esc đóng; Tab bị giữ trong bảng; phím tắt game bị chặn khi mở.
- Mọi trạng thái bật/chọn có thêm dấu ✔ và chữ “Đang bật/tắt”, không chỉ đổi màu.
- Mục tiêu cảm ứng ≥ 44px trên màn cảm ứng; vòng focus vàng rõ khi dùng bàn phím; nhãn `aria-label` có phím tắt (“Sổ tay, phím N”).
- Vùng đọc cho trình đọc màn hình: mỗi dòng hội thoại được đọc đủ một lần (không đọc từng chữ khi đang gõ).
- Tỷ lệ tương phản đo được: chữ/giấy 11.8:1, chữ/nút đồng 6.7:1, chữ nhãn gỗ 5.4:1, chữ phụ 8.3:1.
- Màn hẹp: biển địa điểm xuống dưới, la bàn tránh cột nút, ẩn kbd.

**Hạn chế đã biết**: chưa kiểm với trình đọc màn hình thật (NVDA/VoiceOver) và chưa thử trên Safari/Firefox; cỡ chữ lớn dùng CSS `zoom` (Firefox cần bản 126+). Font pixel VT323/Playfair tải từ Google Fonts, ngoại tuyến sẽ rơi về font hệ thống.
