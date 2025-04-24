const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('../axiosConfig/axiosConfig');

//Add a new pump
exports.createPumpService = async ({ deviceName, status, autoLevel, schedule, state, userID }) => {
  const newDevice = await prisma.device.create({
    data: {
      deviceName,
      quantity: 1,
      status,
      userID,
    },
  });

  const newPump = await prisma.pump.create({
    data: {
      pumpID: newDevice.deviceID,
      autoLevel,
      schedule,
      state,
      deviceID: newDevice.deviceID,
    },
  });

  const totalPumps = await prisma.pump.count();

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

  return {
    message: "Thêm máy bơm mới thành công!",
    pump: newPump,
    totalPumps,
  };
};

//Update schedule for a pump
exports.setPumpScheduleService = async ({ pumpID, schedule, autoLevel }) => {
  const pump = await prisma.pump.findUnique({
    where: { pumpID: parseInt(pumpID) },
    include: { device: true },
  });
  if (!pump) {
    throw new Error("Máy bơm không tồn tại");
  }

  const updatedPump = await prisma.pump.update({
    where: { pumpID: parseInt(pumpID) },
    data: {
      schedule: schedule || pump.schedule,
      autoLevel: (autoLevel !== undefined) ? autoLevel : pump.autoLevel,
    },
    include: {
      device: true,
    },
  });

  await prisma.controls.create({
    data: {
      deviceID: pump.device.deviceID,
      timeSwitch: new Date(),
      action: `${pump.device.deviceName} tự động tưới nước lúc ${schedule}`,
    }
  });

  return {
    message: 'Cập nhật lịch trình tưới tiêu thành công',
    pump: updatedPump,
  };
};

//Get state of a pump
exports.getPumpAdafruitStateService = async (pumpID) => {
  const pump = await prisma.pump.findUnique({
    where: { pumpID: parseInt(pumpID) },
    include: { device: true },
  });
  if (!pump) {
    throw new Error('Không tìm thấy máy bơm!');
  }

  const response = await axiosClient.get('/maybom/data?limit=1');
  const feedData = response.data;

  if (!Array.isArray(feedData) || feedData.length === 0) {
    return {
      pump,
      newState: null,
      message: 'Chưa có dữ liệu trên feed maybom'
    };
  }

  const lastValue = feedData[0].value;
  let newState = 'off';
  if (lastValue === '1') newState = 'on';

  const updatedPump = await prisma.pump.update({
    where: { pumpID: parseInt(pumpID) },
    data: { state: newState },
    include: {
      device: true, 
    },
  });

  return {
    pump: updatedPump,
    newState,
    message: 'Lấy trạng thái máy bơm thành công!',
  };
};

//Set state for a pump
exports.setPumpAdafruitStateService = async ({ pumpID, state }) => {
  const pump = await prisma.pump.findUnique({
    // where: { pumpID: parseInt(pumpID) },
    where: { pumpID: 1 },
    include: { device: true },
  });
  if (!pump) {
    throw new Error('Không tìm thấy máy bơm!');
  }

  if (!['on', 'off', 'auto'].includes(state)) {
    throw new Error('Trạng thái không hợp lệ (on/off/auto)');
  }

  let feedValue = '0';
  if (state === 'on') feedValue = '1';
  else if (state === 'auto') feedValue = '2';

  await axiosClient.post('/maybom/data', { value: feedValue });

  const updatedPump = await prisma.pump.update({
    where: { pumpID: parseInt(pumpID) },
    data: { state },
    include: {
      device: true, 
    },
  });

  const deviceID = pump.device?.deviceID;

  await prisma.controls.create({
    data: {
      deviceID: deviceID || null,
      timeSwitch: new Date(),
      action: `Cập nhật máy bơm ${pump.device?.deviceName || ''} thành ${state}`,
    }
  });
  
  return {
    message: `Đã cập nhật máy bơm sang trạng thái ${state}`,
    pump: updatedPump,
  };
};

exports.updatePumpAutoLevelService = async (pumpID, autoLevel) => {
  const pump = await prisma.pump.findUnique({
    where: { pumpID: parseInt(pumpID) },
  });

  if (!pump) {
    throw new Error("Không tìm thấy máy bơm");
  }

  const updatedPump = await prisma.pump.update({
    where: { pumpID: parseInt(pumpID) },
    data: { autoLevel: autoLevel },
  });

  console.log("Cập nhật xong:", updatedPump);

  return {
    pumpID: updatedPump.pumpID,
    autoLevel: updatedPump.autoLevel,
    message: "Cập nhật autoLevel thành công!",
  };
};