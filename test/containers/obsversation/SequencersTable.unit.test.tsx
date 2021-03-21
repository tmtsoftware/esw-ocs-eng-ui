import { screen, within } from '@testing-library/react'
import { ObsMode, Setup, Step, Subsystem } from '@tmtsoftware/esw-ts'
import React from 'react'
import { mock, when } from 'ts-mockito'
import { SequencersTable } from '../../../src/containers/observation/SequencersTable'
import { getMockServices, renderWithAuth } from '../../utils/test-utils'

describe('sequencer table', () => {
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService

  const step = (
    stepStatus: 'Pending' | 'Success' | 'Failure' | 'InFlight',
    hasBreakpoint = false
  ): Step => {
    return {
      hasBreakpoint: hasBreakpoint,
      status: { _type: stepStatus, message: '' },
      command: mock(Setup),
      id: ''
    }
  }

  const stepList1: Step[] = [step('Pending', true), step('Pending')]
  const stepList2: Step[] = [step('Success'), step('Failure'), step('Pending')]
  const stepList3: Step[] = [step('InFlight'), step('Pending')]
  const stepList4: Step[] = [step('Success'), step('Success')]

  it('should be able to render SequencersTable successfully | ESW-451', async () => {
    const obsMode: ObsMode = new ObsMode('DarkNight_1')
    const sequencers: Subsystem[] = ['ESW', 'APS', 'DPS', 'CIS', 'AOESW']

    when(sequencerService.getSequence())
      .thenResolve(stepList1)
      .thenResolve(stepList2)
      .thenResolve(stepList3)
      .thenResolve(stepList4)
      .thenReject(Error())

    renderWithAuth({
      ui: <SequencersTable obsMode={obsMode} sequencers={sequencers} />,
      mockClients: mockServices.serviceFactoryContext
    })

    await assertTable()
  })
})

//******************utility functions*****************
const assertTable = async () => {
  await screen.findByRole('table')

  await assertHeader('Sequencers')
  await assertHeader('Current Step')
  await assertHeader('Total Steps')

  await assertRow(/edit esw\.darknight_1 step 1 paused 2/i, [
    'edit ESW.DarkNight_1',
    'Step 1 Paused',
    '2'
  ])

  await assertRow(/edit aps\.darknight_1 step 2 failed 3/i, [
    'edit APS.DarkNight_1',
    'Step 2 Failed',
    '3'
  ])

  await assertRow(/edit dps\.darknight_1 step 1 in progress 2/i, [
    'edit DPS.DarkNight_1',
    'Step 1 In Progress',
    '2'
  ])

  await assertRow(/edit cis\.darknight_1 all steps completed 2/i, [
    'edit CIS.DarkNight_1',
    'All Steps Completed',
    '2'
  ])

  await assertRow(/edit aoesw\.darknight_1 failed to fetch status na/i, [
    'edit AOESW.DarkNight_1',
    'Failed to Fetch Status',
    'NA'
  ])
}

const assertHeader = async (colName: string) => {
  await screen.findByRole('columnheader', {
    name: colName
  })
}

const assertRow = async (rowName: RegExp, cells: string[]) => {
  const row: HTMLElement = screen.getByRole('row', {
    name: rowName
  })

  for (let index = 0; index < cells.length; index++) {
    await assertCell(row, cells[index])
  }
}

const assertCell = async (row: HTMLElement, cellName: string) => {
  await within(row).findByRole('cell', {
    name: cellName
  })
}
