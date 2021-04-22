import {
  PlayCircleOutlined,
  ScissorOutlined,
  StopOutlined
} from '@ant-design/icons'
import { AkkaConnection, Prefix, Step } from '@tmtsoftware/esw-ts'
import {
  Badge,
  Button,
  Card,
  Descriptions,
  Layout,
  PageHeader,
  Space,
  Tooltip,
  Typography
} from 'antd'
import { Content } from 'antd/es/layout/layout'
import React, { useState } from 'react'
import { useQuery } from 'react-query'
import { Spinner } from '../../../../components/spinners/Spinner'
import { useLocationService } from '../../../../contexts/LocationServiceContext'
import { useSequencerState } from '../../hooks/useSequencerState'
import { useSequencerStatus } from '../../hooks/useSequencerStatus'
import { LifecycleState } from '../actions/LifecycleState'
import { LoadSequence } from '../actions/LoadSequence'
import type { SequencerProps } from '../Props'
import { SequencerError } from '../SequencerError'
import { ParameterTable } from './ParameterTable'
import styles from './sequencerDetails.module.css'
import { StepListTable } from './StepListTable'

const { Sider } = Layout

type DescriptionProps = {
  prefix: Prefix
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
    <LifecycleState prefix={prefix} sequencerState={sequencerState} />
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

const useSequencerLocation = (prefix: Prefix) => {
  const locationService = useLocationService()
  return useQuery([prefix.toJSON()], {
    queryFn: () => locationService.find(AkkaConnection(prefix, 'Sequencer'))
  })
}

const SequencerDescription = ({ prefix }: DescriptionProps): JSX.Element => {
  const { data: seqLocation } = useSequencerLocation(prefix)

  const componentName = seqLocation
    ? seqLocation.metadata.sequenceComponentPrefix
    : 'Loading...'

  return (
    <Space>
      <Typography.Text type='secondary' strong aria-label='SeqCompLabel'>
        Sequence Component :
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
      <Badge status={isOnline ? 'success' : 'error'} />
      {prefix.toJSON()}
    </div>
  )
}
const DescriptionItem = (label: string, item: string) => {
  return (
    <Descriptions.Item
      label={
        <Typography.Title aria-label={`${label}K`} type={'secondary'} level={5}>
          {label}
        </Typography.Title>
      }>
      {
        <Typography.Title
          aria-label={`${label}V`}
          style={{ width: '11rem' }}
          ellipsis={{ tooltip: true }}
          level={5}>
          {item}
        </Typography.Title>
      }
    </Descriptions.Item>
  )
}
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
        ghost={false}
        title={<SequencerTitle prefix={prefix} />}
        className={styles.headerBox}
        extra={
          <Actions
            prefix={prefix}
            sequencerState={sequencerState.data?._type}
          />
        }>
        <SequencerDescription prefix={prefix} />
      </PageHeader>
      <Layout style={{ height: '90%' }}>
        <Sider theme='light' style={{ overflowY: 'scroll' }} width={'18rem'}>
          <StepListTable
            sequencerPrefix={prefix}
            selectedStep={selectedStep}
            setSelectedStep={setSelectedStep}
          />
        </Sider>
        {selectedStep && (
          <Content>
            <Card
              style={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%'
              }}
              headStyle={{ paddingBottom: '0.75rem', height: '8%' }}
              bodyStyle={{ height: '92%' }}
              title={
                <Space>
                  <Descriptions column={4}>
                    {DescriptionItem(
                      'Type',
                      selectedStep.command._type.toString()
                    )}
                    {DescriptionItem(
                      'Command',
                      selectedStep.command.commandName
                    )}
                    {DescriptionItem(
                      'Source',
                      selectedStep.command.source.toJSON()
                    )}
                    {DescriptionItem(
                      'Obs-Id',
                      selectedStep.command.maybeObsId ?? 'NA'
                    )}
                  </Descriptions>
                </Space>
              }>
              {<ParameterTable paramSet={selectedStep.command.paramSet} />}
            </Card>
          </Content>
        )}
      </Layout>
    </>
  )
}
