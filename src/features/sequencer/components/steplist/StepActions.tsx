import { CopyOutlined, MoreOutlined } from '@ant-design/icons'
import type { Step } from '@tmtsoftware/esw-ts'
import { Dropdown, Menu } from 'antd'
import React from 'react'
import { addStepsItem } from './AddSteps'
import { breakpointActionItem } from './BreakpointActions'
import { deleteActionItem } from './DeleteAction'
import { replaceStepItem } from './ReplaceStep'
import { useStepListContext } from '../../hooks/useStepListContext'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import type { ItemType } from 'antd/es/menu/interface'

// XXX TODO FIXME: use custom hook?
function stepActionsMenuItems(step: Step): ItemType[] {
  const status = step.status._type
  const isFinished = status === 'Failure' || status === 'Success'
  const isInProgressOrIsFinished = status === 'InFlight' || isFinished

  const { handleDuplicate, stepListStatus } = useStepListContext()

  //add the menu item that you want to support in the step list.
  return [
    breakpointActionItem(step, isInProgressOrIsFinished),
    addStepsItem(isFinished, step.id),
    replaceStepItem(isFinished, step.id),
    {
      key: 'Duplicate',
      onClick: handleDuplicate,
      disabled: stepListStatus === 'All Steps Completed',
      icon: <CopyOutlined />
    },
    deleteActionItem(step, isInProgressOrIsFinished)
  ]
}

export const StepActions = ({ step }: { step: Step }): React.JSX.Element => {
  const items = stepActionsMenuItems(step)
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <MoreOutlined className={styles.actionEnabled} style={{ fontSize: '1.5rem' }} role='stepActions' />
    </Dropdown>
  )
}
