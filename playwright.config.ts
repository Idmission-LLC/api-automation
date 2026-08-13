import { defineConfig } from '@playwright/test';
import * as dotenv from 'dotenv';
import path from 'path';

// Load environment specific .env file if it exists, fallback to default .env
const environment = process.env.ENV || 'QA';
dotenv.config({ path: path.resolve(__dirname, `.env.${environment}`) });
dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',
  timeout: 60000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 4 : undefined,
  reporter: [
    ['list'],
    ['json', { outputFile: 'test-results.json' }],
    ['allure-playwright', {
      detail: true,
      outputFolder: 'allure-results',
      suiteTitle: false
    }]
  ],
  use: {
    // Base URL is typically dynamically assigned per environment, but we define global fallbacks here if necessary
    extraHTTPHeaders: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'API Tests',
      testMatch: /.*\.spec\.ts/,
    }
  ],
});
