import type { Config } from 'jest';

const config: Config = {
  moduleFileExtensions: ['js', 'json', 'ts'],
  rootDir: '.', // On part de la racine du projet
  testRegex: '.*\\.spec\\.ts$', // On ne cherche QUE les .spec.ts
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest', // On compile tout avec ts-jest
  },
  coverageDirectory: './coverage',
  testEnvironment: 'node',
  // On pointe explicitement src vers le dossier source
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    // Tests MVP: seulement les 3 services + imports nécessaires
    'src/auth/auth.service.ts',
    'src/books/books.service.ts',
    'src/user/user.service.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
