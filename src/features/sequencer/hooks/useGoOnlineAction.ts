import type { Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import type { GoOnlineResponse } from '@tmtsoftware/esw-ts/lib/src/index'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SEQUENCER_STATE } from '../../queryKeys'

export const useGoOnlineAction = (
  prefix: Prefix
): UseMutationResult<GoOnlineResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.goOnline()

  return useMutation({
    mutationFn,
    onSuccess: () => successMessage('Sequencer is online successfully'),
    onError: (e) => errorMessage('errorMsg', e),
    invalidateKeysOnSuccess: [[SEQUENCER_STATE.key, prefix.toJSON()]],
    useErrorBoundary: false
  })
}
