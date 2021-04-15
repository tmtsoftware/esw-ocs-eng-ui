import { ObsMode, Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import React from 'react'
import { OBS_MODE_STATUS, OBS_MODES_DETAILS } from '../../../queryKeys'
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

export const PauseButton = ({ obsMode }: { obsMode: ObsMode }): JSX.Element => {
  const masterSequencer = new Prefix('ESW', obsMode.name)
  const sequencerService = useSequencerService(masterSequencer, false)

  return (
    <ActionButton
      title='Pause'
      queryResult={sequencerService}
      onClick={pause}
      invalidateKeysOnSuccess={[
        OBS_MODES_DETAILS.key,
        OBS_MODE_STATUS(obsMode).key
      ]}
    />
  )
}
