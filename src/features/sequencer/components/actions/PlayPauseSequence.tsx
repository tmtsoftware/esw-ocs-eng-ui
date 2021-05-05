import React from 'react'
import { useStepList } from '../../hooks/useStepList'
import type { SequencerProps } from '../Props'
import { PauseSequence } from './PauseSequence'
import { PlaySequence } from './PlaySequence'

export const PlayPauseSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const stepList = useStepList(prefix)

  const canBePaused =
    stepList.data && sequencerState === 'Running' && !stepList.data.isPaused()

  return canBePaused ? (
    <PauseSequence prefix={prefix} sequencerState={sequencerState} />
  ) : (
    <PlaySequence prefix={prefix} sequencerState={sequencerState} />
  )
}
