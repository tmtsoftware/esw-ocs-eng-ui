import {
  VerticalAlignMiddleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import {
  cannotOperateOnAnInFlightOrFinishedStepMsg,
  idDoesNotExistMsg
} from '../sequencerResponsesMapping'
import type {
  GenericResponse,
  Prefix,
  RemoveBreakpointResponse,
  SequencerService,
  Step
} from '@tmtsoftware/esw-ts'

const handleActionResponse = (
  res: GenericResponse | RemoveBreakpointResponse
) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'Unhandled':
      throw new Error(res.msg)

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error(cannotOperateOnAnInFlightOrFinishedStepMsg)

    case 'IdDoesNotExist':
      throw new Error(idDoesNotExistMsg(res.id))
  }
}

const insertAction = (id: string) => (sequencerService: SequencerService) =>
  sequencerService.addBreakpoint(id).then(handleActionResponse)

const removeAction = (id: string) => (sequencerService: SequencerService) =>
  sequencerService.removeBreakpoint(id).then(handleActionResponse)

export const BreakpointAction = ({
  sequencerPrefix,
  step,
  isDisabled
}: {
  step: Step
  sequencerPrefix: Prefix
  isDisabled: boolean
}): JSX.Element => {
  const sequencerService = useSequencerService(sequencerPrefix)

  const insertBreakpointAction = useMutation({
    mutationFn: insertAction(step.id),
    onSuccess: () => successMessage('Successfully inserted breakpoint'),
    onError: (e) => errorMessage('Failed to insert breakpoint', e)
  })

  const removeBreakpointAction = useMutation({
    mutationFn: removeAction(step.id),
    onSuccess: () => successMessage('Successfully removed breakpoint'),
    onError: (e) => errorMessage('Failed to remove breakpoint', e)
  })

  if (step.hasBreakpoint) {
    return (
      <div
        onClick={() => {
          !isDisabled &&
            sequencerService &&
            removeBreakpointAction.mutate(sequencerService)
        }}>
        <CloseCircleOutlined />
        Remove breakpoint
      </div>
    )
  }

  return (
    <div
      onClick={() => {
        !isDisabled &&
          sequencerService &&
          insertBreakpointAction.mutate(sequencerService)
      }}>
      <VerticalAlignMiddleOutlined />
      Insert breakpoint
    </div>
  )
}
