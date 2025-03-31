const { getAllDevicesService, updateDeviceStatusService, deleteDeviceService, getDeviceStateService } = require("../services/deviceService");

//Get list device of user
exports.getAllDevices = async (req, res) => {
  try {
    const userID = req.userID;
    const deviceList = await getAllDevicesService(userID);
    return res.status(200).json(deviceList);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//Update status of a device
exports.updateDeviceStatus = async (req, res) => {
  const { deviceID } = req.params;
  const { status } = req.body;

  if (!["able", "disable"].includes(status)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ! Chỉ chấp nhận 'able' hoặc 'disable'." });
  }

  try {
    const updatedDevice = await updateDeviceStatusService(deviceID, status);
    res.status(200).json({
      message: "Cập nhật trạng thái thiết bị thành công!",
      device: updatedDevice,
    });
  } catch (error) {
    if (error.message === "Thiết bị không tồn tại!") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái thiết bị.", error: error.message });
  }
};

//Delete a device
exports.deleteDevice = async (req, res) => {
  const { deviceID } = req.params;
  try {
    const { deletedDevice, totalDevices } = await deleteDeviceService(deviceID);
    res.status(200).json({
      message: "Xóa thiết bị thành công!",
      deletedDevice,
      totalDevices,
    });
  } catch (error) {
    if (error.message === "Thiết bị không tồn tại!") {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Lỗi khi xóa thiết bị.", error: error.message });
  }
};

//Get status of a device
exports.getDeviceState = async (req, res) => {
  const { deviceID } = req.params;
  try {
    const deviceState = await getDeviceStateService(deviceID);
    res.status(200).json(deviceState);
  } catch (error) {
    if (error.message === "Thiết bị không tồn tại!") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message === "Thiết bị không có trạng thái!") {
      return res.status(400).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: "Lỗi khi lấy trạng thái thiết bị.", error: error.message });
  }
};
  