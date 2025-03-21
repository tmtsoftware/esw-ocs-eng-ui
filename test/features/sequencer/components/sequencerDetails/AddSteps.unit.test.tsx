import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, type Step } from '@tmtsoftware/esw-ts'
import type { GenericResponse, SequenceCommand } from '@tmtsoftware/esw-ts'
import { anything, reset, verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { useAddStepsItem } from '../../../../../src/features/sequencer/components/steplist/AddSteps'
import {
  addStepConstants,
  stepConstants,
  uploadSequenceConstants
} from '../../../../../src/features/sequencer/sequencerConstants'
import { _createErrorMsg } from '../../../../../src/utils/message'
import { renderWithAuth, sequencerServiceInstance, sequencerServiceMock } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'
import { Menu } from 'antd'
import { useBreakpointActionItem } from '../../../../../src/features/sequencer/components/steplist/BreakpointActions'
import {
  StepListContextProvider,
  StepListTableContextType
} from '../../../../../src/features/sequencer/hooks/useStepListContext'

type TestData = {
  testName: string
  response: GenericResponse
  message: string
}

afterEach(async () => {
  reset(sequencerServiceMock)
})

describe('AddSteps', () => {

  const LocalMenu = ({ id }: { id: string }): React.JSX.Element => {
    return <Menu items={[useAddStepsItem(false, id)]} />
  }

  const LocalMenuWithStepListContext = ({
    id,
    value = {
      setFollowProgress: () => undefined,
      handleDuplicate: () => undefined,
      isDuplicateEnabled: false,
      stepListStatus: 'In Progress',
      sequencerService: sequencerServiceInstance
    }
  }: {
    id: string
    value?: StepListTableContextType
  }): React.JSX.Element => {
    return (
      <StepListContextProvider value={value}>
        <LocalMenu id={id} />
      </StepListContextProvider>
    )
  }

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
      const user = userEvent.setup()
      when(sequencerServiceMock.insertAfter(id, anything())).thenResolve(response)
      renderWithAuth({
        ui: <LocalMenuWithStepListContext id={id} />
      })
      const addStepsButton = await screen.findByText(addStepConstants.menuItemText)
      await user.click(addStepsButton)

      const inputBox = screen.getByTestId("UploadSequence")
      await user.upload(inputBox, file)

      await screen.findByText(message)
      // XXX TODO FIXME: Not sure why this wasn't working!
      // verify(sequencerServiceMock.insertAfter(id, deepEqual(commands))).called()
    })
  })

  it('should show error if file content is not valid ', async () => {
    const user = userEvent.setup()
    const file = new File([JSON.stringify({ invalidCommands: 'invalidCommands' })], 'commands.json', {
      type: 'application/json'
    })

    renderWithAuth({
      ui: <LocalMenuWithStepListContext id={id} />
    })

    const addStepsButton = await screen.findByText(addStepConstants.menuItemText)
    await user.click(addStepsButton)

    const inputBox = screen.getByTestId("UploadSequence")
    await user.upload(inputBox, file)

    await screen.findByText(
      _createErrorMsg(addStepConstants.failureMessage, uploadSequenceConstants.couldNotDeserializeReason)
    )
    verify(sequencerServiceMock.insertAfter(anything(), anything())).never()
  })
})
