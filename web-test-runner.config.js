import plugin from '@snowpack/web-test-runner-plugin'
import { importMapsPlugin } from '@web/dev-server-import-maps'
import { defaultReporter } from '@web/test-runner'
// eslint-disable-next-line import/no-unresolved
import vite from 'vite-web-test-runner-plugin'
import ConsoleReporter from './ConsoleReporter.js'

// NODE_ENV=test - Needed by "@snowpack/web-test-runner-plugin"
process.env.NODE_ENV = 'test'
console.log('process.logs', process.env.ESW_OCS_ENG_UI_LOGS)
export default {
  testFramework: {
    config: {
      timeout: '3000'
    }
  },
  plugins: [
    vite(),
    importMapsPlugin({
      inject: {
        importMap: {
          imports: {
            './dist/features/sequencer/hooks/useSequencerService.js': './dist_test/mocks/useSequencerService.js',
            './dist/contexts/ConfigServiceContext.js': './dist_test/mocks/ConfigServiceContext.js'
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
