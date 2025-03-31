const cron = require('node-cron');
const { fetchFeedTemp, fetchFeedHumd, fetchFeedLux, fetchFeedSomo, schedulePumpAuto, autoPumpBySensor, checkSensorWarning } = require('../services/cronService');

// Gọi API /adafruit/<sensor>
cron.schedule('*/1 * * * *', async () => {
  try {
    await fetchFeedTemp();
  } catch (error) {
    console.error('Lỗi tự động lấy dữ liệu temp:', error);
  }
});

cron.schedule('*/1 * * * *', async () => {
  try {
    await fetchFeedHumd();
  } catch (error) {
    console.error('Lỗi tự động lấy dữ liệu humd:', error);
  }
});

cron.schedule('*/1 * * * *', async () => {
  try {
    await fetchFeedLux();
  } catch (error) {
    console.error('Lỗi tự động lấy dữ liệu lux:', error);
  }
});

cron.schedule('*/1 * * * *', async () => {
  try {
    await fetchFeedSomo();
  } catch (error) {
    console.error('Lỗi tự động lấy dữ liệu somo:', error);
  }
});

// Mỗi 10p check schedule bơm
cron.schedule('*/1 * * * *', async () => {
  try {
    await schedulePumpAuto();
  } catch (err) {
    console.error('Lỗi khi auto bật/tắt máy bơm theo schedule:', err);
  }
});

// Mỗi 10p check autoPumpBySensor
cron.schedule('*/1 * * * *', async () => {
  try {
    await autoPumpBySensor();
  } catch (err) {
    console.error('Lỗi autoPumpBySensor:', err);
  }
});

// Mỗi 1p check sensor threshold
cron.schedule('*/1 * * * *', async () => {
  try {
    await checkSensorWarning();
  } catch (err) {
    console.error('Cron job error checkSensorWarning:', err);
  }
});
