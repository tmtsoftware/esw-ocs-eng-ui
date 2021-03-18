import { ComponentId, Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_SERVICE } from '../../queryKeys'

const masterSequencer = (obsMode: string) =>
  new ComponentId(new Prefix('ESW', obsMode), 'Sequencer')

export const useSequencerService = <E>(
  obsMode: string,
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<SequencerService> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const masterSequencerCompId = masterSequencer(obsMode)
  return useQuery(
    SEQUENCER_SERVICE.key,
    () => sequencerServiceFactory(masterSequencerCompId),
    {
      useErrorBoundary,
      onError
    }
  )
}
