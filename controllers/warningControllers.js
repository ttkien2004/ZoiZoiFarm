const { PrismaClient } = require("@prisma/client");
// const { toInt } = require("validator");
const cron = require("node-cron");
const axios = require("axios");
const prisma = new PrismaClient();

const API_URL = "http://localhost:3000/api";
// Lấy hết warnings
const getAllWarnings = async (req, res) => {
	try {
		const warnings = await prisma.warning.findMany();
		console.log(warnings);
		if (warnings) {
			return res
				.status(200)
				.json({ msg: "get all warnings successfully", data: warnings });
		}
	} catch (err) {
		res.status(400).json({ msg: "get warnings failed" });
	}
};
// Tạo warning
const createWarning = async (req, res) => {
	const { message, sensorID, date } = req.body;
	console.log(message, sensorID, date);
	const parsedDate = new Date(date);
	try {
		const newWarning = await prisma.warning.create({
			data: {
				sensorID: sensorID,
				message: message,
				timeWarning: parsedDate,
			},
		});
		if (newWarning) {
			res
				.status(201)
				.json({ msg: "Create warning successfully", data: newWarning });
		}
	} catch (err) {
		console.log(err.message);
		res.status(400).json({ msg: "create warning failed", error: err.message });
	}
};
// Xóa warning
const deleteWarning = async (req, res) => {
	const { warningId } = req.query;
	console.log(req.query);
	const warningIdParsed = Number(warningId);
	try {
		const delWarning = await prisma.warning.delete({
			where: {
				warningID: warningIdParsed,
			},
		});
		if (delWarning) {
			res.status(200).json({ msg: "Delete warning successfully" });
		}
	} catch (err) {
		res.status(400).json({ msg: "delete warning failed" });
	}
};

const sendWarning = async () => {
	// Fetch all sensors
	const sensors = await prisma.sensor.findMany();
	try {
		for (const sensor of sensors) {
			const datas = await prisma.data.findMany({
				where: {
					sensorID: sensor.sensorID,
				},
			});
			for (const data of datas) {
				if (data.value > sensor.alertThreshold) {
					let message = "Thiết bị đã vượt mức cảnh báo";
					const res = await axios.post(`${API_URL}/api/warning/createWarning`, {
						sensorID: sensor.sensorID,
						message: message,
						timeWarning: "2025-03-14",
					});
					console.log("Warning created:", message);
				}
			}
		}
	} catch (err) {
		console.error("Error creating warning: ", err.message);
	}
};
// Schedule
cron.schedule("*/30 * * * * *", async () => {
	console.log("⏳ Calling createWarning API...");
	await sendWarning();
});

console.log("✅ Cron job started: Calls createWarning API every 2 minutes.");
module.exports = {
	getAllWarnings,
	createWarning,
	deleteWarning,
};
