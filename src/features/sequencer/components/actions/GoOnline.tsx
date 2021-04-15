import { Button } from 'antd'
import React from 'react'
import { useGoOnlineAction } from '../../hooks/useGoOnlineAction'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

export const GoOnline = ({ prefix }: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const goOnlineAction = useGoOnlineAction(prefix)

  const goOnline = () =>
    sequencerService.data && goOnlineAction.mutate(sequencerService.data)

  return <Button onClick={() => goOnline()}>Go online</Button>
}
