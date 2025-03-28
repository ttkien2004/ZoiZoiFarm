require("dotenv").config();
const axios = require("axios");

const axiosClient = axios.create({
	baseURL: `https://io.adafruit.com/api/v2/${process.env.AIO_USERNAME}/feeds`,
	timeout: 10000,
	headers: {
		"Content-Type": "application/json",
		Accept: "application/json",
		"X-AIO-Key": process.env.AIO_KEY,
	},
});

module.exports = axiosClient;
