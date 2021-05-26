import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PauseResponse, Prefix } from '@tmtsoftware/esw-ts'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { PauseSequence } from '../../../../../src/features/sequencer/components/actions/PauseSequence'
import { renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'

describe('Pause Sequence', () => {
  const testData: [PauseResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Sequence is paused successfully', 'successful'],
    [
      { _type: 'CannotOperateOnAnInFlightOrFinishedStep' },
      'Failed to pause the sequence, reason: CannotOperateOnAnInFlightOrFinishedStep',
      'failed'
    ],
    [
      {
        _type: 'Unhandled',
        msg: 'Pause message is not handled in Idle state',
        messageType: 'Pause',
        state: 'Idle'
      },
      'Failed to pause the sequence, reason: Pause message is not handled in Idle state',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-497`, async () => {
      when(sequencerServiceMock.pause()).thenResolve(res)

      renderWithAuth({
        ui: <PauseSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning />
      })

      const button = await screen.findByRole('PauseSequence')

      userEvent.click(button)

      await screen.findByText(msg)

      verify(sequencerServiceMock.pause()).called()
    })
  })

  it('should show failed if error is returned | ESW-497', async () => {
    when(sequencerServiceMock.pause()).thenReject(Error('Something went wrong'))

    renderWithAuth({
      ui: <PauseSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning />
    })

    const button = await screen.findByRole('PauseSequence')

    userEvent.click(button)

    await screen.findByText('Failed to pause the sequence, reason: Something went wrong')

    verify(sequencerServiceMock.pause()).called()
  })
})
