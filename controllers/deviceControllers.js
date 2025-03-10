const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Get device list
exports.getAllDevices = async (req, res) => {
    try {
        // Lấy danh sách tất cả các thiết bị
        const devices = await prisma.device.findMany({
            include: {
                pump: true, // Kiểm tra nếu là máy bơm
                led_light: true // Kiểm tra nếu là đèn LED
            }
        });

        // Chuyển đổi dữ liệu để hiển thị loại thiết bị phù hợp
        const deviceList = devices.map(device => ({
            deviceID: device.deviceID,
            deviceName: device.deviceName,
            quantity: device.quantity,
            status: device.status,
            type: device.pump ? "pump" : device.led_light ? "led_light" : "unknown"
        }));

        return res.status(200).json(deviceList);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// Update device status
// Cập nhật trạng thái thiết bị
exports.updateDeviceStatus = async (req, res) => {
    const { deviceID } = req.params;
    const { status } = req.body;
  
    // Kiểm tra input hợp lệ
    if (!["able", "disable"].includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ! Chỉ chấp nhận 'able' hoặc 'disable'." });
    }
  
    try {
      // Cập nhật trạng thái thiết bị
      const updatedDevice = await prisma.device.update({
        where: { deviceID: parseInt(deviceID) },
        data: { status },
      });
  
      res.status(200).json({
        message: "Cập nhật trạng thái thiết bị thành công!",
        device: updatedDevice,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi cập nhật trạng thái thiết bị.", error: error.message });
    }
  };

// Delete a device
exports.deleteDevice = async (req, res) => {
    const { deviceID } = req.params;
  
    try {
      // Kiểm tra thiết bị có tồn tại không
      const existingDevice = await prisma.device.findUnique({
        where: { deviceID: parseInt(deviceID) },
        include: {
          pump: true,
          led_light: true,
        },
      });
  
      if (!existingDevice) {
        return res.status(404).json({ message: "Thiết bị không tồn tại!" });
      }
  
      // Lưu thông tin thiết bị trước khi xóa
      const deletedDeviceInfo = {
        deviceID: existingDevice.deviceID,
        deviceName: existingDevice.deviceName,
      };
  
      // Xác định loại thiết bị (Pump hoặc LED)
      let isPump = existingDevice.pump !== null;
      let isLight = existingDevice.led_light !== null;
  
      // Xóa thiết bị khỏi database
      await prisma.device.delete({
        where: { deviceID: parseInt(deviceID) },
      });
  
      // Cập nhật số lượng thiết bị cùng loại
      let totalDevices;
      if (isPump) {
        totalDevices = await prisma.pump.count();
        await prisma.device.updateMany({
          where: { pump: { isNot: null } }, // Cập nhật tất cả pump
          data: { quantity: totalDevices },
        });
      } else if (isLight) {
        totalDevices = await prisma.led_light.count();
        await prisma.device.updateMany({
          where: { led_light: { isNot: null } }, // Cập nhật tất cả light
          data: { quantity: totalDevices },
        });
      }
  
      res.status(200).json({
        message: "Xóa thiết bị thành công!",
        deletedDevice: deletedDeviceInfo,
        totalDevices,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi xóa thiết bị.", error: error.message });
    }
  };

//Get state of a device
exports.getDeviceState = async (req, res) => {
    const { deviceID } = req.params;
  
    try {
      // Tìm thiết bị với thông tin `pump` hoặc `led_light`
      const device = await prisma.device.findUnique({
        where: { deviceID: parseInt(deviceID) },
        include: {
          pump: true,
          led_light: true,
        },
      });
  
      if (!device) {
        return res.status(404).json({ message: "Thiết bị không tồn tại!" });
      }
  
      // Xác định trạng thái dựa trên loại thiết bị
      let state = null;
      if (device.pump) {
        state = device.pump.state;
      } else if (device.led_light) {
        state = device.led_light.state;
      } else {
        return res.status(400).json({ message: "Thiết bị không có trạng thái!" });
      }
  
      res.status(200).json({
        deviceID: device.deviceID,
        deviceName: device.deviceName,
        state,
      });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi lấy trạng thái thiết bị.", error: error.message });
    }
  };