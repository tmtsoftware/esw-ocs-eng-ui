import {
  DeleteOutlined,
  FileAddOutlined,
  FileExcelOutlined
} from '@ant-design/icons'
import type { ComponentId, Location } from '@tmtsoftware/esw-ts'
import { Col, Row, Space, Tooltip, Typography } from 'antd'
import React from 'react'
import styles from './agentCards.module.css'

type SequenceComponentProps = {
  seqCompId: ComponentId
  location: Location[]
}

type TitleProps = {
  seqCompId: string
  obsMode: string | undefined
}

const Sequencer = ({ seqCompId, obsMode }: TitleProps): JSX.Element => {
  return (
    <Row className={styles.sequencerComp}>
      <Col flex='auto' className={styles.seqCompTitle}>
        <Space direction='vertical' size={1}>
          <Typography.Text style={{ color: '#237804' }}>
            [{obsMode}]
          </Typography.Text>
          <Typography.Text type='secondary'>{seqCompId}</Typography.Text>
        </Space>
      </Col>

      <Col className={styles.iconBoxSequencer}>
        <Tooltip placement='bottom' title={'Unload script'}>
          <FileExcelOutlined
            className={styles.icon}
            role='unloadScriptIcon'
            onClick={() => ({})}
          />
        </Tooltip>
      </Col>
    </Row>
  )
}

const SequenceComponent = ({ seqCompId, obsMode }: TitleProps): JSX.Element => {
  if (obsMode) {
    return <Sequencer seqCompId={seqCompId} obsMode={obsMode} />
  }

  return (
    <Row className={styles.seqComp}>
      <Col flex='auto' className={styles.seqCompTitle}>
        <Space direction='vertical' size={1}>
          <Typography.Text style={{ color: ' rgba(0, 0, 0, 0.65)' }}>
            {seqCompId}
          </Typography.Text>
        </Space>
      </Col>
      <Col className={styles.iconBoxSeqComp}>
        <Tooltip placement='bottom' title={'Load script'}>
          <FileAddOutlined
            className={styles.icon}
            role='loadScriptIcon'
            onClick={() => ({})}
          />
        </Tooltip>
      </Col>
    </Row>
  )
}

const SequenceComponentCard = ({
  seqCompId,
  location
}: SequenceComponentProps): JSX.Element => {
  return (
    <Row style={{ paddingBottom: '1rem' }}>
      <Col flex='auto'>
        <SequenceComponent
          seqCompId={seqCompId.prefix.toJSON()}
          obsMode={location[0]?.connection.prefix.toJSON()}
        />
      </Col>
      <Col className={styles.iconBox}>
        <Tooltip placement='bottom' title={'Delete sequence component'}>
          <DeleteOutlined
            className={styles.deleteIcon}
            role='deleteSeqCompIcon'
            onClick={() => ({})}
          />
        </Tooltip>
      </Col>
    </Row>
  )
}

export default SequenceComponentCard
