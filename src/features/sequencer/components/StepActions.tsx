import {
  CopyOutlined,
  DeleteOutlined,
  PlusCircleOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons'
import { Menu, Typography } from 'antd'
import React from 'react'

export const StepActions = (): JSX.Element => (
  <Menu>
    <Menu.Item key='1'>
      <VerticalAlignMiddleOutlined />
      Insert Breakpoint
    </Menu.Item>
    <Menu.Item key='2'>
      <PlusCircleOutlined />
      Add a Step
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
