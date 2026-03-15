module.exports = {
  root: true,
  extends: ['expo', '@react-native', 'eslint:recommended'],
  plugins: ['import', 'cypress'],
  env: {
    'cypress/globals': true,
  },
  rules: {
    'import/order': ['warn', {alphabetize: {order: 'asc'}}], // group and then alphabetize lines - https://github.com/benmosher/eslint-plugin-import/blob/master/docs/rules/order.md
    'no-duplicate-imports': 'error',
    quotes: ['error', 'single', {avoidEscape: true}], // single quote unless using interpolation
    'react/jsx-uses-react': 'off',
    'react/no-unstable-nested-components': ['warn', {allowAsProps: true}],
    'react/react-in-jsx-scope': 'off',
    'sort-imports': [
      'warn',
      {ignoreDeclarationSort: true, ignoreMemberSort: false},
    ], // alphabetize named imports - https://eslint.org/docs/rules/sort-imports
  },
  overrides: [
    {
      files: ['src/**/*.spec.js'],
      extends: ['plugin:testing-library/react'],
    },
  ],
};
