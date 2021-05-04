import { cleanup, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentStatus, ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { deepEqual, verify, when } from 'ts-mockito'
import { AgentCards } from '../../../../src/features/agent/components/AgentCards'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

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
  const agentService = mockServices.mock.agentService
  afterEach(() => {
    cleanup()
  })

  it('should render agents when getAgentStatus returns agents | ESW-443', async () => {
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
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
    expect(screen.getByRole('loadScript')).exist
    verify(agentService.getAgentStatus()).called()
  })

  it('should render multiple agents', async () => {
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus, emptyAgentStatus],
      seqCompsWithoutAgent: []
    })
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })

    await screen.findByText('ESW.machine1')
    expect(screen.getByText('ESW.machine1')).exist
    expect(screen.getByText('ESW.machine2')).exist
    expect(screen.getAllByRole('deleteSeqCompIcon')).length(2)
    expect(screen.getAllByRole('addSeqCompIcon')).length(2)
    verify(agentService.getAgentStatus()).called()
  })

  it('should render agents when getAgentStatus returns orphan seqComps | ESW-443', async () => {
    when(agentService.getAgentStatus()).thenResolve({
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
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })

    await screen.findByText('ESW.machine1')
    expect(screen.getByText('ESW.machine1')).exist
    expect(screen.getByText('IRIS.comp1')).exist
    expect(screen.getByText('Unknown')).exist
    expect(screen.getByText('IRIS.comp1')).exist
    expect(screen.getByText('[IRIS.clearskies]')).exist
    expect(screen.getByText('TCS.comp1')).exist
    verify(agentService.getAgentStatus()).called()
  })

  it('should not render agents when getAgentStatus returns locationServiceError | ESW-443', async () => {
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'LocationServiceError',
      reason: 'Failed to fetch agents location'
    })
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })
    expect(screen.queryByText('ESW.machine1')).null
    expect(screen.queryByText('IRIS.comp1')).null
    expect(screen.queryByText('unknown')).null
    verify(agentService.getAgentStatus()).called()
  })

  it('should not render agents when getAgentStatus returns unhandled error | ESW-443', async () => {
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Unhandled',
      msg: 'failed to process getAgentStatus',
      messageType: 'ServiceError',
      state: ''
    })
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })
    expect(screen.queryByText('ESW.machine1')).null
    expect(screen.queryByText('IRIS.comp1')).null
    expect(screen.queryByText('unknown')).null
    verify(agentService.getAgentStatus()).called()
  })

  it('should add sequence components on agent| ESW-446', async () => {
    when(
      agentService.spawnSequenceComponent(
        deepEqual(Prefix.fromString('ESW.machine1')),
        deepEqual('ESW_1')
      )
    ).thenResolve({ _type: 'Spawned' })

    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })
    const icon = await screen.findByRole('addSeqCompIcon')

    userEvent.click(icon)
    const inputBox = await screen.findByText('Component name:')
    expect(inputBox).to.exist
    const textbox = screen.getByRole('textbox')

    await waitFor(() => userEvent.click(textbox))
    userEvent.type(textbox, 'ESW_1')
    userEvent.click(screen.getByRole('button', { name: 'OK' }))

    await screen.findByText(
      'Successfully spawned Sequence Component: ESW.ESW_1'
    )

    verify(agentService.getAgentStatus()).called()
  })

  it('should kill sequence components on agent| ESW-446', async () => {
    const seqCompPrefix = new Prefix('ESW', 'ESW1')
    when(
      agentService.killComponent(
        deepEqual(new ComponentId(seqCompPrefix, 'SequenceComponent'))
      )
    ).thenResolve({ _type: 'Killed' })

    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })
    const [deleteIcon] = await screen.findAllByRole('deleteSeqCompIcon')
    userEvent.click(deleteIcon)

    await screen.findByText(
      `Do you want to delete ${seqCompPrefix.toJSON()} sequence component?`
    )

    const document = screen.getByRole('document')
    const confirm = within(document).getByRole('button', { name: /delete/i })

    userEvent.click(confirm)

    await screen.findByText(/Successfully killed Sequence Component/)

    verify(agentService.getAgentStatus()).called()
  })

  it('should change the location on click of sequencer | ESW-492', async () => {
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })

    const sequencer = await screen.findByText('[ESW.darkNight]')
    userEvent.click(sequencer)

    expect(window.location.pathname).to.equal('/sequencer')
    expect(window.location.search).to.equal('?prefix=ESW.darkNight')

    verify(agentService.getAgentStatus()).called()
  })
})
