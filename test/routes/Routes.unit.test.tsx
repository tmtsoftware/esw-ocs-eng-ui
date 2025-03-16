import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { anything, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { App } from '../../src/containers/app/App'
import { HOME, INFRASTRUCTURE, OBSERVATIONS, RESOURCES } from '../../src/routes/RoutesConfig'
import { mockServices, renderWithAuth } from '../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

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
    ui: <>{ui}</>
  })
}

describe('Full app navigation', () => {

  it('Infrastructure route | ESW-441, ESW-542', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)

    const manageInfra = await screen.findByRole('ManageInfrastructure')
    expect(manageInfra).to.exist

    await user.click(manageInfra)
    expect(window.location.pathname).equal(INFRASTRUCTURE)
  })

  it('Observations route | ESW-441, ESW-542', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)

    const manageObservations = await screen.findByRole('ManageObservations')
    expect(manageObservations).to.exist

    await user.click(manageObservations)
    expect(window.location.pathname).equal(OBSERVATIONS)
  })

  it('Resources | ESW-441, ESW-542', async () => {
    const user = userEvent.setup()
    renderWithRouter(<App />)

    const resources = await screen.findAllByRole('Resources')
    expect(resources).to.have.length(2)

    await user.click(resources[0])
    expect(window.location.pathname).equal(RESOURCES)
  })
})
