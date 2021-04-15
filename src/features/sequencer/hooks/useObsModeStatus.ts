import type { SequencerStateResponse } from '@tmtsoftware/esw-ts'
import { Prefix, ObsMode } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { OBS_MODE_STATUS } from '../../queryKeys'
import { useSequencerState } from './useSequencerState'
import { useStepList } from './useStepList'

export const useObsModeStatus = <E>(
  obsMode: ObsMode,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<RunningObsModeStatus> => {
  const sequencerPrefix = new Prefix('ESW', obsMode.name)
  const { data: sequencerState } = useSequencerState(
    sequencerPrefix,
    useErrorBoundary
  )
  const { data: stepList, isFetched: isStepListFetched } = useStepList(
    sequencerPrefix
  )

  return useQuery(
    `${obsMode.name}-${OBS_MODE_STATUS(obsMode).key}`,
    () => {
      return stepList?.isFailed()
        ? 'Failed'
        : stepList?.isPaused()
        ? 'Paused'
        : sequencerState?._type
    },
    {
      onError,
      enabled: !!sequencerState && isStepListFetched,
      refetchInterval: OBS_MODE_STATUS(obsMode).refetchInterval
    }
  )
}

export type RunningObsModeStatus =
  | SequencerStateResponse['_type']
  | 'Paused'
  | 'Failed'
