import type { AgentService } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'

export const useAgentService = (): UseQueryResult<AgentService> => {
  const { agentServiceFactory } = useServiceFactory()
  return useQuery('agentService', agentServiceFactory, {
    useErrorBoundary: true,
    // FIXME Why 1? can be set to false if want to disable
    retry: 1
  })
}
