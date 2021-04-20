import type {
  GoOfflineResponse,
  Prefix,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SEQUENCER_STATE } from '../../queryKeys'

export const useGoOfflineAction = (
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
    invalidateKeysOnSuccess: [[SEQUENCER_STATE.key, prefix.toJSON()]],
    useErrorBoundary: false
  })
}
