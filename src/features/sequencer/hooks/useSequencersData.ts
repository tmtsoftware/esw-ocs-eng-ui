import type {
  Location,
  LocationService,
  Prefix,
  StepList
} from '@tmtsoftware/esw-ts'
import { ComponentId } from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { useLocationService } from '../../../contexts/LocationServiceContext'
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
  key: string
  prefix: string
  stepListStatus: { stepNumber: number; status: StepStatus }
  totalSteps: number | 'NA'
  location?: Location
}

const Status: { [key: string]: StepStatus } = {
  Pending: 'Paused',
  Failure: 'Failed',
  InFlight: 'In Progress',
  Success: 'All Steps Completed'
}

const deriveStatus = (
  stepList: StepList | undefined
): Datatype['stepListStatus'] => {
  if (stepList === undefined) return { stepNumber: 0, status: 'NA' as const }

  const step = stepList.steps.find((x) => x.status._type !== 'Success')
  if (step === undefined)
    return { stepNumber: 0, status: 'All Steps Completed' }
  const stepNumber = stepList.steps.indexOf(step) + 1
  return { stepNumber, status: Status[step.status._type] }
}

const getStepList = async (
  sequencer: Prefix,
  sequencerServiceFactory: ServiceFactoryContextType['sequencerServiceFactory']
): Promise<{ stepList?: StepList; isError?: boolean }> => {
  try {
    const sequencerService = await sequencerServiceFactory(
      new ComponentId(sequencer, 'Sequencer')
    )
    const sequence = await sequencerService.getSequence()
    return { stepList: sequence }
  } catch (e) {
    return { isError: true }
  }
}

export const getStepListStatus = (
  stepList?: StepList,
  isError?: boolean
): Datatype['stepListStatus'] => {
  return isError
    ? {
        stepNumber: 0,
        status: 'Failed to Fetch Status' as const
      }
    : deriveStatus(stepList)
}

const getData = async (
  sequencers: Prefix[],
  sequencerServiceFactory: ServiceFactoryContextType['sequencerServiceFactory'],
  locationService: LocationService
): Promise<Datatype[]> => {
  const allSequencers = (
    await locationService.listByComponentType('Sequencer')
  ).filter((x) => x.connection.connectionType === 'http')

  return await Promise.all(
    sequencers.map(async (prefix) => {
      const location = allSequencers.find(
        (x) => x.connection.prefix.toJSON() === prefix.toJSON()
      )
      const { stepList, isError } = await getStepList(
        prefix,
        sequencerServiceFactory
      )

      return {
        key: prefix.toJSON(),
        prefix: prefix.toJSON(),
        stepListStatus: getStepListStatus(stepList, isError),
        totalSteps: stepList ? stepList.steps.length : ('NA' as const),
        location: location
      }
    })
  )
}

export const useSequencersData = (
  sequencers: Prefix[]
): UseQueryResult<Datatype[]> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const locationService = useLocationService()

  return useQuery(
    [OBS_MODE_SEQUENCERS.key, ...sequencers],
    () => getData(sequencers, sequencerServiceFactory, locationService),
    {
      useErrorBoundary: false,
      onError: (err) => message.error((err as Error).message),
      enabled: !!locationService,
      refetchInterval: OBS_MODE_SEQUENCERS.refetchInterval
    }
  )
}
