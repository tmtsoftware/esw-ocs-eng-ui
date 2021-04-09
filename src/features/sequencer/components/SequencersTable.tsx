import { EditOutlined } from '@ant-design/icons'
import { Location, ObsMode, Prefix, Subsystem } from '@tmtsoftware/esw-ts'
import { Drawer, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useState } from 'react'
import { HeaderTitle } from '../../../components/table/HeaderTitle'
import styles from '../../agent/components/agentCards.module.css'
import { Datatype, useSequencersData } from '../hooks/useSequencersData'
import { SequencerDetails } from './SequencerDetails'

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

export const typeStatus: { [stepStatus: string]: BaseType } = {
  'All Steps Completed': 'secondary',
  'In Progress': 'success',
  Paused: 'warning',
  Failed: 'danger',
  'Failed to Fetch Status': 'danger'
}

const getStepColumn = (status: Datatype['stepListStatus']) => (
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
    title: <HeaderTitle title='Sequencers' />,
    dataIndex: 'prefix',
    width: '40%',
    render: (_, record) => getPrefixColumn(record, onEditHandle)
  },
  {
    title: <HeaderTitle title='Sequence Status' />,
    dataIndex: 'stepListStatus',
    key: 'status',
    render: (value) => getStepColumn(value)
  },
  {
    title: <HeaderTitle title='Total Steps' />,
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
  obsMode,
  sequencerStatus
}: {
  selectedSequencer: Location
  obsMode: ObsMode
  sequencerStatus: Datatype
  onClose: () => void
}) => (
  <Drawer visible width={'80%'} onClose={() => onClose()} destroyOnClose>
    <SequencerDetails
      stepListStatus={sequencerStatus.stepListStatus.status}
      sequencer={selectedSequencer}
      obsMode={obsMode.name}
    />
  </Drawer>
)

export const SequencersTable = ({
  obsMode,
  sequencers
}: ObsModeSeqTableProps): JSX.Element => {
  const sortedSequencers: Prefix[] = sequencers.reduce(
    (acc: Prefix[], elem) => {
      const sequencer = new Prefix(elem, obsMode.name)
      if (elem === 'ESW') return [sequencer].concat(acc)
      return acc.concat(sequencer)
    },
    []
  )

  const sequencerStatus = useSequencersData(sortedSequencers)
  const [isSeqDrawerVisible, setSeqDrawerVisibility] = useState(false)
  const [selectedSequencer, selectSequencer] = useState<Location>()
  const [selectedSequencerStatus, selectSequencerStatus] = useState<Datatype>()

  const onEditHandle = (sequencer?: Location) => {
    selectSequencer(sequencer)
    setSeqDrawerVisibility(true)
    selectSequencerStatus(
      sequencerStatus.data?.find(
        (x) => selectedSequencer?.connection.prefix.toJSON() === x.prefix
      )
    )
  }

  return (
    <>
      {isSeqDrawerVisible && selectedSequencer && selectedSequencerStatus && (
        <SequencerDrawer
          obsMode={obsMode}
          selectedSequencer={selectedSequencer}
          sequencerStatus={selectedSequencerStatus}
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
