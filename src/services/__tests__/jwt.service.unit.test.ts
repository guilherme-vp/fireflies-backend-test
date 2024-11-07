import { JWTService } from "../jwt.service";
import jwt from "jsonwebtoken";
import { settings } from "../../config";

jest.mock("jsonwebtoken", () => ({
	sign: jest.fn(),
	verify: jest.fn(),
}));

describe("JWTService", () => {
	const jwtService = new JWTService();
	const userId = "test-user-id";
	const payload = { userId };
	const token = "mock-jwt-token";
	const decodedPayload = { userId };

	describe("generate", () => {
		it("should generate a JWT token", () => {
			(jwt.sign as jest.Mock).mockReturnValueOnce(token);

			const result = jwtService.generate(payload);

			expect(jwt.sign).toHaveBeenCalledWith(
				payload,
				settings.security.authentication.jwtSecret,
				{
					expiresIn: settings.security.authentication.expirationMs,
				},
			);

			expect(result).toEqual(token);
		});

		it("should throw an error if jwt.sign fails", () => {
			(jwt.sign as jest.Mock).mockImplementationOnce(() => {
				throw new Error("JWT signing error");
			});

			expect(() => jwtService.generate(payload)).toThrow("JWT signing error");
		});
	});

	describe("verifyToken", () => {
		it("should verify a JWT token and return the decoded payload", () => {
			(jwt.verify as jest.Mock).mockReturnValueOnce(decodedPayload);

			const result = jwtService.verifyToken(token);

			expect(jwt.verify).toHaveBeenCalledWith(
				token,
				settings.security.authentication.jwtSecret,
			);
			expect(result).toEqual(decodedPayload);
		});

		it("should throw an error if jwt.verify fails", () => {
			(jwt.verify as jest.Mock).mockImplementationOnce(() => {
				throw new Error("JWT verification error");
			});

			expect(() => jwtService.verifyToken(token)).toThrow(
				"JWT verification error",
			);
		});
	});
});
