import { cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ShutdownSequenceComponentResponse } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/models/SequenceManagerRes'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { UnProvisionButton } from '../../../../../src/features/sm/components/provision/UnProvisionButton'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'
import type { ServiceFactoryContextType } from '../../../../../src/contexts/serviceFactoryContext/ServiceFactoryContext'

describe('', () => {
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
    reason: 'Esw.sequence_manger is not found'
  }

  const shutdownRes: ShutdownSequenceComponentResponse = {
    _type: 'Success'
  }

  const unProvisionTestData: [
    string,
    string,
    Promise<ShutdownSequenceComponentResponse>,
    RegExp
  ][] = [
    [
      'error',
      'Unhandled',
      Promise.resolve(unhandled),
      /shutdownallsequencecomponents message type is not supported in processing state/i
    ],
    [
      'error',
      'LocationServiceError',
      Promise.resolve(locServiceError),
      /esw\.sequence_manger is not found/i
    ],
    [
      'success',
      'Success',
      Promise.resolve(shutdownRes),
      /successfully shutdown all the sequence components/i
    ]
  ]

  unProvisionTestData.forEach(([type, name, shutdownRes, errMsg]) => {
    it(`should be able to show ${type} log if shutdownAllSequenceComponents return ${name}`, async () => {
      const mockServices = getMockServices()
      const smService = mockServices.mock.smService

      when(smService.shutdownAllSequenceComponents()).thenReturn(shutdownRes)

      const {
        unProvisionButton,
        getByText,
        getByRole
      } = await renderAndFindProvisionButton(mockServices.serviceFactoryContext)

      //User clicks unprovision button
      userEvent.click(unProvisionButton)

      //modal will appear with shutdown button
      await waitFor(() => expect(getByRole('dialog')).to.exist)

      const modalDocument = screen.getByRole('dialog')

      const modalShutdownButton = within(modalDocument).getByRole('button', {
        name: /shutdown/i
      })

      //User clicks modal's shutdown button
      userEvent.click(modalShutdownButton)

      await waitFor(() => {
        expect(screen.queryByText(modalTitle)).to.null
      })

      await waitFor(() => {
        expect(getByText(errMsg)).to.exist
      })

      verify(smService.shutdownAllSequenceComponents()).called()
    })
  })

  const renderAndFindProvisionButton = async (
    serviceFactory: ServiceFactoryContextType
  ) => {
    const { getByText, getByRole, findByRole } = renderWithAuth({
      ui: <UnProvisionButton />,
      loggedIn: true,
      mockClients: serviceFactory
    })

    const unProvisionButton = await findByRole('button', {
      name: 'Unprovision'
    })

    return { unProvisionButton, getByText, getByRole, findByRole }
  }
})
