import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  GoOnlineResponse,
  Prefix,
  SequencerStateResponse
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { GoOnline } from '../../../../../src/features/sequencer/components/actions/GoOnline'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('GoOnline', () => {
  const testData: [GoOnlineResponse, string, string][] = [
    [{ _type: 'Ok' }, 'Sequencer is online successfully', 'successful'],
    [
      { _type: 'GoOnlineHookFailed' },
      'Sequencer failed to go Online, reason: GoOnlineHookFailed',
      'failed'
    ],
    [
      {
        _type: 'Unhandled',
        msg: 'GoOnline message is not handled in InProgress state',
        messageType: 'GoOnline',
        state: 'InProgress'
      },
      'Sequencer failed to go Online, reason: GoOnline message is not handled in InProgress state',
      'failed'
    ]
  ]

  testData.forEach(([res, msg, state]) => {
    it(`should be ${state} if sequencer response is ${res._type}| ESW-493`, async () => {
      when(sequencerServiceMock.goOnline()).thenResolve(res)

      renderWithAuth({
        ui: (
          <GoOnline
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={'Idle'}
          />
        )
      })

      const onlineButton = await screen.findByRole('button', {
        name: 'Go online'
      })

      userEvent.click(onlineButton, { button: 0 })

      await screen.findByText(msg)

      verify(sequencerServiceMock.goOnline()).called()
    })
  })

  it(`should be failed if goOnline call fails | ESW-493`, async () => {
    when(sequencerServiceMock.goOnline()).thenReject(Error('error occurred'))

    renderWithAuth({
      ui: (
        <GoOnline
          prefix={new Prefix('ESW', 'darknight')}
          sequencerState={'Idle'}
        />
      )
    })

    const onlineButton = await screen.findByRole('button', {
      name: 'Go online'
    })

    userEvent.click(onlineButton, { button: 0 })

    await screen.findByText(
      'Sequencer failed to go Online, reason: error occurred'
    )

    verify(sequencerServiceMock.goOnline()).called()
  })

  const disabledStates: (SequencerStateResponse['_type'] | undefined)[] = [
    undefined,
    'Running'
  ]

  disabledStates.forEach((state) => {
    it(`should be disabled if sequencer in ${state}`, async () => {
      renderWithAuth({
        ui: (
          <GoOnline
            prefix={new Prefix('ESW', 'darknight')}
            sequencerState={state}
          />
        )
      })

      const onlineButton = (await screen.findByRole('button', {
        name: 'Go online'
      })) as HTMLButtonElement

      expect(onlineButton.disabled).true
    })
  })
})
