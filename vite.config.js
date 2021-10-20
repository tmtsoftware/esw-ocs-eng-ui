import reactRefresh from '@vitejs/plugin-react-refresh'
import { defineConfig } from 'vite'
import { AppConfig } from './src/config/AppConfig.js'
// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: AppConfig.applicationName
  },
  plugins: [reactRefresh()]
})
