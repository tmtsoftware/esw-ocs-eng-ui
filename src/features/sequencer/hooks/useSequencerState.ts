import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
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
    sequencerPrefix.toJSON() + 'state',
    () => sequencerService?.getSequencerState(),
    {
      onError,
      enabled: !!sequencerService
    }
  )
}
