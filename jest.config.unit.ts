import type { Config } from "@jest/types";

import baseConfig from "./jest.config";

const config: Config.InitialOptions = {
	...baseConfig,
	testMatch: ["<rootDir>/{src,test}/**/?(*.)unit.test.?(*.){js,jsx,ts,tsx}"],
	collectCoverage: true,
	coverageDirectory: "coverage/unit",
};

export default config;
