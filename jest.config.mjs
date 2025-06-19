export default {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['./jest.setup.js'],
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['js', 'jsx'],
  moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1'
}
};
