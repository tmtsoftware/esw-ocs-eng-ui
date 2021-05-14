import type {
  Location,
  Option,
  SequencerService,
  SequencerState,
  Step,
  StepList
} from '@tmtsoftware/esw-ts'

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
  sequencerState: SequencerState
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
  if (stepList === undefined || stepList.steps.length === 0)
    return { stepNumber: 0, status: 'NA' as const }
  const step = currentStep(stepList)
  if (step === undefined)
    return { stepNumber: 0, status: 'All Steps Completed' }
  const stepNumber = stepList.steps.indexOf(step) + 1
  return { stepNumber, status: Status[step.status._type] }
}

export const getStepListStatus = (
  stepList?: StepList
): SequencerInfo['stepListStatus'] => {
  return deriveStatus(stepList)
  // isError
  //   ? {
  //       stepNumber: 0,
  //       status: 'Failed to Fetch Status' as const
  //     }
  //   :
}

export const getCurrentStepCommandName = (
  stepList: Option<StepList>
): string => {
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
