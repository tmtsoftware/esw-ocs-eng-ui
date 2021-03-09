import { AgentStatus, ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { AGENTS_STATUS_KEY } from '../../queryKeys'
import { useSMService } from './useSMService'

export const useAgentsStatus = (): UseQueryResult<AgentStatus[], unknown> => {
  const { data: smService } = useSMService(false)

  return useQuery(
    AGENTS_STATUS_KEY,
    async () => {
      const agentStatus = await smService?.getAgentStatus()
      if (agentStatus?._type === 'Success') {
        if (agentStatus.seqCompsWithoutAgent.length === 0) {
          return agentStatus.agentStatus
        }
        const unknownAgentData: AgentStatus = {
          agentId: new ComponentId(Prefix.fromString('ESW.unknown'), 'Machine'),
          seqCompsStatus: agentStatus.seqCompsWithoutAgent
        }
        return [...agentStatus.agentStatus, unknownAgentData]
      }
      return []
    },
    {
      // The query will not execute until the smService is resolved
      enabled: !!smService
    }
  )
}