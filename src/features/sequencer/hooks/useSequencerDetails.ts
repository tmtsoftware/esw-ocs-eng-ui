import { useCallback } from 'react'
import { useStream } from '../../../hooks/useStream'
import { useSequencerService } from './useSequencerService'
import type { Prefix, SequencerStateResponse } from '@tmtsoftware/esw-ts'

export const useSequencerDetails = (
  sequencerPrefix: Prefix
): [SequencerStateResponse | undefined, boolean] => {
  console.log('using sequencer service:')
  const sequencerService = useSequencerService(sequencerPrefix)
  if (!sequencerService) throw Error('sequencer not found')

  const subscribeState = useCallback(
    (onEvent: (sequencerStateResponse: SequencerStateResponse) => void) =>
      sequencerService.subscribeSequencerState()(onEvent),
    []
  )

  const onEvent = useCallback(
    (sequencerStateResponse: SequencerStateResponse) => sequencerStateResponse,
    []
  )

  return useStream({
    mapper: onEvent,
    run: subscribeState
  })
}
