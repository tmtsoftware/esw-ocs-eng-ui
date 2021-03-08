import userEvent from '@testing-library/user-event'
import {
  ObsModesDetailsResponse,
  ObsMode,
  ComponentId,
  Prefix,
  ConfigureResponse,
  SequenceManagerService,
  SequenceComponentStatus
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, mock, verify, when } from 'ts-mockito'
import Infrastructure from '../../../../../src/containers/infrastructure/Infrastructure'
import Configure from '../../../../../src/features/sm/components/configure/Configure'
import {
  getMockServices,
  screen,
  renderWithAuth,
  cleanup,
  waitFor,
  within,
  ByRoleMatcher,
  MockServices
} from '../../../../utils/test-utils'

const obsModesDetails: ObsModesDetailsResponse = {
  _type: 'Success',
  obsModes: [
    {
      obsMode: new ObsMode('ESW_DARKNIGHT'),
      resources: ['ESW', 'TCS', 'WFOS'],
      status: {
        _type: 'Configurable'
      },
      sequencers: ['ESW', 'TCS', 'WFOS']
    },
    {
      obsMode: new ObsMode('ESW_CLEARSKY'),
      resources: [],
      status: {
        _type: 'Configured'
      },
      sequencers: []
    },
    {
      obsMode: new ObsMode('ESW_RANDOM'),
      resources: [],
      status: {
        _type: 'NonConfigurable'
      },
      sequencers: []
    }
  ]
}
afterEach(() => {
  cleanup()
})

let mockServices: MockServices
let smService: SequenceManagerService

const darkNight = new ObsMode('ESW_DARKNIGHT')

const successResponse: ConfigureResponse = {
  _type: 'Success',
  masterSequencerComponentId: new ComponentId(
    Prefix.fromString('ESW.primary'),
    'Sequencer'
  )
}
const configurationMissingResponse: ConfigureResponse = {
  _type: 'ConfigurationMissing',
  obsMode: darkNight
}

const conflictingResourcesResponse: ConfigureResponse = {
  _type: 'ConflictingResourcesWithRunningObsMode',
  runningObsMode: [new ObsMode('ESW_CLEARSKY')]
}

const failedToStartSequencersResponse: ConfigureResponse = {
  _type: 'FailedToStartSequencers',
  reasons: ['sequence component not found']
}

const locationServiceError: ConfigureResponse = {
  _type: 'LocationServiceError',
  reason: 'LocationNotFound'
}
const sequenceComponentNotAvailable: ConfigureResponse = {
  _type: 'SequenceComponentNotAvailable',
  msg: 'Not Available',
  subsystems: ['IRIS']
}
const unhandled: ConfigureResponse = {
  _type: 'Unhandled',
  msg: 'Bad request',
  messageType: 'TransportError',
  state: ''
}
describe('Configure button', () => {
  beforeEach(() => {
    mockServices = getMockServices()
    smService = mockServices.mock.smService
    when(smService.getObsModesDetails()).thenResolve(obsModesDetails)
  })
  afterEach(() => {
    cleanup()
  })
  it('should be disabled | ESW-445', async () => {
    renderWithAuth({
      ui: <Configure disabled={true} />,
      mockClients: mockServices.serviceFactoryContext
    })

    const button = await screen.findByRole('button', {
      name: 'Configure'
    })
    userEvent.click(button)

    // modal should not open on click of configure button
    expect(
      screen.queryByRole('dialog', {
        name: 'Select an Observation Mode to configure:'
      })
    ).to.null
  })

  it('should be enabled when sequence manager is spawned | ESW-445', async () => {
    when(smService.configure(deepEqual(darkNight))).thenResolve(successResponse)
    renderWithAuth({
      ui: <Configure disabled={false} />,
      mockClients: mockServices.serviceFactoryContext
    })
    await openConfigureModalAndClickConfigureButton()
    //verify only configurable obsmodes are shown in the list
    const dialog = await screen.findByRole('dialog', {
      name: /Select an Observation Mode to configure:/i
    })
    expect(within(dialog).queryByRole('menuitem', { name: /ESW_RANDOM/i })).to
      .null
    expect(within(dialog).queryByRole('menuitem', { name: /ESW_CLEARSKY/i })).to
      .null

    await assertDialog((container, name) =>
      screen.getByRole(container, { name })
    )
    //verify obsModesDetails are fetched when dialog is opened
    verify(smService.getObsModesDetails()).called()

    verify(smService.configure(deepEqual(darkNight))).called()
    expect(await screen.findByText('ESW_DARKNIGHT has been configured.')).to
      .exist

    expect(screen.queryByRole('ESW_DARKNIGHT has been configured.')).to.null
  })

  const testcases: Array<[ConfigureResponse, string]> = [
    [locationServiceError, 'LocationNotFound'],
    [conflictingResourcesResponse, 'Running ObsModes: ESW_CLEARSKY'],
    [configurationMissingResponse, 'ConfigurationMissing for ESW_DARKNIGHT'],
    [failedToStartSequencersResponse, 'sequence component not found'],
    [sequenceComponentNotAvailable, 'Not Available'],
    [unhandled, 'Bad request']
  ]

  testcases.map(([response, message]) => {
    it(`configure action should throw ${response._type.toLocaleLowerCase()} | ESW-445`, async () => {
      when(smService.configure(deepEqual(darkNight))).thenResolve(response)

      renderWithAuth({
        ui: <Configure disabled={false} />,
        mockClients: mockServices.serviceFactoryContext
      })
      await openConfigureModalAndClickConfigureButton()
      const matchRegex = new RegExp(`${message}`)
      await waitFor(() => expect(screen.getByText(matchRegex)).to.exist)
      verify(smService.configure(deepEqual(darkNight))).called()
    })
  })
})

const assertDialog = async (
  getByRole: (con: ByRoleMatcher, name: string | RegExp) => HTMLElement
) => {
  await waitFor(
    () =>
      expect(getByRole('dialog', /Select an Observation Mode to configure:/i))
        .to.exist
  )

  const dialog = getByRole(
    'dialog',
    /Select an Observation Mode to configure:/i
  )

  const items = await waitFor(() => [
    within(dialog).getByRole('menuitem', { name: /esw_darknight/i }),
    within(dialog).getByRole('button', { name: /configure/i }),
    within(dialog).getByRole('button', { name: /cancel/i })
  ])

  items.forEach((item) => {
    expect(item).to.exist
  })
}
const openConfigureModalAndClickConfigureButton = async () => {
  const button = await screen.findByRole('button', { name: 'Configure' })
  userEvent.click(button, { button: 1 })

  //verify only configurable obsmodes are shown in the list
  const dialog = screen.getByRole('dialog', {
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
}
