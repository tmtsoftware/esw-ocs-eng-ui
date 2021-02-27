import React from 'react'
import {
  renderWithAuth,
  screen,
  cleanup
} from '../../utils/test-utils'
import App from '../../../src/containers/app/App' // fixed to absolute path
import { BrowserRouter } from 'react-router-dom'
import Routes from '../../../src/routes'
describe('App page', () => {
  afterEach(() => {
    cleanup()
  })

  test('should render app with layout when user is logged in', async () => {
    renderWithAuth(
      <BrowserRouter>
        <App>
          <Routes />
        </App>
      </BrowserRouter>
    )

    const resources = screen.queryAllByText('Resources')
    const manageObservations = screen.queryAllByText('Manage Observations')
    const manageInfra = screen.queryAllByText('Manage Infrastructure')
    const logoutButton = await screen.findByText('ESW-USER')

    expect(resources).toHaveLength(2)
    expect(manageObservations).toHaveLength(2)
    expect(manageInfra).toHaveLength(2)
    expect(logoutButton).toBeDefined()
  })

  test('should render app without layout when user is not logged in', () => {
    renderWithAuth(
      <BrowserRouter>
        <App>
          <Routes />
        </App>
      </BrowserRouter>,
      false
    )

    const loginButton = screen.queryAllByText('Login')
    expect(loginButton).toBeDefined()
  })
})
