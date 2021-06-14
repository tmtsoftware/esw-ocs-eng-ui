import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix, RestartSequencerResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, resetCalls, verify, when } from 'ts-mockito'
import { ReloadScript } from '../../../../src/features/sm/components/ReloadScript'
import { reloadScriptConstants } from '../../../../src/features/sm/smConstants'
import { MenuWithStepListContext, mockServices, renderWithAuth, sequencerServiceMock } from '../../../utils/test-utils'

describe('Reload script', () => {
  beforeEach(() => resetCalls(sequencerServiceMock))
  const smService = mockServices.mock.smService
  const obsMode = new ObsMode('Darknight')
  const subsystem = 'ESW'
  const componentId = new ComponentId(new Prefix(subsystem, obsMode.toJSON()), 'Sequencer')
  const responseScenarios: [string, RestartSequencerResponse, string][] = [
    [
      'Success',
      {
        _type: 'Success',
        componentId: componentId
      },
      reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode.toJSON()}`)
    ],
    [
      'LocationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer location not found'
      },
      `${reloadScriptConstants.getFailureMessage(
        `${subsystem}.${obsMode.toJSON()}`
      )}, reason: Sequencer location not found`
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        state: 'Processing',
        messageType: 'RestartSequencer',
        msg: "Sequence Manager can not accept 'RestartSequencer' message in 'Processing'"
      },
      `${reloadScriptConstants.getFailureMessage(
        `${subsystem}.${obsMode.toJSON()}`
      )}, reason: Sequence Manager can not accept 'RestartSequencer' message in 'Processing'`
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'Sequence Manager Operation(RestartSequencer) failed due to: Ask timed out after [10000] ms'
      },
      `${reloadScriptConstants.getFailureMessage(
        `${subsystem}.${obsMode.toJSON()}`
      )}, reason: Sequence Manager Operation(RestartSequencer) failed due to: Ask timed out after [10000] ms`
    ]
  ]

  responseScenarios.forEach(([testName, res, message]) => {
    it(`should return ${testName} when Reload Script is clicked | ESW-502`, async () => {
      when(smService.restartSequencer(subsystem, deepEqual(obsMode))).thenResolve(res)

      renderWithAuth({
        ui: (
          <MenuWithStepListContext
            menuItem={() =>
              ReloadScript({
                subsystem: subsystem,
                obsMode: obsMode.toJSON()
              })
            }
          />
        )
      })

      const reloadScriptItem = screen.getByRole('ReloadScript')
      await waitFor(() => userEvent.click(reloadScriptItem))

      // expect modal to be visible
      const modalTitle = await screen.findByText(reloadScriptConstants.getModalTitle(subsystem, obsMode.name))
      expect(modalTitle).to.exist

      const document = screen.getByRole('document')
      const reloadConfirm = within(document).getByRole('button', {
        name: reloadScriptConstants.modalOkText
      })
      await waitFor(() => userEvent.click(reloadConfirm))

      await screen.findByText(message)
      await waitFor(
        () => expect(screen.queryByText(reloadScriptConstants.getModalTitle(subsystem, obsMode.name))).to.null
      )
      verify(smService.restartSequencer(subsystem, deepEqual(obsMode))).called()
    })
  })
})
