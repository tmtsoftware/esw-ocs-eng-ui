import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { GoOfflineResponse, Prefix } from '@tmtsoftware/esw-ts'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { GoOffline } from '../../../../../src/features/sequencer/components/actions/GoOffline'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('GoOffline', () => {
  const testData: [GoOfflineResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Sequencer is offline successfully', 'successful'],
    [
      { _type: 'GoOfflineHookFailed' },
      'Sequencer failed to go Offline, reason: GoOfflineHookFailed',
      'failed'
    ],
    [
      {
        _type: 'Unhandled',
        msg: 'GoOffline message is not handled in InProgress state',
        messageType: 'GoOffline',
        state: 'InProgress'
      },
      'Sequencer failed to go Offline, reason: GoOffline message is not handled in InProgress state',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-493`, async () => {
      when(sequencerServiceMock.goOffline()).thenResolve(res)

      renderWithAuth({
        ui: <GoOffline prefix={new Prefix('ESW', 'darknight')} />
      })

      const offlineButton = await screen.findByRole('button', {
        name: 'Go offline'
      })

      userEvent.click(offlineButton, { button: 0 })

      await screen.findByText(msg)

      verify(sequencerServiceMock.goOffline()).called()
    })
  })

  it(`should be failed if goOffline call fails | ESW-493`, async () => {
    when(sequencerServiceMock.goOffline()).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: <GoOffline prefix={new Prefix('ESW', 'darknight')} />
    })

    const offlineButton = await screen.findByRole('button', {
      name: 'Go offline'
    })

    userEvent.click(offlineButton, { button: 0 })

    await screen.findByText(
      'Sequencer failed to go Offline, reason: error occurred'
    )

    verify(sequencerServiceMock.goOffline()).called()
  })
})
