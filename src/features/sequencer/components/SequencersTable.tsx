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

const getPrefixColumn = (
  record: Datatype,
  onEditHandle: (sequencer?: Location) => void
) => (
  <>
    <EditOutlined
      onClick={() => onEditHandle(record.location)}
      style={{ marginRight: '0.5rem' }}
      className={styles.commonIcon}
    />
    <Typography.Text>{record.prefix}</Typography.Text>
  </>
)

const getStepColumn = (value: Datatype['status']) => (
  <Typography.Text type={typeStepStatus(value.status)}>
    {value.stepNumber
      ? `Step ${value.stepNumber} ${value.status}`
      : value.status}
  </Typography.Text>
)

const columns = (
  onEditHandle: (sequencer?: Location) => void
): ColumnsType<Datatype> => [
  {
    title: headerTitle('Sequencers'),
    dataIndex: 'prefix',
    fixed: 'left',
    render: (_, record) => getPrefixColumn(record, onEditHandle)
  },
  {
    title: headerTitle('Sequence Status'),
    dataIndex: 'status',
    key: 'status',
    fixed: 'left',
    render: (value) => getStepColumn(value)
  },
  {
    title: headerTitle('Total Steps'),
    dataIndex: 'totalSteps',
    key: 'totalSteps',
    fixed: 'left'
  }
]

const headerTitle = (title: string) => (
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

const SequencerDrawer = ({
  onClose,
  selectedSequencer,
  obsMode
}: {
  selectedSequencer: Location
  obsMode: ObsMode
  onClose: () => void
}) => (
  <Drawer visible width={'80%'} onClose={() => onClose()} destroyOnClose>
    <SequencerDetails sequencer={selectedSequencer} obsMode={obsMode.name} />
  </Drawer>
)

export const SequencersTable = ({
  obsMode,
  sequencers
}: ObsModeSeqTableProps): JSX.Element => {
  const sequencerStatus = useSequencersData(
    sequencers.map((seq) => new Prefix(seq, obsMode.name))
  )

  const [isSeqDrawerVisible, setSeqDrawerVisibility] = useState(false)
  const [selectedSequencer, selectSequencer] = useState<Location>()

  const onEditHandle = (sequencer?: Location) => {
    selectSequencer(sequencer)
    setSeqDrawerVisibility(true)
  }

  return (
    <>
      {isSeqDrawerVisible && selectedSequencer && (
        <SequencerDrawer
          obsMode={obsMode}
          selectedSequencer={selectedSequencer}
          onClose={() => setSeqDrawerVisibility(false)}
        />
      )}
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
