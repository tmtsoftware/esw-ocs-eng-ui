import type { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { memo } from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import {
  RunningObsModeStatus,
  useObsModeStatus
} from '../../features/sequencer/hooks/useObsModeStatus'
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

const CObsMode = ({
  currentTab,
  obsMode,
  sequencers,
  resources
}: CurrentObsModeProps): JSX.Element => {
  const isRunningTab = currentTab === 'Running' //TODO what about non running tabs
  const { data: obsModeStatus } = useObsModeStatus(obsMode)
  //TODO use StatusAPI of sequencer for this status
  const Status = () => {
    const status = obsModeStatus ? (
      <Text content={obsModeStatus} type={getTextType(obsModeStatus)} />
    ) : (
      <Text content='NA' type='secondary' />
    )
    return (
      <Space>
        <Text type='secondary' content='Status: ' />
        {status}
      </Space>
    )
  }

  return (
    <>
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        headStyle={{ paddingBottom: '0.75rem' }}
        bodyStyle={{ overflowY: 'scroll', height: '100%' }}
        title={
          <>
            <Typography.Title level={4}>{obsMode.name}</Typography.Title>
            <Status />
          </>
        }
        extra={
          <Space style={{ paddingRight: '2.5rem' }}>
            <ObsModeActions tabName={currentTab} obsMode={obsMode} />
          </Space>
        }>
        {isRunningTab && (
          <SequencersTable obsMode={obsMode} sequencers={sequencers} />
        )}
        <ResourcesTable resources={resources} />
      </Card>
    </>
  )
}

const getTextType = (runningObsModeStatus: RunningObsModeStatus): BaseType => {
  if (runningObsModeStatus === 'Offline') return 'secondary'
  if (runningObsModeStatus === 'Paused') return 'warning'
  if (runningObsModeStatus === 'Failed') return 'danger'
  return 'success'
}

export const CurrentObsMode = memo(
  CObsMode,
  (prev, next) => prev.obsMode.name === next.obsMode.name
)
