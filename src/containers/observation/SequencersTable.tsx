import { EditOutlined } from '@ant-design/icons'
import {
  ComponentId,
  HttpConnection,
  Location,
  LocationService,
  ObsMode,
  Prefix,
  StepList,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Drawer, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table/interface'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useState } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import {
  ServiceFactoryContextType,
  useServiceFactory
} from '../../contexts/ServiceFactoryContext'
import styles from '../../features/agent/components/agentCards.module.css'
import { OBS_MODE_SEQUENCERS } from '../../features/queryKeys'
import SequencerDetails from '../../features/sequencer/components/SequencerDetails'

type StepStatus =
  | 'completed'
  | 'paused'
  | 'pending'
  | 'in progress'
  | 'failed'
  | 'NA'
  | 'Failed to fetch status'

type Datatype = {
  prefix: string
  status: { stepNumber: number; status: StepStatus }
  totalSteps: number | 'NA'
  location?: Location
}

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
    title: headerTitle('Current Step'),
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
  switch (stepStatus) {
    case 'completed':
      return 'secondary'
    case 'in progress':
      return 'success'
    case 'paused':
      return 'warning'
    case 'pending':
      return 'warning'
    case 'failed':
      return 'danger'
    case 'Failed to fetch status':
      return 'danger'
  }
  return
}

const calcStatus = (stepList: StepList): Datatype['status'] => {
  const step = stepList.find((x) => x.status._type != 'Success')
  if (!step) return { stepNumber: 0, status: 'completed' }
  const stepNumber = stepList.indexOf(step) + 1
  switch (step.status._type) {
    case 'Pending':
      if (step.hasBreakpoint) return { stepNumber, status: 'paused' }
      else return { stepNumber, status: 'pending' }
    case 'Failure':
      return { stepNumber, status: 'failed' }
    case 'InFlight':
      return { stepNumber, status: 'in progress' }
    case 'Success':
      return { stepNumber: 0, status: 'completed' }
  }
}

const getData = (
  sequencers: Prefix[],
  sequencerServiceFactory: ServiceFactoryContextType['sequencerServiceFactory'],
  locationService: LocationService
): Promise<Datatype[]> =>
  Promise.all(
    sequencers.map(async (prefix) => {
      try {
        const sequencer = await sequencerServiceFactory(
          new ComponentId(prefix, 'Sequencer')
        )
        const location: Location | undefined = await locationService.find(
          HttpConnection(prefix, 'Sequencer')
        )

        const stepList = await sequencer.getSequence()
        const status: Datatype['status'] = stepList
          ? calcStatus(stepList)
          : {
              stepNumber: 0,
              status: 'NA'
            }

        return {
          prefix: prefix.toJSON(),
          status,
          totalSteps: stepList ? stepList.length : ('NA' as const),
          location: location
        }
      } catch (e) {
        return Promise.resolve({
          prefix: prefix.toJSON(),
          status: {
            stepNumber: 0,
            status: 'Failed to fetch status' as StepStatus
          },
          totalSteps: 'NA' as const
        })
      }
    })
  )

const useSequencerStatus = (
  sequencers: Prefix[]
): UseQueryResult<Datatype[]> => {
  const {
    locationServiceFactory,
    sequencerServiceFactory
  } = useServiceFactory()

  const locationService = locationServiceFactory()
  return useQuery(
    OBS_MODE_SEQUENCERS.key,
    () => getData(sequencers, sequencerServiceFactory, locationService),
    {
      enabled: !!locationService,
      refetchInterval: OBS_MODE_SEQUENCERS.refetchInterval
    }
  )
}

type ObsModeSeqTableProps = {
  obsMode: ObsMode
  sequencers: Subsystem[]
}

export const SequencersTable = ({
  obsMode,
  sequencers
}: ObsModeSeqTableProps): JSX.Element => {
  const sequencerStatus = useSequencerStatus(
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
          <SequencerDetails sequencer={selectedSequencer} />
        )}
      </Drawer>
      <Table
        pagination={false}
        loading={sequencerStatus.isLoading || sequencerStatus.isError}
        columns={columns(onEditHandle)}
        dataSource={sequencerStatus.data}
        onRow={() => ({ style: { fontSize: '1rem' } })}
        style={{ marginLeft: '0.8rem', marginTop: '0.8rem' }}
      />
    </>
  )
}
