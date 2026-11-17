# Chương 1 – Gameplay làng Hòa An (V16 §5.5 mục 4, §5.2, §6)
Một bước mới được chèn trước bước bác Tư (`js/plugins/hoaan.js`, không sửa `quests.js`): **Bản đồ âm thanh**. Bước này nay là mục tiêu 6/9.

| Thành phần | Hành vi |
|---|---|
| 3 cụm bắt buộc + 1 tùy chọn | Xay lúa–giã gạo · xắt thuốc lá · nghề rèn · đờn ca tài tử, đặt trên bãi cỏ giữa làng. Mỗi cụm có 2 động từ: **Quan sát** (trạm diễn giải + một lựa chọn ghi sổ/ghép thẻ) và **Nghe** (âm thanh tổng hợp, phụ đề, nhãn ÂM THANH MINH HỌA). Không vận hành dụng cụ. Đờn ca: Nghe + Ghi chú, không khóa tuyến chính. |
| Bàn bản đồ của Khoa | Mở khi đủ 3 cụm. Ghép âm thanh ↔ cụm (chạm–chạm hoặc kéo-thả). Sai: gợi ý tăng dần (làm nổi hình nhịp → khoanh nét đứt), không trừ điểm. Mỗi âm có “Chưa đủ thông tin”; chỉ nhận “đã đối chiếu” khi ghép đúng. |
| Liên kết hội thoại | Chọn ghi “nhà nào cũng…” ở cụm xay lúa → Emma phản biện bằng tiếng Anh; câu hỏi “nhà nào cũng làm hay chỉ một số nhà?” mở ra với bác Tư (bác không chắc, không thêm dữ kiện). |
| Nút động từ | Nút Tương tác đổi nhãn + biểu tượng theo động từ (Quan sát / Nghe / Đối chiếu / Hỏi / Ghi chú). Biểu tượng nổi chỉ hiện khi lại gần. |
| 3 trạng thái vật thể | Chưa xem · Đã quan sát · Đã đối chiếu: biểu tượng riêng (vòng rỗng / nửa / dấu tích) + chữ; hiện ở huy hiệu trên cụm và mục “Điểm chạm” trong Sổ tay [N]. Khu mộ không có điểm chạm. |
| Nghệ thuật pxl | `assets/art/hoaan.px.js` → `node <pxl>/bin/pxl.js build assets/art/hoaan.px.js --out assets/art/out/ha && node tools/build_hoaan.js` → `js/data/hoaanart.js`. |

Kiểm thử đã chạy (Chromium headless): quan sát+nghe 3 cụm → bàn Khoa → ghép sai/đúng/“chưa đủ thông tin” → sang bước bác Tư; không có lỗi JS.
Lưu ý: vị trí cụm là đặt tạm trên bãi cỏ trống của bản đồ; âm thanh là tổng hợp WebAudio, cần thay bằng bản thu/cấp phép và đối chiếu dụng cụ thật với Ban quản lý.

## Mở đầu – màn chơi thư viện (V16 §4 Cảnh 01–02) · `js/plugins/thuvien.js`
| Màn | Hành vi |
|---|---|
| Ba dãy kệ (Cảnh 01) | Đi dọc 3 dãy kệ theo mã DM-01…DM-03, nhấn E để **Quan sát** từng dãy: mỗi dãy có một ô trống, được đánh dấu sau khi xem. Đủ 3 dãy → An nói “Danh mục vẫn ghi còn một bản…”; ghi vào Sổ tay: danh mục ghi còn một bản, chưa biết vì sao thiếu. Không phải pixel-hunt: kệ luôn sáng rõ. |
| Bê ba chồng sách (Cảnh 02) | Nhấc → mang (đi chậm hơn) → đặt xuống ô sáng trên bàn phòng đọc mới, đi vòng dãy bàn và xe sách. Chồng thứ ba: quyển bìa xanh sẫm trượt ra, rồi hội thoại cũ tiếp tục (xem trang ghi chú, tờ ba cột…). |
| Chung | Không thua/phạt/giờ. “Bỏ qua phần này” luôn có. WASD/mũi tên + E, hoặc nút cảm ứng ←↑↓→. Esc thoát cùng với cảnh mở đầu. |

Cách gắn: `seq()` (state.js) nhận thêm “mục-hàm” `n=>…` (gọi `n()` để đi tiếp); `prologue.js` chèn hai mục `LIB.shelves` / `LIB.carry`. Nếu thiếu plugin thì tự bỏ qua. **An dùng đúng bộ khung đi có sẵn của game** (`IM.an_idle`, `an_w0..5`, `an_u/an_l/an_s0..8`; cùng nhịp ANW/70 ms như `scene.js`), vẽ 1:1 trên canvas 960×540; bối cảnh vẽ ×3. Nghệ thuật pxl còn lại (kệ, thùng, chồng sách, bàn, xe sách, cô Hạnh): `assets/art/thuvien.px.js` → `node tools/build_thuvien.js` → `js/data/thuvienart.js`.
Đã kiểm thử bằng Chromium headless: cả hai màn chơi bằng phím, cả đường “Bỏ qua”, chạy hết PRO không lỗi.

## Vẽ lại nghệ thuật (pxl) — độ phân giải gốc, cùng mật độ điểm ảnh với An và nhà trong game
- Trước đây đồ vật vẽ chunky rồi phóng ×2/×3, viền tím đậm lệch phong cách. Nay **mọi sprite vẽ ở độ phân giải gốc** (An 48×64 ↔ kệ 394×134, bàn 188×80, Hòa An 98–178 px), viền nâu sẫm mảnh, ánh sáng từ trên-trái, gam ấm; vẽ 1:1 trong game (không phóng sprite).
- Thư viện (`assets/art/thuvien.px.js`): kệ sách có sách đủ màu, bóng, nhãn đồng; mỗi kệ một ô trống có vệt bụi và quyển sách bên cạnh nghiêng đổ; thùng sách, chồng sách lệch nhau, quyển bìa xanh nhũ phai, bàn phòng đọc có sổ mở và đèn xanh, xe sách, chậu cây, ghế, cô Hạnh (kính, tóc bạc). Nền (tường ốp gỗ, cửa sổ, sàn gỗ so le, thảm, tia nắng, bụi bay) dựng bằng canvas 960×540.
- Hòa An (`assets/art/hoaan.px.js`): cối giã đòn bẩy + cối xay đá, bàn xắt thuốc + giàn phơi sợi vàng, lò rèn mái lá có lửa phát sáng (`glow`), điểm đờn ca, bàn bản đồ của Khoa; biểu tượng động từ 24×24, huy hiệu trạng thái (vòng rỗng · nửa vàng · dấu tích xanh), hình nhịp âm thanh 60×22.
- Dựng lại: `node <pxl>/bin/pxl.js build assets/art/<tên>.px.js --out assets/art/out/<ha|tv>` rồi `node tools/build_hoaan.js` / `node tools/build_thuvien.js`.

## Vẽ lại lần 3 — phong cách Việt (Nam Bộ), chi tiết hơn (trên nền tileset thực tế v17)
- **Hòa An** (`assets/art/hoaan.px.js`): cối xay lúa tre trét đất + cối giã chày đạp có cột tre vịn, nón lá, chum sành, thúng lúa, nia gạo; bàn xắt thuốc, nong tre phơi sợi vàng, giàn treo lá, ấm trà tích đất; lò rèn mái lá dừa nước có lửa phát sáng, ống bễ, đe, giá treo dao/rựa/liềm; điểm đờn ca với chiếu hoa, hai nhạc công (áo bà ba, khăn rằn), đàn kìm + đàn tranh, bộ trà; bảng trạm diễn giải trước mỗi cụm; gà mổ thóc (2 khung, đổi theo thời gian). Nhạc công/gà/bảng chỉ để khu làng có sự sống — người chơi vẫn không vận hành dụng cụ.
- **Thư viện** (`assets/art/thuvien.px.js` + nền trong `thuvien.js`): tường vàng kiểu Pháp thuộc, cửa chớp xanh lá, sàn gạch bông (hai mẫu ô hoa/ô thoi, làm dịu để không lấn nhân vật), tờ lịch, đồng hồ treo tường, tranh sông nước; tủ thẻ danh mục, quạt đứng, lan hồ điệp chậu gốm men lam, ghế gỗ lưng mây, bàn có bộ ấm trà tích + bình sen; cô Hạnh mặc áo dài, thẻ nhân viên, chớp mắt định kỳ (`lb_hanh_b`).
- Tất cả sprite vẽ ở độ phân giải gốc, đặt 1:1.
