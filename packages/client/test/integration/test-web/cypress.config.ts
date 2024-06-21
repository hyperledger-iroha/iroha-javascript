import { defineConfig } from 'cypress'

// @ts-ignore
import createBundler from '@bahmutov/cypress-esbuild-preprocessor'

export default defineConfig({
  e2e: {
    setupNodeEvents(on, _config) {
      on('file:preprocessor', createBundler({}))
    },
    baseUrl: 'http://localhost:3000',
    supportFile: false,
  },
  fixturesFolder: false,
  video: false,
  screenshotOnRunFailure: false,
})
