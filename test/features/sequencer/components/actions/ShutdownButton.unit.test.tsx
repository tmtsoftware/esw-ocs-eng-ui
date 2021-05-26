import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObsMode, ShutdownSequencersResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { ShutdownButton } from '../../../../../src/features/sequencer/components/actions/ShutdownButton'
import { mockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('Shutdown button for Sequencer ', () => {
  const obsMode = new ObsMode('ESW.DarkNight')
  const smService = mockServices.mock.smService

  const tests: [string, ShutdownSequencersResponse, string][] = [
    [
      'success',
      {
        _type: 'Success'
      },
      'ESW.DarkNight Observation has been shutdown and moved to Configurable.'
    ],
    [
      'locationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer location not found'
      },
      'Failed to shutdown Observation ESW.DarkNight, reason: Sequencer location not found'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Shutdown message type is not supported in Processing state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to shutdown Observation ESW.DarkNight, reason: Shutdown message type is not supported in Processing state'
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'Shutdown message timed out'
      },
      'Failed to shutdown Observation ESW.DarkNight, reason: Shutdown message timed out'
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    const modalMessage = 'Do you want to shutdown Observation ESW.DarkNight?'
    it(`should return ${testname} | ESW-454, ESW-507`, async () => {
      when(smService.shutdownObsModeSequencers(deepEqual(obsMode))).thenResolve(response)

      renderWithAuth({
        ui: <ShutdownButton obsMode={obsMode} />
      })

      const shutdownButton = screen.getByRole('button', {
        name: 'Shutdown'
      }) as HTMLButtonElement

      await waitFor(() => expect(shutdownButton.disabled).false)

      userEvent.click(shutdownButton, { button: 0 })

      // expect modal to be visible
      const modalTitle = await screen.findByText(modalMessage)
      expect(modalTitle).to.exist
      const modalDocument = screen.getByRole('document')
      const modalShutdownButton = within(modalDocument).getByRole('button', {
        name: 'Shutdown'
      })

      userEvent.click(modalShutdownButton)
      await screen.findByText(message)

      verify(smService.shutdownObsModeSequencers(deepEqual(obsMode))).called()

      await waitFor(() => expect(screen.queryByText(modalMessage)).to.not.exist)
    })
  })
})
