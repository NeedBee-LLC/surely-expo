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
    files: ['**/*.spec.js'],
    plugins: {jest: jestPlugin, 'testing-library': testingLibraryPlugin},
    languageOptions: {
      globals: globals.jest,
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'warn',
      'jest/no-identical-title': 'warn',
      'jest/valid-expect': 'warn',
      ...testingLibraryPlugin.configs.react.rules,
    },
  },
  {
    files: ['cypress/**/*.js'],
    ...cypressPlugin.configs.globals,
  },
]);
