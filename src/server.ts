import expressApp from "./app";
import { settings } from "./config";
import { logger } from "./utils/logger.util";
import { connectMongoDB } from "./database";

// Initiates all databases before starting the Express server
connectMongoDB().then(() => {
	expressApp.listen(settings.app.port, async () => {
		logger.info(`Server is running on port ${settings.app.port}`);
	});
});
