const express = require('express');
const { toggleLedState, addLight, getLightStatus, setLedAdafruitState, getLedAdafruitState } = require('../controllers/lightControllers');
const router = express.Router();

/**
 * @swagger
 * /api/light:
 *   post:
 *     summary: Add a new LED light
 *     description: Add a new LED light device into the system and log the action in controls.
 *     tags: ["Light"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [deviceName, status, state, userID]
 *             properties:
 *               deviceName:
 *                 type: string
 *                 example: "Đèn LED số 1"
 *               status:
 *                 type: string
 *                 enum: [able, disable]
 *                 example: "able"
 *               state:
 *                 type: string
 *                 enum: [on, off]
 *                 example: "off"
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Successfully added LED light and logged in controls.
 *       400:
 *         description: Missing required fields.
 *       500:
 *         description: Internal server error.
 */

router.post("/", addLight);

// /**
//  * @swagger
//  * /api/light/{lightID}/state:
//  *   put:
//  *     summary: Update LED light state
//  *     description: Change the state of a specific LED light (on/off).
//  *     tags: ["Light"]
//  *     parameters:
//  *       - in: path
//  *         name: lightID
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the LED light to update
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
//  *                 enum: [on, off]
//  *                 example: "on"
//  *               userID:
//  *                 type: integer
//  *                 example: 1
//  *     responses:
//  *       200:
//  *         description: Successfully updated LED light state
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 message:
//  *                   type: string
//  *                   example: "Đã cập nhật trạng thái đèn LED thành công!"
//  *                 led:
//  *                   type: object
//  *                   properties:
//  *                     lightID:
//  *                       type: integer
//  *                     state:
//  *                       type: string
//  *                       example: "on"
//  *       400:
//  *         description: Invalid input data
//  *       500:
//  *         description: Internal server error
//  */
// router.put('/:lightID/state', toggleLedState);

// /**
//  * @swagger
//  * /api/light/{lightID}/status:
//  *   get:
//  *     summary: Get current LED light status
//  *     description: Retrieve the current state of an LED light.
//  *     tags: ["Light"]
//  *     parameters:
//  *       - in: path
//  *         name: lightID
//  *         required: true
//  *         schema:
//  *           type: integer
//  *         description: ID of the LED light to retrieve status
//  *     responses:
//  *       200:
//  *         description: Successfully retrieved LED light status
//  *         content:
//  *           application/json:
//  *             schema:
//  *               type: object
//  *               properties:
//  *                 lightID:
//  *                   type: integer
//  *                   example: 2
//  *                 deviceID:
//  *                   type: integer
//  *                   example: 2
//  *                 state:
//  *                   type: string
//  *                   example: off
//  *       404:
//  *         description: LED light not found
//  *       500:
//  *         description: Internal server error
//  */
// router.get('/:lightID/status', getLightStatus);

/**
 * @swagger
 * /api/light/{lightID}/adafruit/state:
 *   put:
 *     summary: Change the state of a specific LED light (on/off).
 *     tags: ["Light"]
 *     parameters:
 *       - in: path
 *         name: lightID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đèn LED
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
 *                 enum: [on, off]
 *                 example: "on"
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Đã cập nhật đèn LED sang trạng thái mới
 *       400:
 *         description: Trạng thái không hợp lệ
 *       404:
 *         description: Không tìm thấy LED
 *       500:
 *         description: Lỗi server
 */
router.put("/:lightID/adafruit/state", setLedAdafruitState);

/**
 * @swagger
 * /api/light/{lightID}/adafruit/state:
 *   get:
 *     summary: Get state of led from Adafruit IO
 *     tags: ["Light"]
 *     parameters:
 *       - in: path
 *         name: lightID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID của đèn LED
 *     responses:
 *       200:
 *         description: Trạng thái LED (on/off)
 *       404:
 *         description: Không tìm thấy LED
 *       500:
 *         description: Lỗi server
 */
router.get("/:lightID/adafruit/state", getLedAdafruitState);

module.exports = router;
