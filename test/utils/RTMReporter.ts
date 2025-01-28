import type { Reporter } from '@web/test-runner'
import * as fs from 'fs'
import * as path from 'path'
import { deleteFile, parseOutput, writeArrayToFile } from './ReporterUtils.js'

const args = process.argv.slice(2)

// default output path is pointing to top level RTM folder from dist/lib/testReporter.js
const outputFilePath = parseOutput(args) ?? './RTM/testStoryMapping.txt'
const cwd = path.resolve()
const OUTPUT_PATH = path.resolve(path.join(cwd, outputFilePath))

export const RTMReporter = ({ reportResults = true } = {}): Reporter => {
  return {
    start() {
      if (fs.existsSync(OUTPUT_PATH)) {
        deleteFile(OUTPUT_PATH)
      }
      console.log('Test started with RTM enabled')
    },

    stop() {
      if (fs.existsSync(OUTPUT_PATH)) {
        console.log('Successfully written test - story mapping.')
      }
    },

    /**
     * Called when results for a test file can be reported. This is called
     * when all browsers for a test file are finished, or when switching between
     * menus in watch mode.
     *
     * If your test results are calculated async, you should return a promise from
     * this function and use the logger to log test results. The test runner will
     * guard against race conditions when re-running tests in watch mode while reporting.
     *
     * @param logger the logger to use for logging tests
     * @param testFile the test file to report for
     * @param sessionsForTestFile the sessions for this test file. each browser is a
     * different session
     */
    async reportTestFileResults({ sessionsForTestFile }) {
      if (!reportResults) {
        return
      }
      const suiteResult = sessionsForTestFile[0]?.testResults?.suites[0]
      if (suiteResult) {
        writeArrayToFile(suiteResult, OUTPUT_PATH)
      }
    }
  }
}
