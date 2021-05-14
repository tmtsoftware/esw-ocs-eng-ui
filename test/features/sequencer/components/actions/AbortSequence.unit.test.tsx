import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  OkOrUnhandledResponse,
  Prefix,
  SequencerState
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { reset, verify, when } from 'ts-mockito'
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

  beforeEach(() => {
    reset(sequencerServiceMock)
  })

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

      await screen.findByText('Do you want to abort the sequence?')
      const modalAbortButton = await within(
        screen.getByRole('document')
      ).findByRole('button', {
        name: 'Abort'
      })

      userEvent.click(modalAbortButton, { button: 0 })

      await screen.findByText(msg)

      verify(sequencerServiceMock.abortSequence()).called()

      await waitFor(
        () =>
          expect(screen.queryByText('Do you want to abort the sequence?')).to
            .not.exist
      )
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

    //*********testing cancel button ***********************
    const abortSeqButton1 = await screen.findByRole('button', {
      name: 'Abort sequence'
    })

    userEvent.click(abortSeqButton1, { button: 0 })
    await screen.findByText('Do you want to abort the sequence?')
    const modalCancelButton = within(screen.getByRole('document')).getByRole(
      'button',
      {
        name: 'Cancel'
      }
    )
    userEvent.click(modalCancelButton)

    verify(sequencerServiceMock.abortSequence()).never()

    //*********testing abort(confirm) button ***********************
    const abortSeqButton2 = await screen.findByRole('button', {
      name: 'Abort sequence'
    })

    userEvent.click(abortSeqButton2, { button: 0 })
    await screen.findByText('Do you want to abort the sequence?')
    const modalAbortButton = within(screen.getByRole('document')).getByRole(
      'button',
      {
        name: 'Abort'
      }
    )

    userEvent.click(modalAbortButton)

    await screen.findByText(
      'Failed to abort the Sequence, reason: error occurred'
    )

    verify(sequencerServiceMock.abortSequence()).called()
  })

  const disabledStates: (SequencerState['_type'] | undefined)[] = [
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
