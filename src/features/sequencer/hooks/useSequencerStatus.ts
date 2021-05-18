import type { Prefix } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STATUS } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useSequencerStatus = <E>(
  sequencerPrefix: Prefix,
  onError?: (err: E) => void
): UseQueryResult<boolean> => {
  const sequencerService = useSequencerService(sequencerPrefix)

  return useQuery(
    [SEQUENCER_STATUS.key, sequencerPrefix.toJSON()],
    () => sequencerService?.isOnline(),
    {
      onError,
      enabled: !!sequencerService
    }
  )
}
