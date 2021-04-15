import type {
  OkOrUnhandledResponse,
  Prefix,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SEQUENCER_STATE, SEQUENCER_STEPS } from '../../queryKeys'

export const useLoadAction = (
  prefix: Prefix,
  sequence?: SequenceCommand[]
): UseMutationResult<
  OkOrUnhandledResponse | undefined,
  unknown,
  SequencerService
> => {
  const mutationFn = async (sequencerService: SequencerService) =>
    sequence && (await sequencerService.loadSequence(sequence))

  return useMutation({
    mutationFn,
    onSuccess: () => successMessage('Sequence has been loaded successfully'),
    onError: (e) => errorMessage('errorMsg', e),
    invalidateKeysOnSuccess: [
      SEQUENCER_STATE(prefix).key,
      SEQUENCER_STEPS(prefix).key
    ],
    useErrorBoundary: false
  })
}
