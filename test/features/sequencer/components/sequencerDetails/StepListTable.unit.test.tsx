import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, Step, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { anything, deepEqual, verify, when } from 'ts-mockito'
import { StepListTable } from '../../../../../src/features/sequencer/components/sequencerDetails/StepListTable'
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

  const testData: [Step['status']['_type'], string, string, string][] = [
    [
      'Success',
      'All Steps Completed',
      'ant-typography-secondary',
      'rgba(0, 0, 0, 0.45)'
    ],
    ['Failure', 'Failed', 'ant-typography-danger', 'rgb(255, 77, 79)'],
    ['InFlight', 'In Progress', 'ant-typography-success', 'rgb(82, 196, 26)'],
    ['Pending', 'Paused', 'ant-typography-warning', 'rgb(255, 197, 61)']
  ]

  testData.forEach(
    ([lastStepStatus, stepListStatus, className, borderColor]) => {
      it(`should show stepListStatus as ${stepListStatus} and verify ${lastStepStatus} step has ${className} css class | ESW-456`, async () => {
        when(sequencerServiceMock.getSequence()).thenResolve(
          getStepList(lastStepStatus)
        )

        renderWithAuth({
          ui: (
            <StepListTable
              sequencerPrefix={sequencerPrefix}
              setSelectedStep={() => ({})}
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

        verify(sequencerServiceMock.getSequence()).called()
      })
    }
  )

  it('should show all the steps within a column | ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(stepList)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
        />
      )
    })

    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(
      `Sequence Steps\nStatus:\nIn Progress`
    )

    await findCell('1 Command-1 more')
    await findCell('2 Command-2 more')
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should not show any step data if no sequence is running | ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(undefined)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
        />
      )
    })

    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(`Sequence Steps\nStatus:\nNA`)

    await findCell('No Data')
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should not show any step data if there is an error while api call | ESW-456', async () => {
    when(sequencerServiceMock.getSequence()).thenReject(Error())

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
        />
      )
    })

    const stepListTitle = await screen.findByRole('stepListTitle')
    expect(stepListTitle.innerText).to.equals(`Sequence Steps\nStatus:\nNA`)

    await findCell('No Data')
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should show stepActions menu | ESW-459, ESW-490', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(stepList)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
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

    const stepListAfterBreakpoint = getStepList('Pending', true)
    when(sequencerServiceMock.getSequence())
      .thenResolve(stepList)
      .thenResolve(stepListAfterBreakpoint)
    when(sequencerServiceMock.addBreakpoint('step1')).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
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

    await waitFor(() => {
      const menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).to.equal(0)
    })

    const stepActions = await screen.findAllByRole('stepActions')
    userEvent.click(stepActions[0])
    await screen.findByText('Remove breakpoint')
  })

  it('should render duplicate table | ESW-462', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
          selectedStep={undefined}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0])

    const duplicate = await screen.findByText('Duplicate')
    await waitFor(() => userEvent.click(duplicate))

    expect(screen.getByRole('button', { name: /copy duplicate/i })).to.exist
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should render stepList table after cancel | ESW-462', async () => {
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
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

    await waitFor(() =>
      expect(screen.queryAllByRole('checkbox').length).to.equals(0)
    )
    verify(sequencerServiceMock.getSequence()).called()
  })

  it('should duplicate selected commands | ESW-462', async () => {
    const command1 = new Setup(Prefix.fromString('ESW.test'), 'Command-1')
    const command2 = new Setup(Prefix.fromString('ESW.test'), 'Command-2')

    when(sequencerServiceMock.add(deepEqual([command1, command2]))).thenResolve(
      {
        _type: 'Ok'
      }
    )
    when(sequencerServiceMock.getSequence()).thenResolve(stepList)
    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
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
    await waitFor(() =>
      expect(screen.queryAllByRole('checkbox').length).to.equals(0)
    )
    verify(sequencerServiceMock.getSequence()).called()
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
    when(sequencerServiceMock.getSequence()).thenResolve(getStepList('Pending'))
    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={Prefix.fromString('ESW.irisDarkNight')}
          setSelectedStep={() => ({})}
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
    await waitFor(() =>
      expect(screen.queryAllByRole('checkbox').length).to.equals(0)
    )
    verify(sequencerServiceMock.getSequence()).called()
    verify(sequencerServiceMock.add(deepEqual([command]))).called()
  })

  it('should add red border to step with breakpoint | ESW-459', async () => {
    const stepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
    ])

    const stepListAfterBreakpoint = new StepList([
      {
        hasBreakpoint: true,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
    ])
    when(sequencerServiceMock.getSequence())
      .thenResolve(stepList)
      .thenResolve(stepListAfterBreakpoint)

    when(sequencerServiceMock.addBreakpoint('step1')).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0])

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    const stepBeforeBreakpoint = screen.getByRole('button', {
      name: /command-1/i
    })

    expect(stepBeforeBreakpoint.style.borderLeft).to.equals(
      '1px solid rgb(255, 197, 61)'
    )
    // ESW-459
    const insertBreakpoint = await screen.findByText('Insert breakpoint')
    await waitFor(() => userEvent.click(insertBreakpoint))

    const stepAfterBreakpoint = screen.getByRole('button', {
      name: /command-1/i
    })

    await waitFor(() =>
      expect(stepAfterBreakpoint.style.borderLeft).to.equals('1rem solid red')
    )
  })

  it('add steps should add uploaded steps after the selected step | ESW-461', async () => {
    const commandToInsert: Setup = new Setup(sequencerPrefix, 'command-2')

    const file = new File(
      [JSON.stringify({ commands: [commandToInsert] })],
      'commands.json'
    )

    const stepList = getStepList('Pending', false)

    const stepListAfterInsertion = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(sequencerPrefix, 'Command-1'),
        id: 'step1'
      },
      {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: commandToInsert,
        id: 'step2'
      }
    ])
    when(sequencerServiceMock.getSequence())
      .thenResolve(stepList)
      .thenResolve(stepListAfterInsertion)

    when(sequencerServiceMock.insertAfter('step1', anything())).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          setSelectedStep={() => ({})}
        />
      )
    })

    const actions = await screen.findAllByRole('stepActions')
    await waitFor(() => userEvent.click(actions[0]))

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    const addSteps = await screen.findByRole('button', { name: /add steps/i })
    await waitFor(() => userEvent.click(addSteps)) // click to open uplaod dialogue

    // eslint-disable-next-line testing-library/no-node-access
    const inputBox = addSteps.firstChild as HTMLInputElement
    await waitFor(() => userEvent.upload(inputBox, file)) // upload the file with command

    await screen.findByText('Successfully added steps')
    verify(
      sequencerServiceMock.insertAfter('step1', deepEqual([commandToInsert]))
    ).called()

    // assert step is added
    await screen.findByRole('row', { name: /1 command-1/i })
    await screen.findByRole('row', { name: /2 command-2/i })
  })
})

const findCell = (name: string) => screen.findByRole('cell', { name })
