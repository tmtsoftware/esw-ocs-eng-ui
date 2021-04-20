import { Sequence, SequenceCommand } from '@tmtsoftware/esw-ts'
import { Button, Upload } from 'antd'
import React, { useState } from 'react'
import { useLoadAction } from '../../hooks/useLoadAction'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

export const LoadSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const [sequence, setSequence] = useState<SequenceCommand[]>()
  const loadSequenceAction = useLoadAction(prefix, sequence)

  const beforeUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSequence(Sequence.fromString(reader.result).commands)
          resolve()
        }
      }
    })
  }

  const request = () => {
    sequencerService && loadSequenceAction.mutate(sequencerService)
  }

  return (
    <Upload
      beforeUpload={beforeUpload}
      customRequest={request}
      showUploadList={false}>
      <Button
        type='primary'
        disabled={
          !sequencerState ||
          !(sequencerState === 'Idle' || sequencerState === 'Loaded')
        }>
        Load Sequence
      </Button>
    </Upload>
  )
}
