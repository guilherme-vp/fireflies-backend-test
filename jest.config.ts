import type { Config } from "jest";

const config: Config = {
	testEnvironment: "node",
	transform: {
		"^.+.tsx?$": ["ts-jest", {}],
	},
	clearMocks: true,
	collectCoverage: true,
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	collectCoverageFrom: ["<rootDir>/src/**/*"],
	coveragePathIgnorePatterns: [
		"<rootDir>/src/config/",
		"<rootDir>/src/constants",
		"<rootDir>/src/errors",
		"<rootDir>/src/types/",
	],
};

export default config;
