import { EditOutlined } from '@ant-design/icons'
import { Location, ObsMode, Prefix, Subsystem } from '@tmtsoftware/esw-ts'
import { Drawer, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useState } from 'react'
import styles from '../../agent/components/agentCards.module.css'
import {
  StepStatus,
  useSequencersData,
  Datatype
} from '../hooks/useSequencersData'
import SequencerDetails from './SequencerDetails'

const columns = (
  onEditHandle: (sequencer?: Location) => void
): ColumnsType<Datatype> => [
  {
    title: headerTitle('Sequencers'),
    dataIndex: 'prefix',
    key: 'prefix',
    fixed: 'left',
    // eslint-disable-next-line react/display-name
    render: (value, record) => {
      return (
        <>
          <EditOutlined
            onClick={() => onEditHandle(record.location)}
            style={{ marginRight: '0.5rem' }}
            className={styles.commonIcon}
          />
          <Typography.Text>{value}</Typography.Text>
        </>
      )
    }
  },
  {
    title: headerTitle('Sequence Status'),
    dataIndex: 'status',
    key: 'status',
    fixed: 'left',
    // eslint-disable-next-line react/display-name
    render: (value) => (
      <Typography.Text type={typeStepStatus(value.status)}>
        {value.stepNumber
          ? `Step ${value.stepNumber} ${value.status}`
          : value.status}
      </Typography.Text>
    )
  },
  {
    title: headerTitle('Total Steps'),
    dataIndex: 'totalSteps',
    key: 'totalSteps',
    fixed: 'left'
  }
]

// eslint-disable-next-line react/display-name
const headerTitle = (title: string) => () => (
  <Typography.Title level={5} style={{ marginBottom: 0 }}>
    {title}
  </Typography.Title>
)

const typeStepStatus = (stepStatus: StepStatus): BaseType | undefined => {
  const typeStatus: { [stepStatus: string]: BaseType } = {
    'All Steps Completed': 'secondary',
    'In Progress': 'success',
    Paused: 'warning',
    Failed: 'danger',
    'Failed to Fetch Status': 'danger'
  }
  return typeStatus[stepStatus]
}

type ObsModeSeqTableProps = {
  obsMode: ObsMode
  sequencers: Subsystem[]
}

export const SequencersTable = ({
  obsMode,
  sequencers
}: ObsModeSeqTableProps): JSX.Element => {
  const sequencerStatus = useSequencersData(
    sequencers.map((seq) => new Prefix(seq, obsMode.name))
  )

  const [isVisible, setVisible] = useState(false)
  const [selectedSequencer, selectSequencer] = useState<Location>()

  const onEditHandle = (sequencer?: Location) => {
    selectSequencer(sequencer)
    setVisible(true)
  }

  return (
    <>
      <Drawer
        visible={selectedSequencer && isVisible}
        width={'80%'}
        onClose={() => setVisible(false)}>
        {selectedSequencer && (
          <SequencerDetails
            sequencer={selectedSequencer}
            obsMode={obsMode.name}
          />
        )}
      </Drawer>
      <Table
        pagination={false}
        loading={sequencerStatus.isLoading || sequencerStatus.isError}
        columns={columns(onEditHandle)}
        dataSource={sequencerStatus.data}
        onRow={() => ({ style: { fontSize: '1rem' } })}
      />
    </>
  )
}
