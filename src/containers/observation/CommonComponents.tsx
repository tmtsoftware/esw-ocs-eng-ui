import type { SequencerState } from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { ReactElement } from 'react'

export const Text = ({ content, type }: { content: string; type: BaseType }): React.JSX.Element => (
  <Typography.Text strong type={type}>
    {content}
  </Typography.Text>
)

const getTextType = (runningObsModeStatus: SequencerState): BaseType => {
  return runningObsModeStatus._type === 'Offline' ? 'secondary' : 'success'
}

export const Status = ({ sequencerState }: { sequencerState?: SequencerState }): React.JSX.Element => {
  const status = sequencerState ? (
    <Text content={sequencerState._type} type={getTextType(sequencerState)} />
  ) : (
    <Text content='NA' type='secondary' />
  )

  return (
    <Space>
      <Text type='secondary' content='Status:' />
      {status}
    </Space>
  )
}

export const ObsModeCard = ({
  title,
  extra,
  children
}: {
  title: ReactElement
  extra?: ReactElement
  children: React.ReactNode
}): React.JSX.Element => {
  return (
    <Card
      style={{ display: 'flex', flexDirection: 'column', height: '100%', borderTop: 'none' }}
      styles={{ body: {overflowY: 'scroll', height: '100%'}, header: {paddingBottom: '0.75rem'} }}
      title={title}
      extra={extra}>
      {children}
    </Card>
  )
}
