import type { Prefix } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { LIST_AGENTS_KEY } from '../../queryKeys'

export const useAgents = (): UseQueryResult<Prefix[]> => {
  const { locationServiceFactory } = useServiceFactory()
  const getAllAgentPrefix = async () => {
    const agents = await locationServiceFactory().listByComponentType('Machine')
    return agents.map((l) => l.connection.prefix)
  }

  return useQuery(LIST_AGENTS_KEY, getAllAgentPrefix)
}
