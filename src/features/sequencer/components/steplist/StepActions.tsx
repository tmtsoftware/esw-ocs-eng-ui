import { CopyOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import React from 'react'
import { useStepListContext } from '../../hooks/useStepListContext'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { AddSteps } from './AddSteps'
import { BreakpointAction } from './BreakpointActions'
import { DeleteAction } from './DeleteAction'
import type { Prefix, Step } from '@tmtsoftware/esw-ts'
type SequencerStepProps = {
  step: Step
  sequencerPrefix: Prefix
}

const StepActionsMenu = ({
  step,
  sequencerPrefix,
  ...restProps
}: {
  step: Step
  sequencerPrefix: Prefix
}): JSX.Element => {
  const status = step.status._type
  const isFinished = status === 'Failure' || status === 'Success'
  const isInProgressOrIsFinished = status === 'InFlight' || isFinished

  const { handleDuplicate, stepListStatus } = useStepListContext()

  return (
    <Menu {...restProps} className={styles.menu}>
      {BreakpointAction({
        step,
        sequencerPrefix,
        isDisabled: isInProgressOrIsFinished
      })}

      {AddSteps({
        disabled: isFinished,
        stepId: step.id,
        sequencerPrefix: sequencerPrefix
      })}

      <Menu.Item
        key='Duplicate'
        onClick={handleDuplicate}
        disabled={stepListStatus === 'All Steps Completed'}>
        <CopyOutlined />
        Duplicate
      </Menu.Item>

      {DeleteAction({
        step,
        sequencerPrefix,
        isDisabled: isInProgressOrIsFinished
      })}
    </Menu>
  )
}

export const StepActions = ({
  sequencerPrefix,
  step
}: SequencerStepProps): JSX.Element => (
  <Dropdown
    overlay={() => (
      <StepActionsMenu sequencerPrefix={sequencerPrefix} step={step} />
    )}
    trigger={['click']}>
    <MoreOutlined style={{ fontSize: '1.5rem' }} role='stepActions' />
  </Dropdown>
)
