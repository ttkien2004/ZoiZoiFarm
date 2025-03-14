const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Add Pump and Log to Controls
exports.addPump = async (req, res) => {
  const { deviceName, status, autoLevel, schedule, state, userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: "Yêu cầu phải cung cấp userID!" });
  }

  try {
    // Tạo thiết bị mới với số lượng mặc định là 1
    const newDevice = await prisma.device.create({
      data: {
        deviceName,
        quantity: 1, // Ban đầu set 1
        status,
      },
    });

    if (!newDevice || !newDevice.deviceID) {
      return res.status(400).json({ message: "Lỗi: Không thể tạo thiết bị!" });
    }

    // Thêm thông tin máy bơm liên kết với thiết bị vừa tạo
    const newPump = await prisma.pump.create({
      data: {
        pumpID: newDevice.deviceID,
        autoLevel,
        schedule,
        state,
      },
    });

    // Đếm tổng số máy bơm hiện có trong hệ thống
    const totalPumps = await prisma.pump.count();

    // Cập nhật tổng số lượng máy bơm trong `device`
    await prisma.device.updateMany({
      where: { pump: { isNot: null } }, // Chỉ cập nhật cho thiết bị là máy bơm
      data: { quantity: totalPumps },
    });

    // Ghi log vào bảng `controls`
    await prisma.controls.create({
      data: {
        userID,
        deviceID: newDevice.deviceID,
        timeSwitch: new Date(),
        action: `Thêm ${deviceName} vào hệ thống`,
      },
    });

    res.status(201).json({
      message: "Thêm máy bơm mới thành công!",
      pump: newPump,
      totalPumps,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm máy bơm mới.", error: error.message });
  }
};

// Switch Pump State and Log to Controls
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
    // Lấy thông tin máy bơm và tên thiết bị
    const pump = await prisma.pump.findUnique({
      where: { pumpID },
      include: { device: true }, // Lấy cả thông tin thiết bị
    });

    if (!pump) {
      return res.status(404).json({ message: 'Máy bơm không tồn tại!' });
    }

    // Cập nhật trạng thái của máy bơm
    const updatedPump = await prisma.pump.update({
      where: { pumpID },
      data: { state },
    });

    // Ghi log vào bảng `controls`
    await prisma.controls.create({
      data: {
        userID,
        deviceID: pumpID,
        timeSwitch: new Date(),
        action: `Điều chỉnh ${pump.device.deviceName} thành ${state}`,
      },
    });

    res.status(200).json({
      message: 'Đã cập nhật trạng thái máy bơm thành công!',
      pump: updatedPump,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Lỗi khi cập nhật trạng thái máy bơm.', error: error.message });
  }
};


//Set pump schedule
exports.setPumpSchedule = async (req, res) => {
  try {
      const { pumpID } = req.params;
      const { schedule, autoLevel, userID } = req.body;

      if (!userID) {
          return res.status(400).json({ message: 'Yêu cầu phải cung cấp userID!' });
      }

      // Kiểm tra xem máy bơm có tồn tại không
      const pump = await prisma.pump.findUnique({
          where: { pumpID: parseInt(pumpID) },
          include: { device: true } // Lấy thông tin thiết bị liên quan
      });

      if (!pump) {
          return res.status(404).json({ message: 'Máy bơm không tồn tại' });
      }

      // Cập nhật lịch trình tưới tiêu
      const updatedPump = await prisma.pump.update({
          where: { pumpID: parseInt(pumpID) },
          data: {
              schedule: schedule || pump.schedule, // Nếu không có giá trị mới, giữ nguyên
              autoLevel: autoLevel !== undefined ? autoLevel : pump.autoLevel,
          },
      });

      // Ghi log vào bảng controls
      await prisma.controls.create({
          data: {
              userID,
              deviceID: pump.device.deviceID,
              timeSwitch: new Date(),
              action: `${pump.device.deviceName} tự động tưới nước lúc ${schedule}`,
          }
      });

      return res.status(200).json({ message: 'Cập nhật lịch trình tưới tiêu thành công', pump: updatedPump });
  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

//Get pump status
exports.getPumpStatus = async (req, res) => {
  try {
      const { pumpID } = req.params;

      // Tìm máy bơm theo ID
      const pump = await prisma.pump.findUnique({
          where: { pumpID: parseInt(pumpID) },
          include: { device: true }, // Lấy thông tin thiết bị liên quan
      });

      if (!pump) {
          return res.status(404).json({ message: "Máy bơm không tồn tại" });
      }

      return res.status(200).json({
          pumpID: pump.pumpID,
          deviceID: pump.device.deviceID,
          autoLevel: pump.autoLevel,
          schedule: pump.schedule,
          state: pump.state,
      });

  } catch (error) {
      console.error(error);
      return res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};