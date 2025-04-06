const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error.message);
    return false;
  }
}

function createEnvFile() {
  const envExample = path.join(__dirname, '..', '.env.example');
  const envFile = path.join(__dirname, '..', '.env');
  const envTestFile = path.join(__dirname, '..', '.env.test');

  if (!fs.existsSync(envFile)) {
    console.log('Creating .env file...');
    fs.copyFileSync(envExample, envFile);
  }

  if (!fs.existsSync(envTestFile)) {
    console.log('Creating .env.test file...');
    fs.copyFileSync(envExample, envTestFile);
  }
}

function setupGitHooks() {
  const hooksDir = path.join(__dirname, '..', '.git', 'hooks');
  const preCommitFile = path.join(hooksDir, 'pre-commit');

  if (!fs.existsSync(preCommitFile)) {
    console.log('Setting up git hooks...');
    const preCommitContent = `#!/bin/sh
npm run test:unit
`;
    fs.writeFileSync(preCommitFile, preCommitContent);
    fs.chmodSync(preCommitFile, '755');
  }
}

function main() {
  console.log('Setting up development environment...');

  // Create environment files
  createEnvFile();

  // Install dependencies
  console.log('Installing dependencies...');
  if (!runCommand('npm install')) {
    console.error('Failed to install dependencies');
    process.exit(1);
  }

  // Install client dependencies
  console.log('Installing client dependencies...');
  if (!runCommand('cd client && npm install')) {
    console.error('Failed to install client dependencies');
    process.exit(1);
  }

  // Setup git hooks
  setupGitHooks();

  // Run tests
  console.log('Running tests...');
  if (!runCommand('npm test')) {
    console.error('Tests failed');
    process.exit(1);
  }

  console.log('\nDevelopment environment setup complete!');
  console.log('\nTo start development:');
  console.log('1. Start MongoDB');
  console.log('2. Run `npm run dev` for backend');
  console.log('3. Run `npm run client` for frontend');
  console.log('4. Or run `npm run dev:full` for both');
}

main(); 