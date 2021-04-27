import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  OkOrUnhandledResponse,
  Prefix,
  SequencerStateResponse
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { AbortSequence } from '../../../../../src/features/sequencer/components/actions/AbortSequence'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('AbortSequence', () => {
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Successfully aborted the Sequence', 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'AbortSequence message is not handled in InProgress state',
        messageType: 'AbortSequence',
        state: 'InProgress'
      },
      'Failed to abort the Sequence, reason: AbortSequence message is not handled in InProgress state',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-494`, async () => {
      when(sequencerServiceMock.abortSequence()).thenResolve(res)

      renderWithAuth({
        ui: (
          <AbortSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={'Running'}
          />
        )
      })

      const abortSeqButton = await screen.findByRole('button', {
        name: 'Abort sequence'
      })

      userEvent.click(abortSeqButton, { button: 0 })

      await screen.findByText(msg)

      verify(sequencerServiceMock.abortSequence()).called()
    })
  })

  it(`should be failed if abortSequence call fails | ESW-494`, async () => {
    when(sequencerServiceMock.abortSequence()).thenReject(
      Error('error occurred')
    )

    renderWithAuth({
      ui: (
        <AbortSequence
          prefix={new Prefix('ESW', 'darknight')}
          sequencerState={'Running'}
        />
      )
    })

    const abortSeqButton = await screen.findByRole('button', {
      name: 'Abort sequence'
    })

    userEvent.click(abortSeqButton, { button: 0 })

    await screen.findByText(
      'Failed to abort the Sequence, reason: error occurred'
    )

    verify(sequencerServiceMock.abortSequence()).called()
  })

  const disabledStates: (SequencerStateResponse['_type'] | undefined)[] = [
    undefined,
    'Idle',
    'Loaded',
    'Offline',
    'Processing'
  ]

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state} | ESW-494`, async () => {
      renderWithAuth({
        ui: (
          <AbortSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={state}
          />
        )
      })

      const abortSeqButton = (await screen.findByRole('button', {
        name: 'Abort sequence'
      })) as HTMLButtonElement

      expect(abortSeqButton.disabled).true
    })
  })
})
