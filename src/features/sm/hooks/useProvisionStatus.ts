import type { AgentService } from '@tmtsoftware/esw-ts'
import { useAgentService } from '../../../contexts/AgentServiceContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { PROVISION_STATUS } from '../../queryKeys'

const checkAnySequenceComponentRunning = async (agentService: AgentService) => {
  const agentStatus = await agentService.getAgentStatus()

  return (
    agentStatus._type === 'Success' &&
    (agentStatus.seqCompsWithoutAgent.length > 0 ||
      agentStatus.agentStatus.some((x) => x.seqCompsStatus.length > 0))
  )
}

export const useProvisionStatus = (
  useErrorBoundary = true
): UseQueryResult<boolean> => {
  const [agentService] = useAgentService()

  return useQuery(
    PROVISION_STATUS.key,
    async () => agentService && checkAnySequenceComponentRunning(agentService),
    { useErrorBoundary, enabled: !!agentService }
  )
}
