import { cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ShutdownSequenceComponentResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { UnProvisionButton } from '../../../../../src/features/sm/components/provision/UnProvisionButton'
import { mockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('UnProvision button', () => {
  const modalTitle = 'Do you want to shutdown all the Sequence Components?'

  afterEach(() => {
    cleanup()
  })

  const unhandled: ShutdownSequenceComponentResponse = {
    _type: 'Unhandled',
    state: 'Processing',
    messageType: 'ShutdownAllSequenceComponents',
    msg:
      'ShutdownAllSequenceComponents message type is not supported in Processing state'
  }

  const locServiceError: ShutdownSequenceComponentResponse = {
    _type: 'LocationServiceError',
    reason: 'ESW.sequence_manager is not found'
  }

  const shutdownRes: ShutdownSequenceComponentResponse = {
    _type: 'Success'
  }

  const unProvisionTestData: [
    string,
    string,
    Promise<ShutdownSequenceComponentResponse>,
    string
  ][] = [
    [
      'error',
      'Unhandled',
      Promise.resolve(unhandled),
      'Failed to shutdown all Sequence Components, reason: ShutdownAllSequenceComponents message type is not supported in Processing state'
    ],
    [
      'error',
      'LocationServiceError',
      Promise.resolve(locServiceError),
      'Failed to shutdown all Sequence Components, reason: ESW.sequence_manager is not found'
    ],
    [
      'success',
      'Success',
      Promise.resolve(shutdownRes),
      'Successfully shutdown all the Sequence Components'
    ]
  ]

  unProvisionTestData.forEach(([type, name, shutdownRes, errMsg]) => {
    it(`should be able to show ${type} log if shutdownAllSequenceComponents return ${name} | ESW-444`, async () => {
      const smService = mockServices.mock.smService

      when(smService.shutdownAllSequenceComponents()).thenReturn(shutdownRes)

      const { unProvisionButton } = await renderAndFindProvisionButton()

      //User clicks unprovision button
      userEvent.click(unProvisionButton)

      //modal will appear with shutdown button
      await screen.findByRole('dialog')

      const modalDocument = screen.getByRole('dialog')

      const modalShutdownButton = within(modalDocument).getByRole('button', {
        name: 'Shutdown'
      })

      //User clicks modal's shutdown button
      userEvent.click(modalShutdownButton)

      await waitFor(() => {
        expect(screen.queryByText(modalTitle)).to.null
      })
      await screen.findByText(errMsg)

      verify(smService.shutdownAllSequenceComponents()).called()
    })
  })

  const renderAndFindProvisionButton = async () => {
    renderWithAuth({
      ui: <UnProvisionButton />,
      loggedIn: true
    })

    const unProvisionButton = await screen.findByRole('button', {
      name: 'Unprovision'
    })

    return { unProvisionButton }
  }
})
