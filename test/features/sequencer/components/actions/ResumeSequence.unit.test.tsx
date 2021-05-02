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
import { ResumeSequence } from '../../../../../src/features/sequencer/components/actions/ResumeSequence'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

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

      renderWithAuth({
        ui: (
          <ResumeSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={'Running'}
          />
        )
      })

      const button = await screen.findByRole('ResumeSequence')

      userEvent.click(button)

      await screen.findByText(msg)

      verify(sequencerServiceMock.resume()).called()
    })
  })

  const disabledStates: (SequencerStateResponse['_type'] | undefined)[] = [
    undefined,
    'Loaded',
    'Processing',
    'Offline',
    'Idle'
  ]

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state} | ESW-497`, async () => {
      renderWithAuth({
        ui: (
          <ResumeSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={state}
          />
        )
      })

      const button = (await screen.findByRole(
        'ResumeSequence'
      )) as HTMLButtonElement

      expect(button.disabled).true
    })
  })
})
