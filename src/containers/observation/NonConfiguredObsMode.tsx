import type { ObsMode } from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { ReactElement } from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'

export const Text = ({ content, type }: { content: string; type: BaseType }): JSX.Element => (
  <Typography.Text strong type={type}>
    {content}
  </Typography.Text>
)

export const ObsModeCard = ({
  title,
  extra,
  children
}: {
  title: ReactElement
  extra?: ReactElement
  children: React.ReactNode
}): JSX.Element => {
  return (
    <Card
      style={{ display: 'flex', flexDirection: 'column', height: '100%', borderTop: 'none' }}
      headStyle={{ paddingBottom: '0.75rem' }}
      bodyStyle={{ overflowY: 'scroll', height: '100%' }}
      title={title}
      extra={extra}>
      {children}
    </Card>
  )
}

export const NonConfiguredObsMode = ({
  obsMode,
  resources,
  actions
}: {
  obsMode: ObsMode
  resources: ResourceTableStatus[]
  actions?: ReactElement
}): JSX.Element => {
  return (
    <ObsModeCard
      title={
        <>
          <Typography.Title level={4}>{obsMode.name}</Typography.Title>
          <Space>
            <Text type='secondary' content='Status:' />
            <Text type='secondary' content='NA' />
          </Space>
        </>
      }
      extra={actions}>
      <ResourcesTable resources={resources} />
    </ObsModeCard>
  )
}
