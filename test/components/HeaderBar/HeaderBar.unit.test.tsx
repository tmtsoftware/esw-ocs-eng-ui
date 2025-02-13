import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { instance, mock, imock, verify } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HeaderBar } from '../../../src/components/headerBar/HeaderBar'
import { HOME } from '../../../src/routes/RoutesConfig'
import { renderWithAuth } from '../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('header bar', () => {
  const user = userEvent.setup()
  it('renders with logout button & logo when user is logged in | ESW-441', async () => {
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <HeaderBar />
        </BrowserRouter>
      ),
      loggedIn: true
    })

    // const logo = screen.getByRole('tmt_logo')
    const logo = screen.getByAltText('tmt_logo')
    expect(logo).to.exist

    //should be able to click on logo
    await user.click(logo)
    expect(window.location.pathname).to.equal(HOME)

    const logoutButton = await screen.findByText('ESW-USER')
    expect(logoutButton).to.exist
  })

  it('open logout modal on click of username button when user is logged in | ESW-441', async () => {
    class T {logout() {}}
    const mockAuthFunctions = imock<T>()
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
    await user.click(logoutButton)
    // wait for dropdown to appear
    const logoutMenuItem = await screen.findByRole('menuitem')
    await waitFor(() => user.click(logoutMenuItem))

    //verify that the logout function passed by auth context is called on click of logout button of modal
    verify(mockAuthFunctions.logout()).called()
  })
})
