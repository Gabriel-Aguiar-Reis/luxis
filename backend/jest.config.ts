import type { Config } from 'jest'

const config: Config = {
  testEnvironment: 'node',
  moduleFileExtensions: ['ts', 'js', 'json'],
  testMatch: [
    '**/test/**/unit/**/*.spec.ts',
    '**/test/**/integration/**/*.spec.ts',
    '**/test/**/e2e/**/*.spec.ts'
  ],
  transform: {
    '^.+\\.[tj]sx?$': [
      '@swc/jest',
      {
        jsc: {
          parser: {
            syntax: 'typescript',
            decorators: true,
            dynamicImport: true
          },
          transform: {
            decoratorMetadata: true,
            legacyDecorator: true
          },
          target: 'es2022'
        },
        module: {
          type: 'commonjs'
        }
      }
    ]
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  transformIgnorePatterns: ['/node_modules/(?!@nestjs/)'],
  rootDir: '.'
}
export default config
