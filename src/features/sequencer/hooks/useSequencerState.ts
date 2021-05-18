import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STATE } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'
import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'

export const useSequencerState = <E>(
  sequencerPrefix: Prefix,
  enabled = true,
  onError?: (err: E) => void
): UseQueryResult<SequencerStateResponse> => {
  const sequencerService = useSequencerService(sequencerPrefix)

  return useQuery(
    [SEQUENCER_STATE.key, sequencerPrefix.toJSON()],
    () => sequencerService?.getSequencerState(),
    {
      onError,
      enabled: !!sequencerService && enabled,
      refetchInterval: SEQUENCER_STATE.refetchInterval
    }
  )
}
