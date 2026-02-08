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
    '^src/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    // ! permet d'ignorer un fichier pour le coverage
    'src/**/*.ts',
    '!src/**/*.module.ts',
    '!src/**/*.dto.ts',
    '!src/main.ts',
    '!src/db/schema.ts',
    '!src/seed.ts',
  ],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
};

export default config;
