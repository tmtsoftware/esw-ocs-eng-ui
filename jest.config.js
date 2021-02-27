const esModules = ['@tmtsoftware/esw-ts']
module.exports = {
  roots: ['<rootDir>/src', '<rootDir>/test'],
  preset: 'ts-jest',
  runner: 'jest-electron/runner',
  testEnvironment: 'jest-electron/environment',
  testRegex: ['(/(test)/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$'],
  testPathIgnorePatterns: ['test/utils/*'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src', 'test'],
  transformIgnorePatterns: [`/node_modules/(?!${esModules})`],
  verbose: true,
  moduleNameMapper: {
    '\\.(css|sass|jpg|jpeg|png|svg|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/test/__mocks__/fileMocks.ts'
  },
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 85,
      lines: 90,
      statements: 90
    }
  },
  coveragePathIgnorePatterns: ['/node_modules/', 'test/utils/']
}
