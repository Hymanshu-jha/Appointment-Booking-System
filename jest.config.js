export default {
  testEnvironment: "node",

  testMatch: ["**/tests/backend_tests/**/*.test.js"],

  /**
   * 🔑 THIS IS THE FIX
   * Tell Jest to also look inside backend/node_modules
   */
  moduleDirectories: [
    "node_modules",
    "backend/node_modules"
  ],

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

  collectCoverage: true,
  coverageDirectory: "coverage"
};
