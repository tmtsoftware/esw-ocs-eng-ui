import { cleanup, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { anything, when } from 'ts-mockito'
import { App } from '../../src/containers/app/App'
import { HOME, INFRASTRUCTURE, OBSERVATIONS, RESOURCES } from '../../src/routes/RoutesConfig'
import { mockServices, renderWithAuth } from '../utils/test-utils'

const renderWithRouter = (ui: React.ReactElement) => {
  window.history.pushState({}, 'Home page', HOME)
  // Mocking locationService.listByComponentType,
  // because on Home page a call happens on render to get list of agents
  const locServiceMock = mockServices.mock.locationService
  when(locServiceMock.track(anything())).thenReturn(() => {
    return { cancel: () => ({}) }
  })
  when(locServiceMock.listByComponentType('Machine')).thenResolve([])

  return renderWithAuth({
    ui: <BrowserRouter>{ui}</BrowserRouter>
  })
}

const leftClick = { button: 0 }
describe('Full app navigation', () => {
  afterEach(() => {
    cleanup()
  })

  it('Infrastructure route | ESW-441, ESW-542', async () => {
    renderWithRouter(<App />)

    const manageInfra = await screen.findByRole('ManageInfrastructure')
    expect(manageInfra).to.exist

    userEvent.click(manageInfra, leftClick)
    expect(window.location.pathname).equal(INFRASTRUCTURE)
  })

  it('Observations route | ESW-441, ESW-542', async () => {
    renderWithRouter(<App />)

    const manageObservations = await screen.findByRole('ManageObservations')
    expect(manageObservations).to.exist

    userEvent.click(manageObservations, leftClick)
    expect(window.location.pathname).equal(OBSERVATIONS)
  })

  it('Resources | ESW-441, ESW-542', async () => {
    renderWithRouter(<App />)

    const resources = await screen.findAllByRole('Resources')
    expect(resources).to.have.length(2)

    userEvent.click(resources[0], leftClick)
    expect(window.location.pathname).equal(RESOURCES)
  })
})
