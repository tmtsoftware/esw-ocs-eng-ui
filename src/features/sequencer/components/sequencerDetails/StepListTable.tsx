import { MoreOutlined } from '@ant-design/icons'
import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import { Button, Dropdown, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import type { BaseType } from 'antd/lib/typography/Base'
import React from 'react'
import { useStepList } from '../../hooks/useStepList'
import { typeStatus } from '../SequencersTable'
import styles from './sequencerDetails.module.css'
import { StepActions } from './StepActions'

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

const StepComponent = (
  step: Step,
  stepNumber: number,
  sequencerPrefix: Prefix
): JSX.Element => {
  const stepsStyle = {
    borderColor: baseTypeColorCode[color[step.status._type]],
    width: '10.9rem',
    borderLeft: `${
      step.hasBreakpoint
        ? '1rem red solid'
        : `1px solid ${baseTypeColorCode[color[step.status._type]]}`
    }`
  }

  return (
    <Space style={{ textAlign: 'right' }}>
      <div style={{ width: '1.5rem', marginRight: '0.5rem' }}>
        <Typography.Text type={'secondary'}>{stepNumber}</Typography.Text>
      </div>
      <Button key={step.command.commandName} style={stepsStyle} shape={'round'}>
        <Typography.Text
          type={color[step.status._type]}
          ellipsis
          style={{ width: '100%' }}
          strong>
          {step.command.commandName}
        </Typography.Text>
      </Button>
      <Dropdown
        overlay={<StepActions sequencerPrefix={sequencerPrefix} step={step} />}
        trigger={['click']}>
        <MoreOutlined style={{ fontSize: '1.5rem' }} role={`stepActions`} />
      </Dropdown>
    </Space>
  )
}

const columns = (
  stepListStatus: keyof typeof typeStatus,
  sequencerPrefix: Prefix
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
    render: (_, record, index) =>
      StepComponent(record, index + 1, sequencerPrefix)
  }
]

export const StepListTable = ({
  sequencerPrefix,
  stepListStatus
}: {
  sequencerPrefix: Prefix
  stepListStatus: keyof typeof typeStatus
}): JSX.Element => {
  const { isLoading, data: stepList } = useStepList(sequencerPrefix)

  return (
    <Table
      pagination={false}
      loading={isLoading}
      dataSource={stepList?.steps}
      columns={columns(stepListStatus, sequencerPrefix)}
      onRow={() => ({ className: styles.cell })}
      onHeaderRow={() => ({ className: styles.cell })}
      sticky
    />
  )
}
