import { VerticalAlignMiddleOutlined } from '@ant-design/icons'
import type {
  GenericResponse,
  RemoveBreakpointResponse,
  SequencerService
} from '@tmtsoftware/esw-ts'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { SEQUENCER_STEPS } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerStepProps } from './StepComponent'

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

export const BreakpointAction = ({
  sequencerPrefix,
  step
}: SequencerStepProps): JSX.Element => {
  const { data: sequencerService } = useSequencerService(sequencerPrefix)

  const insertBreakpointAction = useMutation({
    mutationFn: insertAction(step.id),
    onSuccess: () => successMessage('Successfully inserted breakpoint'),
    onError: (e) => errorMessage('Failed to insert breakpoint', e),
    invalidateKeysOnSuccess: [SEQUENCER_STEPS(sequencerPrefix).key],
    useErrorBoundary: false
  })

  const removeBreakpointAction = useMutation({
    mutationFn: removeAction(step.id),
    onSuccess: () => successMessage('Successfully removed breakpoint'),
    onError: (e) => errorMessage('Failed to remove breakpoint', e),
    invalidateKeysOnSuccess: [SEQUENCER_STEPS(sequencerPrefix).key],
    useErrorBoundary: false
  })

  if (step.hasBreakpoint) {
    return (
      <div
        onClick={() =>
          sequencerService && removeBreakpointAction.mutate(sequencerService)
        }>
        <VerticalAlignMiddleOutlined />
        Remove breakpoint
      </div>
    )
  }

  return (
    <div
      onClick={() =>
        sequencerService && insertBreakpointAction.mutate(sequencerService)
      }>
      <VerticalAlignMiddleOutlined />
      Insert breakpoint
    </div>
  )
}
