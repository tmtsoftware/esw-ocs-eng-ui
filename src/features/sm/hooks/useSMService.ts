import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SM_SERVICE } from '../../queryKeys'

export const useSMService = <E>(
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<SequenceManagerService> => {
  const { smServiceFactory } = useServiceFactory()
  return useQuery(SM_SERVICE.key, smServiceFactory, {
    useErrorBoundary,
    onError,
    refetchInterval: SM_SERVICE.refetchInterval
  })
}
