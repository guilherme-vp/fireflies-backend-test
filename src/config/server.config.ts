interface APISettings {
	port: number;
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
	},
};
