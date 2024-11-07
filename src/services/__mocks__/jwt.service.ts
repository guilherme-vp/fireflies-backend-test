export class JWTService {
	generate = (payload: string) => {
		return `mockToken.${Buffer.from(JSON.stringify(payload)).toString("base64")}.mockSignature`;
	};

	verifyToken = (token: string) => {
		const [, payloadBase64] = token.split(".");
		if (!payloadBase64) throw new Error("Invalid token");

		const payloadJson = Buffer.from(payloadBase64, "base64").toString("utf-8");
		return JSON.parse(payloadJson);
	};
}
