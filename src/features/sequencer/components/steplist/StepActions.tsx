import { CopyOutlined, MoreOutlined } from '@ant-design/icons'
import { Dropdown, Menu } from 'antd'
import React, { useState } from 'react'
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
  hideMenu
}: {
  step: Step
  sequencerPrefix: Prefix
  hideMenu: () => void
}): JSX.Element => {
  const status = step.status._type
  const isFinished = status === 'Failure' || status === 'Success'
  const isInProgressOrIsFinished = status === 'InFlight' || isFinished

  const { handleDuplicate, stepListStatus } = useStepListContext()

  return (
    <Menu onClick={hideMenu} className={styles.menu} selectedKeys={[]}>
      <Menu.Item key='1' disabled={isInProgressOrIsFinished}>
        <BreakpointAction
          step={step}
          sequencerPrefix={sequencerPrefix}
          isDisabled={isInProgressOrIsFinished}
        />
      </Menu.Item>
      <Menu.Item key='2' disabled={isFinished}>
        <AddSteps
          disabled={isFinished}
          stepId={step.id}
          sequencerPrefix={sequencerPrefix}
        />
      </Menu.Item>
      <Menu.Item
        key='3'
        onClick={handleDuplicate}
        disabled={stepListStatus === 'All Steps Completed'}>
        <CopyOutlined />
        Duplicate
      </Menu.Item>
      <Menu.Item key='4' disabled={isInProgressOrIsFinished} danger>
        <DeleteAction
          step={step}
          sequencerPrefix={sequencerPrefix}
          isDisabled={isInProgressOrIsFinished}
        />
      </Menu.Item>
    </Menu>
  )
}

export const StepActions = ({
  sequencerPrefix,
  step
}: SequencerStepProps): JSX.Element => {
  const [isOverlayVisible, toggleOverlayVisibility] = useState<boolean>(false)

  return (
    <Dropdown
      overlay={
        <StepActionsMenu
          sequencerPrefix={sequencerPrefix}
          step={step}
          hideMenu={() => toggleOverlayVisibility(false)}
        />
      }
      trigger={['click']}
      onVisibleChange={toggleOverlayVisibility}
      visible={isOverlayVisible}>
      <MoreOutlined style={{ fontSize: '1.5rem' }} role='stepActions' />
    </Dropdown>
  )
}
