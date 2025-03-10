const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


//Switch pump
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

//add pump
exports.addPump = async (req, res) => {
  const { deviceName, status, autoLevel, schedule, state } = req.body;

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

//Set pump scheduleschedule
exports.setPumpSchedule = async (req, res) => {
  try {
      const { pumpID } = req.params;
      const { schedule, autoLevel } = req.body;

      // Kiểm tra xem máy bơm có tồn tại không
      const pump = await prisma.pump.findUnique({
          where: { pumpID: parseInt(pumpID) },
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