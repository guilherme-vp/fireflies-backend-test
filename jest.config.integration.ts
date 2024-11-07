import type { Config } from "@jest/types";

import baseConfig from "./jest.config";

const config: Config.InitialOptions = {
	...baseConfig,
	testMatch: ["<rootDir>/src/**/*.integration.test.(js|jsx|ts|tsx)"],
	collectCoverage: true,
	coverageDirectory: "coverage/integration",
	globalSetup: "<rootDir>/tests/global-setup.ts",
	globalTeardown: "<rootDir>/tests/global-teardown.ts",
	setupFilesAfterEnv: ["<rootDir>/tests/setup-file.ts"],
};

export default config;
