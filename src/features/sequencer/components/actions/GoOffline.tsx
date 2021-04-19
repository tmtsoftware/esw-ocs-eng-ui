import { Button } from 'antd'
import React from 'react'
import { useGoOfflineAction } from '../../hooks/useGoOfflineAction'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

export const GoOffline = ({ prefix }: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const goOfflineAction = useGoOfflineAction(prefix)

  const goOffline = () =>
    sequencerService && goOfflineAction.mutate(sequencerService)

  return <Button onClick={() => goOffline()}>Go offline</Button>
}
