import type {
  OkOrUnhandledResponse,
  Prefix,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SEQUENCER_STATE, GET_SEQUENCE } from '../../queryKeys'

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
    onSuccess: (res) => {
      if (res?._type === 'Ok')
        return successMessage('Sequence has been loaded successfully')
      return errorMessage('error', Error(res?.msg))
    },
    onError: (e) => errorMessage('errorMsg', e),
    invalidateKeysOnSuccess: [
      [SEQUENCER_STATE.key, prefix.toJSON()],
      [GET_SEQUENCE.key, prefix.toJSON()]
    ],
    useErrorBoundary: false
  })
}
