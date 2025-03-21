import { useQuery } from '@tanstack/react-query'
import type { UseQueryResult } from '@tanstack/react-query'
import type { Prefix, SequencerState } from '@tmtsoftware/esw-ts'
import { SEQUENCER_STATE } from '../../queryKeys'
import { useSequencerService } from '../../sequencer/hooks/useSequencerService'

export const useSequencerState = (sequencerPrefix: Prefix): UseQueryResult<SequencerState> => {
  const sequencerService = useSequencerService(sequencerPrefix)
  return useQuery({
    queryKey: [SEQUENCER_STATE.key, sequencerPrefix],
    queryFn: async () => sequencerService && await sequencerService.getSequencerState(),
    enabled: !!sequencerService
  })
}
