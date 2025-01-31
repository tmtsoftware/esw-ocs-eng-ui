import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix } from '@tmtsoftware/esw-ts'
import type { OkOrUnhandledResponse } from '@tmtsoftware/esw-ts'
import { reset, verify, when } from '@typestrong/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { StopSequence } from '../../../../../src/features/sequencer/components/actions/StopSequence'
import { stopSequenceConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'

describe('StopSequence', () => {
  const user = userEvent.setup()
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, stopSequenceConstants.successMessage, 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'StopSequence message is not handled in Processing state',
        messageType: 'StopSequence',
        state: 'Processing'
      },
      `${stopSequenceConstants.failureMessage}, reason: StopSequence message is not handled in Processing state`,
      'failed'
    ]
  ]

  beforeEach(() => {
    reset(sequencerServiceMock)
  })

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-500`, async () => {
      when(sequencerServiceMock.stop()).thenResolve(res)

      renderWithAuth({
        ui: <StopSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning />
      })

      const stopSeqButton = await screen.findByRole('StopSequence')

      await user.click(stopSeqButton)

      await screen.findByText(stopSequenceConstants.modalTitle)
      const modalConfirmButton = await within(await screen.findByRole('document')).findByRole('button', {
        name: stopSequenceConstants.modalOkText
      })

      await user.click(modalConfirmButton)

      await screen.findByText(msg)

      verify(sequencerServiceMock.stop()).called()

      await waitFor(() => expect(screen.queryByText(stopSequenceConstants.modalTitle)).to.not.exist)
    })
  })

  it(`should be failed if stopSequence call fails | ESW-500`, async () => {
    when(sequencerServiceMock.stop()).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: <StopSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning />
    })

    //*********testing cancel button ***********************
    const stopSeqButton1 = await screen.findByRole('StopSequence')

    await user.click(stopSeqButton1)
    await screen.findByText(stopSequenceConstants.modalTitle)
    const modalCancelButton = await within(await screen.findByRole('document')).findByRole('button', {
      name: 'Cancel'
    })
    await user.click(modalCancelButton)

    verify(sequencerServiceMock.stop()).never()

    //*********testing stop(confirm) button ***********************
    const stopSeqButton2 = await screen.findByRole('StopSequence')

    await user.click(stopSeqButton2)
    await screen.findByText(stopSequenceConstants.modalTitle)
    const modalConfirmButton = await within(await screen.findByRole('document')).findByRole('button', {
      name: stopSequenceConstants.modalOkText
    })

    await user.click(modalConfirmButton)

    await screen.findByText(`${stopSequenceConstants.failureMessage}, reason: error occurred`)

    verify(sequencerServiceMock.stop()).called()
  })

  it(`should be disabled if sequencer is not running | ESW-500`, async () => {
    renderWithAuth({
      ui: <StopSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning={false} />
    })

    const stopSeqButton = (await screen.findByRole('StopSequence')) as HTMLButtonElement

    expect(stopSeqButton.disabled).true
  })
})
