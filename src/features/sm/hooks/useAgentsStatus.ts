import { AgentStatus, ComponentId, Prefix } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { useAgentService } from '../../agent/hooks/useAgentService'
import { AGENTS_STATUS } from '../../queryKeys'

export const useAgentsStatus = (): UseQueryResult<AgentStatus[], unknown> => {
  const { data: agentService } = useAgentService(false)

  return useQuery(
    AGENTS_STATUS.key,
    async () => {
      const agentStatus = await agentService?.getAgentStatus()
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
      enabled: !!agentService,
      refetchInterval: AGENTS_STATUS.refetchInterval
    }
  )
}
