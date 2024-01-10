import { importMapsPlugin } from '@web/dev-server-import-maps'
import { defaultReporter } from '@web/test-runner'
import { vitePlugin } from '@remcovaes/web-test-runner-vite-plugin';
// eslint-disable-next-line import/no-unresolved
import ConsoleReporter from './ConsoleReporter.js'
// eslint-disable-next-line import/no-unresolved
import { RTMReporter } from './dist/test/utils/RTMReporter.js'
process.env.NODE_ENV = 'test'

export default {
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
            '/src/features/sequencer/hooks/useSequencerService.ts':
              '/test/mocks/useSequencerService.ts',
            '/src/contexts/ConfigServiceContext.tsx':
              '/test/mocks/ConfigServiceContext.tsx'
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
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true }), ConsoleReporter(), RTMReporter()],
  coverageConfig: {
    include: ['src/**/*.{ts,tsx}'],
    threshold: { statements: 90, branches: 80, functions: 64, lines: 90 }
  }
}
