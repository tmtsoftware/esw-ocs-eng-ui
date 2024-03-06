import type { OkOrUnhandledResponse, Sequence, SequencerService } from '@tmtsoftware/esw-ts'
import { useMutation } from '../../../hooks/useMutation'
import type { UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { loadSequenceConstants } from '../sequencerConstants'

export const useLoadAction = (
  sequence?: Sequence
): UseMutationResult<OkOrUnhandledResponse | undefined, unknown, SequencerService> => {
  const mutationFn = async (sequencerService: SequencerService) => {
    return sequence && (await sequencerService.loadSequence(sequence))
  }

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res?._type === 'Ok') return successMessage(loadSequenceConstants.successMessage)
      return errorMessage(loadSequenceConstants.failureMessage, Error(res?.msg))
    },
    onError: (e) => errorMessage(loadSequenceConstants.failureMessage, e)
  })
}
