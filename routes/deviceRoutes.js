const express = require('express');
const router = express.Router();
const { getAllDevices, updateDeviceStatus, deleteDevice, getDeviceState } = require('../controllers/deviceControllers');

/**
 * @swagger
 * /api/device:
 *   get:
 *     summary: Get list of all devices
 *     description: Retrieve a list of all devices, including LED lights and pumps.
 *     tags: ["Device"]
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of devices
 *       500:
 *         description: Internal server error
 */
router.get('/', getAllDevices);

/**
 * @swagger
 * /api/device/{deviceID}/status:
 *   put:
 *     summary: Updata device status
 *     description: Able or disable a device
 *     tags: ["Device"]
 *     parameters:
 *       - in: path
 *         name: deviceID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thiết bị cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [able, disable]
 *                 example: "disable"
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Input không hợp lệ
 *       500:
 *         description: Lỗi server
 */
router.put("/:deviceID/status", updateDeviceStatus);

/**
 * @swagger
 * /api/device/{deviceID}:
 *   delete:
 *     summary: Delete device
 *     description: Xóa thiết bị theo `deviceID` và cập nhật `quantity` của tất cả thiết bị cùng loại.
 *     tags: ["Device"]
 *     parameters:
 *       - in: path
 *         name: deviceID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thiết bị cần xóa
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userID]
 *             properties:
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Xóa thiết bị thành công và cập nhật số lượng
 *       404:
 *         description: Thiết bị không tồn tại
 *       500:
 *         description: Lỗi server
 */

router.delete("/:deviceID", deleteDevice);


/**
 * @swagger
 * /api/device/{deviceID}/state:
 *   get:
 *     summary: Get device state
 *     description: Trả về trạng thái của thiết bị (Pump hoặc LED Light)
 *     tags: ["Device"]
 *     parameters:
 *       - in: path
 *         name: deviceID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của thiết bị cần lấy trạng thái
 *     responses:
 *       200:
 *         description: Lấy trạng thái thiết bị thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 deviceID:
 *                   type: integer
 *                   example: 5
 *                 deviceName:
 *                   type: string
 *                   example: "Máy bơm số 1"
 *                 state:
 *                   type: string
 *                   example: "on"
 *       404:
 *         description: Thiết bị không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.get("/:deviceID/state", getDeviceState);

module.exports = router;
