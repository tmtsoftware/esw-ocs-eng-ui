import type {
  ConfigureSuccess,
  ObsMode,
  SequenceManagerService
} from '@tmtsoftware/esw-ts'
import type { UseMutationResult } from 'react-query'
import { useAction } from '../../common/hooks/useAction'
import { errorMessage, successMessage } from '../../common/message'
import { AGENTS_STATUS_KEY, OBS_MODES_DETAILS_KEY } from '../../queryKeys'

export const useConfigureAction = (
  obsMode: ObsMode | undefined
): UseMutationResult<
  ConfigureSuccess | undefined,
  unknown,
  SequenceManagerService
> => {
  const configure = async (sequenceManagerService: SequenceManagerService) => {
    return (
      obsMode &&
      sequenceManagerService.configure(obsMode).then((res) => {
        switch (res._type) {
          case 'Success':
            return res
          case 'ConfigurationMissing':
            throw Error(`ConfigurationMissing for ${obsMode?.name}`)
          case 'ConflictingResourcesWithRunningObsMode':
            throw Error(
              `${
                obsMode?.name
              } is conflicting with currently running Observation Modes. Running ObsModes: ${res.runningObsMode.map(
                (x) => x.name
              )}`
            )
          case 'FailedToStartSequencers':
            throw Error(`Failed to start Sequencers. Reason: ${res.reasons}`)
          case 'SequenceComponentNotAvailable':
            throw Error(res.msg)
          case 'LocationServiceError':
            throw Error(res.reason)
          case 'Unhandled':
            throw Error(res.msg)
        }
      })
    )
  }

  return useAction({
    mutationFn: configure,
    onSuccess: () => successMessage(`${obsMode?.name} has been configured.`),
    onError: (e) => errorMessage(`Failed to configure ${obsMode?.name}`, e),
    invalidateKeysOnSuccess: [AGENTS_STATUS_KEY, OBS_MODES_DETAILS_KEY],
    useErrorBoundary: false
  })
}
