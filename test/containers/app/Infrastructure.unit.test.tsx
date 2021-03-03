import type { HttpLocation } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import Infrastructure from '../../../src/containers/infrastructure/Infrastructure'
import { SM_CONNECTION } from '../../../src/features/sm/constants'
import {
  cleanup,
  getMockServices,
  renderWithAuth,
  screen,
  waitFor
} from '../../utils/test-utils'

describe('Infrastructure page', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render infrastructure page | ESW-442', async () => {
    renderWithAuth({
      ui: <Infrastructure />
    })

    const subtitle = screen.getByText(/sequence manager/i)
    const header = screen.getByText(/manage infrastructure/i)
    const provision = screen.getByText(/provision/i)
    const configure = screen.getByText(/configure/i)

    expect(subtitle).to.exist
    expect(header).to.exist
    expect(provision).to.exist
    expect(configure).to.exist
  })

  it('should render service down status if sequence manager is not spawned', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService

    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(undefined)
    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })

    expect(screen.getByText('Loading...')).to.exist

    await waitFor(() => {
      expect(screen.getByText(/service down/i)).to.exist
    })
  })

  it('should render running status if sequence manager is up| ESW-442', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService

    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: { agentPrefix: 'ESW.primary' }
    }

    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(smLocation)

    renderWithAuth({
      ui: <Infrastructure />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.getByText('Loading...')).to.exist

    await waitFor(() => {
      expect(screen.getByText('Running on ESW.primary')).to.exist
    })
  })

  it('should render running on unknown status if sequence manager is not running on agent | ESW-442', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService

    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: {}
    }

    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(smLocation)

    renderWithAuth({
      ui: <Infrastructure />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.getByText('Loading...')).to.exist

    await waitFor(() => {
      expect(screen.getByText('Running on unknown')).to.exist
    })
  })
})
