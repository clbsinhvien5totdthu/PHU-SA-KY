# Phù Sa Ký – dự án game (Map 01)

Chạy: `sh serve.sh` (hoặc `serve.bat`) rồi mở http://localhost:8080 — hoặc mở thẳng `index.html`.
Tham số URL: `?skip` bỏ cảnh mở đầu · `?debug` bật dịch chuyển (phím 1–6) và hiển thị toạ độ.
Offline: đặt `phaser.min.js` (3.80.1) vào `vendor/`. Chia sẻ 1 file: `python tools/build_single.py` → `dist/phu_sa_ky.html`.

## Cấu trúc
| Đường dẫn | Vai trò |
|---|---|
| `index.html` | Khung HTML/HUD + thứ tự nạp script (script thường, không cần bundler, chạy được qua file://) |
| `css/style.css` | Toàn bộ giao diện (HUD, hộp thoại, cutscene) |
| `js/psk.js` | `PSK`: cấu hình + bus sự kiện `ready · start · step · zone · end` |
| `js/data/` | **Nội dung**: `quests.js` (nhiệm vụ, thoại), `characters.js` (hồ sơ nhân vật), `zones.js` (tên khu vực) |
| `js/map.js`, `js/data/mapdata.js` | Nạp lưới 460×352 ô sinh bởi `tools/build_map.py` từ sơ đồ chuẩn (đừng sửa tay mapdata.js) |
| `assets/art/out/sprites/an_w0..5.png`, `an_front.png` | An có balo (nhân vật chính: 6 khung đi xuống, khung 0 = đứng yên, thu 1/2 trong `scene.js`; hướng khác tạm dùng khung đứng yên) và An không balo (ngồi thư viện, `cine_art.js`) |
| `js/scene.js` | Phaser scene: sprite sinh bằng code, đối tượng, camera |
| `js/cutscene.js`, `js/hud.js`, `js/ui.js`, `js/portraits.js` | Hệ thống tương ứng |
| `js/plugins/` | Tính năng gắn thêm qua `PSK.on(...)` (xem `_template.js`) |
| `js/cutscene.js`, `js/cine_art.js` | Cutscene mở đầu dựng như phim: danh sách cú máy (`SH`), camera có thị sai, chuyển cảnh, ánh sáng/bloom/hạt phim; mỗi câu thoại tự đổi góc máy (`onLine`). Xem thử một cú máy: `CIN.preview('anA',3)` trong console |
| `js/plugins/music.js` | Nhạc nền khu di tích (`assets/audio/sang_mekong_delta.mp3`), phím **U** bật/tắt, tự nhỏ lại khi có hội thoại |
| `js/plugins/sfx_ui.js`, `js/data/sfxdata.js` | Hiệu ứng âm thanh: bước chân (cỏ/sỏi), bấm nút, thông báo, xong mục tiêu. Mẫu gốc ở `assets/audio/sfx/src/`, bản đã xử lý ở `assets/audio/sfx/*.wav`; `sfxdata.js` là bản nhúng base64 của các file này |
| `data/` | Dữ liệu ngoài code: `sources.example.json` (cấu trúc tư liệu, mục 11.1); khung 8 chương nay ở `js/data/chapters.js` |
| `assets/` | Chỗ đặt `audio/`, `img/`, `fonts/` khi thay đồ họa/âm thanh thủ tục bằng tài nguyên thật |
| `docs/` | `INTEGRATION.md` và tài liệu thiết kế gốc |

## Thêm gì ở đâu
- **Bước nhiệm vụ / NPC mới:** thêm phần tử vào `STEPS` (`js/data/quests.js`): `{p:[x*Q,y*Q], o:'mục tiêu', run:()=>seq([[người nói, thoại, lựa chọn?], …], ()=>nx())}`. Toạ độ `p` là ô lưới (col,row) của sơ đồ chuẩn 230×176; tra ô trong `js/data/features.js`.
- **Nhân vật:** thêm vào `PC` (chân dung) và `CH` (hồ sơ) trong `js/data/characters.js`; sprite đi lại tạo bằng `chr(...)` trong `js/scene.js`.
- **Chương/bản đồ mới:** tách `map.js` + `STEPS` theo chương, hoặc nạp lại scene với bộ dữ liệu khác; danh sách chương ở `data/chapters.json`.
- **Âm thanh, lưu game, thống kê:** viết plugin dùng `PSK.on('step'|'zone'|'end')`.
- **Đồ họa thật:** thêm `preload(){this.load.image(...)}` vào `class G` và thay các lệnh `mk(...)`/`chr(...)`.

## Lưu ý nội dung (theo tài liệu thiết kế)
Cuốn sách, ghi chú bên lề, thầy Lâm, "Người lái đò", An/Emma/Khoa, cô Hạnh, bác Tư và mọi lời thoại là **hư cấu**. Dữ kiện về di tích phải được ban quản lý đối chiếu trước khi khóa nội dung; không đặt câu đố ở khu mộ/nơi thờ tự; không gian Khmer (chương 7) cần cộng đồng duyệt.

## Intro cinematic (cập nhật)
- **Phần dòng sông** nay gồm 3 cảnh chèo thuyền vẽ pixel (6 lớp thị sai + xuồng người chèo 8 khung): Bến Tre (riv0–riv1) → Xẻo Quýt (riv2) → chợ nổi Ngã Năm (riv3). Dựng lại: `python tools/art_boats.py && node tools/build_img.js` (cần Pillow, numpy). Bộ vẽ chung: `tools/pxkit.py`; cảnh/ánh sáng trong `BO` + `dBoat` ở `js/cutscene.js`.
- Tranh sông / đường quê / cổng di tích vẽ bằng **pxl** (`assets/art/art.px.js`, lớp thị sai + hoạt hoạ người chèo xuồng + cánh sen). Dựng lại: `node <pxl>/bin/pxl.js build assets/art/art.px.js --out assets/art/out && node tools/build_img.js`.
- Nhịp phụ đề tính tự động từ độ dài câu (`CPS`, `rt`, `build` trong `js/cutscene.js`); hộp thoại gõ chữ ~24 ký tự/giây (`TYPE` trong `js/state.js`).
- Phông: Be Vietnam Pro / Playfair Display / Patrick Hand (đủ dấu tiếng Việt), nạp kèm chữ mẫu có dấu trước khi chiếu.
- Âm thanh intro: `js/sfx.js` (`SFX.cue`, `SFX.C.*`) tổng hợp bằng WebAudio, cue theo từng cú máy; muốn dùng file thật xem `assets/audio/sfx/cue/README.md` + `tools/build_sfx_cues.py`.
