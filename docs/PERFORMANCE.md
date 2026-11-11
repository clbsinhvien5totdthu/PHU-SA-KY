# Hiệu năng (bản gộp: intro vẽ lại + map v4 + tối ưu luồng khu vực)

## Cách đo trong game
- **F3** (hoặc mở với `?perf`): bảng FPS, thời gian khung, JS cập nhật / JS vẽ, số đối tượng thức, số mảng nền, heap.
  - JS thấp (< 3 ms) mà FPS vẫn thấp → máy bị nghẽn ở GPU/tô pixel (màn hình lớn, GPU yếu), không phải do code.
  - JS cao → CPU yếu / quá nhiều đối tượng.
- **F4**: bật/tắt chế độ nhẹ (đom đóm, cánh hoa, lấp lánh, ánh đèn). Tự chỉnh bằng F4 thì game thôi tự bật/tắt. `?lite` bật sẵn.

## Đã làm (đo trên cảnh dày đặc nhất, 1280x720)
| | trước | sau |
|---|---|---|
| Heap JS | 66 MB | 44 MB |
| Đối tượng trong danh sách vẽ | ~1.200 | ~100–200 (chỉ khu vực gần) |
| Tween đang chạy | 535 | ~20–30 |
| JS vẽ / khung (CPU thường) | 2,8 ms | 0,8 ms |
| JS tổng / khung (CPU thường · giả lập CPU chậm 4x) | 4,5 · 19 ms | 2,3 · 11 ms |

1. **Nền theo mảng (chunk)** thay cho Phaser Tilemap: Tilemap tạo 161.920 đối tượng `Tile` và vẽ ~1.000 quad mỗi khung. Nay nền là các ảnh 32x32 ô (528 px, gối 1 ô để không hở khe), chỉ giữ các mảng quanh khung nhìn + 1 vòng đệm; mảng ngoài vòng bị xoá dần (1 mảng/khung); mảng mới dựng dần theo lát 9 hàng ô/khung. Viền trắng "chỗ chưa có dữ liệu" và sao vàng được vẽ thẳng vào mảng nền (bỏ Graphics/Star làm Phaser phải đổi pipeline).
2. **Luồng khu vực (streaming)** cho trang trí, cây, nhãn, công trình, hiệu ứng: lưới 256 px; đối tượng ngoài khung nhìn +160 px bị gỡ khỏi danh sách vẽ và tween của chúng bị xoá; vào vùng gần mới "thức" lại (tween tạo lại, vị trí/alpha về mốc gốc).
3. HUD chỉ ghi DOM/dựng chuỗi khi giá trị đổi; bớt mảng tạm mỗi khung khi kiểm tra va chạm.

## Chưa làm (đánh đổi)
- Hạ độ phân giải canvas rồi phóng bằng CSS (giảm mạnh tải tô pixel): làm nhân vật 48x64 phải vẽ lại theo kích thước điểm ảnh của thế giới, đổi diện mạo → để dành khi thật sự cần.
