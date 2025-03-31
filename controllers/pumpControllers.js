const { createPumpService, setPumpScheduleService, getPumpAdafruitStateService, setPumpAdafruitStateService } = require("../services/pumpService");

//Add a new pump
exports.addPump = async (req, res) => {
  const userID = req.userID;
  if (!userID) {
    return res.status(401).json({ message: "Unauthorized: No userID" });
  }
  const { deviceName, status, autoLevel, schedule, state } = req.body;

  try {
    const result = await createPumpService({ deviceName, status, autoLevel, schedule, state, userID });
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm máy bơm mới.", error: error.message });
  }
};

//Update schedule for a pump
exports.setPumpSchedule = async (req, res) => {
  try {
    const { pumpID } = req.params;
    const { schedule, autoLevel } = req.body;

    const result = await setPumpScheduleService({ pumpID, schedule, autoLevel });
    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Máy bơm không tồn tại') {
      return res.status(404).json({ message: error.message });
    }
    console.error(error);
    res.status(500).json({ message: 'Lỗi server', error: error.message });
  }
};

//Get state of a pump
exports.getPumpAdafruitState = async (req, res) => {
  try {
    const { pumpID } = req.params;

    const data = await getPumpAdafruitStateService(pumpID);
    if (!data.pump) {
      return res.status(404).json({ error: 'Không tìm thấy máy bơm!' });
    }

    // data.newState = null => Chưa có feed
    if (data.newState === null) {
      return res.status(200).json({
        pumpID,
        message: data.message,
        deviceID: data.pump.device.deviceID,
        autoLevel: data.pump.autoLevel,
        schedule: data.pump.schedule,
        state: data.pump.state,
      });
    }

    return res.status(200).json({
      pumpID,
      deviceName: data.pump.device.deviceName,
      state: data.newState,
      message: data.message,
      deviceID: data.pump.device.deviceID,
      autoLevel: data.pump.autoLevel,
      schedule: data.pump.schedule,
    });
  } catch (error) {
    console.error('Lỗi khi lấy trạng thái máy bơm:', error);
    return res.status(500).json({ error: 'Không thể lấy trạng thái máy bơm.' });
  }
};

//Set state for a pump
exports.setPumpAdafruitState = async (req, res) => {
  try {
    const { pumpID } = req.params;
    const { state } = req.body;

    const result = await setPumpAdafruitStateService({ pumpID, state });
    res.status(200).json(result);
  } catch (error) {
    // Check error.message
    if (error.message.includes('Không tìm thấy máy bơm')) {
      return res.status(404).json({ error: error.message });
    }
    if (error.message.includes('Trạng thái không hợp lệ')) {
      return res.status(400).json({ error: error.message });
    }
    console.error('Lỗi khi đặt trạng thái máy bơm:', error);
    return res.status(500).json({ error: 'Không thể đặt trạng thái máy bơm.' });
  }
};
