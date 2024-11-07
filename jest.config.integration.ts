import type { Config } from "@jest/types";

import baseConfig from "./jest.config";

const config: Config.InitialOptions = {
	...baseConfig,
	testMatch: [
		"<rootDir>/{src,test}/**/?(*.)integration.test.?(*.){js,jsx,ts,tsx}",
	],
	collectCoverage: true,
	coverageDirectory: "coverage/integration",
};

export default config;
