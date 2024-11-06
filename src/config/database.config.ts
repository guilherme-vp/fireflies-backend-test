interface MongoSettings {
	url: string;
	database: string;
}

interface DatabaseSettings {
	mongo: MongoSettings;
}

export const databaseSettings: DatabaseSettings = {
	mongo: {
		url: process.env.MONGO_URL ?? "mongodb://localhost:27017",
		database: process.env.MONGO_DATABASE ?? "meetingbot",
	},
};
