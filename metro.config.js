// Learn more https://docs.expo.io/guides/customizing-metro
const {getDefaultConfig} = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
const baseSourceExts = [...config.resolver.sourceExts, 'cjs'];

module.exports = {
  ...config,
  resolver: {
    ...config.resolver,
    sourceExts:
      process.env.MOCK_API === 'true'
        ? ['mock.js', ...baseSourceExts]
        : baseSourceExts,
  },
};
