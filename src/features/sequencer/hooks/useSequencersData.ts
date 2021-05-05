import type {
  Option,
  Location,
  Prefix,
  SequencerService,
  StepList,
  Step
} from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { useGatewayLocation } from '../../../contexts/GatewayServiceContext'
import { useAuth } from '../../../hooks/useAuth'
import { createTokenFactory } from '../../../utils/createTokenFactory'
import { OBS_MODE_SEQUENCERS } from '../../queryKeys'
import { mkSequencerService } from './useSequencerService'

export type StepListStatus =
  | 'All Steps Completed'
  | 'Paused'
  | 'In Progress'
  | 'Failed'
  | 'NA'
  | 'Failed to Fetch Status'

export type SequencerInfo = {
  key: string
  prefix: string
  currentStepCommandName: string
  stepListStatus: { stepNumber: number; status: StepListStatus }
  totalSteps: number | 'NA'
}

const Status: { [key: string]: StepListStatus } = {
  Pending: 'Paused',
  Failure: 'Failed',
  InFlight: 'In Progress',
  Success: 'All Steps Completed'
}
const currentStep = (stepList: StepList): Option<Step> => {
  return stepList.steps.find((e) => e.status._type !== 'Success')
}

const deriveStatus = (
  stepList: StepList | undefined
): SequencerInfo['stepListStatus'] => {
  if (stepList === undefined) return { stepNumber: 0, status: 'NA' as const }
  const step = currentStep(stepList)
  if (step === undefined)
    return { stepNumber: 0, status: 'All Steps Completed' }
  const stepNumber = stepList.steps.indexOf(step) + 1
  return { stepNumber, status: Status[step.status._type] }
}

export const getStepListStatus = (
  stepList?: StepList,
  isError?: boolean
): SequencerInfo['stepListStatus'] => {
  return isError
    ? {
        stepNumber: 0,
        status: 'Failed to Fetch Status' as const
      }
    : deriveStatus(stepList)
}

const getStepList = async (sequencerService: SequencerService) => {
  try {
    const sequence = await sequencerService.getSequence()
    return { stepList: sequence }
  } catch (e) {
    return { isError: true }
  }
}

const getSequencerInfo = async (
  services: [SequencerService, Prefix][]
): Promise<SequencerInfo[]> => {
  return await Promise.all(
    services.map(async ([service, prefix]) => {
      const { stepList, isError } = await getStepList(service)
      const stepListStatus = getStepListStatus(stepList, isError)

      return {
        key: prefix.toJSON(),
        prefix: prefix.toJSON(),
        currentStepCommandName: getCurrentStepCommandName(stepList),
        stepListStatus,
        totalSteps: stepList ? stepList.steps.length : ('NA' as const)
      }
    })
  )
}
const getCurrentStepCommandName = (stepList: Option<StepList>): string => {
  if (stepList === undefined) {
    return 'NA'
  }

  const step = currentStep(stepList)

  if (step === undefined) {
    return 'NA'
  }
  return step.command.commandName
}

export type SequencerLocation = [Location, SequencerService]

export const useSequencersData = (
  prefixes: Prefix[]
): UseQueryResult<SequencerInfo[]> => {
  const { auth } = useAuth()
  const [gatewayLocation] = useGatewayLocation()

  return useQuery(
    [OBS_MODE_SEQUENCERS.key, ...prefixes.map((x) => x.toJSON())],
    () =>
      gatewayLocation &&
      getSequencerInfo(
        prefixes.map((prefix) => [
          mkSequencerService(prefix, gatewayLocation, createTokenFactory(auth)),
          prefix
        ])
      ),
    {
      onError: (err) => message.error((err as Error).message),
      enabled: !!gatewayLocation,
      refetchInterval: OBS_MODE_SEQUENCERS.refetchInterval
    }
  )
}
