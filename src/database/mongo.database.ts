import mongoose from "mongoose";
import { settings } from "../config";

mongoose.connect(`${settings.mongo.url}/${settings.mongo.database}`);

mongoose.connection.on("connected", () => {
	console.log("Connected to MongoDB");
});

mongoose.connection.on("error", (err: unknown) => {
	console.error(`Error connecting to MongoDB: ${err}`);
});

export default mongoose;
