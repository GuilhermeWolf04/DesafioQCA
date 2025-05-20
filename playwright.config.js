const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: '.',
  timeout: 300 * 1000,
  retries: 1,
  use: {
    headless: false,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'off',
    screenshot: 'only-on-failure',
    baseURL: 'https://cidades.ibge.gov.br',
  },
  reporter: [['list'], ['html', { outputFolder: 'playwright-report' }]],
});
