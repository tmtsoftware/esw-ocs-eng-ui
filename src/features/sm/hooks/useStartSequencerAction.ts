import type {
  ComponentId,
  ObsMode,
  SequenceManagerService,
  StartSequencerResponse,
  Subsystem,
  Variation
} from '@tmtsoftware/esw-ts'
import { useMutation } from '../../../hooks/useMutation'
import type { UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { startSequencerConstants } from '../smConstants'

const handleResponse = (res: StartSequencerResponse) => {
  switch (res._type) {
    case 'Started':
      return res.componentId

    case 'AlreadyRunning':
      throw new Error(startSequencerConstants.getAlreadyRunningErrorMessage(res.componentId.prefix.toJSON()))

    case 'LoadScriptError':
      throw new Error(res.reason)

    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'SequenceComponentNotAvailable':
      throw new Error(res.msg)

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}

const startSequencer =
  (subsystem: Subsystem, obsMode: ObsMode, variation?: Variation) => (smService: SequenceManagerService) => {
    const f = smService.startSequencer(subsystem, obsMode, variation)
    console.log('XXX startSequencer subsystem=', subsystem, ' obsMode=', obsMode, ' variation=', variation, ', f=', f)
    return f.then(handleResponse)
  }

export const useStartSequencerAction = (
  subsystem: Subsystem,
  obsMode: ObsMode,
  variation?: Variation
): UseMutationResult<ComponentId | undefined, unknown, SequenceManagerService> => {
  console.log('XXX useStartSequencerAction subsystem=', subsystem, ' obsMode=', obsMode, ' variation=', variation)
  return useMutation({
    mutationFn: startSequencer(subsystem, obsMode, variation),
    onError: (e) => errorMessage(startSequencerConstants.failureMessage, e),
    onSuccess: () => successMessage(startSequencerConstants.successMessage),
    invalidateKeysOnSuccess: [[AGENTS_STATUS.key]]
  })
}
