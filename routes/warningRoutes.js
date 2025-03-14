const express = require("express");
const router = express.Router();
const {
	getAllWarnings,
	createWarning,
	deleteWarning,
} = require("../controllers/warningControllers");

// Lấy hết warning
router.get("/getAll", getAllWarnings);
// Tạo warning mới
router.post("/createWarning", createWarning);
// Xóa warning
router.delete("/deleteWarning", deleteWarning);

module.exports = router;
