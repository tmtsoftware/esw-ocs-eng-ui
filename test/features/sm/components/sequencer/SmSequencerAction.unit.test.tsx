import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix, SequencerState } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { deepEqual, reset, verify, when } from 'ts-mockito'
import { SmSequencerAction } from '../../../../../src/features/sm/components/sequencer/SmSequencerAction'
import {
  reloadScriptConstants,
  sequencerActionConstants,
  startSequencerConstants
} from '../../../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('SmSequencerAction', () => {
  const smService = mockServices.mock.smService
  const subsystem = 'ESW'
  const obsModeString = 'IRIS_Darknight'
  const obsMode = new ObsMode(obsModeString)
  const sequencerPrefix = new Prefix(subsystem, obsModeString)
  const componentId = new ComponentId(sequencerPrefix, 'Sequencer')

  beforeEach(() => {
    reset(smService)
  })
  it('should reload scripts if sequencer state exists | ESW-506', async () => {
    when(smService.restartSequencer(subsystem, deepEqual(obsMode))).thenResolve({
      _type: 'Success',
      componentId: componentId
    })
    const running: SequencerState = { _type: 'Running' }

    renderWithAuth({
      ui: <SmSequencerAction sequencerPrefix={sequencerPrefix} sequencerState={running} />
    })

    const link = await screen.findByText(sequencerActionConstants.reloadScript)
    await waitFor(() => userEvent.click(link))
    const yesButton = await screen.findByRole('button', { name: sequencerActionConstants.popConfirmOkText })
    screen.getByText(sequencerActionConstants.getPopConfirmTitle(subsystem, obsMode.toJSON(), running))
    await waitFor(() => userEvent.click(yesButton))
    await screen.findByText(reloadScriptConstants.getSuccessMessage(sequencerPrefix.toJSON()))

    verify(smService.restartSequencer(subsystem, deepEqual(obsMode))).once()
  })

  it('should start sequencer if sequencer is down | ESW-506', async () => {
    when(smService.startSequencer(subsystem, deepEqual(obsMode))).thenResolve({
      _type: 'Started',
      componentId: componentId
    })

    renderWithAuth({
      ui: <SmSequencerAction sequencerPrefix={new Prefix(subsystem, obsModeString)} sequencerState={undefined} />
    })

    const link = await screen.findByText(sequencerActionConstants.startSequencer)
    await waitFor(() => userEvent.click(link))

    await screen.findByText(startSequencerConstants.successMessage)
    verify(smService.startSequencer(subsystem, deepEqual(obsMode))).once()
  })
  const testCasesForByPassingModal: SequencerState['_type'][] = ['Idle', 'Offline']

  testCasesForByPassingModal.forEach((state) => {
    it(`should not show confirm modal when sequencer is in ${state} | ESW-506`, async () => {
      when(smService.restartSequencer(subsystem, deepEqual(obsMode))).thenResolve({
        _type: 'Success',
        componentId: componentId
      })
      const sequencerState: SequencerState = { _type: state }

      renderWithAuth({
        ui: <SmSequencerAction sequencerPrefix={sequencerPrefix} sequencerState={sequencerState} />
      })

      const link = await screen.findByText(sequencerActionConstants.reloadScript)
      await waitFor(() => userEvent.click(link))
      const modal = screen.queryByText(
        sequencerActionConstants.getPopConfirmTitle(subsystem, obsMode.toJSON(), sequencerState)
      )
      expect(modal).to.not.exist

      await screen.findByText(reloadScriptConstants.getSuccessMessage(sequencerPrefix.toJSON()))

      verify(smService.restartSequencer(subsystem, deepEqual(obsMode))).once()
    })
  })
})
