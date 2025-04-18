const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.createSensorService = async ({ sensorName, type, alertThreshold, status, userID }) => {
  const validSensorTypes = ["Soil Moisture Sensor", "Temperature Sensor" , "Humidity Sensor", "Light Sensor"];
  if (!validSensorTypes.includes(type)) {
    throw new Error("Loại cảm biến không hợp lệ!");
  }

  const newSensor = await prisma.sensor.create({
    data: {
      sensorName,
      type,
      alertThreshold: alertThreshold || null,
      status: status || "able",
      userID,
    },
  });

  // Đếm tổng sensor cùng loại
  const totalSensors = await prisma.sensor.count({ where: { type } });

  // updateMany quantity cho sensor cùng type
  await prisma.sensor.updateMany({
    where: { type },
    data: { quantity: totalSensors },
  });

  await prisma.controls.create({
    data: {
      userID,
      sensorID: newSensor.sensorID,
      timeSwitch: new Date(),
      action: `Thêm ${sensorName} (${type}) vào hệ thống`,
    },
  });

  return {
    message: "Thêm cảm biến mới thành công!",
    sensor: newSensor,
    totalSensors,
  };
};

exports.getSensorsService = async (userID) => {
  const sensors = await prisma.sensor.findMany({
    where: { userID },
    orderBy: [
      {
        status: 'asc', 
      },
      {
        sensorID: 'asc',
      }
    ],
  });
  return sensors;
};

exports.updateSensorStatusService = async (sensorID, status) => {
  const sensor = await prisma.sensor.findUnique({
    where: { sensorID: parseInt(sensorID) },
  });
  if (!sensor) {
    throw new Error('Cảm biến không tồn tại!');
  }

  const updatedSensor = await prisma.sensor.update({
    where: { sensorID: parseInt(sensorID) },
    data: { status },
  });

  await prisma.controls.create({
    data: {
      sensorID: parseInt(sensorID),
      timeSwitch: new Date(),
      action: `Cảm biến ${sensor.sensorName} đã được cập nhật thành ${status}`,
    },
  });

  return updatedSensor;
};

exports.updateAlertThresholdService = async (sensorID, alertThreshold) => {
  const existingSensor = await prisma.sensor.findUnique({
    where: { sensorID: parseInt(sensorID) },
  });
  if (!existingSensor) {
    throw new Error("Cảm biến không tồn tại!");
  }

  const updatedSensor = await prisma.sensor.update({
    where: { sensorID: parseInt(sensorID) },
    data: { alertThreshold: parseFloat(alertThreshold) },
  });

  await prisma.controls.create({
    data: {
      sensorID: parseInt(sensorID),
      timeSwitch: new Date(),
      action: `Cập nhật ngưỡng cảnh báo cho cảm biến ${existingSensor.sensorName} thành ${alertThreshold}`,
    },
  });

  return updatedSensor;
};

exports.deleteSensorService = async (sensorID) => {
  const existingSensor = await prisma.sensor.findUnique({
    where: { sensorID: parseInt(sensorID) },
  });
  if (!existingSensor) {
    throw new Error("Cảm biến không tồn tại!");
  }

  const sensorType = existingSensor.type;
  const sensorName = existingSensor.sensorName;

  await prisma.controls.create({
    data: {
      sensorID: parseInt(sensorID),
      timeSwitch: new Date(),
      action: `Xóa cảm biến ${sensorName} (${sensorType}) khỏi hệ thống thành công!`,
    },
  });

  await prisma.sensor.delete({
    where: { sensorID: parseInt(sensorID) },
  });

  const totalSameTypeSensors = await prisma.sensor.count({
    where: { type: sensorType },
  });

  await prisma.sensor.updateMany({
    where: { type: sensorType },
    data: { quantity: totalSameTypeSensors },
  });

  return {
    message: "Xóa cảm biến thành công!",
    deletedSensor: {
      sensorID: existingSensor.sensorID,
      sensorName,
      type: sensorType,
    },
    updatedQuantity: totalSameTypeSensors,
  };
};

exports.getSensorDataService = async (sensorID, limit = 3) => {
  const sensorData = await prisma.data.findMany({
    where: { sensorID: parseInt(sensorID) },
    orderBy: { dataTime: 'desc' },
    take: limit,
  });
  return sensorData;
};
