import type { ConfigService } from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { CONFIG_SERVICE_KEY } from '../../queryKeys'

export const useConfigService = (
  useErrorBoundary = true
): UseQueryResult<ConfigService> => {
  const { configServiceFactory } = useServiceFactory()
  return useQuery(CONFIG_SERVICE_KEY, configServiceFactory, {
    useErrorBoundary,
    onError: message.error,
    // FIXME Why 1? can be set to false if want to disable
    retry: 1
  })
}
