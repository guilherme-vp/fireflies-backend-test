type Environment = "development" | "production";

interface APISettings {
	port: number;
	environment: Environment;
}

interface ServerSettings {
	app: APISettings;
}

export const serverSettings: ServerSettings = {
	app: {
		port:
			process.env.PORT && !Number.isNaN(process.env.PORT)
				? Number(process.env.PORT)
				: 3000,
		environment: (process.env.NODE_ENV as Environment) || "development",
	},
};
