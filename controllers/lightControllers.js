const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

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
    const updatedLed = await prisma.led_light.update({
      where: { lightID },
      data: { state },
    });

    await prisma.controls.create({
      data: {
        userID,
        deviceID: lightID, 
        timeSwitch: new Date(),
        action: `Set LED state to ${state}`,
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

// add light
exports.addLight = async (req, res) => {
  const { deviceName, status, state } = req.body;

  try {
    // Tạo thiết bị mới với số lượng mặc định là 1
    const newDevice = await prisma.device.create({
      data: {
        deviceName,
        quantity: 1, // Mặc định là 1
        status,
      },
    });

    if (!newDevice || !newDevice.deviceID) {
      return res.status(400).json({ message: "Lỗi: Không thể tạo thiết bị!" });
    }

    // Thêm thông tin đèn LED liên kết với thiết bị vừa tạo
    const newLed = await prisma.led_light.create({
      data: {
        lightID: newDevice.deviceID,
        state,
      },
    });

    // Đếm tổng số đèn LED hiện có trong hệ thống
    const totalLeds = await prisma.led_light.count();

    // Cập nhật tổng số lượng đèn LED trong `device`
    await prisma.device.updateMany({
      where: { led_light: { isNot: null } }, // Chỉ cập nhật cho thiết bị là đèn LED
      data: { quantity: totalLeds },
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

//Get light status
exports.getLightStatus = async (req, res) => {
  try {
      const { lightID } = req.params;

      // Tìm đèn LED theo ID
      const light = await prisma.led_light.findUnique({
          where: { lightID: parseInt(lightID) },
          include: { device: true }, // Lấy thông tin thiết bị liên quan
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