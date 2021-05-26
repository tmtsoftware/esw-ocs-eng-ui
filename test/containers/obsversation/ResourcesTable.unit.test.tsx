import { screen, within } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import { ResourcesTable, ResourceTableStatus } from '../../../src/features/sequencer/components/ResourcesTable'
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
    await screen.findByRole('table')
    const [resourceHeaderTable, resourceBodyTable] = screen.queryAllByRole('table')
    expect(
      within(resourceHeaderTable).getByRole('columnheader', {
        name: 'Resource Required'
      })
    )
    expect(within(resourceHeaderTable).getByRole('columnheader', { name: 'Status' }))
    expect(within(resourceBodyTable).getByRole('row', { name: 'ESW Available' }))
    expect(within(resourceBodyTable).getByRole('row', { name: 'IRIS InUse' }))
  })
})
