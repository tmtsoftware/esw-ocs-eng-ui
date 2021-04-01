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

export type GroupedObsModeDetails = {
  Configured: ObsModeDetails[]
  Configurable: ObsModeDetails[]
  NonConfigurable: ObsModeDetails[]
}

const getObsModesDetails = async (
  smService: SequenceManagerService
): Promise<GroupedObsModeDetails> => {
  const response = await smService?.getObsModesDetails()
  if (response?._type === 'Failed') return errorMessage(response.msg)
  if (response?._type === 'LocationServiceError')
    return errorMessage(response.reason)

  const grouped = groupBy(response?.obsModes, (x) => x.status._type)
  return {
    Configured: grouped.get('Configured') || [],
    Configurable: grouped.get('Configurable') || [],
    NonConfigurable: grouped.get('NonConfigurable') || []
  }
}

export const useObsModesDetails = (): UseQueryResult<GroupedObsModeDetails> => {
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
  return [...new Set(data && data.Configured.flatMap((om) => om.resources))]
}
