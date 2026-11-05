# Hướng dẫn tích hợp

## Sự kiện (PSK.on)
| Sự kiện | Đối số | Thời điểm |
|---|---|---|
| `ready` | scene | Scene Phaser tạo xong (`PSK.scene`) |
| `start` | game | Sau cutscene, game được tạo (`PSK.game`) |
| `step` | chỉ số bước mới | Hoàn thành một nhiệm vụ |
| `zone` | tên khu vực | Người chơi bước sang khu vực khác |
| `end` | `st` (tr = Tin cậy, tp = Minh bạch) | Kết thúc Map 01 |

## Biến toàn cục lõi
`st` (tiến độ), `K` (Sổ nghe: known/told/open), `V` (từ vựng), `STEPS`, `seq(items,done)` (hộp thoại; item = `[người nói, văn bản, [[nhãn, callback→item[]]]]`), `vocab()`, `toast()`, `nx()`.

## Quy ước tư liệu (khớp mục 11.1)
Mỗi mẩu tư liệu nên có: id, tên, địa điểm, niên đại, loại nguồn (official_text / artifact / oral / photo / audio / inference / fiction), xuất xứ, người cung cấp, ngày thu thập, quyền sử dụng, phạm vi công bố, trạng thái kiểm chứng (cross_checked / needs_check / insufficient / unused), liên kết nhiệm vụ. Xem `data/sources.example.json`. Hiện thẻ trong game (`CARDS`) vẫn viết trực tiếp trong code; bước tiếp theo là nạp từ JSON.

## Thứ tự nạp script
`psk → config → data/zones → data/characters → map → state → data/quests → portraits → ui → scene → hud → cutscene → main → plugins`. Các file dùng chung biến toàn cục nên giữ nguyên thứ tự khi thêm file.
