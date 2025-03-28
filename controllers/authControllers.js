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
			userID: true,
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
		const secretKey = process.env.JWT_SECRET || "secret123";
		const token = jwt.sign({ userID: user.userID }, secretKey, { expiresIn: "1d" });
		res.status(201).json({ msg: "Login successfully", username , userID: user.userID , token});
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

// GET user information 
const getMe = async (req, res) => {
	try {
	  const userID = req.userID;
	  const user = await prisma.user.findUnique({
		where: { userID },
		select: {
		  userID: true,
		  userName: true,
		  password: true,
		  email: true,
		  firstName: true,
		  lastName: true,
		  phoneNum: true,
		},
	  });
  
	  if (!user) {
		return res.status(404).json({ error: "User not found" });
	  }
  
	  res.status(200).json({ user });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: "Lỗi server" });
	}
  };

//Update information of useruser
const updateMe = async (req, res) => {
	try {
	  const userID = req.userID;
	  const { firstName, lastName, phoneNum, email } = req.body;
	  const existingUser = await prisma.user.findUnique({
		where: { userID },
	  });
	  if (!existingUser) {
		return res.status(404).json({ error: "User not found" });
	  }
	  const updatedUser = await prisma.user.update({
		where: { userID },
		data: {
		  firstName,
		  lastName,
		  phoneNum,
		  email,
		},
		select: {
		  userName: true,
		  email: true,
		  firstName: true,
		  lastName: true,
		  phoneNum: true,
		},
	  });
  
	  res.status(200).json({
		message: "Cập nhật thông tin cá nhân thành công!",
		user: updatedUser,
	  });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: "Lỗi server", detail: error.message });
	}
  };

module.exports = {
	loginUser,
	signupUser,
	getMe,
	updateMe
};



