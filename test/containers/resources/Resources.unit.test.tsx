import { screen, within } from '@testing-library/react'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import Resources from '../../../src/containers/resources/Resources'
import obsModesData from '../../jsons/mockResourcesData'
import { getMockServices, renderWithAuth } from '../../utils/test-utils'

describe('Resources page', () => {
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService
  when(smService.getObsModesDetails()).thenResolve(obsModesData)

  it('should display page header with a resources table | ESW-453', async () => {
    renderWithAuth({ ui: <Resources /> })

    const [tableHead] = await screen.findAllByRole('table')
    expect(within(tableHead).getByRole('columnheader', { name: 'Resources' }))
      .to.exist
    expect(within(tableHead).getByRole('columnheader', { name: 'Status' })).to
      .exist
    expect(within(tableHead).getByRole('columnheader', { name: 'Used By' })).to
      .exist
  })

  it('should display resources in use for configured obsmode & for conflicting non-configurable resources | ESW-453', async () => {
    renderWithAuth({
      ui: <Resources />,
      mockClients: mockServices.serviceFactoryContext
    })

    expect(screen.getAllByText('Resources')).to.length(2)
    //Find resources table
    const [, tableBody] = await screen.findAllByRole('table')
    const [conflictingTCSRow, nonConflictingNFARIOSRow]: HTMLElement[] = within(
      tableBody
    ).getAllByRole('row', {
      name: /InUse/i
    })
    expect(
      within(nonConflictingNFARIOSRow).getByRole('cell', { name: 'NFARIOS' })
    )
    expect(
      within(nonConflictingNFARIOSRow).getByRole('cell', { name: 'InUse' })
    )
    expect(
      within(nonConflictingNFARIOSRow).getByRole('cell', {
        name: 'DarkNight_1'
      })
    )
    expect(within(conflictingTCSRow).getByRole('cell', { name: 'TCS' }))
    expect(within(conflictingTCSRow).getByRole('cell', { name: 'InUse' }))
    expect(within(conflictingTCSRow).getByRole('cell', { name: 'DarkNight_1' }))
  })
  it('should display available resources for configurable obsmodes | ESW-453', async () => {
    renderWithAuth({
      ui: <Resources />,
      mockClients: mockServices.serviceFactoryContext
    })

    expect(screen.getAllByText('Resources')).to.length(2)
    //Find resources table
    const [, tableBody] = await screen.findAllByRole('table')
    const [wfosRow, irisRow]: HTMLElement[] = within(tableBody).getAllByRole(
      'row',
      {
        name: /Available/i
      }
    )
    expect(within(irisRow).getByRole('cell', { name: 'IRIS' }))
    expect(within(irisRow).getByRole('cell', { name: 'Available' }))
    expect(within(irisRow).getByRole('cell', { name: 'NA' }))
    expect(within(wfosRow).getByRole('cell', { name: 'WFOS' }))
    expect(within(wfosRow).getByRole('cell', { name: 'Available' }))
    expect(within(wfosRow).getByRole('cell', { name: 'NA' }))
  })
})
