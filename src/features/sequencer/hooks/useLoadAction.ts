import { useMutation, UseMutationResult } from '@tanstack/react-query'
import type { OkOrUnhandledResponse, Sequence, SequencerService } from '@tmtsoftware/esw-ts'
import { errorMessage, successMessage } from '../../../utils/message'
import { loadSequenceConstants } from '../sequencerConstants'

export const useLoadAction = (
  sequence?: Sequence
): UseMutationResult<OkOrUnhandledResponse | undefined, unknown, SequencerService> => {
  console.log('XXX useLoadAction: sequence  = ', sequence)

  const mutationFn = async (sequencerService: SequencerService) => {
    console.log('XXX mutationFn: sequence  = ', sequence)
    return sequence && (await sequencerService.loadSequence(sequence))
  }

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      console.log('XXX useMutation: onSuccess: res = ', res)
      if (res?._type === 'Ok') return successMessage(loadSequenceConstants.successMessage)
      return errorMessage(loadSequenceConstants.failureMessage, Error(res?.msg))
    },
    onError: (e) => {
      console.log('XXX useMutation onError: error: ', e)
      errorMessage(loadSequenceConstants.failureMessage, e)
    }
  })
}
