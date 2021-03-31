import { EditOutlined } from '@ant-design/icons'
import { Location, ObsMode, Prefix, Subsystem } from '@tmtsoftware/esw-ts'
import { Drawer, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useState } from 'react'
import { headerTitle } from '../../../utils/headerTitle'
import styles from '../../agent/components/agentCards.module.css'
import { Datatype, useSequencersData } from '../hooks/useSequencersData'
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

const typeStatus: { [stepStatus: string]: BaseType } = {
  'All Steps Completed': 'secondary',
  'In Progress': 'success',
  Paused: 'warning',
  Failed: 'danger',
  'Failed to Fetch Status': 'danger'
}

const getStepColumn = (status: Datatype['status']) => (
  <Typography.Text type={typeStatus[status.status]}>
    {status.stepNumber
      ? `Step ${status.stepNumber} ${status.status}`
      : status.status}
  </Typography.Text>
)

const columns = (
  onEditHandle: (sequencer?: Location) => void
): ColumnsType<Datatype> => [
  {
    title: headerTitle('Sequencers'),
    dataIndex: 'prefix',
    width: '40%',
    render: (_, record) => getPrefixColumn(record, onEditHandle)
  },
  {
    title: headerTitle('Sequence Status'),
    dataIndex: 'status',
    key: 'status',
    render: (value) => getStepColumn(value)
  },
  {
    title: headerTitle('Total Steps'),
    dataIndex: 'totalSteps',
    key: 'totalSteps'
  }
]

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
        rowKey={(record) => record.prefix}
        style={{ paddingBottom: '1.5rem' }}
        pagination={false}
        loading={sequencerStatus.isLoading || sequencerStatus.isError}
        columns={columns(onEditHandle)}
        dataSource={sequencerStatus.data}
        onRow={() => ({ style: { fontSize: '1rem' } })}
      />
    </>
  )
}
