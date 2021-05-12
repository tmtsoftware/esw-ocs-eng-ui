import { useCallback, useState } from 'react'
import { useStream } from '../../../hooks/useStream'
import { useSequencerService } from './useSequencerService'
import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'

export const useSequencerDetails = (
  sequencerPrefix: Prefix
): SequencerStateResponse | undefined => {
  const [sequencerStateResponse, setSequencerStateResponse] = useState<
    SequencerStateResponse | undefined
  >(undefined)

  console.log('using sequencer service:')
  const sequencerService = useSequencerService(sequencerPrefix)
  if (!sequencerService) throw Error('sequencer not found sorry')

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
