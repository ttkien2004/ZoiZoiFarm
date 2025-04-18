const express = require("express");
const router = express.Router();
const { addSensor, getSensors, updateSensorStatus, updateAlertThreshold, deleteSensor , getSensorData} = require("../controllers/sensorControllers");
const {requireAuth} = require("../middleware/middleware")
/**
 * @swagger
 * /api/sensor:
 *   post:
 *     summary: Add sensor
 *     description: Add a new sensor
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
router.post("/", requireAuth, addSensor);

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
router.get('/', requireAuth, getSensors);

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
 *     description: Update alertThreshold of a sensor
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
 *     description: Delete a sensor and update quantity of all same type sensors
 *     tags: ["Sensor"]
 *     parameters:
 *       - in: path
 *         name: sensorID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cảm biến cần xóa
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

/**
 * @swagger
 * /api/sensor/{sensorID}/data:
 *   get:
 *     summary: Get data of sensor
 *     description: Get the newest data of sensor by sensorID.
 *     tags: ["Sensor"]
 *     parameters:
 *       - in: path
 *         name: sensorID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của cảm biến
 *     responses:
 *       200:
 *         description: Lấy dữ liệu cảm biến thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy dữ liệu cảm biến thành công!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       dataID:
 *                         type: integer
 *                         example: 1
 *                       sensorID:
 *                         type: integer
 *                         example: 1
 *                       dataTime:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-03-20T12:30:00Z"
 *                       value:
 *                         type: number
 *                         example: 25.5
 *       500:
 *         description: Lỗi khi lấy dữ liệu cảm biến
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lỗi khi lấy dữ liệu cảm biến."
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/:sensorID/data', getSensorData);

module.exports = router;
