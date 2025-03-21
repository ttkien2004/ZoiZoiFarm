const { PrismaClient } = require("@prisma/client");
// const { toInt } = require("validator");
const prisma = new PrismaClient();

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
module.exports = {
	getAllWarnings,
	createWarning,
	deleteWarning,
};
