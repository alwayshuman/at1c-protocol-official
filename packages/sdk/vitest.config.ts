import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    alias: {
      '../src/crypto': '../dist/src/crypto.js',
    }
  },
})
