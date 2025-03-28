const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const axiosClient = require('../axiosConfig/axiosConfig');

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


// Turn on / off aa LED thông qua Adafruit IO
exports.setLedAdafruitState = async (req, res) => {
  try {
    const { lightID } = req.params;          
    const { state, userID } = req.body; 

    if (!["on", "off"].includes(state)) {
      return res.status(400).json({ error: "Trạng thái không hợp lệ (on/off)" });
    }

    const led = await prisma.led_light.findUnique({
      where: { lightID: parseInt(lightID) },
      include: { device: true },
    });

    if (!led) {
      return res.status(404).json({ error: "Không tìm thấy LED!" });
    }

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
          deviceID: led.deviceID || null,
          timeSwitch: new Date(),
          action: `Bật/tắt LED ID=${lightID} => ${state}`,
        },
      });
    }

    return res.status(200).json({
      message: `LED ID=${lightID} đã chuyển sang ${state} trên Adafruit IO`,
    });
  } catch (err) {
    console.error("Lỗi khi đặt trạng thái LED:", err);
    return res.status(500).json({ error: "Không thể đặt trạng thái LED." });
  }
};

// Get status of light from Adafruit IO (feed "led"), 

exports.getLedAdafruitState = async (req, res) => {
  try {
    const { lightID } = req.params;

    const led = await prisma.led_light.findUnique({
      where: { lightID: parseInt(lightID) },
      include: { device: true }, 
    });

    if (!led) {
      return res.status(404).json({ error: "Không tìm thấy LED!" });
    }

    const feedKey = "led"; 
    // const feedKey = led.feedKey; (Để sẵn đây thôi mốt nhiều led thì mình mới sửa lạilại)

    const response = await axiosClient.get(`/${feedKey}/data?limit=1`);
    const feedData = response.data;

    if (!Array.isArray(feedData) || feedData.length === 0) {
      return res.status(200).json({
        lightID: led.lightID,
        state: null,
        message: "Chưa có dữ liệu trên feed",
      });
    }

    const lastRecord = feedData[0];
    const lastValue = lastRecord.value
    let currentState = "off";
    if (lastValue === "1") currentState = "on";
    await prisma.led_light.update({
      where: { lightID: led.lightID },
      data: { state: currentState },
    });

    return res.status(200).json({
      lightID: led.lightID,
      state: currentState,
      message: "Lấy trạng thái LED từ Adafruit IO thành công!",
    });
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái LED:", error);
    return res.status(500).json({ error: "Không thể lấy trạng thái LED." });
  }
};