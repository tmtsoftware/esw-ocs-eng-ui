import {
  ComponentId,
  HttpConnection,
  Location,
  LocationService,
  Prefix,
  StepList
} from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
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

const deriveStatus = (stepList: StepList | undefined): Datatype['status'] => {
  if (stepList === undefined) return { stepNumber: 0, status: 'NA' as const }

  const step = stepList.find((x) => x.status._type !== 'Success')
  if (step === undefined)
    return { stepNumber: 0, status: 'All Steps Completed' }

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
        const location = await locationService.find(
          HttpConnection(prefix, 'Sequencer')
        )

        const stepList = await sequencer.getSequence()

        return {
          prefix: prefix.toJSON(),
          status: deriveStatus(stepList),
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
