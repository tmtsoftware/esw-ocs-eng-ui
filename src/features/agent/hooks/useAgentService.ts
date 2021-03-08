import type { AgentService } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { AGENT_SERVICE_KEY } from '../../queryKeys'

export const useAgentService = (): UseQueryResult<AgentService> => {
  const { agentServiceFactory } = useServiceFactory()
  return useQuery(AGENT_SERVICE_KEY, agentServiceFactory, {
    useErrorBoundary: true,
    // FIXME Why 1? can be set to false if want to disable
    retry: 1
  })
}
