const jwt = require("jsonwebtoken");
const { PrismaClient } = require("@prisma/client");
const argon = require("argon2");
const validate = require("validator");
const prisma = new PrismaClient();

const createToken = () => {
	return "Hello token";
};

async function signup(username, password) {
	if (!username || !password) {
		throw Error("All fields must be filled");
	}
	const existed = await prisma.user.findUnique({
		where: {
			userName: username,
		},
	});
	if (existed) {
		throw Error("Username has existed");
	}
	const hash = await argon.hash(password, { hashLength: 40 });
	const new_user = await prisma.user.create({
		data: {
			userName: username,
			password: hash,
		},
		select: {
			userName: true,
		},
	});
	return new_user;
}
async function login(username, password) {
	if (!username || !password) {
		throw Error("All fields must be filled");
	}
	const existed = await prisma.user.findUnique({
		where: {
			userName: username,
		},
		select: {
			userName: true,
			password: true,
		},
	});
	if (!existed) {
		throw Error("Username has not existed");
	}
	const match = await argon.verify(existed.password, password);
	if (!match) {
		throw Error("Password is not correct");
	}
	return existed;
}
const loginUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await login(username, password);
		res.status(201).json({ msg: "Login successfully", username });
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};

const signupUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await signup(username, password);
		res.status(201).json({ msg: "Signup successfully", username });
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};

module.exports = {
	loginUser,
	signupUser,
};
