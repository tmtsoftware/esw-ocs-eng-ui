import type { AgentService } from '@tmtsoftware/esw-ts'
import type { UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/serviceFactoryContext/ServiceFactoryContext'
import { useService } from '../../common/hooks/useService'

export const useAgentService = (): UseQueryResult<AgentService> => {
  const { agentServiceFactory } = useServiceFactory()
  return useService('agentService', agentServiceFactory)
}
