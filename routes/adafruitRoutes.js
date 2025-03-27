// routes/adafruitRoutes.js
const express = require('express');
const router = express.Router();
const {fetchAndStoreTempData , fetchAndStoreHumdData , fetchAndStoreLuxData, fetchAndStoreSmoData , getPumpAdafruitState , setPumpAdafruitState} = require('../controllers/adafruitControllers');

// Lấy dữ liệu feed "TEMP" và lưu vào database
/**
 * @swagger
 * /api/adafruit/fetch-temp:
 *   get:
 *     summary: Get data from "TEMP" 
 *     description: Get data of "TEMP" feed from Adafruit
 *     tags: ["Adafruit"]
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công và lưu vào database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy dữ liệu và lưu vào database thành công!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi khi lấy hoặc lưu dữ liệu
 */
router.get("/fetch-temp", fetchAndStoreTempData);

// Lấy dữ liệu feed "HUMD" và lưu vào database

/**
 * @swagger
 * /api/adafruit/fetch-humd:
 *   get:
 *     summary: Get data from "HUMD" 
 *     description: Get data of "HUMD" feed from Adafruit
 *     tags: ["Adafruit"]
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công và lưu vào database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy dữ liệu và lưu vào database thành công!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi khi lấy hoặc lưu dữ liệu
 */
router.get('/fetch-humd', fetchAndStoreHumdData);

// Lấy dữ liệu feed "LUX" và lưu vào database
/**
 * @swagger
 * /api/adafruit/fetch-lux:
 *   get:
 *     summary: Get data from "LUX" 
 *     description: Get data of "LUX" feed from Adafruit
 *     tags: ["Adafruit"]
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công và lưu vào database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy dữ liệu và lưu vào database thành công!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi khi lấy hoặc lưu dữ liệu
 */
router.get('/fetch-lux', fetchAndStoreLuxData);

// Lấy dữ liệu feed "SOMO" và lưu vào database
/**
 * @swagger
 * /api/adafruit/fetch-somo:
 *   get:
 *     summary: Get data from "SOMO" 
 *     description: Get data of "SOMO" feed from Adafruit
 *     tags: ["Adafruit"]
 *     responses:
 *       200:
 *         description: Lấy dữ liệu thành công và lưu vào database
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Lấy dữ liệu và lưu vào database thành công!"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi khi lấy hoặc lưu dữ liệu
 */
router.get('/fetch-somo', fetchAndStoreSmoData);

// Lấy trạng thái máy bơm qua Adafruit
/**
 * @swagger
 * /api/adafruit/{pumpID}/adafruit/state:
 *   get:
 *     summary: Lấy trạng thái máy bơm từ Adafruit IO
 *     tags: ["Adafruit"]
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
 *       404:
 *         description: Không tìm thấy máy bơm
 *       500:
 *         description: Lỗi server
 */
router.get('/:pumpID/adafruit/state', getPumpAdafruitState);

// Đặt trạng thái máy bơm (on/off/auto) qua Adafruit
/**
 * @swagger
 * /api/adafruit/{pumpID}/adafruit/state:
 *   put:
 *     summary: Bật/tắt/auto máy bơm thông qua Adafruit IO
 *     tags: ["Adafruit"]
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
 *               userID:
 *                 type: integer
 *                 example: 1
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