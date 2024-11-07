import expressApp from "./app";
import { settings } from "./config";
import { logger } from "./utils/logger.util";
import { connectMongoDB, disconnectMongoDB } from "./database";
import type { Server } from "node:http";

let server: Server;
export const gracefulShutdown = async () => {
	logger.info("Starting graceful shutdown...");
	if (server.listening) {
		server.close((err) => {
			if (err) {
				logger.error("Error shutting down the server:", err);
				process.exit(1);
			}
			logger.info("HTTP server closed.");
		});
	}
	try {
		await disconnectMongoDB();
		logger.info("MongoDB connection closed.");
	} catch (error) {
		logger.error("Error closing MongoDB connection:", error);
	}
	process.exit(0);
};

// Initiates all databases before starting the Express server
connectMongoDB().then(() => {
	server = expressApp.listen(settings.app.port, async () => {
		logger.info(`Server is running on port ${settings.app.port}`);
	});
});

process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);
