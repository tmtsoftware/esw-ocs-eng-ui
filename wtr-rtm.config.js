import { importMapsPlugin } from '@web/dev-server-import-maps'
import { defaultReporter } from '@web/test-runner'
import vite from 'vite-web-test-runner-plugin'
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
  reporters: [defaultReporter({ reportTestResults: true, reportTestProgress: true }), ConsoleReporter(), RTMReporter()],
  coverageConfig: {
    threshold: { statements: 90, branches: 85, functions: 64, lines: 90 }
  }
}
