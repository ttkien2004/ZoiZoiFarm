const mqtt = require('mqtt');
const config = require('./mqttConfig');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Kết nối MQTT đến Adafruit IO
const client = mqtt.connect('mqtt://io.adafruit.com', {
  username: config.username,
  password: config.key
});

client.on('connect', () => {
  console.log('Connected to Adafruit IO!');
  
  // Đăng ký các topic cần lắng nghe từ Adafruit IO
  client.subscribe(Object.values(config.topics), (err) => {
    if (err) {
      console.error('Error subscribing to feeds:', err);
    } else {
      console.log('Subscribed to all feeds');
    }
  });
});

// Xử lý các message nhận được từ MQTT
client.on('message', async (topic, message) => {
  const data = message.toString();
  console.log(`Received data from ${topic}: ${data}`);

  let sensorID;
  let sensorName;
  let deviceID;
  let ledLightID;
  let pumpID;
  
  // Gán ID và tên cảm biến hoặc thiết bị dựa trên topic
  if (topic === config.topics.humd) {
    sensorID = 1;
    sensorName = 'Humidity Sensor';
  } else if (topic === config.topics.led) {
    deviceID = 1;  // LED là device
    ledLightID = 1; // Gán ID cho đèn LED
    sensorName = 'LED';
  } else if (topic === config.topics.lux) {
    sensorID = 2;
    sensorName = 'Light Intensity Sensor';
  } else if (topic === config.topics.maybom) {
    deviceID = 2;  // Máy bơm là device
    pumpID = 2;    // Gán ID cho máy bơm
    sensorName = 'Pump';
  } else if (topic === config.topics.somo) {
    sensorID = 4;
    sensorName = 'Somo';
  } else if (topic === config.topics.status) {
    sensorID = 5;
    sensorName = 'Status Sensor';
  } else if (topic === config.topics.temp) {
    sensorID = 6;
    sensorName = 'Temperature Sensor';
  }

  try {
    if (sensorID) {
      // Lưu dữ liệu cảm biến vào bảng data trong cơ sở dữ liệu
      const newData = await prisma.data.create({
        data: {
          sensorID,
          dataTime: new Date(),
          value: parseFloat(data),
        },
      });
      console.log('New sensor data saved:', newData);
    }

    if (deviceID) {
      // Lưu thông tin về thiết bị vào bảng controls
      await prisma.controls.create({
        data: {
          userID: 1,  // Cần xác định userID thực tế
          deviceID: deviceID,
          timeSwitch: new Date(),
          action: `Received data from ${sensorName}: ${data}`,
        },
      });
      console.log('Device log saved to controls.');
    }

    // Lưu thông tin cho LED vào bảng led_light nếu có
    if (ledLightID) {
      await prisma.led_light.upsert({
        where: { lightID: ledLightID },
        update: { state: data === 'on' ? 'on' : 'off' }, // Ví dụ kiểm tra nếu giá trị là 'on' hoặc 'off'
        create: { lightID: ledLightID, state: data === 'on' ? 'on' : 'off' },
      });
      console.log('LED light state updated or created.');
    }

    // Lưu thông tin cho Pump vào bảng pump nếu có
    if (pumpID) {
      await prisma.pump.upsert({
        where: { pumpID: pumpID },
        update: { state: data === 'on' ? 'on' : data === 'off' ? 'off' : 'auto' }, // Ví dụ điều chỉnh trạng thái pump
        create: { pumpID: pumpID, state: data === 'on' ? 'on' : data === 'off' ? 'off' : 'auto' },
      });
      console.log('Pump state updated or created.');
    }

  } catch (error) {
    console.error('Error saving data to database:', error);
  }
});

// Đặt vòng lặp để yêu cầu dữ liệu (dữ liệu sẽ được tự động gửi khi có)
setInterval(() => {
  console.log('Requesting latest data...');
  // Lệnh này không cần thiết nữa, vì dữ liệu sẽ được tự động nhận khi có từ MQTT.
}, 15000);
