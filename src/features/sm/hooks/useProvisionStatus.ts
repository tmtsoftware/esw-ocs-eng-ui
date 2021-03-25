import type { AgentService } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { useAgentService } from '../../agent/hooks/useAgentService'
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
  const { data: agentService } = useAgentService(useErrorBoundary)

  return useQuery(
    PROVISION_STATUS.key,
    async () => agentService && checkAnySequenceComponentRunning(agentService),
    { useErrorBoundary, enabled: !!agentService }
  )
}
