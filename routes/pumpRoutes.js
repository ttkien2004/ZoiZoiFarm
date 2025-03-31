const express = require('express');
const { addPump, setPumpSchedule , getPumpAdafruitState, setPumpAdafruitState} = require('../controllers/pumpControllers');
const {requireAuth} = require("../middleware/middleware")

const router = express.Router();

/**
 * @swagger
 * /api/pump:
 *   post:
 *     summary: Add a new pump
 *     description: Add a new pump device into the system with a default quantity of 1.
 *     tags: ["Pump"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               deviceName:
 *                 type: string
 *                 example: "Máy bơm số 1"
 *               status:
 *                 type: string
 *                 enum: [able, disable]
 *                 example: "able"
 *               autoLevel:
 *                 type: boolean
 *                 example: true
 *               schedule:
 *                 type: string
 *                 example: "06:00, 18:00"
 *               state:
 *                 type: string
 *                 enum: [on, off, auto]
 *                 example: "auto"
 *     responses:
 *       201:
 *         description: Successfully added pump
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm máy bơm mới thành công!"
 *                 pump:
 *                   type: object
 *                 totalPumps:
 *                   type: integer
 *                   example: 5
 *       500:
 *         description: Internal server error
 */

router.post("/", requireAuth, addPump);

// /**
//  * @swagger
//  * /api/pump/{pumpID}/state:
//  *   put:
//  *     summary: Update pump state
//  *     description: Change the state of a pump (on/off/auto).
//  *     tags: ["Pump"]
//  *     parameters:
//  *       - in: path
//  *         name: pumpID
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the pump to update
//  *     requestBody:
//  *       required: true
//  *       content:
//  *         application/json:
//  *           schema:
//  *             type: object
//  *             required: [state, userID]
//  *             properties:
//  *               state:
//  *                 type: string
//  *                 enum: [on, off, auto]
//  *                 example: "on"
//  *     responses:
//  *       200:
//  *         description: Successfully updated pump state
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Đã cập nhật trạng thái máy bơm thành công!"
//  *                 pump:
//  *                   type: object
//  *                   properties:
//  *                     pumpID:
//  *                       type: integer
//  *                     deviceID:
//  *                       type: integer
//  *                     autoLevel:
//  *                       type: boolean
//  *                     schedule:
//  *                       type: string
//  *                       nullable: true
//  *                     state:
//  *                       type: string
//  *                       example: "on"
//  *       400:
//  *         description: Invalid state input
//  *       500:
//  *         description: Internal server error
//  */
// router.put('/:pumpID/state', togglePumpState);

/**
 * @swagger
 * /api/pump/{pumpID}/schedule:
 *   put:
 *     summary: Update pump schedule
 *     description: Set or update the schedule for a pump.
 *     tags: ["Pump"]
 *     parameters:
 *       - in: path
 *         name: pumpID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the pump to update schedule
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [schedule, userID]
 *             properties:
 *               schedule:
 *                 type: string
 *                 example: "06:00, 18:00"
 *     responses:
 *       200:
 *         description: Successfully updated pump schedule
 *       400:
 *         description: Invalid schedule input
 *       500:
 *         description: Internal server error
 */
router.put('/:pumpID/schedule', setPumpSchedule);

// /**
//  * @swagger
//  * /api/pump/{pumpID}/status:
//  *   get:
//  *     summary: Get current pump status
//  *     description: Retrieve the current state, schedule, and autoLevel status of a pump.
//  *     tags: ["Pump"]
//  *     parameters:
//  *       - in: path
//  *         name: pumpID
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the pump to retrieve status
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved pump status
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 pumpID:
//  *                   type: integer
//  *                 deviceID:
//  *                   type: integer
//  *                 autoLevel:
//  *                   type: boolean
//  *                 schedule:
//  *                   type: string
//  *                   nullable: true
//  *                 state:
//  *                   type: string
//  *                   example: "on"
//  *       404:
//  *         description: Pump not found
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/:pumpID/status', getPumpStatus);

// Lấy trạng thái máy bơm qua Adafruit
/**
 * @swagger
 * /api/pump/{pumpID}/adafruit/state:
 *   get:
 *     summary: Get state of a pump from Adafruit IO
 *     description: Get current state of pump from Adafruit IO
 *     tags: ["Pump"]
 *     parameters:
 *       - in: path
 *         name: pumpID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID máy bơm
 *     responses:
 *       200:
 *         description: Trạng thái máy bơm (on/off)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 pumpID:
 *                   type: integer
 *                   example: 1
 *                 deviceName:
 *                   type: string
 *                   example: Máy bơm số 1
 *                 state:
 *                   type: string
 *                   example: on
 *                 message:
 *                   type: string
 *                   example: Lấy trạng thái máy bơm thành công!
 *                 deviceID:
 *                   type: integer
 *                   example: 1
 *                 autoLevel:
 *                   type: string
 *                   example: true
 *                 schedule:
 *                   type: string
 *                   example: 13:50, 18:00
 *       404:
 *         description: Không tìm thấy máy bơm
 *       500:
 *         description: Lỗi server
 */
router.get('/:pumpID/adafruit/state', getPumpAdafruitState);

//Turn on / off a pump
/**
 * @swagger
 * /api/pump/{pumpID}/adafruit/state:
 *   put:
 *     summary: Turn on / off a pump through Adafruit IO
 *     tags: ["Pump"]
 *     parameters:
 *       - in: path
 *         name: pumpID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID máy bơm
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [state, userID]
 *             properties:
 *               state:
 *                 type: string
 *                 enum: [on, off, auto]
 *                 example: "on"
 *     responses:
 *       200:
 *         description: Đã cập nhật máy bơm sang trạng thái mới
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy máy bơm
 *       500:
 *         description: Lỗi server
 */
router.put('/:pumpID/adafruit/state', setPumpAdafruitState);

module.exports = router;
