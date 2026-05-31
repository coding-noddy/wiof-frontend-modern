import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  timeout: 90 * 1000,
  expect: {
    timeout: 10 * 1000,
  },
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4200',
    headless: true,
    viewport: { width: 1280, height: 800 },
    actionTimeout: 15 * 1000,
    ignoreHTTPSErrors: true,
  },
  webServer: {
    command: 'npm run start',
    url: 'http://127.0.0.1:4200',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
