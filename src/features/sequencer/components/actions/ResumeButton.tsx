import type { SequencerService } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'

const resume = async (sequencerService: SequencerService) => {
  const res = await sequencerService.resume()
  switch (res._type) {
    case 'Ok':
      return res
    case 'Unhandled':
      throw new Error(res.msg)
  }
}

const ResumeButton = ({ obsMode }: { obsMode: string }): JSX.Element => {
  const sequencerService = useSequencerService(obsMode, false)

  const resumeAction = useMutation({
    mutationFn: resume,
    onSuccess: () => successMessage('Successfully resumed sequencer'),
    onError: (e) => errorMessage('Failed to resume sequencer', e)
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
