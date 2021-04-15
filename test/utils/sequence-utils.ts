import { Setup, Step } from '@tmtsoftware/esw-ts'
import { mock } from 'ts-mockito'

export const step = (
  stepStatus: 'Pending' | 'Success' | 'Failure' | 'InFlight',
  hasBreakpoint = false
): Step => {
  return {
    hasBreakpoint: hasBreakpoint,
    status: { _type: stepStatus, message: '' },
    command: mock(Setup),
    id: ''
  }
}
