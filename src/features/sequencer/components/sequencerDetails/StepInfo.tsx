import type { Step, StepStatusFailure } from '@tmtsoftware/esw-ts'
import { Alert, Descriptions, DescriptionsProps, Empty, Space, Tooltip, Typography } from 'antd'
import React, { useState } from 'react'
import { ParameterTable } from './ParameterTable'
import styles from './sequencerDetails.module.css'
import globalStyles from '../../../../index.module.css'
import { stepConstants } from '../../sequencerConstants'

// XXX TODO FIXME: Deprecated
// const StepItem = (label: string, item: string) => {
//   const [isVisible, setVisible] = useState<boolean>(false)
//   return (
//     <Descriptions.Item
//       style={{ paddingBottom: '1px' }}
//       label={
//         <Typography.Title aria-label={`${label}-Key`} type='secondary' level={5}>
//           {label}
//         </Typography.Title>
//       }>
//       <Tooltip title={isVisible ? item : ""}>
//         <Typography.Text aria-label={`${label}-Value`} ellipsis={{ onEllipsis: setVisible }} style={{ width: '20rem' }}>
//           {item}
//         </Typography.Text>
//       </Tooltip>
//     </Descriptions.Item>
//   )
// }

const getStepFailureMessage = (failure: StepStatusFailure) =>
  failure.message ? `Step Failure: ${failure.message}` : stepConstants.defaultStepFailureErrorMessage

const StepErrorAlert = ({ message }: { message: string }) => (
  <Alert message='' description={<Typography.Text type='danger'>{message}</Typography.Text>} type='error' showIcon />
)

export const StepInfo = ({ step }: { step: Step }): React.JSX.Element => {
  const items: DescriptionsProps['items'] = [
    {
      key: '1',
      label: 'Command',
      children: step.command.commandName
    },
    {
      key: '2',
      label: 'Source',
      children: step.command.source.toJSON()
    },
    {
      key: '3',
      label: 'Command Type',
      children: step.command._type.toString()
    },
    {
      key: '4',
      label: 'Obs-Id',
      children: step.command.maybeObsId ?? 'NA'
    }
  ]

  return (
  <div className={styles.stepInfo}>
    <Space direction='vertical' size='large'>
      {step.status._type === 'Failure' && <StepErrorAlert message={getStepFailureMessage(step.status)} />}
        <Descriptions items={items} />
    </Space>
    <ParameterTable command={step.command} />
  </div>
)
}

export const EmptyStepInfo = (): React.JSX.Element => (
  <div className={globalStyles.centeredFlexElement + ' ' + styles.emptyStepInfo}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </div>
)
