import { CloseCircleOutlined, VerticalAlignMiddleOutlined } from '@ant-design/icons'
import type { SequencerService, Step } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useStepListContext } from '../../hooks/useStepListContext'
import { insertBreakPointConstants, removeBreakPointConstants } from '../../sequencerConstants'
import { handleStepActionResponse } from '../../utils'
import { ItemType } from 'antd/es/menu/interface'

const insertAction = (id: string) => (sequencerService: SequencerService) =>
  sequencerService.addBreakpoint(id).then(handleStepActionResponse)

const removeAction = (id: string) => (sequencerService: SequencerService) =>
  sequencerService.removeBreakpoint(id).then(handleStepActionResponse)

// XXX NOTE: Was an antd 4.x MenuItem component, changed to be a hook returning the props for antd 5,x
export function useBreakpointActionItem(step: Step, isDisabled: boolean): ItemType {
  const { sequencerService } = useStepListContext()

  const insertBreakpointAction = useMutation({
    mutationFn: insertAction(step.id),
    onSuccess: () => successMessage(insertBreakPointConstants.successMessage),
    onError: (e) => errorMessage(insertBreakPointConstants.failureMessage, e)
  })

  const removeBreakpointAction = useMutation({
    mutationFn: removeAction(step.id),
    onSuccess: () => successMessage(removeBreakPointConstants.successMessage),
    onError: (e) => errorMessage(removeBreakPointConstants.failureMessage, e)
  })

  const handleOnClick = async () => {
    if (step.hasBreakpoint) {
      sequencerService && await removeBreakpointAction.mutate(sequencerService)
    } else {
      sequencerService && await insertBreakpointAction.mutate(sequencerService)
    }
  }
  const icon = step.hasBreakpoint ? <CloseCircleOutlined /> : <VerticalAlignMiddleOutlined />

  const itemText = step.hasBreakpoint ? removeBreakPointConstants.menuItemText : insertBreakPointConstants.menuItemText

  return {
    key: 'BreakpointAction',
    disabled: isDisabled,
    icon: icon,
    onClick: handleOnClick,
    label: itemText
  }
}
