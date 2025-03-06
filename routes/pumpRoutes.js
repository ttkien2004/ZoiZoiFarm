const express = require('express');
const { togglePumpState, addPump } = require('../controllers/pumpControllers');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Pump"
 *     description: "Endpoints related to Pump control"
 *
 * /api/pump:
 *   post:
 *     summary: Add new pump
 *     description: Add a new pump device into the system.
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
 *               quantity:
 *                 type: integer
 *                 example: 2
 *               status:
 *                 type: string
 *                 enum: [able, disable]
 *                 example: "able"
 *               autoLevel:
 *                 type: boolean
 *                 example: true
 *               schedule:
 *                 type: string
 *                 example: "06:00,18:00"
 *               state:
 *                 type: string
 *                 enum: [on, off, auto]
 *                 example: "auto"
 *     responses:
 *       201:
 *         description: Successfully added pump
 *       400:
 *         description: Invalid input data
 *       500:
 *         description: Internal server error
 */

router.post("/", addPump);

/**
 * @swagger
 * /api/pump/{pumpID}/state:
 *   put:
 *     summary: Update pump state
 *     description: Change the state of a pump (on/off/auto).
 *     tags: ["Pump"]
 *     parameters:
 *       - in: path
 *         name: pumpID
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the pump to update
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
 *               userID:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       2000:
 *         description: Successfully updated pump state
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Đã cập nhật trạng thái máy bơm thành công!"
 *                 pump:
 *                   type: object
 *                   properties:
 *                     pumpID:
 *                       type: integer
 *                     deviceID:
 *                       type: integer
 *                     autoLevel:
 *                       type: boolean
 *                     schedule:
 *                       type: string
 *                       nullable: true
 *                     state:
 *                       type: string
 *                       example: "on"
 *       400:
 *         description: Invalid state input
 *       500:
 *         description: Internal server error
 */
router.put('/:pumpID/state', togglePumpState);


module.exports = router;
