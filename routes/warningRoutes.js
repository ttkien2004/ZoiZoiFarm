const express = require("express");
const router = express.Router();
const {
	getAllWarnings,
	createWarning,
	deleteWarning,
} = require("../controllers/warningControllers");
const { requireAuth } = require("../middleware/middleware")
// Setup Swagger

/**
 * @swagger
 * /api/warning/createWarning:
 *   post:
 *     summary: Create new warning message
 *     description: Create a new warning with message for sensors.
 *     tags: ["Warning"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               sensorID:
 *                 type: integer
 *                 example: 2
 *               message:
 *                 type: string
 *                 example: hello sensor
 *               date:
 *                 type: string
 *                 example: 2025-04-14
 *     responses:
 *       201:
 *         description: Create new warning successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Get warnings successfully"
 *                 data:
 *                     type: object
 *                     properties:
 *                       warningID:
 *                         type: integer
 *                         example: 1
 *                       sensorID:
 *                         type: integer
 *                         example: 2
 *                       message:
 *                         type: string
 *                         example: "Sensor overheating!"
 *                       timeWarning:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-14T12:30:00.000Z"
 *       400:
 *         description: create warning failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "create warnings failed"
 */

/**
 * @swagger
 * /api/warning/getAll:
 *   get:
 *     summary: Retrieve all warning messages
 *     description: Get a list of all warnings for sensors.
 *     tags:
 *       - Warning
 *     responses:
 *       200:
 *         description: Get warnings successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Get warnings successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       warningID:
 *                         type: integer
 *                         example: 1
 *                       sensorID:
 *                         type: integer
 *                         example: 2
 *                       message:
 *                         type: string
 *                         example: "Sensor overheating!"
 *                       timeWarning:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-04-14T12:30:00.000Z"
 *       400:
 *         description: Get warnings failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Get warnings failed"
 */

/**
 * @swagger
 * /api/delete/deleteWarning:
 *   delete:
 *     summary: Create new warning message
 *     description: Create a new warning with a message for sensors.
 *     tags: ["Warning"]
 *     parameters:
 *       - in: query
 *         name: warningID
 *         required: true
 *         schema:
 *           type: integer
 *         description: The ID of the sensor
 *         example: 2
 *     responses:
 *       200:
 *         description: delete warning successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Delete warning successfully"
 *       400:
 *         description: delete warning failed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 msg:
 *                   type: string
 *                   example: "Delete warning failed"
 */
// Lấy hết warning
router.get("/getAll", requireAuth, getAllWarnings);
// Tạo warning mới
router.post("/createWarning", createWarning);
// Xóa warning
router.delete("/deleteWarning", deleteWarning);

module.exports = router;
