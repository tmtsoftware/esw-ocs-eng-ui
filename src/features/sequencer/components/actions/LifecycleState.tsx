import React from 'react'
import { useSequencerState } from '../../hooks/useSequencerState'
import type { SequencerProps } from '../Props'
import { GoOffline } from './GoOffline'
import { GoOnline } from './GoOnline'

export const LifecycleState = ({ prefix }: SequencerProps): JSX.Element => {
  const sequencerState = useSequencerState(prefix)

  return sequencerState.data?._type === 'Offline' ? (
    <GoOnline prefix={prefix} />
  ) : (
    <GoOffline prefix={prefix} />
  )
}
