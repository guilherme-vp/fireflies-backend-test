import { JWTService } from "../services";

const script = (userId: string): string => {
	const jwtService = new JWTService();
	const token = jwtService.generate({ userId });
	return token;
};

const DEFAULT_USER_ID = "user1";

const userIdArg = process.argv.find((arg) => arg.includes("--userId"));
let userId = userIdArg?.replace(/\-\-userId\=/g, "");

if (!userId || userId.length === 0) {
	userId = DEFAULT_USER_ID;
	console.warn(
		"Warning: --userId argument is missing or empty. Using `user1` id as default.\n",
		"If you want to run the command for a specific user, try running again the command with:\n",
		'`npm run generate:jwt -- --userId="<the-user-id>"`\n',
	);
}
console.info("Generated JWT:\n", script(userId));
