# ZoiZoiFarm + Backend

**Mô tả**

## Dự án ZoiZoi Farm

## 🚀 Các chức năng chính

- Ghi nhận dữ liệu từ cảm biến độ ẩm và nhiệt độ không khí
- Ghi nhận dữ liệu từ cảm biến độ ẩm đất
- Ghi nhận dữ liệu từ cảm biến ánh sáng
- Bật/ tắt máy bơm
- Cài đặt thời gian bật / tắt máy bơm tự độngđộng
- Bật/ tắt đèn LED
- Đăng ký/ Đăng nhập

## 🛠 Công nghệ được sử dụng

- Backend: NodeJS + JWT + JavaScript
- Database: MySQL

## ⚙️ Cài đặt

### Yêu cầu:

- Node.js >= 20.x
- NPM >= 7.x or Yarn
- MySQL server

1. Clone repository: `git clone https://github.com/ttkien2004/ZoiZoiFarm.git`
2. Set up dependencies:
   ```bash
   1. npm i or npm install (Nếu bạn sử dụng npm)
   2. yarn add (Nếu bạn sử dụng yarn)
   3. Chạy thử chương trình: npm run start:dev
   ```
3. Thay đổi nội dung file env
   1. Thêm file `.env` vào thư mục chính
   2. Thêm nội dung sau vào file `.env`
      ```bash
      PORT=3000
      DATABASE_URL="mysql://<your_username>:<your_password>@localhost:<your_port>/<your_database_name>?schema=public"
      SECRET=kientrantrungbksvtrungkientranmsdcdcgodskgodaskfodkaojjdfj

      #Cấu hình adafruit
      AIO_KEY="<adafruit_aio_key>"
      AIO_USERNAME="<adafuit_name>"
      MQTT_BROKER_URL="mqtt://broker.hivemq.com"
      ```

### Chạy chương trình

1. Thực hiện câu lệnh `npm run start:dev`
2. Xem API documentation: 2.1. Vào bất kỳ trình duyệt nào: Google, fox,
   Microsoft Edge, ... 2.2. Nhập [http://localhost:3000/api-docs]

### Lưu ý:

1. Nếu như trong mysql có thay đổi nội dung các table, thì dùng lệnh sau để khởi
   động lại prisma
   ```bash
   npx prisma db pull
   npx prisma generate
   ```
2. Tài liệu về prisma: [https://www.prisma.io/docs/orm/prisma-client]