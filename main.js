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
const port = process.env.PORT | 3000;
app.listen(port, () => {
	console.log("Listening to port 3000");
});
