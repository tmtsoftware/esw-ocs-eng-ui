import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import { AppConfig } from './src/config/AppConfig.js'
// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 9000
  },
  base: `./`,
  build: {
    outDir: AppConfig.applicationName,
    sourcemap: 'inline'
  },
  plugins: [reactRefresh()]
})
