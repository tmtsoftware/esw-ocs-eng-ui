import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'

export const useSMService = <E>(
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<SequenceManagerService> => {
  const { smServiceFactory } = useServiceFactory()
  return useQuery('smService', smServiceFactory, {
    useErrorBoundary,
    onError,
    retry: 1
  })
}
