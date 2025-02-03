import { defineConfig } from 'vitest/config'
import AllureReporter from 'allure-vitest/reporter'

export default defineConfig({
  test: {
    // watch: false,
    reporters: [
      // 'basic',
      // This is for Compatibility Matrix tests
      // https://allurereport.org/docs/vitest-reference/
      // new AllureReporter({}),
    ],
    // poolOptions: {
    //   threads: {
    //     // singleThread: true,
    //   },
    // },
    setupFiles: ['test/setup.ts'],
    testTimeout: 300_000_000,
  },
})
