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
    await waitFor(() => {
      expect(screen.getByText('No Configurable ObsModes')).to.exist
    })

    // User will click on non-configurable tab
    userEvent.click(nonConfigurableTab)
    await waitFor(() => {
      expect(screen.getByText('No Non-configurable ObsModes')).to.exist
    })

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

    const darkNight_1 = await screen.findByRole('menuitem', {
      name: 'DarkNight_1'
    })
    const darkNight_8 = await screen.findByRole('menuitem', {
      name: 'DarkNight_8'
    })

    const pauseButton = screen.getByRole('button', { name: 'Pause' })
    const shutdownButton = screen.getByRole('button', { name: 'Shutdown' })

    expect(darkNight_1).to.exist
    expect(darkNight_8).to.exist

    expect(pauseButton).to.exist
    expect(shutdownButton).to.exist
    expect(screen.getAllByText('DarkNight_1')).to.have.length(2)
  })

  it('should render configurable obsModes | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    const configurableTab = screen.getByRole('tab', { name: 'Configurable' })
    userEvent.click(configurableTab)

    const darkNight_2 = await screen.findByRole('menuitem', {
      name: 'DarkNight_2'
    })
    const darkNight_6 = await screen.findByRole('menuitem', {
      name: 'DarkNight_6'
    })
    const configureButton = screen.getByRole('button', { name: 'Configure' })

    expect(darkNight_2).to.exist
    expect(darkNight_6).to.exist

    expect(configureButton).to.exist
    expect(screen.getAllByText('DarkNight_2')).to.have.length(2)
  })

  it('should render configurable obsModes | ESW-450', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: <Observations />,
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    const configurableTab = screen.getByRole('tab', {
      name: 'Non-configurable'
    })
    userEvent.click(configurableTab)

    const darkNight_3 = await screen.findByRole('menuitem', {
      name: 'DarkNight_3'
    })
    const darkNight_5 = await screen.findByRole('menuitem', {
      name: 'DarkNight_5'
    })
    const configureButton = screen.getByRole('button', { name: 'Configure' })

    expect(darkNight_3).to.exist
    expect(darkNight_5).to.exist

    expect(configureButton).to.exist
    expect(screen.getAllByText('DarkNight_3')).to.have.length(2)
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

    await waitFor(() => {
      expect(screen.getByText('Location service failed')).to.exist
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

    await waitFor(() => {
      expect(screen.getByText('Failed to fetch obsModes')).to.exist
    })
  })
})
