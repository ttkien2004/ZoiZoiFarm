const express = require("express");
const { loginUser, signupUser, getMe , updateMe} = require("../controllers/authControllers");
const { requireAuth } = require("../middleware/middleware");
const router = express.Router();

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with the provided details.
 *     tags: ["Authentication"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: Successfully registered user
 *       400:
 *         description: Invalid input data
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login to page
 *     description: Create a new user account with the provided details.
 *     tags: ["Authentication"]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: johndoe
 *               password:
 *                 type: string
 *                 example: strongpassword123
 *     responses:
 *       201:
 *         description: Successfully login
 *       400:
 *         description: Invalid input data
 */

router.post("/signup", signupUser);
router.post("/login", loginUser);

/**
 * @swagger
 * /api/auth/userInfor:
 *   get:
 *     summary: Get information of a user
 *     tags: ["Authentication"]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *       401:
 *         description: Unauthorized
 */
router.get("/userInfor", requireAuth, getMe);

/**
 * @swagger
 * /api/auth/userInfor:
 *   put:
 *     summary: Update information
 *     tags: ["Authentication"]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "Alice"
 *               lastName:
 *                 type: string
 *                 example: "Wonderland"
 *               phoneNum:
 *                 type: string
 *                 example: "0123456789"
 *               email:
 *                 type: string
 *                 example: "alice@example.com"
 *     responses:
 *       200:
 *         description: Cập nhật thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User không tồn tại
 */
router.put("/userInfor", requireAuth, updateMe);

module.exports = router;
