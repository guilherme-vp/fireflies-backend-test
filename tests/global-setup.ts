import { MongoMemoryServer } from "mongodb-memory-server";
import config from "./database-config";

async function globalSetup() {
	if (config.Memory) {
		// Use existing mongodb-memory-server instance in global to avoid creating a new instance every
		// test suite
		const instance = await MongoMemoryServer.create();
		const uri = instance.getUri();
		global.__MONGOINSTANCE = instance;
		process.env.MONGO_URL = uri.slice(0, uri.lastIndexOf("/"));
	} else {
		process.env.MONGO_URL = `mongodb://${config.IP}:${config.Port}`;
	}
}

export default globalSetup;
