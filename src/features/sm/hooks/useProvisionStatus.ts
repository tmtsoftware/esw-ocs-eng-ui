import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { useAgentService } from '../../agent/hooks/useAgentService'
import { PROVISION_STATUS } from '../../queryKeys'

export const useProvisionStatus = (
  useErrorBoundary = true
): UseQueryResult<boolean> => {
  const { data: smService } = useAgentService(useErrorBoundary)

  return useQuery(
    PROVISION_STATUS.key,
    async () => {
      const agentStatus = await smService?.getAgentStatus()

      return (
        agentStatus?._type == 'Success' &&
        (agentStatus.seqCompsWithoutAgent.length > 0 ||
          (agentStatus.agentStatus.length > 0 &&
            agentStatus.agentStatus.some((x) => {
              return x.seqCompsStatus.length > 0
            })))
      )
    },
    { useErrorBoundary, enabled: !!smService }
  )
}
