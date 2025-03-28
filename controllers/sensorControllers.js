const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add sensor
exports.addSensor = async (req, res) => {
  const { sensorName, type, alertThreshold, status, userID } = req.body;

  try {
    const validSensorTypes = ["Soil Moisture Sensor", "Temperature & Humidity Sensor", "Light Sensor"];
    if (!validSensorTypes.includes(type)) {
      return res.status(400).json({ message: "Loại cảm biến không hợp lệ!" });
    }

    if (!userID) {
      return res.status(400).json({ message: "Cần cung cấp userID!" });
    }

    const newSensor = await prisma.sensor.create({
      data: {
        sensorName,
        type,
        alertThreshold: alertThreshold || null,
        status: status || "able",
      },
    });

    const totalSensors = await prisma.sensor.count({
      where: { type: type }
    });

    await prisma.sensor.updateMany({
      where: { type: type },
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

    res.status(201).json({
      message: "Thêm cảm biến mới thành công!",
      sensor: newSensor,
      totalSensors,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm cảm biến mới.", error: error.message });
  }
};

// Get sensor list
exports.getSensors = async (req, res) => {
    try {
      const sensors = await prisma.sensor.findMany({
        orderBy: { sensorID: 'asc' },
      });
  
      res.status(200).json({
        message: 'Lấy danh sách cảm biến thành công!',
        totalSensors: sensors.length,
        sensors,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Lỗi khi lấy danh sách cảm biến.',
        error: error.message,
      });
    }
  };

// Able or disable sensor
exports.updateSensorStatus = async (req, res) => {
  const { sensorID } = req.params;
  const { status, userID } = req.body;

  if (!userID) {
      return res.status(400).json({ message: 'Yêu cầu phải cung cấp userID!' });
  }
  if (!['able', 'disable'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
  }

  try {
      const sensor = await prisma.sensor.findUnique({
          where: { sensorID: parseInt(sensorID) },
      });

      if (!sensor) {
          return res.status(404).json({ message: 'Cảm biến không tồn tại!' });
      }

      const updatedSensor = await prisma.sensor.update({
          where: { sensorID: parseInt(sensorID) },
          data: { status },
      });

      await prisma.controls.create({
          data: {
              userID,
              sensorID: parseInt(sensorID), 
              timeSwitch: new Date(),
              action: `Cảm biến ${sensor.sensorName} đã được cập nhật thành ${status}`,
          },
      });

      res.status(200).json({
          message: 'Cập nhật trạng thái cảm biến thành công!',
          sensor: updatedSensor,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({
          message: 'Lỗi khi cập nhật trạng thái cảm biến.',
          error: error.message,
      });
  }
};

// Update alertThreshold
exports.updateAlertThreshold = async (req, res) => {
  const { sensorID } = req.params;
  const { alertThreshold, userID } = req.body;

  if (!alertThreshold || isNaN(alertThreshold)) {
      return res.status(400).json({ message: "Ngưỡng cảnh báo không hợp lệ!" });
  }
  if (!userID) {
      return res.status(400).json({ message: "Yêu cầu phải có userID!" });
  }

  try {
      const existingSensor = await prisma.sensor.findUnique({
          where: { sensorID: parseInt(sensorID) },
      });

      if (!existingSensor) {
          return res.status(404).json({ message: "Cảm biến không tồn tại!" });
      }

      const updatedSensor = await prisma.sensor.update({
          where: { sensorID: parseInt(sensorID) },
          data: { alertThreshold: parseFloat(alertThreshold) },
      });

      await prisma.controls.create({
          data: {
              userID: parseInt(userID),
              sensorID: parseInt(sensorID), 
              timeSwitch: new Date(),
              action: `Cập nhật ngưỡng cảnh báo cho cảm biến ${existingSensor.sensorName} thành ${alertThreshold}`,
          },
      });

      res.status(200).json({
          message: "Cập nhật alertThreshold thành công!",
          sensor: updatedSensor,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi cập nhật alertThreshold.", error: error.message });
  }
};

// Delete a sensor
exports.deleteSensor = async (req, res) => {
  const { sensorID } = req.params;
  const { userID } = req.body; 

  if (!userID) {
      return res.status(400).json({ message: "Yêu cầu phải có userID!" });
  }

  try {
      const existingSensor = await prisma.sensor.findUnique({
          where: { sensorID: parseInt(sensorID) },
      });

      if (!existingSensor) {
          return res.status(404).json({ message: "Cảm biến không tồn tại!" });
      }

      const sensorType = existingSensor.type; 
      const sensorName = existingSensor.sensorName; 

      await prisma.controls.create({
          data: {
              userID: parseInt(userID),
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

      res.status(200).json({
          message: "Xóa cảm biến thành công!",
          deletedSensor: {
              sensorID: existingSensor.sensorID,
              sensorName,
              type: sensorType,
          },
          updatedQuantity: totalSameTypeSensors,
      });

  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi xóa cảm biến.", error: error.message });
  }
};

exports.getSensorData = async (req, res) => {
  const { sensorID } = req.params; 

  if (!sensorID) {
    return res.status(400).json({ message: 'Vui lòng cung cấp sensorID!' });
  }

  try {
    const sensorData = await prisma.data.findMany({
      where: { sensorID: parseInt(sensorID) },
      orderBy: { dataTime: 'desc' },
      take: 3,
    });

    res.status(200).json({
      message: 'Lấy dữ liệu cảm biến thành công!',
      data: sensorData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu cảm biến.', error: error.message });
  }
};