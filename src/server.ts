import expressApp from "./app";
import { settings } from "./config";
import { logger } from "./utils";

expressApp.on("ready", () => {
	expressApp.listen(settings.app.port, async () => {
		logger.info(`Server is running on port ${settings.app.port}`);
	});
});

// Initiates all databases before starting the Express server
await import("./database").then(() => {
	expressApp.emit("ready");
});
