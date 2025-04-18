import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix } from '@tmtsoftware/esw-ts'
import type { GoOfflineResponse } from '@tmtsoftware/esw-ts'
import { verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { GoOffline } from '../../../../../src/features/sequencer/components/actions/GoOffline'
import { goOfflineConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('GoOffline', () => {
  const testData: [GoOfflineResponse, string, string][] = [
    [{ _type: 'Ok' }, goOfflineConstants.successMessage, 'successful'],
    [{ _type: 'GoOfflineHookFailed' }, `${goOfflineConstants.failureMessage}, reason: GoOfflineHookFailed`, 'failed'],
    [
      {
        _type: 'Unhandled',
        msg: 'GoOffline message is not handled in InProgress state',
        messageType: 'GoOffline',
        state: 'InProgress'
      },
      `${goOfflineConstants.failureMessage}, reason: GoOffline message is not handled in InProgress state`,
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-493`, async () => {
      const user = userEvent.setup()
      when(sequencerServiceMock.goOffline()).thenResolve(res)

      renderWithAuth({
        ui: <GoOffline prefix={new Prefix('ESW', 'darknight')} sequencerState={'Loaded'} />
      })

      const offlineButton = await screen.findByRole('button', {
        name: goOfflineConstants.buttonText
      })

      await user.click(offlineButton)

      await screen.findByText(msg)

      verify(sequencerServiceMock.goOffline()).called()
    })
  })

  it(`should be failed if goOffline call fails | ESW-493`, async () => {
    const user = userEvent.setup()
    when(sequencerServiceMock.goOffline()).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: <GoOffline prefix={new Prefix('ESW', 'darknight')} sequencerState={'Idle'} />
    })

    const offlineButton = await screen.findByRole('button', {
      name: goOfflineConstants.buttonText
    })

    await user.click(offlineButton)

    await screen.findByText(`${goOfflineConstants.failureMessage}, reason: error occurred`)

    verify(sequencerServiceMock.goOffline()).called()
  })

  it(`should be disabled if sequencer is running | ESW-493`, async () => {
    renderWithAuth({
      ui: <GoOffline prefix={new Prefix('ESW', 'darknight')} sequencerState={'Running'} />
    })

    const offlineButton = (await screen.findByRole('button', {
      name: goOfflineConstants.buttonText
    })) as HTMLButtonElement

    expect(offlineButton.disabled).true
  })
})
