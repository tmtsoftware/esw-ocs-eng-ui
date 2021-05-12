import { useCallback } from 'react'
import { useStream } from '../../../hooks/useStream'
import { useSequencerService } from './useSequencerService'
import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'

const onEvent = (sequencerStateResponse: SequencerStateResponse) =>
  sequencerStateResponse

export const useSequencerDetails = (
  sequencerPrefix: Prefix
): [SequencerStateResponse | undefined, boolean] => {
  console.log('using sequencer service:')
  const sequencerService = useSequencerService(sequencerPrefix)
  if (!sequencerService) throw Error('sequencer not found sorry')

  const subscribeState = useCallback(
    (onEvent: (sequencerStateResponse: SequencerStateResponse) => void) =>
      sequencerService.subscribeSequencerState()(onEvent),
    []
  )

  return useStream({
    mapper: onEvent,
    run: subscribeState
  })
}
