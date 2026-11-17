# Sông – cầu – nhà (sửa trong `tools/build_map.py`, v17)

**Quy tắc thực tế**
1. Sông/kênh là **một mạng nối liền** (kênh chính + kênh vòng + ao): kênh vòng bắt đầu và kết thúc ở kênh chính.
2. **Không công trình nào đứng trên nước.** Đường tim của kênh được tự đẩy ra khỏi chân mọi công trình (chừa 2 ô + nửa bề rộng kênh) rồi làm mượt, nên kênh uốn quanh nhà thay vì chạy xuyên qua. Kích thước chân công trình lấy đúng theo sprite trong game (`FOOT`, `FOOT_MULTI`).
3. **Cầu chỉ có ở chỗ một con đường cắt qua kênh**, và đường phải đi tiếp lên bờ ở cả hai phía. Không còn danh sách cầu đặt tay (`BR`): mọi nét đường loại 5/8 được dò (`crossings()`), nét vào nước rồi hết được ghép với nét tiếp ở bờ bên kia cùng hướng (`DANG_IN/DANG_OUT`). Lối đi chết bên bờ thì dừng ở bờ, không có cầu cụt.
4. Các đường phía đông kênh vòng vốn dẫn sang cụm nhà (`LINK_OK`) được kéo thẳng qua kênh tới đường bên kia, khi đó cầu tự xuất hiện. Đường chéo cắt kênh tới Nhà Bát Dần 2 được thay bằng lối vào ở phía đông.
5. `build_map.py` tự kiểm tra khi chạy: không nhà nào chồng lên ô nước; mỗi cầu có đường ở hai đầu (sai thì báo lỗi). `tools/check_map.js` vẫn kiểm tra mọi mục tiêu/cổng đi tới được.

**Kết quả** (mới → trước): 8 cầu, đều nằm trên đường (trước: 7 cầu, trong đó 3 cầu một đầu không có đường); 3 nhà từng nằm trên kênh (Ông Năm Giáo, Bát Dần 2, Cả Nhị Ngưu) nay nằm trên đất liền.

**Chưa đổi:** hồ Sen, hồ Sao và hồ phía tây là hồ độc lập (theo sơ đồ), chưa nối bằng kênh; đầu bắc/nam của kênh chính dừng ở ranh khu di tích. Nếu muốn nối hồ Sen với kênh chính cần thêm một đoạn kênh và một cầu ở đường vòng hồ.

## Cập nhật (nước liền, 1 cầu, lối đi tự nhiên, nhiều cây)
- **Nước liền:** đầu nhánh kênh vòng phía tây nay kéo vào kênh chính (`LOOP` thêm điểm cuối nằm trong lòng kênh chính). `build_map.py` kiểm tra bằng liên thông 4 hướng: kênh/ao phải là **một khối**, tách dù chỉ một dải cỏ cũng báo lỗi.
- **Bỏ cầu thừa:** bỏ lối `x=292` chạy từ nhà Ông Năm Giáo xuống cắt kênh (sát cầu `x=302`). Còn **6 cầu**, đều nằm trên lối đi và đều có đường hai đầu.
- **Lối đi thực tế (`lane()`):** lối trong làng không còn gấp khúc vuông góc: góc bo tròn (Chaikin), tim đường uốn nhẹ theo sóng chậm (~1 ô), bề rộng lúc thon lúc phình; đầu mút, ngã ba và đoạn gần kênh ghìm thẳng để nối khít và để cầu vẫn thẳng; lối không đè lên nhà. Thêm **lối mòn** (đường đất hẹp) uốn qua từng điểm Hòa An trên bãi cỏ giữa làng. Trục trang nghiêm và đường khu A/B vẫn giữ thẳng.
- **Cây (theo hệ sinh thái nước ngọt Đồng Tháp, `pxl-art-director`):** thêm sprite xoài (Cao Lãnh), mít, bưởi, cau, chuối, tràm (`assets/art/map.px.js`, `m_xoai/mit/buoi/cau/chuoi/tram`; đăng ký trong `scene.js`). Vườn nhà: mỗi nhà 3–6 cây ăn quả/cau/chuối cách chân nhà 2.5–9 ô, chừa trống phía trước cửa; tràm thưa ven kênh; vài hàng cau dọc lối; xen thêm cây ăn quả ở bãi giữa. Tổng số cây ~190 (trước ~85). Không dùng dừa nước/bần/đước (không hợp nước ngọt nội đồng). Vùng các điểm Hòa An được chừa trống.
