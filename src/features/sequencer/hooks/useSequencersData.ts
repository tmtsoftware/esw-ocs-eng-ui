import {
  StepList,
  Prefix,
  LocationService,
  ComponentId,
  HttpConnection,
  Location
} from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import { UseQueryResult, useQuery } from 'react-query'
import {
  ServiceFactoryContextType,
  useServiceFactory
} from '../../../contexts/ServiceFactoryContext'
import { OBS_MODE_SEQUENCERS } from '../../queryKeys'

export type StepStatus =
  | 'All Steps Completed'
  | 'Paused'
  | 'In Progress'
  | 'Failed'
  | 'NA'
  | 'Failed to Fetch Status'

export type Datatype = {
  prefix: string
  status: { stepNumber: number; status: StepStatus }
  totalSteps: number | 'NA'
  location?: Location
}

const Status: { [key: string]: StepStatus } = {
  Pending: 'Paused',
  Failure: 'Failed',
  InFlight: 'In Progress',
  Success: 'All Steps Completed'
}

const calcStatus = (stepList: StepList): Datatype['status'] => {
  const step = stepList.find((x) => x.status._type != 'Success')
  if (!step) return { stepNumber: 0, status: 'All Steps Completed' }
  const stepNumber = stepList.indexOf(step) + 1
  return { stepNumber, status: Status[step.status._type] }
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

        return {
          prefix: prefix.toJSON(),
          status: stepList
            ? calcStatus(stepList)
            : { stepNumber: 0, status: 'NA' as const },
          totalSteps: stepList ? stepList.length : ('NA' as const),
          location: location
        }
      } catch (e) {
        return Promise.resolve({
          prefix: prefix.toJSON(),
          status: {
            stepNumber: 0,
            status: 'Failed to Fetch Status' as const
          },
          totalSteps: 'NA' as const
        })
      }
    })
  )

export const useSequencersData = (
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
      useErrorBoundary: false,
      onError: (err) => message.error((err as Error).message),
      enabled: !!locationService,
      refetchInterval: OBS_MODE_SEQUENCERS.refetchInterval
    }
  )
}
