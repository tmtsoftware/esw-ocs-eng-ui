import type { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import React from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import ResourcesTable from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import type { TabName } from './ObservationTabs'
import ObsModeActions from './ObsModeActions'

const CurrentObsMode = ({
  currentTab,
  obsMode,
  sequencers,
  resources
}: {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
  resources: ResourceTableStatus[]
}): JSX.Element => {
  const isRunning = () => currentTab === 'Running'

  //TODO use StatusAPI of sequencer for this status
  const getStatus = () =>
    isRunning() ? (
      <Typography.Text type='success' strong>
        Running
      </Typography.Text>
    ) : (
      <Typography.Text strong type='secondary'>
        NA
      </Typography.Text>
    )

  return (
    <>
      <Card
        title={
          <>
            <Typography.Title level={4}>{obsMode.name}</Typography.Title>
            <Space>
              <Typography.Text type='secondary'>Status: </Typography.Text>
              {getStatus()}
            </Space>
          </>
        }
        extra={
          <Space style={{ paddingRight: '2.5rem' }}>
            <ObsModeActions tabName={currentTab} obsMode={obsMode} />
          </Space>
        }>
        {isRunning() && (
          <SequencersTable obsMode={obsMode} sequencers={sequencers} />
        )}
        <ResourcesTable resources={resources} />
      </Card>
    </>
  )
}

export default CurrentObsMode
