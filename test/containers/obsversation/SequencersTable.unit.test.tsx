import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import { SequencersTable } from '../../../src/features/sequencer/components/SequencersTable'
import {
  getCurrentStepCommandName,
  SequencerInfo,
  StepListStatus
} from '../../../src/features/sequencer/utils'
import { step } from '../../utils/sequence-utils'
import { renderWithAuth } from '../../utils/test-utils'
import type { SequencerState } from '@tmtsoftware/esw-ts/lib/src'

describe('sequencer table', () => {
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

  it('should be able to render SequencersTable successfully | ESW-451, ESW-496', async () => {
    const eswPrefix = 'ESW.DarkNight_1'
    const apsPrefix = 'APS.DarkNight_1'
    const dpsPrefix = 'DPS.DarkNight_1'
    const cisPrefix = 'CIS.DarkNight_1'

    const sequencersInfo: SequencerInfo[] = [
      makeSequencerInfo(eswPrefix, stepList1, 'Paused', 1, 'Loaded'),
      makeSequencerInfo(apsPrefix, stepList2, 'Failed', 2, 'Running'),
      makeSequencerInfo(dpsPrefix, stepList3, 'In Progress', 1, 'Loaded'),
      makeSequencerInfo(
        cisPrefix,
        stepList4,
        'All Steps Completed',
        0,
        'Loaded'
      )
    ]

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencersTable sequencersInfo={sequencersInfo} loading={false} />
        </BrowserRouter>
      )
    })

    await assertTable()
  })

  it('should be able to render status NA if no sequence present | ESW-451', async () => {
    const sequencersInfo: SequencerInfo[] = [
      {
        key: 'ESW.darknight',
        prefix: 'ESW.darknight',
        currentStepCommandName: getCurrentStepCommandName(undefined),
        stepListStatus: { status: 'NA', stepNumber: 0 },
        sequencerState: { _type: 'Idle' },
        totalSteps: 0
      }
    ]

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencersTable sequencersInfo={sequencersInfo} loading={false} />
        </BrowserRouter>
      )
    })

    await assertHeaders()
    await screen.findByRole('table')
    await screen.findByRole('row', {
      name: /setting esw\.darknight na na/i
    })
  })

  it('should change the location on click of sequencer | ESW-492', async () => {
    const sequencersInfo: SequencerInfo[] = [
      {
        key: 'ESW.darknight',
        prefix: 'ESW.darknight',
        currentStepCommandName: getCurrentStepCommandName(undefined),
        stepListStatus: { status: 'NA', stepNumber: 0 },
        sequencerState: { _type: 'Idle' },
        totalSteps: 0
      }
    ]

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <SequencersTable sequencersInfo={sequencersInfo} loading={false} />
        </BrowserRouter>
      )
    })

    const sequencer = await screen.findByRole('link')
    userEvent.click(sequencer)

    expect(window.location.pathname).to.equal('/sequencer')
    expect(window.location.search).to.equal('?prefix=ESW.darknight')
  })
})

const assertHeaders = async () => {
  await assertHeader('Sequencers')
  await assertHeader('Current Step')
  await assertHeader('Sequence Status')
  await assertHeader('Total Steps')
}

//******************utility functions*****************
const assertTable = async () => {
  await screen.findByRole('table')

  await assertHeaders()

  await assertRow(/setting esw\.darknight_1/i, [
    'setting ESW.DarkNight_1',
    'command-11',
    'Step 1 Paused',
    '2'
  ])

  await assertRow(/aps\.darknight_1/i, [
    'setting APS.DarkNight_1',
    'command-22',
    'Step 2 Failed',
    '3'
  ])

  await assertRow(/dps\.darknight_1/i, [
    'setting DPS.DarkNight_1',
    'command-31',
    'Step 1 In Progress',
    '2'
  ])

  await assertRow(/cis\.darknight_1/i, [
    'setting CIS.DarkNight_1',
    'NA',
    'All Steps Completed',
    '2'
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

const makeSequencerInfo = (
  prefix: string,
  stepList: StepList,
  stepListState: StepListStatus,
  stepNumber: number,
  sequencerState: SequencerState['_type']
): SequencerInfo => {
  return {
    key: prefix,
    prefix: prefix,
    currentStepCommandName: getCurrentStepCommandName(stepList),
    stepListStatus: { status: stepListState, stepNumber },
    sequencerState: { _type: sequencerState },
    totalSteps: stepList.steps.length
  }
}
