import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STATUS } from '../../queryKeys'
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
  return useQuery(SEQUENCER_STATUS.key, () => sequencerService?.isOnline(), {
    onError,
    enabled: !!sequencerService
  })
}
