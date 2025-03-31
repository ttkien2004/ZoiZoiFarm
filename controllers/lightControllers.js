const { createLightService, toggleLedStateService, getLightStatusService, setLedAdafruitStateService, getLedAdafruitStateService } = require("../services/lightService");

//Add a light
exports.addLight = async (req, res) => {
  const userID = req.userID;
  if (!userID) {
    return res.status(401).json({ message: "Unauthorized: No userID" });
  }
  const { deviceName, status, state } = req.body;
  try{
    const result = await createLightService({ deviceName, status, state, userID });
    return res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi thêm đèn LED mới.", error: error.message });
  }
};

//Turn on / off a light
exports.toggleLedState = async (req, res) => {
  const lightID = parseInt(req.params.lightID);
  const { state } = req.body;

  if (!["on", "off"].includes(state)) {
    return res.status(400).json({ message: "Trạng thái không hợp lệ!" });
  }
  try {
    const result = await toggleLedStateService({ lightID, state });
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi khi cập nhật trạng thái đèn LED." });
  }
};

// Get light state
exports.getLightStatus = async (req, res) => {
  const { lightID } = req.params;
  try {
    const light = await getLightStatusService(lightID);
    if (!light) {
      return res.status(404).json({ message: "Đèn LED không tồn tại" });
    }
    res.status(200).json({
      lightID: light.lightID,
      deviceID: light.device.deviceID,
      state: light.state,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server", error: error.message });
  }
};

//Turn on / off a light
exports.setLedAdafruitState = async (req, res) => {
  const { lightID } = req.params;
  const { state, userID } = req.body;
  if (!["on", "off"].includes(state)) {
    return res.status(400).json({ error: "Trạng thái không hợp lệ (on/off)" });
  }
  try {
    const result = await setLedAdafruitStateService({ lightID, state, userID });
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi đặt trạng thái LED:", error);
    return res.status(500).json({ error: "Không thể đặt trạng thái LED." });
  }
};

// Get light state through 
exports.getLedAdafruitState = async (req, res) => {
  const { lightID } = req.params;
  try {
    const result = await getLedAdafruitStateService(lightID);
    if (result.state === null && result.message.includes("Chưa có dữ liệu")) {
      return res.status(200).json(result);
    }
    return res.status(200).json(result);
  } catch (error) {
    console.error("Lỗi khi lấy trạng thái LED:", error);
    return res.status(500).json({ error: "Không thể lấy trạng thái LED." });
  }
};
