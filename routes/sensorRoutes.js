const express = require("express");
const router = express.Router();
const { addSensor, getSensors, updateSensorStatus, updateAlertThreshold, deleteSensor } = require("../controllers/sensorControllers");

/**
 * @swagger
 * /api/sensor:
 *   post:
 *     summary: Add sensor
 *     description: Thêm một cảm biến mới vào hệ thống, cập nhật tổng số lượng cảm biến cùng loại và ghi lại vào bảng controls.
 *     tags: ["Sensor"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sensorName:
 *                 type: string
 *                 example: "Cảm biến nhiệt độ 1"
 *               type:
 *                 type: string
 *                 enum: ["Soil Moisture Sensor", "Temperature & Humidity Sensor", "Light Sensor"]
 *                 example: "Temperature & Humidity Sensor"
 *               alertThreshold:
 *                 type: number
 *                 example: 30.5
 *               status:
 *                 type: string
 *                 enum: ["able", "disable"]
 *                 example: "able"
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Cảm biến đã được thêm thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm cảm biến mới thành công!"
 *                 sensor:
 *                   type: object
 *                 totalSensors:
 *                   type: integer
 *                   example: 5
 *       400:
 *         description: Loại cảm biến không hợp lệ hoặc thiếu userID
 *       500:
 *         description: Lỗi server
 */
router.post("/", addSensor);

/**
 * @swagger
 * /api/sensor:
 *   get:
 *     summary: Get list of all sensors
 *     description: Retrieve the list of all sensors in the system.
 *     tags: ["Sensor"]
 *     responses:
 *       200:
 *         description: Successfully retrieved sensors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy danh sách cảm biến thành công!"
 *                 totalSensors:
 *                   type: integer
 *                   example: 5
 *                 sensors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       sensorID:
 *                         type: integer
 *                         example: 1
 *                       sensorName:
 *                         type: string
 *                         example: "Cảm biến nhiệt độ & độ ẩm"
 *                       type:
 *                         type: string
 *                         example: "Temperature & Humidity Sensor"
 *                       quantity:
 *                         type: integer
 *                         example: 10
 *                       alertThreshold:
 *                         type: number
 *                         example: 30.5
 *                       status:
 *                         type: string
 *                         enum: [able, disable]
 *                         example: "able"
 *       500:
 *         description: Internal server error
 */
router.get('/', getSensors);

/**
 * @swagger
 * /api/sensor/{sensorID}/status:
 *   put:
 *     summary: Update sensor status (able/disable)
 *     description: Change the status of a sensor and log the action in the control history.
 *     tags: ["Sensor"]
 *     parameters:
 *       - in: path
 *         name: sensorID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the sensor to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status, userID]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [able, disable]
 *                 example: "able"
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Successfully updated sensor status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Cập nhật trạng thái cảm biến thành công!"
 *                 sensor:
 *                   type: object
 *       400:
 *         description: Invalid input data
 *       404:
 *         description: Sensor not found
 *       500:
 *         description: Internal server error
 */
router.put('/:sensorID/status', updateSensorStatus);

/**
 * @swagger
 * /api/sensor/{sensorID}/alertThreshold:
 *   put:
 *     summary: Update alertThreshold
 *     description: Cập nhật giá trị alertThreshold của một cảm biến và lưu vào bảng controls.
 *     tags: ["Sensor"]
 *     parameters:
 *       - in: path
 *         name: sensorID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cảm biến cần cập nhật
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [alertThreshold, userID]
 *             properties:
 *               alertThreshold:
 *                 type: number
 *                 example: 35.5
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Cập nhật alertThreshold thành công
 *       400:
 *         description: Dữ liệu đầu vào không hợp lệ
 *       404:
 *         description: Cảm biến không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.put('/:sensorID/alertThreshold', updateAlertThreshold);

/**
 * @swagger
 * /api/sensor/{sensorID}:
 *   delete:
 *     summary: Delete sensor
 *     description: Xóa một cảm biến khỏi hệ thống, cập nhật quantity của tất cả cảm biến cùng loại và ghi vào bảng controls.
 *     tags: ["Sensor"]
 *     parameters:
 *       - in: path
 *         name: sensorID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cảm biến cần xóa
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
 *         description: Xóa cảm biến thành công
 *       400:
 *         description: Thiếu userID hoặc dữ liệu không hợp lệ
 *       404:
 *         description: Cảm biến không tồn tại
 *       500:
 *         description: Lỗi server
 */
router.delete('/:sensorID', deleteSensor);


module.exports = router;
