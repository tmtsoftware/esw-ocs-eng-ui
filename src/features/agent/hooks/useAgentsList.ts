import type { Prefix } from '@tmtsoftware/esw-ts'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { LIST_AGENTS } from '../../queryKeys'

export const useAgentsList = (): UseQueryResult<Prefix[]> => {
  const { locationServiceFactory } = useServiceFactory()
  const getAllAgentPrefix = async () => {
    console.log('**************** In here')
    const agents = await locationServiceFactory().listByComponentType('Machine')
    return agents.map((l) => l.connection.prefix)
  }

  return useQuery(LIST_AGENTS.key, getAllAgentPrefix)
}
