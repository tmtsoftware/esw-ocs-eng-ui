import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AgentStatus,
  ComponentId,
  ObsMode,
  ObsModeStatus,
  Prefix
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import ObservationTab from '../../../src/containers/observation/ObservationTab'
import obsModesData from '../../jsons/obsmodes'
import { getMockServices, renderWithAuth } from '../../utils/test-utils'

const getObsmodesBy = (key: ObsModeStatus['_type']) =>
  obsModesData.obsModes.filter((x) => x.status._type === key)
const mockServices = getMockServices()
const smService = mockServices.mock.smService
const agentService = mockServices.mock.agentService
const sequencerService = mockServices.mock.sequencerService
describe('observation tabs', () => {
  const runningObsModes = getObsmodesBy('Configured')
  const configurable = getObsmodesBy('Configurable')
  const nonConfigurable = getObsmodesBy('NonConfigurable')

  it('should be able to shutdown running observation | ESW-450', async () => {
    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })
    const obsMode = new ObsMode('DarkNight_1')
    when(smService.shutdownObsModeSequencers(deepEqual(obsMode))).thenResolve({
      _type: 'Success'
    })

    renderWithAuth({
      ui: (
        <ObservationTab
          currentTab={'Running'}
          data={runningObsModes}
          selected={0}
          setObservation={() => ({})}
          key={'Running'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const shutdownButton = await screen.findByRole('button', {
      name: 'Shutdown'
    })
    userEvent.click(shutdownButton)

    await screen.findByText('Successfully shutdown sequencer')
    await waitFor(() =>
      verify(smService.shutdownObsModeSequencers(deepEqual(obsMode))).called()
    )
  })

  it('should be able to pause running observation', async () => {
    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })
    when(sequencerService.pause()).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <ObservationTab
          currentTab={'Running'}
          data={runningObsModes}
          selected={0}
          setObservation={() => ({})}
          key={'Running'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })
    const pauseButton = (await screen.findByRole('button', {
      name: 'Pause'
    })) as HTMLButtonElement

    await waitFor(() => expect(pauseButton.disabled).false)

    userEvent.click(pauseButton)

    await screen.findByText('Successfully paused sequencer.')

    await waitFor(() => verify(sequencerService.pause()).called())
  })

  it('should be able to configure a configurable observation | ESW-450', async () => {
    // mock setup starts here
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
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    })
    const sequencerId = new ComponentId(
      Prefix.fromString('ESW.SeqComp1'),
      'Sequencer'
    )
    const darkNight2 = new ObsMode('DarkNight_2')
    when(smService.configure(deepEqual(darkNight2))).thenResolve({
      _type: 'Success',
      masterSequencerComponentId: sequencerId
    })
    // mock setup ends here

    renderWithAuth({
      ui: (
        <ObservationTab
          currentTab={'Configurable'}
          data={configurable}
          selected={0}
          setObservation={() => ({})}
          key={'Configurable'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const configureButton = (await screen.findByRole('button', {
      name: 'Configure'
    })) as HTMLButtonElement

    await waitFor(() => expect(configureButton.disabled).false)

    userEvent.click(configureButton)

    await screen.findByText('DarkNight_2 has been configured.')

    await waitFor(() => {
      verify(smService.configure(deepEqual(darkNight2))).called()
      verify(agentService.getAgentStatus()).called()
    })
  })

  it('should not be able to configure on non-configurable observation tab | ESW-450', async () => {
    renderWithAuth({
      ui: (
        <ObservationTab
          currentTab={'Non-configurable'}
          data={nonConfigurable}
          selected={0}
          setObservation={() => ({})}
          key={'non-configurable'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const configureButton = (await screen.findByRole('button', {
      name: 'Configure'
    })) as HTMLButtonElement

    await waitFor(() => expect(configureButton.disabled).true)

    await waitFor(() => {
      verify(smService.configure(new ObsMode('random'))).never()
      verify(agentService.getAgentStatus()).called()
    })
  })

  // TODO remove this skip toggle from here after ESW-382 & 383 is played
  it.skip('should be able to resume a paused observation', async () => {
    when(smService.getObsModesDetails()).thenResolve({
      _type: 'Success',
      obsModes: []
    })
    when(sequencerService.resume()).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: (
        <ObservationTab
          currentTab={'Running'}
          data={runningObsModes}
          selected={0}
          setObservation={() => ({})}
          key={'Running'}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })
    const resumeButton = await screen.findByRole('button', {
      name: 'Resume'
    })
    userEvent.click(resumeButton)

    await screen.findByText('Successfully resumed sequencer')
  })
})
