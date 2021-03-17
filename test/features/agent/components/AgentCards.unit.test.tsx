import { cleanup, screen } from '@testing-library/react'
import { AgentStatus, ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import AgentCards from '../../../../src/features/agent/components/AgentCards'
import { getMockServices, renderWithAuth } from '../../../utils/test-utils'

const emptyAgentStatus: AgentStatus = {
  agentId: new ComponentId(Prefix.fromString('ESW.machine2'), 'Machine'),
  seqCompsStatus: []
}
const agentStatus: AgentStatus = {
  agentId: new ComponentId(Prefix.fromString('ESW.machine1'), 'Machine'),
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
            prefix: Prefix.fromString('ESW.darkNight')
          },
          metadata: {},
          uri: ''
        }
      ]
    },
    {
      seqCompId: new ComponentId(
        Prefix.fromString('ESW.ESW2'),
        'SequenceComponent'
      ),
      sequencerLocation: []
    }
  ]
}
describe('Agents Grid View', () => {
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService
  afterEach(() => {
    cleanup()
  })

  it('should render agents when getAgentStatus returns agents | ESW-443', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('ESW.machine1')
    expect(screen.getByText('ESW.machine1')).exist
    expect(screen.getByText('ESW.ESW1')).exist
    expect(screen.getByText('ESW.ESW2')).exist
    expect(screen.getByText('[ESW.darkNight]')).exist
    expect(screen.getAllByRole('deleteSeqCompIcon')).length(2)
    expect(screen.getByRole('addSeqCompIcon')).exist

    // ESW.esw1 is with sequencer hence unload icon will appear
    expect(screen.getByRole('unloadScriptIcon')).exist
    // ESW.esw2 is without sequencer hence load icon will appear
    expect(screen.getByRole('loadScriptIcon')).exist
    verify(smService.getAgentStatus()).called()
  })

  it('should render multiple agents', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus, emptyAgentStatus],
      seqCompsWithoutAgent: []
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('ESW.machine1')
    expect(screen.getByText('ESW.machine1')).exist
    expect(screen.getByText('ESW.machine2')).exist
    expect(screen.getAllByRole('deleteSeqCompIcon')).length(2)
    expect(screen.getAllByRole('addSeqCompIcon')).length(2)
    verify(smService.getAgentStatus()).called()
  })

  it('should render agents when getAgentStatus returns orphan seqComps | ESW-443', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: [
        {
          seqCompId: new ComponentId(
            Prefix.fromString('IRIS.comp1'),
            'SequenceComponent'
          ),
          sequencerLocation: [
            {
              _type: 'AkkaLocation',
              connection: {
                componentType: 'Sequencer',
                connectionType: 'akka',
                prefix: Prefix.fromString('IRIS.clearskies')
              },
              metadata: {},
              uri: ''
            }
          ]
        },
        {
          seqCompId: new ComponentId(
            Prefix.fromString('TCS.comp1'),
            'SequenceComponent'
          ),
          sequencerLocation: []
        }
      ]
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('ESW.machine1')
    expect(screen.getByText('ESW.machine1')).exist
    expect(screen.getByText('IRIS.comp1')).exist
    expect(screen.getByText('Unknown')).exist
    expect(screen.getByText('IRIS.comp1')).exist
    expect(screen.getByText('[IRIS.clearskies]')).exist
    expect(screen.getByText('TCS.comp1')).exist
    verify(smService.getAgentStatus()).called()
  })

  it('should not render agents when getAgentStatus returns locationServiceError | ESW-443', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'LocationServiceError',
      reason: 'Failed to fetch agents location'
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.queryByText('ESW.machine1')).null
    expect(screen.queryByText('IRIS.comp1')).null
    expect(screen.queryByText('unknown')).null
    verify(smService.getAgentStatus()).called()
  })

  it('should not render agents when getAgentStatus returns unhandled error | ESW-443', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Unhandled',
      msg: 'failed to process getAgentStatus',
      messageType: 'ServiceError',
      state: ''
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.queryByText('ESW.machine1')).null
    expect(screen.queryByText('IRIS.comp1')).null
    expect(screen.queryByText('unknown')).null
    verify(smService.getAgentStatus()).called()
  })
})
