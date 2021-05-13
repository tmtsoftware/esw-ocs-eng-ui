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

export const stepUsingId = (
  stepStatus: StepStatus['_type'],
  id: string
): Step => {
  return {
    hasBreakpoint: false,
    status: { _type: stepStatus, message: '' },
    command: new Setup(Prefix.fromString(`ESW.test${id}`), `command${id}`),
    id: id
  }
}
