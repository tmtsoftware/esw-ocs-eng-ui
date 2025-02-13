import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, Prefix, ObsMode } from '@tmtsoftware/esw-ts'
import type { SequencerState } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, reset, verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { SmSequencerAction } from '../../../../../src/features/sm/components/sequencer/SmSequencerAction'
import {
  reloadScriptConstants,
  sequencerActionConstants,
  startSequencerConstants
} from '../../../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('SmSequencerAction', () => {
  const smService = mockServices.mock.smService
  const subsystem = 'ESW'
  const obsMode = new ObsMode('IRIS_Darknight')
  const sequencerPrefix = new Prefix(subsystem, obsMode.name)
  const componentId = new ComponentId(sequencerPrefix, 'Sequencer')
  const user = userEvent.setup()

  beforeEach(() => {
    reset(smService)
  })
  it('should reload scripts if sequencer state exists | ESW-506', async () => {
    when(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve({
      _type: 'Success',
      componentId: componentId
    })
    const running: SequencerState = { _type: 'Running' }

    renderWithAuth({
      ui: (
        <SmSequencerAction sequencerPrefix={sequencerPrefix} sequencerState={running} masterSequencerState={running} />
      )
    })

    const link = await screen.findByText(sequencerActionConstants.reloadScript)
    await waitFor(() => user.click(link))
    const yesButton = await screen.findByRole('button', { name: sequencerActionConstants.popConfirmOkText })
    screen.getByText(sequencerActionConstants.getPopConfirmTitleWithState(sequencerPrefix, running))
    await waitFor(() => user.click(yesButton))
    await screen.findByText(reloadScriptConstants.getSuccessMessage(sequencerPrefix.toJSON()))

    verify(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).once()
  })

  it('should start sequencer if sequencer is down | ESW-506', async () => {
    when(smService.startSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve({
      _type: 'Started',
      componentId: componentId
    })

    renderWithAuth({
      ui: <SmSequencerAction sequencerPrefix={sequencerPrefix} />
    })

    const link = await screen.findByText(sequencerActionConstants.startSequencer)
    await waitFor(() => user.click(link))

    await screen.findByText(startSequencerConstants.successMessage)
    verify(smService.startSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).once()
  })

  it(`should show confirm modal without state when sequencer is not inProgress | ESW-506`, async () => {
    when(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).thenResolve({
      _type: 'Success',
      componentId: componentId
    })
    const offlineSequencerState: SequencerState = { _type: 'Offline' }

    renderWithAuth({
      ui: (
        <SmSequencerAction
          sequencerPrefix={sequencerPrefix}
          sequencerState={offlineSequencerState}
          masterSequencerState={offlineSequencerState}
        />
      )
    })

    const link = await screen.findByText(sequencerActionConstants.reloadScript)
    await waitFor(() => user.click(link))
    const yesButton = await screen.findByRole('button', { name: sequencerActionConstants.popConfirmOkText })
    screen.getByText(sequencerActionConstants.getPopConfirmTitle(sequencerPrefix))
    await waitFor(() => user.click(yesButton))

    await screen.findByText(reloadScriptConstants.getSuccessMessage(sequencerPrefix.toJSON()))

    verify(smService.restartSequencer(deepEqual(subsystem), deepEqual(obsMode), anything())).once()
  })
})
