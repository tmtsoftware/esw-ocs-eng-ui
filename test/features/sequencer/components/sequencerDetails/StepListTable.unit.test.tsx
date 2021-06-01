import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, Step, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { getRunningStep, StepListTable } from '../../../../../src/features/sequencer/components/steplist/StepListTable'
import { getStep, getStepList } from '../../../../utils/sequence-utils'
import { renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'

describe('stepList table', () => {
  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  const stepList: StepList = new StepList([
    {
      hasBreakpoint: false,
      status: { _type: 'Success' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: 'step1'
    },
    {
      hasBreakpoint: false,
      status: { _type: 'InFlight' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-2'),
      id: 'step2'
    }
  ])

  const testData: [Step['status']['_type'], boolean, string, string, string][] = [
    ['Success', false, 'All Steps Completed', 'ant-typography-secondary', 'rgba(0, 0, 0, 0.45)'],
    ['Failure', false, 'Failed', 'ant-typography-danger', 'rgb(255, 77, 79)'],
    ['InFlight', false, 'In Progress', 'ant-typography-success', 'rgb(82, 196, 26)'],
    ['Pending', true, 'Paused', 'ant-typography-warning', 'rgb(255, 197, 61) rgb(255, 197, 61) rgb(255, 197, 61) red'],
    ['Pending', false, 'Loaded', 'ant-typography-warning', 'rgb(255, 197, 61)']
  ]

  testData.forEach(([lastStepStatus, breakpoint, stepListStatus, className, borderColor]) => {
    it(`should show stepListStatus as ${stepListStatus} and verify ${lastStepStatus} step has ${className} css class | ESW-456`, async () => {
      renderWithAuth({
        ui: (
          <StepListTable
            isLoading={false}
            stepList={getStepList(lastStepStatus, breakpoint)}
            sequencerPrefix={sequencerPrefix}
            setSelectedStep={() => ({})}
            sequencerState={{ _type: 'Running' }}
          />
        )
      })

      const title = `Sequence Steps\nStatus:\n${stepListStatus}`

      const stepListTitle = await screen.findByRole('stepListTitle')
      expect(stepListTitle.innerText).to.equals(title)

      const htmlElement = await findCell('1 Command-1 more')

      const stepButton = within(htmlElement).getByRole('button')

      expect(stepButton.style.borderColor).to.equal(borderColor)
      // eslint-disable-next-line testing-library/no-node-access
      const spanElement = stepButton.firstChild as HTMLSpanElement

      expect(spanElement.classList.contains(className)).true
    })
  })

  it('should show all the steps within a column | ESW-456', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={stepList}
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
        />
      )
    })

    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(`Sequence Steps\nStatus:\nIn Progress`)

    await findCell('1 Command-1 more')
    await findCell('2 Command-2 more')
  })

  it('should not show any step data if no sequence is running | ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(undefined)

    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={new StepList([])}
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
        />
      )
    })

    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(`Sequence Steps\nStatus:\nNA`)

    await findCell('No Data')
  })

  it('should show stepActions menu | ESW-459, ESW-490', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={stepList}
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0], { button: 0 })

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    // ESW-459
    await screen.findByText('Insert breakpoint')
    //ESW-490
    await screen.findByText('Delete')

    await screen.findByText('Add steps')
    await screen.findByText('Duplicate')
  })

  it('should hide stepActions menu after clicking menu | ESW-490', async () => {
    const stepList = getStepList('Pending', false)

    when(sequencerServiceMock.addBreakpoint('step1')).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={stepList}
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    // ESW-459
    const insertBreakpoint = await screen.findByText('Insert breakpoint')

    await waitFor(() => userEvent.click(insertBreakpoint))

    await screen.findByText('Successfully inserted breakpoint')
    const stepBeforeBreakpoint = screen.getByRole('button', {
      name: /command-1/i
    })

    expect(stepBeforeBreakpoint.style.borderLeft).to.equals('1px solid rgb(255, 197, 61)')
  })

  it('should hide stepActions menu after clicking menu | ESW-490', async () => {
    const stepListAfterBreakpoint = new StepList([
      {
        hasBreakpoint: true,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
    ])

    when(sequencerServiceMock.removeBreakpoint('step1')).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={stepListAfterBreakpoint}
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    // ESW-459
    const removeBreakpoint = await screen.findByText('Remove breakpoint')

    await waitFor(() => userEvent.click(removeBreakpoint))

    await screen.findByText('Successfully removed breakpoint')
  })

  it('should render duplicate table | ESW-462', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={getStepList('Pending')}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    await waitFor(() => userEvent.click(duplicate))

    expect(screen.getByRole('button', { name: /copy duplicate/i })).to.exist
  })

  it('should render stepList table after cancel | ESW-462', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={getStepList('Pending')}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    await waitFor(() => userEvent.click(duplicate))

    const cancel = screen.getByRole('button', {
      name: 'Cancel'
    })
    userEvent.click(cancel)

    const stepAction = await screen.findAllByRole('stepActions')
    expect(stepAction.length).to.greaterThan(0)

    await waitFor(() => expect(screen.queryAllByRole('checkbox').length).to.equals(0))
  })

  it('should duplicate selected commands | ESW-462', async () => {
    const command1 = new Setup(Prefix.fromString('ESW.test'), 'Command-1')
    const command2 = new Setup(Prefix.fromString('ESW.test'), 'Command-2')

    when(sequencerServiceMock.add(deepEqual([command1, command2]))).thenResolve({
      _type: 'Ok'
    })
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={stepList}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    await waitFor(() => userEvent.click(duplicate))

    // select command to duplicate
    const command1Row = screen.getByRole('row', {
      name: /1 command-1/i
    })
    const command2Row = screen.getByRole('row', {
      name: /2 command-2/i
    })

    // click on the checkbox
    userEvent.click(within(command1Row).getByRole('checkbox'))
    userEvent.click(within(command2Row).getByRole('checkbox'))
    // click on duplicate
    userEvent.click(screen.getByRole('button', { name: /copy duplicate/i }))

    await screen.findByText('Successfully duplicated steps')
    await waitFor(() => expect(screen.queryAllByRole('checkbox').length).to.equals(0))
    verify(sequencerServiceMock.add(deepEqual([command1, command2]))).called()
  })

  it('should not duplicate steps if error occurred | ESW-462', async () => {
    const command = new Setup(Prefix.fromString('ESW.test'), 'Command-1')

    when(sequencerServiceMock.add(deepEqual([command]))).thenResolve({
      _type: 'Unhandled',
      msg: 'error',
      messageType: 'Duplicate',
      state: 'Loaded'
    })
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={getStepList('Pending')}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    await waitFor(() => userEvent.click(duplicate))

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
    await waitFor(() => expect(screen.queryAllByRole('checkbox').length).to.equals(0))
    verify(sequencerServiceMock.add(deepEqual([command]))).called()
  })

  it('should add red border to step with breakpoint | ESW-459', async () => {
    const stepListAfterBreakpoint = new StepList([
      {
        hasBreakpoint: true,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
    ])

    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={stepListAfterBreakpoint}
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
        />
      )
    })

    const stepAfterBreakpoint = screen.getByRole('button', {
      name: /command-1/i
    })

    await waitFor(() => expect(stepAfterBreakpoint.style.borderLeft).to.equals('1rem solid red'))
  })

  it('should show display Pause action when sequencer is in Running state and sequence is in Progress state | ESW-497, ESW-489, ESW-505', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={getStepList('Pending')}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
          selectedStep={undefined}
        />
      )
    })

    await screen.findByRole('PauseSequence')
    screen.getByRole('img', { name: 'pause-circle' })

    expect(screen.queryByRole('StartSequence')).to.null
    expect(screen.queryByRole('ResumeSequence')).to.null
  })

  it('should show display Resume action when sequencer is in Running state and sequence is paused | ESW-497, ESW-489, ESW-505', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={getStepList('Pending', true)}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Running' }}
          selectedStep={undefined}
        />
      )
    })

    await screen.findByRole('ResumeSequence')
    screen.getByRole('img', { name: 'play-circle' })

    expect(screen.queryByRole('StartSequence')).to.null
    expect(screen.queryByRole('PauseSequence')).to.null
  })

  it('should show display Start action when sequencer is in Loaded state | ESW-497, ESW-489, ESW-505', async () => {
    renderWithAuth({
      ui: (
        <StepListTable
          isLoading={false}
          stepList={getStepList('Pending')}
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          sequencerState={{ _type: 'Loaded' }}
          selectedStep={undefined}
        />
      )
    })

    await screen.findByRole('StartSequence')
    screen.getByRole('img', { name: 'play-circle' })

    expect(screen.queryByRole('ResumeSequence')).to.null
    expect(screen.queryByRole('PauseSequence')).to.null
  })
})

const findCell = (name: string) => screen.findByRole('cell', { name })

describe('getRunningStep', () => {
  it('should return first step when step is in Loaded state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Pending', '1'), getStep('Pending', '2')])
    expect(getRunningStep(stepList, 'Loaded')?.id).to.equals('1')
  })

  it('should return last step when step is in All Steps Completed state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Success', '1'), getStep('Success', '2')])
    expect(getRunningStep(stepList, 'All Steps Completed')?.id).to.equals('2')
  })

  it('should return Failure step when step is in Failed state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Success', '1'), getStep('Failure', '2'), getStep('Pending', '3')])
    expect(getRunningStep(stepList, 'Failed')?.id).to.equals('2')
  })

  it('should return first Pending step when step is in Paused state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Success', '1'), getStep('Pending', '2'), getStep('Pending', '3')])
    expect(getRunningStep(stepList, 'Paused')?.id).to.equals('2')
  })

  it('should return InFlight step when step is In Progress state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Success', '1'), getStep('InFlight', '2'), getStep('Pending', '3')])
    expect(getRunningStep(stepList, 'In Progress')?.id).to.equals('2')
  })

  it('should return undefined step when step is in Failed to Fetch Status state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Success', '1')])
    expect(getRunningStep(stepList, 'Failed to Fetch Status')?.id).to.equals(undefined)
  })

  it('should return undefined step when step is in NA state | ESW-501 ', () => {
    const stepList = new StepList([getStep('Success', '1')])
    expect(getRunningStep(stepList, 'NA')?.id).to.equals(undefined)
  })
})
