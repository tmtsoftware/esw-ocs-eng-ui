import { waitFor } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import Provision from '../../../../../src/features/sm/components/provision/Provision'
import { renderWithAuth } from '../../../../utils/test-utils'

describe('Provision Component', () => {
  it(`should render Unprovision button if there is no sequence component running | ESW-444`, async () => {
    const { getByRole, queryByRole } = renderWithAuth({
      ui: <Provision provisionStatus={true} />
    })

    await waitFor(
      () => expect(getByRole('button', { name: 'Unprovision' })).to.be.exist
    )

    await waitFor(
      () => expect(queryByRole('button', { name: 'Provision' })).to.null
    )
  })

  it('should render Provision button | ESW-444', async () => {
    const { getByRole, queryByRole } = renderWithAuth({
      ui: <Provision provisionStatus={false} />
    })

    await waitFor(
      () => expect(getByRole('button', { name: 'Provision' })).to.be.exist
    )

    await waitFor(
      () => expect(queryByRole('button', { name: 'UnProvision' })).to.null
    )
  })
})
