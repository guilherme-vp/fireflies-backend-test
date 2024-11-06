import jwt from "jsonwebtoken";
import { settings } from "../config";

const SECRET_KEY = settings.security.authentication.jwtSecret;

export class JWTService {
	verifyToken = (token: string) => {
		return jwt.verify(token, SECRET_KEY);
	};
}
