import { importMapsPlugin } from '@web/dev-server-import-maps'
import { defaultReporter } from '@web/test-runner'
import { vitePlugin } from '@remcovaes/web-test-runner-vite-plugin';
// eslint-disable-next-line import/no-unresolved
import ConsoleReporter from './ConsoleReporter.js'
process.env.NODE_ENV = 'test'
console.log('process.logs', process.env.ESW_OCS_ENG_UI_LOGS)
export default {
  // concurrency: 1,
  testFramework: {
    config: {
      timeout: '3000'
    }
  },
  plugins: [
    vitePlugin(),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            // this path needs to be absolute url whatever browser trys to load. cannot be relative path. prod file path: mocked file path
            'http://localhost:9000/src/features/sequencer/hooks/useSequencerService.ts':
              'http://localhost:9000/test/mocks/useSequencerService.ts',
            'http://localhost:9000/src/contexts/ConfigServiceContext.tsx':
              'http://localhost:9000/test/mocks/ConfigServiceContext.tsx'
          }
        }
      }
    })
  ],
  testRunnerHtml: (testFramework) => `
    <html>
      <head>
        <script type="module">
          // Note: globals expected by @testing-library/react
          window.global = window;
          window.process = { env: {} };
          // Note: adapted from https://github.com/vitejs/vite/issues/1984#issuecomment-778289660
          // Note: without this you'll run into https://github.com/vitejs/vite-plugin-react/pull/11#discussion_r430879201
          window.__vite_plugin_react_preamble_installed__ = true;
        </script>
        <script type="module" src="${testFramework}"></script>
      </head>
    </html>
  `,
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true }), ConsoleReporter()],
  browserLogs: Boolean(process.env.ESW_OCS_ENG_UI_LOGS)
}
