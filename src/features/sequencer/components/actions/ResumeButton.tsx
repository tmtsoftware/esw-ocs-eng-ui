import { ObsMode, Prefix, SequencerService } from '@tmtsoftware/esw-ts'
import React from 'react'
import { OBS_MODE_STATUS, OBS_MODES_DETAILS } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import { ActionButton } from './ActionButton'

const resume = async (sequencerService: SequencerService) => {
  const res = await sequencerService.resume()
  switch (res._type) {
    case 'Ok':
      return res
    case 'Unhandled':
      throw new Error(res.msg)
  }
}

export const ResumeButton = ({
  obsMode
}: {
  obsMode: ObsMode
}): JSX.Element => {
  const masterSequencer = new Prefix('ESW', obsMode.name)
  const sequencerService = useSequencerService(masterSequencer, false)
  return (
    <ActionButton
      title='Resume'
      queryResult={sequencerService}
      onClick={resume}
      invalidateKeysOnSuccess={[
        OBS_MODES_DETAILS.key,
        OBS_MODE_STATUS(obsMode).key
      ]}
    />
  )
}
