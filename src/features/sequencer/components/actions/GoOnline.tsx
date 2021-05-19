import { Button } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import type { GoOnlineResponse, SequencerService } from '@tmtsoftware/esw-ts'

const useGoOnlineAction = (): UseMutationResult<
  GoOnlineResponse,
  unknown,
  SequencerService
> => {
  const mutationFn = (sequencerService: SequencerService) =>
    sequencerService.goOnline()

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res._type === 'Ok')
        return successMessage('Sequencer is online successfully')
      return errorMessage(
        'Sequencer failed to go Online',
        Error(res._type === 'GoOnlineHookFailed' ? res._type : res.msg)
      )
    },
    onError: (e) => errorMessage('Sequencer failed to go Online', e)
  })
}

export const GoOnline = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const goOnlineAction = useGoOnlineAction()

  const goOnline = () =>
    sequencerService && goOnlineAction.mutate(sequencerService)

  return (
    <Button
      disabled={!sequencerState || sequencerState === 'Running'}
      loading={goOnlineAction.isLoading}
      onClick={() => goOnline()}>
      Go online
    </Button>
  )
}
