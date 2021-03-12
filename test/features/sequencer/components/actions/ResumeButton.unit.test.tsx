import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { OkOrUnhandledResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import ResumeButton from '../../../../../src/features/sequencer/components/actions/ResumeButton'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'
describe('Resume button', () => {
  const obsMode = 'ESW.DarkNight'
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService

  const tests: [string, OkOrUnhandledResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      'Successfully resumed sequencer'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot pause sequencer if in Idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to resume sequencer, reason: Cannot pause sequencer if in Idle state'
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname}`, async () => {
      when(sequencerService.resume()).thenResolve(response)

      renderWithAuth({
        ui: <ResumeButton obsMode={obsMode} />,
        mockClients: mockServices.serviceFactoryContext
      })

      const resumeButton = screen.getByRole('button', {
        name: 'Resume'
      }) as HTMLButtonElement

      await waitFor(() => expect(resumeButton.disabled).false)

      userEvent.click(resumeButton, { button: 0 })

      await screen.findByText(message)

      verify(sequencerService.resume()).called()

      expect(screen.queryByRole(message)).to.null
    })
  })
})
