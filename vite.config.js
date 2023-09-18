import react from '@vitejs/plugin-react'
import {nodePolyfills} from 'vite-plugin-node-polyfills'
import {defineConfig} from 'vite'
import {AppConfig} from './src/config/AppConfig.js'

// https://vitejs.dev/config/
const testDeps =
  process.env.NODE_ENV === 'test'
    ? [
      '@testing-library/react',
      '@testing-library/user-event',
      'chai',
      'ts-mockito',
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
  build: {
    outDir: AppConfig.applicationName,
    sourcemap: 'inline',
    rollupOptions: {
      input: ['./index.html'],
      onwarn(warning, warn) {
        if (warning.code === 'MODULE_LEVEL_DIRECTIVE') {
          return
        }
        warn(warning)
      }
    }
  },
  plugins: [react(), nodePolyfills()]
})
