import { screen, waitFor } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import { Provision } from '../../../../../src/features/sm/components/provision/Provision'
import { renderWithAuth } from '../../../../utils/test-utils'

describe('Provision Component', () => {
  it(`should render Unprovision button if there is no sequence component running | ESW-444`, async () => {
    renderWithAuth({
      ui: <Provision provisionStatus={true} />
    })
    await screen.findByRole('button', { name: 'Unprovision' })
    const provisionButton = screen.queryByRole('button', { name: 'Provision' })
    await waitFor(() => expect(provisionButton).to.null)
  })

  it('should render Provision button | ESW-444', async () => {
    renderWithAuth({
      ui: <Provision provisionStatus={false} />
    })

    await screen.findByRole('button', { name: 'Provision' })

    const unProvisionButton = screen.queryByRole('button', {
      name: 'UnProvision'
    })
    await waitFor(() => expect(unProvisionButton).to.null)
  })
})
