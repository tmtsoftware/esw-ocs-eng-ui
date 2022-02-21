import type { Sequence } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React, { useState } from 'react'
import { useLoadAction } from '../../hooks/useLoadAction'
import { useSequencerService } from '../../hooks/useSequencerService'
import { loadSequenceConstants } from '../../sequencerConstants'
import type { SequencerProps } from '../Props'
import { UploadSequence } from '../UploadSequence'

type LoadSequenceProps = Omit<SequencerProps, 'isSequencerRunning'>

export const LoadSequence = ({ prefix, sequencerState }: LoadSequenceProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const [sequence, setSequence] = useState<Sequence>()
  const loadSequenceAction = useLoadAction(sequence)

  const request = () => sequencerService && loadSequenceAction.mutate(sequencerService)

  return (
    <UploadSequence setSequence={setSequence} request={request} uploadErrorMsg={loadSequenceConstants.failureMessage}>
      <Button
        type='primary'
        loading={loadSequenceAction.isLoading}
        role={'LoadSequence'}
        disabled={!sequencerState || !(sequencerState === 'Idle' || sequencerState === 'Loaded')}>
        {loadSequenceConstants.buttonText}
      </Button>
    </UploadSequence>
  )
}
