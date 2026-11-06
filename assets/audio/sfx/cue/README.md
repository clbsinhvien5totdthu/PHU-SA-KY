# Âm thanh thật cho cutscene (tùy chọn)
Mặc định intro dùng âm **tổng hợp** trong `js/sfx.js` (không bản quyền). Muốn thay bằng file thật: bỏ file vào thư mục này, đặt tên đúng rồi chạy
`python tools/build_sfx_cues.py` (đóng gói thành `js/data/cuedata.js`, chạy được cả khi mở file://). File nào có thì được ưu tiên.

| Tên file | Phát khi | Từ khóa tìm kiếm |
|---|---|---|
| whoosh.* | chuyển cảnh | whoosh, swoosh soft |
| swell.* | dâng lên trước khi trắng xoá (sông, đường) | riser, swell, cinematic rise |
| impact.* | vào thư viện | soft impact, sub boom |
| oar.* | mái chèo khua nước | paddle splash, oar water |
| bell.* | chuông xe đạp | bicycle bell |
| step.* | bước chân sàn gỗ | wood floor footstep |
| creak.* | cửa kẽo kẹt | door creak |
| pen.* | bút sột soạt | pencil writing, pen scratch |
| petal.* | cánh sen chạm bàn | small chime, paper drop |
| gong.* | hiện tên game | temple bell, gong |
| cricket.* / frog.* | cổng lúc chạng vạng | cricket chirp, frog croak |
| chain.* | xích xe đạp | bicycle freewheel click |

Nguồn miễn phí an toàn: Pixabay Sound Effects (Pixabay Content License: dùng thương mại, không cần ghi nguồn), Mixkit (Mixkit License), Freesound (lọc **CC0**).
Tránh: BBC Sound Effects (RemArc, chỉ phi thương mại) và bất kỳ mẫu CC-BY-NC.
