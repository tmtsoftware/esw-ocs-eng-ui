import { screen, within } from '@testing-library/react'
import { ObsMode, StepList, Subsystem } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { when } from 'ts-mockito'
import { SequencersTable } from '../../../src/features/sequencer/components/SequencersTable'
import { step } from '../../utils/sequence-utils'
import {
  mockServices,
  renderWithAuth,
  sequencerServiceMock
} from '../../utils/test-utils'

describe('sequencer table', () => {
  const locServiceMock = mockServices.mock.locationService
  when(locServiceMock.listByComponentType('Sequencer')).thenResolve([])

  const stepList1: StepList = new StepList([
    step('Pending', 'command-11', true),
    step('Pending', 'command-12')
  ])
  const stepList2: StepList = new StepList([
    step('Success', 'command-21'),
    step('Failure', 'command-22'),
    step('Pending', 'command-23')
  ])
  const stepList3: StepList = new StepList([
    step('InFlight', 'command-31'),
    step('Pending', 'command-32')
  ])
  const stepList4: StepList = new StepList([
    step('Success', 'command-41'),
    step('Success', 'command-42')
  ])

  it.only('should be able to render SequencersTable successfully | ESW-451', async () => {
    const obsMode: ObsMode = new ObsMode('DarkNight_1')
    const sequencers: Subsystem[] = ['ESW', 'APS', 'DPS', 'CIS', 'AOESW']

    when(sequencerServiceMock.getSequence())
      .thenResolve(stepList1)
      .thenResolve(stepList2)
      .thenResolve(stepList3)
      .thenResolve(stepList4)
      .thenReject(Error())

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencersTable obsMode={obsMode} sequencers={sequencers} />
        </BrowserRouter>
      )
    })

    await assertTable()
  })

  it('should be able to render status NA if no sequence present | ESW-451', async () => {
    const obsMode: ObsMode = new ObsMode('darknight')
    const sequencers: Subsystem[] = ['ESW']

    when(sequencerServiceMock.getSequence()).thenResolve(undefined)

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencersTable obsMode={obsMode} sequencers={sequencers} />
        </BrowserRouter>
      )
    })

    await assertHeaders()
    await screen.findByRole('table')
    await screen.findByRole('row', {
      name: /edit esw\.darknight na na/i
    })
  })
})

const assertHeaders = async () => {
  await assertHeader('Sequencers')
  await assertHeader('Sequence Status')
  await assertHeader('Total Steps')
}

//******************utility functions*****************
const assertTable = async () => {
  await screen.findByRole('table')

  await assertHeaders()

  await assertRow(/edit esw\.darknight_1/i, [
    'edit ESW.DarkNight_1',
    'command-11',
    'Step 1 Paused',
    '2'
  ])

  await assertRow(/aps\.darknight_1/i, [
    'edit APS.DarkNight_1',
    'command-22',
    'Step 2 Failed',
    '3'
  ])

  await assertRow(/dps\.darknight_1/i, [
    'edit DPS.DarkNight_1',
    'command-31',
    'Step 1 In Progress',
    '2'
  ])

  await assertRow(/cis\.darknight_1/i, [
    'edit CIS.DarkNight_1',
    'NA',
    'All Steps Completed',
    '2'
  ])

  const nonSpawnedSequencer: HTMLElement = screen.getByRole('row', {
    name: /aoesw\.darknight_1/i
  })

  assertCell(nonSpawnedSequencer, 'edit AOESW.DarkNight_1')
  assertCell(nonSpawnedSequencer, 'Failed to Fetch Status')
  const cells = await within(nonSpawnedSequencer).findAllByRole('cell', {
    name: 'NA'
  })

  expect(cells).to.length(2)
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
