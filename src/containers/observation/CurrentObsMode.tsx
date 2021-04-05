import type { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import type { TabName } from './ObservationTabs'
import { ObsModeActions } from './ObsModeActions'

type CurrentObsModeProps = {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
  resources: ResourceTableStatus[]
}

const Text = ({ content, type }: { content: string; type: BaseType }) => (
  <Typography.Text strong type={type}>
    {content}
  </Typography.Text>
)

export const CurrentObsMode = ({
  currentTab,
  obsMode,
  sequencers,
  resources
}: CurrentObsModeProps): JSX.Element => {
  const isRunning = currentTab === 'Running'

  //TODO use StatusAPI of sequencer for this status
  const Status = () =>
    isRunning ? (
      <Text content='Running' type='success' />
    ) : (
      <Text content='NA' type='secondary' />
    )

  return (
    <>
      <Card
        style={{ height: '100%' }}
        title={
          <>
            <Typography.Title level={4}>{obsMode.name}</Typography.Title>
            <Space>
              <Typography.Text type='secondary'>Status: </Typography.Text>
              <Status />
            </Space>
          </>
        }
        extra={
          <Space style={{ paddingRight: '2.5rem' }}>
            <ObsModeActions tabName={currentTab} obsMode={obsMode} />
          </Space>
        }>
        {isRunning && (
          <SequencersTable obsMode={obsMode} sequencers={sequencers} />
        )}
        <ResourcesTable resources={resources} />
      </Card>
    </>
  )
}
