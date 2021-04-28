import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import { Button, Space, Tooltip, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React from 'react'
import { useStepListContext } from '../../hooks/useStepListContext'
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

export const StepComponent = (
  step: Step,
  stepNumber: number,
  setSelectedStep: (_: Step) => void,
  sequencerPrefix: Prefix
): JSX.Element => {
  const stepsStyle = {
    borderColor: baseTypeColorCode[color[step.status._type]],
    width: '10.9rem',
    borderLeft: `${
      step.hasBreakpoint
        ? '1rem solid red'
        : `1px solid ${baseTypeColorCode[color[step.status._type]]}`
    }`
  }

  const { isDuplicateEnabled } = useStepListContext()

  return (
    <Space style={{ textAlign: 'right' }}>
      <div style={{ width: '1.5rem', marginRight: '0.5rem' }}>
        <Typography.Text type={'secondary'}>{stepNumber}</Typography.Text>
      </div>
      <Tooltip title={step.command.commandName}>
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
      </Tooltip>
      {!isDuplicateEnabled && (
        <StepActions step={step} sequencerPrefix={sequencerPrefix} />
      )}
    </Space>
  )
}
