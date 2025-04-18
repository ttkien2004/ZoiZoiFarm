const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('../axiosConfig/axiosConfig');

// Get data from feed TEMP, sensorID=1
exports.fetchAndStoreTempDataService = async () => {
  let get_sensor_type = "";
  if (sensor.type === "Temperature & Humidity Sensor") {
    get_sensor_type = "temp"
  }
  const response = await axiosClient.get(`/${get_sensor_type}/data?limit=1`);
  const feedData = response.data;
  for (const record of feedData) {
    const value = parseFloat(record.value);
    const dataTime = new Date(record.created_at);

    await prisma.data.create({
      data: {
        // sensorID: 1, // Temperature & Humidity Sensor
        dataTime,
        value,
      },
    });
  }

  return feedData;
};

// Get data from feed HUMD, sensorID=2
exports.fetchAndStoreHumdDataService = async () => {
  const response = await axiosClient.get('/humd/data?limit=1');
  const feedData = response.data;

  for (const record of feedData) {
    const value = parseFloat(record.value);
    const dataTime = new Date(record.created_at);

    await prisma.data.create({
      data: {
        sensorID: 2, // Temperature & Humidity Sensor
        dataTime,
        value,
      },
    });
  }
  return feedData;
};

// Get data from feed LUX, sensorID=3
exports.fetchAndStoreLuxDataService = async () => {
  const response = await axiosClient.get('/lux/data?limit=1');
  const feedData = response.data;

  for (const record of feedData) {
    const value = parseFloat(record.value);
    const dataTime = new Date(record.created_at);

    await prisma.data.create({
      data: {
        sensorID: 3, // Light Sensor
        dataTime,
        value,
      },
    });
  }
  return feedData;
};

// Get data from feed SOMO, sensorID=4
exports.fetchAndStoreSmoDataService = async () => {
  const response = await axiosClient.get('/somo/data?limit=1');
  const feedData = response.data;

  for (const record of feedData) {
    const value = parseFloat(record.value);
    const dataTime = new Date(record.created_at);

    await prisma.data.create({
      data: {
        sensorID: 4, // Soil Moisture Sensor
        dataTime,
        value,
      },
    });
  }
  return feedData;
};
