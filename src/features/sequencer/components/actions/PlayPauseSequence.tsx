import React from 'react'
import type { SequencerProps } from '../Props'
import { PauseSequence } from './PauseSequence'
import { ResumeSequence } from './ResumeSequence'
import { StartSequence } from './StartSequence'

export const PlayPauseSequence = ({
  prefix,
  sequencerState,
  isPaused
}: SequencerProps & { isPaused: boolean }): JSX.Element => {
  const isSequencerRunning = sequencerState === 'Running'
  const canBePaused = isSequencerRunning && !isPaused

  if (canBePaused) return <PauseSequence prefix={prefix} />

  return sequencerState === 'Loaded' ? (
    <StartSequence prefix={prefix} sequencerState={sequencerState} />
  ) : (
    <ResumeSequence prefix={prefix} isSequencerRunning={isSequencerRunning} />
  )
}
