const { createSensorService, getSensorsService, updateSensorStatusService, updateAlertThresholdService, deleteSensorService, getSensorDataService } = require("../services/sensorService");

exports.addSensor = async (req, res) => {
  try {
    const userID = req.userID;
    if (!userID) {
      return res.status(401).json({ message: "Unauthorized: No userID" });
    }
    const { sensorName, type, alertThreshold, status } = req.body;

    const result = await createSensorService({ sensorName, type, alertThreshold, status, userID });
    res.status(201).json(result);
  } catch (error) {
    if (error.message === "Loại cảm biến không hợp lệ!") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm cảm biến mới.", error: error.message });
  }
};

exports.getSensors = async (req, res) => {
  try {
    const userID = req.userID;
    const sensors = await getSensorsService(userID);
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

exports.updateSensorStatus = async (req, res) => {
  const { sensorID } = req.params;
  const { status } = req.body;
  if (!['able', 'disable'].includes(status)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
  }
  try {
    const updatedSensor = await updateSensorStatusService(sensorID, status);
    res.status(200).json({
      message: 'Cập nhật trạng thái cảm biến thành công!',
      sensor: updatedSensor,
    });
  } catch (error) {
    if (error.message === 'Cảm biến không tồn tại!') {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({
      message: 'Lỗi khi cập nhật trạng thái cảm biến.',
      error: error.message,
    });
  }
};

exports.updateAlertThreshold = async (req, res) => {
  const { sensorID } = req.params;
  const { alertThreshold } = req.body;

  if (!alertThreshold || isNaN(alertThreshold)) {
    return res.status(400).json({ message: "Ngưỡng cảnh báo không hợp lệ!" });
  }

  try {
    const updatedSensor = await updateAlertThresholdService(sensorID, alertThreshold);
    res.status(200).json({
      message: "Cập nhật alertThreshold thành công!",
      sensor: updatedSensor,
    });
  } catch (error) {
    if (error.message === "Cảm biến không tồn tại!") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật alertThreshold.", error: error.message });
  }
};

exports.deleteSensor = async (req, res) => {
  const { sensorID } = req.params;
  try {
    const result = await deleteSensorService(sensorID);
    res.status(200).json(result);
  } catch (error) {
    if (error.message === "Cảm biến không tồn tại!") {
      return res.status(404).json({ message: error.message });
    }
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
    const sensorData = await getSensorDataService(sensorID);
    res.status(200).json({
      message: 'Lấy dữ liệu cảm biến thành công!',
      data: sensorData,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi lấy dữ liệu cảm biến.', error: error.message });
  }
};
