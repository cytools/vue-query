module.exports = {
    'verbose': true,
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
    'preset': 'ts-jest',
};
