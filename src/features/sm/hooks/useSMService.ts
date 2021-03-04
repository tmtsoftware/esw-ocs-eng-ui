import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import type { UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useService } from '../../common/hooks/useService'

export const useSMService = <E>(
  useErrorBoundary = true,
  onError?: (err: E) => void
): UseQueryResult<SequenceManagerService> => {
  const { smServiceFactory } = useServiceFactory()
  return useService('smService', smServiceFactory, useErrorBoundary, onError)
}
