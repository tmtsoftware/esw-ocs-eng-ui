import {
  PlayCircleOutlined,
  ScissorOutlined,
  StopOutlined
} from '@ant-design/icons'
import type { Location } from '@tmtsoftware/esw-ts'
import { Badge, Button, Descriptions, PageHeader, Space, Tooltip } from 'antd'
import React from 'react'
import styles from './sequencer.module.css'

type DescriptionProps = {
  agent: string
  seqComp: string
}

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
  agent,
  seqComp
}: DescriptionProps): JSX.Element => (
  <Descriptions column={1}>
    <Descriptions.Item
      label='Agent'
      labelStyle={{ color: 'var(--labelColor)' }}
      style={{ padding: 0 }}>
      {agent}
    </Descriptions.Item>
    <Descriptions.Item
      label='Sequence Component'
      labelStyle={{ color: 'var(--labelColor)' }}
      style={{ padding: 0 }}>
      {seqComp}
    </Descriptions.Item>
  </Descriptions>
)

const SequencerDetails = ({
  sequencer
}: {
  sequencer: Location
}): JSX.Element => (
  <PageHeader
    ghost={false}
    title={
      <>
        <Badge status='success' />
        {sequencer.connection.prefix.toJSON()}
      </>
    }
    className={styles.headerBox}
    extra={<Actions />}>
    <SequencerDescription
      agent={sequencer.metadata.agentPrefix}
      seqComp={sequencer.metadata.sequenceComponentPrefix}
    />
  </PageHeader>
)

export default SequencerDetails
