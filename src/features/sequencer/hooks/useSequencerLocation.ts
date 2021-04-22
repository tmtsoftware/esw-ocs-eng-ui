import { AkkaConnection, Prefix, Location } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from 'react-query'
import { useLocationService } from '../../../contexts/LocationServiceContext'

export const useSequencerLocation = (
  prefix: Prefix
): UseQueryResult<Location> => {
  const locationService = useLocationService()
  return useQuery([prefix.toJSON()], {
    queryFn: () => locationService.find(AkkaConnection(prefix, 'Sequencer'))
  })
}
