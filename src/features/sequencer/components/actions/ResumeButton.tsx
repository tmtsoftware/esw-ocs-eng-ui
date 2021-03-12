import type { SequencerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useAction } from '../../../common/hooks/useAction'
import { errorMessage, successMessage } from '../../../common/message'
import { useSequencerService } from '../../hooks/useSequencerService'

const ResumeButton = ({ obsMode }: { obsMode: string }): JSX.Element => {
  const sequencerService = useSequencerService(obsMode)

  const resumeAction = useAction({
    mutationFn: async (sequencerService: SequencerService) => {
      sequencerService.resume().then((res) => {
        switch (res._type) {
          case 'Ok':
            return res
          case 'Unhandled':
            throw new Error(res.msg)
        }
      })
    },
    onSuccess: () => successMessage('Successfully resumed sequencer'),
    onError: (e) => errorMessage('Failed to resume sequencer :', e)
  })

  return (
    <Button
      disabled={sequencerService.isLoading || sequencerService.isError}
      loading={resumeAction.isLoading}
      onClick={() =>
        sequencerService.data && resumeAction.mutateAsync(sequencerService.data)
      }>
      Resume
    </Button>
  )
}

export default ResumeButton
