import type { Config } from "@jest/types";

export default <Config.InitialOptions>{
  testEnvironment: "node",
  maxWorkers: 1,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/index.ts"],
  collectCoverage: true,
  passWithNoTests: true,
  transform: {
    "^.+\\.(js|ts)x?$": ["ts-jest", { tsconfig: "tsconfig.test.json" }],
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test))\\.(tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 120000,
};
