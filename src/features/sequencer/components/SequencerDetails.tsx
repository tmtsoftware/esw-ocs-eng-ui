import {
  PlayCircleOutlined,
  ScissorOutlined,
  StopOutlined
} from '@ant-design/icons'
import { ObsMode, Location } from '@tmtsoftware/esw-ts'
import { Badge, Button, Descriptions, PageHeader, Space, Tooltip } from 'antd'
import React from 'react'
import { useAgentsStatus } from '../../sm/hooks/useAgentsStatus'
import styles from './sequencer.module.css'

const SequencerActions = (): JSX.Element => (
  <Space size={15}>
    <Tooltip placement='bottom' title='Play sequencer'>
      <PlayCircleOutlined
        className={styles.actionEnabled}
        role='PlaySequencer'
      />
    </Tooltip>
    <Tooltip placement='bottom' title='Reset sequencer'>
      <ScissorOutlined className={styles.actionEnabled} role='ResetSequencer' />
    </Tooltip>
    <Tooltip placement='bottom' title={'Stop sequencer'}>
      <StopOutlined className={styles.actionDisabled} role='StopSequencer' />
    </Tooltip>
  </Space>
)

const SequenceActions = (): JSX.Element => (
  <Space>
    <Button type='primary'>Load Sequence</Button>
    <Button> Go offline</Button>
    <Button danger> Abort sequence</Button>
  </Space>
)

const Actions = (): JSX.Element => (
  <Space size={20}>
    <SequencerActions />
    <SequenceActions />
  </Space>
)

const SequencerDescription = ({
  obsMode,
  agent
}: {
  obsMode: ObsMode
  agent: string
}): JSX.Element => {
  const { data } = useAgentsStatus()
  const thisAgent = data?.filter(
    (agentStatus) => agentStatus.agentId.prefix.toJSON() == agent
  )[0]

  // This filter logic will be removed once we have seq component info in metadata of sequencer location

  const seqComp = thisAgent?.seqCompsStatus.filter(
    (seqCompStatus) =>
      seqCompStatus.sequencerLocation[0]?.connection.prefix.toJSON() ==
      obsMode.toJSON()
  )[0]

  return (
    <Descriptions column={1}>
      <Descriptions.Item
        label='Agent'
        labelStyle={{ color: 'rgba(0,0,0,0.65)' }}
        style={{ padding: 0 }}>
        {agent}
      </Descriptions.Item>
      <Descriptions.Item
        label='Sequence Component'
        labelStyle={{ color: 'rgba(0,0,0,0.65)' }}
        style={{ padding: 0 }}>
        {seqComp?.seqCompId.prefix.toJSON()}
      </Descriptions.Item>
    </Descriptions>
  )
}

const SequencerDetails = ({
  sequencer,
  agentPrefix
}: {
  sequencer: string
  agentPrefix: string
}): JSX.Element => {
  return (
    <PageHeader
      ghost={false}
      title={
        <>
          <Badge status='success' />
          {sequencer}
        </>
      }
      className={styles.headerBox}
      extra={<Actions />}>
      <SequencerDescription
        obsMode={new ObsMode('IRIS.IRIS_Darknight')}
        agent={agentPrefix}
      />
    </PageHeader>
  )
}

export default SequencerDetails
