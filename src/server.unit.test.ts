import { connectMongoDB } from "./database";
import { settings } from "./config";
import { logger } from "./utils/logger.util";
import expressApp from "./app";

jest.mock("./database", () => ({
	connectMongoDB: jest.fn(),
}));

jest.mock("./utils", () => ({
	logger: {
		info: jest.fn(),
		error: jest.fn(),
	},
}));

jest.mock("./app", () => ({
	listen: jest.fn(() =>
		logger.info(`Server is running on port ${settings.app.port}`),
	),
}));

describe("Server initialization", () => {
	beforeEach(() => {
		(connectMongoDB as jest.Mock).mockResolvedValueOnce(true);
	});

	it("should start the server after a successful MongoDB connection", async () => {
		await import("./server");

		expect(connectMongoDB).toHaveBeenCalledTimes(1);
		expect(expressApp.listen).toHaveBeenCalledTimes(1);
		expect(expressApp.listen).toHaveBeenCalledWith(
			settings.app.port,
			expect.any(Function),
		);
		expect(logger.info).toHaveBeenCalledWith(
			`Server is running on port ${settings.app.port}`,
		);
	});

	it("should handle MongoDB connection failure gracefully", async () => {
		(connectMongoDB as jest.Mock).mockRejectedValueOnce(
			new Error("MongoDB connection failed"),
		);

		try {
			await import("./server");
		} catch (error) {
			expect(logger.error).toHaveBeenCalledWith(
				"MongoDB connection failed",
				error,
			);
		}
	});
});
