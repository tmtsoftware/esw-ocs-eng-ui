import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix, RestartSequencerResponse } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, resetCalls, verify, when } from 'ts-mockito'
import { ReloadScript } from '../../../../src/features/sm/components/ReloadScript'
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
      `Successfully loaded script ${subsystem}.${obsMode.toJSON()}`
    ],
    [
      'LocationServiceError',
      {
        _type: 'LocationServiceError',
        reason: 'Sequencer location not found'
      },
      `Failed to load script ${subsystem}.${obsMode.toJSON()}, reason: Sequencer location not found`
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        state: 'Processing',
        messageType: 'RestartSequencer',
        msg: "Sequence Manager can not accept 'RestartSequencer' message in 'Processing'"
      },
      `Failed to load script ${subsystem}.${obsMode.toJSON()}, reason: Sequence Manager can not accept 'RestartSequencer' message in 'Processing'`
    ],
    [
      'FailedResponse',
      {
        _type: 'FailedResponse',
        reason: 'Sequence Manager Operation(RestartSequencer) failed due to: Ask timed out after [10000] ms'
      },
      `Failed to load script ${subsystem}.${obsMode.toJSON()}, reason: Sequence Manager Operation(RestartSequencer) failed due to: Ask timed out after [10000] ms`
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
      const modalTitle = await screen.findByText(`Do you want to reload the sequencer ${componentId.prefix.toJSON()}?`)
      expect(modalTitle).to.exist

      const document = screen.getByRole('document')
      const reloadConfirm = within(document).getByRole('button', {
        name: 'Reload'
      })
      await waitFor(() => userEvent.click(reloadConfirm))

      await screen.findByText(message)
      await waitFor(
        () => expect(screen.queryByText(`Do you want to reload the sequencer ${componentId.prefix.toJSON()}?`)).to.null
      )
      verify(smService.restartSequencer(subsystem, deepEqual(obsMode))).called()
    })
  })
})
