import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../../contexts/serviceFactoryContext/ServiceFactoryContext'
import { ProvisionActionQueryKey } from '../../hooks/useProvisionAction'

export const useProvisionStatus = (
  useErrorBoundary = true
): UseQueryResult<boolean> => {
  const { smServiceFactory } = useServiceFactory()

  return useQuery(
    ProvisionActionQueryKey,
    async () => {
      //Fixme: useMutation
      const smService = await smServiceFactory(() => undefined)
      const agentStatus = await smService.getAgentStatus()

      return (
        agentStatus._type == 'Success' &&
        agentStatus.agentStatus.length > 0 &&
        agentStatus.agentStatus.some((x) => {
          return x.seqCompsStatus.length > 0
        })
      )
    },
    { useErrorBoundary }
  )
}
