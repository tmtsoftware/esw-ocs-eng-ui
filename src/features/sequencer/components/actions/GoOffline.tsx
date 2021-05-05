import type {
  GoOfflineResponse,
  Prefix,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { SEQUENCER_STATE, SEQUENCER_STATUS } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

const useGoOfflineAction = (
  prefix: Prefix
): UseMutationResult<GoOfflineResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.goOffline()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Sequencer is offline successfully')
      return errorMessage(
        'Sequencer failed to go Offline',
        Error(res._type === 'GoOfflineHookFailed' ? res._type : res.msg)
      )
    },
    onError: (e) => errorMessage('Sequencer failed to go Offline', e),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [SEQUENCER_STATUS.key, prefix.toJSON()]
    ]
  })
}

export const GoOffline = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const goOfflineAction = useGoOfflineAction(prefix)

  const goOffline = () =>
    sequencerService && goOfflineAction.mutate(sequencerService)

  return (
    <Button
      disabled={!sequencerState || sequencerState === 'Running'}
      loading={goOfflineAction.isLoading}
      onClick={() => goOffline()}>
      Go offline
    </Button>
  )
}
