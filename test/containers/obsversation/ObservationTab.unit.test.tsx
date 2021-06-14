import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AgentStatus, ComponentId, ObsMode, Prefix } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { ObservationTab } from '../../../src/containers/observation/ObservationTab'
import { observationShutdownConstants } from '../../../src/features/sequencer/sequencerConstants'
import { configureConstants } from '../../../src/features/sm/smConstants'
import { obsModesData } from '../../jsons/obsmodes'
import { assertTableHeader, assertTableHeaderNotPresent } from '../../utils/tableTestUtils'
import { getAgentStatusMock, mockServices, renderWithAuth, sequencerServiceMock } from '../../utils/test-utils'

const smService = mockServices.mock.smService
const agentService = mockServices.mock.agentService

describe('observation tabs', () => {
  beforeEach(() => {
    reset(smService)
    reset(agentService)
    reset(sequencerServiceMock)
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn(() => {
      return { cancel: () => undefined }
    })
  })
  it('should be able to shutdown running observation | ESW-450, ESW-454, ESW-489', async () => {
    when(smService.getObsModesDetails()).thenResolve(obsModesData)
    const obsMode = new ObsMode('DarkNight_1')
    const modalMessage = observationShutdownConstants.getModalTitle(obsMode)

    when(smService.shutdownObsModeSequencers(deepEqual(obsMode))).thenResolve({
      _type: 'Success'
    })

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <ObservationTab tabName='Running' setObservation={() => ({})} />
        </BrowserRouter>
      )
    })

    const shutdownButton = await screen.findByRole('button', {
      name: observationShutdownConstants.buttonText
    })
    userEvent.click(shutdownButton)

    await screen.findByText(modalMessage)

    const modalDocument = await screen.findByRole('document')
    const modalShutdownButton = within(modalDocument).getByRole('button', {
      name: observationShutdownConstants.modalOkText
    })

    userEvent.click(modalShutdownButton)

    await screen.findByText(observationShutdownConstants.getSuccessMessage(new ObsMode('DarkNight_1')))
    await waitFor(() => verify(smService.shutdownObsModeSequencers(deepEqual(obsMode))).called())

    await waitFor(() => expect(screen.queryByText(modalMessage)).to.null)
  })

  it('should be able to configure a configurable observation | ESW-450, ESW-489', async () => {
    // mock setup starts here
    const agentStatusMock: AgentStatus = getAgentStatusMock()
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatusMock],
      seqCompsWithoutAgent: []
    })
    const sequencerId = new ComponentId(Prefix.fromString('ESW.SeqComp1'), 'Sequencer')
    const darkNight2 = new ObsMode('DarkNight_2')
    when(smService.configure(deepEqual(darkNight2))).thenResolve({
      _type: 'Success',
      masterSequencerComponentId: sequencerId
    })
    when(smService.getObsModesDetails()).thenResolve(obsModesData)
    // mock setup ends here

    renderWithAuth({
      ui: <ObservationTab tabName='Configurable' setObservation={() => ({})} />
    })

    const configureButton = (await screen.findByRole('button', {
      name: configureConstants.buttonText
    })) as HTMLButtonElement

    await waitFor(() => expect(configureButton.disabled).false)

    userEvent.click(configureButton)

    await screen.findByText(configureConstants.getSuccessMessage('DarkNight_2'))

    await waitFor(() => {
      verify(smService.configure(deepEqual(darkNight2))).called()
      verify(agentService.getAgentStatus()).called()
    })
  })

  it('should not be able to configure on non-configurable observation tab | ESW-450, ESW-489', async () => {
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    renderWithAuth({
      ui: <ObservationTab tabName='Non-configurable' setObservation={() => ({})} />
    })

    const configureButton = (await screen.findByRole('button', {
      name: configureConstants.buttonText
    })) as HTMLButtonElement
    await waitFor(() => expect(configureButton.disabled).true)

    await waitFor(() => {
      verify(smService.configure(new ObsMode('random'))).never()
      verify(agentService.getAgentStatus()).called()
    })
  })

  it('should render sequencer & resources table with all resources as in use on running tab | ESW-451, ESW-453, ESW-489', async () => {
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <ObservationTab tabName='Running' setObservation={() => ({})} />
        </BrowserRouter>
      )
    })
    await screen.findAllByRole('table')
    const [sequencerTable, resourcesTable, resourcesBodyTable] = screen.queryAllByRole('table')

    assertTableHeader(sequencerTable, 'Sequencers')
    assertTableHeader(sequencerTable, 'Sequence Status')
    assertTableHeader(sequencerTable, 'Total Steps')

    assertTableHeader(resourcesTable, 'Resource Required')
    assertTableHeader(resourcesTable, 'Status')

    expect(within(resourcesBodyTable).queryAllByRole('row', { name: /Available/i })).to.have.length(0)
    expect(within(resourcesBodyTable).queryAllByRole('row', { name: /InUse/i })).to.have.length(2)
  })

  it(`should render only resources with available status on configurable tab| ESW-451, ESW-453, ESW-489`, async () => {
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    renderWithAuth({
      ui: <ObservationTab tabName='Configurable' setObservation={() => ({})} />
    })

    await screen.findAllByRole('table')
    const [resourcesTable, resourcesBodyTable] = screen.queryAllByRole('table')

    assertTableHeaderNotPresent('Sequencers')
    assertTableHeaderNotPresent('Sequence Status')
    assertTableHeaderNotPresent('Total Steps')

    assertTableHeader(resourcesTable, 'Resource Required')
    assertTableHeader(resourcesTable, 'Status')

    expect(within(resourcesBodyTable).queryAllByRole('row', { name: /Available/i })).to.have.length(2)
    expect(within(resourcesBodyTable).queryAllByRole('row', { name: /InUse/i })).to.have.length(0)
  })

  it(`should render only resources table with appropriate status on non-configurable tab | ESW-451, ESW-453, ESW-489`, async () => {
    when(smService.getObsModesDetails()).thenResolve(obsModesData)

    renderWithAuth({
      ui: <ObservationTab tabName='Non-configurable' setObservation={() => ({})} />
    })

    await screen.findAllByRole('table')
    const [resourcesTable, resourcesBodyTable] = screen.queryAllByRole('table')

    assertTableHeaderNotPresent('Sequencers')
    assertTableHeaderNotPresent('Sequence Status')
    assertTableHeaderNotPresent('Total Steps')

    assertTableHeader(resourcesTable, 'Resource Required')
    assertTableHeader(resourcesTable, 'Status')

    expect(within(resourcesBodyTable).getByRole('row', { name: 'IRIS Available' })).to.exist
    expect(within(resourcesBodyTable).getByRole('row', { name: 'WFOS Available' })).to.exist
    expect(within(resourcesBodyTable).getByRole('row', { name: 'ESW InUse' })).to.exist
  })
})
