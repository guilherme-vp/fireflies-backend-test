import mongoose from "mongoose";
import { settings } from "../config";
import { logger } from "../utils/logger.util";

export async function connectMongoDB() {
	try {
		await mongoose.connect(`${settings.mongo.url}/${settings.mongo.database}`);
		logger.info("Connected to MongoDB");
	} catch (err) {
		logger.error("Error connecting to MongoDB. Exiting...", err);
		process.emit("SIGINT");
	}
}

export async function disconnectMongoDB() {
	await mongoose.disconnect();
	logger.info("Disconnected to MongoDB");
}

export default mongoose;
