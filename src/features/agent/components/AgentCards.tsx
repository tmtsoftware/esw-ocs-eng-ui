import { PlusCircleOutlined } from '@ant-design/icons'
import type { Prefix, SequenceComponentStatus } from '@tmtsoftware/esw-ts'
import { Card, Col, Grid, Row, Tooltip, Typography } from 'antd'
import React from 'react'
import { useSMAgentsStatus } from '../../sm/hooks/useSMAgentsStatus'
import styles from './agentCards.module.css'
import SequenceComponentCard from './SequenceComponentCard'

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
    seqCompsStatus.length == 0 ? { display: 'none' } : { padding: '1px 0 0' }

  const sequenceCompCards = seqCompsStatus.map((seqCompStatus, index) => {
    return (
      <SequenceComponentCard
        key={index}
        seqCompId={seqCompStatus.seqCompId}
        location={seqCompStatus.sequencerLocation}
      />
    )
  })

  return (
    <Card
      className={styles.agentCard}
      title={
        <Row justify='space-between'>
          <Col>
            <Typography.Text>
              {agentPrefix.componentName.toLowerCase() === 'unknown'
                ? 'Unknown'
                : agentPrefix.toJSON()}
            </Typography.Text>
          </Col>
          <Col>
            <Tooltip placement='bottom' title={'Add sequence component'}>
              <PlusCircleOutlined
                style={{ fontSize: '1.35rem' }}
                role='addSeqCompIcon'
              />
            </Tooltip>
          </Col>
        </Row>
      }
      bodyStyle={bodyStyle}>
      {sequenceCompCards}
    </Card>
  )
}

const AgentCards = (): JSX.Element => {
  const { data } = useSMAgentsStatus()
  const screen = useBreakpoint()

  const agentCards = data?.map((agentStatus, index) => {
    return (
      <AgentCard
        key={index}
        agentPrefix={agentStatus.agentId.prefix}
        seqCompsStatus={agentStatus.seqCompsStatus}
      />
    )
  })

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

export default AgentCards
