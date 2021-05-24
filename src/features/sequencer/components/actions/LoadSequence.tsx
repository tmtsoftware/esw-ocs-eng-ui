import {
  OkOrUnhandledResponse,
  Sequence,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Button, Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

const errorMessagePrefix = 'Failed to load the sequence'

const useLoadAction = (
  sequence?: SequenceCommand[]
): UseMutationResult<
  OkOrUnhandledResponse | undefined,
  unknown,
  SequencerService
> => {
  const mutationFn = async (sequencerService: SequencerService) =>
    sequence && (await sequencerService.loadSequence(sequence))

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res?._type === 'Ok')
        return successMessage('Sequence has been loaded successfully')
      return errorMessage(errorMessagePrefix, Error(res?.msg))
    },
    onError: (e) => errorMessage(errorMessagePrefix, e)
  })
}
type LoadSequenceProps = Omit<SequencerProps, 'isSequencerRunning'>

export const LoadSequence = ({
  prefix,
  sequencerState
}: LoadSequenceProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const [sequence, setSequence] = useState<SequenceCommand[]>()
  const loadSequenceAction = useLoadAction(sequence)

  const beforeUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onerror = () => errorMessage(errorMessagePrefix, reader.error)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          try {
            const sequence = Sequence.fromString(reader.result)
            setSequence(sequence.commands)
            resolve()
          } catch (e) {
            errorMessage(errorMessagePrefix, e).then(resolve)
          }
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
        loading={loadSequenceAction.isLoading}
        role={'LoadSequence'}
        disabled={
          !sequencerState ||
          !(sequencerState === 'Idle' || sequencerState === 'Loaded')
        }>
        Load Sequence
      </Button>
    </Upload>
  )
}
