import { screen } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import { App } from '../../../src/containers/app/App' // fixed to absolute path
import { renderWithAuth } from '../../utils/test-utils'

describe('App page', () => {
  it('should render app with layout when user is logged in | ESW-441, ESW-542', async () => {
    renderWithAuth({ ui: <App /> })

    const resources = await screen.findAllByText('Resources')
    const manageObservations = await screen.findAllByText('Manage Observations')
    const manageInfra = await screen.findAllByText('Manage Infrastructure')
    const logoutButton = await screen.findByText('ESW-USER')

    expect(resources).to.have.length(2)
    expect(manageObservations).to.have.length(2)
    expect(manageInfra).to.have.length(2)
    expect(logoutButton).to.exist
  })
})
