import type { OkOrUnhandledResponse, SequencerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

const useStopAction = (): UseMutationResult<OkOrUnhandledResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) => sequencerService.stop()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok') return successMessage('Successfully stopped the Sequence')
      return errorMessage('Failed to stop the Sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to stop the Sequence', e)
  })
}

type StopSequenceProps = Omit<SequencerProps, 'sequencerState'>

export const StopSequence = ({ prefix, isSequencerRunning }: StopSequenceProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const stopAction = useStopAction()
  const disabled = !isSequencerRunning

  const onClick = () =>
    sequencerService &&
    showConfirmModal(
      () => {
        stopAction.mutate(sequencerService)
      },
      'Do you want to stop the sequence?',
      'Stop'
    )

  return (
    <Button onClick={onClick} disabled={disabled} role='StopSequence' danger={!disabled}>
      Stop sequence
    </Button>
  )
}
