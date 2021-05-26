import { Prefix, Setup, Step, StepList, StepStatus } from '@tmtsoftware/esw-ts'
import { getCurrentStepCommandName, SequencerInfo } from '../../src/features/sequencer/utils'

export const getStep = (stepStatus: StepStatus['_type'], id: string, hasBreakpoint = false): Step => {
  return {
    hasBreakpoint: hasBreakpoint,
    status: { _type: stepStatus, message: '' },
    command: new Setup(Prefix.fromString(`ESW.test${id}`), `Command-${id}`),
    id: id
  }
}

export const getStepList = (status: Step['status']['_type'], hasBreakpoint = false): StepList =>
  new StepList([
    {
      hasBreakpoint: hasBreakpoint,
      status: { _type: status, message: '' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: 'step1'
    }
  ])

export const getSequencersInfo = (): SequencerInfo[] => {
  return [
    {
      key: 'ESW.darknight',
      prefix: 'ESW.darknight',
      currentStepCommandName: getCurrentStepCommandName(undefined),
      stepListInfo: { status: 'NA', currentStepNumber: 0 },
      sequencerState: { _type: 'Idle' },
      totalSteps: 0
    }
  ]
}
