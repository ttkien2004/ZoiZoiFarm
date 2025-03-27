const express = require('express');
const router = express.Router();
const {fetchAndStoreTempData , fetchAndStoreHumdData , fetchAndStoreLuxData, fetchAndStoreSmoData } = require('../controllers/adafruitControllers');

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
 *                       id: 
 *                         type: string
 *                         example: 0FV3TZEFNZN2MVV35SDNB97YD6
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       feed_id:  
 *                         type: int
 *                         example: 3013555 
 *                       feed_key:  
 *                         type: string
 *                         example: temp
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       created_epoch:
 *                         type: int
 *                         example: 1742451397
 *                       expiration:
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
 *                       id: 
 *                         type: string
 *                         example: 0FV3TZEFNZN2MVV35SDNB97YD6
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       feed_id:  
 *                         type: int
 *                         example: 3013555 
 *                       feed_key:  
 *                         type: string
 *                         example: temp
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       created_epoch:
 *                         type: int
 *                         example: 1742451397
 *                       expiration:
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
 *                       id: 
 *                         type: string
 *                         example: 0FV3TZEFNZN2MVV35SDNB97YD6
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       feed_id:  
 *                         type: int
 *                         example: 3013555 
 *                       feed_key:  
 *                         type: string
 *                         example: temp
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       created_epoch:
 *                         type: int
 *                         example: 1742451397
 *                       expiration:
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
 *                       id: 
 *                         type: string
 *                         example: 0FV3TZEFNZN2MVV35SDNB97YD6
 *                       value:
 *                         type: number
 *                         example: 24.5
 *                       feed_id:  
 *                         type: int
 *                         example: 3013555 
 *                       feed_key:  
 *                         type: string
 *                         example: temp
 *                       created_at:
 *                         type: string
 *                         format: date-time
 *                       created_epoch:
 *                         type: int
 *                         example: 1742451397
 *                       expiration:
 *                         type: string
 *                         format: date-time
 *       500:
 *         description: Lỗi khi lấy hoặc lưu dữ liệu
 */
router.get('/fetch-somo', fetchAndStoreSmoData);

module.exports = router;