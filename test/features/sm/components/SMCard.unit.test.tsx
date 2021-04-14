import { screen, waitFor } from '@testing-library/react'
import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { HttpConnection, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
// import { SMContextProvider } from '../../../../src/contexts/SMContext'
import { SMCard } from '../../../../src/features/sm/components/smcard/SMCard'
import { SM_CONNECTION } from '../../../../src/features/sm/constants'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('SMCard', () => {
  const mockServices = getMockServices()
  const locationServiceMock = mockServices.mock.locationService
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
  when(locationServiceMock.track(SM_CONNECTION)).thenReturn(() => ({
    cancel: () => ({})
  }))

  it('should show Spawn button if Sequence Manager is not spawned | ESW-441', async () => {
    renderWithAuth({
      ui: (
        // <SMContextProvider>
        <SMCard />
        // </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    await waitFor(
      () => expect(screen.queryByRole('button', { name: 'Shutdown' })).to.null
    )

    await screen.findByRole('button', { name: 'Spawn' })

    verify(locationServiceMock.track(SM_CONNECTION)).called()
  })

  it('should show Shutdown button if Sequence Manager is already spawned | ESW-441', async () => {
    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: {}
    }

    renderWithAuth({
      ui: (
        // <SMContextProvider defaultValue={[smLocation, false]}>
        <SMCard />
        // </SMContextProvider>
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    await waitFor(
      () => expect(screen.queryByRole('button', { name: 'Spawn' })).to.null
    )

    await screen.findByRole('button', { name: 'Shutdown' })

    verify(locationServiceMock.track(SM_CONNECTION)).called()
  })
})
