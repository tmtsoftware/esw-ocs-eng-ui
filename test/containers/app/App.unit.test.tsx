import { expect } from 'chai'
import React from 'react'
import App from '../../../src/containers/app/App' // fixed to absolute path
import { cleanup, renderWithAuth, screen } from '../../utils/test-utils'

describe('App page', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render app with layout when user is logged in | ESW-441', async () => {
    renderWithAuth({ ui: <App /> })

    const resources = screen.queryAllByText('Resources')
    const manageObservations = screen.queryAllByText('Manage Observations')
    const manageInfra = screen.queryAllByText('Manage Infrastructure')
    const logoutButton = await screen.findByText('ESW-USER')

    expect(resources).to.have.length(2)
    expect(manageObservations).to.have.length(2)
    expect(manageInfra).to.have.length(2)
    expect(logoutButton).to.exist
  })

  it('should render app without layout when user is not logged in | ESW-441', () => {
    renderWithAuth({
      ui: <App />,
      loggedIn: false
    })

    const loginButton = screen.queryAllByText('Login')
    expect(loginButton).to.have.length(2)
  })
})
