import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import type { UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/serviceFactoryContext/ServiceFactoryContext'
import { useService } from '../../common/hooks/useService'

export const useSMService = <E>(
  useErrorBoundary = true,
  onError: (err: E) => void = message.error
): UseQueryResult<SequenceManagerService> => {
  const { smServiceFactory } = useServiceFactory()
  return useService('smService', smServiceFactory, useErrorBoundary, onError)
}
