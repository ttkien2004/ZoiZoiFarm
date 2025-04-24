const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('../axiosConfig/axiosConfig');

//Add a light
exports.createLightService = async ({ deviceName, status, state, userID }) => {
  const newDevice = await prisma.device.create({
    data: {
      deviceName,
      quantity: 1,
      status,
      userID,
    },
  });

  const newLed = await prisma.led_light.create({
    data: {
      lightID: newDevice.deviceID,
      state,
      deviceID: newDevice.deviceID,
    },
  });

  const totalLeds = await prisma.led_light.count();

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

  return {
    message: "Thêm đèn LED mới thành công!",
    led: newLed,
    totalLeds,
  };
};

//Turn on / off a light
exports.toggleLedStateService = async ({ lightID, state }) => {
  const lightDevice = await prisma.device.findUnique({
    where: { deviceID: lightID },
    select: { deviceName: true },
  });

  const updatedLed = await prisma.led_light.update({
    where: { lightID },
    data: { state },
  });

  await prisma.controls.create({
    data: {
      deviceID: lightID,
      timeSwitch: new Date(),
      action: `Điều chỉnh ${lightDevice?.deviceName} thành ${state}`,
    },
  });

  return {
    message: "Đã cập nhật trạng thái đèn LED thành công!",
    led: updatedLed,
  };
};

// Get light state
exports.getLightStatusService = async (lightID) => {
  const light = await prisma.led_light.findUnique({
    // where: { lightID: parseInt(lightID) },
    where: {lightID: 1},
    include: { device: true },
  });
  return light;
};

//Turn on / off a light
exports.setLedAdafruitStateService = async ({ lightID, state, userID }) => {
  const led = await prisma.led_light.findUnique({
    where: { lightID: parseInt(lightID) },
    include: { device: true },
  });

  const feedValue = state === "on" ? "1" : "0";
  await axiosClient.post(`/led/data`, { value: feedValue });

  await prisma.led_light.update({
    where: { lightID: led.lightID },
    data: { state },
  });

  if (userID) {
    await prisma.controls.create({
      data: {
        userID: parseInt(userID),
        deviceID: led.deviceID,
        timeSwitch: new Date(),
        action: `Bật/tắt LED ID=${lightID} => ${state}`,
      },
    });
  }

  return {
    message: `LED ID=${lightID} đã chuyển sang ${state} trên Adafruit IO`,
  };
};

// Get light state through Adafruit
exports.getLedAdafruitStateService = async (lightID) => {
  const led = await prisma.led_light.findUnique({
    where: { lightID: parseInt(lightID) },
    include: { device: true },
  });

  const response = await axiosClient.get(`/led/data?limit=1`);
  const feedData = response.data;

  if (!Array.isArray(feedData) || feedData.length === 0) {
    return {
      lightID: led.lightID,
      state: null,
      message: "Chưa có dữ liệu trên feed",
    };
  }

  const lastValue = feedData[0].value;
  const currentState = lastValue === "1" ? "on" : "off";

  await prisma.led_light.update({
    where: { lightID: led.lightID },
    data: { state: currentState },
  });

  return {
    lightID: led.lightID,
    state: currentState,
    message: "Lấy trạng thái LED từ Adafruit IO thành công!",
  };
};
