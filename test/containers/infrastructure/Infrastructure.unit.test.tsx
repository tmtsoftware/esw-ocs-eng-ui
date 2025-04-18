import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  AgentProvisionConfig,
  ComponentId,
  ConfigData,
  ObsMode,
  Prefix,
  ProvisionConfig,
  AGENT_SERVICE_CONNECTION,
  SEQUENCE_MANAGER_CONNECTION,
  CONFIG_CONNECTION,
  VariationInfo
} from '@tmtsoftware/esw-ts'
import type {
  AgentStatus,
  AgentStatusResponse,
  ConfigureResponse,
  HttpLocation,
  ObsModesDetailsResponse
} from '@tmtsoftware/esw-ts'
import { deepEqual, verify, when } from '@johanblumenberg/ts-mockito'
import { expect } from 'chai'
import React from 'react'
import { Infrastructure } from '../../../src/containers/infrastructure/Infrastructure'
import { AgentServiceProvider } from '../../../src/contexts/AgentServiceContext'
import { ConfigServiceProvider } from '../../../src/contexts/ConfigServiceContext'
import { SMServiceProvider } from '../../../src/contexts/SMContext'
import { ProvisionButton } from '../../../src/features/sm/components/provision/ProvisionButton'
import { PROVISION_CONF_PATH } from '../../../src/features/sm/constants'
import { configureConstants, provisionConstants } from '../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth } from '../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

const obsModeDetails: ObsModesDetailsResponse = {
  _type: 'Success',
  obsModes: [
    {
      obsMode: new ObsMode('ESW_DARKNIGHT'),
      resources: ['ESW', 'TCS', 'WFOS'],
      status: {
        _type: 'Configurable'
      },
      sequencers: [VariationInfo.fromString('ESW'), VariationInfo.fromString('TCS'), VariationInfo.fromString('WFOS')]
    }
  ]
}

const agentStatus: AgentStatus = {
  agentId: new ComponentId(new Prefix('APS', 'jdks'), 'Machine'),
  seqCompsStatus: [
    {
      seqCompId: new ComponentId(new Prefix('ESW', 'DARKNIGHT'), 'SequenceComponent'),
      sequencerLocation: []
    }
  ]
}

const successResponse: ConfigureResponse = {
  _type: 'Success',
  masterSequencerComponentId: new ComponentId(Prefix.fromString('ESW.primary'), 'Sequencer')
}

const smLocation: HttpLocation = {
  _type: 'HttpLocation',
  connection: SEQUENCE_MANAGER_CONNECTION,
  uri: 'url',
  metadata: {}
}

describe('Infrastructure page', () => {
  const agentServiceMock = mockServices.mock.agentService
  const agentServiceInstance = mockServices.instance.agentService
  const smServiceInstance = mockServices.instance.smService
  const locServiceMock = mockServices.mock.locationService

  when(locServiceMock.track(SEQUENCE_MANAGER_CONNECTION)).thenReturn(() => {
    return { cancel: () => ({}) }
  })
  when(locServiceMock.track(CONFIG_CONNECTION)).thenReturn(() => {
    return { cancel: () => ({}) }
  })
  when(locServiceMock.track(AGENT_SERVICE_CONNECTION)).thenReturn(() => {
    return { cancel: () => ({}) }
  })
  it('should render infrastructure page | ESW-442', async () => {
    when(agentServiceMock.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    })
    renderWithAuth({
      ui: <Infrastructure />
    })

    screen.getByText('Sequence Manager')
    screen.getByText('Manage Infrastructure')
    await screen.findByRole('button', { name: provisionConstants.buttonText })
    await screen.findByRole('button', { name: configureConstants.buttonText })

    await waitFor(() => verify(agentServiceMock.getAgentStatus()).called())
  })

  it('should render service down status if sequence manager is not spawned | ESW-442', async () => {
    renderWithAuth({
      ui: (
        <AgentServiceProvider initialValue={[agentServiceInstance, false]}>
          <SMServiceProvider initialValue={[undefined, false]}>
            <Infrastructure />
          </SMServiceProvider>
        </AgentServiceProvider>
      )
    })

    expect(screen.queryByText('Loading...')).to.not.exist

    await screen.findByText('Service down')
  })

  it('should render running status with agent machine if sequence manager is running on an agent | ESW-442', async () => {
    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SEQUENCE_MANAGER_CONNECTION,
      uri: 'url',
      metadata: { agentPrefix: 'ESW.primary' }
    }

    renderWithAuth({
      ui: (
        <AgentServiceProvider initialValue={[agentServiceInstance, false]}>
          <SMServiceProvider initialValue={[{ smService: smServiceInstance, smLocation }, false]}>
            <Infrastructure />
          </SMServiceProvider>
        </AgentServiceProvider>
      )
    })

    await screen.findByText('Running on ESW.primary')
  })

  it('should render running on unknown status if sequence manager is running standalone(not on agent) | ESW-442', async () => {
    renderWithAuth({
      ui: (
        <SMServiceProvider initialValue={[{ smService: mockServices.instance.smService, smLocation }, false]}>
          <Infrastructure />
        </SMServiceProvider>
      )
    })

    await screen.findByText('Running on Standalone')
  })

  it('should refetch agent cards after configure success | ESW-443', async () => {
    const user = userEvent.setup()
    const smService = mockServices.mock.smService
    const agentService = mockServices.mock.agentService

    const darkNight = new ObsMode('ESW_DARKNIGHT')

    const agentStatusSuccess: AgentStatusResponse = {
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    }
    when(smService.getObsModesDetails()).thenResolve(obsModeDetails)
    when(smService.configure(deepEqual(darkNight))).thenResolve(successResponse)
    when(agentService.getAgentStatus()).thenResolve(agentStatusSuccess)
    renderWithAuth({
      ui: <Infrastructure />
    })
    const button = await screen.findByRole('button', { name: configureConstants.buttonText })
    await user.click(button)

    //verify only configurable obsmodes are shown in the list
    const dialog = await screen.findByRole('dialog', {
      name: configureConstants.modalTitle
    })

    const darkNightObsMode = await screen.findByRole('menuitem', {
      name: 'ESW_DARKNIGHT'
    })

    //select item by clicking on it
    await user.click(darkNightObsMode)
    // wait for button to be enabled.
    await waitFor(async () => {
      const configureButton = within(dialog).getByRole('button', {
        name: configureConstants.modalOkText
      }) as HTMLButtonElement
      expect(configureButton.disabled).false
      await user.click(configureButton)
    })

    verify(smService.getObsModesDetails()).called()

    verify(smService.configure(deepEqual(darkNight))).called()
    expect(await screen.findByText(configureConstants.getSuccessMessage('ESW_DARKNIGHT'))).to.exist
    verify(agentService.getAgentStatus()).called()
    expect(screen.queryByRole(configureConstants.getSuccessMessage('ESW_DARKNIGHT'))).to.null
  })

  it('should refetch agent cards after provision success | ESW-443', async () => {
    const user = userEvent.setup()
    const smService = mockServices.mock.smService
    const configService = mockServices.mock.configService
    const agentService = mockServices.mock.agentService

    const eswPrefixStr = 'ESW.machine1'
    const tcsPrefixStr = 'TCS.machine1'

    const confData: Record<string, number> = {
      [eswPrefixStr]: 2,
      [tcsPrefixStr]: 2
    }

    const provisionConfig = new ProvisionConfig(
      Object.entries(confData).map(([pStr, num]) => {
        return new AgentProvisionConfig(Prefix.fromString(pStr), num)
      })
    )
    when(agentService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    })
    when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(ConfigData.fromString(JSON.stringify(confData)))

    when(smService.provision(deepEqual(provisionConfig))).thenResolve({
      _type: 'Success'
    })
    renderWithAuth({
      ui: (
        <ConfigServiceProvider initialValue={[mockServices.instance.configService, false]}>
          <SMServiceProvider initialValue={[{ smService: mockServices.instance.smService, smLocation }, false]}>
            <ProvisionButton disabled={false} />
          </SMServiceProvider>
        </ConfigServiceProvider>
      )
    })

    const provisionButton = (await screen.findByRole('button', {
      name: provisionConstants.buttonText
    })) as HTMLButtonElement

    await waitFor(() => expect(provisionButton.disabled).false)

    //User clicks provision button
    await user.click(provisionButton)

    // const document = await screen.findByRole('document')
    // const confirmButton = within(document).getByRole('button', {
    //   name: provisionConstants.modalOkText
    // })
    const confirmButtons = screen.getAllByRole('button', {
      name: provisionConstants.modalOkText
    })
    // TODO: FIXME: screen.findByRole('document') above did not work anymore after dependency update
    await user.click(confirmButtons[1])

    await screen.findByText(provisionConstants.successMessage)

    verify(smService.provision(deepEqual(provisionConfig))).called()
  })
})
