import mongoose from "mongoose";
import { settings } from "../config";
import { logger } from "../utils";

mongoose.connect(`${settings.mongo.url}/${settings.mongo.database}`);

mongoose.connection.on("connected", () => {
	logger.info("Connected to MongoDB");
});

mongoose.connection.on("error", (err: unknown) => {
	logger.error(`Error connecting to MongoDB: ${err}`);
});

export default mongoose;
