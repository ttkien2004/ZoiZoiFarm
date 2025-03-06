require("dotenv").config();
const express = require("express");
const cors = require("cors");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const app = express();
const routes = require("./routes");

app.use(cors());
app.use(express.json());

// All APIs needed
app.use(routes);
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

// Nothing
app.use("/", (req, res) => {
	res.status(200).json({ msg: "Hello world" });
});

// const port = process.env.PORT | 3000;
// Connect to database
app.listen(process.env.PORT, () => {
	console.log(`Listening to port ${process.env.PORT}`);
	// console.log(JSON.stringify(swaggerDocs, null, 2));
});
