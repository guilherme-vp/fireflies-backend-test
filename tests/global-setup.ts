import { MongoMemoryServer } from "mongodb-memory-server";
import config from "./database-config";

async function globalSetup() {
	if (config.Memory) {
		// Use existing mongodb-memory-server instance in global to avoid creating a new instance every
		// test suite
		const instance = await MongoMemoryServer.create();
		const uri = instance.getUri();
		// @ts-ignore - FIXME: (@guilherme-vp) ts-jest is not getting configs from tsconfig.json
		// erroring the compilation when reading global.__MONGOINSTANCE as any
		global.__MONGOINSTANCE = instance;
		process.env.MONGO_URL = uri.slice(0, uri.lastIndexOf("/"));
	} else {
		process.env.MONGO_URL = `mongodb://${config.IP}:${config.Port}`;
	}
}

export default globalSetup;
