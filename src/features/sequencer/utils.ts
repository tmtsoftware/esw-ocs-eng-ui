import type {
  Option,
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
  | 'Loaded'

export type SequencerInfo = {
  key: string
  prefix: string
  currentStepCommandName: string
  stepListStatus: { stepNumber: number; status: StepListStatus }
  totalSteps: number
  sequencerState: SequencerState
}

const Status: { [key: string]: StepListStatus } = {
  Pending: 'Paused',
  Failure: 'Failed',
  InFlight: 'In Progress',
  Success: 'All Steps Completed'
}
const currentStep = (stepList: StepList): Option<Step> =>
  stepList.steps.find((e) => e.status._type !== 'Success')

// todo refactor this code if possible
export const getStepListStatus = (
  stepList: StepList
): SequencerInfo['stepListStatus'] => {
  if (stepList.steps.length === 0) return { stepNumber: 0, status: 'NA' }
  const step = currentStep(stepList)
  if (step === undefined)
    return { stepNumber: 0, status: 'All Steps Completed' }
  const stepNumber = stepList.steps.indexOf(step) + 1
  const status = Status[step.status._type]
  return {
    stepNumber,
    status: status === 'Paused' && !stepList.isPaused() ? 'Loaded' : status
  }
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
