import { AgentStatus, ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { verify, when } from 'ts-mockito'
import AgentCards from '../../../../src/features/agent/agentCards/AgentCards'
import {
  getMockServices,
  renderWithAuth,
  screen,
  waitFor
} from '../../../utils/test-utils'
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

  it('should render agents when getAgentStatus returns agents', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })
    await waitFor(() => {
      return screen.getByText(/esw.machine1/i)
    })
    expect(screen.getByText(/esw.machine1/i)).exist
    expect(screen.getByText(/esw.esw1/i)).exist
    expect(screen.getByText(/esw.esw2/i)).exist
    expect(screen.getByText(/esw.darkNight/i)).exist
    expect(screen.getAllByRole('deleteSeqCompIcon')).length(2)
    expect(screen.getByRole('addSeqCompIcon')).exist

    // esw.esw1 is with sequencer hence unload icon will appear
    expect(screen.getByRole('unloadScriptIcon')).exist
    // esw.esw2 is withour sequencer hence load icon will appear
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
    await waitFor(() => {
      return screen.getByText(/esw.machine1/i)
    })
    expect(screen.getByText(/esw.machine1/i)).exist
    expect(screen.getByText(/esw.machine2/i)).exist
    expect(screen.getAllByRole('deleteSeqCompIcon')).length(2)
    expect(screen.getAllByRole('addSeqCompIcon')).length(2)
  })

  it('should render agents when getAgentStatus returns orphan seqComps', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: [
        {
          seqCompId: new ComponentId(
            Prefix.fromString('IRIS.comp1'),
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
    await waitFor(() => {
      return screen.getByText(/esw.machine1/i)
    })
    expect(screen.getByText(/esw.machine1/i)).exist
    expect(screen.getByText(/IRIS.comp1/i)).exist
    expect(screen.getByText(/unknown/i)).exist
  })

  it('should render empty agents when getAgentStatus returns locationServiceError', async () => {
    when(smService.getAgentStatus()).thenResolve({
      _type: 'LocationServiceError',
      reason: 'Failed to fetch agents location'
    })
    renderWithAuth({
      ui: <AgentCards />,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.queryByText(/esw.machine1/i)).null
    expect(screen.queryByText(/IRIS.comp1/i)).null
    expect(screen.queryByText(/unknown/i)).null
  })

  it('should render empty agents when getAgentStatus returns unhandled error', async () => {
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
    expect(screen.queryByText(/esw.machine1/i)).null
    expect(screen.queryByText(/IRIS.comp1/i)).null
    expect(screen.queryByText(/unknown/i)).null
  })
})
