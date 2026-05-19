import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // On part de la racine du projet
  testRegex: '.*\\.spec\\.ts$', // On ne cherche QUE les .spec.ts
  transform: {
    '^.+\\.(t|j)s$': ['ts-jest', { tsconfig: 'tsconfig.spec.json' }],
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  // On pointe explicitement src vers le dossier source
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    // Coverage focused on essential features
    // (instruction: “test plan covering the project's main features”)
    'src/auth/auth.service.ts',
    'src/books/books.service.ts',
    'src/user/user.service.ts',
    // Security guards (AuthGuard + JsonContentTypeGuard against CSRF)
    'src/auth/auth.guard.ts',
    'src/security/content-type/content-type.guard.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
