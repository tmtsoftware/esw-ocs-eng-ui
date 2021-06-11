import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ComponentId, ObsMode, Prefix } from '@tmtsoftware/esw-ts'
import React from 'react'
import { deepEqual, verify, when } from 'ts-mockito'
import { SmSequencerAction } from '../../../../../src/features/sm/components/sequencer/SmSequencerAction'
import { sequencerActionConstants } from '../../../../../src/features/sm/smConstants'
import { mockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('SmSequencerAction', () => {
  const smService = mockServices.mock.smService
  const subsystem = 'ESW'
  const obsModeString = 'IRIS_Darknight'
  const obsMode = new ObsMode(obsModeString)
  const componentId = new ComponentId(new Prefix(subsystem, obsMode.toJSON()), 'Sequencer')

  it('should reload scripts if sequencer state exists | ESW-506', async () => {
    when(smService.restartSequencer(subsystem, deepEqual(obsMode))).thenResolve({
      _type: 'Success',
      componentId: componentId
    })

    renderWithAuth({
      ui: (
        <SmSequencerAction sequencerPrefix={new Prefix(subsystem, obsModeString)} sequencerState={{ _type: 'Idle' }} />
      )
    })

    const link = await screen.findByText(sequencerActionConstants.reloadScript)
    await waitFor(() => userEvent.click(link))
    const yesButton = await screen.findByRole('button', { name: sequencerActionConstants.popConfirmOkText })
    screen.getByText(sequencerActionConstants.popConfirmTitle)
    await waitFor(() => userEvent.click(yesButton))
    verify(smService.restartSequencer(subsystem, deepEqual(obsMode))).once()
  })
})
