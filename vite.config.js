import react from '@vitejs/plugin-react'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import { defineConfig } from 'vite'
import { AppConfig } from './src/config/AppConfig.js'

// https://vitejs.dev/config/
const testDeps =
  process.env.NODE_ENV === 'development'
    ? [
        '@testing-library/react',
        '@testing-library/user-event',
        'chai',
        '@typestrong/ts-mockito',
        '@testing-library/react-hooks/dom'
      ]
    : []
export default defineConfig({
  server: {
    host: true,
    port: 9000
  },
  base: `./`,
  optimizeDeps: {
    include: testDeps
  },
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
        additionalData: '@root-entry-name: default;',
      },
    },
  },
  build: {
    outDir: AppConfig.applicationName,
    // sourcemap: 'inline',
    sourcemap: true,
    rollupOptions: {
      input: ['./index.html'],
      onLog(level, log, handler) {
        if (log.cause && log.cause.message === `Can't resolve original location of error.`) {
          return
        }
        handler(level, log)
      }
    }
  },
  plugins: [react(), nodePolyfills()]
})
