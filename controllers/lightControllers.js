const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add a light
exports.addLight = async (req, res) => {
  const { deviceName, status, state, userID } = req.body; 

  if (!userID) {
    return res.status(400).json({ message: "Yêu cầu phải có userID!" });
  }

  try {
    const newDevice = await prisma.device.create({
      data: {
        deviceName,
        quantity: 1,
        status,
      },
    });

    if (!newDevice || !newDevice.deviceID) {
      return res.status(400).json({ message: "Lỗi: Không thể tạo thiết bị!" });
    }

    const newLed = await prisma.led_light.create({
      data: {
        lightID: newDevice.deviceID,
        state,
        deviceID: newDevice.deviceID,
      },
    });

    // Đếm tổng số đèn LED hiện có trong hệ thống
    const totalLeds = await prisma.led_light.count();

    // Cập nhật tổng số lượng đèn LED trong `device`
    await prisma.device.updateMany({
      where: { led_light: { isNot: null } }, 
      data: { quantity: totalLeds },
    });

    await prisma.controls.create({
      data: {
        userID, 
        deviceID: newDevice.deviceID,
        timeSwitch: new Date(),
        action: `Thêm ${deviceName} thành công!`,
      },
    });

    res.status(201).json({
      message: "Thêm đèn LED mới thành công!",
      led: newLed,
      totalLeds,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm đèn LED mới.", error: error.message });
  }
};

//Light Control
exports.toggleLedState = async (req, res) => {
  const lightID = parseInt(req.params.lightID);
  const { state, userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: 'Yêu cầu phải cung cấp userID!' });
  }
  if (!['on', 'off'].includes(state)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
  }

  try {
    const lightDevice = await prisma.device.findUnique({
      where: { deviceID: lightID },
      select: { deviceName: true }, 
    });

    if (!lightDevice) {
      return res.status(404).json({ message: "Không tìm thấy đèn LED!" });
    }

    const updatedLed = await prisma.led_light.update({
      where: { lightID },
      data: { state },
    });

    await prisma.controls.create({
      data: {
        userID,
        deviceID: lightID, 
        timeSwitch: new Date(),
        action: `Điều chỉnh ${lightDevice.deviceName} thành ${state}`,
      }
    });

    res.status(200).json({
      message: 'Đã cập nhật trạng thái đèn LED thành công!',
      led: updatedLed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái đèn LED.' });
  }
};

//Get light status
exports.getLightStatus = async (req, res) => {
  try {
      const { lightID } = req.params;

      const light = await prisma.led_light.findUnique({
          where: { lightID: parseInt(lightID) },
          include: { device: true },
      });

      if (!light) {
          return res.status(404).json({ message: "Đèn LED không tồn tại" });
      }

      return res.status(200).json({
          lightID: light.lightID,
          deviceID: light.device.deviceID,
          state: light.state,
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};