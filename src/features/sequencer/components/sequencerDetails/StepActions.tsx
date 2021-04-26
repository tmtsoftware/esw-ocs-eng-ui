import { CopyOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { useStepListContext } from '../../hooks/useStepListContext'
import { BreakpointAction } from './BreakpointActions'
import { DeleteAction } from './DeleteAction'
import styles from './sequencerDetails.module.css'

export const StepActions = ({
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

  const { handleDuplicate } = useStepListContext()

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
        <PlusCircleOutlined />
        Add a step
      </Menu.Item>
      <Menu.Item key='3' onClick={handleDuplicate}>
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
