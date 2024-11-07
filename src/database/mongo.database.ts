import mongoose from "mongoose";
import { settings } from "../config";
import { logger } from "../utils";

export async function connectMongoDB() {
	try {
		await mongoose.connect(`${settings.mongo.url}/${settings.mongo.database}`);
		logger.info("Connected to MongoDB");
	} catch (err) {
		logger.error("Error connecting to MongoDB. Exiting...", err);
		process.exit(1);
	}
}

export default mongoose;
