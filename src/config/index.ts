import { databaseSettings } from "./database.config";
import { serverSettings } from "./server.config";
import { AISettings } from "./ai.config";

export const settings = {
	...databaseSettings,
	...serverSettings,
	...AISettings,
};
