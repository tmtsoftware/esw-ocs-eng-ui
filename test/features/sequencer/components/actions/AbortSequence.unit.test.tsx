import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix } from '@tmtsoftware/esw-ts'
import type { OkOrUnhandledResponse } from '@tmtsoftware/esw-ts'
import { reset, verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { AbortSequence } from '../../../../../src/features/sequencer/components/actions/AbortSequence'
import { abortSequenceConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('AbortSequence', () => {
  const testData: [OkOrUnhandledResponse, string, string][] = [
    [{ _type: 'Ok' }, abortSequenceConstants.successMessage, 'successful'],
    [
      {
        _type: 'Unhandled',
        msg: 'AbortSequence message is not handled in InProgress state',
        messageType: 'AbortSequence',
        state: 'InProgress'
      },
      `${abortSequenceConstants.failureMessage}, reason: AbortSequence message is not handled in InProgress state`,
      'failed'
    ]
  ]

  beforeEach(() => {
    reset(sequencerServiceMock)
  })

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-494`, async () => {
      const user = userEvent.setup()
      when(sequencerServiceMock.abortSequence()).thenResolve(res)

      renderWithAuth({
        ui: <AbortSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning />
      })

      const abortSeqButton = await screen.findByRole('button', {
        name: abortSequenceConstants.buttonText
      })

      await user.click(abortSeqButton)

      await screen.findByText(abortSequenceConstants.modalTitle)
      // const modalAbortButton = await within(await screen.findByRole('document')).findByRole('button', {
      //   name: abortSequenceConstants.modalOkText
      // })
      const modalAbortButton = screen.getAllByRole('button', {
        name: abortSequenceConstants.modalOkText
      })

      await user.click(modalAbortButton[0])

      await screen.findByText(msg)

      verify(sequencerServiceMock.abortSequence()).called()

      await waitFor(() => expect(screen.queryByText(abortSequenceConstants.modalTitle)).to.not.exist)
    })
  })

  it(`should be failed if abortSequence call fails | ESW-494`, async () => {
    const user = userEvent.setup()
    when(sequencerServiceMock.abortSequence()).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: <AbortSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning />
    })

    //*********testing cancel button ***********************
    const abortSeqButton1 = await screen.findByRole('button', {
      name: abortSequenceConstants.buttonText
    })

    await user.click(abortSeqButton1)
    await screen.findByText(abortSequenceConstants.modalTitle)
    // const modalCancelButton = await within(await screen.findByRole('document')).findByRole('button', {
    //   name: 'Cancel'
    // })
    const modalCancelButton = screen.getAllByRole('button', {
      name: 'Cancel'
    })
    await user.click(modalCancelButton[0])

    verify(sequencerServiceMock.abortSequence()).never()

    //*********testing abort(confirm) button ***********************
    const abortSeqButton2 = await screen.findByRole('button', {
      name: abortSequenceConstants.buttonText
    })

    await user.click(abortSeqButton2)
    await screen.findByText(abortSequenceConstants.modalTitle)
    // const modalAbortButton = await within(await screen.findByRole('document')).findByRole('button', {
    //   name: abortSequenceConstants.modalOkText
    // })
    const modalAbortButton = screen.getAllByRole('button', {
      name: abortSequenceConstants.modalOkText
    })

    await user.click(modalAbortButton[0])

    await screen.findByText(`${abortSequenceConstants.failureMessage}, reason: error occurred`)

    verify(sequencerServiceMock.abortSequence()).called()
  })

  it(`should be disabled if sequencer is not running | ESW-494`, async () => {
    renderWithAuth({
      ui: <AbortSequence prefix={new Prefix('ESW', 'darknight')} isSequencerRunning={false} />
    })

    const abortSeqButton = (await screen.findByRole('button', {
      name: abortSequenceConstants.buttonText
    })) as HTMLButtonElement

    expect(abortSeqButton.disabled).true
  })
})
