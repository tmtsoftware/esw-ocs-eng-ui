import {
  PlayCircleOutlined,
  ScissorOutlined,
  StopOutlined
} from '@ant-design/icons'
import { Location, Prefix } from '@tmtsoftware/esw-ts'
import {
  Badge,
  Button,
  Layout,
  PageHeader,
  Space,
  Tooltip,
  Typography
} from 'antd'
import React from 'react'
import { useSequencerState } from '../../hooks/useSequencerState'
import { useSequencerStatus } from '../../hooks/useSequencerStatus'
import { LoadSequence } from '../actions/LoadSequence'
import type { SequencerProps } from '../Props'
import type { typeStatus } from '../SequencersTable'
import styles from './sequencerDetails.module.css'
import { StepListTable } from './StepListTable'

const { Sider } = Layout

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

const SequenceActions = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => (
  <Space>
    <LoadSequence prefix={prefix} sequencerState={sequencerState} />
    <Button> Go offline</Button>
    <Button danger> Abort sequence</Button>
  </Space>
)

const Actions = ({ prefix, sequencerState }: SequencerProps): JSX.Element => {
  return (
    <Space size={20}>
      <SequencerActions />
      <SequenceActions prefix={prefix} sequencerState={sequencerState} />
    </Space>
  )
}

const SequencerDescription = ({ seqComp }: DescriptionProps): JSX.Element => (
  <Space>
    <Typography.Text type='secondary' strong aria-label='SeqCompLabel'>
      Sequence Component :
    </Typography.Text>
    <Typography.Text aria-label='SeqCompValue'>{seqComp}</Typography.Text>
  </Space>
)

const SequencerTitle = ({
  title,
  obsMode
}: {
  title: string
  obsMode: string
}): JSX.Element => {
  const masterSequencer = new Prefix('ESW', obsMode)
  const { data: isOnline } = useSequencerStatus(masterSequencer)
  return (
    <div data-testid={isOnline ? 'status-success' : 'status-error'}>
      <Badge status={isOnline ? 'success' : 'error'} />
      {title}
    </div>
  )
}

export const SequencerDetails = ({
  sequencer,
  obsMode,
  stepListStatus
}: {
  sequencer: Location
  obsMode: string
  stepListStatus: keyof typeof typeStatus
}): JSX.Element => {
  const sequencerState = useSequencerState(sequencer.connection.prefix)
  return (
    <>
      <PageHeader
        ghost={false}
        title={
          <SequencerTitle
            title={sequencer.connection.prefix.toJSON()}
            obsMode={obsMode}
          />
        }
        className={styles.headerBox}
        extra={
          <Actions
            prefix={sequencer.connection.prefix}
            sequencerState={sequencerState.data?._type}
          />
        }>
        <SequencerDescription
          seqComp={sequencer.metadata.sequenceComponentPrefix}
        />
      </PageHeader>
      <Layout style={{ height: '90%' }}>
        <Sider theme='light' style={{ overflowY: 'scroll' }} width={'18rem'}>
          <StepListTable
            sequencerPrefix={sequencer.connection.prefix}
            stepListStatus={stepListStatus}
          />
        </Sider>
      </Layout>
    </>
  )
}
