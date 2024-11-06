import helmet from "helmet";

export const helmetMiddleware = helmet({
	contentSecurityPolicy: {
		useDefaults: true, // use default settings for all helders
	},
});
