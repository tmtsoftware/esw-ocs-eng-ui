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
    expect(within(conflictingTCSRow).getByRole('cell', { name: 'TCS' })).to
      .exist
    expect(within(conflictingTCSRow).getByRole('cell', { name: 'InUse' })).to
      .exist
    expect(within(conflictingTCSRow).getByRole('cell', { name: 'DarkNight_1' }))
      .to.exist
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
    expect(within(irisRow).getByRole('cell', { name: 'IRIS' })).to.exist
    expect(within(irisRow).getByRole('cell', { name: 'Available' })).to.exist
    expect(within(irisRow).getByRole('cell', { name: 'NA' })).to.exist
    expect(within(wfosRow).getByRole('cell', { name: 'WFOS' })).to.exist
    expect(within(wfosRow).getByRole('cell', { name: 'Available' })).to.exist
    expect(within(wfosRow).getByRole('cell', { name: 'NA' })).to.exist
  })

  it('should sort InUse resources to top of the table | ESW-453', async () => {
    renderWithAuth({
      ui: <Resources />,
      mockClients: mockServices.serviceFactoryContext
    })

    expect(screen.getAllByText('Resources')).to.length(2)

    const [, tableBody] = await screen.findAllByRole('table')
    const rows: HTMLElement[] = within(tableBody).getAllByRole('row')

    expect(within(rows[0]).getByRole('cell', { name: 'InUse' })).to.exist
    expect(within(rows[1]).getByRole('cell', { name: 'InUse' })).to.exist
    expect(within(rows[2]).getByRole('cell', { name: 'Available' })).to.exist
    expect(within(rows[3]).getByRole('cell', { name: 'Available' })).to.exist
  })
})
