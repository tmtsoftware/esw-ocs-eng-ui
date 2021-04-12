import {
  CopyOutlined,
  DeleteOutlined,
  PlusCircleOutlined
} from '@ant-design/icons'
import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import { Menu, Typography } from 'antd'
import React from 'react'
import { BreakpointAction } from './BreakpointActions'

export const StepActions = ({
  step,
  sequencerPrefix
}: {
  step: Step
  sequencerPrefix: Prefix
}): JSX.Element => (
  <Menu>
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
      <DeleteOutlined style={{ color: 'red' }} />
      <Typography.Text type={'danger'}>Delete</Typography.Text>
    </Menu.Item>
  </Menu>
)
