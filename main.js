require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(cors());
app.use(express.json());

// For authentication
app.use("/api/auth", authRoutes);
// For services
app.use("/", (req, res) => {
	res.status(200).json({ msg: "Hello world" });
});
// const port = process.env.PORT | 3000;
// Connect to database
app.listen(process.env.PORT, () => {
	console.log(`Listening to port ${process.env.PORT}`);
});
