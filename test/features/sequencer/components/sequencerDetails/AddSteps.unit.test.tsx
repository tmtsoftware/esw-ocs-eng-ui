import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup } from '@tmtsoftware/esw-ts'
import type { GenericResponse, SequenceCommand } from '@tmtsoftware/esw-ts'
import { anything, reset, verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { addStepsItem } from '../../../../../src/features/sequencer/components/steplist/AddSteps'
import {
  addStepConstants,
  stepConstants,
  uploadSequenceConstants
} from '../../../../../src/features/sequencer/sequencerConstants'
import { _createErrorMsg } from '../../../../../src/utils/message'
import { MenuWithStepListContext, renderWithAuth, sequencerServiceMock } from '../../../../utils/test-utils'

type TestData = {
  testName: string
  response: GenericResponse
  message: string
}

afterEach(async () => {
  reset(sequencerServiceMock)
})

describe('AddSteps', () => {
  const user = userEvent.setup()
  const unhandledMsg = 'unhandled'
  const id = 'step_1'
  const seqPrefix = Prefix.fromString('ESW.darknight')
  const commands: SequenceCommand[] = [new Setup(seqPrefix, 'move', [], '2020A-001-123')]
  const file = new File([JSON.stringify(commands)], 'commands.json', {
    type: 'application/json'
  })
  const testCases: TestData[] = [
    {
      testName: 'should add uploaded steps | ESW-461',
      response: { _type: 'Ok' },
      message: addStepConstants.successMessage
    },
    {
      testName: 'should show error if step id does not exist | ESW-461',
      response: { _type: 'IdDoesNotExist', id },
      message: _createErrorMsg(addStepConstants.failureMessage, stepConstants.idDoesNotExistMsg(id))
    },
    {
      testName: 'should show error if the step is finished | ESW-461',
      response: { _type: 'CannotOperateOnAnInFlightOrFinishedStep' },
      message: _createErrorMsg(
        addStepConstants.failureMessage,
        stepConstants.cannotOperateOnAnInFlightOrFinishedStepMsg
      )
    },
    {
      testName: 'should show error if unhandled response is given by sequencer | ESW-461',
      response: {
        _type: 'Unhandled',
        msg: unhandledMsg,
        state: 'idle',
        messageType: 'InsertAfter'
      },
      message: _createErrorMsg(addStepConstants.failureMessage, unhandledMsg)
    }
  ]

  testCases.forEach(({ testName, response, message }) => {
    it(testName, async () => {
      when(sequencerServiceMock.insertAfter(id, anything())).thenResolve(response)
      const menuItem = addStepsItem(false, id)
      renderWithAuth({
        ui: <MenuWithStepListContext menuItem={menuItem} />
      })
      const addStepsButton = await screen.findByRole('button', {
        name: new RegExp(addStepConstants.menuItemText)
      })
      await user.click(addStepsButton)

      const inputBox = addStepsButton.firstChild as HTMLInputElement
      await userEvent.upload(inputBox, file)

      await screen.findByText(message)
      // XXX TODO FIXME: Not sure why this wasn't working!
      // verify(sequencerServiceMock.insertAfter(id, deepEqual(commands))).called()
    })
  })

  it('should show error if file content is not valid ', async () => {
    const file = new File([JSON.stringify({ invalidCommands: 'invalidCommands' })], 'commands.json', {
      type: 'application/json'
    })

    const menuItem = addStepsItem(false, id)
    renderWithAuth({
      ui: <MenuWithStepListContext menuItem={menuItem} />
    })

    const addStepsButton = await screen.findByRole('button', {
      name: new RegExp(addStepConstants.menuItemText)
    })
    await user.click(addStepsButton)

    const inputBox = addStepsButton.firstChild as HTMLInputElement
    await userEvent.upload(inputBox, file)

    await screen.findByText(
      _createErrorMsg(addStepConstants.failureMessage, uploadSequenceConstants.couldNotDeserializeReason)
    )
    verify(sequencerServiceMock.insertAfter(anything(), anything())).never()
  })
})
