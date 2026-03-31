const reactNativeConfig = require('@react-native/eslint-config/flat');
const {defineConfig} = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const cypressPlugin = require('eslint-plugin-cypress/flat');
const testingLibraryPlugin = require('eslint-plugin-testing-library');

// eslint-config-expo and @react-native/eslint-config both define react/react-hooks plugins
// but as different instances. Remap @react-native config to reuse expo's plugin instances.
const expoPlugins = Object.fromEntries(
  expoConfig.flatMap(c => (c.plugins ? Object.entries(c.plugins) : [])),
);
const remappedReactNativeConfig = reactNativeConfig.map(c => {
  if (!c.plugins) return c;
  const remappedPlugins = {};
  for (const [name, plugin] of Object.entries(c.plugins)) {
    remappedPlugins[name] = expoPlugins[name] ?? plugin;
  }
  return {...c, plugins: remappedPlugins};
});

module.exports = defineConfig([
  ...expoConfig,
  ...remappedReactNativeConfig,
  {
    // ft-flow plugin is not compatible with ESLint 9 (uses removed context.getAllComments API).
    // This project uses TypeScript, not Flow, so these rules are disabled.
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
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
  // Add cypress globals (matching the original env: { 'cypress/globals': true })
  cypressPlugin.configs.globals,
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
