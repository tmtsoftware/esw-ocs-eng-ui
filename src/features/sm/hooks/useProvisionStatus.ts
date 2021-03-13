import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { PROVISION_STATUS_KEY } from '../../queryKeys'
import { useSMService } from './useSMService'

export const useProvisionStatus = (
  useErrorBoundary = true
): UseQueryResult<boolean> => {
  const { data: smService } = useSMService(useErrorBoundary)

  return useQuery(
    PROVISION_STATUS_KEY,
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
