import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, SequenceCommand, Setup } from '@tmtsoftware/esw-ts'
import React from 'react'
import { anything, deepEqual, verify, when } from 'ts-mockito'
import { AddSteps } from '../../../../../src/features/sequencer/components/sequencerDetails/AddSteps'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('AddSteps', () => {
  it('should add uploaded steps', async () => {
    const id = 'step_1'
    const seqPrefix = Prefix.fromString('ESW.darknight')
    const commands: SequenceCommand[] = [
      new Setup(Prefix.fromString('CSW.filter'), 'move', [], '2020A-001-123')
    ]
    const file = new File([JSON.stringify({ commands })], 'commands.json')

    when(sequencerServiceMock.insertAfter(id, anything())).thenResolve({
      _type: 'Ok'
    })

    renderWithAuth({
      ui: <AddSteps disabled={false} sequencerPrefix={seqPrefix} stepId={id} />
    })

    const upload = await screen.findByRole('button', { name: /add steps/i })
    userEvent.click(upload)

    // eslint-disable-next-line testing-library/no-node-access
    const inputBox = upload.firstChild as HTMLInputElement
    userEvent.upload(inputBox, file)

    await screen.findByText('Successfully added steps')
    verify(sequencerServiceMock.insertAfter(id, deepEqual(commands))).called()
  })
})
