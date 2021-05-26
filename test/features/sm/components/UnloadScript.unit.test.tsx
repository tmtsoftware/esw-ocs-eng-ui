import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObsMode, Prefix, ShutdownSequencersResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { UnloadScript } from '../../../../src/features/sm/components/UnloadScript'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('UnloadScript Icon', () => {
  beforeEach(() => reset(mockServices.mock.smService))
  const obsMode = new ObsMode('DarkNight')
  const smService = mockServices.mock.smService
  const seqPrefix = new Prefix('ESW', obsMode.name)
  const tests: [string, ShutdownSequencersResponse, string][] = [
    [
      'success',
      {
        _type: 'Success'
      },
      'Successfully unloaded sequencer'
    ],
    [
      'locationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer component not found'
      },
      'Failed to unload sequencer, reason: Sequencer component not found'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'ShutdownSequencer message type is not supported in Processing state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to unload sequencer, reason: ShutdownSequencer message type is not supported in Processing state'
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'Unload message timed out'
      },
      'Failed to unload sequencer, reason: Unload message timed out'
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname} | ESW-447`, async () => {
      when(smService.shutdownSequencer('ESW', deepEqual(obsMode))).thenResolve(response)

      renderWithAuth({
        ui: <UnloadScript sequencerPrefix={seqPrefix} />
      })

      const unloadScriptButton = screen.getByRole('unloadScriptIcon') as HTMLButtonElement

      await waitFor(() => expect(unloadScriptButton.disabled).false)

      userEvent.click(unloadScriptButton, { button: 0 })

      // expect modal to be visible
      const modalTitle = await screen.findByText(`Do you want to unload the sequencer ${seqPrefix.toJSON()}?`)
      expect(modalTitle).to.exist

      const confirmButton = screen.getByRole('button', {
        name: /unload/i
      })
      userEvent.click(confirmButton)

      await screen.findByText(message)

      verify(smService.shutdownSequencer('ESW', deepEqual(obsMode))).called()
      await waitFor(
        () => expect(screen.queryByText(`Do you want to unload the sequencer ${seqPrefix.toJSON()}?`)).to.null
      )
    })
  })
})
