import userEvent from '@testing-library/user-event'
import {
  AgentProvisionConfig,
  AgentStatus,
  AgentStatusResponse,
  ComponentId,
  ConfigData,
  ConfigureResponse,
  HttpLocation,
  ObsMode,
  ObsModesDetailsResponse,
  Prefix,
  ProvisionConfig
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import Infrastructure from '../../../src/containers/infrastructure/Infrastructure'
import {
  PROVISION_CONF_PATH,
  SM_CONNECTION
} from '../../../src/features/sm/constants'
import {
  cleanup,
  getMockServices,
  renderWithAuth,
  screen,
  waitFor,
  within
} from '../../utils/test-utils'

const obsModeDetails: ObsModesDetailsResponse = {
  _type: 'Success',
  obsModes: [
    {
      obsMode: new ObsMode('ESW_DARKNIGHT'),
      resources: ['ESW', 'TCS', 'WFOS'],
      status: {
        _type: 'Configurable'
      },
      sequencers: ['ESW', 'TCS', 'WFOS']
    }
  ]
}

const agentStatus: AgentStatus = {
  agentId: new ComponentId(new Prefix('APS', 'jdks'), 'Machine'),
  seqCompsStatus: [
    {
      seqCompId: new ComponentId(
        new Prefix('ESW', 'DARKNIGHT'),
        'SequenceComponent'
      ),
      sequencerLocation: []
    }
  ]
}

const smLocation: HttpLocation = {
  _type: 'HttpLocation',
  connection: SM_CONNECTION,
  uri: 'url',
  metadata: { prefix: 'ESW.primary' }
}

const successResponse: ConfigureResponse = {
  _type: 'Success',
  masterSequencerComponentId: new ComponentId(
    Prefix.fromString('ESW.primary'),
    'Sequencer'
  )
}

describe('Infrastructure page', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render infrastructure page | ESW-442', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService
    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    })
    const subtitle = screen.getByText(/sequence manager/i)
    const header = screen.getByText(/manage infrastructure/i)
    const provision = await screen.findByRole('button', { name: /provision/i })
    const configure = await screen.findByRole('button', { name: /configure/i })

    expect(subtitle).to.exist
    expect(header).to.exist
    expect(provision).to.exist
    expect(configure).to.exist
    verify(smService.getAgentStatus()).called()
  })

  it('should render service down status if sequence manager is not spawned | ESW-442', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService

    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(undefined)
    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })

    expect(screen.getByText('Loading...')).to.exist

    await waitFor(() => {
      expect(screen.getByText('Service down')).to.exist
    })
  })

  it('should render running status with agent machine if sequence manager is running on an agent | ESW-442', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService

    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: { agentPrefix: 'ESW.primary' }
    }

    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(smLocation)

    renderWithAuth({
      ui: <Infrastructure />,
      loggedIn: true,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.getByText('Loading...')).to.exist

    await waitFor(() => {
      expect(screen.getByText('Running on ESW.primary')).to.exist
    })
  })

  it('should render running on unknown status if sequence manager is running standalone(not on agent) | ESW-442', async () => {
    const mockServices = getMockServices()
    const locationServiceMock = mockServices.mock.locationService

    const smLocation: HttpLocation = {
      _type: 'HttpLocation',
      connection: SM_CONNECTION,
      uri: 'url',
      metadata: {}
    }

    when(locationServiceMock.find(SM_CONNECTION)).thenResolve(smLocation)

    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })
    expect(screen.getByText('Loading...')).to.exist

    await waitFor(() => {
      expect(screen.getByText('Running on unknown')).to.exist
    })
  })

  it('should refetch agent cards after configure success | ESW-443', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService
    const locationService = mockServices.mock.locationService

    when(locationService.find(SM_CONNECTION)).thenResolve(smLocation)

    const darkNight = new ObsMode('ESW_DARKNIGHT')

    const agentStatusSuccess: AgentStatusResponse = {
      _type: 'Success',
      agentStatus: [agentStatus],
      seqCompsWithoutAgent: []
    }
    when(smService.getObsModesDetails()).thenResolve(obsModeDetails)
    when(smService.configure(deepEqual(darkNight))).thenResolve(successResponse)
    when(smService.getAgentStatus()).thenResolve(agentStatusSuccess)
    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })
    const button = await screen.findByRole('button', { name: 'Configure' })
    userEvent.click(button, { button: 1 })

    //verify only configurable obsmodes are shown in the list
    const dialog = await screen.findByRole('dialog', {
      name: /Select an Observation Mode to configure:/i
    })

    const darkNightObsMode = await screen.findByRole('menuitem', {
      name: /ESW_DARKNIGHT/i
    })

    //select item by clicking on it
    userEvent.click(darkNightObsMode)
    // wait for button to be enabled.
    await waitFor(() => {
      const configureButton = within(dialog).getByRole('button', {
        name: /configure/i
      }) as HTMLButtonElement
      expect(configureButton.disabled).false
      userEvent.click(configureButton)
    })

    verify(smService.getObsModesDetails()).called()

    verify(smService.configure(deepEqual(darkNight))).called()
    expect(await screen.findByText('ESW_DARKNIGHT has been configured.')).to
      .exist
    verify(smService.getAgentStatus()).called()
    expect(screen.queryByRole('ESW_DARKNIGHT has been configured.')).to.null
  })

  it('should refetch agent cards after provision success | ESW-443', async () => {
    const mockServices = getMockServices()
    const smService = mockServices.mock.smService
    const configService = mockServices.mock.configService

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
    when(smService.getAgentStatus()).thenResolve({
      _type: 'Success',
      agentStatus: [],
      seqCompsWithoutAgent: []
    })
    when(configService.getActive(PROVISION_CONF_PATH)).thenResolve(
      ConfigData.fromString(JSON.stringify(confData))
    )

    when(smService.provision(deepEqual(provisionConfig))).thenResolve({
      _type: 'Success'
    })
    renderWithAuth({
      ui: <Infrastructure />,
      mockClients: mockServices.serviceFactoryContext
    })

    const provisionButton = await screen.findByRole('button', {
      name: 'Provision'
    })

    //User clicks provision button
    userEvent.click(provisionButton)

    const document = await screen.findByRole('document')
    const confirmButton = within(document).getByRole('button', {
      name: /provision/i
    })

    userEvent.click(confirmButton)

    await waitFor(() => {
      expect(screen.getByText('Successfully provisioned')).to.exist
    })

    verify(smService.provision(deepEqual(provisionConfig))).called()
    verify(smService.getAgentStatus()).called()
  })
})
