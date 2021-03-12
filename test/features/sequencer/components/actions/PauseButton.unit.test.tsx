import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PauseResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import PauseButton from '../../../../../src/features/sequencer/components/actions/PauseButton'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'
describe('Pause button', () => {
  const obsMode = 'ESW.DarkNight'
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService

  const tests: [string, PauseResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      'Successfully paused sequencer.'
    ],
    [
      'CannotOperateOnAnInFlightOrFinishedStep',
      {
        _type: 'CannotOperateOnAnInFlightOrFinishedStep'
      },
      'Failed to pause sequencer, reason: Cannot operate on in progress or finished step'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot pause sequencer if in Idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to pause sequencer, reason: Cannot operate on in progress or finished step'
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname}`, async () => {
      when(sequencerService.pause()).thenResolve(response)

      renderWithAuth({
        ui: <PauseButton obsMode={obsMode} />,
        mockClients: mockServices.serviceFactoryContext
      })

      const pauseButton = screen.getByRole('button', {
        name: 'Pause'
      }) as HTMLButtonElement

      await waitFor(() => expect(pauseButton.disabled).false)

      userEvent.click(pauseButton, { button: 0 })

      await screen.findByText(message)

      verify(sequencerService.pause()).called()

      expect(screen.queryByRole(message)).to.null
    })
  })
})
