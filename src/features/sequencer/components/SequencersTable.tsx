import { SettingOutlined } from '@ant-design/icons'
import { Space, Table, Tooltip, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { HeaderTitle } from '../../../components/table/HeaderTitle'
import { getSequencerPath } from '../../../routes/RoutesConfig'
import type { SequencerInfo } from '../hooks/useSequencersData'
import styles from './sequencerTable.module.css'
import type { ColumnsType } from 'antd/lib/table/interface'
import type { BaseType } from 'antd/lib/typography/Base'

const getPrefixColumn = (record: SequencerInfo) => (
  <Space>
    <Tooltip title={'Manage sequencer'}>
      <Link to={getSequencerPath(record.prefix)}>
        <SettingOutlined className={styles.sequencerIcon} />
      </Link>
    </Tooltip>
    <Typography.Text>{record.prefix}</Typography.Text>
  </Space>
)

export const typeStatus: { [stepStatus: string]: BaseType } = {
  'All Steps Completed': 'secondary',
  'In Progress': 'success',
  Paused: 'warning',
  Loaded: 'warning',
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

const columns: ColumnsType<SequencerInfo> = [
  {
    title: <HeaderTitle title='Sequencers' />,
    dataIndex: 'prefix',
    render: (_, record) => getPrefixColumn(record)
  },
  {
    title: <HeaderTitle title='Current Step' />,
    dataIndex: 'currentStepCommandName'
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
  sequencersInfo: SequencerInfo[]
}

export const SequencersTable = ({
  sequencersInfo
}: ObsModeSeqTableProps): JSX.Element => {
  // const [gatewayLocation] = useGatewayLocation()
  // const { auth } = useAuth()
  // const tf = createTokenFactory(auth)
  // const sortedSequencers: Prefix[] = sequencers.reduce(
  //   (acc: Prefix[], elem) => {
  //     const sequencer = new Prefix(elem, obsMode.name)
  //     if (elem === 'ESW') return [sequencer].concat(acc)
  //     return acc.concat(sequencer)
  //   },
  //   []
  // )

  // // const map: Record<
  // //   string,
  // //   {
  // //     data: SequencerStateResponse | undefined
  // //     onevent: (sequencerStateResponse: SequencerStateResponse) => void
  // //   }
  // // > = useMemo(() => ({}), [])

  // // useEffect(() => {
  // //   for (const key of sortedSequencers) {
  // //     map[key.toJSON()] = {
  // //       data: undefined,
  // //       onevent: (sequencerStateResponse: SequencerStateResponse) => {
  // //         map[key.toJSON()]['data'] = sequencerStateResponse
  // //       }
  // //     }
  // //   }

  // //   const services: [SequencerService, Prefix][] | undefined =
  // //     gatewayLocation &&
  // //     sortedSequencers.map((seq) => [
  // //       mkSequencerService(seq, gatewayLocation, tf),
  // //       seq
  // //     ])

  // //   services?.map(([sequencerService, sequencerPrefix]) =>
  // //     sequencerService.subscribeSequencerState()(
  // //       map[sequencerPrefix.toJSON()]['onevent']
  // //     )
  // //   )
  // // }, [gatewayLocation, map, sortedSequencers, tf])
  // // const sequencerStatus = useSequencersData(sortedSequencers)
  // // const tableData: SequencerInfo[] = Object.entries(map).map(
  // //   ([prefix, sequencerStatus]) => {
  // //     const stepList = sequencerStatus.data?.stepList
  // //     const stepListStatus = getStepListStatus(stepList)

  // //     return {
  // //       key: prefix,
  // //       prefix: prefix,
  // //       currentStepCommandName: getCurrentStepCommandName(stepList),
  // //       stepListStatus,
  // //       totalSteps: stepList ? stepList.steps.length : ('NA' as const)
  // //     }
  // //   }
  // // )
  return (
    <Table
      rowKey={(record) => record.prefix}
      style={{ paddingBottom: '1.5rem' }}
      pagination={false}
      // loading={sequencerStatus.isLoading || sequencerStatus.isError}
      columns={columns}
      dataSource={sequencersInfo}
      onRow={() => ({ style: { fontSize: '1rem' } })}
      bordered
    />
  )
}
