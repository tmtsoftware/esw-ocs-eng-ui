import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  Prefix,
  Result,
  SequencerState,
  SubmitResponse
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { mock, verify, when } from 'ts-mockito'
import { StartSequence } from '../../../../../src/features/sequencer/components/actions/StartSequence'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('Start Sequence', () => {
  const testData: [SubmitResponse, string, string][] = [
    [
      { _type: 'Started', runId: '' },
      'Sequence is started successfully',
      'successful'
    ],
    [
      { _type: 'Completed', runId: '', result: mock(Result) },
      'Sequence is completed successfully',
      'successful'
    ],
    [
      { _type: 'Error', runId: '', message: 'Unknown error' },
      'Failed to start the sequence, reason: Unknown error',
      'failed'
    ],
    [
      {
        _type: 'Invalid',
        runId: '',
        issue: {
          _type: 'RequiredHCDUnavailableIssue',
          reason: 'Required HCD unavailable'
        }
      },
      'Failed to start the sequence, reason: Required HCD unavailable',
      'failed'
    ],
    [
      { _type: 'Cancelled', runId: '' },
      'Failed to start the sequence, reason: Cancelled',
      'failed'
    ],
    [
      { _type: 'Locked', runId: '' },
      'Failed to start the sequence, reason: Locked',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should show ${state} if sequencer response is ${res._type}| ESW-497`, async () => {
      when(sequencerServiceMock.startSequence()).thenResolve(res)

      renderWithAuth({
        ui: (
          <StartSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={'Loaded'}
          />
        )
      })

      const button = await screen.findByRole('StartSequence')

      userEvent.click(button)

      await screen.findByText(msg)

      verify(sequencerServiceMock.startSequence()).called()
    })
  })

  it('should show failed if error is returned | ESW-497', async () => {
    when(sequencerServiceMock.startSequence()).thenReject(
      Error('Something went wrong')
    )

    renderWithAuth({
      ui: (
        <StartSequence
          prefix={new Prefix('ESW', 'darknight')}
          sequencerState={'Loaded'}
        />
      )
    })

    const button = await screen.findByRole('StartSequence')

    userEvent.click(button)

    await screen.findByText(
      'Failed to start the sequence, reason: Something went wrong'
    )

    verify(sequencerServiceMock.startSequence()).called()
  })

  const disabledStates: SequencerState['_type'][] = [
    'Running',
    'Processing',
    'Offline',
    'Idle'
  ]

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state} | ESW-497`, async () => {
      renderWithAuth({
        ui: (
          <StartSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={state}
          />
        )
      })

      const button = (await screen.findByRole(
        'StartSequence'
      )) as HTMLButtonElement

      expect(button.disabled).true
    })
  })
})
