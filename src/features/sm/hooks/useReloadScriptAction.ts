import type { RestartSequencerResponse, RestartSequencerSuccess, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { reloadScriptConstants } from '../smConstants'

export const handleReloadScriptResponse = (res: RestartSequencerResponse): RestartSequencerSuccess => {
  switch (res._type) {
    case 'Success':
      return res
    case 'LoadScriptError':
      throw new Error(res.reason)

    case 'LocationServiceError':
      throw new Error(res.reason)

    case 'Unhandled':
      throw new Error(res.msg)

    case 'FailedResponse':
      throw new Error(res.reason)
  }
}

export const useReloadScriptAction = (
  subsystem: Subsystem,
  obsMode: string
): UseMutationResult<RestartSequencerResponse | undefined, unknown, SequenceManagerService> => {
  const reloadScript = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
    smService.restartSequencer(subsystem, obsMode).then(handleReloadScriptResponse)
  return useMutation({
    mutationFn: reloadScript(subsystem, new ObsMode(obsMode)),
    onError: (e) => errorMessage(reloadScriptConstants.getFailureMessage(`${subsystem}.${obsMode}`), e),
    onSuccess: () => successMessage(reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode}`)),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
}
