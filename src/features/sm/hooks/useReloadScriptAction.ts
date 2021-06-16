import type { RestartSequencerResponse, SequenceManagerService } from '@tmtsoftware/esw-ts'
import { ObsMode, Subsystem } from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { reloadScriptConstants } from '../smConstants'
import { handleReloadScriptResponse } from '../smUtils'

export const useReloadScriptAction = (
  subsystem: Subsystem,
  obsMode: string
): UseMutationResult<RestartSequencerResponse | undefined, unknown, SequenceManagerService> => {
  const reloadScript = (subsystem: Subsystem, obsMode: ObsMode) => (smService: SequenceManagerService) =>
    smService.restartSequencer(subsystem, obsMode).then(handleReloadScriptResponse)
  console.log(reloadScript)
  return useMutation({
    mutationFn: reloadScript(subsystem, new ObsMode(obsMode)),
    onError: (e) => errorMessage(reloadScriptConstants.getFailureMessage(`${subsystem}.${obsMode}`), e),
    onSuccess: () => successMessage(reloadScriptConstants.getSuccessMessage(`${subsystem}.${obsMode}`)),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
}
