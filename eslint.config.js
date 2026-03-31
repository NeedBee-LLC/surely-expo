const {defineConfig} = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const cypressPlugin = require('eslint-plugin-cypress/flat');
const jestPlugin = require('eslint-plugin-jest');
const testingLibraryPlugin = require('eslint-plugin-testing-library');
const globals = require('globals');

module.exports = defineConfig([
  ...expoConfig,
  {
    rules: {
      // eslint-config-expo/flat newly enables this; was not active in legacy config
      'react/no-unescaped-entities': 'off',
      // eslint-config-expo/flat sets caughtErrors:'all'; old config defaulted to 'none'
      'no-unused-vars': [
        'warn',
        {
          vars: 'all',
          args: 'none',
          ignoreRestSiblings: true,
          caughtErrors: 'none',
        },
      ],
      'import/order': ['warn', {alphabetize: {order: 'asc'}}],
      'no-duplicate-imports': 'error',
      quotes: ['error', 'single', {avoidEscape: true}],
      'react/jsx-uses-react': 'off',
      'react/no-unstable-nested-components': ['warn', {allowAsProps: true}],
      'react/react-in-jsx-scope': 'off',
      'sort-imports': [
        'warn',
        {ignoreDeclarationSort: true, ignoreMemberSort: false},
      ],
    },
  },
  {
    files: [
      '**/*.{spec,test}.{js,ts,tsx}',
      '**/__{mocks,tests}__/**/*.{js,ts,tsx}',
    ],
    plugins: {jest: jestPlugin},
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'warn',
      'jest/no-identical-title': 'warn',
      'jest/valid-expect': 'warn',
    },
  },
  {
    files: ['cypress/**/*.js'],
    ...cypressPlugin.configs.globals,
  },
  {
    files: ['src/**/*.spec.js'],
    plugins: {
      'testing-library': testingLibraryPlugin,
    },
    rules: {
      ...testingLibraryPlugin.configs.react.rules,
    },
  },
]);
