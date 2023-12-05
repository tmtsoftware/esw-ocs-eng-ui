/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import {AppConfig} from './src/config/AppConfig.js'

const testDeps =
  process.env.NODE_ENV === 'test'
    ? [
      '@testing-library/react',
      '@testing-library/user-event',
      'chai',
      '@typestrong/ts-mockito'
    ]
    : []

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    // environment: 'happy-dom',
    // environment: 'jsdom',
    setupFiles: '.vitest/setup',
    include: ['test/**/*.unit.test.{ts,tsx}'],
    browser: {
      enabled: true,
      name: 'chrome',
      headless: true,
    },
  },
  server: {
    host: true,
    port: 9000
  },
  base: `./`,
  optimizeDeps: {
    include: testDeps
  },
  build: {
    outDir: AppConfig.applicationName,
    sourcemap: 'inline',
    rollupOptions: {
      input: ['./index.html']
    }
  },

})
