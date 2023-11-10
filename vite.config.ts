/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tsconfigPaths from 'vite-tsconfig-paths'
import {AppConfig} from './src/config/AppConfig.js'

// https://vitejs.dev/config https://vitest.dev/config
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: '.vitest/setup',
    include: ['test/**/*.test.{ts,tsx}']
  },
  server: {
    host: true,
    port: 9000
  },
  base: `./`,
  // optimizeDeps: {
  //   include: testDeps
  // },
  build: {
    outDir: AppConfig.applicationName,
    sourcemap: 'inline',
    rollupOptions: {
      input: ['./index.html']
    }
  },

})
