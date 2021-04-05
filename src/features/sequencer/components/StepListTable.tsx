import {
  CopyOutlined,
  DeleteOutlined,
  MoreOutlined,
  PlusCircleOutlined,
  VerticalAlignMiddleOutlined
} from '@ant-design/icons'
import { ComponentId, Prefix, Step, StepList } from '@tmtsoftware/esw-ts'
import { Button, Dropdown, Menu, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { BaseType } from 'antd/lib/typography/Base'
import React from 'react'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STEP_LIST } from '../../queryKeys'
import styles from './sequencer.module.css'
import { typeStatus } from './SequencersTable'

const useStepList = (
  sequencerPrefix: Prefix
): UseQueryResult<StepList | undefined> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const getStepList = async () => {
    const compId = new ComponentId(sequencerPrefix, 'Sequencer')
    const sequencerService = await sequencerServiceFactory(compId)
    return await sequencerService.getSequence()
  }
  return useQuery(SEQUENCER_STEP_LIST.key, getStepList, {
    useErrorBoundary: false,
    refetchInterval: SEQUENCER_STEP_LIST.refetchInterval
  })
}

const menu = (
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

const color: { [stepStatus: string]: BaseType } = {
  Success: 'secondary',
  Failure: 'danger',
  Pending: 'warning',
  InFlight: 'success'
}

const baseTypeColorCode = {
  secondary: '#00000073',
  danger: '#ff4d4f',
  warning: '#FFC53D',
  success: '#52c41a'
}

const StepComponent = (step: Step, stepNumber: number): JSX.Element => (
  <Space>
    <Typography.Text type={'secondary'}>{stepNumber}</Typography.Text>
    <Button
      key={step.command.commandName}
      style={{
        borderColor: baseTypeColorCode[color[step.status._type]],
        width: '10.9rem'
      }}
      shape={'round'}>
      <Typography.Text type={color[step.status._type]}>
        Step Number
      </Typography.Text>
    </Button>
    <Dropdown overlay={menu}>
      <MoreOutlined />
    </Dropdown>
  </Space>
)

const columns = (
  stepListStatus: keyof typeof typeStatus
): ColumnsType<Step> => [
  {
    title: (
      <>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          Sequence Steps
        </Typography.Title>
        <Space>
          <Typography.Text type={'secondary'}>Status:</Typography.Text>
          <Typography.Text type={typeStatus[stepListStatus]}>
            {stepListStatus}
          </Typography.Text>
        </Space>
      </>
    ),
    key: 'id',
    dataIndex: 'status',
    render: (_, record, index) => StepComponent(record, index + 1)
  }
]

export const StepListTable = ({
  sequencerPrefix,
  stepListStatus
}: {
  sequencerPrefix: Prefix
  stepListStatus: keyof typeof typeStatus
}): JSX.Element => {
  const stepList = useStepList(sequencerPrefix)

  return (
    <Table
      pagination={false}
      dataSource={stepList.data}
      columns={columns(stepListStatus)}
      scroll={{ y: '100%' }}
      onRow={() => ({ className: styles.cell })}
      onHeaderRow={() => ({ className: styles.cell })}
    />
  )
}
