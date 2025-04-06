module.exports = {
  // The test environment that will be used for testing
  testEnvironment: 'node',

  // The glob patterns Jest uses to detect test files
  testMatch: [
    '**/tests/**/*.test.js'
  ],

  // An array of regexp pattern strings that are matched against all test paths
  testPathIgnorePatterns: [
    '/node_modules/',
    '/coverage/'
  ],

  // An array of regexp pattern strings that are matched against all source file paths
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/tests/'
  ],

  // A list of paths to directories that Jest should use to search for files in
  roots: [
    '<rootDir>/src',
    '<rootDir>/tests'
  ],

  // The maximum amount of workers used to run your tests
  maxWorkers: '50%',

  // Indicates whether each individual test should be reported during the run
  verbose: true,

  // Automatically clear mock calls and instances between every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // The directory where Jest should output its coverage files
  coverageDirectory: 'coverage',

  // An array of regexp pattern strings used to skip coverage collection
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/coverage/',
    '/tests/'
  ],

  // A list of reporter names that Jest uses when writing coverage reports
  coverageReporters: [
    'json',
    'text',
    'lcov',
    'clover'
  ],

  // An object that configures minimum threshold enforcement for coverage results
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },

  // Setup files to run before each test
  setupFiles: [
    '<rootDir>/tests/setup.js'
  ],

  // The test environment options that will be passed to the testEnvironment
  testEnvironmentOptions: {
    url: 'http://localhost:5001'
  }
}; 