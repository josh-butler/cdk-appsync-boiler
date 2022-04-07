module.exports = {
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['ts', 'js'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testMatch: ['**/test/**/*.[jt]s?(x)'],
  testPathIgnorePatterns: ['dist/', 'build/'],
  testEnvironment: 'node',
};
