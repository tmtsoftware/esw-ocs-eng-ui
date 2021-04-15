import { ComponentId, Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_SERVICE } from '../../queryKeys'

export const useSequencerService = <E>(
  sequencerPrefix: Prefix,
  useErrorBoundary = true,
  enabled = true,
  onError?: (err: E) => void
): UseQueryResult<SequencerService> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const masterSequencerCompId = new ComponentId(sequencerPrefix, 'Sequencer')
  const query = SEQUENCER_SERVICE(sequencerPrefix)

  return useQuery(
    query.key,
    () => sequencerServiceFactory(masterSequencerCompId),
    {
      useErrorBoundary,
      onError,
      enabled: enabled
    }
  )
}
