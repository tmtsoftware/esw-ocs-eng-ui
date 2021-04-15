import { CopyOutlined, PlusCircleOutlined } from '@ant-design/icons'
import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import { Menu } from 'antd'
import React from 'react'
import { BreakpointAction } from './BreakpointActions'
import { DeleteAction } from './DeleteAction'

export const StepActions = ({
  step,
  sequencerPrefix,
  handleMenuClick
}: {
  step: Step
  sequencerPrefix: Prefix
  handleMenuClick: () => void
}): JSX.Element => (
  <Menu onClick={handleMenuClick}>
    <Menu.Item key='1'>
      <BreakpointAction step={step} sequencerPrefix={sequencerPrefix} />
    </Menu.Item>
    <Menu.Item key='2'>
      <PlusCircleOutlined />
      Add a step
    </Menu.Item>
    <Menu.Item key='3'>
      <CopyOutlined />
      Duplicate
    </Menu.Item>
    <Menu.Item key='4'>
      <DeleteAction step={step} sequencerPrefix={sequencerPrefix} />
    </Menu.Item>
  </Menu>
)
