import { useQuery, UseQueryResult } from 'react-query'
import { ProvisionActionQueryKey } from '../hooks/useProvisionAction'
import { useSMService } from './useSMService'

export const useProvisionStatus = (
  useErrorBoundary = true
): UseQueryResult<boolean> => {
  const { data: smService } = useSMService()

  return useQuery(
    ProvisionActionQueryKey,
    async () => {
      const agentStatus = await smService?.getAgentStatus()

      return (
        agentStatus?._type == 'Success' &&
        agentStatus.agentStatus.length > 0 &&
        agentStatus.agentStatus.some((x) => {
          return x.seqCompsStatus.length > 0
        })
      )
    },
    { useErrorBoundary, enabled: !!smService }
  )
}
