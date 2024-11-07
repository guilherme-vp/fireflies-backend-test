import type { MongoMemoryServer } from "mongodb-memory-server";
import config from "./database-config";

async function globalTeardown() {
	if (config.Memory) {
		// Config to decide if an mongodb-memory-server instance should be used
		const instance: MongoMemoryServer = global.__MONGOINSTANCE;
		await instance.stop();
	}
}

export default globalTeardown;
