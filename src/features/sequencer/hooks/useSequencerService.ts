import { ComponentId, Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_SERVICE } from '../../queryKeys'

export const useSequencerService = <E>(
  sequencerPrefix: Prefix,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<SequencerService> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const masterSequencerCompId = new ComponentId(sequencerPrefix, 'Sequencer')
  return useQuery(
    SEQUENCER_SERVICE.key,
    () => sequencerServiceFactory(masterSequencerCompId),
    {
      useErrorBoundary,
      onError
    }
  )
}
