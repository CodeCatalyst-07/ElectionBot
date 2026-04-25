/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src/__tests__'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss)$': '<rootDir>/src/__tests__/__mocks__/styleMock.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/__tests__/**',
    '!src/index.tsx',
    '!src/App.tsx',
  ],
};
