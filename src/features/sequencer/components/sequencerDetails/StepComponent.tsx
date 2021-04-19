import { MoreOutlined } from '@ant-design/icons'
import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import { Button, Dropdown, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useState } from 'react'
import { StepActions } from './StepActions'

export type SequencerStepProps = {
  step: Step
  sequencerPrefix: Prefix
}

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

const StepDropdown = ({
  sequencerPrefix,
  step
}: SequencerStepProps): JSX.Element => {
  const [isOverlayVisible, toggleOverlayVisibility] = useState<boolean>(false)

  return (
    <Dropdown
      overlay={
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={step}
          handleMenuClick={() => toggleOverlayVisibility(!isOverlayVisible)}
        />
      }
      trigger={['click']}
      onVisibleChange={toggleOverlayVisibility}
      visible={isOverlayVisible}>
      <MoreOutlined style={{ fontSize: '1.5rem' }} role='stepActions' />
    </Dropdown>
  )
}

export const StepComponent = (
  step: Step,
  stepNumber: number,
  sequencerPrefix: Prefix,
  setSelectedStep: (_: Step) => void
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
      <Button
        key={step.command.commandName}
        style={stepsStyle}
        shape={'round'}
        onClick={() => {
          setSelectedStep(step)
        }}>
        <Typography.Text
          type={color[step.status._type]}
          ellipsis
          style={{ width: '100%' }}
          strong>
          {step.command.commandName}
        </Typography.Text>
      </Button>
      <StepDropdown step={step} sequencerPrefix={sequencerPrefix} />
    </Space>
  )
}