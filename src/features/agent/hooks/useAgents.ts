import type { Prefix } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/serviceFactoryContext/ServiceFactoryContext'

export const useAgents = (): UseQueryResult<Prefix[]> => {
  const { locationServiceFactory } = useServiceFactory()
  const getAllAgentPrefix = async () => {
    const agents = await locationServiceFactory().listByComponentType('Machine')
    return agents.map((l) => l.connection.prefix)
  }

  return useQuery('listAgents', getAllAgentPrefix)
}
