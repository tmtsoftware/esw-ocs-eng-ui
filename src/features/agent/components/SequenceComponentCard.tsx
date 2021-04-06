import { FileAddOutlined, FileExcelOutlined } from '@ant-design/icons'
import type { ComponentId, Location } from '@tmtsoftware/esw-ts'
import { Col, Row, Space, Tooltip, Typography } from 'antd'
import React from 'react'
import styles from './agentCards.module.css'
import { DeleteComponent } from './DeleteComponent'

const LoadScript = () => (
  <Tooltip placement='bottom' title='Load script'>
    <FileAddOutlined
      className={styles.icon}
      role='loadScriptIcon'
      onClick={() => ({})}
    />
  </Tooltip>
)

const UnloadScript = () => (
  <Tooltip placement='bottom' title='Unload script'>
    <FileExcelOutlined
      className={styles.icon}
      role='unloadScriptIcon'
      onClick={() => ({})}
    />
  </Tooltip>
)

type TitleProps = {
  seqCompId: string
  obsMode: string | undefined
}

const Sequencer = ({ seqCompId, obsMode }: TitleProps): JSX.Element => {
  const Title = () => (
    <Space direction='vertical' size={1}>
      <Typography.Text style={{ color: '#237804' }}>
        [{obsMode}]
      </Typography.Text>
      <Typography.Text type='secondary'>{seqCompId}</Typography.Text>
    </Space>
  )

  return (
    <Row className={styles.sequencerComp}>
      <Col flex='auto' className={styles.seqCompTitle}>
        <Title />
      </Col>
      <Col className={styles.iconBoxSequencer}>
        <UnloadScript />
      </Col>
    </Row>
  )
}

const SequenceComponent = ({ seqCompId, obsMode }: TitleProps): JSX.Element => {
  if (obsMode) {
    return <Sequencer seqCompId={seqCompId} obsMode={obsMode} />
  }

  const Title = () => (
    <Space direction='vertical' size={1}>
      <Typography.Text style={{ color: 'var(--labelColor)' }}>
        {seqCompId}
      </Typography.Text>
    </Space>
  )

  return (
    <Row className={styles.seqComp}>
      <Col flex='auto' className={styles.seqCompTitle}>
        <Title />
      </Col>
      <Col className={styles.iconBoxSeqComp}>
        <LoadScript />
      </Col>
    </Row>
  )
}

type SequenceComponentProps = {
  seqCompId: ComponentId
  location: Location[]
}

export const SequenceComponentCard = ({
  seqCompId,
  location
}: SequenceComponentProps): JSX.Element => (
  <Row style={{ paddingBottom: '1rem' }}>
    <Col flex='auto'>
      <SequenceComponent
        seqCompId={seqCompId.prefix.toJSON()}
        obsMode={location[0]?.connection.prefix.toJSON()}
      />
    </Col>
    <Col className={styles.iconBox}>
      <DeleteComponent componentId={seqCompId} />
    </Col>
  </Row>
)
