import type { ObsModesDetailsResponseSuccess } from '@tmtsoftware/esw-ts'
import { message } from 'antd'
import { useQuery, UseQueryResult } from 'react-query'
import { OBS_MODES_DETAILS_KEY } from '../../queryKeys'
import { useSMService } from '../hooks/useSMService'

export const useObsModesDetails = (): UseQueryResult<
  ObsModesDetailsResponseSuccess,
  unknown
> => {
  const { data: smService } = useSMService(false)

  return useQuery(
    OBS_MODES_DETAILS_KEY,
    async () => {
      const response = await smService?.getObsModesDetails()
      if (response?._type === 'Failed') {
        message.error(response.msg)
      }
      if (response?._type === 'LocationServiceError') {
        message.error(response.reason)
      }
      return response
    },
    {
      // The query will not execute until the smService is resolved
      enabled: !!smService
    }
  )
}
