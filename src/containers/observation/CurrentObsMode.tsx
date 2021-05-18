import {
  ObsMode,
  Prefix,
  SequencerStateResponse,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React from 'react'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import { useSequencerState } from '../../features/sequencer/hooks/useSequencerState'
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

const Status = ({
  obsMode,
  isRunning
}: {
  obsMode: ObsMode
  isRunning: boolean
}) => {
  const { data: obsModeStatus } = useSequencerState(
    new Prefix('ESW', obsMode.name),
    isRunning
  )
  const status =
    obsModeStatus && isRunning ? (
      <Text content={obsModeStatus._type} type={getTextType(obsModeStatus)} />
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

export const CurrentObsMode = ({
  currentTab,
  obsMode,
  sequencers,
  resources
}: CurrentObsModeProps): JSX.Element => {
  const isRunningTab = currentTab === 'Running'
  return (
    <>
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        headStyle={{ paddingBottom: '0.75rem' }}
        bodyStyle={{ overflowY: 'scroll', height: '100%' }}
        title={
          <>
            <Typography.Title level={4}>{obsMode.name}</Typography.Title>
            <Status obsMode={obsMode} isRunning={isRunningTab} />
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

const getTextType = (
  runningObsModeStatus: SequencerStateResponse
): BaseType => {
  return runningObsModeStatus._type === 'Offline' ? 'secondary' : 'success'
}
