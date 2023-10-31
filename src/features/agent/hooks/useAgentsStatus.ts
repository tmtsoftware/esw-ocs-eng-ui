import type { UseQueryResult } from '@tanstack/react-query'
import { ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import type { AgentStatus, AgentStatusSuccess } from '@tmtsoftware/esw-ts'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useQuery } from '../../../hooks/useQuery'
import { AGENTS_STATUS } from '../../queryKeys'

export const UNKNOWN_AGENT = new ComponentId(new Prefix('ESW', 'Standalone'), 'Machine')

const assignUnknownAgents = (agentStatus: AgentStatusSuccess) => {
  if (agentStatus.seqCompsWithoutAgent.length === 0) {
    return agentStatus.agentStatus
  }
  const unknownAgentData: AgentStatus = {
    agentId: UNKNOWN_AGENT,
    seqCompsStatus: agentStatus.seqCompsWithoutAgent
  }
  return [...agentStatus.agentStatus, unknownAgentData]
}

export const useAgentsStatus = (): UseQueryResult<AgentStatus[], unknown> => {
  const [agentService] = useAgentService()

  return useQuery(
    [AGENTS_STATUS.key],
    async () => {
      const agentStatus = await agentService?.getAgentStatus()
      return agentStatus?._type === 'Success' ? assignUnknownAgents(agentStatus) : []
    },
    {
      enabled: !!agentService,
      refetchInterval: AGENTS_STATUS.refetchInterval
    }
  )
}
