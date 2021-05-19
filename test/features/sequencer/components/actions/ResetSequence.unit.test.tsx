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
import { ResetSequence } from '../../../../../src/features/sequencer/components/actions/ResetSequence'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('ResetSequence', () => {
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Successfully reset the Sequence', 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'ResetSequence message is not handled in Idle state',
        messageType: 'ResetSequence',
        state: 'Idle'
      },
      'Failed to reset the Sequence, reason: ResetSequence message is not handled in Idle state',
      'failed'
    ]
  ]

  beforeEach(() => {
    reset(sequencerServiceMock)
  })

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-500`, async () => {
      when(sequencerServiceMock.reset()).thenResolve(res)

      renderWithAuth({
        ui: (
          <ResetSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={'Running'}
          />
        )
      })

      const resetSeqButton = await screen.findByRole('ResetSequence')

      userEvent.click(resetSeqButton, { button: 0 })

      await screen.findByText('Do you want to reset the sequence?')
      const modalConfirmButton = await within(
        screen.getByRole('document')
      ).findByRole('button', {
        name: 'Reset'
      })

      userEvent.click(modalConfirmButton, { button: 0 })

      await screen.findByText(msg)

      verify(sequencerServiceMock.reset()).called()

      await waitFor(
        () =>
          expect(screen.queryByText('Do you want to reset the sequence?')).to
            .not.exist
      )
    })
  })

  it(`should be failed if resetSequence call fails | ESW-500`, async () => {
    when(sequencerServiceMock.reset()).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: (
        <ResetSequence
          prefix={new Prefix('ESW', 'darknight')}
          sequencerState={'Running'}
        />
      )
    })

    //*********testing cancel button ***********************
    const resetSeqButton1 = await screen.findByRole('ResetSequence')

    userEvent.click(resetSeqButton1, { button: 0 })
    await screen.findByText('Do you want to reset the sequence?')
    const modalCancelButton = within(screen.getByRole('document')).getByRole(
      'button',
      {
        name: 'Cancel'
      }
    )
    userEvent.click(modalCancelButton)

    verify(sequencerServiceMock.reset()).never()

    //*********testing reset(confirm) button ***********************
    const resetSeqButton2 = await screen.findByRole('ResetSequence')

    userEvent.click(resetSeqButton2, { button: 0 })
    await screen.findByText('Do you want to reset the sequence?')
    const modalConfirmButton = within(screen.getByRole('document')).getByRole(
      'button',
      {
        name: 'Reset'
      }
    )

    userEvent.click(modalConfirmButton)

    await screen.findByText(
      'Failed to reset the Sequence, reason: error occurred'
    )

    verify(sequencerServiceMock.reset()).called()
  })

  const disabledStates: (SequencerState['_type'] | undefined)[] = [
    undefined,
    'Idle',
    'Loaded',
    'Offline',
    'Processing'
  ]

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state} | ESW-500`, async () => {
      renderWithAuth({
        ui: (
          <ResetSequence
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={state}
          />
        )
      })

      const resetSeqButton = (await screen.findByRole(
        'ResetSequence'
      )) as HTMLButtonElement

      expect(resetSeqButton.disabled).true
    })
  })
})
