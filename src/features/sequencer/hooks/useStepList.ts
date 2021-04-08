import type { Prefix, StepList } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { OBS_MODE_SEQUENCERS } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useStepList = (
  sequencerPrefix: Prefix
): UseQueryResult<StepList | undefined> => {
  const { data: sequencerService } = useSequencerService(sequencerPrefix)

  return useQuery(
    sequencerPrefix.toJSON(),
    () => sequencerService?.getSequence(),
    {
      useErrorBoundary: false,
      refetchInterval: OBS_MODE_SEQUENCERS.refetchInterval,
      enabled: !!sequencerService
    }
  )
}
