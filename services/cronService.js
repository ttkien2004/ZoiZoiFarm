const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('../axiosConfig/axiosConfig');
const { sendEmail } = require('./emailService');
exports.fetchFeedTemp = async () => {
  await axios.get('http://localhost:3000/api/adafruit/fetch-temp');
  console.log('Đã tự động lấy dữ liệu feed "temp" và lưu vào database');
};

exports.fetchFeedHumd = async () => {
  await axios.get('http://localhost:3000/api/adafruit/fetch-humd');
  console.log('Đã tự động lấy dữ liệu feed "humd" và lưu vào database');
};

exports.fetchFeedLux = async () => {
  await axios.get('http://localhost:3000/api/adafruit/fetch-lux');
  console.log('Đã tự động lấy dữ liệu feed "lux" và lưu vào database');
};

exports.fetchFeedSomo = async () => {
  await axios.get('http://localhost:3000/api/adafruit/fetch-somo');
  console.log('Đã tự động lấy dữ liệu feed "somo" và lưu vào database');
};

exports.schedulePumpAuto = async () => {
  const pumps = await prisma.pump.findMany({
    where: { schedule: { not: null } },
  });
  if (!pumps.length) return;

  const now = new Date();
  const currentTime = now.getHours().toString().padStart(2, '0') 
                    + ':' + now.getMinutes().toString().padStart(2, '0');

  for (const p of pumps) {
    const times = p.schedule?.split(',') || [];
    if (times.includes(currentTime)) {
      console.log(`Đến giờ ${currentTime}, bật bơm pumpID=${p.pumpID}`);

      // Bật bơm
      await axiosClient.post('/maybom/data', { value: '1' });
      await prisma.pump.update({
        where: { pumpID: p.pumpID },
        data: { state: 'on' },
      });

      // Sau 2 phút, tắt bơm
      setTimeout(async () => {
        console.log(`Tắt bơm pumpID=${p.pumpID} sau 2 phút`);
        await axiosClient.post('/maybom/data', { value: '0' });
        await prisma.pump.update({
          where: { pumpID: p.pumpID },
          data: { state: 'off' },
        });
      }, 2 * 60 * 1000);
    }
  }
};

exports.autoPumpBySensor = async () => {
  // Tìm sensor 1
  const sensor1 = await prisma.sensor.findUnique({ where: { sensorID: 1 } });
  if (!sensor1) {
    console.error("Không tìm thấy cảm biến 1");
    return;
  }
  // Tìm sensor 2
  const sensor2 = await prisma.sensor.findUnique({ where: { sensorID: 2 } });
  if (!sensor2) {
    console.error("Không tìm thấy cảm biến 2");
    return;
  }

  // Lấy data mới nhất
  const sensor1Data = await prisma.data.findFirst({
    where: { sensorID: 1 },
    orderBy: { dataTime: 'desc' },
  });
  const sensor2Data = await prisma.data.findFirst({
    where: { sensorID: 2 },
    orderBy: { dataTime: 'desc' },
  });

  if (!sensor1Data || !sensor2Data) {
    console.log("Chưa đủ dữ liệu từ cảm biến.");
    return;
  }

  const pumpDesiredState =
    (sensor1Data.value > sensor1.alertThreshold && sensor2Data.value < sensor1.alertThreshold)
      ? 'on' : 'off';

  const pumps = await prisma.pump.findMany({ where: { autoLevel: true } });
  if (!pumps.length) {
    console.error("Không tìm thấy máy bơm.");
    return;
  }

  for (const p of pumps) {
    if (p.state !== pumpDesiredState) {
      const feedValue = (pumpDesiredState === 'on') ? '1' : '0';
      const response = await axiosClient.post('/maybom/data', { value: feedValue });
      console.log("Phản hồi từ Adafruit:", response.data);

      await prisma.pump.update({
        where: { pumpID: p.pumpID },
        data: { state: pumpDesiredState },
      });

      console.log(`Máy bơm ${p.pumpID} sang trạng thái ${pumpDesiredState}`
        + ` (sensor1=${sensor1Data.value}, sensor2=${sensor2Data.value})`);
    } else {
      console.log(`Máy bơm ${p.pumpID} vẫn giữ trạng thái ${p.state} (không thay đổi)`);
    }
  }
};

// Warning + email
exports.checkSensorWarning = async () => {
  const sensors = await prisma.sensor.findMany({
    where: { status: 'able' },
    include: { user: true },
  });

  for (const s of sensors) {
    if (s.alertThreshold == null) continue;
    const latestData = await prisma.data.findFirst({
      where: { sensorID: s.sensorID },
      orderBy: { dataTime: 'desc' },
    });
    if (!latestData) continue;

    if (latestData.value > s.alertThreshold) {
      // Tạo warning
      await prisma.warning.create({
        data: {
          sensorID: s.sensorID,
          message: `Sensor ${s.sensorName} vượt ngưỡng ${s.alertThreshold}`,
          timeWarning: new Date(),
          userID: s.userID,
        }
      });
      // Gửi email
      if (s.user?.email) {
        await sendEmail(
          s.user.email,
          "Cảnh báo Sensor",
          `Xin chào ${s.user.userName},\n\nSensor ${s.sensorName} vượt ngưỡng: ${latestData.value} > ${s.alertThreshold}`
        );
      }
    }
  }
};
