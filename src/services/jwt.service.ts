import jwt from "jsonwebtoken";
import { settings } from "../config";

const SECRET_KEY = settings.security.authentication.jwtSecret;

export class JWTService {
	generate = (payload: object) => {
		return jwt.sign(payload, SECRET_KEY, {
			expiresIn: settings.security.authentication.expirationMs,
		});
	};

	verifyToken = (token: string) => {
		return jwt.verify(token, SECRET_KEY);
	};
}
