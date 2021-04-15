import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STATE } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useSequencerState = <E>(
  sequencerPrefix: Prefix,
  useErrorBoundary = false,
  onError?: (err: E) => void
): UseQueryResult<SequencerStateResponse> => {
  const { data: sequencerService } = useSequencerService(
    sequencerPrefix,
    useErrorBoundary
  )
  return useQuery(
    SEQUENCER_STATE(sequencerPrefix).key,
    () => sequencerService?.getSequencerState(),
    {
      onError,
      enabled: !!sequencerService,
      refetchInterval: SEQUENCER_STATE(sequencerPrefix).refetchInterval
    }
  )
}
