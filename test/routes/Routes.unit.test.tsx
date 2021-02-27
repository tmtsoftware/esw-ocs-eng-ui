import { screen, renderWithAuth, cleanup } from '../utils/test-utils'
import React from 'react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import App from '../../src/containers/app/App'
import Routes from '../../src/routes'
import { createMemoryHistory } from 'history'

const renderWithRouter = (ui: React.ReactElement) => {
  window.history.pushState({}, 'Home page', '/')
  return renderWithAuth(<BrowserRouter>{ui}</BrowserRouter>, true)
}
describe('Full app navigation', () => {
  afterEach(() => {
    cleanup()
  })

  test('Infrastructure route', () => {
    renderWithRouter(
      <App>
        <Routes />
      </App>
    )

    const manageInfra = screen.queryAllByText('Manage Infrastructure')
    expect(manageInfra).toHaveLength(2)

    const leftClick = { button: 0 }
    userEvent.click(manageInfra[0], leftClick)
    expect(window.location.hash).toEqual('/Infrastructure')
  })

  test('Observations route', () => {
    renderWithRouter(
      <App>
        <Routes />
      </App>
    )

    const manageObservations = screen.queryAllByText('Manage Observations')
    expect(manageObservations).toHaveLength(2)

    const leftClick = { button: 0 }
    userEvent.click(manageObservations[0], leftClick)
    expect(window.location.hash).toEqual('/Observations')
  })

  test('Resources', () => {
    renderWithRouter(
      <App>
        <Routes />
      </App>
    )

    const resources = screen.queryAllByText('Resources')
    expect(resources).toHaveLength(2)

    const leftClick = { button: 0 }
    userEvent.click(resources[0], leftClick)
    expect(window.location.hash).toEqual('/Resources')
  })

  test('landing on a bad page', () => {
    const history = createMemoryHistory()

    renderWithRouter(
      <App>
        <Routes />
      </App>
    )
    history.push('/some/bad/route')
    expect(screen.getByText(/no match/i)).toBeDefined()
  })
})