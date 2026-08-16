import { defineConfig } from '@playwright/test'

export default defineConfig({

    testDir: './src/__tests__/e2e',

    use: {

        baseURL: 'http://localhost:3000',

        headless: true,

        screenshot: 'only-on-failure',

        video: 'retain-on-failure',

        trace: 'retain-on-failure',

    },

    webServer: {

        command: 'npm run dev',

        url: 'http://localhost:3000',

        reuseExistingServer: !process.env.CI,

    },

})