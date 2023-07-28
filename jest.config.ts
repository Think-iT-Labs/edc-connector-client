import type { Config } from "@jest/types";

export default <Config.InitialOptions> {
  testEnvironment: "node",
  collectCoverageFrom: [
    "src/**/*.ts",
    "!src/**/index.ts",
  ],
  collectCoverage: true,
  passWithNoTests: true,
  transform: {
    "^.+\\.(js|ts)x?$": "ts-jest",
  },
  testRegex: "(/__tests__/.*|(\\.|/)(test))\\.(tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  testTimeout: 30000,
};
