import { CloseCircleOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons'
import type { SequencerService, Step } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { handleActionResponse } from '../../utils'

const insertAction = (id: string) => (sequencerService: SequencerService) =>
  sequencerService.addBreakpoint(id).then(handleActionResponse)

const removeAction = (id: string) => (sequencerService: SequencerService) =>
  sequencerService.removeBreakpoint(id).then(handleActionResponse)

export const BreakpointAction = ({ step, isDisabled }: { step: Step; isDisabled: boolean }): JSX.Element => {
  const { sequencerService } = useStepListContext()

  const insertBreakpointAction = useMutation({
    mutationFn: insertAction(step.id),
    onSuccess: () => successMessage('Successfully inserted breakpoint'),
    onError: (e) => errorMessage('Failed to insert breakpoint', e)
  })

  const removeBreakpointAction = useMutation({
    mutationFn: removeAction(step.id),
    onSuccess: () => successMessage('Successfully removed breakpoint'),
    onError: (e) => errorMessage('Failed to remove breakpoint', e)
  })

  const handleOnClick = () => {
    if (step.hasBreakpoint) {
      sequencerService && removeBreakpointAction.mutate(sequencerService)
    } else {
      sequencerService && insertBreakpointAction.mutate(sequencerService)
    }
  }
  const icon = step.hasBreakpoint ? <CloseCircleOutlined /> : <VerticalAlignMiddleOutlined />

  const itemText = step.hasBreakpoint ? 'Remove breakpoint' : 'Insert breakpoint'

  return (
    <Menu.Item key='BreakpointAction' disabled={isDisabled} icon={icon} onClick={handleOnClick}>
      {itemText}
    </Menu.Item>
  )
}
