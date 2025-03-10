const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add sensor
exports.addSensor = async (req, res) => {
  const { sensorName, type, alertThreshold, status, userID } = req.body;

  try {
    // Kiểm tra loại cảm biến hợp lệ
    const validSensorTypes = ["Soil Moisture Sensor", "Temperature & Humidity Sensor", "Light Sensor"];
    if (!validSensorTypes.includes(type)) {
      return res.status(400).json({ message: "Loại cảm biến không hợp lệ!" });
    }

    if (!userID) {
      return res.status(400).json({ message: "Cần cung cấp userID!" });
    }

    // Tạo cảm biến mới
    const newSensor = await prisma.sensor.create({
      data: {
        sensorName,
        type,
        alertThreshold: alertThreshold || null, // Có thể null nếu không đặt ngưỡng cảnh báo
        status: status || "able", // Mặc định cảm biến được kích hoạt
      },
    });

    // Đếm tổng số lượng cảm biến cùng loại
    const totalSensors = await prisma.sensor.count({
      where: { type: type }
    });

    // Cập nhật `quantity` cho tất cả cảm biến cùng loại
    await prisma.sensor.updateMany({
      where: { type: type },
      data: { quantity: totalSensors },
    });

    // Ghi vào bảng `controls`
    await prisma.controls.create({
      data: {
        userID,
        deviceID: newSensor.sensorID,
        timeSwitch: new Date(),
        action: `Add a sensor (${type})`,
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


// Get sensor listlist
exports.getSensors = async (req, res) => {
    try {
      const sensors = await prisma.sensor.findMany({
        orderBy: { sensorID: 'asc' }, // Sắp xếp theo ID tăng dần
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

// Cập nhật trạng thái cảm biến (able/disable) và lưu vào controls
exports.updateSensorStatus = async (req, res) => {
    const { sensorID } = req.params;
    const { status, userID } = req.body;
  
    // Kiểm tra đầu vào
    if (!userID) {
      return res.status(400).json({ message: 'Yêu cầu phải cung cấp userID!' });
    }
    if (!['able', 'disable'].includes(status)) {
      return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
    }
  
    try {
      // Kiểm tra xem cảm biến có tồn tại không
      const sensor = await prisma.sensor.findUnique({ where: { sensorID: parseInt(sensorID) } });
      if (!sensor) {
        return res.status(404).json({ message: 'Cảm biến không tồn tại!' });
      }
  
      // Cập nhật trạng thái cảm biến
      const updatedSensor = await prisma.sensor.update({
        where: { sensorID: parseInt(sensorID) },
        data: { status },
      });
  
      // Ghi vào bảng controls
      await prisma.controls.create({
        data: {
          userID,
          deviceID: parseInt(sensorID),
          timeSwitch: new Date(),
          action: `Update ${sensor.sensorName} to ${status}`,
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

// Cập nhật alertThreshold của cảm biến
exports.updateAlertThreshold = async (req, res) => {
    const { sensorID } = req.params;
    const { alertThreshold, userID } = req.body;
  
    // Kiểm tra dữ liệu đầu vào
    if (!alertThreshold || isNaN(alertThreshold)) {
      return res.status(400).json({ message: "Ngưỡng cảnh báo không hợp lệ!" });
    }
    if (!userID) {
      return res.status(400).json({ message: "Yêu cầu phải có userID!" });
    }
  
    try {
      // Kiểm tra xem cảm biến có tồn tại không
      const existingSensor = await prisma.sensor.findUnique({
        where: { sensorID: parseInt(sensorID) },
      });
  
      if (!existingSensor) {
        return res.status(404).json({ message: "Cảm biến không tồn tại!" });
      }
  
      // Cập nhật ngưỡng cảnh báo
      const updatedSensor = await prisma.sensor.update({
        where: { sensorID: parseInt(sensorID) },
        data: { alertThreshold: parseFloat(alertThreshold) },
      });
  
      // Lưu vào bảng controls
      await prisma.controls.create({
        data: {
          userID: parseInt(userID),
          deviceID: parseInt(sensorID),
          timeSwitch: new Date(),
          action: `Update alertThreshold to ${alertThreshold}`,
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

// Xóa cảm biến
exports.deleteSensor = async (req, res) => {
    const { sensorID } = req.params;
    const { userID } = req.body; // Nhận userID để lưu vào controls
  
    if (!userID) {
      return res.status(400).json({ message: "Yêu cầu phải có userID!" });
    }
  
    try {
      // Kiểm tra xem cảm biến có tồn tại không
      const existingSensor = await prisma.sensor.findUnique({
        where: { sensorID: parseInt(sensorID) },
      });
  
      if (!existingSensor) {
        return res.status(404).json({ message: "Cảm biến không tồn tại!" });
      }
  
      const sensorType = existingSensor.type; // Lấy loại cảm biến để cập nhật quantity
  
      // Xóa cảm biến khỏi database
      await prisma.sensor.delete({
        where: { sensorID: parseInt(sensorID) },
      });
  
      // Đếm lại tổng số cảm biến cùng loại sau khi xóa
      const totalSameTypeSensors = await prisma.sensor.count({
        where: { type: sensorType },
      });
  
      // Cập nhật quantity của tất cả cảm biến cùng loại
      await prisma.sensor.updateMany({
        where: { type: sensorType },
        data: { quantity: totalSameTypeSensors },
      });
  
      // Lưu vào bảng controls
      await prisma.controls.create({
        data: {
          userID: parseInt(userID),
          deviceID: parseInt(sensorID),
          timeSwitch: new Date(),
          action: `Delete ${sensorType}(ID: ${sensorID})`,
        },
      });
  
      res.status(200).json({
        message: "Xóa cảm biến thành công!",
        deletedSensor: {
          sensorID: existingSensor.sensorID,
          sensorName: existingSensor.sensorName,
          type: sensorType,
        },
        updatedQuantity: totalSameTypeSensors,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi xóa cảm biến.", error: error.message });
    }
  };