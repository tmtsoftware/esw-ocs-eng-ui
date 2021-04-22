import { Prefix, Setup, Step, StepStatus } from '@tmtsoftware/esw-ts'

export const step = (
  stepStatus: StepStatus['_type'],
  commandName = 'command-1',
  hasBreakpoint = false
): Step => {
  return {
    hasBreakpoint: hasBreakpoint,
    status: { _type: stepStatus, message: '' },
    command: new Setup(Prefix.fromString('ESW.test'), commandName),
    id: ''
  }
}
