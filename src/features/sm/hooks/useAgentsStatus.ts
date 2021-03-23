import {
  AgentStatus,
  AgentStatusSuccess,
  ComponentId,
  Prefix
} from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { useAgentService } from '../../agent/hooks/useAgentService'
import { AGENTS_STATUS } from '../../queryKeys'

const unknownAgent = new ComponentId(
  Prefix.fromString('ESW.unknown'),
  'Machine'
)

const assignUnknownAgents = (agentStatus: AgentStatusSuccess) => {
  if (agentStatus.seqCompsWithoutAgent.length === 0) {
    return agentStatus.agentStatus
  }
  const unknownAgentData: AgentStatus = {
    agentId: unknownAgent,
    seqCompsStatus: agentStatus.seqCompsWithoutAgent
  }
  return [...agentStatus.agentStatus, unknownAgentData]
}

export const useAgentsStatus = (): UseQueryResult<AgentStatus[], unknown> => {
  const { data: agentService } = useAgentService(false)

  return useQuery(
    AGENTS_STATUS.key,
    async () => {
      const agentStatus = await agentService?.getAgentStatus()
      return agentStatus?._type === 'Success'
        ? assignUnknownAgents(agentStatus)
        : []
    },
    {
      enabled: !!agentService,
      refetchInterval: AGENTS_STATUS.refetchInterval
    }
  )
}
