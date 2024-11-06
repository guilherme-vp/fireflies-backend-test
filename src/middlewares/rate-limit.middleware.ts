import { rateLimit } from "express-rate-limit";
import { settings } from "../config";

export const limiterMiddleware = rateLimit({
	windowMs: settings.security.rateLimit.windowMs,
	limit: settings.security.rateLimit.limit,
	standardHeaders: "draft-7", // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
});
