module.exports = {
    'verbose': true,
    'preset': 'ts-jest',
    'setupFiles': ['./tests/setup.ts'],
    'testEnvironment': 'node',
    'moduleFileExtensions': [
        'ts',
        'js',
    ],
    'testMatch': [
        '<rootDir>/tests/**/*.spec.{js,ts}',
    ],
    'moduleNameMapper': {
        '^@/(.*?)$': '<rootDir>/src/$1',
    },
    globals: {
        'ts-jest': {
            isolatedModules: true,
        },
    },
};
