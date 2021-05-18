import type { Prefix, Step } from '@tmtsoftware/esw-ts'
import {
  Badge,
  Card,
  Descriptions,
  Empty,
  Layout,
  Space,
  Typography
} from 'antd'
import { Content } from 'antd/es/layout/layout'
import React, { useState } from 'react'
import { PageHeader } from '../../../../components/pageHeader/PageHeader'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useSequencerLocation } from '../../hooks/useSequencerLocation'
import { useSequencerState } from '../../hooks/useSequencerState'
import { useSequencerStatus } from '../../hooks/useSequencerStatus'
import { AbortSequence } from '../actions/AbortSequence'
import { LifecycleState } from '../actions/LifecycleState'
import { LoadSequence } from '../actions/LoadSequence'
import { PlayPauseSequence } from '../actions/PlayPauseSequence'
import { ResetSequence } from '../actions/ResetSequence'
import { StopSequence } from '../actions/StopSequence'
import type { SequencerProps } from '../Props'
import { SequencerError } from '../SequencerError'
import { ParameterTable } from './ParameterTable'
import styles from './sequencerDetails.module.css'
import { StepListTable } from './StepListTable'

const { Sider } = Layout

type DescriptionProps = {
  prefix: Prefix
}

const SequencerActions = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  return (
    <Space size={15}>
      <PlayPauseSequence prefix={prefix} sequencerState={sequencerState} />
      <ResetSequence prefix={prefix} sequencerState={sequencerState} />
      <StopSequence prefix={prefix} sequencerState={sequencerState} />
    </Space>
  )
}
const SequenceActions = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => (
  <Space>
    <LoadSequence prefix={prefix} sequencerState={sequencerState} />
    <LifecycleState prefix={prefix} sequencerState={sequencerState} />
    <AbortSequence prefix={prefix} sequencerState={sequencerState} />
  </Space>
)

const Actions = ({ prefix, sequencerState }: SequencerProps): JSX.Element => {
  return (
    <Space size={20}>
      <SequencerActions prefix={prefix} sequencerState={sequencerState} />
      <SequenceActions prefix={prefix} sequencerState={sequencerState} />
    </Space>
  )
}

const SequencerDescription = ({ prefix }: DescriptionProps): JSX.Element => {
  const { data: seqLocation } = useSequencerLocation(prefix)

  const componentName = seqLocation
    ? seqLocation.metadata.sequenceComponentPrefix
    : 'Loading...'

  return (
    <Space>
      <Typography.Text type='secondary' strong aria-label='SeqCompLabel'>
        Sequence Component:
      </Typography.Text>
      <Typography.Text aria-label='SeqCompValue'>
        {componentName}
      </Typography.Text>
    </Space>
  )
}

const SequencerTitle = ({ prefix }: { prefix: Prefix }): JSX.Element => {
  const { data: isOnline } = useSequencerStatus(prefix)
  return (
    <div data-testid={isOnline ? 'status-success' : 'status-error'}>
      <Badge status={isOnline ? 'success' : 'error'} className={styles.badge} />
      {prefix.toJSON()}
    </div>
  )
}

const DescriptionItem = (label: string, item: string) => {
  return (
    <Descriptions.Item
      label={
        <Typography.Title
          aria-label={`${label}-Key`}
          type={'secondary'}
          level={5}>
          {label}
        </Typography.Title>
      }>
      {
        <Typography.Title
          aria-label={`${label}-Value`}
          ellipsis={{ tooltip: true }}
          level={5}>
          {item}
        </Typography.Title>
      }
    </Descriptions.Item>
  )
}

const StepInfo = ({ step }: { step: Step }) => (
  <div className={styles.stepInfo}>
    <Descriptions column={{ xs: 1, md: 1, lg: 2, xl: 4 }}>
      {DescriptionItem('Type', step.command._type.toString())}
      {DescriptionItem('Command', step.command.commandName)}
      {DescriptionItem('Source', step.command.source.toJSON())}
      {DescriptionItem('Obs-Id', step.command.maybeObsId ?? 'NA')}
    </Descriptions>
    {<ParameterTable paramSet={step.command.paramSet} />}
  </div>
)

const EmptyStep = () => (
  <Card style={{ height: '100%' }}>
    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
  </Card>
)

export const SequencerDetails = ({
  prefix
}: {
  prefix: Prefix
}): JSX.Element => {
  const sequencerState = useSequencerState(prefix)
  const seqLocation = useSequencerLocation(prefix)
  const [selectedStep, setSelectedStep] = useState<Step>()

  if (seqLocation.isLoading) return <Spinner />

  if (!seqLocation.data)
    return (
      <SequencerError
        title='404'
        subtitle={`Sequencer ${prefix.toJSON()} : Not found`}
      />
    )

  return (
    <>
      <PageHeader
        title={<SequencerTitle prefix={prefix} />}
        ghost={false}
        className={styles.headerBox}
        extra={
          <Actions
            prefix={prefix}
            sequencerState={sequencerState.data?._type}
          />
        }>
        <SequencerDescription prefix={prefix} />
      </PageHeader>
      <Layout
        style={{ height: '90%', marginLeft: '1.5rem', marginTop: '1.5rem' }}>
        <Sider theme='light' width={'18rem'}>
          <StepListTable
            sequencerPrefix={prefix}
            selectedStep={selectedStep}
            setSelectedStep={setSelectedStep}
          />
        </Sider>
        <Content>
          {selectedStep ? <StepInfo step={selectedStep} /> : <EmptyStep />}
        </Content>
      </Layout>
    </>
  )
}
