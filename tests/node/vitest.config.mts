import { defineConfig } from 'vitest/config'
// import AllureReporter from 'allure-vitest/reporter'

export default defineConfig({
  test: {
    reporters: [
      // 'basic',
      // This is for Compatibility Matrix tests
      // https://allurereport.org/docs/vitest-reference/
      // new AllureReporter({}),
    ],
    setupFiles: ['tests/setup.ts'],
  },
})
