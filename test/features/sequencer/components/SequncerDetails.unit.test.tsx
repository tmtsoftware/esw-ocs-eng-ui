import { screen } from '@testing-library/react'
import { AgentStatus, ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import SequencerDetails from '../../../../src/features/sequencer/components/SequencerDetails'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

describe('sequencer details', () => {
  const agentStatus: AgentStatus = {
    agentId: new ComponentId(Prefix.fromString('IRIS.machine1'), 'Machine'),
    seqCompsStatus: [
      {
        seqCompId: new ComponentId(
          Prefix.fromString('ESW.ESW1'),
          'SequenceComponent'
        ),
        sequencerLocation: [
          {
            _type: 'AkkaLocation',
            connection: {
              componentType: 'Sequencer',
              connectionType: 'akka',
              prefix: Prefix.fromString('IRIS.IRIS_Darknight')
            },
            metadata: {},
            uri: ''
          }
        ]
      }
    ]
  }

  it('Should render the sequencerDetails', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: (
        <SequencerDetails
          sequencer='IRIS.IRIS_Darknight'
          agentPrefix='IRIS.machine1'
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })

    const sequencerName = screen.getByText('IRIS.IRIS_Darknight')
    const agentName = screen.getByText('IRIS.machine1')
    const seqCompName = await screen.findByText('ESW.ESW1')

    expect(sequencerName).to.exist
    expect(agentName).to.exist
    expect(seqCompName).to.exist
  })

  it('should render the sequence and sequencer actions', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService

    renderWithAuth({
      ui: (
        <SequencerDetails
          sequencer='IRIS.IRIS_Darknight'
          agentPrefix='IRIS.machine1'
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })

    const loadButton = screen.getByRole('button', { name: 'Load Sequence' })
    const abortButton = screen.getByRole('button', { name: 'Abort sequence' })
    const goOffline = screen.getByRole('button', { name: 'Go offline' })

    expect(loadButton).to.exist
    expect(goOffline).to.exist
    expect(abortButton).to.exist

    expect(screen.getByRole('PlaySequencer')).to.exist
    expect(screen.getByRole('StopSequencer')).to.exist
    expect(screen.getByRole('ResetSequencer')).to.exist
  })
})
