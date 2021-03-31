import type {
  ObsModeDetails,
  SequenceManagerService,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { groupBy } from '../../../utils/groupBy'
import { errorMessage } from '../../../utils/message'
import { OBS_MODES_DETAILS } from '../../queryKeys'
import { useSMService } from './useSMService'

const getObsModesDetails = async (smService: SequenceManagerService) => {
  const response = await smService?.getObsModesDetails()
  if (response?._type === 'Failed') {
    return errorMessage(response.msg)
  }
  if (response?._type === 'LocationServiceError') {
    return errorMessage(response.reason)
  }
  return groupBy(response?.obsModes, (x) => x.status._type)
}

export const useObsModesDetails = (): UseQueryResult<
  Map<'Configured' | 'Configurable' | 'NonConfigurable', ObsModeDetails[]>
> => {
  const { data: smService } = useSMService(false)

  return useQuery(
    OBS_MODES_DETAILS.key,
    () => smService && getObsModesDetails(smService),
    {
      // The query will not execute until the smService is resolved
      enabled: !!smService,
      refetchInterval: OBS_MODES_DETAILS.refetchInterval
    }
  )
}

export const useRunningResources = (): Subsystem[] => {
  const { data } = useObsModesDetails()
  return [
    ...new Set(data && data.get('Configured')?.flatMap((x) => x.resources))
  ]
}
