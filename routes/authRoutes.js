const express = require("express");
const { loginUser, signupUser } = require("../controllers/authControllers");

const route = express.Router();

/**
 * @swagger
 * tags:
 *   - name: "Authentication"
 *     description: "Endpoints related to user authentication"
 *
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     description: Create a new user account with the provided details.
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
 *  tags:
 *   - name: "Authentication"
 *     description: "Endpoints related to user authentication"
 *
 * /api/auth/login:
 *   post:
 *     summary: Login to page
 *     description: Create a new user account with the provided details.
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

route.post("/signup", signupUser);
route.post("/login", loginUser);

module.exports = route;
