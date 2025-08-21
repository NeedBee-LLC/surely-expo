const {defineConfig} = require('cypress');

module.exports = defineConfig({
  chromeWebSecurity: false,
  video: false,
  e2e: {
    baseUrl: 'http://localhost:8081',
    experimentalRunAllSpecs: true,
  },
});
