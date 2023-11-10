import {useQuery} from '@tanstack/react-query'
import type {UseQueryResult} from '@tanstack/react-query'
import {PekkoConnection, Prefix} from '@tmtsoftware/esw-ts'
import type {Location} from '@tmtsoftware/esw-ts'
import {useLocationService} from '../../../contexts/LocationServiceContext'
import {SEQUENCER_LOCATION} from '../../queryKeys'

export const useSequencerLocation = (prefix: Prefix): UseQueryResult<Location> => {
  const locationService = useLocationService()
  return useQuery(
    {
      queryKey: [SEQUENCER_LOCATION.key, prefix.toJSON()],
      queryFn: () => locationService.find(PekkoConnection(prefix, 'Sequencer'))
    }
  )
}
