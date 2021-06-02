import type { ComponentId, Location, Prefix } from '@tmtsoftware/esw-ts'
import { Col, Row, Space, Typography } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { getSequencerPath } from '../../../routes/RoutesConfig'
import styles from './agentCards.module.css'
import { SequenceComponentActions } from './SequenceComponentActions'

type TitleProps = {
  seqCompPrefix: Prefix
  obsMode: string
}

const Sequencer = ({ seqCompPrefix, obsMode }: TitleProps): JSX.Element => {
  const history = useHistory()
  const Title = () => (
    <Space direction='vertical' size={1}>
      <Typography.Text style={{ color: '#237804' }}>[{obsMode}]</Typography.Text>
      <Typography.Text type='secondary'>{seqCompPrefix.toJSON()}</Typography.Text>
    </Space>
  )

  return (
    <Row className={styles.sequencer}>
      <Col flex='auto' className={styles.sequencerTitle} onClick={() => history.push(getSequencerPath(obsMode))}>
        <Title />
      </Col>
    </Row>
  )
}

const SequenceComponent = ({ seqCompPrefix, obsMode }: TitleProps): JSX.Element => {
  if (obsMode) return <Sequencer seqCompPrefix={seqCompPrefix} obsMode={obsMode} />

  const Title = () => (
    <Space direction='vertical' size={1}>
      <Typography.Text style={{ color: 'var(--labelColor)' }}>{seqCompPrefix.toJSON()}</Typography.Text>
    </Space>
  )

  return (
    <Row className={styles.seqComp}>
      <Col flex='auto' className={styles.seqCompTitle}>
        <Title />
      </Col>
    </Row>
  )
}

type SequenceComponentProps = {
  seqCompId: ComponentId
  location: Location[]
}

export const SequenceComponentCard = ({ seqCompId, location }: SequenceComponentProps): JSX.Element => (
  <Row style={{ paddingBottom: '1rem' }}>
    <Col flex='auto'>
      <SequenceComponent seqCompPrefix={seqCompId.prefix} obsMode={location[0]?.connection.prefix.toJSON()} />
    </Col>
    <Col className={styles.iconBox}>
      <SequenceComponentActions componentId={seqCompId} obsMode={location[0]?.connection.prefix.toJSON()} />
    </Col>
  </Row>
)
