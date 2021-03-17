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
import React, { useState } from 'react'
import { useQuery, UseQueryResult } from 'react-query'
import {
  ServiceFactoryContextType,
  useServiceFactory
} from '../../contexts/ServiceFactoryContext'
import { OBS_MODE_SEQUENCERS_KEY } from '../../features/queryKeys'
import SequencerDetails from '../../features/sequencer/components/SequencerDetails'
import styles from '../../features/sm/components/provision/provision.module.css'

type StepStatus =
  | 'completed'
  | 'paused'
  | 'pending'
  | 'in progress'
  | 'failed'
  | 'No sequence present'

type Datatype = {
  prefix: string
  status: { stepNumber: number; status: StepStatus }
  totalSteps: number
  location: Location | undefined
}

const columns = (
  onEditHandle: (sequencer?: Location) => void
): ColumnsType<Datatype> => [
  {
    title: 'Sequencers',
    dataIndex: 'prefix',
    key: 'prefix',
    fixed: 'left',
    // eslint-disable-next-line react/display-name
    render: (value, record) => {
      return (
        <>
          <EditOutlined onClick={() => onEditHandle(record.location)} />
          <Typography.Text>{value}</Typography.Text>
        </>
      )
    }
  },
  {
    title: 'Current Step',
    dataIndex: 'status',
    key: 'status',
    fixed: 'left',
    // eslint-disable-next-line react/display-name
    render: (value) => (
      <Typography.Text>{`Step${value.stepNumber} ${value.status}`}</Typography.Text>
    )
  },
  {
    title: 'Total Steps',
    dataIndex: 'totalSteps',
    key: 'totalSteps',
    fixed: 'left'
  }
]

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
            status: 'No sequence present'
          }

      return {
        prefix: prefix.toJSON(),
        status,
        totalSteps: stepList ? stepList.length : 0,
        location: location
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
    OBS_MODE_SEQUENCERS_KEY,
    () => getData(sequencers, sequencerServiceFactory, locationService),
    {
      enabled: !!locationService,
      retry: true,
      retryDelay: 2000
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
        loading={sequencerStatus.isLoading}
        columns={columns(onEditHandle)}
        dataSource={sequencerStatus.data}
        onHeaderRow={() => ({ className: styles.header })}
        onRow={() => ({ className: styles.cell })}
      />
    </>
  )
}
