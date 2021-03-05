import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { HttpConnection, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { anything, capture, when } from 'ts-mockito'
import { SpawnSMButton } from '../../../../../src/features/sm/components/spawn/SpawnButton'
import { OBS_MODE_CONFIG } from '../../../../../src/features/sm/constants'
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
      agentServiceMock.spawnSequenceManager(anything(), OBS_MODE_CONFIG, false)
    ).thenResolve({ _type: 'Spawned' })

    renderWithAuth({
      ui: <SpawnSMButton />,
      mockClients: mockServices.serviceFactoryContext
    })

    //User clicks spawn button
    const spawnButton = await screen.findByRole('button', { name: /spawn/i })
    userEvent.click(spawnButton)

    //modal will appear with spawn button
    await waitFor(
      () =>
        expect(
          screen.getByText(/choose an agent to spawn the sequence manager/i)
        ).to.exist
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
      expect(screen.getByText('Successfully spawned Sequence Manager')).to.exist
    })

    const [prefix, expectedConfig, isLocal] = capture(
      agentServiceMock.spawnSequenceManager
    ).first()

    expect(prefix.toJSON()).eq(agentPrefix.toJSON())
    expect(expectedConfig).eq(OBS_MODE_CONFIG)
    expect(isLocal).to.false
  })

  it('should show error message if no agents are present and user tries spawning machine | ESW-441', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService
    when(locationServiceMock.listByComponentType('Machine')).thenResolve([])

    renderWithAuth({
      ui: <SpawnSMButton />,
      mockClients: mockServices.serviceFactoryContext
    })

    //User clicks spawn button
    const spawnButton = await screen.findByRole('button', { name: /spawn/i })
    userEvent.click(spawnButton)

    await waitFor(
      () =>
        expect(
          screen.getByText(
            'Agents are not running. Please start an agent first.'
          )
        ).to.exist
    )
    await waitFor(
      () =>
        expect(
          screen.queryByText(/choose an agent to spawn the sequence manager/i)
        ).not.exist
    )
  })

  it('should show notification if spawning sequence manager fails | ESW-441', async () => {
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
      agentServiceMock.spawnSequenceManager(anything(), OBS_MODE_CONFIG, false)
    ).thenResolve({ _type: 'Failed', msg: 'Config file not found' })

    renderWithAuth({
      ui: <SpawnSMButton />,
      mockClients: mockServices.serviceFactoryContext
    })

    //User clicks spawn button
    const spawnButton = await screen.findByRole('button', { name: /spawn/i })
    userEvent.click(spawnButton)

    //modal will appear with spawn button
    await waitFor(
      () =>
        expect(
          screen.getByText(/choose an agent to spawn the sequence manager/i)
        ).to.exist
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
      expect(
        screen.getByText(
          'Sequence Manager could not be spawned. Please try again., reason: Config file not found'
        )
      ).to.exist
    })
  })
})
