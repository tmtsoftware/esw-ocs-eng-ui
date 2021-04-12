import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { OBS_MODE_STATE } from '../../queryKeys'
import { useSequencerState } from './useSequencerState'
import { useStepList } from './useStepList'

export const useObsModeState = <E>(
  sequencerPrefix: Prefix,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<RunningObsModeStatus> => {
  const { data: sequencerState } = useSequencerState(
    sequencerPrefix,
    useErrorBoundary
  )
  const { data: stepList } = useStepList(sequencerPrefix)
  const stepState = stepList?.isFailed()
    ? 'StepFailed'
    : stepList?.isPaused()
    ? 'StepPaused'
    : sequencerState?._type
  return useQuery(
    OBS_MODE_STATE.key + sequencerPrefix.toJSON(),
    () => stepState,
    {
      onError,
      enabled: !!sequencerState
    }
  )
}

export type RunningObsModeStatus =
  | SequencerStateResponse['_type']
  | 'StepPaused'
  | 'StepFailed'
