import React from 'react'
import type { SequencerProps } from '../Props'
import { PauseSequence } from './PauseSequence'
import { PlaySequence } from './PlaySequence'

export const PlayPauseSequence = ({
  prefix,
  isSequencerRunning,
  sequencerState,
  isPaused
}: SequencerProps & { isPaused: boolean }): JSX.Element => {
  const canBePaused = isSequencerRunning && !isPaused

  return canBePaused ? (
    <PauseSequence prefix={prefix} />
  ) : (
    <PlaySequence prefix={prefix} isSequencerRunning={isSequencerRunning} sequencerState={sequencerState} />
  )
}
