import type { SequencerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'

const pause = async (sequencerService: SequencerService) => {
  const res = await sequencerService.pause()
  switch (res._type) {
    case 'Ok':
      return res
    case 'Unhandled':
      throw new Error(res.msg)
    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error('Cannot operate on in progress or finished step')
  }
}

const PauseButton = ({ obsMode }: { obsMode: string }): JSX.Element => {
  const sequencerService = useSequencerService(obsMode, false)

  const pauseAction = useMutation({
    mutationFn: pause,
    onSuccess: () => successMessage('Successfully paused sequencer.'),
    onError: (e) => errorMessage('Failed to pause sequencer', e)
  })

  return (
    <Button
      disabled={sequencerService.isLoading || sequencerService.isError}
      loading={pauseAction.isLoading}
      onClick={() =>
        sequencerService.data && pauseAction.mutateAsync(sequencerService.data)
      }>
      Pause
    </Button>
  )
}

export default PauseButton
