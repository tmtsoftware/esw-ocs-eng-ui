import React from 'react'
import type { SequencerProps } from '../Props'
import { PauseSequence } from './PauseSequence'
import { PlaySequence } from './PlaySequence'

export const PlayPauseSequence = ({
  prefix,
  sequencerState,
  isPaused
}: SequencerProps & { isPaused: boolean }): JSX.Element => {
  const canBePaused = sequencerState === 'Running' && !isPaused

  return canBePaused ? (
    <PauseSequence prefix={prefix} sequencerState={sequencerState} />
  ) : (
    <PlaySequence prefix={prefix} sequencerState={sequencerState} />
  )
}
