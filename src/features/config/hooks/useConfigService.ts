import type { ConfigService } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { errorMessage } from '../../../utils/message'
import { CONFIG_SERVICE_KEY } from '../../queryKeys'

export const useConfigService = (
  useErrorBoundary = true
): UseQueryResult<ConfigService> => {
  const { configServiceFactory } = useServiceFactory()
  return useQuery(CONFIG_SERVICE_KEY, configServiceFactory, {
    useErrorBoundary,
    onError: errorMessage,
    retry: 1
  })
}
