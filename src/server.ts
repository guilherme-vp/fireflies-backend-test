import expressApp from "./app";
import { settings } from "./config";

expressApp.on("ready", () => {
	expressApp.listen(settings.app.port, async () => {
		console.log(`Server is running on port ${settings.app.port}`);
	});
});

// Initiates all databases before starting the Express server
await import("./database").then(() => {
	expressApp.emit("ready");
});
