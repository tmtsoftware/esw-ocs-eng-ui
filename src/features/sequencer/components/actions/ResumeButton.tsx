import type { SequencerService } from '@tmtsoftware/esw-ts'
import React from 'react'
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

export const ResumeButton = ({ obsMode }: { obsMode: string }): JSX.Element => {
  const sequencerService = useSequencerService(obsMode, false)
  return (
    <ActionButton
      title='Resume'
      queryResult={sequencerService}
      onClick={resume}
    />
  )
}
