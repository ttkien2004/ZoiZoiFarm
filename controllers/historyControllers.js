const { getUserControlHistoryService } = require("../services/historyService");

//Lấy lịch sử hoạt động của người dùng
exports.getUserControlHistory = async (req, res) => {
  const userID = req.userID;

  try {
    const { user, timeline } = await getUserControlHistoryService(userID);
    res.status(200).json({
      user: {
        userID: user.userID,
        userName: user.userName,
      },
      timeline,
      // controlWarning,
    });
  } catch (error) {
    if (error.message === "USER_NOT_FOUND") {
      return res.status(404).json({ message: "Người dùng không tồn tại" });
    }
    console.error(error);
    res.status(500).json({
      message: "Lỗi server",
      error: error.message,
    });
  }
};
