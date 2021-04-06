import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObsMode, ShutdownSequencersResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { ShutdownButton } from '../../../../../src/features/sequencer/components/actions/ShutdownButton'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'
describe('Shutdown button for Sequencer ', () => {
  const obsMode = new ObsMode('ESW.DarkNight')
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService

  const tests: [string, ShutdownSequencersResponse, string][] = [
    [
      'success',
      {
        _type: 'Success'
      },
      'Successfully shutdown sequencer'
    ],
    [
      'locationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer location not found'
      },
      'Failed to shutdown sequencer, reason: Sequencer location not found'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Shutdown message type is not supported in Processing state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to shutdown sequencer, reason: Shutdown message type is not supported in Processing state'
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname} | ESW-450`, async () => {
      when(smService.shutdownObsModeSequencers(deepEqual(obsMode))).thenResolve(
        response
      )

      renderWithAuth({
        ui: <ShutdownButton obsMode={obsMode} />,
        mockClients: mockServices.serviceFactoryContext
      })

      const shutdownButton = screen.getByRole('button', {
        name: 'Shutdown'
      }) as HTMLButtonElement

      await waitFor(() => expect(shutdownButton.disabled).false)

      userEvent.click(shutdownButton, { button: 0 })

      // expect modal to be visible
      const modalTitle = await screen.findByText(
        'Do you want to shutdown observation?'
      )
      expect(modalTitle).to.exist
      const modalDocument = screen.getByRole('document')
      const modalShutdownButton = within(modalDocument).getByRole('button', {
        name: 'Shutdown'
      })

      userEvent.click(modalShutdownButton)
      await screen.findByText(message)

      verify(smService.shutdownObsModeSequencers(deepEqual(obsMode))).called()

      await waitFor(
        () =>
          expect(screen.queryByText('Do you want to shutdown observation?')).to
            .not.exist
      )
    })
  })
})
