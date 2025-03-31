const { signupService, loginService, generateToken, getMeService, updateMeService } = require("../services/authService");
  
//Register a new user
exports.signupUser = async (req, res) => {
	const { username, password } = req.body;
	try {
		const user = await signupService(username, password);
		return res.status(201).json({
		msg: "Signup successfully",
		username: user.userName,
		});
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
};
  
//Login
exports.loginUser = async (req, res) => {
	const { username, password } = req.body;
	try {
	  const user = await loginService(username, password);
	  const token = generateToken(user.userID);
	  res.status(201).json({
		msg: "Login successfully",
		username: user.userName,
		userID: user.userID,
		token,
	  });
	} catch (err) {
	  return res.status(400).json({ error: err.message });
	}
};
  
//Get information of a user
exports.getMe = async (req, res) => {
	try {
	  const userID = req.userID; 
	  const user = await getMeService(userID);
	  if (!user) {
		return res.status(404).json({ error: "User not found" });
	  }
	  res.status(200).json({ user });
	} catch (error) {
	  console.error(error);
	  res.status(500).json({ error: "Lỗi server" });
	}
};
  
//Update information
exports.updateMe = async (req, res) => {
	try {
	  const userID = req.userID; // Từ middleware
	  const { firstName, lastName, phoneNum, email } = req.body;
	  const updatedUser = await updateMeService(userID, { firstName, lastName, phoneNum, email });
	  res.status(200).json({
		message: "Cập nhật thông tin cá nhân thành công!",
		user: updatedUser,
	  });
	} catch (error) {
	  if (error.message === "User not found") {
		return res.status(404).json({ error: error.message });
	  }
	  console.error(error);
	  res.status(500).json({ error: "Lỗi server", detail: error.message });
	}
};
  