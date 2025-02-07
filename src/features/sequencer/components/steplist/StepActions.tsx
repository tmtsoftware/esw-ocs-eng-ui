import { CopyOutlined, MoreOutlined } from '@ant-design/icons'
import type { Step } from '@tmtsoftware/esw-ts'
import { Dropdown, Menu } from 'antd'
import React from 'react'
import { useAddStepsItem } from './AddSteps'
import { useBreakpointActionItem } from './BreakpointActions'
import { useDeleteActionItem } from './DeleteAction'
import { useReplaceStepItem } from './ReplaceStep'
import { useStepListContext } from '../../hooks/useStepListContext'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import type { ItemType } from 'antd/es/menu/interface'

function useStepActionsMenuItems(step: Step): ItemType[] {
  const status = step.status._type
  const isFinished = status === 'Failure' || status === 'Success'
  const isInProgressOrIsFinished = status === 'InFlight' || isFinished

  const { handleDuplicate, stepListStatus } = useStepListContext()

  const breakpointActionItem = useBreakpointActionItem(step, isInProgressOrIsFinished)
  const addStepsItem = useAddStepsItem(isFinished, step.id)
  const replaceStepItem = useReplaceStepItem(isFinished, step.id)
  const deleteActionItem = useDeleteActionItem(step, isInProgressOrIsFinished)
  const dupActionItem = {
    key: 'Duplicate',
    onClick: handleDuplicate,
    disabled: stepListStatus === 'All Steps Completed',
    icon: <CopyOutlined />
  }

  //add the menu item that you want to support in the step list.
  return [
    breakpointActionItem,
    addStepsItem,
    replaceStepItem,
    dupActionItem,
    deleteActionItem
  ]
}

export const StepActions = ({ step }: { step: Step }): React.JSX.Element => {
  const items = useStepActionsMenuItems(step)
  return (
    <Dropdown menu={{ items }} trigger={['click']}>
      <MoreOutlined className={styles.actionEnabled} style={{ fontSize: '1.5rem' }} role='stepActions' />
    </Dropdown>
  )
}
