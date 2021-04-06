import { screen } from '@testing-library/react'
import { Prefix, Setup, Step } from '@tmtsoftware/esw-ts'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { StepListTable } from '../../../../src/features/sequencer/components/StepListTable'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('stepList table', () => {
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService

  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  const stepList: Step[] = [
    {
      hasBreakpoint: false,
      status: { _type: 'Success' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: ''
    },
    {
      hasBreakpoint: false,
      status: { _type: 'InFlight' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-2'),
      id: ''
    }
  ]

  it('should show all the steps within a column | ESW-456', async () => {
    when(sequencerService.getSequence()).thenResolve(stepList)

    renderWithAuth({
      ui: (
        <StepListTable
          sequencerPrefix={sequencerPrefix}
          stepListStatus={'In Progress'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    screen.getByRole('columnheader', {
      name: /sequence steps status: in progress/i
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
          stepListStatus={'In Progress'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    screen.getByRole('columnheader', {
      name: /sequence steps status: in progress/i
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
          stepListStatus={'In Progress'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    screen.getByRole('columnheader', {
      name: /sequence steps status: in progress/i
    })

    await findCell('No Data')
    verify(sequencerService.getSequence()).called()
  })
})

const findCell = (name: string) => screen.findByRole('cell', { name })
