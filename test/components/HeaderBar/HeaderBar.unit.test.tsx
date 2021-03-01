import userEvent from '@testing-library/user-event'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { instance, mock, verify } from 'ts-mockito'
import HeaderBar from '../../../src/components/HeaderBar/HeaderBar'
import RoutesConfig from '../../../src/routes/RoutesConfig'
import { cleanup, renderWithAuth, screen } from '../../utils/test-utils'

const leftClick = { button: 0 }
describe('header bar', () => {
  afterEach(() => cleanup())
  it('renders with logout button & logo when user is logged in | ESW-441', async () => {
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <HeaderBar />
        </BrowserRouter>
      ),
      loggedIn: true
    })

    const logo = screen.getByRole('tmt_logo')
    expect(logo).to.exist

    //should be able to click on logo
    userEvent.click(logo, leftClick)
    expect(window.location.pathname).to.equal(RoutesConfig.home)

    const logoutButton = await screen.findByText('ESW-USER')
    expect(logoutButton).to.exist
  })

  it('renders with login button & logo when user is logged out | ESW-441', async () => {
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <HeaderBar />
        </BrowserRouter>
      ),
      loggedIn: false
    })

    const logo = screen.getByRole('tmt_logo')
    expect(logo).to.exist

    const loginButton = await screen.findByText('Login')
    expect(loginButton).to.exist
  })

  it.skip('open logout modal on click of username button when user is logged in | ESW-441', async () => {
    const mockAuthFunctions = mock<{ logout: () => void }>()
    const authFunctionsInstance = instance(mockAuthFunctions)
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <HeaderBar />
        </BrowserRouter>
      ),
      loggedIn: true,
      logoutFunc: () => authFunctionsInstance.logout()
    })

    const logoutButton = await screen.findByText('ESW-USER')
    userEvent.click(logoutButton, leftClick)

    //wait for modal text to appear
    const modalText = await screen.findByText('Logging out')
    expect(modalText).to.exist

    //click logout
    const logoutButtonOnModal = screen.getByText('Logout')
    userEvent.click(logoutButtonOnModal, leftClick)
    //verify that the logout function passed by auth context is called on click of logout button of modal
    verify(mockAuthFunctions.logout()).called()
  })

  it('check login function of auth context is called | ESW-441', async () => {
    const mockAuthFunctions = mock<{ login: () => void }>()
    const authFunctionsInstance = instance(mockAuthFunctions)
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <HeaderBar />
        </BrowserRouter>
      ),
      loggedIn: false,
      loginFunc: () => authFunctionsInstance.login()
    })

    //verify that the login function passed by auth context is called on click of login button of the header
    const loginButton = await screen.findByText('Login')
    userEvent.click(loginButton, leftClick)
    verify(mockAuthFunctions.login()).called()
  })
})
