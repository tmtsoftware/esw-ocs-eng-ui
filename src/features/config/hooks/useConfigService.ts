import type { ConfigService } from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import type { UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useService } from '../../common/hooks/useService'

export const useConfigService = (
  useErrorBoundary = true
): UseQueryResult<ConfigService> => {
  const { configServiceFactory } = useServiceFactory()
  return useService(
    'configService',
    configServiceFactory,
    useErrorBoundary,
    message.error
  )
}
