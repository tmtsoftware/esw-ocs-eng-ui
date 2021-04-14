import type { Prefix } from '@tmtsoftware/esw-ts'
import { locationService } from '../../../contexts/ServiceFactoryContext'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { LIST_AGENTS } from '../../queryKeys'

export const useAgentsList = (): UseQueryResult<Prefix[]> => {
  const getAllAgentPrefix = async () => {
    const agents = await locationService.listByComponentType('Machine')
    return agents.map((l) => l.connection.prefix)
  }

  return useQuery(LIST_AGENTS.key, getAllAgentPrefix)
}
