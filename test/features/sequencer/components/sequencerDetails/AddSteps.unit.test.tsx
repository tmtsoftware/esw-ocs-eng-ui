import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  GenericResponse,
  Prefix,
  SequenceCommand,
  Setup
} from '@tmtsoftware/esw-ts'
import React from 'react'
import { anything, deepEqual, verify, when } from 'ts-mockito'
import { AddSteps } from '../../../../../src/features/sequencer/components/sequencerDetails/AddSteps'
import {
  cannotOperateOnAnInFlightOrFinishedStepMsg,
  idDoesNotExistMsg
} from '../../../../../src/features/sequencer/components/sequencerResponsesMapping'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

type TestData = {
  testName: string
  response: GenericResponse
  message: string
}

describe('AddSteps', () => {
  const unhandledMsg = 'unhandled'
  const id = 'step_1'
  const seqPrefix = Prefix.fromString('ESW.darknight')
  const commands: SequenceCommand[] = [
    new Setup(seqPrefix, 'move', [], '2020A-001-123')
  ]
  const file = new File([JSON.stringify({ commands })], 'commands.json')
  const testCases: TestData[] = [
    {
      testName: 'should add uploaded steps | ESW-461',
      response: { _type: 'Ok' },
      message: 'Successfully added steps'
    },
    {
      testName: 'should show error if step id does not exist | ESW-461',
      response: { _type: 'IdDoesNotExist', id },
      message: `Failed to add steps, reason: ${idDoesNotExistMsg(id)}`
    },
    {
      testName: 'should show error if the step is finished | ESW-461',
      response: { _type: 'CannotOperateOnAnInFlightOrFinishedStep' },
      message: `Failed to add steps, reason: ${cannotOperateOnAnInFlightOrFinishedStepMsg}`
    },
    {
      testName:
        'should show error if unhandled response is given by sequencer | ESW-461',
      response: {
        _type: 'Unhandled',
        msg: unhandledMsg,
        state: 'idle',
        messageType: 'InsertAfter'
      },
      message: `Failed to add steps, reason: ${unhandledMsg}`
    }
  ]

  testCases.forEach(({ testName, response, message }) => {
    it(testName, async () => {
      when(sequencerServiceMock.insertAfter(id, anything())).thenResolve(
        response
      )

      renderWithAuth({
        ui: (
          <AddSteps disabled={false} sequencerPrefix={seqPrefix} stepId={id} />
        )
      })

      const upload = await screen.findByRole('button', { name: /add steps/i })
      userEvent.click(upload)

      // eslint-disable-next-line testing-library/no-node-access
      const inputBox = upload.firstChild as HTMLInputElement
      userEvent.upload(inputBox, file)

      await screen.findByText(message)
      verify(sequencerServiceMock.insertAfter(id, deepEqual(commands))).called()
    })
  })
})
