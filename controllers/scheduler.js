const cron = require('node-cron');
const axios = require('axios');

// Lên lịch gọi API nội bộ mỗi 5 phút
// cron.schedule('*/100 * * * *', async () => {
//   try {
//     await axios.get('http://localhost:3000/api/adafruit/fetch-temp');
//     console.log('Đã tự động lấy dữ liệu feed "temp" và lưu vào database');
//   } catch (error) {
//     console.error('Lỗi tự động lấy dữ liệu:', error);
//   }
// });

// cron.schedule('*/100 * * * *', async () => {
//     try {
//       await axios.get('http://localhost:3000/api/adafruit/fetch-humd');
//       console.log('Đã tự động lấy dữ liệu feed "humd" và lưu vào database');
//     } catch (error) {
//       console.error('Lỗi tự động lấy dữ liệu:', error);
//     }
//   });

// cron.schedule('*/100 * * * *', async () => {
//     try {
//       await axios.get('http://localhost:3000/api/adafruit/fetch-lux');
//       console.log('Đã tự động lấy dữ liệu feed "lux" và lưu vào database');
//     } catch (error) {
//       console.error('Lỗi tự động lấy dữ liệu:', error);
//     }
//   });

// cron.schedule('*/100 * * * *', async () => {
//     try {
//       await axios.get('http://localhost:3000/api/adafruit/fetch-lux');
//       console.log('Đã tự động lấy dữ liệu feed "somo" và lưu vào database');
//     } catch (error) {
//       console.error('Lỗi tự động lấy dữ liệu:', error);
//     }
//   });