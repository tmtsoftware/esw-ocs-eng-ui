import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { AgentStatus } from '@tmtsoftware/esw-ts'
import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { deepEqual, verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import {
  disabledSequencerActions,
  killSequenceComponentConstants,
  spawnSequenceComponentConstants
} from '../../../../src/features/agent/agentConstants'
import { AgentCards } from '../../../../src/features/agent/components/AgentCards'
import { reloadScriptConstants, stopSequencerConstants } from '../../../../src/features/sm/smConstants'
import {
  getAgentStatusMock,
  mockServices,
  renderWithAuth, sequencerServiceInstanceIris,
  sequencerServiceMock,
  sequencerServiceMockIris
} from '../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

const emptyAgentStatus: AgentStatus = {
  agentId: new ComponentId(Prefix.fromString('ESW.machine2'), 'Machine'),
  seqCompsStatus: []
}
const agentStatus: AgentStatus = getAgentStatusMock()

describe('Agents Grid View', () => {
  const agentServiceMock = mockServices.mock.agentService

  it('should render agents when getAgentStatus returns agents | ESW-443', async () => {
    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    expect(screen.getAllByRole('sequenceCompActions')).length(1)
    expect(screen.getAllByRole('sequencerActions')).length(1)
    expect(screen.getByRole('addSeqCompIcon')).exist

    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should render multiple agents', async () => {
    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    expect(screen.getAllByRole('sequenceCompActions')).length(1)
    expect(screen.getAllByRole('sequencerActions')).length(1)
    expect(screen.getAllByRole('addSeqCompIcon')).length(2)
    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should render agents when getAgentStatus returns orphan seqComps | ESW-443', async () => {
    when(agentServiceMock.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: [
        {
          seqCompId: new ComponentId(Prefix.fromString('IRIS.comp1'), 'SequenceComponent'),
          sequencerLocation: [
            {
              _type: 'PekkoLocation',
              connection: {
                componentType: 'Sequencer',
                connectionType: 'pekko',
                prefix: Prefix.fromString('IRIS.clearskies')
              },
              metadata: {},
              uri: ''
            }
          ]
        },
        {
          seqCompId: new ComponentId(Prefix.fromString('TCS.comp1'), 'SequenceComponent'),
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
    expect(screen.getByText('Standalone')).exist
    expect(screen.getByText('IRIS.comp1')).exist
    expect(screen.getByText('[IRIS.clearskies]')).exist
    expect(screen.getByText('TCS.comp1')).exist
    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should not render agents when getAgentStatus returns locationServiceError | ESW-443', async () => {
    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should not render agents when getAgentStatus returns unhandled error | ESW-443', async () => {
    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should add sequence components on agent| ESW-446', async () => {
    const user = userEvent.setup()
    when(
      agentServiceMock.spawnSequenceComponent(deepEqual(Prefix.fromString('ESW.machine1')), deepEqual('ESW_1'))
    ).thenResolve({ _type: 'Spawned' })

    when(agentServiceMock.getAgentStatus()).thenResolve({
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

    await user.click(icon)
    const inputBox = await screen.findByText('Add a sequence component')
    expect(inputBox).to.exist
    const textBox: HTMLInputElement = screen.getByRole('textbox')
    expect(textBox).to.exist

    await waitFor(() => user.click(textBox))
    await user.type(textBox, 'ESW_1')
    const confirmButton = screen.getByRole('button', { name: spawnSequenceComponentConstants.modalOkText })
    await user.click(confirmButton)

    await screen.findByText(spawnSequenceComponentConstants.getSuccessMessage('ESW.ESW_1'))

    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should kill sequence components on agent| ESW-446,  ESW-502', async () => {
    const user = userEvent.setup()
    const seqCompPrefix = new Prefix('ESW', 'ESW2')
    when(agentServiceMock.killComponent(deepEqual(new ComponentId(seqCompPrefix, 'SequenceComponent')))).thenResolve({
      _type: 'Killed'
    })

    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    // first find the dropdown menu
    const sequenceCompActions = await screen.findByRole('sequenceCompActions')
    await waitFor(() => user.click(sequenceCompActions))

    const killSequenceComponent = await screen.findByText(killSequenceComponentConstants.menuItemText)
    await waitFor(() => user.click(killSequenceComponent))
    await screen.findByText(killSequenceComponentConstants.getModalTitle(seqCompPrefix.toJSON()))

    // const document = screen.getByRole('document')
    // const confirm = within(document).getByRole('button', { name: killSequenceComponentConstants.modalOkText })
    const confirm = screen.getAllByRole('button', {
      name: killSequenceComponentConstants.modalOkText
    })
    // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
    await user.click(confirm[0])

    await screen.findByText(killSequenceComponentConstants.getSuccessMessage('ESW.ESW2'))

    verify(agentServiceMock.getAgentStatus()).called()
  })

  it('should display menu items applicable to sequence components| ESW-502', async () => {
    const user = userEvent.setup()
    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    // first find the dropdown menu
    const sequenceCompActions = await screen.findByRole('sequenceCompActions')
    await waitFor(() => user.click(sequenceCompActions))

    // checking different menu items for sequencers and sequence components
    await waitFor(() => expect(screen.queryByText(killSequenceComponentConstants.menuItemText)).to.exist)
    await waitFor(() => expect(screen.queryByText(disabledSequencerActions.displayMessage)).to.exist)
    await waitFor(() => expect(screen.queryByText(reloadScriptConstants.menuItemText)).to.null)
  })

  it('should display menu items applicable to sequencer | ESW-502, ESW-506', async () => {
    const user = userEvent.setup()
    const agentStatus = getAgentStatusMock('IRIS')
    when(agentServiceMock.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })
    when(sequencerServiceMock.getSequencerState()).thenResolve({
      _type: 'Running'
    })
    renderWithAuth({
      ui: (
        <BrowserRouter>
          <AgentCards />
        </BrowserRouter>
      )
    })
    // first find the dropdown menu
    const sequencerActions = await screen.findByRole('sequencerActions')
    expect(sequencerActions).exist
    await waitFor(() => user.click(sequencerActions))

    // checking different menu items for sequencers and sequence components
    expect(await screen.findByText(killSequenceComponentConstants.menuItemText)).exist
    expect(await screen.findByText(reloadScriptConstants.menuItemText)).exist
    expect(await screen.findByText(stopSequencerConstants.menuItemText)).exist
    await waitFor(() => expect(screen.queryByText(disabledSequencerActions.displayMessage)).to.null)
    verify(sequencerServiceMockIris.getSequencerState()).called()
  })

  it('should change the location on click of sequencer | ESW-492', async () => {
    const user = userEvent.setup()
    when(agentServiceMock.getAgentStatus()).thenResolve({
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
    await user.click(sequencer)

    expect(window.location.pathname).to.equal('/sequencer')
    expect(window.location.search).to.equal('?prefix=ESW.darkNight')

    verify(agentServiceMock.getAgentStatus()).called()
  })
})
