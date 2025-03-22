require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
// const routes = require("./routes");
const authRoutes = require("./routes/authRoutes");
const pumpRoutes = require("./routes/pumpRoutes");
const lightRoutes = require("./routes/lightRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const sensorRoutes = require("./routes/sensorRoutes");
const warningRoutes = require("./routes/warningRoutes");
// MQTT connect
const mqtt = require("mqtt");
const axios = require("axios");
const client = mqtt.connect(`mqtt://io.adafruit.com`, {
	username: process.env.AIO_USERNAME,
	password: process.env.AIO_KEY,
});
const axiosClient = require("./axiosConfig/axiosConfig");
// const swaggerSpec = swaggerJsdoc(swaggerOptions);
// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(cors());
app.use(express.json());

// All APIs needed
// app.use(routes);
// Swagger configuration
const swaggerOptions = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "ZoiZoi Farm API",
			version: "1.0.0",
			description: "API documentation for my Node.js app",
		},
		servers: [
			{
				url: "http://localhost:3000",
				description: "Local server",
			},
		],
	},
	apis: ["./routes/*.js"], // Path to the API docs
};
// Initialize swagger
const swaggerDocs = swaggerJsdoc(swaggerOptions);
// Swagger
app.use("/api-docs", (req, res, next) => {
	console.log("Swagger UI accessed");
	next();
});
app.use(
	"/api-docs",
	swaggerUi.serve,
	swaggerUi.setup(swaggerDocs, { explorer: true })
);

// For authentication
app.use("/api/auth", authRoutes);

// For controlPump
app.use("/api/pump", pumpRoutes);

// For controlLight
app.use("/api/light", lightRoutes);

// For device
app.use("/api/device", deviceRoutes);

// For sensor
app.use("/api/sensor", sensorRoutes);

// For warning
app.use("/api/warning", warningRoutes);

// Connect to adafruit
client.on("connect", () => {
	console.log("Connect successful");
	client.subscribe(
		`${process.env.AIO_USERNAME}/feeds/${process.env.FEED_NAME}`
	);
});
// let pumpData = null;
// client.on("message", (topic, message) => {
// 	console.log(`Dữ liệu mới từ ${topic}: ${message.toString()}`);
// 	pumpData = message.toString();
// });
app.get("/api/getmaybom", async (req, res) => {
	try {
		const pumpData = await axiosClient.get(`/${process.env.MAYBOM_FEED}/data`);
		if (pumpData) {
			// console.log(pumpData.data);
			return res.status(200).json(pumpData.data);
		}
	} catch (err) {
		console.err(err);
		return res.status(400).json({ error: "Get not get the data" });
	}
});
app.get("/api/getled", async (req, res) => {
	const { id } = req.query;
	console.log(id);
	try {
		const pumpData = await axiosClient.get(`/${process.env.LED_FEED}/data`);
		if (pumpData) {
			// console.log(pumpData.data);
			console.log(pumpData.data);
			return res.status(200).json(pumpData.data);
		}
	} catch (err) {
		console.err(err);
		return res.status(400).json({ error: "Get not get the data" });
	}
});

app.use("/", (req, res) => {
	res.status(200).json({ msg: "Hello world" });
});
// const port = process.env.PORT | 3000;
// Connect to database
app.listen(process.env.PORT, () => {
	console.log(`Listening to port ${process.env.PORT}`);
	// console.log(JSON.stringify(swaggerDocs, null, 2));
});
