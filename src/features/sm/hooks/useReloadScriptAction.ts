import type {
  Subsystem,
  ObsMode,
  RestartSequencerResponse,
  RestartSequencerSuccess,
  SequenceManagerService,
  Variation
} from '@tmtsoftware/esw-ts'
import { Prefix } from '@tmtsoftware/esw-ts'
import { useMutation } from '../../../hooks/useMutation'
import type { UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'
import { reloadScriptConstants } from '../smConstants'

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const handleReloadScriptResponse = (res: RestartSequencerResponse): RestartSequencerSuccess => {
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
  obsMode: ObsMode,
  variation?: Variation
): UseMutationResult<RestartSequencerResponse | undefined, unknown, SequenceManagerService> => {
  const reloadScript =
    (subsystem: Subsystem, obsMode: ObsMode, variation?: Variation) => (smService: SequenceManagerService) =>
      smService
        .restartSequencer(subsystem, obsMode, variation)
        .then(handleReloadScriptResponse)
        /* we use locationService tracking api to decide action (Reload/Start sequencer).
         * when we do reload action, it internally shutdowns & tracking api receives LocationRemoved event,
         * this changes reload => start in action column,
         * after fraction of milliseconds, sequencers is restarted & action columns is updated accordingly.
         * To avoid this transition at UI side, added delay at reload action. */
        .then((res) => delay(200).then(() => res))

  const prefix = variation
    ? new Prefix(subsystem, obsMode.name + '.' + variation.name)
    : new Prefix(subsystem, obsMode.name)

  return useMutation({
    mutationFn: reloadScript(subsystem, obsMode, variation),
    onError: (e) => errorMessage(reloadScriptConstants.getFailureMessage(`${prefix.toJSON()}`), e),
    onSuccess: () => successMessage(reloadScriptConstants.getSuccessMessage(`${prefix.toJSON()}`)),
    invalidateKeysOnSuccess: [AGENTS_STATUS.key]
  })
}
