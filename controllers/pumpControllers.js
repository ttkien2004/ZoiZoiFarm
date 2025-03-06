const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.togglePumpState = async (req, res) => {
  const pumpID = parseInt(req.params.pumpID);
  const { state, userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: 'Yêu cầu phải cung cấp userID!' });
  }

  if (!['on', 'off', 'auto'].includes(state)) {
    return res.status(400).json({ message: 'Trạng thái không hợp lệ!' });
  }

  try {
    const updatedPump = await prisma.pump.update({
      where: { pumpID },
      data: { state },
    });

    await prisma.controls.create({
      data: {
        userID,
        deviceID: pumpID,
        timeSwitch: new Date(),
        action: `Set state to ${state}`,
      }
    });

    res.status(201).json({
      message: 'Đã cập nhật trạng thái máy bơm thành công!',
      pump: updatedPump,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái máy bơm.' });
  }
};

// Controller add a pump
exports.addPump = async (req, res) => {
  const { deviceName, quantity, status, autoLevel, schedule, state } = req.body;

  try {
    // Tạo thiết bị trước
    const newDevice = await prisma.device.create({
      data: {
        deviceName,
        quantity,
        status,
      },
    });

    // Tạo pump dùng pumpID chính là deviceID vừa tạo
    const newPump = await prisma.pump.create({
      data: {
        pumpID: newDevice.deviceID,
        autoLevel,
        schedule,
        state,
      },
    });

    res.status(201).json({
      message: 'Thêm máy bơm mới thành công!',
      pump: newPump,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi thêm máy bơm mới.' });
  }
};