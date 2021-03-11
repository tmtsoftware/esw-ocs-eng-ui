import type { SequencerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useAction } from '../../../common/hooks/useAction'
import { errorMessage, successMessage } from '../../../common/message'
import { useSequencerService } from '../../hooks/useSequencerService'

const PauseButton = ({ obsMode }: { obsMode: string }): JSX.Element => {
  const sequencerService = useSequencerService(obsMode)
  const pauseAction = useAction({
    mutationFn: async (sequencerService: SequencerService) => {
      sequencerService.pause()
    },
    onSuccess: () => successMessage('Successfully paused'),
    onError: () => errorMessage('Failed to pause sequencer')
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
