const { spawn } = require('child_process');
const path = require('path');

// Configuration options
const configs = {
  unit: {
    testMatch: ['**/tests/unit/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage/unit'
  },
  integration: {
    testMatch: ['**/tests/integration/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage/integration'
  },
  api: {
    testMatch: ['**/tests/api/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage/api'
  },
  all: {
    testMatch: ['**/tests/**/*.test.js'],
    collectCoverage: true,
    coverageDirectory: 'coverage'
  }
};

function runTests(config) {
  const args = [
    '--config',
    path.join(__dirname, '../jest.config.js'),
    '--testMatch',
    config.testMatch,
    '--detectOpenHandles'
  ];

  if (config.collectCoverage) {
    args.push(
      '--coverage',
      '--coverageDirectory',
      config.coverageDirectory
    );
  }

  const testProcess = spawn('jest', args, {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'test'
    }
  });

  testProcess.on('close', (code) => {
    process.exit(code);
  });
}

// Get test type from command line arguments
const testType = process.argv[2] || 'all';
const config = configs[testType];

if (!config) {
  console.error(`Invalid test type: ${testType}`);
  console.error('Available types:', Object.keys(configs).join(', '));
  process.exit(1);
}

console.log(`Running ${testType} tests...`);
runTests(config); 