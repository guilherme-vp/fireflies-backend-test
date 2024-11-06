type Environment = "development" | "production";

interface APISettings {
	port: number;
	environment: Environment;
}

interface RateLimitSettings {
	windowMs: number;
	limit: number;
}

interface AuthenticationSettings {
	jwtSecret: string; // Secret key used for signing JWTs
}

interface SecuritySettings {
	rateLimit: RateLimitSettings;
	authentication: AuthenticationSettings;
}

interface ServerSettings {
	app: APISettings;
	security: SecuritySettings;
}

export const serverSettings: ServerSettings = {
	app: {
		port:
			process.env.PORT && !Number.isNaN(process.env.PORT)
				? Number(process.env.PORT)
				: 3000,
		environment: (process.env.NODE_ENV as Environment) || "development",
	},
	security: {
		rateLimit: {
			windowMs: 15 * 60 * 1000, // 15 minutes,
			limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
		},
		authentication: {
			jwtSecret: process.env.JWT_SECRET ?? "fireflies-key",
		},
	},
};
