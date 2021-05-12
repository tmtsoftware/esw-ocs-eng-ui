import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'
import { useQuery, UseQueryResult } from '../../../hooks/useQuery'
import { SEQUENCER_STATE } from '../../queryKeys'
import { useSequencerService } from './useSequencerService'

export const useSequencerState = <E>(
  sequencerPrefix: Prefix,
  enabled = true,
  onError?: (err: E) => void
): UseQueryResult<SequencerStateResponse> => {
  const sequencerService = useSequencerService(sequencerPrefix)

  return useQuery(
    [SEQUENCER_STATE.key, sequencerPrefix.toJSON()],
    () => sequencerService?.getSequencerState(),
    {
      onError,
      enabled: !!sequencerService && enabled,
      refetchInterval: SEQUENCER_STATE.refetchInterval
    }
  )
}

export const useSequencerDetails = (
  sequencerPrefix: Prefix
): SequencerStateResponse | undefined => {
  const [sequencerStateResponse, setSequencerStateResponse] = useState<
    SequencerStateResponse | undefined
  >(undefined)

  const sequencerService = useSequencerService(sequencerPrefix)
  if (!sequencerService) throw Error('sequencer not found')

  const subscribeState = useCallback(
    (onEvent: (sequencerStateResponse: SequencerStateResponse) => void) =>
      sequencerService.subscribeSequencerState()(onEvent),
    [sequencerService]
  )
  useStream({
    mapper: (sequencerStateResponse: SequencerStateResponse) => {
      setSequencerStateResponse(sequencerStateResponse)
    },
    run: subscribeState
  })

  return sequencerStateResponse
}
