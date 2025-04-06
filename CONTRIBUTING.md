# Contributing to MCQ Test Management System

We love your input! We want to make contributing to the MCQ Test Management System as easy and transparent as possible, whether it's:

- Reporting a bug
- Discussing the current state of the code
- Submitting a fix
- Proposing new features
- Becoming a maintainer

## Development Process

We use GitHub to host code, to track issues and feature requests, as well as accept pull requests.

1. Fork the repo and create your branch from `main`
2. If you've added code that should be tested, add tests
3. If you've changed APIs, update the documentation
4. Ensure the test suite passes
5. Make sure your code lints
6. Issue that pull request!

## Local Development Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/mcq-test-management-system.git
cd mcq-test-management-system
```

2. Run the setup script:
```bash
npm run setup
```

This will:
- Install all dependencies
- Set up environment files
- Configure git hooks
- Run initial tests

3. Start the development servers:
```bash
# Start both frontend and backend
npm run dev:full

# Or start them separately:
npm run dev     # Backend only
npm run client  # Frontend only
```

## Testing

We use Jest for testing. To run tests:

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration
npm run test:api

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## Code Quality

We use ESLint and Prettier for code quality. To run linting:

```bash
# Check for linting issues
npm run lint

# Fix linting issues automatically
npm run lint:fix

# Format code with Prettier
npm run format
```

## Pull Request Process

1. Update the README.md with details of changes to the interface, if applicable
2. Update the documentation with details of any new features or changes
3. The PR will be merged once you have the sign-off of at least one maintainer
4. Make sure all tests pass and there are no linting errors

## Any contributions you make will be under the MIT Software License

In short, when you submit code changes, your submissions are understood to be under the same [MIT License](http://choosealicense.com/licenses/mit/) that covers the project. Feel free to contact the maintainers if that's a concern.

## Report bugs using GitHub's [issue tracker](https://github.com/yourusername/mcq-test-management-system/issues)

We use GitHub issues to track public bugs. Report a bug by [opening a new issue](https://github.com/yourusername/mcq-test-management-system/issues/new).

## Write bug reports with detail, background, and sample code

**Great Bug Reports** tend to have:

- A quick summary and/or background
- Steps to reproduce
  - Be specific!
  - Give sample code if you can
- What you expected would happen
- What actually happens
- Notes (possibly including why you think this might be happening, or stuff you tried that didn't work)

## License

By contributing, you agree that your contributions will be licensed under its MIT License. 