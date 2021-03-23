import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { useSequencerService } from './useSequencerService'

export const useSequencerStatus = <E>(
  obsMode: string,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<boolean> => {
  const { data: sequencerService } = useSequencerService(
    obsMode,
    useErrorBoundary
  )
  return useQuery('SequencerStatus', () => sequencerService?.isOnline(), {
    onError,
    enabled: !!sequencerService
  })
}
