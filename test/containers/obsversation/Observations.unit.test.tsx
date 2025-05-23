import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { PekkoLocation, ObsModesDetailsResponseSuccess } from '@tmtsoftware/esw-ts'
import { PekkoConnection, ObsMode, Prefix, StepList } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, resetCalls, verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import { Observations } from '../../../src/containers/observation/Observations'
import { observationShutdownConstants } from '../../../src/features/sequencer/sequencerConstants'
import { configurableObsModesData, nonConfigurableObsModesData, obsModesData } from '../../jsons/obsmodes'
import { getObsModes } from '../../utils/observationUtils'
import { mockServices, renderWithAuth, sequencerServiceMock } from '../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('Observation page', () => {
  beforeEach(() => resetCalls(sequencerServiceMock))
  it('should render observation page with three tabs | ESW-450', async () => {
    const smService = mockServices.mock.smService
    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })

    renderWithAuth({
      ui: <Observations />
    })

    const header = screen.getByText('Manage Observation')
    const runningTab = screen.getByRole('tab', { name: 'Running' })
    const configurableTab = screen.getByRole('tab', { name: 'Configurable' })
    const nonConfigurableTab = screen.getByRole('tab', {
      name: 'Non-configurable'
    })

    expect(header).to.exist
    expect(runningTab).to.exist

    expect(configurableTab).to.exist
    expect(nonConfigurableTab).to.exist
    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })

  it('should render no obsModes if no obsModes are available in tab | ESW-450', async () => {
    const user = userEvent.setup()
    const smService = mockServices.mock.smService

    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })

    renderWithAuth({
      ui: <Observations />
    })

    const configurableTab = screen.getByRole('tab', { name: 'Configurable' })
    const nonConfigurableTab = screen.getByRole('tab', {
      name: 'Non-configurable'
    })

    const noRunningObsModes = screen.getByText('No Running ObsModes')
    expect(noRunningObsModes).to.exist

    // User will click on configurable tab
    await user.click(configurableTab)

    await screen.findByText('No Configurable ObsModes')

    // User will click on non-configurable tab
    await user.click(nonConfigurableTab)

    await screen.findByText('No Non-configurable ObsModes')

    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })

  it('should render running obsModes | ESW-450, ESW-489', async () => {
    const smService = mockServices.mock.smService
    when(smService.getObsModesDetails()).thenResolve(obsModesData)
    setSequencerServiceMockForLoadedState()

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <Observations />
        </BrowserRouter>
      )
    })

    await screen.findByRole('menuitem', { name: 'DarkNight_1' })
    await screen.findByRole('menuitem', { name: 'DarkNight_8' })

    const shutdownButton = screen.getByRole('button', { name: observationShutdownConstants.buttonText })

    expect(shutdownButton).to.exist
    expect(screen.getAllByText('DarkNight_1')).to.have.length(2)
    // XXX TODO FIXME
    // await screen.findByText('Loaded')
  })

  const tabTests: [string, string[], ObsModesDetailsResponseSuccess][] = [
    ['Non-configurable', ['DarkNight_3', 'DarkNight_5'], nonConfigurableObsModesData],
    ['Configurable', ['DarkNight_2', 'DarkNight_6'], configurableObsModesData]
  ]

  tabTests.forEach(([tabName, obsModes, data]) => {
    it(`should render ${tabName} obsModes | ESW-450`, async () => {
      const user = userEvent.setup()
      const smService = mockServices.mock.smService
      const agentService = mockServices.mock.agentService

      when(agentService.getAgentStatus()).thenResolve({
        _type: 'Success',
        agentStatus: [],
        seqCompsWithoutAgent: []
      })
      when(smService.getObsModesDetails()).thenResolve(data)

      renderWithAuth({
        ui: <Observations />
      })

      const tab = await screen.findByRole('tab', {
        name: tabName
      })
      await user.click(tab)

      const menuItem = await screen.findByRole('menuitem', {
        name: obsModes[0]
      })
      await screen.findByRole('menuitem', { name: new RegExp(obsModes[0]) })

      await user.click(menuItem)
      expect(screen.getAllByText(obsModes[0])).to.have.length(2)

      //Checking that obsMode status is NA
      const tabPanel = await screen.findByRole('tabpanel')
      expect(within(tabPanel).getByText('NA')).to.exist
      verify(sequencerServiceMock.getSequencerState()).never()

      verify(smService.getObsModesDetails()).called()
    })
  })

  it('should log error if locationServiceError occurs | ESW-450', async () => {
    const smService = mockServices.mock.smService
    when(smService.getObsModesDetails()).thenResolve({
      _type: 'LocationServiceError',
      reason: 'Location service failed'
    })

    renderWithAuth({
      ui: <Observations />
    })

    await screen.findByText('Location service failed')

    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })
  it(`should render correct status when running obsmode is shutdown and configurable tab is clicked | ESW-450, ESW-489`, async () => {
    const user = userEvent.setup()
    const smService = mockServices.mock.smService

    when(smService.getObsModesDetails())
      .thenResolve(getObsModes({ _type: 'Configured' }))
      .thenResolve(getObsModes({ _type: 'Configurable' }))
    const obsMode = new ObsMode('DarkNight_1')
    when(smService.shutdownObsModeSequencers(deepEqual(obsMode))).thenResolve({
      _type: 'Success'
    })

    setSequencerServiceMockForLoadedState()

    renderWithAuth({
      ui: (
        <BrowserRouter>
          <Observations />
        </BrowserRouter>
      )
    })

    await screen.findByRole('menuitem', { name: 'DarkNight_1' })
    const runningTabPanel = await screen.findByRole('tabpanel')
    // XXX TODO FIXME
    // await within(runningTabPanel).findByText('Loaded')
    const shutdownButton = within(runningTabPanel).getByRole('button', {
      name: observationShutdownConstants.buttonText
    })
    await user.click(shutdownButton)

    // const modalDocument = await screen.findByRole('document')
    // const modalShutdownButton = within(modalDocument).getByRole('button', {
    //   name: observationShutdownConstants.modalOkText
    // })
    const modalShutdownButtons = screen.getAllByRole('button', {
      name: observationShutdownConstants.modalOkText
    })
    // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
    await user.click(modalShutdownButtons[1])

    const configurableTab = await screen.findByRole('tab', {
      name: 'Configurable'
    })
    await user.click(configurableTab)
    await screen.findByText(observationShutdownConstants.getSuccessMessage(new ObsMode('DarkNight_1')))

    const configurableTabPanel = await screen.findByRole('tabpanel')
    await within(configurableTabPanel).findByText('NA')
    verify(sequencerServiceMock.getSequencerState()).once
  })

  it('should log error if useObsModesDetails() Fails | ESW-450', async () => {
    const smService = mockServices.mock.smService

    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Failed',
      msg: 'Failed to fetch obsModes'
    })

    renderWithAuth({
      ui: <Observations />
    })

    await screen.findByText('Failed to fetch obsModes')

    await waitFor(() => {
      verify(smService.getObsModesDetails()).called()
    })
  })

  const setSequencerServiceMockForLoadedState = () => {
    const eswSequencerPrefix = new Prefix('ESW', 'DarkNight_1')
    const eswSequencerConnection = PekkoConnection(eswSequencerPrefix, 'Sequencer')
    const eswSequencerLocation: PekkoLocation = {
      _type: 'PekkoLocation',
      connection: eswSequencerConnection,
      uri: 'http://localhost:5000/',
      metadata: {}
    }
    when(mockServices.mock.locationService.track(anything())).thenReturn((cb) => {
      cb({ _type: 'LocationUpdated', location: eswSequencerLocation })
      return {
        cancel: () => undefined
      }
    })
    when(sequencerServiceMock.subscribeSequencerState()).thenReturn((onEvent) => {
      onEvent({
        _type: 'SequencerStateResponse',
        sequencerState: { _type: 'Loaded' },
        stepList: new StepList([])
      })
      return {
        cancel: () => undefined
      }
    })
  }
})
