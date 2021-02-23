import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { HttpConnection, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { anything, capture, when } from 'ts-mockito'
import { SpawnSMButton } from '../../../../../src/features/sm/components/spawn/SpawnButton'
import { obsModeConfig } from '../../../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('SpawnSMButton', () => {
  it('should spawn the sequence manager | ESW-441', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService
    const agentServiceMock = mockServices.mock.agentService
    const agentPrefix = new Prefix('ESW', 'ESW.Machine1')
    const agentLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: HttpConnection(agentPrefix, 'Service'),
      uri: 'url',
      metadata: {}
    }

    when(locationServiceMock.listByComponentType('Machine')).thenResolve([
      agentLocation
    ])

    when(
      agentServiceMock.spawnSequenceManager(anything(), obsModeConfig, false)
    ).thenResolve({ _type: 'Spawned' })

    const { getByText, findByRole } = renderWithAuth({
      ui: <SpawnSMButton />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })

    //User clicks spawn button
    const spawnButton = await findByRole('button', { name: /spawn/i })
    userEvent.click(spawnButton)

    //modal will appear with spawn button
    await waitFor(
      () =>
        expect(getByText(/choose an agent to spawn the sequence manager/i)).to
          .exist
    )
    const modalDocument = screen.getByRole('document')
    const modalSpawnButton = within(modalDocument).getByRole('button', {
      name: /spawn/i
    })

    //User selects agent machine
    userEvent.click(
      within(modalDocument).getByRole('menuitem', {
        name: agentPrefix.toJSON()
      })
    )

    //User clicks modal's spawn button
    userEvent.click(modalSpawnButton)

    await waitFor(() => {
      expect(getByText('Successfully spawned Sequence Manager')).to.exist
    })

    const [prefix, expectedConfig, isLocal] = capture(
      agentServiceMock.spawnSequenceManager
    ).first()

    expect(prefix.toJSON()).eq(agentPrefix.toJSON())
    expect(expectedConfig).eq(obsModeConfig)
    expect(isLocal).to.false
  })
})
