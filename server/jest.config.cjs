module.exports = {
  testEnvironment: "node",
  rootDir: ".",
  testRegex: ".*spec\\.ts$",
  transform: {
    "^.+\\.ts$": ["ts-jest", { tsconfig: "tsconfig.spec.json" }],
  },
  moduleFileExtensions: ["ts", "js", "json"],
  testTimeout: 30000,
  maxWorkers: 1,
}
