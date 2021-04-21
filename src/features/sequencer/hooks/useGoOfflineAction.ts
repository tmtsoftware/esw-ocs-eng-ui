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
    onSuccess: () => successMessage('Sequencer is offline successfully'),
    onError: (e) => errorMessage('errorMsg', e),
    invalidateKeysOnSuccess: [[SEQUENCER_STATE.key, prefix.toJSON()]],
    useErrorBoundary: false
  })
}
