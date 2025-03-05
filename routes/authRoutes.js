const express = require("express");
const { loginUser, signupUser } = require("../controllers/authControllers");

const route = express.Router();

route.post("/signup", signupUser);
route.post("/login", loginUser);

module.exports = route;
