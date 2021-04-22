import type { Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import type { GoOnlineResponse } from '@tmtsoftware/esw-ts/lib/src/index'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SEQUENCER_STATE, SEQUENCER_STATUS } from '../../queryKeys'

export const useGoOnlineAction = (
  prefix: Prefix
): UseMutationResult<GoOnlineResponse, unknown, SequencerService> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.goOnline()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Sequencer is online successfully')
      return errorMessage(
        'Sequencer failed to go Online',
        Error(res._type === 'GoOnlineHookFailed' ? res._type : res.msg)
      )
    },
    onError: (e) => errorMessage('Sequencer failed to go Online', e),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [SEQUENCER_STATUS.key, prefix.toJSON()]
    ],
    useErrorBoundary: false
  })
}
