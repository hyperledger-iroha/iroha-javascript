import { defineConfig } from 'vitest/config'
import deno from '@deno/vite-plugin'

export default defineConfig({
  plugins: [deno()],
  test: {
    setupFiles: ['tests/setup.ts'],
    testTimeout: 10_000,
    retry: 2
  },
})
