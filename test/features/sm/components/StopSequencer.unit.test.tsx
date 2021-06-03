import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ObsMode, Prefix, ShutdownSequencersResponse } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { StopSequencer } from '../../../../src/features/sm/components/StopSequencer'
import { stopSequencerConstants } from '../../../../src/features/sm/smConstants'
import { _createErrorMsg } from '../../../../src/utils/message'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Stop Sequencer', () => {
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
      stopSequencerConstants.successMessage(seqPrefix)
    ],
    [
      'locationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer component not found'
      },
      _createErrorMsg(stopSequencerConstants.failureMessage(seqPrefix), 'Sequencer component not found')
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'ShutdownSequencer message type is not supported in Processing state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      _createErrorMsg(
        stopSequencerConstants.failureMessage(seqPrefix),
        'ShutdownSequencer message type is not supported in Processing state'
      )
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'Unload message timed out'
      },
      _createErrorMsg(stopSequencerConstants.failureMessage(seqPrefix), 'Unload message timed out')
    ]
  ]

  tests.forEach(([testname, response, message]) => {
    const modalTitleText = stopSequencerConstants.getModalTitle(seqPrefix.toJSON())
    it(`should return ${testname} | ESW-447, ESW-507`, async () => {
      when(smService.shutdownSequencer('ESW', deepEqual(obsMode))).thenResolve(response)

      renderWithAuth({
        ui: (
          <Menu>
            <StopSequencer sequencerPrefix={seqPrefix} />
          </Menu>
        )
      })

      const stopSequencer = screen.getByText(stopSequencerConstants.menuItemText)

      userEvent.click(stopSequencer)

      // expect modal to be visible
      const modalTitle = await screen.findByText(modalTitleText)
      expect(modalTitle).to.exist

      const confirmButton = screen.getByRole('button', {
        name: stopSequencerConstants.modalOkButtonText
      })
      userEvent.click(confirmButton)

      await screen.findByText(message)

      verify(smService.shutdownSequencer('ESW', deepEqual(obsMode))).called()
      await waitFor(() => expect(screen.queryByText(modalTitleText)).to.null)
    })
  })
})
