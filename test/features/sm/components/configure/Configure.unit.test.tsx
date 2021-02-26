import userEvent from '@testing-library/user-event'
import {
  ObsModesDetailsResponse,
  ObsMode,
  ComponentId,
  Prefix
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import Configure from '../../../../../src/features/sm/components/configure/Configure'
import {
  getMockServices,
  screen,
  renderWithAuth,
  cleanup,
  waitFor,
  within,
  ByRoleMatcher
} from '../../../../utils/test-utils'

describe('Configure button', () => {
  afterEach(() => cleanup())
  const mockServices = getMockServices()
  const smService = mockServices.mock.smService

  it('should be disabled | ESW-445', async () => {
    renderWithAuth({
      ui: <Configure />,
      mockClients: mockServices.serviceFactoryContext
    })

    const button = screen.getByRole('button', {
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
    const darkNight = new ObsMode('ESW_DARKNIGHT')
    when(smService.getObsModesDetails()).thenResolve(obsModesDetails)
    when(smService.configure(deepEqual(darkNight))).thenResolve({
      _type: 'Success',
      masterSequencerComponentId: new ComponentId(
        Prefix.fromString('ESW.primary'),
        'Sequencer'
      )
    })

    const { getByRole } = renderWithAuth({
      ui: <Configure />,
      mockClients: mockServices.serviceFactoryContext
    })

    const button = await screen.findByRole('button', { name: 'Configure' })
    userEvent.click(button, { button: 1 })

    await assertDialog((container, name) => getByRole(container, { name }))

    verify(smService.getObsModesDetails()).called()

    //verify only configurable obsmodes are shown in the list
    const dialog = getByRole('dialog', {
      name: /Select an Observation Mode to configure:/i
    })
    await waitFor(() => {
      expect(within(dialog).queryByRole('menuitem', { name: /ESW_RANDOM/i })).to
        .null
      expect(within(dialog).queryByRole('menuitem', { name: /ESW_CLEARSKY/i }))
        .to.null
    })
    const darkNightObsMode = getByRole('menuitem', {
      name: /ESW_DARKNIGHT/i
    })

    //should send  selected obsMode to configure call

    //select item by clicking on it
    userEvent.click(darkNightObsMode)
    // wait for button to be enabled.
    await waitFor(() => {
      const configureButton = within(dialog).getByRole('button', {
        name: /configure/i
      })
      userEvent.click(configureButton)
    })
    verify(smService.configure(deepEqual(darkNight))).called()
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

  const elementsInsideDialog = [
    ['menuitem', /esw_darknight/i],
    ['button', /configure/i],
    ['button', /cancel/i]
  ]

  await Promise.all(
    elementsInsideDialog.map(([container, name]) => {
      return waitFor(
        () => expect(within(dialog).getByRole(container, { name })).to.exist
      )
    })
  )
}
