import type { Prefix, StepList } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { GET_SEQUENCE } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useStepList = (
  sequencerPrefix: Prefix
): UseQueryResult<StepList | undefined> => {
  const sequencerService = useSequencerService(sequencerPrefix)

  return useQuery(
    [GET_SEQUENCE.key, sequencerPrefix.toJSON()],
    () => sequencerService?.getSequence(),
    {
      useErrorBoundary: false,
      refetchInterval: GET_SEQUENCE.refetchInterval,
      enabled: !!sequencerService
    }
  )
}
