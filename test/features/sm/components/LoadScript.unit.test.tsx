import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  ComponentId,
  ObsMode,
  Prefix,
  StartSequencerResponse
} from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { LoadScript } from '../../../../src/features/sm/components/LoadScript'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'
describe('LoadScript Icon', () => {
  const obsMode = new ObsMode('ESW.DarkNight')
  const smService = mockServices.mock.smService

  const componentId = new ComponentId(
    Prefix.fromString(obsMode.name),
    'Sequencer'
  )
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

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname} | ESW-447`, async () => {
      when(smService.startSequencer('ESW', deepEqual(obsMode))).thenResolve(
        response
      )

      renderWithAuth({
        ui: <LoadScript subsystem={'ESW'} />
      })

      const loadScriptButton = screen.getByRole(
        'loadScript'
      ) as HTMLButtonElement

      await waitFor(() => expect(loadScriptButton.disabled).false)

      userEvent.click(loadScriptButton, { button: 0 })

      // expect modal to be visible
      const modalTitle = await screen.findByText('Observation Mode:')
      expect(modalTitle).to.exist
      const input = within(modalTitle).getByRole('textbox')
      await waitFor(() => userEvent.click(input))
      userEvent.type(input, obsMode.name)

      const confirmButton = screen.getByRole('button', { name: /ok/i })
      userEvent.click(confirmButton)

      await screen.findByText(message)
      verify(smService.startSequencer('ESW', deepEqual(obsMode))).called()
    })
  })
})
