import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix, StartSequencerResponse } from '@tmtsoftware/esw-ts'
import React from 'react'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { StartSequencer } from '../../../../src/features/sm/components/StartSequencer'
import { startSequencerConstants } from '../../../../src/features/sm/smConstants'
import { _createErrorMsg } from '../../../../src/utils/message'
import { obsModesData } from '../../../jsons/obsmodes'
import { mockServices, renderWithAuth } from '../../../utils/test-utils'

describe('Start Sequencer', () => {
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
      startSequencerConstants.successMessage
    ],
    [
      'locationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer component not found'
      },
      _createErrorMsg(startSequencerConstants.failureMessage, 'Sequencer component not found')
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'StartSequencer message type is not supported in Processing state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      _createErrorMsg(
        startSequencerConstants.failureMessage,
        'StartSequencer message type is not supported in Processing state'
      )
    ],
    [
      'AlreadyRunning',
      {
        _type: 'AlreadyRunning',
        componentId
      },
      _createErrorMsg(
        startSequencerConstants.failureMessage,
        startSequencerConstants.getAlreadyRunningErrorMessage(componentId.prefix.toJSON())
      )
    ],
    [
      'LoadScriptError',
      { _type: 'LoadScriptError', reason: 'Script missing' },
      _createErrorMsg(startSequencerConstants.failureMessage, 'Script missing')
    ],
    [
      'SequenceComponentNotAvailable',
      {
        _type: 'SequenceComponentNotAvailable',
        msg: 'Sequencer component not found',
        subsystems: []
      },
      _createErrorMsg(startSequencerConstants.failureMessage, 'Sequencer component not found')
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'LoadScript message timed out'
      },
      _createErrorMsg(startSequencerConstants.failureMessage, 'LoadScript message timed out')
    ]
  ]

  beforeEach(() => {
    reset(smService)
  })

  tests.forEach(([testname, response, message]) => {
    it(`should return ${testname} | ESW-447, ESW-507`, async () => {
      when(smService.getObsModesDetails()).thenResolve(obsModesData)
      when(smService.startSequencer(ESW, deepEqual(obsMode))).thenResolve(response)

      renderWithAuth({
        ui: <StartSequencer />
      })

      const loadScriptButton = screen.getByRole('button', { name: startSequencerConstants.startSequencerButtonText })
      userEvent.click(loadScriptButton)

      const modal = await screen.findByRole('dialog', {
        name: startSequencerConstants.modalTitle
      })
      const subsystemInput = within(modal).getByRole('combobox', { name: startSequencerConstants.subsystemInputLabel })
      userEvent.click(subsystemInput)
      userEvent.type(subsystemInput, 'es')
      const eswItem = await screen.findByText(ESW)
      await waitFor(() => userEvent.click(eswItem))

      const obsModeInput = within(modal).getByRole('combobox', { name: startSequencerConstants.obsModeInputLabel })
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
