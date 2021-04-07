import type {
  Prefix,
  SequenceComponentStatus
} from '@tmtsoftware/esw-ts'
import { Card, Col, Grid, Row, Typography } from 'antd'
import React from 'react'
import { UNKNOWN_AGENT, useAgentsStatus } from '../hooks/useAgentsStatus'
import styles from './agentCards.module.css'
import { SequenceComponentCard } from './SequenceComponentCard'
import { SpawnSequenceComponent } from './SpawnSequenceComponent'

const { useBreakpoint } = Grid

type AgentCardProps = {
  agentPrefix: Prefix
  seqCompsStatus: SequenceComponentStatus[]
}

const AgentCard = ({
  agentPrefix,
  seqCompsStatus
}: AgentCardProps): JSX.Element => {
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
            <SpawnSequenceComponent agentPrefix={agentPrefix} />
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
