import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup } from '@tmtsoftware/esw-ts'
import type { GenericResponse, SequenceCommand } from '@tmtsoftware/esw-ts'
import { anything, deepEqual, reset, verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { replaceStepItem } from '../../../../../src/features/sequencer/components/steplist/ReplaceStep'
import {
  replaceStepConstants,
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

describe('ReplaceStep', () => {
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
      testName: 'should replace uploaded steps | ESW-550',
      response: { _type: 'Ok' },
      message: replaceStepConstants.successMessage
    },
    {
      testName: 'should show error if step id does not exist | ESW-550',
      response: { _type: 'IdDoesNotExist', id },
      message: _createErrorMsg(replaceStepConstants.failureMessage, stepConstants.idDoesNotExistMsg(id))
    },
    {
      testName: 'should show error if the step is finished | ESW-550',
      response: { _type: 'CannotOperateOnAnInFlightOrFinishedStep' },
      message: _createErrorMsg(
        replaceStepConstants.failureMessage,
        stepConstants.cannotOperateOnAnInFlightOrFinishedStepMsg
      )
    },
    {
      testName: 'should show error if unhandled response is given by sequencer | ESW-550',
      response: {
        _type: 'Unhandled',
        msg: unhandledMsg,
        state: 'idle',
        messageType: 'Replace'
      },
      message: _createErrorMsg(replaceStepConstants.failureMessage, unhandledMsg)
    }
  ]

  testCases.forEach(({ testName, response, message }) => {
    it(testName, async () => {
      when(sequencerServiceMock.replace(id, anything())).thenResolve(response)

      const menuItem = replaceStepItem(false, id)
      renderWithAuth({
        ui: <MenuWithStepListContext menuItem={menuItem} />
      })

      const replaceStepButton = await screen.findByRole('button', {
        name: new RegExp(replaceStepConstants.menuItemText)
      })
      await user.click(replaceStepButton)

      const inputBox = replaceStepButton.firstChild as HTMLInputElement
      await userEvent.upload(inputBox, file)

      await screen.findByText(message)
      verify(sequencerServiceMock.replace(id, deepEqual(commands))).called()
    })
  })

  it('should show error if file content is not valid ', async () => {
    const file = new File([JSON.stringify({ invalidCommands: 'invalidCommands' })], 'commands.json', {
      type: 'application/json'
    })

    const menuItem = replaceStepItem(false, id)
    renderWithAuth({
      ui: <MenuWithStepListContext menuItem={menuItem} />
    })

    const replaceStepButton = await screen.findByRole('button', {
      name: new RegExp(replaceStepConstants.menuItemText)
    })
    await user.click(replaceStepButton)

    const inputBox = replaceStepButton.firstChild as HTMLInputElement
    await userEvent.upload(inputBox, file)

    await screen.findByText(
      _createErrorMsg(replaceStepConstants.failureMessage, uploadSequenceConstants.couldNotDeserializeReason)
    )
    verify(sequencerServiceMock.replace(anything(), anything())).never()
  })
})
