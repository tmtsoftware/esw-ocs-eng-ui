import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup } from '@tmtsoftware/esw-ts'
import type { GenericResponse, Step } from '@tmtsoftware/esw-ts'
import { verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { useDeleteActionItem } from '../../../../../src/features/sequencer/components/steplist/DeleteAction'
import { deleteStepConstants, stepConstants } from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceInstance, sequencerServiceMock } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'
import { Menu } from 'antd'
import {
  StepListContextProvider,
  StepListTableContextType
} from '../../../../../src/features/sequencer/hooks/useStepListContext'

describe('Delete action', () => {
  const LocalMenu = ({ step }: { step: Step }): React.JSX.Element => {
    return <Menu items={[useDeleteActionItem(step, false)]} />
  }

  const LocalMenuWithStepListContext = ({
    step,
    value = {
      setFollowProgress: () => undefined,
      handleDuplicate: () => undefined,
      isDuplicateEnabled: false,
      stepListStatus: 'In Progress',
      sequencerService: sequencerServiceInstance
    }
  }: {
    step: Step
    value?: StepListTableContextType
  }): React.JSX.Element => {
    return (
      <StepListContextProvider value={value}>
        <LocalMenu step={step} />
      </StepListContextProvider>
    )
  }

  const deleteActionTests: [string, GenericResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      deleteStepConstants.successMessage
    ],
    [
      'CannotOperateOnAnInFlightOrFinishedStep',
      {
        _type: 'CannotOperateOnAnInFlightOrFinishedStep'
      },
      `${deleteStepConstants.failureMessage}, reason: ${stepConstants.cannotOperateOnAnInFlightOrFinishedStepMsg}`
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot delete step in idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      `${deleteStepConstants.failureMessage}, reason: Cannot delete step in idle state`
    ],
    [
      'IdDoesNotExist',
      {
        _type: 'IdDoesNotExist',
        id: 'step1'
      },
      `${deleteStepConstants.failureMessage}, reason: ${stepConstants.idDoesNotExistMsg('step1')}`
    ]
  ]

  deleteActionTests.forEach(([testName, res, message]) => {
    it(`should return ${testName} when delete is clicked | ESW-490`, async () => {
      const user = userEvent.setup({ skipHover: true });
      const step: Step = {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }

      when(sequencerServiceMock.delete(step.id)).thenResolve(res)
      renderWithAuth({
        ui: <LocalMenuWithStepListContext step={step} />
      })

      const deleteButton = await screen.findByRole('menuitem')
      await user.click(deleteButton)

      await screen.findAllByText(deleteStepConstants.getModalTitle('Command-1'))
      const deleteStep = screen.getAllByRole('button', { name: deleteStepConstants.modalOkText })

      await user.click(deleteStep[0])

      await screen.findByText(message)

      verify(sequencerServiceMock.delete(step.id)).called()
    })
  })
})
