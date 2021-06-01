import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix, StartSequencerResponse } from '@tmtsoftware/esw-ts'
import React from 'react'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { LoadScript } from '../../../../src/features/sm/components/LoadScript'
import { obsModesData } from '../../../jsons/obsmodes'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('LoadScript', () => {
  const ESW = 'ESW'
  const obsModeName = 'DarkNight_1'
  const obsMode = new ObsMode(obsModeName)
  const smService = mockServices.mock.smService

  const componentId = new ComponentId(new Prefix(ESW, obsModeName), 'Sequencer')
  const tests: [string, StartSequencerResponse, string][] = [
    [
      'success',
      {
        _type: 'Started',
        componentId
      },
      'Successfully loaded script'
    ],
    [
      'locationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer component not found'
      },
      'Failed to load script, reason: Sequencer component not found'
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'StartSequencer message type is not supported in Processing state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      'Failed to load script, reason: StartSequencer message type is not supported in Processing state'
    ],
    [
      'AlreadyRunning',
      {
        _type: 'AlreadyRunning',
        componentId
      },
      `Failed to load script, reason: ${componentId.prefix.toJSON()} is already running`
    ],
    [
      'LoadScriptError',
      { _type: 'LoadScriptError', reason: 'Script missing' },
      'Failed to load script, reason: Script missing'
    ],
    [
      'SequenceComponentNotAvailable',
      {
        _type: 'SequenceComponentNotAvailable',
        msg: 'Sequencer component not found',
        subsystems: []
      },
      'Failed to load script, reason: Sequencer component not found'
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'LoadScript message timed out'
      },
      'Failed to load script, reason: LoadScript message timed out'
    ]
  ]

  beforeEach(() => {
    reset(smService)
  })

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname} | ESW-447, ESW-507`, async () => {
      when(smService.getObsModesDetails()).thenResolve(obsModesData)
      when(smService.startSequencer('ESW', deepEqual(obsMode))).thenResolve(response)

      renderWithAuth({
        ui: <LoadScript />
      })

      const loadScriptButton = screen.getByRole('button', { name: 'Start Sequencer' })
      userEvent.click(loadScriptButton)
      // await waitFor(() => expect(loadScriptButton.disabled).false)

      const modal = await screen.findByRole('dialog', {
        name: 'Select a Subsystem and Observation Mode to spawn:'
      })
      const subsystemInput = within(modal).getByRole('combobox', { name: 'Subsystem' })
      userEvent.click(subsystemInput)
      userEvent.type(subsystemInput, 'es')
      const eswItem = await screen.findByText(ESW)
      await waitFor(() => userEvent.click(eswItem))

      const obsModeInput = within(modal).getByRole('combobox', { name: 'Observation Mode' })
      userEvent.click(obsModeInput)
      userEvent.type(obsModeInput, 'dark')
      const obsModeItem = await screen.findAllByText(obsModeName)
      await waitFor(() => userEvent.click(obsModeItem[1]))

      const confirmButton = screen.getByRole('button', { name: 'Confirm' })
      userEvent.click(confirmButton)

      await screen.findByText(message)
      verify(smService.startSequencer(ESW, deepEqual(obsMode))).called()
    })
  })
})
