const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const argon = require("argon2");
const jwt = require("jsonwebtoken");

//Sign up
exports.signupService = async (username, password) => {
  if (!username || !password) {
    throw new Error("All fields must be filled");
  }
  const existed = await prisma.user.findUnique({
    where: { userName: username },
  });
  if (existed) {
    throw new Error("Username has existed");
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
};

//Login
exports.loginService = async (username, password) => {
  if (!username || !password) {
    throw new Error("All fields must be filled");
  }
  const existed = await prisma.user.findUnique({
    where: { userName: username },
    select: {
      userID: true,
      userName: true,
      password: true,
    },
  });
  if (!existed) {
    throw new Error("Username has not existed");
  }

  const match = await argon.verify(existed.password, password);
  if (!match) {
    throw new Error("Password is not correct");
  }

  return existed; 
};

//Token
exports.generateToken = (userID) => {
  const secretKey = process.env.JWT_SECRET || "secret123";
  const token = jwt.sign({ userID }, secretKey, { expiresIn: "1d" });
  return token;
};

//Get user information
exports.getMeService = async (userID) => {
  const user = await prisma.user.findUnique({
    where: { userID },
    select: {
      userName: true,
      password: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNum: true,
    },
  });
  return user;
};

//Update user information
exports.updateMeService = async (userID, { firstName, lastName, phoneNum, email }) => {
  const existingUser = await prisma.user.findUnique({
    where: { userID },
  });
  if (!existingUser) {
    throw new Error("User not found");
  }

  const updatedUser = await prisma.user.update({
    where: { userID },
    data: { firstName, lastName, phoneNum, email },
    select: {
      userName: true,
      email: true,
      firstName: true,
      lastName: true,
      phoneNum: true,
    },
  });
  return updatedUser;
};
