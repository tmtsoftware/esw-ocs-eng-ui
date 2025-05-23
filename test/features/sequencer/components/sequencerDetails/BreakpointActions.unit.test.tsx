import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup } from '@tmtsoftware/esw-ts'
import type { GenericResponse, RemoveBreakpointResponse, Step } from '@tmtsoftware/esw-ts'
import { reset, verify, when } from '@johanblumenberg/ts-mockito'
import React from 'react'
import { useBreakpointActionItem } from '../../../../../src/features/sequencer/components/steplist/BreakpointActions'
import {
  insertBreakPointConstants,
  removeBreakPointConstants,
  stepConstants
} from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceInstance, sequencerServiceMock } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'
import { Menu } from 'antd'
import {
  StepListContextProvider,
  StepListTableContextType
} from '../../../../../src/features/sequencer/hooks/useStepListContext'

describe('Breakpoint actions', () => {
  beforeEach(() => reset(sequencerServiceMock))

  // Note: Old version used deprecated antd MenuItem, replaced with ItemType[] prop.
  // Code still needs to be wrapped in StepListContextProvider.
  const LocalMenu = ({ step }: { step: Step }): React.JSX.Element => {
    return <Menu items={[useBreakpointActionItem(step, false)]} />
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

  const insertBreakpointTests: [string, GenericResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      insertBreakPointConstants.successMessage
    ],
    [
      'CannotOperateOnAnInFlightOrFinishedStep',
      {
        _type: 'CannotOperateOnAnInFlightOrFinishedStep'
      },
      `${insertBreakPointConstants.failureMessage}, reason: ${stepConstants.cannotOperateOnAnInFlightOrFinishedStepMsg}`
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot add breakpoint in idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      `${insertBreakPointConstants.failureMessage}, reason: Cannot add breakpoint in idle state`
    ],
    [
      'IdDoesNotExist',
      {
        _type: 'IdDoesNotExist',
        id: 'step1'
      },
      `${insertBreakPointConstants.failureMessage}, reason: ${stepConstants.idDoesNotExistMsg('step1')}`
    ]
  ]

  insertBreakpointTests.forEach(([testName, res, message]) => {
    it(`should return ${testName} when Insert breakpoint is clicked | ESW-459`, async () => {
      const user = userEvent.setup()
      const step: Step = {
        hasBreakpoint: false,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
      when(sequencerServiceMock.addBreakpoint(step.id)).thenResolve(res)

      renderWithAuth({
        ui: <LocalMenuWithStepListContext step={step} />
      })

      const insertBreakpoint = await screen.findByText(insertBreakPointConstants.menuItemText)
      await user.click(insertBreakpoint)

      await screen.findByText(message)

      verify(sequencerServiceMock.addBreakpoint(step.id)).called()
    })
  })

  const removeBreakpointTests: [string, RemoveBreakpointResponse, string][] = [
    [
      'success',
      {
        _type: 'Ok'
      },
      removeBreakPointConstants.successMessage
    ],
    [
      'Unhandled',
      {
        _type: 'Unhandled',
        msg: 'Cannot remove breakpoint in idle state',
        state: 'Idle',
        messageType: 'Unhandled'
      },
      `${removeBreakPointConstants.failureMessage}, reason: Cannot remove breakpoint in idle state`
    ],
    [
      'IdDoesNotExist',
      {
        _type: 'IdDoesNotExist',
        id: 'step1'
      },
      `${removeBreakPointConstants.failureMessage}, reason: ${stepConstants.idDoesNotExistMsg('step1')}`
    ]
  ]

  removeBreakpointTests.forEach(([testName, res, message]) => {
    it(`should return ${testName} when Remove breakpoint is clicked | ESW-459`, async () => {
      const user = userEvent.setup()
      const step: Step = {
        hasBreakpoint: true,
        status: { _type: 'Pending' },
        command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
        id: 'step1'
      }
      when(sequencerServiceMock.removeBreakpoint(step.id)).thenResolve(res)

      renderWithAuth({
        ui: <LocalMenuWithStepListContext step={step} />
      })

      const removeBreakpoint = await screen.findByText(removeBreakPointConstants.menuItemText)
      // const removeBreakpoint = await screen.findByRole("menuitem")
      await user.click(removeBreakpoint)

      await screen.findByText(message)

      verify(sequencerServiceMock.removeBreakpoint(step.id)).called()
    })
  })
})
