/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/*.test.ts'],
  // Map .js imports to their .ts source files (needed because services use ESM-style .js imports)
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  collectCoverageFrom: ['src/**/*.ts', '!src/__tests__/**', '!src/index.ts'],
  coverageThreshold: {
    global: { branches: 60, functions: 70, lines: 70, statements: 70 },
  },
};
