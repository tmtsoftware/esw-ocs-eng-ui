import type { SequencerService } from '@tmtsoftware/esw-ts'
import React from 'react'
import { useSequencerService } from '../../hooks/useSequencerService'
import { ActionButton } from './ActionButton'

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

export const PauseButton = ({ obsMode }: { obsMode: string }): JSX.Element => {
  const sequencerService = useSequencerService(obsMode, false)

  return (
    <ActionButton
      title='Pause'
      queryResult={sequencerService}
      onClick={pause}
    />
  )
}
