import { Prefix, StepList, ComponentId } from '@tmtsoftware/esw-ts'
import { UseQueryResult, useQuery } from 'react-query'
import { useServiceFactory } from '../../../contexts/ServiceFactoryContext'
import { OBS_MODE_SEQUENCERS } from '../../queryKeys'

export const useStepList = (
  sequencerPrefix: Prefix
): UseQueryResult<StepList | undefined> => {
  const { sequencerServiceFactory } = useServiceFactory()
  const getStepList = async () => {
    const compId = new ComponentId(sequencerPrefix, 'Sequencer')
    const sequencerService = await sequencerServiceFactory(compId)
    return await sequencerService.getSequence()
  }

  return useQuery(sequencerPrefix.toJSON(), getStepList, {
    useErrorBoundary: false,
    refetchInterval: OBS_MODE_SEQUENCERS.refetchInterval
  })
}
