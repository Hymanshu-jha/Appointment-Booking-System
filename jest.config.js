export default {
  testEnvironment: "node",
  testMatch: ["**/tests/backend_tests/**/*.test.js"],
  clearMocks: true,

  reporters: [
    "default",
    [
      "jest-junit",
      {
        outputDirectory: ".",
        outputName: "junit.xml"
      }
    ]
  ],

  coverageDirectory: "coverage",
  collectCoverage: true
};
