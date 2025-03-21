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
  
  client.subscribe(config.topics.temperature, (err) => {
    if (err) {
      console.error('Error subscribing to temperature feed:', err);
    } else {
      console.log('Subscribed to temperature feed');
    }
  });

  client.subscribe(config.topics.soil_moisture, (err) => {
    if (err) {
      console.error('Error subscribing to soil moisture feed:', err);
    } else {
      console.log('Subscribed to soil moisture feed');
    }
  });

  client.subscribe(config.topics.light_intensity, (err) => {
    if (err) {
      console.error('Error subscribing to light intensity feed:', err);
    } else {
      console.log('Subscribed to light intensity feed');
    }
  });
});

client.on('message', async (topic, message) => {
  const data = message.toString();
  console.log(`Received data from ${topic}: ${data}`);

  let sensorID;
  let sensorName;
  
  if (topic === config.topics.temperature) {
    sensorID = 1;  
    sensorName = 'Temperature Sensor';
  } else if (topic === config.topics.soil_moisture) {
    sensorID = 2; 
    sensorName = 'Soil Moisture Sensor';
  } else if (topic === config.topics.light_intensity) {
    sensorID = 3; 
    sensorName = 'Light Intensity Sensor';
  }

  try {
    const newData = await prisma.data.create({
      data: {
        sensorID,
        dataTime: new Date(),
        value: parseFloat(data),
      },
    });
    console.log('New data saved:', newData);

    await prisma.controls.create({
      data: {
        userID: 1, 
        deviceID: sensorID, 
        timeSwitch: new Date(),
        action: `Received data from ${sensorName}: ${data}`,
      },
    });

    console.log('Log saved to controls.');
  } catch (error) {
    console.error('Error saving data to database:', error);
  }
});

// Đặt vòng lặp nhận dữ liệu mỗi 15 giây
setInterval(() => {
  console.log('Requesting latest data...');
  client.publish(config.topics.temperature, '');
  client.publish(config.topics.soil_moisture, '');
  client.publish(config.topics.light_intensity, '');
}, 15000);
