const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('../axiosConfig/axiosConfig');

// Add Pump and Log to Controls
exports.addPump = async (req, res) => {
  const { deviceName, status, autoLevel, schedule, state, userID } = req.body;

  if (!userID) {
    return res.status(400).json({ message: "Yêu cầu phải cung cấp userID!" });
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

    const newPump = await prisma.pump.create({
      data: {
        pumpID: newDevice.deviceID,
        autoLevel,
        schedule,
        state,
        deviceID: newDevice.deviceID,
      },
    });

    // Đếm tổng số máy bơm hiện có trong hệ thống
    const totalPumps = await prisma.pump.count();

    // Cập nhật tổng số lượng máy bơm trong `device`
    await prisma.device.updateMany({
      where: { pump: { isNot: null } }, 
      data: { quantity: totalPumps },
    });

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


//Set pump schedule
exports.setPumpSchedule = async (req, res) => {
  try {
      const { pumpID } = req.params;
      const { schedule, autoLevel, userID } = req.body;

      if (!userID) {
          return res.status(400).json({ message: 'Yêu cầu phải cung cấp userID!' });
      }

      const pump = await prisma.pump.findUnique({
          where: { pumpID: parseInt(pumpID) },
          include: { device: true } 
      });

      if (!pump) {
          return res.status(404).json({ message: 'Máy bơm không tồn tại' });
      }

      const updatedPump = await prisma.pump.update({
          where: { pumpID: parseInt(pumpID) },
          data: {
              schedule: schedule || pump.schedule, 
              autoLevel: autoLevel !== undefined ? autoLevel : pump.autoLevel,
          },
      });

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

// Get status of pump from Adafruit IO (feed "maybom"), 
exports.getPumpAdafruitState = async (req, res) => {
  try {
    const { pumpID } = req.params;

    const pump = await prisma.pump.findUnique({
      where: { pumpID: parseInt(pumpID) },
      include: { device: true }, 
    });
    if (!pump) {
      return res.status(404).json({ error: 'Không tìm thấy máy bơm!' });
    }

    // Gọi Adafruit IO, lấy 1 bản ghi mới nhất
    const response = await axiosClient.get('/maybom/data?limit=1');
    const feedData = response.data; 
    if (feedData.length === 0) {
      return res.status(200).json({ 
        pumpID: pumpID,
        state: null,
        message: 'Chưa có dữ liệu trên feed maybom' ,
        deviceID: pump.device.deviceID,
        autoLevel: pump.autoLevel,
        schedule: pump.schedule,
        state: pump.state,
      });
    }

    const lastValue = feedData[0].value; 
    let newState = 'off';
    if (lastValue === '1') newState = 'on';

    const updatedPump = await prisma.pump.update({
      where: { pumpID: parseInt(pumpID) },
      data: { state: newState }, 
    });

    return res.status(200).json({
      pumpID: pumpID,
      deviceName: pump.device.deviceName,
      state: newState,
      message: 'Lấy trạng thái máy bơm thành công!',
      deviceID: pump.device.deviceID,
      autoLevel: pump.autoLevel,
      schedule: pump.schedule,
      state: pump.state,
    });
  } catch (error) {
    console.error('Lỗi khi lấy trạng thái máy bơm:', error);
    return res.status(500).json({ error: 'Không thể lấy trạng thái máy bơm.' });
  }
};

//Turn on / off pump
exports.setPumpAdafruitState = async (req, res) => {
  try {
    const { pumpID } = req.params;
    const { state, userID } = req.body;
    
    const pump = await prisma.pump.findUnique({
      where: { pumpID: parseInt(pumpID) },
      include: { device: true }, 
    });
    if (!pump) {
      return res.status(404).json({ error: 'Không tìm thấy máy bơm!' });
    }

    if (!['on', 'off', 'auto'].includes(state)) {
      return res.status(400).json({ error: 'Trạng thái không hợp lệ (on/off/auto)' });
    }

    let feedValue = '0';
    if (state === 'on') feedValue = '1';
    else if (state === 'auto') feedValue = '2'; 

    await axiosClient.post('/maybom/data', {
      value: feedValue
    });

    const updatedPump = await prisma.pump.update({
      where: { pumpID: parseInt(pumpID) },
      data: { state },
    });

    const deviceID = pump.device?.deviceID; 
    if (userID) {
      await prisma.controls.create({
        data: {
          userID: parseInt(userID),
          deviceID: deviceID || null, 
          timeSwitch: new Date(),
          action: `Cập nhật máy bơm ${pump.device?.deviceName || ''} thành ${state}`,
        }
      });
    }

    return res.status(200).json({
      message: `Đã cập nhật máy bơm sang trạng thái ${state}`,
      pump: updatedPump,
    });
  } catch (error) {
    console.error('Lỗi khi đặt trạng thái máy bơm:', error);
    return res.status(500).json({ error: 'Không thể đặt trạng thái máy bơm.' });
  }
};
