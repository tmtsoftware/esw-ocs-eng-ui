import React from 'react'
import { GoOffline } from './GoOffline'
import { GoOnline } from './GoOnline'
import type { SequencerProps } from '../Props'

export const LifecycleState = ({ prefix, sequencerState }: SequencerProps): React.JSX.Element => {
  return sequencerState === 'Offline' ? (
    <GoOnline prefix={prefix} sequencerState={sequencerState} />
  ) : (
    <GoOffline prefix={prefix} sequencerState={sequencerState} />
  )
}
