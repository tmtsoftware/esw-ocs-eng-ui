import type { AgentStatus } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useSMService } from './useSMService'

export const useSMAgentsStatus = (): UseQueryResult<AgentStatus[], unknown> => {
  const { data: smService } = useSMService(false)

  return useQuery(
    'AgentsStatus',
    async () => {
      const agentStatus = await smService?.getAgentStatus()
      if (agentStatus?._type === 'Success') {
        return agentStatus.agentStatus
      }
      return []
    },
    {
      // The query will not execute until the smService is resolved
      enabled: !!smService
    }
  )
}
