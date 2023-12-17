import { screen, waitFor } from '@testing-library/react'
import React from 'react'
import { Provision } from '../../../../../src/features/sm/components/provision/Provision'
import { provisionConstants, unProvisionConstants } from '../../../../../src/features/sm/smConstants'
import { renderWithAuth } from '../../../../utils/test-utils'
import { expect } from 'chai'

describe('Provision Component', () => {
  it(`should render Unprovision button if there is no sequence component running | ESW-444`, async () => {
    renderWithAuth({
      ui: <Provision provisionStatus={true} />
    })
    await screen.findByRole('button', { name: unProvisionConstants.buttonText })
    const provisionButton = screen.queryByRole('button', { name: provisionConstants.buttonText })
    await waitFor(() => expect(provisionButton).to.null)
  })

  it('should render Provision button | ESW-444', async () => {
    renderWithAuth({
      ui: <Provision provisionStatus={false} />
    })

     await screen.findByText(provisionConstants.buttonText)

    const unProvisionButton = await screen.queryByRole('button', {
      name: unProvisionConstants.buttonText
    })
    await waitFor(() => expect(unProvisionButton).to.null)
  })
})
