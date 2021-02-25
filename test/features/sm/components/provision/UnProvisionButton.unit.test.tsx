import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ShutdownSequenceComponentResponse } from '@tmtsoftware/esw-ts/lib/dist/src/clients/sequence-manager/models/SequenceManagerRes'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import { UnProvisionButton } from '../../../../../src/features/sm/components/provision/UnProvisionButton'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('', () => {
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService

  it('should be able to shutdown all the sequence components | ESW-444', async () => {
    const shutdownRes: ShutdownSequenceComponentResponse = {
      _type: 'Success'
    }

    when(smService.shutdownAllSequenceComponents()).thenResolve(shutdownRes)

    const { getByText, getByRole, findByRole } = renderWithAuth({
      ui: <UnProvisionButton />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })

    //User clicks unprovision button
    const unProvisionButton = await findByRole('button', {
      name: 'Unprovision'
    })

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
      expect(getByText('Successfully shutdown all the Sequence Components')).to
        .exist
    })
  })
})
