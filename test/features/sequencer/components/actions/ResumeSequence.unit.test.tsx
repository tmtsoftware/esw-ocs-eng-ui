import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { OkOrUnhandledResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { ResumeSequence } from '../../../../../src/features/sequencer/components/actions/ResumeSequence'
import { renderWithStepListContext, sequencerServiceMock } from '../../../../utils/test-utils'

describe('Resume Sequence', () => {
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Sequence is resumed successfully', 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'Resume message is not handled in Idle state',
        messageType: 'Resume',
        state: 'Idle'
      },
      'Failed to resume the sequence, reason: Resume message is not handled in Idle state',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-497`, async () => {
      when(sequencerServiceMock.resume()).thenResolve(res)

      renderWithStepListContext(<ResumeSequence isSequencerRunning isCurrentStepRunningAndNextPaused={false} />)

      const button = await screen.findByRole('ResumeSequence')

      userEvent.click(button)

      await screen.findByText(msg)

      verify(sequencerServiceMock.resume()).called()
    })
  })

  it('should show failed if error is returned | ESW-497', async () => {
    when(sequencerServiceMock.resume()).thenReject(Error('Something went wrong'))

    renderWithStepListContext(<ResumeSequence isSequencerRunning isCurrentStepRunningAndNextPaused={false} />)

    const button = await screen.findByRole('ResumeSequence')

    userEvent.click(button)

    await screen.findByText('Failed to resume the sequence, reason: Something went wrong')

    verify(sequencerServiceMock.resume()).called()
  })

  it(`should be disabled if sequencer is not running | ESW-497`, async () => {
    renderWithStepListContext(<ResumeSequence isSequencerRunning={false} isCurrentStepRunningAndNextPaused={false} />)

    const button = (await screen.findByRole('ResumeSequence')) as HTMLButtonElement

    expect(button.disabled).true
  })
})
