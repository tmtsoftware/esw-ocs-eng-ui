import type { Prefix } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STATUS } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useSequencerStatus = <E>(
  sequencerPrefix: Prefix,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<boolean> => {
  const { data: sequencerService } = useSequencerService(
    sequencerPrefix,
    useErrorBoundary
  )
  return useQuery(SEQUENCER_STATUS.key, () => sequencerService?.isOnline(), {
    onError,
    enabled: !!sequencerService
  })
}
