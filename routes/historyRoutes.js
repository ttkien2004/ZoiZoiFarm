const express = require("express");
const router = express.Router();
const { getUserControlHistory } = require("../controllers/historyControllers");
const { requireAuth } = require('../middleware/middleware');
/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Lấy lịch sử hoạt động của người dùng.
 *     tags: ["History"]
 *     responses:
 *       200:
 *         description: Trả về danh sách lịch sử hoạt động của người dùng.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     userID:
 *                       type: integer
 *                     userName:
 *                       type: string
 *                 controlsHistory:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       controlID:
 *                         type: integer
 *                       userID:
 *                         type: integer
 *                       deviceID:
 *                         type: integer
 *                       sensorID:
 *                         type: integer
 *                       timeSwitch:
 *                         type: string
 *                         format: date-time
 *                       action:
 *                         type: string
 *       404:
 *         description: Không tìm thấy người dùng.
 *       500:
 *         description: Lỗi server.
 */
router.get("/",requireAuth, getUserControlHistory);

module.exports = router;
