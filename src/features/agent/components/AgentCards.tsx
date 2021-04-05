import { PlusCircleOutlined } from '@ant-design/icons'
import {
  AgentService,
  Prefix,
  SequenceComponentStatus
} from '@tmtsoftware/esw-ts'
import {
  Card,
  Col,
  Grid,
  Input,
  Popconfirm,
  Row,
  Tooltip,
  Typography
} from 'antd'
import React, { useState } from 'react'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { LIST_AGENTS } from '../../queryKeys'
import { useAgentService } from '../hooks/useAgentService'
import { UNKNOWN_AGENT, useAgentsStatus } from '../hooks/useAgentsStatus'
import styles from './agentCards.module.css'
import { SequenceComponentCard } from './SequenceComponentCard'

const { useBreakpoint } = Grid

type AgentCardProps = {
  agentPrefix: Prefix
  seqCompsStatus: SequenceComponentStatus[]
  // onAddComponent: () => void
}

const spawnSequenceComponent = (agentPrefix: Prefix, componentName: string) => (
  agentService: AgentService
) =>
  agentService
    .spawnSequenceComponent(agentPrefix, componentName)
    .then((res) => {
      if (res._type === 'Failed') throw new Error(res.msg)
      return res
    })

const requirement = (predicate: boolean, msg: string) =>
  !predicate && errorMessage(msg)

const validateComponentName = (componentName: string) => {
  requirement(
    componentName !== componentName.trim(),
    'component name has leading and trailing whitespaces'
  )
  requirement(componentName.includes('-'), "component name has '-'")
}
const AddComponent = ({ agentPrefix }: { agentPrefix: Prefix }) => {
  const [componentName, setComponentName] = useState('')

  const { data: agentService } = useAgentService()
  const spawnSequenceComponentAction = useMutation({
    mutationFn: spawnSequenceComponent(agentPrefix, componentName),
    onSuccess: () =>
      successMessage(
        `Successfully spawned Sequence Component: ${new Prefix(
          agentPrefix.subsystem,
          componentName
        ).toJSON()}`
      ),
    onError: (e) =>
      errorMessage(
        'Sequence Component could not be spawned. Please try again.',
        e
      ),
    invalidateKeysOnSuccess: [LIST_AGENTS.key],
    useErrorBoundary: false
  })

  const onConfirm = () => {
    validateComponentName(componentName)
    agentService && spawnSequenceComponentAction.mutateAsync(agentService)
  }
  return (
    <Tooltip placement='bottom' title='Add sequence component'>
      <Popconfirm
        title={
          <>
            Component name:
            <Input
              value={componentName}
              onChange={(e) => setComponentName(e.target.value)}
            />
          </>
        }
        icon={<></>}
        onCancel={() => setComponentName('')}
        onConfirm={() => onConfirm()}>
        <PlusCircleOutlined
          className={styles.commonIcon}
          role='addSeqCompIcon'
          // onClick={() => onAddComponent()}
        />
      </Popconfirm>
    </Tooltip>
  )
}

const AgentCard = ({
  agentPrefix,
  seqCompsStatus
}: // onAddComponent
AgentCardProps): JSX.Element => {
  const bodyStyle =
    seqCompsStatus.length === 0
      ? { display: 'none' }
      : { padding: '1.5rem 1rem 1rem' }

  const agentName =
    agentPrefix === UNKNOWN_AGENT.prefix
      ? UNKNOWN_AGENT.prefix.componentName
      : agentPrefix.toJSON()

  const sequenceCompCards = seqCompsStatus.map((seqCompStatus, index) => (
    <SequenceComponentCard
      key={index}
      seqCompId={seqCompStatus.seqCompId}
      location={seqCompStatus.sequencerLocation}
    />
  ))

  return (
    <Card
      className={styles.agentCard}
      title={
        <Row justify='space-between'>
          <Col>
            <Typography.Text>{agentName}</Typography.Text>
          </Col>
          <Col>
            <AddComponent agentPrefix={agentPrefix} />
          </Col>
        </Row>
      }
      bodyStyle={bodyStyle}>
      {sequenceCompCards}
    </Card>
  )
}

export const AgentCards = (): JSX.Element => {
  const { data } = useAgentsStatus()
  const screen = useBreakpoint()

  const agentCards = data?.map((agentStatus, index) => (
    <AgentCard
      key={index}
      agentPrefix={agentStatus.agentId.prefix}
      seqCompsStatus={agentStatus.seqCompsStatus}
    />
  ))

  const [columnCount, span] = screen.xl ? [4, 6] : screen.lg ? [3, 8] : [2, 12]

  const agents = agentCards?.reduce((columns, agentCard, index) => {
    const currentColumn = index % columnCount
    if (!columns[currentColumn]) {
      columns[currentColumn] = []
    }
    columns[currentColumn].push(agentCard)
    return columns
  }, Array(columnCount))

  return (
    <Row justify='start' gutter={[24, 24]} wrap={true} className={styles.grid}>
      {agents?.map((agent, index) => (
        <Col key={index} span={span}>
          {agent}
        </Col>
      ))}
    </Row>
  )
}
