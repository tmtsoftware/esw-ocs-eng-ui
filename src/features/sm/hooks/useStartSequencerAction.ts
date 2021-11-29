import type {
  ObsMode,
  ComponentId,
  SequenceManagerService,
  StartSequencerResponse,
  Subsystem,
  Prefix
} from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
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

const startSequencer = (prefix: Prefix) => (smService: SequenceManagerService) =>
  smService.startSequencer(prefix).then(handleResponse)

export const useStartSequencerAction = (
  prefix: Prefix
): UseMutationResult<ComponentId | undefined, unknown, SequenceManagerService> =>
  useMutation({
    mutationFn: startSequencer(prefix),
    onError: (e) => errorMessage(startSequencerConstants.failureMessage, e),
    onSuccess: () => successMessage(startSequencerConstants.successMessage),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
