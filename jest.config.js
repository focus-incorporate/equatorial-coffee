/**
 * Jest configuration for Equatorial Coffee Website
 * 
 * Production-ready testing setup with proper module resolution,
 * coverage reporting, and environment setup.
 */

const nextJest = require('next/jest');

// Providing the path to your Next.js app which will enable loading next.config.js and .env files
const createJestConfig = nextJest({
  dir: './',
});

// Custom Jest configuration
const customJestConfig = {
  // Setup tests environment as jsdom (browser-like)
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  
  // Test environment for component testing
  testEnvironment: 'jest-environment-jsdom',
  
  // Handle asset file mocks
  moduleNameMapper: {
    // Handle asset imports (with CSS modules)
    '\\.(jpg|jpeg|png|gif|webp|svg)$': '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    // Handle module aliases
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  
  // Coverage configuration - enforce high standards
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
    '!src/pages/_*.{js,jsx,ts,tsx}',
    '!**/*.config.js',
    '!**/node_modules/**',
  ],
  
  // Coverage thresholds - ensure quality
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 85,
      statements: 85,
    },
  },
  
  // Test patterns
  testMatch: [
    '**/__tests__/**/*.test.[jt]s?(x)',
  ],
  
  // Transform
  transform: {
    // Use babel-jest for JS/TS files
    '^.+\\.(js|jsx|ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
    // Handle image imports
    '^.+\\.(png|jpg|jpeg|gif|webp|avif|ico|bmp)$': '<rootDir>/__mocks__/fileMock.js',
  },
  
  // Custom reporters
  reporters: [
    'default',
    [
      'jest-junit',
      {
        outputDirectory: 'coverage/junit',
        outputName: 'jest-junit.xml',
        classNameTemplate: '{classname}',
        titleTemplate: '{title}',
      },
    ],
  ],
};

// Export the config
module.exports = createJestConfig(customJestConfig);
