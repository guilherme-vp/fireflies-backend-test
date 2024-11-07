import type { MongoMemoryServer } from "mongodb-memory-server";
import config from "./database-config";

async function globalTeardown() {
	if (config.Memory) {
		// @ts-ignore - FIXME: (@guilherme-vp) ts-jest is not getting configs from tsconfig.json
		// erroring the compilation when reading global.__MONGOINSTANCE as any
		const instance: MongoMemoryServer = global.__MONGOINSTANCE;
		await instance.stop();
	}
}

export default globalTeardown;
