const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const argon = require("argon2");
const validate = require("validator");
const prisma = new PrismaClient();

exports.requireAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: "No token provided" });
    }

    const token = authHeader.split(" ")[1]; 
    if (!token) {
      return res.status(401).json({ error: "Invalid token format" });
    }

    const secretKey = process.env.JWT_SECRET || "secret123";
    const decoded = jwt.verify(token, secretKey);

    req.userID = decoded.userID;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized" });
  }
};

