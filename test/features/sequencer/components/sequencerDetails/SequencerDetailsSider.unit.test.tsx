import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, StepList } from '@tmtsoftware/esw-ts'
import type { Step } from '@tmtsoftware/esw-ts/lib/src'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { SequencerDetailsSider } from '../../../../../src/features/sequencer/components/sequencerDetails/SequencerDetailsSider'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

const getStepList = (status: Step['status']['_type'], hasBreakpoint = false) =>
  new StepList([
    {
      hasBreakpoint: hasBreakpoint,
      status: { _type: status, message: '' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: 'step1'
    }
  ])

describe('SequenceDetailsSider', () => {
  it('should render duplicate table | ESW-462', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <SequencerDetailsSider
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    userEvent.click(duplicate)

    expect(screen.getByRole('button', { name: /copy duplicate/i })).to.exist
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should render stepList table after cancel | ESW-462', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <SequencerDetailsSider
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    userEvent.click(duplicate)

    const cancel = screen.getByRole('button', {
      name: 'Cancel'
    })
    userEvent.click(cancel)

    const stepAction = await screen.findAllByRole('stepActions')
    expect(stepAction.length).to.greaterThan(0)
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should duplicate selected commands in selected order | ESW-462', async () => {
    const command1 = new Setup(Prefix.fromString('ESW.test'), 'Command-1')
    const command2 = new Setup(Prefix.fromString('ESW.test'), 'Command-2')

    const stepList: StepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Success' },
        command: command1,
        id: 'step1'
      },
      {
        hasBreakpoint: false,
        status: { _type: 'InFlight' },
        command: command2,
        id: 'step2'
      }
    ])

    when(sequencerServiceMock.add(deepEqual([command2, command1]))).thenResolve(
      {
        _type: 'Ok'
      }
    )
    when(sequencerServiceMock.getSequence()).thenResolve(stepList)
    renderWithAuth({
      ui: (
        <SequencerDetailsSider
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    userEvent.click(duplicate)

    // select command to duplicate
    const command1Row = screen.getByRole('row', {
      name: /1 command-1/i
    })
    const command2Row = screen.getByRole('row', {
      name: /2 command-2/i
    })

    // click on the checkbox
    userEvent.click(within(command2Row).getByRole('checkbox'))
    userEvent.click(within(command1Row).getByRole('checkbox'))
    // click on duplicate
    userEvent.click(screen.getByRole('button', { name: /copy duplicate/i }))

    await screen.findByText('Successfully duplicated steps')
    verify(sequencerServiceMock.getSequence()).called()
    verify(sequencerServiceMock.add(deepEqual([command2, command1]))).called()
  })

  it.only('should not duplicate steps if error occurred | ESW-462', async () => {
    const command = new Setup(Prefix.fromString('ESW.test'), 'Command-1')

    when(sequencerServiceMock.add(deepEqual([command]))).thenResolve({
      _type: 'Unhandled',
      msg: 'error',
      messageType: 'Duplicate',
      state: 'Loaded'
    })
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <SequencerDetailsSider
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    userEvent.click(duplicate)

    // select command to duplicate
    const row = screen.getByRole('row', {
      name: /1 command-1/i
    })

    const duplicateAction = screen.getByRole('button', {
      name: /copy duplicate/i
    }) as HTMLButtonElement

    expect(duplicateAction.disabled).to.be.true

    // click on the checkbox
    userEvent.click(within(row).getByRole('checkbox'))
    // click on duplicate
    userEvent.click(duplicateAction)

    await screen.findByText('Failed to duplicate steps, reason: error')
    const stepAction = await screen.findAllByRole('stepActions')
    expect(stepAction.length).to.be.greaterThan(0)
    verify(sequencerServiceMock.getSequence()).called()
    verify(sequencerServiceMock.add(deepEqual([command]))).called()
  })
})
