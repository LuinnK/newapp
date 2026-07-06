# Sketchtravel · Phòng trưng bày 3D

Web trưng bày bộ sưu tập tranh nét **Sketchtravel** (danh thắng & con người Việt Nam)
dưới dạng **3D tương tác**: mỗi tác phẩm là một tấm khung 3D, **kéo/vuốt để xoay 360°**
và **cuộn để phóng to**. Đồ án môn Thiết kế đồ hoạ.

Xây dựng bằng [Vite](https://vitejs.dev/) + [Three.js](https://threejs.org/).

## Tính năng

- Trang **bộ sưu tập** dạng lưới với hiệu ứng nghiêng 3D khi rê chuột.
- **Trình xem 3D** cho từng sản phẩm:
  - Ảnh được dán lên một tấm khung 3D (mặt trước là tranh, mặt sau là thông tin sản phẩm, cạnh mạ vàng).
  - Kéo chuột / vuốt cảm ứng để **xoay 360°** quanh vật thể (OrbitControls).
  - Cuộn / pinch để **phóng to – thu nhỏ**.
  - Nút **Tự xoay**, chuyển **‹ ›** giữa các sản phẩm, phím tắt `←` `→` `Esc`.
- Giao diện xanh navy – vàng đồng, đồng bộ với phong cách tranh gốc; responsive & hỗ trợ cảm ứng.

## 5 sản phẩm

Nón Lá (Cao Văn Lầu) · Cổng Trời · Cầu Vàng Đà Nẵng · Tượng Chủ Tịch Hồ Chí Minh · Vịnh Ninh Vân.

Ảnh nằm trong `public/products/`. Muốn thêm sản phẩm: bỏ ảnh vào thư mục đó và khai báo
một mục mới trong `src/products.js`.

## Chạy dự án

```bash
npm install
npm run dev        # mở http://localhost:5173
```

Build production:

```bash
npm run build      # xuất ra thư mục dist/
npm run preview    # xem thử bản build
```

## Cấu trúc

```
sketchtravel-3d-gallery/
├── index.html            # khung trang + overlay trình xem 3D
├── public/products/      # ảnh sản phẩm (.png)
└── src/
    ├── main.js           # gallery + cảnh Three.js
    ├── products.js       # dữ liệu 5 sản phẩm
    └── style.css         # giao diện navy – vàng
```
