import { screen, within } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import {
  ResourcesTable,
  ResourceTableStatus
} from '../../../src/features/sequencer/components/ResourcesTable'
import { renderWithAuth } from '../../utils/test-utils'
describe('Resources table', () => {
  it('should render resources with status', async () => {
    const resources: ResourceTableStatus[] = [
      {
        key: 'ESW',
        status: 'Available'
      },
      {
        key: 'IRIS',
        status: 'InUse'
      }
    ]
    renderWithAuth({ ui: <ResourcesTable resources={resources} /> })

    const resourceTable = await screen.findByRole('table')
    expect(
      within(resourceTable).getByRole('columnheader', {
        name: 'Resource Required'
      })
    )
    expect(within(resourceTable).getByRole('columnheader', { name: 'Status' }))
    expect(within(resourceTable).getByRole('row', { name: 'ESW Available' }))
    expect(within(resourceTable).getByRole('row', { name: 'IRIS InUse' }))
  })
})
