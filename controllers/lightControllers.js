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

//Add a light
exports.addLight = async (req, res) => {
  const { deviceName, quantity, status, state } = req.body;
  try {
    const newDevice = await prisma.device.create({
      data: {
        deviceName,
        quantity,
        status,
      },
    });
    const newLed = await prisma.led_light.create({
      data: {
        lightID: newDevice.deviceID,
        state,
      },
    });
    res.status(201).json({
      message: 'Thêm đèn LED mới thành công!',
      led: newLed,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi thêm đèn LED mới.' });
  }
};
