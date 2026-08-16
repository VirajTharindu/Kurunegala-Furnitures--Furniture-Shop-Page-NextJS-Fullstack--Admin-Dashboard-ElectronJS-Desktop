import type { Config } from "jest";
import nextJest from 'next/jest';

const createJestConfig = nextJest({
    dir: './'
});

const config: Config = {
    testEnvironment: 'jsdom',
    setupFiles: ['<rootDir>/jest.polyfills.js'],
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^d3$': '<rootDir>/node_modules/d3/dist/d3.min.js',
        '^@azure/identity$': '<rootDir>/node_modules/@azure/identity/dist/commonjs/index.js',
    },
    testMatch: [
        '**/__tests__/**/*.test.ts',
        '**/__tests__/**/*.test.tsx',
    ],
    forceExit: true,
    openHandlesTimeout: 1000,
    collectCoverage: true,
    collectCoverageFrom: [
        'src/**/*.{js,jsx,ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/__tests__/**',
        '!src/**/mocks/**',
    ],
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov', 'html'],
};

export default createJestConfig(config);