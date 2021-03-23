import {
  PlayCircleOutlined,
  ScissorOutlined,
  StopOutlined
} from '@ant-design/icons'
import type { Location } from '@tmtsoftware/esw-ts'
import { Badge, Button, PageHeader, Space, Tooltip, Typography } from 'antd'
import React from 'react'
import { useSequencerStatus } from '../hooks/useSequencerStatus'
import styles from './sequencer.module.css'

type DescriptionProps = {
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

const SequencerDescription = ({ seqComp }: DescriptionProps): JSX.Element => (
  <Space>
    <Typography.Text type='secondary' strong>
      Sequence Component :
    </Typography.Text>
    <Typography.Text>{seqComp}</Typography.Text>
  </Space>
)

const SequencerTitle = ({
  title,
  obsMode
}: {
  title: string
  obsMode: string
}): JSX.Element => {
  const { data: isOnline } = useSequencerStatus(obsMode)
  return (
    <>
      <Badge status={isOnline ? 'success' : 'error'} />
      {title}
    </>
  )
}

const SequencerDetails = ({
  sequencer,
  obsMode
}: {
  sequencer: Location
  obsMode: string
}): JSX.Element => (
  <PageHeader
    ghost={false}
    title={
      <SequencerTitle
        title={sequencer.connection.prefix.toJSON()}
        obsMode={obsMode}
      />
    }
    className={styles.headerBox}
    extra={<Actions />}>
    <SequencerDescription
      seqComp={sequencer.metadata.sequenceComponentPrefix}
    />
  </PageHeader>
)

export default SequencerDetails
