const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

//Get list device of user
async function getAllDevicesService(userID) {
  const devices = await prisma.device.findMany({
    where: { userID },
    orderBy: {
      status: 'asc'
    },
    include: {
      pump: true,
      led_light: true
    }
  });

  const deviceList = devices.map(device => ({
    deviceID: device.deviceID,
    deviceName: device.deviceName,
    quantity: device.quantity,
    status: device.status,
    state: device.pump ? device.pump.state : device.led_light ? device.led_light.state : null,
    autoLevel: device.pump ? device.pump.autoLevel : null,
    schedule: device.pump ? device.pump.schedule : null,
    type: device.pump ? "pump" : device.led_light ? "led_light" : "unknown"
  }));

  return deviceList;
}

//Update status of a device
async function updateDeviceStatusService(deviceID, status) {
  // Tìm device
  const device = await prisma.device.findUnique({
    where: { deviceID: parseInt(deviceID) },
  });
  if (!device) {
    throw new Error("Thiết bị không tồn tại!");
  }

  // Cập nhật
  const updatedDevice = await prisma.device.update({
    where: { deviceID: parseInt(deviceID) },
    data: { status },
  });

  const actionMessage = (status === "able")
    ? `${device.deviceName} hoạt động trở lại.`
    : `${device.deviceName} bị vô hiệu hóa.`;

  // Ghi log vào controls
  await prisma.controls.create({
    data: {
      deviceID: parseInt(deviceID),
      timeSwitch: new Date(),
      action: actionMessage,
    }
  });

  return updatedDevice;
}

//Delete a device
async function deleteDeviceService(deviceID) {
  const existingDevice = await prisma.device.findUnique({
    where: { deviceID: parseInt(deviceID) },
    include: {
      pump: true,
      led_light: true,
    },
  });
  if (!existingDevice) {
    throw new Error("Thiết bị không tồn tại!");
  }

  const deletedDeviceInfo = {
    deviceID: existingDevice.deviceID,
    deviceName: existingDevice.deviceName,
  };

  const isPump = existingDevice.pump !== null;
  const isLight = existingDevice.led_light !== null;

  // Xóa device
    // Xóa pump (nếu isPump)
    if (existingDevice.pump) {
        await prisma.pump.delete({
        where: { pumpID: existingDevice.deviceID }
        });
    }
    
    // Xóa led_light (nếu isLight)
    if (existingDevice.led_light) {
        await prisma.led_light.delete({
        where: { lightID: existingDevice.deviceID }
        });
    }
    
    // Xóa logs controls trỏ tới deviceID (nếu cần)
    await prisma.controls.deleteMany({
        where: { deviceID: existingDevice.deviceID },
    });
    
    // Cuối cùng, xóa device
    await prisma.device.delete({
        where: { deviceID: existingDevice.deviceID }
    });

  // Update quantity
  let totalDevices;
  if (isPump) {
    totalDevices = await prisma.pump.count();
    await prisma.device.updateMany({
      where: { pump: { isNot: null } },
      data: { quantity: totalDevices },
    });
  } else if (isLight) {
    totalDevices = await prisma.led_light.count();
    await prisma.device.updateMany({
      where: { led_light: { isNot: null } },
      data: { quantity: totalDevices },
    });
  }

  // Ghi log
  await prisma.controls.create({
    data: {
      deviceID: null,
      timeSwitch: new Date(),
      action: `${deletedDeviceInfo.deviceName} đã bị xóa khỏi hệ thống`,
    }
  });

  return {
    deletedDevice: deletedDeviceInfo,
    totalDevices
  };
}

//Get status of a device
async function getDeviceStateService(deviceID) {
  const device = await prisma.device.findUnique({
    where: { deviceID: parseInt(deviceID) },
    include: {
      pump: true,
      led_light: true,
    },
  });
  if (!device) {
    throw new Error("Thiết bị không tồn tại!");
  }

  let state = null;
  if (device.pump) {
    state = device.pump.state;
  } else if (device.led_light) {
    state = device.led_light.state;
  } else {
    throw new Error("Thiết bị không có trạng thái!");
  }

  return {
    deviceID: device.deviceID,
    deviceName: device.deviceName,
    status: device.status,
    state
  };
}

module.exports = {
  getAllDevicesService,
  updateDeviceStatusService,
  deleteDeviceService,
  getDeviceStateService
};
