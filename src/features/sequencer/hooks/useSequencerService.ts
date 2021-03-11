import { ComponentId, Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { SEQUENCER_SERVICE_KEY } from '../../queryKeys'

export const useSequencerService = <E>(
  obsMode: string,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<SequencerService> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const masterSequencerCompId = new ComponentId(
    new Prefix('ESW', obsMode),
    'Sequencer'
  )
  return useQuery(
    SEQUENCER_SERVICE_KEY,
    () => sequencerServiceFactory(masterSequencerCompId),
    {
      useErrorBoundary,
      onError,
      retry: 1
    }
  )
}
