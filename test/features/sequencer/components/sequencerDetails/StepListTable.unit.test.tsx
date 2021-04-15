import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, StepList } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { StepListTable } from '../../../../../src/features/sequencer/components/sequencerDetails/StepListTable'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('stepList table', () => {
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService

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

  it('should show all the steps within a column | ESW-456', async () => {
    when(sequencerService.getSequence()).thenResolve(stepList)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          stepListStatus={'In Progress'}
          setSelectedStep={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    screen.getByRole('columnheader', {
      name: 'Sequence Steps Status: In Progress'
    })

    await findCell('1 Command-1 more')
    await findCell('2 Command-2 more')
    verify(sequencerService.getSequence()).called()
  })

  it('should not show any step data if no sequence is running | ESW-456', async () => {
    when(sequencerService.getSequence()).thenResolve(undefined)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          stepListStatus={'NA'}
          setSelectedStep={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    screen.getByRole('columnheader', {
      name: 'Sequence Steps Status: NA'
    })

    await findCell('No Data')
    verify(sequencerService.getSequence()).called()
  })

  it('should not show any step data if there is an error while api call | ESW-456', async () => {
    when(sequencerService.getSequence()).thenReject(Error())

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          stepListStatus={'NA'}
          setSelectedStep={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    screen.getByRole('columnheader', {
      name: 'Sequence Steps Status: NA'
    })

    await findCell('No Data')
    verify(sequencerService.getSequence()).called()
  })

  it('should show stepActions menu | ESW-459, ESW-490', async () => {
    when(sequencerService.getSequence()).thenResolve(stepList)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          stepListStatus={'In Progress'}
          setSelectedStep={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const actions = await screen.findAllByRole('stepActions')

    userEvent.click(actions[0], { button: 0 })

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    // ESW-459
    await screen.findByText('Insert breakpoint')
    //ESW-490
    await screen.findByText('Delete')

    await screen.findByText('Add a step')
    await screen.findByText('Duplicate')
  })

  it('should hide stepActions menu after clicking menu | ESW-490', async () => {
    const stepList = new StepList([
      {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
    ])
    when(sequencerService.getSequence()).thenResolve(stepList)
    when(sequencerService.addBreakpoint('step1')).thenResolve({ _type: 'Ok' })

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          stepListStatus={'In Progress'}
          setSelectedStep={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const actions = await screen.findAllByRole('stepActions')
    userEvent.click(actions[0], { button: 0 })

    const menuItems = await screen.findAllByRole('menuitem')
    expect(menuItems.length).to.equal(4)

    // ESW-459
    const insertBreakpoint = await screen.findByText('Insert breakpoint')

    userEvent.click(insertBreakpoint, { button: 0 })

    await screen.findByText('Successfully inserted breakpoint')

    await waitFor(() => {
      const menuItems = screen.queryAllByRole('menuitem')
      expect(menuItems.length).to.equal(0)
    })
  })
})

const findCell = (name: string) => screen.findByRole('cell', { name })
