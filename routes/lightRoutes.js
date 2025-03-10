const express = require('express');
const { toggleLedState, addLight, getLightStatus } = require('../controllers/lightControllers');

const router = express.Router();

/**
 * @swagger
 * /api/light/{lightID}/state:
 *   put:
 *     summary: Update LED light state
 *     description: Change the state of a specific LED light (on/off).
 *     tags: ["Light"]
 *     parameters:
 *       - in: path
 *         name: lightID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the LED light to update
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
 *         description: Successfully updated LED light state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã cập nhật trạng thái đèn LED thành công!"
 *                 led:
 *                   type: object
 *                   properties:
 *                     lightID:
 *                       type: integer
 *                     state:
 *                       type: string
 *                       example: "on"
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */
router.put('/:lightID/state', toggleLedState);


/**
 * @swagger
 * /api/light:
 *   post:
 *     summary: Add a new LED light
 *     description: Add a new LED light device into the system with a default quantity of 1.
 *     tags: ["Light"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *     responses:
 *       201:
 *         description: Successfully added LED light
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Thêm đèn LED mới thành công!"
 *                 led:
 *                   type: object
 *                 totalLeds:
 *                   type: integer
 *                   example: 10
 *       500:
 *         description: Internal server error
 */

// Định nghĩa route POST cho việc thêm đèn LED
router.post("/", addLight);

/**
 * @swagger
 * /api/light/{lightID}/status:
 *   get:
 *     summary: Get current LED light status
 *     description: Retrieve the current state of an LED light.
 *     tags: ["Light"]
 *     parameters:
 *       - in: path
 *         name: lightID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the LED light to retrieve status
 *     responses:
 *       200:
 *         description: Successfully retrieved LED light status
 *       404:
 *         description: LED light not found
 *       500:
 *         description: Internal server error
 */
router.get('/:lightID/status', getLightStatus);

module.exports = router;
