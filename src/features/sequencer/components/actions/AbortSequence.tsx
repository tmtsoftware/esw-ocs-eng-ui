import { Button } from 'antd'
import React from 'react'
import { useAbortSequence } from '../../hooks/useAbortSequence'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

export const AbortSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const abortAction = useAbortSequence(prefix)

  return (
    <Button
      danger
      loading={abortAction.isLoading}
      onClick={() => sequencerService && abortAction.mutate(sequencerService)}
      disabled={!sequencerState || sequencerState !== 'Running'}>
      Abort sequence
    </Button>
  )
}
