import { EditOutlined } from '@ant-design/icons'
import { ObsMode, Prefix, Subsystem } from '@tmtsoftware/esw-ts'
import { Drawer, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useState } from 'react'
import { HeaderTitle } from '../../../components/table/HeaderTitle'
import styles from '../../agent/components/agentCards.module.css'
import { SequencerInfo, useSequencersData } from '../hooks/useSequencersData'
import { SequencerDetails } from './sequencerDetails/SequencerDetails'

const getPrefixColumn = (
  record: SequencerInfo,
  onEditHandle: (sequencerPrefix: string) => void
) => (
  <Space>
    <EditOutlined
      onClick={() => onEditHandle(record.prefix)}
      className={styles.commonIcon}
    />
    <Typography.Text>{record.prefix}</Typography.Text>
  </Space>
)

export const typeStatus: { [stepStatus: string]: BaseType } = {
  'All Steps Completed': 'secondary',
  'In Progress': 'success',
  Paused: 'warning',
  Failed: 'danger',
  'Failed to Fetch Status': 'danger'
}

const getStepColumn = (status: SequencerInfo['stepListStatus']) => (
  <Typography.Text type={typeStatus[status.status]}>
    {status.stepNumber
      ? `Step ${status.stepNumber} ${status.status}`
      : status.status}
  </Typography.Text>
)

const columns = (
  onEditHandle: (sequencerPrefix: string) => void
): ColumnsType<SequencerInfo> => [
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
  selectedSequencerPrefix,
  obsMode
}: {
  selectedSequencerPrefix: Prefix
  obsMode: ObsMode
  sequencerStatus: SequencerInfo
  onClose: () => void
}) => (
  <Drawer visible width={'80%'} onClose={() => onClose()} destroyOnClose>
    <SequencerDetails prefix={selectedSequencerPrefix} obsMode={obsMode.name} />
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
  console.log(sequencerStatus.data)
  const [isSeqDrawerVisible, setSeqDrawerVisibility] = useState(false)
  const [selectedSequencer, selectSequencer] = useState<Prefix>()
  const [
    selectedSequencerStatus,
    selectSequencerStatus
  ] = useState<SequencerInfo>()

  const onEditHandle = (sequencerPrefix: string) => {
    selectSequencer(Prefix.fromString(sequencerPrefix))
    setSeqDrawerVisibility(true)
    selectSequencerStatus(
      sequencerStatus.data?.find((x) => sequencerPrefix === x.prefix)
    )
  }

  return (
    <>
      {isSeqDrawerVisible && selectedSequencer && selectedSequencerStatus && (
        <SequencerDrawer
          obsMode={obsMode}
          selectedSequencerPrefix={selectedSequencer}
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
