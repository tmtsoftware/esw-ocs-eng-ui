import type {
  GenericResponse,
  Prefix,
  RemoveBreakpointResponse,
  SequencerService,
  Step
} from '@tmtsoftware/esw-ts'
import { useMutation } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { useSequencerService } from './useSequencerService'

const handleActionResponse = (
  res: GenericResponse | RemoveBreakpointResponse
) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'Unhandled':
      throw new Error(res.msg)

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error('Cannot operate on in progress or finished step')

    case 'IdDoesNotExist':
      throw new Error(`${res.id} does not exist`)
  }
}

const insertAction = (id: string) => (sequencerService: SequencerService) => {
  return sequencerService.addBreakpoint(id).then(handleActionResponse)
}

const removeAction = (id: string) => (sequencerService: SequencerService) => {
  return sequencerService.removeBreakpoint(id).then(handleActionResponse)
}

export const useBreakpointAction = ({
  sequencerPrefix,
  step
}: {
  sequencerPrefix: Prefix
  step: Step
}): (() => void) => {
  const { data: sequencerService } = useSequencerService(sequencerPrefix)

  const insertBreakpointAction = useMutation({
    mutationFn: insertAction(step.id),
    onSuccess: () => successMessage('Successfully inserted breakpoint'),
    onError: (e) => errorMessage('Failed to insert breakpoint', e),
    invalidateKeysOnSuccess: [sequencerPrefix.toJSON()],
    useErrorBoundary: false
  })

  const removeBreakpointAction = useMutation({
    mutationFn: removeAction(step.id),
    onSuccess: () => successMessage('Successfully removed breakpoint'),
    onError: (e) => errorMessage('Failed to remove breakpoint', e),
    invalidateKeysOnSuccess: [sequencerPrefix.toJSON()],
    useErrorBoundary: false
  })

  if (step.hasBreakpoint) {
    return () =>
      sequencerService && removeBreakpointAction.mutate(sequencerService)
  }
  return () =>
    sequencerService && insertBreakpointAction.mutate(sequencerService)
}
