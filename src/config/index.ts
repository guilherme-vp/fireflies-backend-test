import { databaseSettings } from "./database.config";
import { serverSettings } from "./server.config";

export const settings = {
	...databaseSettings,
	...serverSettings,
};
