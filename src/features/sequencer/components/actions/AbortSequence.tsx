import type {
  OkOrUnhandledResponse,
  Prefix,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { showConfirmModal } from '../../../../components/modal/showConfirmModal'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

const useAbortSequence = (
  prefix: Prefix
): UseMutationResult<OkOrUnhandledResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.abortSequence()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Successfully aborted the Sequence')
      return errorMessage('Failed to abort the Sequence', Error(res.msg))
    },
    onError: (e) => errorMessage('Failed to abort the Sequence', e),
    invalidateKeysOnSuccess: [[GET_SEQUENCE.key, prefix.toJSON()]]
  })
}

export const AbortSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const abortAction = useAbortSequence(prefix)

  return (
    <Button
      danger
      loading={abortAction.isLoading}
      onClick={() =>
        sequencerService &&
        showConfirmModal(
          () => {
            abortAction.mutate(sequencerService)
          },
          'Do you want to abort the sequence?',
          'Abort'
        )
      }
      disabled={!sequencerState || sequencerState !== 'Running'}>
      Abort sequence
    </Button>
  )
}
