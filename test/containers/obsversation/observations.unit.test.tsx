import { cleanup, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import Observations from '../../../src/containers/observation/Observations'
import obsModesData from '../../jsons/obsmodes'
import { getMockServices, renderWithAuth } from '../../utils/test-utils'

describe('Observation page', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render observation page with three tabs | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })

    const header = screen.getByText('Manage Observation')
    const runningTab = screen.getByRole('tab', { name: 'Running' })
    const configurableTab = screen.getByRole('tab', { name: 'Configurable' })
    const nonConfigurableTab = screen.getByRole('tab', {
      name: 'Non-configurable'
    })

    expect(header).to.exist
    expect(runningTab).to.exist

    expect(configurableTab).to.exist
    expect(nonConfigurableTab).to.exist
    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })

  it('should render no obsModes if no obsModes are available in tab | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })

    const configurableTab = screen.getByRole('tab', { name: 'Configurable' })
    const nonConfigurableTab = screen.getByRole('tab', {
      name: 'Non-configurable'
    })

    const noRunningObsModes = screen.getByText('No Running ObsModes')
    expect(noRunningObsModes).to.exist

    // User will click on configurable tab
    userEvent.click(configurableTab)

    await screen.findByText('No Configurable ObsModes')

    // User will click on non-configurable tab
    userEvent.click(nonConfigurableTab)

    await screen.findByText('No Configurable ObsModes')

    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })

  it('should render running obsModes | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    await screen.findByRole('menuitem', { name: 'DarkNight_1' })
    await screen.findByRole('menuitem', { name: 'DarkNight_8' })

    const pauseButton = screen.getByRole('button', { name: 'Pause' })
    const shutdownButton = screen.getByRole('button', { name: 'Shutdown' })

    expect(pauseButton).to.exist
    expect(shutdownButton).to.exist
    expect(screen.getAllByText('DarkNight_1')).to.have.length(2)
  })

  const tabTests: [string, string[]][] = [
    ['Non-configurable', ['DarkNight_3', 'DarkNight_5']],
    ['Configurable', ['DarkNight_2', 'DarkNight_6']]
  ]

  tabTests.forEach(([tabName, obsModes]) => {
    it(`should render ${tabName} obsModes | ESW-450`, async () => {
      const mockServices = getMockServices()
      const smService = mockServices.mock.smService

      renderWithAuth({
        ui: <Observations />,
        mockClients: mockServices.serviceFactoryContext
      })

      when(smService.getObsModesDetails()).thenResolve(obsModesData)

      const configurableTab = screen.getByRole('tab', {
        name: tabName
      })
      userEvent.click(configurableTab)

      await screen.findByRole('menuitem', { name: obsModes[0] })
      await screen.findByRole('menuitem', { name: obsModes[1] })

      expect(screen.getAllByText(obsModes[0])).to.have.length(2)

      await waitFor(() => {
        verify(smService.getObsModesDetails()).called()
      })
    })
  })

  it('should log error if locationServiceError occurs | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve({
      _type: 'LocationServiceError',
      reason: 'Location service failed'
    })

    await screen.findByText('Location service failed')

    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })

  it('should log error if useObsModesDetails() Fails | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Failed',
      msg: 'Failed to fetch obsModes'
    })

    await screen.findByText('Failed to fetch obsModes')

    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })
})
