const cron = require('node-cron');
const axiosClient = require('./../axiosConfig/axiosConfig');
const { PrismaClient } = require('@prisma/client');
const nodemailer = require("nodemailer");
const prisma = new PrismaClient();
const { sendEmail } = require('../services/emailService');

// Lên lịch gọi API nội bộ mỗi 5 phút
cron.schedule('*/100 * * * *', async () => {
  try {
    await axios.get('http://localhost:3000/api/adafruit/fetch-temp');
    console.log('Đã tự động lấy dữ liệu feed "temp" và lưu vào database');
  } catch (error) {
    console.error('Lỗi tự động lấy dữ liệu:', error);
  }
});

cron.schedule('*/100 * * * *', async () => {
    try {
      await axios.get('http://localhost:3000/api/adafruit/fetch-humd');
      console.log('Đã tự động lấy dữ liệu feed "humd" và lưu vào database');
    } catch (error) {
      console.error('Lỗi tự động lấy dữ liệu:', error);
    }
  });

cron.schedule('*/100 * * * *', async () => {
    try {
      await axios.get('http://localhost:3000/api/adafruit/fetch-lux');
      console.log('Đã tự động lấy dữ liệu feed "lux" và lưu vào database');
    } catch (error) {
      console.error('Lỗi tự động lấy dữ liệu:', error);
    }
  });

cron.schedule('*/100 * * * *', async () => {
    try {
      await axios.get('http://localhost:3000/api/adafruit/fetch-lux');
      console.log('Đã tự động lấy dữ liệu feed "somo" và lưu vào database');
    } catch (error) {
      console.error('Lỗi tự động lấy dữ liệu:', error);
    }
  });

// Auto turn on pump
async function turnOnPump() {
    await axiosClient.post('/maybom/data', { value: '1' }); //Turn on
  }
  
  async function turnOffPump() {
    await axiosClient.post('/maybom/data', { value: '0' }); //Turn off
  }
  
  // Mỗi phút kiểm tra
  cron.schedule('*/10 * * * *', async () => {
    try {
      // Lấy tất cả pump có schedule
      const pumps = await prisma.pump.findMany({
        where: {
          // state: 'auto',
          schedule: { not: null }
        }
      });
  
      if (!pumps.length) return;
  
      const now = new Date();
      const currentTime = now.getHours().toString().padStart(2, '0') + ':' 
                          + now.getMinutes().toString().padStart(2, '0');
  
      for (const p of pumps) {
        const times = p.schedule?.split(',') || [];
  
        if (times.includes(currentTime)) {
          console.log(`Đến giờ ${currentTime}, bật bơm pumpID=${p.pumpID}`);
  
          await turnOnPump();
          // Cập nhật DB: thiết lập trạng thái "on"
          await prisma.pump.update({
            where: { pumpID: p.pumpID },
            data: { state: 'on' },
          });
  
          // Sau 2 phút, tắt bơm
          setTimeout(async () => {
            console.log(`Tắt bơm pumpID=${p.pumpID} sau 2 phút`);
            await turnOffPump();
            // Cập nhật DB: thiết lập trạng thái "off"
            await prisma.pump.update({
              where: { pumpID: p.pumpID },
              data: { state: 'off' },
            });
          }, 2 * 60 * 1000);
        }
      }
    } catch (err) {
      console.error('Lỗi khi auto bật/tắt máy bơm:', err);
    }
});

// Auto on / off pump base on sensor data
cron.schedule('*/10 * * * *', async () => {
  try {
    // Lấy thông tin của cảm biến 1 để lấy alertThreshold
    const sensor1 = await prisma.sensor.findUnique({
      where: { sensorID: 1 },
    });

    if (!sensor1) {
      console.error("Không tìm thấy cảm biến 1");
      return;
    }

    // Lấy thông tin của cảm biến 1 để lấy alertThreshold
    const sensor2 = await prisma.sensor.findUnique({
      where: { sensorID: 2 },
    });

    if (!sensor2) {
      console.error("Không tìm thấy cảm biến 2");
      return;
    }

    // Lấy dữ liệu mới nhất của cảm biến sensorID = 1
    const sensor1Data = await prisma.data.findFirst({
      where: { sensorID: 1 },
      orderBy: { dataTime: 'desc' },
    });
    
    // Lấy dữ liệu mới nhất của cảm biến sensorID = 2
    const sensor2Data = await prisma.data.findFirst({
      where: { sensorID: 2 },
      orderBy: { dataTime: 'desc' },
    });
    
    if (!sensor1Data || !sensor2Data) {
      console.log("Chưa đủ dữ liệu từ cảm biến.");
      return;
    }
    
    // Kiểm tra điều kiện:
    // Nếu sensor1.value > sensor1.alertThreshold và sensor2.value < sensor1.alertThreshold => pumpDesiredState = "on", ngược lại "off"
    const pumpDesiredState = (sensor1Data.value > sensor1.alertThreshold && sensor2Data.value < sensor1.alertThreshold) ? 'on' : 'off';
    
    const pumps = await prisma.pump.findMany({
      where: { autoLevel: true },
    });

    if (!pumps.length) {
      console.error("Không tìm thấy máy bơm.");
      return;
    }
    for (const pump of pumps) {  
      if (pump.state !== pumpDesiredState) {
        const feedValue = pumpDesiredState === 'on' ? '1' : '0';
        const response = await axiosClient.post('/maybom/data', { value: feedValue });
        console.log("Phản hồi từ Adafruit:", response.data);
        
        // Cập nhật DB: thay đổi pump.state
        const updatedPump = await prisma.pump.update({
          where: { pumpID: pump.pumpID },
          data: { state: pumpDesiredState },
        });
        
        console.log(`Máy bơm ${pump.pumpID} đã chuyển sang trạng thái ${pumpDesiredState} dựa trên dữ liệu: sensor1=${sensor1Data.value}, sensor2=${sensor2Data.value}`);
      } else {
        console.log(`Máy bơm ${pump.pumpID} vẫn giữ trạng thái ${pump.state} (không thay đổi)`);
      }
    }
  } catch (error) {
    console.error("Lỗi khi tự động điều khiển máy bơm:", error);
  }
});

//warningwarning
cron.schedule('*/1 * * * *', async () => {
  try {
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
  } catch (err) {
    console.error("Cron job error:", err);
  }
});