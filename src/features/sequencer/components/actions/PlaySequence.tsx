import React from 'react'
import type { SequencerProps } from '../Props'
import { ResumeSequence } from './ResumeSequence'
import { StartSequence } from './StartSequence'

export const PlaySequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  return sequencerState === 'Loaded' ? (
    <StartSequence prefix={prefix} sequencerState={sequencerState} />
  ) : (
    <ResumeSequence prefix={prefix} sequencerState={sequencerState} />
  )
}
