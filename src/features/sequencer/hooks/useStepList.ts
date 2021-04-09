import type { Prefix, StepList } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { SEQUENCER_STEPS } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useStepList = (
  sequencerPrefix: Prefix
): UseQueryResult<StepList | undefined> => {
  const { data: sequencerService } = useSequencerService(sequencerPrefix)
  const query = SEQUENCER_STEPS(sequencerPrefix)

  return useQuery(query.key, () => sequencerService?.getSequence(), {
    useErrorBoundary: false,
    refetchInterval: query.refetchInterval,
    enabled: !!sequencerService
  })
}
