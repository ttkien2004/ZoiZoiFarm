const jwt = require("jsonwebtoken");
// const { PrismaClient } = require("@prisma/client");
// const prisma = new PrismaClient();

const createToken = () => {
	return "Hello token";
};
const loginUser = async (req, res) => {
	res.status(200).json({ msg: "Hello wrold!" });
};

const signupUser = async () => {
	res.status(200).json({ msg: "Hello signup" });
};

module.exports = {
	loginUser,
	signupUser,
};
