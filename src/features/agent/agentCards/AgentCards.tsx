import { PlusCircleOutlined } from '@ant-design/icons'
import type { Prefix, SequenceComponentStatus } from '@tmtsoftware/esw-ts'
import { Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { useSMAgentsStatus } from '../../sm/hooks/useSMAgentsStatus'
import styles from './agentCards.module.css'

type AgentCardProps = {
  name: Prefix
  sequenceCompsStatus: SequenceComponentStatus[]
}
const AgentCard = ({
  name,
  sequenceCompsStatus
}: AgentCardProps): JSX.Element => {
  return (
    <Card
      title={
        <Row justify='space-between'>
          <Col>
            <Typography.Text>{name.toJSON()}</Typography.Text>
          </Col>
          <Col>
            <PlusCircleOutlined style={{ fontSize: '1.35rem' }} />
          </Col>
        </Row>
      }
      bodyStyle={{ display: 'none' }}></Card>
  )
}

const AgentCards = (): JSX.Element => {
  const { data } = useSMAgentsStatus()
  const agentCards = data?.map((agentStatus, index) => (
    <Col span={6} key={index}>
      <AgentCard
        name={agentStatus.agentId.prefix}
        sequenceCompsStatus={agentStatus.seqCompsStatus}
      />
    </Col>
  ))

  return (
    <Row justify='start' gutter={[24, 24]} wrap={true} className={styles.grid}>
      {agentCards}
    </Row>
  )
}

export default AgentCards
