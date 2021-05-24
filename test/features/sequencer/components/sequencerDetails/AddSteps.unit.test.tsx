import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {
  GenericResponse,
  Prefix,
  SequenceCommand,
  Setup
} from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { anything, deepEqual, verify, when } from 'ts-mockito'
import {
  addStepsErrorPrefix,
  addStepsSuccessMsg,
  cannotOperateOnAnInFlightOrFinishedStepMsg,
  idDoesNotExistMsg
} from '../../../../../src/features/sequencer/components/sequencerMessageConstants'
import { AddSteps } from '../../../../../src/features/sequencer/components/steplist/AddSteps'
import { _createErrorMsg } from '../../../../../src/utils/message'
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
      message: addStepsSuccessMsg
    },
    {
      testName: 'should show error if step id does not exist | ESW-461',
      response: { _type: 'IdDoesNotExist', id },
      message: _createErrorMsg(addStepsErrorPrefix, idDoesNotExistMsg(id))
    },
    {
      testName: 'should show error if the step is finished | ESW-461',
      response: { _type: 'CannotOperateOnAnInFlightOrFinishedStep' },
      message: _createErrorMsg(
        addStepsErrorPrefix,
        cannotOperateOnAnInFlightOrFinishedStepMsg
      )
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
      message: _createErrorMsg(addStepsErrorPrefix, unhandledMsg)
    }
  ]

  testCases.forEach(({ testName, response, message }) => {
    it(testName, async () => {
      when(sequencerServiceMock.insertAfter(id, anything())).thenResolve(
        response
      )
      const AddStepsComponent = () => (
        <Menu>
          {AddSteps({
            disabled: false,
            sequencerPrefix: seqPrefix,
            stepId: id
          })}
        </Menu>
      )
      renderWithAuth({
        ui: <AddStepsComponent />
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
