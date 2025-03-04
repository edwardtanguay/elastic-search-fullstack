import express from "express";
import axios from "axios";
import https from "https";
import { flashcardRouter } from "./routers/flashcardRouter";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

export const app = express();
app.use(cors());
app.use(express.json());

const elastic_url = process.env.ELASTIC_URL;
const elastic_port = Number(process.env.ELASTIC_PORT);
const elastic_username = process.env.ELASTIC_USERNAME;
const elastic_password = process.env.ELASTIC_PASSWORD;

app.get("/", (_req, res) => {
	res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Info Site</title>
    </head>
    <body>
        <h1>Info Site</h1>
        <p>Version: <strong>1.1</strong></p>
    </body>
    </html>
  `);
});

app.get("/api/images", async (_req, res) => {
	try {
		const response = await axios.get(
			`${elastic_url}:${elastic_port}/_cat/indices?v`,
			{
				auth: {
					username: elastic_username || "",
					password: elastic_password || "",
				},
				httpsAgent: new https.Agent({
					rejectUnauthorized: false,
				}),
			}
		);

		// Process the response to extract only index names
		const indexes = response.data
			.split("\n") // Split by new lines
			.filter((line: string) => line.trim()) // Remove empty lines
			.map((line: string) => line.split(/\s+/)[2]); // Get the index name (3rd column)

		res.json({ indexes });
	} catch (error: unknown) {
		res.status(500).json({
			error:
				error instanceof Error
					? error.message
					: "An unknown error occurred",
		});
	}
});

app.get("/api/index/:indexName", async (req, res) => {
	const { indexName } = req.params; // Get index name from URL parameters
	console.log(`Fetching data from index: ${indexName}`);

	try {
		const response = await axios.get(
			`${elastic_url}:${elastic_port}/${indexName}/_search`, // Specify the index and search
			{
				auth: {
					username: elastic_username || "",
					password: elastic_password || "",
				},
				httpsAgent: new https.Agent({
					rejectUnauthorized: false, // Bypass self-signed cert errors (dev only)
				}),
				params: {
					// You can include query parameters here to filter or limit the data
					size: 10, // Example: limit to the first 10 documents
				},
			}
		);

		res.json(response.data); // Return the search results
	} catch (error: unknown) {
		res.status(500).json({
			error:
				error instanceof Error
					? error.message
					: "An unknown error occurred",
		});
	}
});

app.use("/api/flashcards", flashcardRouter);
